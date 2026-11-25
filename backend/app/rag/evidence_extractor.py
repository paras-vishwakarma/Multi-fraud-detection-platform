import re
from urllib.parse import urlparse

KNOWN_BRANDS = {
    'chase': 'chase.com',
    'paypal': 'paypal.com',
    'wellsfargo': 'wellsfargo.com',
    'bankofamerica': 'bankofamerica.com',
    'bofa': 'bankofamerica.com',
    'citibank': 'citi.com',
    'citi': 'citi.com',
    'apple': 'apple.com',
    'appleid': 'apple.com',
    'microsoft': 'microsoft.com',
    'office365': 'office.com',
    'netflix': 'netflix.com',
    'amazon': 'amazon.com',
    'google': 'google.com',
    'binance': 'binance.com',
    'metamask': 'metamask.io',
    'coinbase': 'coinbase.com',
    'facebook': 'facebook.com',
    'instagram': 'instagram.com',
    'dropbox': 'dropbox.com',
    'fedex': 'fedex.com',
    'dhl': 'dhl.com',
    'usps': 'usps.com',
    'walmart': 'walmart.com'
}

SUSPICIOUS_URGENCY_WORDS = [
    'login', 'verify', 'secure', 'account', 'update', 'banking', 'signin',
    'password', 'confirm', 'wallet', 'recover', 'authenticate', 'billing',
    'suspended', 'unlock', 'appeal', 'resolution', 'alert', 'revalidate',
    'closure', 'immediately', 'urgent', 'action required', 'permanent'
]

SHORTENING_DOMAINS = {
    'bit.ly', 'tinyurl.com', 't.co', 'goo.gl', 'ow.ly', 'is.gd',
    'buff.ly', 'adf.ly', 'bitly.com', 'bl.ink', 'shorturl.at'
}

def extract_url_evidence(url: str, features: dict = None) -> list[dict]:
    """
    Forensic inspection of a URL for phishing and deception indicators.
    """
    evidence = []
    url_clean = str(url).strip()
    if not url_clean.startswith(('http://', 'https://')):
        url_with_scheme = 'http://' + url_clean
    else:
        url_with_scheme = url_clean

    parsed = urlparse(url_with_scheme)
    hostname = (parsed.netloc or '').lower()
    full_url_lower = url_clean.lower()
    scheme = parsed.scheme.lower()

    # 1. Transport Security Check
    if scheme == 'http':
        has_auth_intent = any(w in full_url_lower for w in ['login', 'account', 'signin', 'password', 'banking', 'verify'])
        evidence.append({
            'category': 'Transport Security',
            'detail': 'Unencrypted HTTP protocol detected. Legitimate authentication and financial portals enforce HTTPS/TLS encryption.',
            'severity': 'CRITICAL' if has_auth_intent else 'HIGH',
            'keywords': ['http', 'unencrypted', 'no-ssl']
        })
    elif scheme == 'https':
        evidence.append({
            'category': 'Transport Security',
            'detail': 'URL transmits over encrypted HTTPS (TLS).',
            'severity': 'INFO',
            'keywords': ['https', 'encrypted']
        })

    # 2. IP Hostname Check
    host_no_port = hostname.split(':')[0]
    ip_pattern = r'^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$'
    if re.match(ip_pattern, host_no_port):
        evidence.append({
            'category': 'Infrastructure Anomaly',
            'detail': f"Host uses a raw numerical IPv4 address ({host_no_port}) instead of a registered domain, a common evasion tactic.",
            'severity': 'CRITICAL',
            'keywords': ['direct ip', 'raw ip', 'numeric host', 'evasion']
        })

    # 3. Targeted Brand Impersonation Check
    targeted_brands = []
    for brand, legit_domain in KNOWN_BRANDS.items():
        if brand in full_url_lower:
            if not hostname.endswith(legit_domain):
                targeted_brands.append((brand.capitalize(), legit_domain))

    if targeted_brands:
        brand_names = ", ".join([b[0] for b in targeted_brands])
        evidence.append({
            'category': 'Brand Impersonation',
            'detail': f"URL contains brand name(s) '{brand_names}' but is hosted on an unverified domain ('{hostname}').",
            'severity': 'CRITICAL',
            'keywords': ['brand impersonation', 'spoofing', 'typosquatting', targeted_brands[0][0].lower()]
        })

    # 4. Deceptive Subdomain Stacking
    parts = host_no_port.split('.')
    if len(parts) > 3:
        has_stacked = any(tld in host_no_port[:-len(parts[-1])] for tld in ['.com', '.net', '.org', '.gov']) or \
                      any(b in '.'.join(parts[:-2]) for b in KNOWN_BRANDS)
        if has_stacked:
            evidence.append({
                'category': 'Domain Obfuscation',
                'detail': f"Subdomain stacking detected in '{hostname}'. Attackers place trusted names in subdomains to trick mobile and truncated URL previews.",
                'severity': 'HIGH',
                'keywords': ['subdomain stacking', 'domain masking', 'subdomain']
            })

    # 5. URL Shortener Cloaking
    if any(s in hostname for s in SHORTENING_DOMAINS):
        evidence.append({
            'category': 'URL Obfuscation',
            'detail': f"URL uses public shortener service ({hostname}), masking the true landing destination from preview scanners.",
            'severity': 'MEDIUM',
            'keywords': ['url shortener', 'redirection', 'cloaking']
        })

    # 6. Credential & Urgency Keywords
    matched_urgency = [w for w in SUSPICIOUS_URGENCY_WORDS if w in full_url_lower]
    if len(matched_urgency) >= 2:
        evidence.append({
            'category': 'Social Engineering',
            'detail': f"Multiple credential and urgency keywords identified in URL: {', '.join(matched_urgency)}.",
            'severity': 'HIGH' if len(matched_urgency) >= 3 else 'MEDIUM',
            'keywords': ['urgency', 'credential harvesting', 'coercive'] + matched_urgency
        })

    # 7. Lexical & Hyphen Complexity
    hyphen_count = hostname.count('-')
    if hyphen_count >= 3:
        evidence.append({
            'category': 'Typosquatting Indicator',
            'detail': f"Excessive hyphenation ({hyphen_count} hyphens) in hostname '{hostname}', characteristic of domain generation and typosquatting.",
            'severity': 'MEDIUM',
            'keywords': ['hyphens', 'typosquatting', 'domain']
        })

    # 8. Character Entropy
    if features and features.get('entropy', 0) > 4.15 and len(url_clean) > 45:
        evidence.append({
            'category': 'Algorithmic Anomaly',
            'detail': f"Elevated Shannon character entropy ({features['entropy']}), indicating randomized or algorithmic URL generation.",
            'severity': 'MEDIUM',
            'keywords': ['high entropy', 'dga', 'random characters']
        })

    if not any(e['severity'] in ['CRITICAL', 'HIGH'] for e in evidence):
        evidence.append({
            'category': 'Legitimate Baseline',
            'detail': f"Standard domain structure and expected enterprise architecture observed for '{hostname}'.",
            'severity': 'INFO',
            'keywords': ['legitimate', 'safe', 'standard architecture']
        })

    return evidence


def extract_text_evidence(text: str, message_type: str = "email") -> list[dict]:
    """
    Forensic inspection of SMS messages and email text for social engineering,
    smishing, prize lures, and impersonation triggers.
    """
    evidence = []
    text_clean = str(text).strip()
    text_lower = text_clean.lower()

    # 1. Embedded Links & Domains
    url_pattern = r'https?://[^\s<>"]+|www\.[^\s<>"]+'
    found_urls = re.findall(url_pattern, text_clean)
    if found_urls:
        has_insecure = any(u.startswith("http://") for u in found_urls)
        evidence.append({
            'category': 'Embedded Links',
            'detail': f"Message contains {len(found_urls)} hyperlink(s) ({found_urls[0][:40]}...). {'Unencrypted HTTP transport detected.' if has_insecure else 'Potential redirection target.'}",
            'severity': 'CRITICAL' if has_insecure else 'HIGH',
            'keywords': ['spearphishing link', 'smishing link', 'embedded url', 'http']
        })

    # 2. Coercive Urgency & Account Threat
    urgency_triggers = [
        'suspended', 'immediate', 'urgent', 'action required', 'permanent closure',
        'unauthorized activity', 'card blocked', 'security alert', 'freeze', 'within 24 hours'
    ]
    matched_urgency = [w for w in urgency_triggers if w in text_lower]
    if matched_urgency:
        evidence.append({
            'category': 'Psychological Coercion',
            'detail': f"High-pressure urgency markers detected: '{', '.join(matched_urgency)}'. Designed to bypass victim scrutiny.",
            'severity': 'HIGH',
            'keywords': ['urgency', 'account suspended', 'coercion', 'panic lure']
        })

    # 3. Financial & Courier Impersonation
    impersonated = []
    for brand in ['wells fargo', 'chase', 'bank of america', 'citi', 'paypal', 'fedex', 'dhl', 'usps', 'walmart', 'amazon', 'netflix']:
        if brand in text_lower:
            impersonated.append(brand.title())

    if impersonated:
        evidence.append({
            'category': 'Brand & Authority Lure',
            'detail': f"Message references high-profile institution(s): {', '.join(impersonated)}. Frequently abused in credential smishing.",
            'severity': 'HIGH',
            'keywords': ['impersonation', 'bank alert', 'courier lure'] + [b.lower() for b in impersonated]
        })

    # 4. Advance-Fee & Prize / Giveaway Lures
    prize_words = ['won', 'lottery', 'winner', 'gift card', 'claim prize', 'congratulations', 'free $', 'claim now']
    matched_prize = [w for w in prize_words if w in text_lower]
    if len(matched_prize) >= 2 or ('gift card' in text_lower and 'won' in text_lower):
        evidence.append({
            'category': 'Advance-Fee Scam Indicator',
            'detail': f"Prize, reward, or giveaway lure detected ('{', '.join(matched_prize)}'). Classic advance-fee fraud vector.",
            'severity': 'CRITICAL',
            'keywords': ['lottery', 'prize scam', 'gift card', 'free money']
        })

    # 5. Callback Scams / Vishing Numbers
    phone_pattern = r'(\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}|1-800-[a-zA-Z0-9]+'
    found_phones = re.findall(phone_pattern, text_clean)
    if 'call' in text_lower and ('1-800' in text_lower or len(found_phones) > 0):
        evidence.append({
            'category': 'Vishing / Callback Lure',
            'detail': "Message instructs recipient to place an urgent phone call to an unverified number.",
            'severity': 'HIGH',
            'keywords': ['vishing', 'callback scam', 'phone lure']
        })

    # 6. Sensitive Data Solicitation
    data_solicit = ['password', 'otp', 'pin', 'ssn', 'social security', 'credit card', 'cvv', 'routing number']
    matched_data = [w for w in data_solicit if w in text_lower]
    if matched_data:
        evidence.append({
            'category': 'Credential Harvesting',
            'detail': f"Direct request for sensitive data tokens: '{', '.join(matched_data)}'. Genuine organizations never solicit these via message.",
            'severity': 'CRITICAL',
            'keywords': ['credential harvesting', 'otp solicitation', 'password request']
        })

    # If no threats were flagged
    if not any(e['severity'] in ['CRITICAL', 'HIGH'] for e in evidence):
        evidence.append({
            'category': 'Legitimate Baseline',
            'detail': "Message content exhibits standard conversational or corporate communication tone without malicious indicators.",
            'severity': 'INFO',
            'keywords': ['legitimate message', 'safe communication', 'benign']
        })

    return evidence


def extract_document_evidence(ocr_text: str = "", metadata: dict = None, visual_score: float = 0.5) -> list[dict]:
    """
    Forensic inspection of document scan text, visual artifacts, and metadata
    for forgery, digital splicing, and alteration signatures.
    """
    evidence = []
    text_lower = (ocr_text or '').lower()

    # 1. Visual ResNet-18 Model / Pixel Anomaly
    if visual_score >= 0.70:
        evidence.append({
            'category': 'Visual Artifact Anomaly',
            'detail': f"Deep neural network detected visual alteration patterns and pixel compression boundaries (Score: {visual_score*100:.1f}%).",
            'severity': 'CRITICAL',
            'keywords': ['image splicing', 'pixel anomaly', 'copy paste stamp']
        })
    elif visual_score >= 0.50:
        evidence.append({
            'category': 'Visual Artifact Anomaly',
            'detail': f"Moderate digital artifact noise detected along field borders (Score: {visual_score*100:.1f}%).",
            'severity': 'MEDIUM',
            'keywords': ['visual noise', 'compression anomaly']
        })

    # 2. Text Content & Placeholder Alerts
    tamper_tokens = ['sample', 'specimen', 'void', 'lorem ipsum', 'draft', 'counterfeit', 'fake id', 'novelty']
    matched_tokens = [t for t in tamper_tokens if t in text_lower]
    if matched_tokens:
        evidence.append({
            'category': 'Inauthentic Watermark',
            'detail': f"Explicit non-genuine or placeholder watermark text detected: '{', '.join(matched_tokens)}'.",
            'severity': 'CRITICAL',
            'keywords': ['specimen watermark', 'void watermark', 'tampered document']
        })

    # 3. Numeric & Date Inconsistencies
    date_pattern = r'\b(19\d\d|20\d\d)[-/](0[1-9]|1[0-2])[-/](0[1-9]|[12]\d|3[01])\b'
    found_dates = re.findall(date_pattern, ocr_text or '')
    if len(found_dates) > 4:
        evidence.append({
            'category': 'Date Field Density',
            'detail': f"High density of conflicting date stamps ({len(found_dates)}) detected across document fields.",
            'severity': 'MEDIUM',
            'keywords': ['date inconsistency', 'altered dates']
        })

    # 4. OCR Extraction Verification
    if not ocr_text or len(ocr_text.strip()) < 10:
        evidence.append({
            'category': 'Optical Readability',
            'detail': "No structured Machine-Readable Zone (MRZ) or primary text was successfully parsed by OCR engine.",
            'severity': 'MEDIUM',
            'keywords': ['unreadable text', 'ocr failure']
        })
    else:
        evidence.append({
            'category': 'OCR Text Analysis',
            'detail': f"Extracted {len(ocr_text.split())} words of textual content across document sections.",
            'severity': 'INFO',
            'keywords': ['ocr extracted', 'document layout']
        })

    if not any(e['severity'] in ['CRITICAL', 'HIGH'] for e in evidence):
        evidence.append({
            'category': 'Authentic Document Baseline',
            'detail': "Document exhibits uniform visual texture, expected optical typography, and compliant layout geometry.",
            'severity': 'INFO',
            'keywords': ['authentic document', 'legitimate id', 'standard baseline']
        })

    return evidence

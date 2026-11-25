from .evidence_extractor import extract_url_evidence, extract_text_evidence, extract_document_evidence
from .retriever import retriever

def _format_kb_matches(matched_docs):
    kb_matches = []
    for doc in matched_docs:
        kb_matches.append({
            'id': doc.get('id', 'KB-GEN-01'),
            'title': doc.get('title', 'Threat Advisory'),
            'attack_vector': doc.get('attack_vector', 'Adversary Technique'),
            'mitre_technique': doc.get('mitre_technique', 'N/A'),
            'description': doc.get('description', ''),
            'recommended_actions': doc.get('recommended_actions', [])
        })
    return kb_matches


def analyze_url_with_rag(url: str, label: str, confidence_score: float, features: dict = None) -> dict:
    """RAG analysis for Phishing Websites."""
    evidence_items = extract_url_evidence(url, features)

    query_terms = []
    has_critical = any(e['severity'] == 'CRITICAL' for e in evidence_items)
    has_high = any(e['severity'] == 'HIGH' for e in evidence_items)

    for item in evidence_items:
        if item.get('severity') in ['CRITICAL', 'HIGH', 'MEDIUM']:
            query_terms.extend(item.get('keywords', []))
            query_terms.append(item.get('category', ''))

    if label.lower() == 'phishing':
        query_terms.append('phishing credential harvesting attack website')
    else:
        query_terms.append('legitimate safe baseline architecture website')

    matched_docs = retriever.retrieve(" ".join(query_terms), top_k=2)
    kb_matches = _format_kb_matches(matched_docs)

    if label.lower() == 'phishing':
        risk_level = "CRITICAL" if (has_critical or confidence_score >= 0.90) else ("HIGH" if (has_high or confidence_score >= 0.70) else "MEDIUM")
    else:
        risk_level = "SAFE" if confidence_score >= 0.90 else "LOW"

    if label.lower() == 'phishing':
        critical_details = [e['detail'] for e in evidence_items if e['severity'] in ['CRITICAL', 'HIGH']]
        primary_threat = critical_details[0] if critical_details else "suspicious domain and transport anomalies"
        mitre_ref = f" (Referencing {kb_matches[0]['id']}: {kb_matches[0]['title']})" if kb_matches else ""
        summary = (
            f"High-threat malicious landing page detected with {confidence_score*100:.1f}% confidence. "
            f"Key forensic flag: {primary_threat}. "
            f"This architecture strongly correlates with credential harvesting operations{mitre_ref}."
        )
        mitigations = [
            "DO NOT click, visit, or submit credentials, OTP tokens, or payment card information.",
            "If credentials were submitted, immediately reset passwords via the official genuine portal.",
            "Block this domain at perimeter firewalls, DNS resolvers, and endpoint secure web gateways (SWG).",
            "Report the deceptive domain to Google Safe Browsing and the hosting registrar abuse desk."
        ]
    else:
        summary = (
            f"Website passes threat heuristics with {confidence_score*100:.1f}% confidence. "
            f"The URL conforms to standard enterprise web hierarchy without known brand deception or malicious obfuscation signatures."
        )
        mitigations = [
            "Always inspect the browser address bar lock icon and verify the domain name spelling before logging in.",
            "Ensure Multi-Factor Authentication (MFA / FIDO2 security keys) is active for high-value accounts."
        ]

    return {
        'risk_level': risk_level,
        'summary': summary,
        'evidence': [{'category': e['category'], 'detail': e['detail'], 'severity': e['severity']} for e in evidence_items],
        'knowledge_base_matches': kb_matches,
        'mitigation_steps': mitigations
    }


def analyze_text_with_rag(text: str, message_type: str, label: str, confidence_score: float) -> dict:
    """RAG analysis for SMS & Email Fraud."""
    evidence_items = extract_text_evidence(text, message_type)

    query_terms = [message_type]
    has_critical = any(e['severity'] == 'CRITICAL' for e in evidence_items)
    has_high = any(e['severity'] == 'HIGH' for e in evidence_items)

    for item in evidence_items:
        if item.get('severity') in ['CRITICAL', 'HIGH', 'MEDIUM']:
            query_terms.extend(item.get('keywords', []))
            query_terms.append(item.get('category', ''))

    is_threat = label.lower() in ['potentially fraudulent', 'spam', 'fraud', 'phishing']
    if is_threat:
        query_terms.append('smishing fake bank alert prize scam lottery urgent wire transfer')
    else:
        query_terms.append('legitimate notification team calendar reminder clean communication')

    matched_docs = retriever.retrieve(" ".join(query_terms), top_k=2)
    kb_matches = _format_kb_matches(matched_docs)

    if is_threat:
        risk_level = "CRITICAL" if (has_critical or confidence_score >= 0.85) else ("HIGH" if (has_high or confidence_score >= 0.65) else "MEDIUM")
    else:
        risk_level = "SAFE" if confidence_score >= 0.85 else "LOW"

    if is_threat:
        critical_details = [e['detail'] for e in evidence_items if e['severity'] in ['CRITICAL', 'HIGH']]
        primary_threat = critical_details[0] if critical_details else "suspicious urgency patterns and impersonation lures"
        mitre_ref = f" (Referencing {kb_matches[0]['id']}: {kb_matches[0]['title']})" if kb_matches else ""
        summary = (
            f"High-confidence {message_type.upper()} social engineering attack detected ({confidence_score*100:.1f}% confidence). "
            f"Forensic flag: {primary_threat}. "
            f"Adversary intention: deceptive credential harvesting or financial advance-fee fraud{mitre_ref}."
        )
        mitigations = [
            f"DO NOT reply to this {message_type.upper()} or call back any phone numbers listed.",
            "Never tap or click embedded links in unsolicited messages claiming account suspension or prizes.",
            "Forward suspicious text messages to 7726 (SPAM) to alert your cellular telecom carrier.",
            "Verify your account status independently by opening the official app or website in a separate window."
        ]
    else:
        summary = (
            f"Message content conforms to standard legitimate {message_type.upper()} communication ({confidence_score*100:.1f}% confidence). "
            f"No deceptive urgency, fake lottery rewards, or credential-harvesting links were identified."
        )
        mitigations = [
            "Standard communication verified. Continue following normal cybersecurity awareness guidelines.",
            "Always confirm sender identity before initiating any unusual financial transfers."
        ]

    return {
        'risk_level': risk_level,
        'summary': summary,
        'evidence': [{'category': e['category'], 'detail': e['detail'], 'severity': e['severity']} for e in evidence_items],
        'knowledge_base_matches': kb_matches,
        'mitigation_steps': mitigations
    }


def analyze_document_with_rag(ocr_text: str, label: str, confidence_score: float, metadata: dict = None) -> dict:
    """RAG analysis for Document Tampering & Forgery."""
    evidence_items = extract_document_evidence(ocr_text, metadata, visual_score=confidence_score)

    query_terms = ['document']
    has_critical = any(e['severity'] == 'CRITICAL' for e in evidence_items)
    has_high = any(e['severity'] == 'HIGH' for e in evidence_items)

    for item in evidence_items:
        if item.get('severity') in ['CRITICAL', 'HIGH', 'MEDIUM']:
            query_terms.extend(item.get('keywords', []))
            query_terms.append(item.get('category', ''))

    is_threat = label.lower() in ['potentially fraudulent', 'fraudulent', 'tampered', 'forged']
    if is_threat:
        query_terms.append('document tampering image splicing altered text copy paste stamp font inconsistency')
    else:
        query_terms.append('authentic document genuine passport legitimate id uniform noise')

    matched_docs = retriever.retrieve(" ".join(query_terms), top_k=2)
    kb_matches = _format_kb_matches(matched_docs)

    if is_threat:
        risk_level = "CRITICAL" if (has_critical or confidence_score >= 0.80) else ("HIGH" if (has_high or confidence_score >= 0.60) else "MEDIUM")
    else:
        risk_level = "SAFE" if confidence_score >= 0.80 else "LOW"

    if is_threat:
        critical_details = [e['detail'] for e in evidence_items if e['severity'] in ['CRITICAL', 'HIGH']]
        primary_threat = critical_details[0] if critical_details else "digital artifact noise and optical typography discrepancies"
        mitre_ref = f" (Referencing {kb_matches[0]['id']}: {kb_matches[0]['title']})" if kb_matches else ""
        summary = (
            f"Document tampering or forgery detected with {confidence_score*100:.1f}% confidence. "
            f"Forensic observation: {primary_threat}. "
            f"The file demonstrates anomalies characteristic of digital modification or synthetic document generation{mitre_ref}."
        )
        mitigations = [
            "Do NOT accept this document for high-assurance KYC, loan approval, or official identity verification.",
            "Request an original, uncompressed certified vector PDF or a physical in-person notarized copy.",
            "Cross-verify the optical text against official registry databases (e.g. government DMV or passport registry).",
            "Conduct Error Level Analysis (ELA) and inspect character baselines across all date and numeric fields."
        ]
    else:
        summary = (
            f"Document passes visual integrity and OCR layout inspection ({confidence_score*100:.1f}% confidence). "
            f"Visual noise distributions, optical typography, and layout alignment match genuine document baseline standards."
        )
        mitigations = [
            "Document integrity verified. Archive securely in compliance with data privacy regulations.",
            "Check digital cryptographic certificate signatures if the document format is a signed PDF."
        ]

    return {
        'risk_level': risk_level,
        'summary': summary,
        'evidence': [{'category': e['category'], 'detail': e['detail'], 'severity': e['severity']} for e in evidence_items],
        'knowledge_base_matches': kb_matches,
        'mitigation_steps': mitigations
    }

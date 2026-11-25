import json
import math
import os
import re
from collections import Counter

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
KB_PATH = os.path.join(BASE_DIR, "knowledge_base.json")

class KnowledgeBaseRetriever:
    def __init__(self, kb_path: str = KB_PATH):
        self.kb_path = kb_path
        self.documents = []
        self._load_and_index()

    def _tokenize(self, text: str) -> list[str]:
        if not text:
            return []
        return re.findall(r'[a-zA-Z0-9_\-\.]+', str(text).lower())

    def _load_and_index(self):
        if not os.path.exists(self.kb_path):
            print(f"[RAG Retriever] Knowledge base file not found at {self.kb_path}")
            return

        try:
            with open(self.kb_path, 'r', encoding='utf-8') as f:
                self.documents = json.load(f)
        except Exception as e:
            print(f"[RAG Retriever] Error reading knowledge base: {e}")
            self.documents = []

        self.doc_tokens = [self._tokenize(d.get('text', '') + " " + d.get('title', '') + " " + d.get('description', '')) for d in self.documents]
        self.N = len(self.documents)

        # Compute document frequency
        self.df = Counter()
        for tokens in self.doc_tokens:
            for t in set(tokens):
                self.df[t] += 1

        # Smooth Inverse Document Frequency (IDF)
        self.idf = {t: math.log((self.N + 1) / (count + 1)) + 1.0 for t, count in self.df.items()}

    def retrieve(self, query: str, top_k: int = 2) -> list[dict]:
        """
        Retrieves the top-k most relevant knowledge base articles matching the query.
        """
        if not self.documents:
            return []

        q_tokens = self._tokenize(query)
        if not q_tokens:
            return self.documents[:top_k]

        q_vec = Counter(q_tokens)
        q_norm = math.sqrt(sum(v**2 for v in q_vec.values())) or 1.0

        scores = []
        for idx, (doc, d_tokens) in enumerate(zip(self.documents, self.doc_tokens)):
            d_vec = Counter(d_tokens)
            common = set(q_vec.keys()) & set(d_vec.keys())
            if not common:
                continue

            dot_product = sum(q_vec[t] * d_vec[t] * self.idf.get(t, 1.0) for t in common)
            d_norm = math.sqrt(sum(v**2 for v in d_vec.values())) or 1.0
            similarity = dot_product / (q_norm * d_norm)

            scores.append((similarity, doc))

        scores.sort(key=lambda x: x[0], reverse=True)

        if not scores:
            # Fallback to general baseline article
            return self.documents[:top_k]

        return [doc for _, doc in scores[:top_k]]

# Global singleton
retriever = KnowledgeBaseRetriever()

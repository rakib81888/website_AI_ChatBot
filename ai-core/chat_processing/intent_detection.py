# intent_detection.py
import re
from typing import Dict

class IntentDetector:
    def __init__(self, client_id):
        self.client_id = client_id
        self.patterns = {
            "greeting": [r"hello", r"hi", r"hey", r"good morning"],
            "goodbye": [r"bye", r"goodbye", r"see you", r"later"],
            "thanks": [r"thank you", r"thanks", r"appreciate"],
            "help": [r"help", r"support", r"assistance"],
            "purchase": [r"buy", r"purchase", r"order", r"checkout"],
            "technical": [r"bug", r"error", r"issue", r"not working"]
        }

    def detect_intent(self, message: str) -> Dict[str, float]:
        """Detect intent with confidence scores"""
        message = message.lower()
        results = {}
        
        for intent, patterns in self.patterns.items():
            score = 0
            for pattern in patterns:
                if re.search(pattern, message):
                    score += 0.3  # Increase confidence for each match
            results[intent] = min(score, 0.9)  # Cap individual intent score
        
        # Default to general inquiry if no strong match
        if not any(score > 0.5 for score in results.values()):
            results["inquiry"] = 0.7
        
        return results
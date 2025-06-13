# qa_generator.py
import openai
from config import settings

class QAGenerator:
    def __init__(self, client_id):
        self.client_id = client_id
        openai.api_key = settings.OPENAI_API_KEY

    def generate_qa_pairs(self, text, num_questions=5):
        """Generate Q&A pairs from text content"""
        try:
            response = openai.ChatCompletion.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": f"Generate {num_questions} question-answer pairs from the following text. Format as Q: question\nA: answer"},
                    {"role": "user", "content": text}
                ],
                temperature=0.5,
                max_tokens=1000
            )
            
            return self._parse_qa(response.choices[0].message['content'])
        except Exception as e:
            print(f"QA generation failed: {str(e)}")
            return []

    def _parse_qa(self, text):
        """Parse Q&A text into structured pairs"""
        qa_pairs = []
        current_q = ""
        current_a = ""
        
        for line in text.split('\n'):
            if line.startswith('Q:') or line.startswith('Question:'):
                if current_q and current_a:
                    qa_pairs.append({"question": current_q, "answer": current_a})
                current_q = line.split(':', 1)[1].strip()
                current_a = ""
            elif line.startswith('A:') or line.startswith('Answer:'):
                current_a = line.split(':', 1)[1].strip()
        
        if current_q and current_a:
            qa_pairs.append({"question": current_q, "answer": current_a})
        
        return qa_pairs
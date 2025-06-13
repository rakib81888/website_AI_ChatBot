# response_generator.py
from ..training.qa_generator import QAGenerator
from .intent_detection import IntentDetector
from .context_manager import ContextManager
from services.openai_integration import generate_response
import logging

class ResponseGenerator:
    def __init__(self, client_id, client_config):
        self.client_id = client_id
        self.client_config = client_config
        self.context_manager = ContextManager()
        self.intent_detector = IntentDetector(client_id)
        self.qa_generator = QAGenerator(client_id)

    def generate(self, user_message: str, session_id: str) -> str:
        # Add user message to context
        self.context_manager.add_context("user", user_message)
        
        # Detect intent
        intent = self.intent_detector.detect_intent(user_message)
        logging.info(f"Detected intent: {intent}")
        
        # Generate response using OpenAI
        context = self.context_manager.get_context()
        bot_response = generate_response(
            user_message, 
            self.client_config,
            context=context,
            session_id=session_id
        )
        
        # Add bot response to context
        self.context_manager.add_context("assistant", bot_response)
        
        return bot_response
# context_manager.py
class ContextManager:
    def __init__(self, max_context_length=5):
        self.context = []
        self.max_context_length = max_context_length

    def add_context(self, role, content):
        self.context.append({"role": role, "content": content})
        # Maintain context window
        if len(self.context) > self.max_context_length * 2:  # *2 for user+bot pairs
            self.context = self.context[-self.max_context_length * 2:]

    def get_context(self):
        return self.context.copy()
    
    def clear_context(self):
        self.context = []
    
    def get_last_user_message(self):
        for message in reversed(self.context):
            if message["role"] == "user":
                return message["content"]
        return ""
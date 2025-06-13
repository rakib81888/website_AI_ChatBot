# workflows.py
import requests
import logging
import sys
import os 
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../backend')))
from config import settings

class N8nIntegration:
    def __init__(self, client_id):
        self.client_id = client_id
        self.webhook_url = settings.N8N_WEBHOOK_URL

    def trigger_workflow(self, workflow_name, payload):
        """Trigger n8n workflow with payload"""
        try:
            response = requests.post(
                f"{self.webhook_url}/{workflow_name}",
                json={
                    "client_id": self.client_id,
                    "payload": payload
                },
                timeout=5
            )
            response.raise_for_status()
            return True
        except Exception as e:
            logging.error(f"n8n workflow trigger failed: {str(e)}")
            return False

    def handle_crm_update(self, contact_info):
        return self.trigger_workflow("crm-update", contact_info)
    
    def handle_email_notification(self, email_data):
        return self.trigger_workflow("email-notification", email_data)
    
    def handle_payment_processing(self, payment_data):
        return self.trigger_workflow("payment-processing", payment_data)
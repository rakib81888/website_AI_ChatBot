class ChatbotWidget {
    constructor(config) {
        // Required config: clientId, domain, signature
        this.config = config;
        this.sessionId = null;
        this.isOpen = false;
        this.initWidget();
    }

    initWidget() {
        // Create container
        this.container = document.createElement('div');
        this.container.id = 'chatbot-container';
        this.container.style = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 350px;
            height: 500px;
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.15);
            display: flex;
            flex-direction: column;
            z-index: 9999;
            overflow: hidden;
            font-family: Arial, sans-serif;
            transition: transform 0.3s ease;
            transform: ${this.isOpen ? 'translateY(0)' : 'translateY(calc(100% - 60px))'};
        `;

        // Header
        const header = document.createElement('div');
        header.style = `
            background: ${this.config.primaryColor || '#3B82F6'};
            color: white;
            padding: 15px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        `;
        header.innerHTML = `
            <h3 style="margin:0">${this.config.botName || 'Support Bot'}</h3>
            <button id="chatbot-toggle" style="background:none; border:none; color:white; font-size:20px;">
                ${this.isOpen ? '▼' : '▲'}
            </button>
        `;
        this.container.appendChild(header);

        // Chat history
        const chatHistory = document.createElement('div');
        chatHistory.id = 'chat-history';
        chatHistory.style = `
            flex: 1;
            padding: 15px;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            gap: 10px;
        `;
        this.container.appendChild(chatHistory);

        // Input area
        const inputArea = document.createElement('div');
        inputArea.style = `
            display: flex;
            padding: 10px;
            border-top: 1px solid #eee;
        `;
        inputArea.innerHTML = `
            <input 
                type="text" 
                id="chat-input" 
                placeholder="Type your message..." 
                style="flex:1; padding:10px; border:1px solid #ddd; border-radius:20px;"
            >
            <button 
                id="chat-send" 
                style="background:${this.config.primaryColor || '#3B82F6'}; color:white; border:none; border-radius:50%; width:40px; height:40px; margin-left:5px;"
            >➤</button>
        `;
        this.container.appendChild(inputArea);

        // Append to body
        document.body.appendChild(this.container);

        // Event listeners
        document.getElementById('chatbot-toggle').addEventListener('click', () => this.toggleWidget());
        document.getElementById('chat-send').addEventListener('click', () => this.sendMessage());
        document.getElementById('chat-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });

        // Load session if exists
        this.loadSession();
    }

    toggleWidget() {
        this.isOpen = !this.isOpen;
        this.container.style.transform = this.isOpen 
            ? 'translateY(0)' 
            : 'translateY(calc(100% - 60px))';
        document.getElementById('chatbot-toggle').innerHTML = this.isOpen ? '▼' : '▲';
    }

    async startSession() {
        try {
            const response = await fetch('http://localhost:8000/chat/start', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    client_id: this.config.clientId,
                    domain: this.config.domain,
                    signature: this.config.signature
                })
            });
            const data = await response.json();
            this.sessionId = data.session_id;
            localStorage.setItem('chatbot_session', this.sessionId);
        } catch (error) {
            console.error('Failed to start session:', error);
        }
    }

    loadSession() {
        const savedSession = localStorage.getItem('chatbot_session');
        if (savedSession) {
            this.sessionId = savedSession;
            this.loadHistory();
        } else {
            this.startSession();
        }
    }

    async loadHistory() {
        if (!this.sessionId) return;
        
        try {
            const response = await fetch(`http://localhost:8000/chat/history?session_id=${this.sessionId}&client_id=${this.config.clientId}&domain=${this.config.domain}&signature=${this.config.signature}`);
            const history = await response.json();
            
            const historyElement = document.getElementById('chat-history');
            historyElement.innerHTML = '';
            
            history.forEach(msg => {
                const msgElement = document.createElement('div');
                msgElement.style = `
                    padding: 8px 12px;
                    border-radius: 18px;
                    max-width: 80%;
                    background: ${msg.is_bot ? '#f0f0f0' : '#3B82F6'};
                    color: ${msg.is_bot ? '#333' : 'white'};
                    align-self: ${msg.is_bot ? 'flex-start' : 'flex-end'};
                `;
                msgElement.textContent = msg.message;
                historyElement.appendChild(msgElement);
            });
            
            historyElement.scrollTop = historyElement.scrollHeight;
        } catch (error) {
            console.error('Failed to load history:', error);
        }
    }

    async sendMessage() {
        const input = document.getElementById('chat-input');
        const message = input.value.trim();
        if (!message) return;
        
        // Add user message to UI
        this.addMessage(message, false);
        input.value = '';
        
        // Send to backend
        try {
            const response = await fetch('http://localhost:8000/chat/message', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    client_id: this.config.clientId,
                    domain: this.config.domain,
                    session_id: this.sessionId,
                    text: message,
                    signature: this.config.signature
                })
            });
            const botResponse = await response.json();
            this.addMessage(botResponse.text, true);
        } catch (error) {
            console.error('Failed to send message:', error);
            this.addMessage("Sorry, I'm having trouble connecting. Please try again later.", true);
        }
    }

    addMessage(text, isBot) {
        const historyElement = document.getElementById('chat-history');
        const msgElement = document.createElement('div');
        msgElement.style = `
            padding: 8px 12px;
            border-radius: 18px;
            max-width: 80%;
            background: ${isBot ? '#f0f0f0' : '#3B82F6'};
            color: ${isBot ? '#333' : 'white'};
            align-self: ${isBot ? 'flex-start' : 'flex-end'};
        `;
        msgElement.textContent = text;
        historyElement.appendChild(msgElement);
        
        // Scroll to bottom
        historyElement.scrollTop = historyElement.scrollHeight;
    }
}

// Initialize widget when script loads
document.addEventListener('DOMContentLoaded', () => {
    // Extract config from script tag
    const scriptTag = document.currentScript;
    const clientId = scriptTag.getAttribute('data-client-id');
    const domain = scriptTag.getAttribute('data-domain');
    const signature = scriptTag.getAttribute('data-signature');
    
    if (clientId && domain && signature) {
        window.chatbot = new ChatbotWidget({
            clientId,
            domain,
            signature
        });
    } else {
        console.error('Missing required attributes: data-client-id, data-domain, data-signature');
    }
});

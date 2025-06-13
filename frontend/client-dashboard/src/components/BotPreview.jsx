import React, { useState } from 'react';

const BotPreview = () => {
  const [config, setConfig] = useState({
    primaryColor: '#3B82F6',
    welcomeMessage: 'Hello! How can I help you today?',
    offlineMessage: 'Our support team is currently offline. Please leave a message and we\'ll get back to you soon.',
    persona: 'friendly'
  });
  
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hello! How can I help you today?', time: '10:00 AM' },
    { sender: 'user', text: 'How do I reset my password?', time: '10:01 AM' },
    { sender: 'bot', text: 'You can reset your password by visiting our password reset page: https://example.com/reset-password', time: '10:01 AM' }
  ]);
  
  const [newMessage, setNewMessage] = useState('');

  const handleSend = () => {
    if (newMessage.trim() === '') return;
    
    // Add user message
    const userMessage = {
      sender: 'user',
      text: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages([...messages, userMessage]);
    setNewMessage('');
    
    // Simulate bot response after 1 second
    setTimeout(() => {
      const botResponse = {
        sender: 'bot',
        text: 'I can help with that! Could you provide more details about your issue?',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="border rounded-lg max-w-2xl mx-auto">
      <div className="p-4 rounded-t-lg" style={{ backgroundColor: config.primaryColor }}>
        <div className="text-white font-medium">Chat Support</div>
      </div>
      
      <div className="p-4 bg-gray-50 h-96 overflow-y-auto">
        {messages.map((message, index) => (
          <div 
            key={index} 
            className={`mb-4 ${message.sender === 'user' ? 'text-right' : ''}`}
          >
            <div className="text-xs text-gray-500 mb-1">
              {message.sender === 'bot' ? 'Bot' : 'You'} • {message.time}
            </div>
            <div className={`rounded-lg px-4 py-2 inline-block ${
              message.sender === 'bot' 
                ? 'bg-gray-200 text-gray-800' 
                : 'bg-blue-500 text-white'
            }`}>
              {message.text}
            </div>
          </div>
        ))}
      </div>
      
      <div className="p-4 border-t">
        <div className="flex">
          <input
            type="text"
            placeholder="Type your message..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button
            onClick={handleSend}
            className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default BotPreview;
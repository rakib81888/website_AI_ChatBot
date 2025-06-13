import React, { useState } from 'react';
import StatusBadge from './StatusBadge';

const BotConfig = ({ client }) => {
  const [config, setConfig] = useState({
    persona: client.persona || 'friendly',
    primaryColor: client.primaryColor || '#3B82F6',
    fallbackEmail: client.fallbackEmail || '',
    welcomeMessage: client.welcomeMessage || 'Hello! How can I help you today?',
    offlineMessage: client.offlineMessage || 'Our support team is currently offline. Please leave a message and we\'ll get back to you soon.'
  });
  
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleChange = (field, value) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaving(true);
    
    // Simulate API save
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => setSaved(false), 3000);
    }, 1000);
  };

  const personaOptions = [
    { id: 'friendly', name: 'Friendly', description: 'Casual and approachable tone' },
    { id: 'professional', name: 'Professional', description: 'Formal and business-appropriate' },
    { id: 'enthusiastic', name: 'Enthusiastic', description: 'Energetic and positive' },
    { id: 'technical', name: 'Technical', description: 'Detailed and precise language' }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-medium">Bot Configuration</h3>
        </div>
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="persona" className="block text-sm font-medium text-gray-700 mb-1">
                Bot Persona
              </label>
              <select
                id="persona"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={config.persona}
                onChange={(e) => handleChange('persona', e.target.value)}
              >
                {personaOptions.map(option => (
                  <option key={option.id} value={option.id}>
                    {option.name}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-sm text-gray-500">
                {personaOptions.find(opt => opt.id === config.persona)?.description}
              </p>
            </div>
            
            <div>
              <label htmlFor="primaryColor" className="block text-sm font-medium text-gray-700 mb-1">
                Primary Color
              </label>
              <div className="flex items-center">
                <input
                  type="color"
                  id="primaryColor"
                  className="w-10 h-10 p-1 border border-gray-300 rounded cursor-pointer"
                  value={config.primaryColor}
                  onChange={(e) => handleChange('primaryColor', e.target.value)}
                />
                <span className="ml-2 text-sm text-gray-600">{config.primaryColor}</span>
              </div>
            </div>
            
            <div>
              <label htmlFor="welcomeMessage" className="block text-sm font-medium text-gray-700 mb-1">
                Welcome Message
              </label>
              <textarea
                id="welcomeMessage"
                rows="2"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={config.welcomeMessage}
                onChange={(e) => handleChange('welcomeMessage', e.target.value)}
              />
            </div>
            
            <div>
              <label htmlFor="offlineMessage" className="block text-sm font-medium text-gray-700 mb-1">
                Offline Message
              </label>
              <textarea
                id="offlineMessage"
                rows="2"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={config.offlineMessage}
                onChange={(e) => handleChange('offlineMessage', e.target.value)}
              />
            </div>
            
            <div>
              <label htmlFor="fallbackEmail" className="block text-sm font-medium text-gray-700 mb-1">
                Fallback Email
              </label>
              <input
                type="email"
                id="fallbackEmail"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="support@example.com"
                value={config.fallbackEmail}
                onChange={(e) => handleChange('fallbackEmail', e.target.value)}
              />
              <p className="mt-1 text-sm text-gray-500">
                Where to send messages when bot can't answer
              </p>
            </div>
          </div>
          
          <div className="mt-8 flex items-center">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
              disabled={saving}
            >
              {saving ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : 'Save Changes'}
            </button>
            
            {saved && (
              <div className="ml-4 text-green-600 flex items-center">
                <svg className="h-5 w-5 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Changes saved successfully!
              </div>
            )}
          </div>
        </form>
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-medium">Preview</h3>
        </div>
        <div className="p-6">
          <div className="border rounded-lg max-w-md mx-auto">
            <div className="p-4 rounded-t-lg" style={{ backgroundColor: config.primaryColor }}>
              <div className="text-white font-medium">Chat Support</div>
            </div>
            
            <div className="p-4 bg-gray-50 h-80 overflow-y-auto">
              <div className="mb-4">
                <div className="text-sm text-gray-500 mb-1">Bot</div>
                <div className="bg-gray-200 rounded-lg px-4 py-2 inline-block">
                  {config.welcomeMessage}
                </div>
              </div>
              
              <div className="mb-4 text-right">
                <div className="text-sm text-gray-500 mb-1">You</div>
                <div className="bg-blue-100 rounded-lg px-4 py-2 inline-block">
                  How do I reset my password?
                </div>
              </div>
              
              <div>
                <div className="text-sm text-gray-500 mb-1">Bot</div>
                <div className="bg-gray-200 rounded-lg px-4 py-2 inline-block">
                  You can reset your password by visiting our password reset page...
                </div>
              </div>
            </div>
            
            <div className="p-4 border-t">
              <input
                type="text"
                placeholder="Type your message..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                disabled
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BotConfig;
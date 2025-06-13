import React, { useState } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

const ChatHistory = ({ clientId }) => {
  const [sessions, setSessions] = useState([
    {
      id: 'session-1',
      startedAt: new Date(Date.now() - 86400000).toISOString(),
      lastMessage: 'How do I reset my password?',
      duration: '5m 12s',
      messages: 8,
      status: 'resolved'
    },
    {
      id: 'session-2',
      startedAt: new Date(Date.now() - 172800000).toISOString(),
      lastMessage: 'What are your business hours?',
      duration: '2m 45s',
      messages: 4,
      status: 'resolved'
    },
    {
      id: 'session-3',
      startedAt: new Date(Date.now() - 259200000).toISOString(),
      lastMessage: 'I need help with my order',
      duration: '8m 30s',
      messages: 12,
      status: 'human'
    }
  ]);
  
  const [selectedSession, setSelectedSession] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredSessions = sessions.filter(session => 
    session.lastMessage.toLowerCase().includes(searchTerm.toLowerCase()) ||
    session.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectSession = (session) => {
    setSelectedSession(session);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Chat History</h2>
        <div className="w-64">
          <input
            type="text"
            placeholder="Search chats..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-medium">Chat Sessions</h3>
            </div>
            <div className="overflow-y-auto max-h-[500px]">
              {filteredSessions.map(session => (
                <div 
                  key={session.id}
                  className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                    selectedSession?.id === session.id ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => selectSession(session)}
                >
                  <div className="flex justify-between">
                    <div className="font-medium text-gray-900">
                      {session.lastMessage}
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(session.startedAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="mt-1 flex justify-between text-sm text-gray-500">
                    <div>
                      <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-1"></span>
                      {session.status === 'resolved' ? 'Resolved' : 'Human Handoff'}
                    </div>
                    <div>{session.messages} messages</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-2">
          {selectedSession ? (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-medium">Chat Session: {selectedSession.id}</h3>
                  <div className="text-sm text-gray-500">
                    {new Date(selectedSession.startedAt).toLocaleString()} • {selectedSession.duration} • {selectedSession.messages} messages
                  </div>
                </div>
                <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  {selectedSession.status === 'resolved' ? 'Resolved' : 'Human Handoff'}
                </div>
              </div>
              
              <div className="p-6">
                <div className="space-y-4 max-h-[500px] overflow-y-auto">
                  {Array.from({ length: selectedSession.messages }).map((_, i) => (
                    <div key={i} className={`flex ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                      <div className={`max-w-md px-4 py-2 rounded-lg ${
                        i % 2 === 0 
                          ? 'bg-gray-100 text-gray-800' 
                          : 'bg-blue-600 text-white'
                      }`}>
                        <div className="font-medium mb-1">
                          {i % 2 === 0 ? 'User' : 'Bot'}
                        </div>
                        <div>
                          {i % 2 === 0 
                            ? 'How do I reset my password?' 
                            : 'You can reset your password by visiting our password reset page: https://example.com/reset-password'}
                        </div>
                        <div className="text-xs mt-2 opacity-70">
                          {new Date(Date.now() - (selectedSession.messages - i) * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 pt-4 border-t">
                  <h4 className="font-medium mb-2">Session Details</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-3 rounded">
                      <div className="text-sm text-gray-500">Started At</div>
                      <div>{new Date(selectedSession.startedAt).toLocaleString()}</div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded">
                      <div className="text-sm text-gray-500">Duration</div>
                      <div>{selectedSession.duration}</div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded">
                      <div className="text-sm text-gray-500">Messages</div>
                      <div>{selectedSession.messages}</div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded">
                      <div className="text-sm text-gray-500">Status</div>
                      <div>{selectedSession.status === 'resolved' ? 'Automatically resolved' : 'Transferred to human agent'}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow h-full flex items-center justify-center">
              <div className="text-center p-8">
                <div className="text-gray-400 mb-4">Select a chat session to view details</div>
                <svg className="w-16 h-16 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                </svg>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatHistory;
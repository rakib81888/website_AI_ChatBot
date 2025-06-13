import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();
  
  const navigation = [
    { name: 'Dashboard', href: '/', icon: '📊' },
    { name: 'Training', href: '/training', icon: '🧠' },
    { name: 'Chat History', href: '/history', icon: '💬' },
    { name: 'Analytics', href: '/analytics', icon: '📈' },
    { name: 'Settings', href: '/settings', icon: '⚙️' },
  ];

  return (
    <div className={`bg-gray-800 text-white ${isOpen ? 'w-64' : 'w-20'} transition-width duration-300 ease-in-out flex flex-col h-screen`}>
      <div className="p-4 flex items-center justify-between">
        {isOpen ? (
          <div className="flex items-center">
            <div className="bg-blue-500 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold mr-2">C</div>
            <span className="text-xl font-bold">My ChatBot</span>
          </div>
        ) : (
          <div className="bg-blue-500 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold">C</div>
        )}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="text-gray-400 hover:text-white focus:outline-none"
        >
          {isOpen ? (
            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          ) : (
            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          )}
        </button>
      </div>
      
      <nav className="flex-1 mt-5 px-2 space-y-1">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) => 
              `group flex items-center px-3 py-3 text-sm font-medium rounded-md transition-colors ${
                isActive || location.pathname === item.href
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`
            }
          >
            <span className="mr-3 text-lg">{item.icon}</span>
            {isOpen && item.name}
          </NavLink>
        ))}
      </nav>
      
      <div className="p-4 border-t border-gray-700">
        {isOpen && (
          <div className="text-sm text-gray-400">
            <p>Need help? Contact support</p>
            <p className="text-blue-300">support@chatbot.com</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
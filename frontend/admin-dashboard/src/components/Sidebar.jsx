import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();
  
  const navigation = [
    { name: 'Dashboard', href: '/', icon: '📊' },
    { name: 'Clients', href: '/clients', icon: '👥' },
    { name: 'Training', href: '/training', icon: '🧠' },
    { name: 'Analytics', href: '/analytics', icon: '📈' },
    { name: 'Integrations', href: '/integrations', icon: '🔌' },
    { name: 'Billing', href: '/billing', icon: '💳' },
    { name: 'Settings', href: '/settings', icon: '⚙️' },
  ];

  return (
    <div className={`bg-gray-800 text-white ${isOpen ? 'w-64' : 'w-20'} transition-width duration-300 ease-in-out flex flex-col h-screen`}>
      <div className="p-4 flex items-center justify-between">
        {isOpen ? (
          <div className="flex items-center">
            <div className="bg-blue-500 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold mr-2">R</div>
            <span className="text-xl font-bold">ChatBot SaaS</span>
          </div>
        ) : (
          <div className="bg-blue-500 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold">R</div>
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
        <div className="flex items-center">
          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10" />
          <div className={`ml-3 ${!isOpen && 'hidden'}`}>
            <p className="text-sm font-medium text-white">Admin User</p>
            <p className="text-xs font-medium text-gray-400">admin@example.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
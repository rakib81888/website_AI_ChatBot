import React, { useState } from 'react';

const ClientForm = ({ initialData = {}, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: initialData.name || '',
    domain: initialData.domain || '',
    username: initialData.username || '',
    password: initialData.password || '',
    is_active: initialData.is_active || true,
    persona: initialData.persona || 'friendly',
    primary_color: initialData.primary_color || '#3B82F6',
    fallback_email: initialData.fallback_email || ''
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Client Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        
        <div>
          <label htmlFor="domain" className="block text-sm font-medium text-gray-700 mb-1">
            Website Domain
          </label>
          <input
            type="text"
            id="domain"
            name="domain"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={formData.domain}
            onChange={handleChange}
            required
          />
        </div>
        
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
            Login Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Login Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={formData.password}
            onChange={handleChange}
            required={!initialData.id}
          />
        </div>
        
        <div>
          <label htmlFor="persona" className="block text-sm font-medium text-gray-700 mb-1">
            Bot Persona
          </label>
          <select
            id="persona"
            name="persona"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={formData.persona}
            onChange={handleChange}
          >
            <option value="friendly">Friendly</option>
            <option value="professional">Professional</option>
            <option value="enthusiastic">Enthusiastic</option>
            <option value="technical">Technical</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="primary_color" className="block text-sm font-medium text-gray-700 mb-1">
            Primary Color
          </label>
          <div className="flex items-center">
            <input
              type="color"
              id="primary_color"
              name="primary_color"
              className="w-10 h-10 p-1 border border-gray-300 rounded cursor-pointer"
              value={formData.primary_color}
              onChange={handleChange}
            />
            <span className="ml-2 text-sm text-gray-600">{formData.primary_color}</span>
          </div>
        </div>
        
        <div>
          <label htmlFor="fallback_email" className="block text-sm font-medium text-gray-700 mb-1">
            Fallback Email
          </label>
          <input
            type="email"
            id="fallback_email"
            name="fallback_email"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={formData.fallback_email}
            onChange={handleChange}
            placeholder="support@example.com"
          />
        </div>
        
        <div className="flex items-center">
          <input
            id="is_active"
            name="is_active"
            type="checkbox"
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            checked={formData.is_active}
            onChange={handleChange}
          />
          <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
            Account Active
          </label>
        </div>
      </div>
      
      <div className="pt-4">
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          {initialData.id ? 'Update Client' : 'Create Client'}
        </button>
      </div>
    </form>
  );
};

export default ClientForm;
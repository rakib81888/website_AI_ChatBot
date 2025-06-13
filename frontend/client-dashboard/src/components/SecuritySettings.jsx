import React, { useState } from 'react';

const SecuritySettings = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }
    
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    
    setSaving(true);
    setError('');
    
    // Simulate API save
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setSaved(false), 3000);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Security Settings</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <div>
          <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
            Current Password
          </label>
          <input
            type="password"
            id="currentPassword"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
        </div>
        
        <div>
          <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
            New Password
          </label>
          <input
            type="password"
            id="newPassword"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <p className="mt-1 text-sm text-gray-500">
            Must be at least 8 characters
          </p>
        </div>
        
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
            Confirm New Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        
        {error && (
          <div className="text-red-500 text-sm">
            {error}
          </div>
        )}
        
        <div className="flex items-center">
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
            ) : 'Change Password'}
          </button>
          
          {saved && (
            <div className="ml-4 text-green-600 flex items-center">
              <svg className="h-5 w-5 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Password changed successfully!
            </div>
          )}
        </div>
      </form>
      
      <div className="pt-6 border-t">
        <h3 className="text-lg font-medium mb-4">Two-Factor Authentication</h3>
        <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-medium">Status: Disabled</h4>
              <p className="text-sm text-gray-600 mt-1">
                Add an extra layer of security to your account
              </p>
            </div>
            <button className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300">
              Enable 2FA
            </button>
          </div>
        </div>
      </div>
      
      <div className="pt-6 border-t">
        <h3 className="text-lg font-medium mb-4">Active Sessions</h3>
        <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
          <div className="flex justify-between items-center mb-4 pb-4 border-b">
            <div>
              <div className="font-medium">Chrome on Windows</div>
              <div className="text-sm text-gray-600">New York, USA • Just now</div>
            </div>
            <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
              Current session
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <div>
              <div className="font-medium">Firefox on MacOS</div>
              <div className="text-sm text-gray-600">San Francisco, USA • 2 hours ago</div>
            </div>
            <button className="text-red-600 hover:text-red-800 text-sm">
              Revoke
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecuritySettings;
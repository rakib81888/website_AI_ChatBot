import React, { useState, useEffect } from 'react';
import BotConfig from '../components/BotConfig';
import UserSettings from '../components/UserSettings';
import SecuritySettings from '../components/SecuritySettings';
import SubscriptionPlan from '../components/SubscriptionPlan';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

const Settings = () => {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    company: '',
    domain: ''
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    // Simulate API call to fetch user data
    setTimeout(() => {
      setUserData({
        name: 'Acme Inc',
        email: 'contact@acme.com',
        company: 'Acme Corporation',
        domain: 'acme.com',
        plan: 'Premium',
        planExpiry: new Date(Date.now() + 30 * 86400000).toISOString()
      });
      setLoading(false);
    }, 800);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
      
      <Tabs selectedIndex={activeTab} onSelect={index => setActiveTab(index)}>
        <TabList className="flex border-b">
          <Tab className="py-3 px-6 cursor-pointer">Bot Configuration</Tab>
          <Tab className="py-3 px-6 cursor-pointer">User Settings</Tab>
          <Tab className="py-3 px-6 cursor-pointer">Security</Tab>
          <Tab className="py-3 px-6 cursor-pointer">Subscription</Tab>
        </TabList>
        
        <TabPanel>
          <div className="p-4 bg-white rounded-lg shadow mt-4">
            <BotConfig />
          </div>
        </TabPanel>
        
        <TabPanel>
          <div className="p-4 bg-white rounded-lg shadow mt-4">
            <UserSettings userData={userData} />
          </div>
        </TabPanel>
        
        <TabPanel>
          <div className="p-4 bg-white rounded-lg shadow mt-4">
            <SecuritySettings />
          </div>
        </TabPanel>
        
        <TabPanel>
          <div className="p-4 bg-white rounded-lg shadow mt-4">
            <SubscriptionPlan userData={userData} />
          </div>
        </TabPanel>
      </Tabs>
    </div>
  );
};

export default Settings;
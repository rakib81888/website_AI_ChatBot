import React, { useState } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import TrainingSources from '../components/TrainingSources';
import BotConfig from '../components/BotConfig';

const Training = () => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Train Your Chatbot</h1>
      
      <Tabs selectedIndex={activeTab} onSelect={index => setActiveTab(index)}>
        <TabList className="flex border-b">
          <Tab className="py-3 px-6 cursor-pointer">Training Sources</Tab>
          <Tab className="py-3 px-6 cursor-pointer">Bot Configuration</Tab>
          <Tab className="py-3 px-6 cursor-pointer">Integration</Tab>
        </TabList>
        
        <TabPanel>
          <div className="p-4 bg-white rounded-lg shadow mt-4">
            <TrainingSources />
          </div>
        </TabPanel>
        
        <TabPanel>
          <div className="p-4 bg-white rounded-lg shadow mt-4">
            <BotConfig />
          </div>
        </TabPanel>
        
        <TabPanel>
          <div className="p-4 bg-white rounded-lg shadow mt-4">
            <h2 className="text-xl font-semibold mb-4">Integrations</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                  <div className="ml-4">
                    <h3 className="font-medium">Payment Gateway</h3>
                    <p className="text-sm text-gray-600">Stripe, PayPal, etc.</p>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">
                  Connect payment gateways to enable transactions through your chatbot.
                </p>
                <button className="bg-gray-100 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-200">
                  Configure
                </button>
              </div>
              
              <div className="border rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                  <div className="ml-4">
                    <h3 className="font-medium">Calendar</h3>
                    <p className="text-sm text-gray-600">Google Calendar, Calendly</p>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">
                  Connect calendars to allow users to book appointments through your chatbot.
                </p>
                <button className="bg-gray-100 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-200">
                  Configure
                </button>
              </div>
              
              <div className="border rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                  <div className="ml-4">
                    <h3 className="font-medium">CRM</h3>
                    <p className="text-sm text-gray-600">HubSpot, Salesforce, etc.</p>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">
                  Connect CRM systems to sync customer interactions and data.
                </p>
                <button className="bg-gray-100 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-200">
                  Configure
                </button>
              </div>
              
              <div className="border rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                  <div className="ml-4">
                    <h3 className="font-medium">Email</h3>
                    <p className="text-sm text-gray-600">Gmail, Outlook, etc.</p>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">
                  Connect email services to send and receive emails through your chatbot.
                </p>
                <button className="bg-gray-100 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-200">
                  Configure
                </button>
              </div>
            </div>
          </div>
        </TabPanel>
      </Tabs>
    </div>
  );
};

export default Training;
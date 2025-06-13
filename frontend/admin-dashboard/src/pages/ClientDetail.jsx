import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import StatusBadge from '../components/StatusBadge';
import TrainingSources from '../components/TrainingSources';
import ChatHistory from '../components/ChatHistory';
import BotConfig from '../components/BotConfig';

const ClientDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    // Simulate API call to fetch client details
    setTimeout(() => {
      setClient({
        id: id,
        name: `Client ${id}`,
        domain: `client${id}.com`,
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 86400000).toISOString(),
        status: ['active', 'inactive', 'pending'][Math.floor(Math.random() * 3)],
        apiKey: `chatbot_${Math.random().toString(36).substr(2, 12)}`,
        persona: 'professional',
        primaryColor: '#3B82F6',
        fallbackEmail: `support@client${id}.com`,
        plan: Math.random() > 0.5 ? 'Premium' : 'Standard',
        lastActive: new Date(Date.now() - Math.floor(Math.random() * 24) * 3600000).toISOString(),
      });
      setLoading(false);
    }, 800);
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <button 
            onClick={() => navigate(-1)}
            className="text-blue-600 hover:text-blue-800 flex items-center"
          >
            <svg className="h-5 w-5 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Clients
          </button>
          <h1 className="text-2xl font-bold text-gray-800 mt-2">{client.name}</h1>
        </div>
        <div className="flex space-x-3">
          <button className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-md text-gray-700">
            Edit
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-white">
            Save Changes
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <div className="flex flex-col md:flex-row md:items-center">
            <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
              <div className="bg-blue-100 text-blue-800 rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold">
                {client.name.charAt(0)}
              </div>
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-4 mb-2">
                <h2 className="text-xl font-semibold">{client.name}</h2>
                <StatusBadge status={client.status} />
                <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                  {client.plan} Plan
                </span>
              </div>
              <div className="text-gray-600">
                <div className="mb-1">Domain: {client.domain}</div>
                <div className="mb-1">API Key: <span className="font-mono text-sm">{client.apiKey}</span></div>
                <div>Created: {new Date(client.createdAt).toLocaleDateString()}</div>
              </div>
            </div>
          </div>
        </div>

        <Tabs selectedIndex={activeTab} onSelect={index => setActiveTab(index)}>
          <TabList className="flex border-b">
            <Tab className="py-3 px-6 cursor-pointer">Overview</Tab>
            <Tab className="py-3 px-6 cursor-pointer">Training</Tab>
            <Tab className="py-3 px-6 cursor-pointer">Chat History</Tab>
            <Tab className="py-3 px-6 cursor-pointer">Bot Configuration</Tab>
            <Tab className="py-3 px-6 cursor-pointer">Billing</Tab>
          </TabList>

          <TabPanel>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium mb-3">Activity</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Last active:</span>
                      <span>{new Date(client.lastActive).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total chats:</span>
                      <span className="font-medium">142</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Active sessions:</span>
                      <span className="font-medium">3</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Avg. response time:</span>
                      <span className="font-medium">2.4s</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium mb-3">Statistics</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Resolution rate:</span>
                      <span className="font-medium">89%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>User satisfaction:</span>
                      <span className="font-medium">4.6/5</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Fallback rate:</span>
                      <span className="font-medium">7%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Training accuracy:</span>
                      <span className="font-medium">92%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabPanel>
          
          <TabPanel>
            <div className="p-6">
              <TrainingSources clientId={id} />
            </div>
          </TabPanel>
          
          <TabPanel>
            <div className="p-6">
              <ChatHistory clientId={id} />
            </div>
          </TabPanel>
          
          <TabPanel>
            <div className="p-6">
              <BotConfig client={client} />
            </div>
          </TabPanel>
          
          <TabPanel>
            <div className="p-6">
              <h3 className="text-lg font-medium mb-4">Billing Information</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-600">Premium Plan - $599/month</p>
                <p className="text-gray-600 mt-2">Next billing date: {new Date(Date.now() + 30*86400000).toLocaleDateString()}</p>
                <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                  Update Payment Method
                </button>
              </div>
              
              <div className="mt-6">
                <h4 className="font-medium mb-2">Payment History</h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Jun 10, 2023</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">$599.00</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Paid
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">May 10, 2023</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">$599.00</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Paid
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </TabPanel>
        </Tabs>
      </div>
    </div>
  );
};

export default ClientDetail;
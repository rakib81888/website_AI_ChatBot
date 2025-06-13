import React, { useState, useEffect } from 'react';
import StatCard from '../components/StatCard';
import RecentActivity from '../components/RecentActivity';
import BotPreview from '../components/BotPreview';
import EmbedCode from '../components/EmbedCode';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEmbedCode, setShowEmbedCode] = useState(false);

  useEffect(() => {
    // Simulate API call to fetch dashboard data
    setTimeout(() => {
      setStats({
        totalChats: 142,
        activeSessions: 3,
        resolutionRate: '89%',
        userSatisfaction: '4.6/5',
        trainingStatus: 'Completed',
        botStatus: 'Online',
        chatData: [
          { day: 'Mon', chats: 120 },
          { day: 'Tue', chats: 142 },
          { day: 'Wed', chats: 98 },
          { day: 'Thu', chats: 156 },
          { day: 'Fri', chats: 110 },
          { day: 'Sat', chats: 85 },
          { day: 'Sun', chats: 65 },
        ]
      });
      setLoading(false);
    }, 1000);
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
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <button 
          onClick={() => setShowEmbedCode(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Get Embed Code
        </button>
      </div>
      
      {showEmbedCode && <EmbedCode onClose={() => setShowEmbedCode(false)} />}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Chats" 
          value={stats.totalChats} 
          change="+24" 
          icon="💬" 
          color="blue" 
        />
        <StatCard 
          title="Active Sessions" 
          value={stats.activeSessions} 
          change="-1" 
          icon="👥" 
          color="green" 
        />
        <StatCard 
          title="Resolution Rate" 
          value={stats.resolutionRate} 
          change="+3%" 
          icon="✅" 
          color="purple" 
        />
        <StatCard 
          title="User Satisfaction" 
          value={stats.userSatisfaction} 
          change="+0.2" 
          icon="⭐" 
          color="yellow" 
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Chat Activity (Last 7 Days)</h2>
          <div className="h-80">
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="text-gray-400 mb-4">Chart visualization would appear here</div>
                <div className="bg-gray-100 border border-gray-200 rounded-lg p-4 inline-block">
                  <div className="flex items-end space-x-1 h-48">
                    {stats.chatData.map((day, index) => (
                      <div key={index} className="flex flex-col items-center">
                        <div 
                          className="w-8 bg-blue-500 rounded-t"
                          style={{ height: `${day.chats / 2}px` }}
                        ></div>
                        <div className="text-xs mt-1">{day.day}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
          <RecentActivity />
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Bot Preview</h2>
        <BotPreview />
      </div>
    </div>
  );
};

export default Dashboard;
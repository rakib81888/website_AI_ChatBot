import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import StatCard from '../components/StatCard';
import RecentActivity from '../components/RecentActivity';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to fetch dashboard data
    setTimeout(() => {
      setStats({
        totalClients: 24,
        activeClients: 18,
        pendingTraining: 3,
        dailyChats: 142,
        revenue: 8432,
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
      <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Clients" 
          value={stats.totalClients} 
          change="+12%" 
          icon="👥" 
          color="blue" 
        />
        <StatCard 
          title="Active Clients" 
          value={stats.activeClients} 
          change="+5%" 
          icon="✅" 
          color="green" 
        />
        <StatCard 
          title="Pending Training" 
          value={stats.pendingTraining} 
          change="-2" 
          icon="⏳" 
          color="yellow" 
        />
        <StatCard 
          title="Daily Chats" 
          value={stats.dailyChats} 
          change="+24" 
          icon="💬" 
          color="purple" 
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Chat Activity (Last 7 Days)</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.chatData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="chats" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
          <RecentActivity />
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Performance Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="text-blue-500 font-bold text-xl">98%</div>
            <div className="text-gray-600">Response Accuracy</div>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="text-green-500 font-bold text-xl">4.7s</div>
            <div className="text-gray-600">Avg. Response Time</div>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <div className="text-purple-500 font-bold text-xl">72%</div>
            <div className="text-gray-600">Conversions</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
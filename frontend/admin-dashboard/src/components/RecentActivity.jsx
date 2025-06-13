import React from 'react';

const RecentActivity = () => {
  const activities = [
    {
      id: 1,
      client: 'Acme Inc',
      action: 'completed training',
      time: '2 minutes ago',
      status: 'success'
    },
    {
      id: 2,
      client: 'Tech Solutions',
      action: 'updated chatbot settings',
      time: '15 minutes ago',
      status: 'info'
    },
    {
      id: 3,
      client: 'Global Retail',
      action: 'started new training session',
      time: '1 hour ago',
      status: 'warning'
    },
    {
      id: 4,
      client: 'Service Pro',
      action: 'payment failed',
      time: '3 hours ago',
      status: 'error'
    },
    {
      id: 5,
      client: 'Marketing Hub',
      action: 'downloaded chat logs',
      time: '5 hours ago',
      status: 'info'
    }
  ];

  const statusColors = {
    success: 'bg-green-100 text-green-800',
    info: 'bg-blue-100 text-blue-800',
    warning: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800'
  };

  const statusIcons = {
    success: '✅',
    info: 'ℹ️',
    warning: '⚠️',
    error: '❌'
  };

  return (
    <div className="space-y-4">
      {activities.map(activity => (
        <div key={activity.id} className="flex items-start">
          <div className={`w-8 h-8 flex items-center justify-center rounded-full ${statusColors[activity.status]} mr-3`}>
            {statusIcons[activity.status]}
          </div>
          <div className="flex-1">
            <div className="font-medium text-gray-800">
              <span className="font-semibold">{activity.client}</span> {activity.action}
            </div>
            <div className="text-sm text-gray-500">{activity.time}</div>
          </div>
        </div>
      ))}
      <div className="pt-2 text-center">
        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
          View all activity →
        </button>
      </div>
    </div>
  );
};

export default RecentActivity;
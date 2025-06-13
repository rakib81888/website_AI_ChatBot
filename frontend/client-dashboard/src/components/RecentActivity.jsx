import React from 'react';

const RecentActivity = () => {
  const activities = [
    {
      id: 1,
      action: 'completed website training',
      time: '2 hours ago',
      status: 'success'
    },
    {
      id: 2,
      action: 'updated bot settings',
      time: '5 hours ago',
      status: 'info'
    },
    {
      id: 3,
      action: 'added 15 new Q&A pairs',
      time: '1 day ago',
      status: 'success'
    },
    {
      id: 4,
      action: 'download chat history',
      time: '2 days ago',
      status: 'info'
    },
    {
      id: 5,
      action: 'started new training session',
      time: '3 days ago',
      status: 'success'
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
              {activity.action}
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
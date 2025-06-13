import React from 'react';

const StatCard = ({ title, value, change, icon, color = 'blue' }) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-500 border-blue-200',
    green: 'bg-green-50 text-green-500 border-green-200',
    yellow: 'bg-yellow-50 text-yellow-500 border-yellow-200',
    purple: 'bg-purple-50 text-purple-500 border-purple-200',
    red: 'bg-red-50 text-red-500 border-red-200'
  };

  const changeColor = change.startsWith('+') 
    ? 'text-green-500' 
    : change.startsWith('-') 
      ? 'text-red-500' 
      : 'text-gray-500';

  return (
    <div className={`p-5 rounded-lg shadow border ${colorClasses[color]}`}>
      <div className="flex justify-between items-start">
        <div>
          <div className="text-lg font-medium text-gray-600">{title}</div>
          <div className="mt-2 text-3xl font-bold">{value}</div>
        </div>
        <div className="text-3xl">{icon}</div>
      </div>
      <div className={`mt-2 text-sm font-medium ${changeColor}`}>
        {change}
      </div>
    </div>
  );
};

export default StatCard;
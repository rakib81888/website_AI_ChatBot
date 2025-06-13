import React from 'react';

const StatusBadge = ({ status }) => {
  const statusConfig = {
    active: {
      text: 'Active',
      color: 'bg-green-100 text-green-800',
    },
    inactive: {
      text: 'Inactive',
      color: 'bg-red-100 text-red-800',
    },
    pending: {
      text: 'Pending',
      color: 'bg-yellow-100 text-yellow-800',
    },
    training: {
      text: 'Training',
      color: 'bg-blue-100 text-blue-800',
    }
  };

  const config = statusConfig[status] || statusConfig.inactive;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
      {config.text}
    </span>
  );
};

export default StatusBadge;
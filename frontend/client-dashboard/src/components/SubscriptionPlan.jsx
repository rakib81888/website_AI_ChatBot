import React from 'react';

const SubscriptionPlan = ({ userData }) => {
  const plans = [
    {
      name: 'Basic',
      price: '$199',
      features: [
        'Static Bot',
        'Manual Q&A Training',
        'Embed on Website',
        'Basic Support'
      ],
      recommended: false
    },
    {
      name: 'Standard',
      price: '$399',
      features: [
        'Auto Training',
        'CRM Integration',
        'Theme Control',
        'Priority Support',
        'Analytics Dashboard'
      ],
      recommended: true
    },
    {
      name: 'Premium',
      price: '$599',
      features: [
        'All Standard Features',
        'Human Fallback',
        'Payment Integration',
        'Meeting Scheduler',
        '24/7 Support',
        'Custom Integrations'
      ],
      recommended: false
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">Current Plan</h2>
              <p className="text-gray-600">
                Manage your subscription and billing information
              </p>
            </div>
            <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              {userData.plan} Plan
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="border rounded-lg p-4">
              <div className="font-medium mb-2">Billing Information</div>
              <div className="text-sm text-gray-600">
                <div>Plan: {userData.plan}</div>
                <div>Price: ${userData.plan === 'Basic' ? '199' : userData.plan === 'Standard' ? '399' : '599'}/month</div>
                <div>Next Billing Date: {new Date(userData.planExpiry).toLocaleDateString()}</div>
              </div>
            </div>
            
            <div className="border rounded-lg p-4">
              <div className="font-medium mb-2">Payment Method</div>
              <div className="flex items-center">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-6 mr-2" />
                <div className="text-sm text-gray-600">Visa ending in 4242</div>
              </div>
              <button className="mt-3 text-blue-600 hover:text-blue-800 text-sm">
                Update Payment Method
              </button>
            </div>
            
            <div className="border rounded-lg p-4">
              <div className="font-medium mb-2">Billing History</div>
              <div className="text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Jun 10, 2023</span>
                  <span>$599.00</span>
                </div>
                <div className="flex justify-between mt-1">
                  <span>May 10, 2023</span>
                  <span>$599.00</span>
                </div>
              </div>
              <button className="mt-3 text-blue-600 hover:text-blue-800 text-sm">
                View Full History
              </button>
            </div>
          </div>
          
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
            Update Subscription
          </button>
        </div>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-4">Upgrade Your Plan</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan, index) => (
            <div 
              key={index} 
              className={`border rounded-lg p-6 relative ${
                plan.recommended 
                  ? 'ring-2 ring-blue-500 transform scale-105 z-10' 
                  : 'hover:shadow-md transition-shadow'
              }`}
            >
              {plan.recommended && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Recommended
                </div>
              )}
              
              <h3 className="text-xl font-bold text-center mb-2">{plan.name}</h3>
              <div className="text-3xl font-bold text-center mb-4">{plan.price}<span className="text-lg font-normal">/month</span></div>
              
              <ul className="space-y-2 mb-6">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center">
                    <svg className="h-5 w-5 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              
              <button 
                className={`w-full py-2 rounded-md ${
                  plan.recommended 
                    ? 'bg-blue-600 text-white hover:bg-blue-700' 
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                {plan.recommended ? 'Upgrade Now' : 'Select Plan'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPlan;
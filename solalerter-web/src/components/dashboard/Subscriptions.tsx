import React from 'react';
import NewSubscription from './NewSubscription';
import AllSubscriptions from './AllSubscriptions';

const Subscriptions: React.FC = () => {
  return (
    <div>
        <h1 className="text-2xl font-bold mb-4">Subscriptions</h1>
        <div className="bg-white shadow rounded-lg p-6">
          <AllSubscriptions></AllSubscriptions>
        </div>
        <h1 className="text-2xl font-bold mb-4 mt-4">New Subscription</h1>
        <div className="bg-white shadow rounded-lg p-6">
            <NewSubscription></NewSubscription>
        </div>
    </div>
  );
};

export default Subscriptions;
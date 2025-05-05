import React, { useEffect, useState } from 'react';
import { apiGet } from '../utils/api';

const Dashboard: React.FC = () => {
  const [activeSubscriptions, setActiveSubscriptions] = useState(0);
  const [dbStatus, setDbStatus] = useState<'Connected' | 'Not Connected'>('Not Connected');
  const [indexCount, setindexCount] = useState(0);

  // Fetch active subscriptions count
  useEffect(() => {
    const fetchActiveSubscriptions = async () => {
      try {
        const response = await apiGet('api/subscription/active-subscriptions');
        if (response.success) {
          setActiveSubscriptions(response.subscriptionCount);
        }
      } catch (error) {
        console.error('Error fetching active subscriptions:', error);
      }
    };

    fetchActiveSubscriptions();
  }, []);

  // Check database connection status
  useEffect(() => {
    const checkDatabaseConnection = async () => {
      try {
        const response = await apiGet('api/user/test-database');
        if (response.success) {
          setDbStatus('Connected');
        } else {
          setDbStatus('Not Connected');
        }
        setindexCount(response.count);
      } catch (error) {
        console.error('Error checking database connection:', error);
        setDbStatus('Not Connected');
      }
    };

    checkDatabaseConnection();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Welcome to Sol Alerter</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Active Subscriptions</h2>
          <div className="text-3xl font-bold text-indigo-600">{activeSubscriptions}</div>
          <p className="text-gray-500 mt-2">Currently running indexers</p>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Data Points</h2>
          <div className="text-3xl font-bold text-green-600">{indexCount}</div>
          <p className="text-gray-500 mt-2">Total indexed items</p>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Database Status</h2>
          <div className="text-sm text-gray-600">
            <p>Configure your database in settings</p>
            <p className={`font-semibold mt-2 ${dbStatus === 'Connected' ? 'text-green-600' : 'text-yellow-600'}`}>
              {dbStatus}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
            Create New Subscription
          </button>
          <button className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
            View Analytics
          </button>
          <button className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
            Check Database Health
          </button>
          <button className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
            View Documentation
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
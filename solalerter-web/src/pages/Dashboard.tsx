import React, { useEffect, useState } from 'react';
import { apiGet } from '../utils/api';

const Dashboard: React.FC = () => {
  const [activeSubscriptions, setActiveSubscriptions] = useState(0);
  const [userName, setUserName] = useState('');
  const [telegramId, setTelegramId] = useState('');
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

  useEffect(() => {
    const fetchDatapoints = async () => {
      try {
        const response = await apiGet('api/subscription/helius-data-points');
        if (response.success) {
          setindexCount(response.heliusDataPoints);
        }
      } catch (error) {
        console.error('Error fetching data points:', error);
        };
    };
    fetchDatapoints();
  }, []);

  useEffect(() => {
    const getUserDetails = async () => {
      try {
        const response = await apiGet('api/user/get-user');
        if (response.success) {
          setUserName(response.user.name);
          setTelegramId(response.user.telegramId);
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    getUserDetails();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Welcome to Sol Alerter</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white   rounded-lg p-6">
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
          <h2 className="text-lg font-semibold mb-4">Telegram Id</h2>
          <div className="text-sm text-gray-600">
            <p className={`font-semibold mt-2 ${telegramId ? 'text-green-600' : 'text-red-600'}`}>
              {telegramId ? telegramId : 'Please provide telegram id in profile'}
            </p>
            <div className="mt-3">
              <a 
                href="https://web.telegram.org/a/#7621995122" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  <span>Send your Telegram Id here to start alerts</span>
              </a>
            </div>
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
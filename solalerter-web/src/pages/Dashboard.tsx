import React, { useEffect, useState } from 'react';
import { apiGet } from '../utils/api';
import { Bell, ChevronDown, ChevronUp, Coins, LineChart, TrendingDown, TrendingUp } from 'lucide-react';

const Dashboard: React.FC = () => {
  const [activeSubscriptions, setActiveSubscriptions] = useState(0);
  const [userName, setUserName] = useState('');
  const [telegramId, setTelegramId] = useState('');
  const [indexCount, setindexCount] = useState(0);
  const [showTopCoins, setShowTopCoins] = useState(true);
  const [trendingCoins, setTrendingCoins] = useState([]);
  const darkMode = false;
  
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

  useEffect(() => {
    const fetchTrendingCoins = async () => {
      const data = await apiGet('api/coingecko/get-trending-coins',true);
      setTrendingCoins(data);
    };

    fetchTrendingCoins();
    const interval = setInterval(fetchTrendingCoins, 600000); // 10 minutes

    return () => clearInterval(interval);
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

      <div className="py-4 grid grid-cols-1 lg:grid-cols-1 gap-6">
          {/* Top Coins by Volume */}
          <div className={`col-span-2 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg overflow-hidden w-full`}>
            <div className="px-4 sm:px-6 py-4 border-b flex justify-between items-center border-opacity-20">
              <div className="flex items-center gap-2">
                <Coins className="text-purple-500" size={18} />
                <h2 className="font-semibold text-sm sm:text-base">Top Coins by Market Cap</h2>
              </div>
              <button 
                onClick={() => setShowTopCoins(!showTopCoins)}
                className="p-1 rounded-md hover:bg-opacity-10 hover:bg-gray-500"
              >
                {showTopCoins ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
            </div>
            
            {showTopCoins && (
              <div>
                {/* Desktop View - Table */}
                <div className="hidden sm:block overflow-x-auto">
                  <table className="min-w-full">
                    <thead className={`${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Coin</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Price</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">24h Change</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Volume</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                      {trendingCoins.map((coin, index) => (
                        <tr key={index} className={`hover:bg-opacity-10 hover:bg-gray-500 transition`}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="mr-2">
                                <img src={coin.image} alt={coin.name} className="h-6 w-6" />
                              </div>
                              <span className="font-medium">{coin.name.length > 25 ? coin.name.substring(0, 25) + '...' : coin.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">${coin.current_price.toFixed(2)}</td>
                          <td className={`px-6 py-4 whitespace-nowrap ${coin.price_change_percentage_24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            <div className="flex items-center">
                              {coin.price_change_percentage_24h >= 0 ? <TrendingUp size={16} className="mr-1" /> : <TrendingDown size={16} className="mr-1" />}
                              {coin.price_change_percentage_24h.toFixed(2)}%
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">${coin.market_cap.toLocaleString()}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex space-x-2">
                              <button 
                                onClick={() => window.open(`https://www.coingecko.com/en/coins/${coin.name.toLowerCase()}`, '_blank')} 
                                className={`p-2 rounded-md ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} transition`}
                              >
                                <LineChart size={14} />
                              </button>
                              <button className={`p-2 rounded-md ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} transition`}>
                                <Bell size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {/* Mobile View - Cards */}
                <div className="sm:hidden">
                  {trendingCoins.map((coin, index) => (
                    <div 
                      key={index} 
                      className={`p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} last:border-b-0`}
                    >
                      {/* Coin header with name and actions */}
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center">
                          <div className="mr-2">
                            <img src={coin.image} alt={coin.name} className="h-5 w-5" />
                          </div>
                          <span className="font-medium text-sm">{coin.name.length > 25 ? coin.name.substring(0, 25) + '...' : coin.name}</span>
                        </div>
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => window.open(`https://www.coingecko.com/en/coins/${coin.name.toLowerCase()}`, '_blank')} 
                            className={`p-1 rounded-md ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} transition`}
                          >
                            <LineChart size={14} />
                          </button>
                          <button 
                            className={`p-1 rounded-md ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} transition`}
                          >
                            <Bell size={14} />
                          </button>
                        </div>
                      </div>
                      
                      {/* Coin stats in mobile card format */}
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div>
                          <p className="text-xs uppercase text-gray-500 mb-1">Price</p>
                          <p className="font-medium">${coin.current_price.toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-xs uppercase text-gray-500 mb-1">24h Change</p>
                          <p className={`font-medium flex items-center ${coin.price_change_percentage_24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {coin.price_change_percentage_24h >= 0 ? 
                              <TrendingUp size={14} className="mr-1" /> : 
                              <TrendingDown size={14} className="mr-1" />
                            }
                            {coin.price_change_percentage_24h.toFixed(2)}%
                          </p>
                        </div>
                        <div>
                          <p className="text-xs uppercase text-gray-500 mb-1">Market Cap</p>
                          <p className="font-medium">${coin.market_cap.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
    </div>
  );
};

export default Dashboard;
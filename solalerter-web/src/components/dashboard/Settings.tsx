import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { apiGet, apiPost } from '../../utils/api';

const Settings: React.FC = () => {
  const [user, setUser] = useState({
    userName: '',
    telegramId: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getUserDetails = async () => {
      try {
        const response = await apiGet('api/user/get-user');
        if (response.success) {
          setUser({
            userName: response.user.name,
            telegramId: response.user.telegramId,
          })
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    getUserDetails();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const userDetails = {
        userName: user.userName,
        telegramId: user.telegramId,
      };
      
      const response = await apiPost('api/user/save-user', userDetails);
      console.log('Response:', response);
      if (response.success) {
        toast.success('User details saved successfully!');
      } else {
        toast.error(response.message || 'Failed to save user details');
      }
    } catch (error) {
      console.error('Error occurred:', error);
      toast.error('An error occurred while saving user details');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <ToastContainer position="top-right" autoClose={5000} />
      <h1 className="text-2xl font-bold mb-4">Settings</h1>
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">User Profile settings</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                User Name
              </label>
              <input
                id="userName"
                type="text"
                required
                className="mt-1 block w-full border border-gray-400 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-4 py-2"
                value={user.userName}
                onChange={(e) =>
                  setUser({ ...user, userName: e.target.value })
                }
              />
            </div>
            <div>
              <label htmlFor="telegramid" className="block text-sm font-medium text-gray-700">
                Telegram Id
              </label>
              <input
                id="port"
                type="text"
                required
                className="mt-1 block w-full border border-gray-400 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-4 py-2"
                value={user.telegramId}
                onChange={(e) =>
                  setUser({ ...user, telegramId: e.target.value })
                }
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                isLoading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
            >
              {isLoading ? 'Saving...' : 'Save User Details'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;

import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { apiGet, apiPost } from '../../utils/api';

const Settings: React.FC = () => {
  const [dbCredentials, setDbCredentials] = useState({
    host: '',
    port: 5432,
    database: '',
    username: '',
    password: '',
  });
  
  const [isLoading, setIsLoading] = useState(false);

  // Fetch database details on first page load
  useEffect(() => {
    const fetchDbDetails = async () => {
      try {
        const response = await apiGet('api/user/get-database');
        if (response.success && response.data) {
          setDbCredentials({
            host: response.data.host || '',
            port: response.data.port || 5432,
            database: response.data.databaseName || '',
            username: response.data.userName || '',
            password: '', // blank password for security reasons
          });
        }
      } catch (error) {
        console.error('Error fetching database details:', error);
        toast.error('Failed to fetch database details.');
      }
    };

    fetchDbDetails();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const connectionDetails = {
        host: dbCredentials.host,
        port: dbCredentials.port,
        databaseName: dbCredentials.database,
        userName: dbCredentials.username,
        password: dbCredentials.password,
      };
      
      const response = await apiPost('api/user/connect-database', connectionDetails);
      console.log('Response:', response);
      if (response.success) {
        toast.success('Database connected successfully!');
      } else {
        toast.error(response.message || 'Failed to connect to database');
        toast.error(response.message || 'Failed to connect to database');
      }
    } catch (error) {
      console.error('Error connecting to database:', error);
      toast.error('Failed to connect to database');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <ToastContainer position="top-right" autoClose={5000} />
      <h1 className="text-2xl font-bold mb-4">Settings</h1>
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Database Configuration</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="host" className="block text-sm font-medium text-gray-700">
                Host
              </label>
              <input
                id="host"
                type="text"
                required
                className="mt-1 block w-full border border-gray-400 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-4 py-2"
                value={dbCredentials.host}
                onChange={(e) =>
                  setDbCredentials({ ...dbCredentials, host: e.target.value })
                }
              />
            </div>
            <div>
              <label htmlFor="port" className="block text-sm font-medium text-gray-700">
                Port
              </label>
              <input
                id="port"
                type="number"
                required
                className="mt-1 block w-full border border-gray-400 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-4 py-2"
                value={dbCredentials.port}
                onChange={(e) =>
                  setDbCredentials({ ...dbCredentials, port: parseInt(e.target.value) })
                }
              />
            </div>
          </div>

          <div>
            <label htmlFor="database" className="block text-sm font-medium text-gray-700">
              Database Name
            </label>
            <input
              id="database"
              type="text"
              required
              className="mt-1 block w-full border border-gray-400 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-4 py-2"
              value={dbCredentials.database}
              onChange={(e) =>
                setDbCredentials({ ...dbCredentials, database: e.target.value })
              }
            />
          </div>

          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              id="username"
              type="text"
              required
              className="mt-1 block w-full border border-gray-400 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-4 py-2"
              value={dbCredentials.username}
              onChange={(e) =>
                setDbCredentials({ ...dbCredentials, username: e.target.value })
              }
            />
          </div>

          <div>
            <label htmlFor="dbPassword" className="block text-sm font-medium text-gray-700">
              Database Password
            </label>
            <input
              id="dbPassword"
              type="password"
              required
              className="mt-1 block w-full border border-gray-400 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-4 py-2"
              value={dbCredentials.password}
              onChange={(e) =>
                setDbCredentials({ ...dbCredentials, password: e.target.value })
              }
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                isLoading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
            >
              {isLoading ? 'Connecting...' : 'Save Database Configuration'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Siren, Shield, Zap } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import { Link } from 'react-router-dom';
import { apiGet, apiPost } from '../utils/api';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('authToken');
    if (token) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleSuccess = async (credentialResponse: any) => {
    try {
      setIsLoading(true);
      console.log(credentialResponse);
      const response = await apiPost('api/auth/google', {idToken: credentialResponse.credential}, true);

      // console.log(response);
      if (!response.user) {
        throw new Error('Failed to authenticate with backend');
      }

      const data = await response;
      // console.log('login data', data);
      
      // Store the authentication token and user info
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user_info', JSON.stringify(data.user));
      
      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleError = () => {
    console.error('Login Failed');
    toast.error('Google authentication failed');
  };

  return (
    <div className="min-h-0 flex items-center justify-center bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50">
      <ToastContainer position="top-right" autoClose={5000} />
      
      <div className="max-w-md w-full p-10 bg-white rounded-2xl shadow-xl transform transition-all">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="flex-shrink-0">
                <Link to="/" className="flex items-center px-2 py-2">
                  <Siren className="h-8 w-8 text-indigo-600" />
                  <span className="ml-1 text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-700 bg-clip-text text-transparent">Sol Alerter</span>
                </Link>
              </div>
          </div>
          <p className="mt-3 text-gray-600 font-medium">
            Your ultimate blockchain monitoring platform
          </p>
        </div>
        
        <div className="mt-10 space-y-8">
          {/* Features */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2 text-sm text-gray-700">
              <Shield className="h-5 w-5 text-indigo-500" />
              <span>Secure Monitoring</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-700">
              <Zap className="h-5 w-5 text-indigo-500" />
              <span>Real-time Alerts</span>
            </div>
          </div>
          
          {/* Login section */}
          <div className="flex flex-col items-center space-y-6">
            
            <div className="w-full flex justify-center">
              {isLoading ? (
                <div className="py-3 px-6 bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-600 mr-2"></div>
                  <span className="text-gray-700">Authenticating...</span>
                </div>
              ) : (
                <div className="transform transition-all hover:scale-105">
                  <GoogleLogin
                    onSuccess={handleSuccess}
                    onError={handleError}
                    theme="filled_blue"
                    shape="pill"
                    size="large"
                    text="continue_with"
                    locale="en"
                  />
                </div>
              )}
            </div>
            
            <div className="text-center">
              <p className="text-xs text-gray-500">
                By signing in, you agree to our <a href="#" className="text-indigo-600 hover:underline">Terms of Service</a> and <a href="#" className="text-indigo-600 hover:underline">Privacy Policy</a>
              </p>
            </div>
          </div>
        </div>
        
        <div className="mt-10 pt-6 border-t border-gray-100 flex items-center justify-center">
          <div className="text-sm">
            <span className="text-gray-500">Need help?</span>{' '}
            <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
              Contact support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Siren, LayoutDashboard, Settings, History, Menu, X, LogOut } from 'lucide-react';

const Layout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = () => {
    // Remove auth token from localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('user_info');
    
    // Redirect to login page
    // navigate('/login');
    window.location.href = '/login';
  };

  const renderSidebarLinks = () => (
    <nav className="mt-5 px-2">
      <Link
        to="/dashboard"
        className={`group flex items-center px-2 py-2 text-base rounded-md ${
          isActive('/dashboard')
            ? 'bg-indigo-100 text-indigo-600'
            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
        }`}
      >
        <LayoutDashboard className="mr-4 h-6 w-6" />
        Dashboard
      </Link>

      <Link
        to="/dashboard/subscriptions"
        className={`mt-1 group flex items-center px-2 py-2 text-base rounded-md ${
          isActive('/subscriptions')
            ? 'bg-indigo-100 text-indigo-600'
            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
        }`}
      >
        <Siren className="mr-4 h-6 w-6" />
        Subscriptions
      </Link>

      <Link
        to="/dashboard/history"
        className={`mt-1 group flex items-center px-2 py-2 text-base rounded-md ${
          isActive('/history')
            ? 'bg-indigo-100 text-indigo-600'
            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
        }`}
      >
        <History className="mr-4 h-6 w-6" />
        History
      </Link>

      <Link
        to="/dashboard/settings"
        className={`mt-1 group flex items-center px-2 py-2 text-base rounded-md ${
          isActive('/settings')
            ? 'bg-indigo-100 text-indigo-600'
            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
        }`}
      >
        <Settings className="mr-4 h-6 w-6" />
        Settings
      </Link>
      
      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="mt-8 w-full flex items-center px-2 py-2 text-base rounded-md text-red-600 hover:bg-red-50 transition-colors duration-200 group"
      >
        <LogOut className="mr-4 h-6 w-6" />
        <span className="font-medium">Logout</span>
      </button>
    </nav>
  );

  return (
    <div className="min-h-screen bg-gray-50 min-w-full sm:min-w-[640px] md:min-w-[768px] lg:min-w-[1024px] xl:min-w-[1280px]">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center px-2 py-2">
                <Siren className="h-8 w-8 text-indigo-600" />
                <span className="ml-1 text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-700 bg-clip-text text-transparent">Sol Alerter</span>
              </Link>
              
              {/* Mobile Hamburger Menu */}
              <div className="ml-auto absolute right-8 md:hidden">
                <button 
                  onClick={toggleMobileMenu} 
                  className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                >
                  {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
              </div>
            </div>
            
            {/* Desktop Logout Button */}
            {/* <div className="hidden md:flex items-center">
              <button
                onClick={handleLogout}
                className="ml-4 px-4 py-2 rounded-md text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-sm transition-all duration-200 flex items-center space-x-2 transform hover:scale-105"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div> */}
          </div>
        </div>
      </nav>

      <div className="flex flex-col md:flex-row">
        {/* Desktop Sidebar */}
        <aside className="hidden md:block md:w-64 bg-white border-r border-gray-200 min-h-screen">
          {renderSidebarLinks()}
        </aside>

        {/* Mobile Sidebar */}
        {isMobileMenuOpen && (
          <aside className="absolute z-50 w-full bg-white border-r border-gray-200 md:hidden">
            {renderSidebarLinks()}
          </aside>
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
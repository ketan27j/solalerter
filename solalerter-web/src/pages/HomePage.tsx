import { useState, useEffect } from 'react';
import {
  Bell,
  ChevronDown,
  ChevronUp,
  Coins,
  LineChart,
  Search,
  Settings,
  Webhook,
  Rocket,
  Megaphone,
  Twitter,
  Newspaper,
  MessageCircle,
  ArrowRight,
  Activity,
  Users,
  Menu,
  X,
  TrendingUp,
  ThumbsUp,
  Smartphone,
  Send,
  Bell as BellIcon,
} from 'lucide-react';
import Login from './Login';

// Sample data for trending coins
const trendingCoins = [
  { name: 'SOL', price: '$172.43', change: '+5.2%', volume: '$1.2B', positive: true },
  { name: 'BONK', price: '$0.00001234', change: '+12.8%', volume: '$431M', positive: true },
  { name: 'JTO', price: '$3.87', change: '-2.1%', volume: '$89M', positive: false },
  { name: 'PYTH', price: '$0.67', change: '+3.6%', volume: '$152M', positive: true },
  { name: 'RNDR', price: '$7.21', change: '-1.4%', volume: '$214M', positive: false },
  { name: 'SAMO', price: '$0.0342', change: '+8.7%', volume: '$89M', positive: true },
  { name: 'ORAO', price: '$1.23', change: '-0.7%', volume: '$45M', positive: false },
  { name: 'DUST', price: '$0.0013', change: '+15.4%', volume: '$76M', positive: true },
];

// Sample data for recent events
const recentEvents = [
  { coin: 'SOL', event: 'Price Alert', time: '2 mins ago', message: 'SOL up 3% in the last hour', type: 'price' },
  { coin: 'BONK', event: 'Volume Spike', time: '15 mins ago', message: 'Trading volume increased by 25%', type: 'volume' },
  { coin: 'JTO', event: 'Whale Transaction', time: '37 mins ago', message: '$1.2M transferred to exchange wallet', type: 'whale' },
  { coin: 'PYTH', event: 'ICO Update', time: '1 hour ago', message: 'Token sale starts in 2 days', type: 'ico' },
  { coin: 'RNDR', event: 'Twitter Mention', time: '2 hours ago', message: 'Trending on Twitter with 5,000+ mentions', type: 'twitter' },
  { coin: 'SOL', event: 'News Update', time: '3 hours ago', message: 'Major partnership announced with tech giant', type: 'news' },
  { coin: 'SAMO', event: 'Whale Transaction', time: '4 hours ago', message: '$2.4M moved from wallet to Binance', type: 'whale' },
  { coin: 'DUST', event: 'Price Alert', time: '5 hours ago', message: 'DUST reached new ATH of $0.0015', type: 'price' },
];

// Sample ICO data
const upcomingICOs = [
  { name: 'NOVA', logo: 'N', date: 'May 10, 2025', description: 'Next-gen DeFi platform', target: '$5M', raised: '$3.2M', progress: 64 },
  { name: 'PULSE', logo: 'P', date: 'May 15, 2025', description: 'Gaming metaverse token', target: '$8M', raised: '$1.7M', progress: 21 },
  { name: 'NEXUS', logo: 'N', date: 'May 22, 2025', description: 'Cross-chain bridge solution', target: '$4M', raised: '$3.9M', progress: 97 },
  { name: 'ATLAS', logo: 'A', date: 'May 28, 2025', description: 'NFT marketplace protocol', target: '$6M', raised: '$0.8M', progress: 13 },
];

// Sample user stats
const userStats = [
  { label: 'Active Users', value: '15,000+', icon: <Users size={24} className="text-blue-600" /> },
  { label: 'Alerts Sent', value: '1.2M+', icon: <Bell size={24} className="text-purple-600" /> },
  { label: 'Tokens Tracked', value: '500+', icon: <Coins size={24} className="text-blue-600" /> },
  { label: 'Success Rate', value: '98.7%', icon: <ThumbsUp size={24} className="text-blue-400" /> }
];

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showTopCoins, setShowTopCoins] = useState(true);
  const [showEvents, setShowEvents] = useState(true);
  const [showICOs, setShowICOs] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [visibleCoins, setVisibleCoins] = useState(5);
  const [showNotificationPanel, setShowNotificationPanel] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);

  const toggleLogin = () => {
    setIsLoginOpen(!isLoginOpen);
    if (isSignupOpen) setIsSignupOpen(false);
  };

  // Simulated notification panel toggle
  const toggleNotificationPanel = () => {
    setShowNotificationPanel(!showNotificationPanel);
    if (showNotificationPanel === false) {
      setNotificationCount(0);
    }
  };
  const darkMode = false;

  const getEventIcon = (type) => {
    switch(type) {
      case 'price': return <LineChart size={16} className="text-blue-600" />;
      case 'volume': return <Activity size={16} className="text-purple-600" />;
      case 'whale': return <Megaphone size={16} className="text-blue-600" />;
      case 'ico': return <Rocket size={16} className="text-orange-500" />;
      case 'twitter': return <Twitter size={16} className="text-blue-400" />;
      case 'news': return <Newspaper size={16} className="text-indigo-600" />;
      default: return <Bell size={16} className="text-blue-600" />;
    }
  };

  const filteredEvents = activeTab === 'all' 
    ? recentEvents 
    : recentEvents.filter(event => event.type === activeTab);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white text-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="flex items-center">
                  <Webhook className="h-8 w-8 text-blue-600" />
                  <span className="ml-1 text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-700 bg-clip-text text-transparent">SolAlerter</span>
                </div>
              </div>
              
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  <a href="#" className="px-3 py-2 rounded-md text-sm font-medium text-gray-900 border-b-2 border-blue-600">Dashboard</a>
                  <a href="#" className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition">Subscriptions</a>
                  <a href="#" className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition">Alerts</a>
                  <a href="#" className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition">Analytics</a>
                </div>
              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-4">
              <div className="relative">
                <button 
                  className="p-2 rounded-full relative bg-gray-100 hover:bg-gray-200 transition"
                  onClick={toggleNotificationPanel}
                >
                  <Bell size={18} />
                  {notificationCount > 0 && (
                    <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                      {notificationCount}
                    </span>
                  )}
                </button>
                {showNotificationPanel && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <div className="p-3 border-b border-gray-200 flex justify-between items-center">
                      <h3 className="font-medium">Notifications</h3>
                      <button className="text-xs text-blue-600 hover:text-blue-800">Mark all as read</button>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {recentEvents.slice(0, 4).map((event, idx) => (
                        <div key={idx} className="p-3 border-b border-gray-100 hover:bg-gray-50">
                          <div className="flex items-start">
                            <div className="p-1 rounded-md bg-blue-50 mr-3">
                              {getEventIcon(event.type)}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-gray-900">{event.coin}</span>
                                <span className="text-xs text-gray-500">{event.time}</span>
                              </div>
                              <p className="text-sm text-gray-600 mt-1">{event.message}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="p-2 text-center border-t border-gray-200">
                      <a href="#" className="text-sm text-blue-600 hover:text-blue-800">View all notifications</a>
                    </div>
                  </div>
                )}
              </div>
              <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition">
                <Settings size={18} />
              </button>
              <button onClick={toggleLogin} className="flex items-center gap-2 px-4 py-2 rounded-md border border-blue-600 bg-white hover:bg-gray-100 text-blue-600 font-medium transition">
                Login
              </button>
              <button onClick={toggleLogin} className="flex items-center gap-2 px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-medium transition">
                Sign Up
              </button>
            </div>
            
            <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white px-4 py-3 border-t border-gray-200 shadow-lg">
            <nav className="flex flex-col space-y-3">
              <a href="#" className="font-medium text-blue-600">Dashboard</a>
              <a href="#" className="font-medium hover:text-blue-600 transition">Subscriptions</a>
              <a href="#" className="font-medium hover:text-blue-600 transition">Alerts</a>
              <a href="#" className="font-medium hover:text-blue-600 transition">Analytics</a>
              <a href="#" className="font-medium hover:text-blue-600 transition">API</a>
              <div className="pt-2 border-t border-gray-200 flex items-center justify-between">
                <button className="p-2 rounded-full bg-gray-100 relative">
                  <Bell size={18} />
                  {notificationCount > 0 && (
                    <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                      {notificationCount}
                    </span>
                  )}
                </button>
                <button className="p-2 rounded-full bg-gray-100">
                  <Settings size={18} />
                </button>
              </div>
              <button className="flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-medium transition">
                Sign Up
              </button>
            </nav>
          </div>
        )}
      </header>
      {/* Login Modal */}
      {isLoginOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30">
          <Login></Login>
        </div>
      )}
      {/* Hero section */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center lg:text-left lg:flex lg:items-center lg:justify-between">
            <div className="lg:max-w-2xl">
              <span className="inline-block px-3 py-1 text-sm font-medium text-blue-800 bg-blue-100 rounded-full mb-4">
                Real-time Solana Analytics
              </span>
              <h1 className="text-4xl font-extrabold sm:text-5xl">
                <span className="block text-gray-900">Track Solana Events</span>
                <span className="block text-blue-600 mt-2">with Precision</span>
              </h1>
              <p className="mt-6 text-xl text-gray-600">
                Monitor your favorite Solana coins, track ICOs, receive real-time alerts for whale movements, and stay updated with market news directly on Telegram.
              </p>
              <div className="mt-10 flex flex-wrap justify-center lg:justify-start gap-4">
                <button className="px-6 py-3 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-medium transition flex items-center">
                  Get Started <ArrowRight className="ml-2" size={20} />
                </button>
                <button className="px-6 py-3 rounded-md border border-gray-300 hover:border-gray-400 font-medium transition">
                  View Demo
                </button>
              </div>
            </div>
            <div className="hidden lg:block lg:max-w-xl">
              <div className="relative mt-12 lg:mt-0 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl shadow-lg border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                      <Bell size={20} className="text-white" />
                    </div>
                    <span className="ml-2 font-semibold text-gray-800">Alert Dashboard</span>
                  </div>
                  <span className="text-sm px-2 py-1 bg-blue-100 text-blue-700 rounded-full">Live</span>
                </div>
                <div className="space-y-3">
                  {recentEvents.slice(0, 3).map((event, idx) => (
                    <div key={idx} className="p-3 bg-white rounded-lg shadow-sm border border-gray-100 flex items-start">
                      <div className="p-2 rounded-md bg-blue-50 mr-3">
                        {getEventIcon(event.type)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900">{event.coin}</span>
                          <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">{event.event}</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{event.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-3 border-t border-gray-100">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Delivery channels:</span>
                    <div className="flex items-center gap-2">
                      <span className="p-1 rounded-md bg-blue-100">
                        <Send size={14} className="text-blue-600" />
                      </span>
                      <span className="p-1 rounded-md bg-blue-100">
                        <Smartphone size={14} className="text-blue-600" />
                      </span>
                      <span className="p-1 rounded-md bg-blue-100">
                        <MessageCircle size={14} className="text-blue-600" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats section */}
      <section className="bg-blue-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {userStats.map((stat, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
                <div className="flex justify-center mb-4">
                  {stat.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                <p className="text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block px-3 py-1 text-sm font-medium text-blue-800 bg-blue-100 rounded-full mb-4">
              Powerful Features
            </span>
            <h2 className="text-3xl font-bold">Comprehensive Alert System</h2>
            <p className="mt-4 text-xl text-gray-600">Stay ahead of the market with our multi-channel alert system</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition">
              <div className="h-12 w-12 mb-4 rounded-lg bg-gradient-to-br from-blue-200 to-blue-300 flex items-center justify-center">
                <Rocket size={24} className="text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">ICO Alerts</h3>
              <p className="text-gray-600">Track upcoming token launches, presales, and investment opportunities in the Solana ecosystem.</p>
              <ul className="mt-4 space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                    <span className="text-blue-600 text-xs">✓</span>
                  </div>
                  Launch date notifications
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                    <span className="text-blue-600 text-xs">✓</span>
                  </div>
                  Fundraising progress updates
                </li>
              </ul>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition">
              <div className="h-12 w-12 mb-4 rounded-lg bg-gradient-to-br from-blue-200 to-blue-300 flex items-center justify-center">
                <Megaphone size={24} className="text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Whale Alerts</h3>
              <p className="text-gray-600">Monitor large transactions and wallet movements to identify potential market-moving activities.</p>
              <ul className="mt-4 space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                    <span className="text-blue-600 text-xs">✓</span>
                  </div>
                  Large transaction tracking
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                    <span className="text-blue-600 text-xs">✓</span>
                  </div>
                  Exchange wallet monitoring
                </li>
              </ul>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition">
              <div className="h-12 w-12 mb-4 rounded-lg bg-gradient-to-br from-blue-200 to-blue-300 flex items-center justify-center">
                <Twitter size={24} className="text-blue-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Twitter Alerts</h3>
              <p className="text-gray-600">Get notified when your tracked tokens are trending on Twitter or mentioned by key influencers.</p>
              <ul className="mt-4 space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                    <span className="text-blue-600 text-xs">✓</span>
                  </div>
                  Influencer mention tracking
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                    <span className="text-blue-600 text-xs">✓</span>
                  </div>
                  Sentiment analysis
                </li>
              </ul>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition">
              <div className="h-12 w-12 mb-4 rounded-lg bg-gradient-to-br from-indigo-200 to-indigo-300 flex items-center justify-center">
                <Newspaper size={24} className="text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">News Alerts</h3>
              <p className="text-gray-600">Receive breaking news and important announcements about your subscribed tokens and projects.</p>
              <ul className="mt-4 space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                    <span className="text-blue-600 text-xs">✓</span>
                  </div>
                  Project updates
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                    <span className="text-blue-600 text-xs">✓</span>
                  </div>
                  Partnership announcements
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Main content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Top Coins by Volume */}
          <div className={`col-span-2 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg overflow-hidden`}>
            <div className="px-6 py-4 border-b flex justify-between items-center border-opacity-20">
              <div className="flex items-center gap-2">
                <Coins className="text-purple-500" size={18} />
                <h2 className="font-semibold">Top Coins by Volume/Popularity</h2>
              </div>
              <button 
                onClick={() => setShowTopCoins(!showTopCoins)}
                className="p-1 rounded-md hover:bg-opacity-10 hover:bg-gray-500"
              >
                {showTopCoins ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
            </div>
            
            {showTopCoins && (
              <div className="overflow-x-auto">
                <table className="w-full">
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
                            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-400 flex items-center justify-center mr-3">
                              <span className="text-white text-xs font-bold">{coin.name.substring(0, 1)}</span>
                            </div>
                            <span className="font-medium">{coin.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">{coin.price}</td>
                        <td className={`px-6 py-4 whitespace-nowrap ${coin.positive ? 'text-blue-500' : 'text-red-500'}`}>
                          <div className="flex items-center">
                            {coin.positive ? <TrendingUp size={16} className="mr-1" /> : <X size={16} className="mr-1" />}
                            {coin.change}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">{coin.volume}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex space-x-2">
                            <button className={`p-2 rounded-md ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} transition`}>
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
            )}
          </div>
          {/* Recent Events */}
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg overflow-hidden`}>
            <div className="px-6 py-4 border-b flex justify-between items-center border-opacity-20">
              <div className="flex items-center gap-2">
                <Bell className="text-purple-500" size={18} />
                <h2 className="font-semibold">Recent Events</h2>
              </div>
              <button 
                onClick={() => setShowEvents(!showEvents)}
                className="p-1 rounded-md hover:bg-opacity-10 hover:bg-gray-500"
              >
                {showEvents ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
            </div>
            
            {showEvents && (
              <div className="p-4">
                {recentEvents.map((event, index) => (
                  <div 
                    key={index} 
                    className={`mb-4 p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} hover:bg-opacity-80 transition cursor-pointer`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center">
                        <div className="h-6 w-6 rounded-full bg-gradient-to-br from-purple-500 to-blue-400 flex items-center justify-center mr-2">
                          <span className="text-white text-xs font-bold">{event.coin.substring(0, 1)}</span>
                        </div>
                        <span className="font-medium">{event.coin}</span>
                      </div>
                      <span className="text-xs opacity-60">{event.time}</span>
                    </div>
                    <div className="flex items-center gap-1 mb-1 text-sm font-medium text-purple-400">
                      {event.event}
                    </div>
                    <p className="text-sm opacity-80">{event.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Features Section */}
        <section className="mt-10 mb-16">
          <h2 className="text-2xl font-bold mb-8 text-center">Powerful Features for Solana Traders</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
              <div className="h-12 w-12 mb-4 rounded-lg bg-gradient-to-br from-purple-500 to-blue-400 flex items-center justify-center">
                <Webhook size={24} className="text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Helius Webhooks</h3>
              <p className="opacity-80">Track specific events on any Solana token using powerful Helius webhooks for real-time updates.</p>
            </div>
            
            <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
              <div className="h-12 w-12 mb-4 rounded-lg bg-gradient-to-br from-purple-500 to-blue-400 flex items-center justify-center">
                <MessageCircle size={24} className="text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Telegram Alerts</h3>
              <p className="opacity-80">Receive instant notifications for your subscribed events directly to your Telegram account.</p>
            </div>
            
            <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
              <div className="h-12 w-12 mb-4 rounded-lg bg-gradient-to-br from-purple-500 to-blue-400 flex items-center justify-center">
                <TrendingUp size={24} className="text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Top Coins Tracking</h3>
              <p className="opacity-80">Stay updated with the top 20 Solana coins by volume and market popularity in real time.</p>
            </div>
          </div>
        </section>

        {/* Search and Filter */}
        <section className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg mb-10`}>
          <h2 className="text-xl font-semibold mb-4">Custom Alert Setup</h2>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className={`flex items-center px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <Search size={18} className="opacity-60 mr-2" />
                <input 
                  type="text" 
                  placeholder="Search for a coin..." 
                  className={`bg-transparent w-full focus:outline-none ${darkMode ? 'placeholder-gray-500' : 'placeholder-gray-400'}`}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select className={`px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-300'} border`}>
                <option>Price Change</option>
                <option>Volume Spike</option>
                <option>Whale Transaction</option>
                <option>Token Burn</option>
              </select>
              <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-blue-400 text-white font-medium hover:opacity-90 transition">
                Add Alert
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className={`py-8 ${darkMode ? 'bg-gray-800' : 'bg-gray-100'} border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <div>
              <Webhook className="h-8 w-8 text-blue-600" />
              </div>
              <span className="ml-1 text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-700 bg-clip-text text-transparent">SolAlerter</span>
            </div>
            <div className="flex flex-col md:flex-row gap-6 md:gap-12">
              <a href="#" className="hover:text-purple-400 transition">Terms of Service</a>
              <a href="#" className="hover:text-purple-400 transition">Privacy Policy</a>
              <a href="#" className="hover:text-purple-400 transition">Contact</a>
            </div>
            <div className="mt-4 md:mt-0 text-sm opacity-70">
              © 2025 SolAlerter. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
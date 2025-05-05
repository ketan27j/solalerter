import { useState } from 'react';
import { 
  Layers, 
  Image
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useAtom } from 'jotai';
import { subscriptionsAtom } from '../../atom/subscriptionsAtom';
import { apiPost } from '../../utils/api';

const NewSubscription = () => {
  const [, setCount] = useAtom(subscriptionsAtom); 
  const [activeTab, setActiveTab] = useState('TOKEN');
  const [address, setAddress] = useState('');
  const [transactionType, setTransactionType] = useState('TRANSFER');

  const tabs = [
    { id: 'TOKEN', icon: <Layers className="w-5 h-5" />, label: 'TOKEN' },
    { id: 'NFT', icon: <Image className="w-5 h-5" />, label: 'NFT' },
  ];

  const createSubscription = async () => {
    try {
      const payload = {
        address: address,
        transactionType : transactionType,
        addressType: activeTab,
      };
      const response = await apiPost('api/subscription/new-subscription', payload); 

      if(response.success) {
        setCount(c => c + 1);
      }

      toast.success('Subscription created successfully!');
    } catch (error) {
      console.error('Error creating subscription:', error);
      toast.error('Failed to create subscription. Please try again.');
    }
  };

  const renderTabContent = () => {
    switch(activeTab) {
      case 'NFT':
        return (
          <div className="bg-white shadow-lg rounded-lg p-6">
            <div className="grid md:grid-cols-1 gap-6">
              <div className="space-y-4">
                <div className="p-4 min-w-xs mx-2">
                  <div className="flex flex-wrap items-center gap-0 space-x-2 space-y-1 p-4">
                    <label className="text-lg font-medium text-gray-700 break-words">
                      Create a subscription for NFT address
                    </label>
                    <input type="text" 
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          className="w-25 border border-blue-200 rounded-lg py-2 px-3 text-gray-700 focus:ring-2 focus:ring-blue-300"
                        />
                    <label className="text-lg w-5 font-medium text-gray-700 whitespace-nowrap"> for </label>
                    <select 
                          value={transactionType}
                          onChange={(e) => setTransactionType(e.target.value)}
                          className="w-25 border border-blue-200 rounded-lg py-2 px-3 text-gray-700 focus:ring-2 focus:ring-blue-300">
                      <option>NFT_BID</option>
                      <option>NFT_MINT</option>
                      <option>BURN_NFT</option>
                    </select>
                  </div>
                  <button 
                        onClick={createSubscription}
                        className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
                    Set Subscription
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'TOKEN':
        return (
          <div className="bg-white shadow-lg rounded-lg p-6">
            <div className="grid md:grid-cols-1 gap-6">
              <div className="space-y-4">
                <div className="p-4 min-w-xs mx-2">
                  <div className="flex flex-wrap items-center gap-0 space-x-2 space-y-1 p-4">
                    <label className="text-lg font-medium text-gray-700 break-words">
                      Create a subscription for token address
                    </label>
                    <input type="text" 
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          className="w-25 border border-blue-200 rounded-lg py-2 px-3 text-gray-700 focus:ring-2 focus:ring-blue-300"
                        />
                    <label className="text-lg w-5 font-medium text-gray-700 whitespace-nowrap"> for </label>
                    <select 
                          value={transactionType}
                          onChange={(e) => setTransactionType(e.target.value)}
                          className="w-25 border border-blue-200 rounded-lg py-2 px-3 text-gray-700 focus:ring-2 focus:ring-blue-300">
                      <option>TRANSFER</option>
                      <option>STAKE_SOL</option>
                      <option>UNSTAKE_SOL</option>
                    </select>
                  </div>
                  <button 
                        onClick={createSubscription}
                        className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
                    Set Subscription
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      
      default:
        return <div>Select a tab to view content</div>;
    }
  };

  return (
    <div className="flex flex-col min-h-0 bg-white">
      {/* Top Navigation */}
      <div className="bg-blue-50 border-b border-blue-100">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center p-4">
            <nav className="flex space-x-4">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded ${
                    activeTab === tab.id 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-500 hover:bg-blue-50'
                  }`}>
                  {tab.icon}
                  <span className="text-sm">{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default NewSubscription;
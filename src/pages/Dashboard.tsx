
import { useState } from 'react';
import { Analytics } from '@/components/Analytics';
import { ProductManagement } from '@/components/ProductManagement';
import { DashboardMessaging } from '@/components/DashboardMessaging';
import { Button } from '@/components/ui/button';
import { BarChart3, Package, MessageCircle, Settings } from 'lucide-react';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState<'analytics' | 'products' | 'messages' | 'settings'>('analytics');

  const tabs = [
    { id: 'analytics' as const, label: 'Analytics', icon: BarChart3 },
    { id: 'products' as const, label: 'Products', icon: Package },
    { id: 'messages' as const, label: 'Messages', icon: MessageCircle },
    { id: 'settings' as const, label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-2">
            GourmetGo Dashboard
          </h1>
          <p className="text-gray-600">Manage your restaurant efficiently</p>
        </div>

        {/* Navigation */}
        <div className="flex space-x-2 mb-8 bg-white/80 backdrop-blur-sm rounded-2xl p-2 border border-white/30 shadow-lg w-fit">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <Button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                variant={activeTab === tab.id ? 'default' : 'ghost'}
                className={`flex items-center gap-2 rounded-xl transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg transform scale-105'
                    : 'text-gray-700 hover:bg-orange-50 hover:text-orange-600'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </Button>
            );
          })}
        </div>

        {/* Content */}
        <div className="transition-all duration-500">
          {activeTab === 'analytics' && <Analytics />}
          {activeTab === 'products' && <ProductManagement />}
          {activeTab === 'messages' && <DashboardMessaging />}
          {activeTab === 'settings' && (
            <div className="text-center py-12">
              <Settings className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Settings</h3>
              <p className="text-gray-500">Settings panel coming soon...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

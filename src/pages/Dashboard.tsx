
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Analytics } from '@/components/Analytics';
import { ProductManagement } from '@/components/ProductManagement';
import { MessagingSystem } from '@/components/MessagingSystem';
import { BarChart3, Package, MessageSquare, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Dashboard = () => {
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState('analytics');

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-black">Restaurant Dashboard</h1>
            <p className="text-gray-600 mt-2">Manage your restaurant operations</p>
          </div>
          <Button 
            onClick={handleLogout}
            variant="outline"
            className="flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>

        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:grid-cols-3 bg-white/80 backdrop-blur-sm border border-white/30">
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="products" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Products
            </TabsTrigger>
            <TabsTrigger value="messages" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Messages
            </TabsTrigger>
          </TabsList>

          <TabsContent value="analytics" className="space-y-6">
            <Analytics />
          </TabsContent>

          <TabsContent value="products" className="space-y-6">
            <ProductManagement />
          </TabsContent>

          <TabsContent value="messages" className="space-y-6">
            <MessagingSystem />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;


import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProductManagement } from '@/components/ProductManagement';
import { Analytics } from '@/components/Analytics';
import { DashboardMessaging } from '@/components/DashboardMessaging';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, BarChart3, Package, MessageSquare, Users } from 'lucide-react';

const Dashboard = () => {
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState('analytics');

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-black">Dashboard</h1>
          <Button 
            onClick={logout}
            variant="outline"
            className="flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>

        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-white/80 backdrop-blur-sm border border-white/30 rounded-xl p-1">
            <TabsTrigger 
              value="analytics" 
              className="flex items-center gap-2 rounded-lg data-[state=active]:bg-black data-[state=active]:text-white"
            >
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger 
              value="products" 
              className="flex items-center gap-2 rounded-lg data-[state=active]:bg-black data-[state=active]:text-white"
            >
              <Package className="h-4 w-4" />
              Products
            </TabsTrigger>
            <TabsTrigger 
              value="messages" 
              className="flex items-center gap-2 rounded-lg data-[state=active]:bg-black data-[state=active]:text-white"
            >
              <MessageSquare className="h-4 w-4" />
              Messages
            </TabsTrigger>
          </TabsList>

          <TabsContent value="analytics">
            <Analytics />
          </TabsContent>

          <TabsContent value="products">
            <ProductManagement />
          </TabsContent>

          <TabsContent value="messages">
            <DashboardMessaging />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;

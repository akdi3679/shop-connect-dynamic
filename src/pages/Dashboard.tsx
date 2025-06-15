import { useState } from 'react';
import { BarChart3, Package, Users, Settings, LogOut, Home, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { user, logout } = useAuth();

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'orders', label: 'Orders', icon: Package },
    { id: 'suppliers', label: 'Suppliers', icon: Users, adminOnly: true },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const goHome = () => {
    window.location.href = '/';
  };

  const handleLogout = () => {
    logout();
  };

  const filteredMenuItems = menuItems.filter(item => 
    !item.adminOnly || user?.role === 'admin'
  );

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r flex flex-col">
        <div className="p-6 border-b">
          <h1 className="text-xl font-bold">
            {user?.role === 'admin' ? 'Admin Dashboard' : 'Supplier Dashboard'}
          </h1>
          <div className="mt-2 p-2 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-2 mb-1">
              <User className="h-4 w-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-900">
                {user?.firstName} {user?.lastName}
              </span>
            </div>
            {user?.storeName && (
              <p className="text-xs text-gray-600">Store: {user.storeName}</p>
            )}
            {user?.isGuest && (
              <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                Guest User
              </span>
            )}
          </div>
        </div>
        
        <nav className="flex-1 p-4">
          {filteredMenuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg mb-2 text-left transition-colors ${
                  activeTab === item.id
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-gray-100'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t">
          <Button 
            variant="outline" 
            className="w-full mb-2"
            onClick={goHome}
          >
            <Home className="h-4 w-4 mr-2" />
            Back to Store
          </Button>
          <Button variant="ghost" className="w-full" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-auto">
        {activeTab === 'overview' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle>Total Orders</CardTitle>
                  <CardDescription>
                    {user?.role === 'admin' ? "Today's orders" : "Your orders today"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {user?.role === 'admin' ? '24' : '8'}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Revenue</CardTitle>
                  <CardDescription>
                    {user?.role === 'admin' ? "Today's revenue" : "Your revenue today"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {user?.role === 'admin' ? '$1,234' : '$456'}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>
                    {user?.role === 'admin' ? 'Active Suppliers' : 'Active Products'}
                  </CardTitle>
                  <CardDescription>Currently active</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {user?.role === 'admin' ? '8' : '12'}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Order Management</h2>
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 border rounded-lg">
                    <div>
                      <p className="font-semibold">Order #1234</p>
                      <p className="text-sm text-gray-600">Artisanal Pizza - $14.99</p>
                      {user?.role === 'admin' && (
                        <p className="text-xs text-gray-500">From: Mario's Pizzeria</p>
                      )}
                    </div>
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                      Completed
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-4 border rounded-lg">
                    <div>
                      <p className="font-semibold">Order #1235</p>
                      <p className="text-sm text-gray-600">Gourmet Burger - $12.50</p>
                      {user?.role === 'admin' && (
                        <p className="text-xs text-gray-500">From: Burger House</p>
                      )}
                    </div>
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                      Preparing
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'suppliers' && user?.role === 'admin' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Supplier Management</h2>
            <Card>
              <CardHeader>
                <CardTitle>Active Suppliers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 border rounded-lg">
                    <div>
                      <p className="font-semibold">Mario's Pizzeria</p>
                      <p className="text-sm text-gray-600">Italian Cuisine</p>
                    </div>
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                      Active
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-4 border rounded-lg">
                    <div>
                      <p className="font-semibold">Sushi Master</p>
                      <p className="text-sm text-gray-600">Japanese Cuisine</p>
                    </div>
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                      Active
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'settings' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Settings</h2>
            <Card>
              <CardHeader>
                <CardTitle>{user?.role === 'admin' ? 'Application Settings' : 'Store Settings'}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {user?.role === 'admin' ? 'Restaurant Name' : 'Store Name'}
                    </label>
                    <input 
                      type="text" 
                      className="w-full p-2 border rounded-lg"
                      defaultValue={user?.role === 'admin' ? 'GourmetGo' : user?.storeName || ''}
                      disabled={user?.isGuest}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Contact Email
                    </label>
                    <input 
                      type="email" 
                      className="w-full p-2 border rounded-lg"
                      defaultValue={user?.email || ''}
                      disabled={user?.isGuest}
                    />
                  </div>
                  {user?.phoneNumber && (
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Phone Number
                      </label>
                      <input 
                        type="tel" 
                        className="w-full p-2 border rounded-lg"
                        defaultValue={user.phoneNumber}
                        disabled={user?.isGuest}
                      />
                    </div>
                  )}
                  {user?.location && (
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Location
                      </label>
                      <textarea 
                        className="w-full p-2 border rounded-lg"
                        defaultValue={user.location}
                        disabled={user?.isGuest}
                      />
                    </div>
                  )}
                  {!user?.isGuest && <Button>Save Settings</Button>}
                  {user?.isGuest && (
                    <p className="text-sm text-gray-500">
                      Settings are read-only for guest users. Create an account to edit settings.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

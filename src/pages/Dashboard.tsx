import { useState } from 'react';
import { 
  BarChart3, Package, Users, Settings, LogOut, Home, User, 
  MessageSquare, Bell, TrendingUp, Calendar, DollarSign, 
  ShoppingCart, Eye, Filter, Search, Plus, MoreVertical,
  Mail, Phone, MapPin, Clock, Star, Target, Activity
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { user, logout } = useAuth();

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'orders', label: 'Orders', icon: Package },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'suppliers', label: 'Suppliers', icon: Users, adminOnly: true },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
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
    <div className="h-screen flex bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Sidebar */}
      <div className="w-72 bg-white/80 backdrop-blur-xl border-r border-gray-200/50 flex flex-col shadow-xl">
        <div className="p-6 border-b border-gray-200/50">
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {user?.role === 'admin' ? 'Admin Dashboard' : 'Supplier Dashboard'}
          </h1>
          <div className="mt-3 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
              <span className="text-sm font-semibold text-gray-900">
                {user?.firstName} {user?.lastName}
              </span>
            </div>
            {user?.storeName && (
              <p className="text-xs text-gray-600 ml-10">Store: {user.storeName}</p>
            )}
            {user?.isGuest && (
              <Badge className="mt-2 bg-blue-100 text-blue-800 hover:bg-blue-200">
                Guest User
              </Badge>
            )}
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          {filteredMenuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                  activeTab === item.id
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg transform scale-105'
                    : 'hover:bg-gray-100 text-gray-700 hover:scale-102'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
                {item.id === 'messages' && (
                  <Badge className="ml-auto bg-red-500 text-white text-xs">3</Badge>
                )}
                {item.id === 'notifications' && (
                  <Badge className="ml-auto bg-orange-500 text-white text-xs">7</Badge>
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-200/50 space-y-2">
          <Button 
            variant="outline" 
            className="w-full rounded-xl border-gray-300 hover:bg-gray-50 transition-all duration-200"
            onClick={goHome}
          >
            <Home className="h-4 w-4 mr-2" />
            Back to Store
          </Button>
          <Button 
            variant="ghost" 
            className="w-full rounded-xl text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200" 
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-auto">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Dashboard Overview
              </h2>
              <div className="flex items-center space-x-3">
                <Button size="sm" className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 rounded-xl">
                  <Plus className="h-4 w-4 mr-2" />
                  Add New
                </Button>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-all duration-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-blue-700 flex items-center text-sm font-medium">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Total Orders
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-900">
                    {user?.role === 'admin' ? '147' : '23'}
                  </div>
                  <p className="text-xs text-blue-600 mt-1">+12% from last month</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-all duration-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-green-700 flex items-center text-sm font-medium">
                    <DollarSign className="h-4 w-4 mr-2" />
                    Revenue
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-900">
                    {user?.role === 'admin' ? '$12,543' : '$3,456'}
                  </div>
                  <p className="text-xs text-green-600 mt-1">+8.2% from last month</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-lg transition-all duration-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-purple-700 flex items-center text-sm font-medium">
                    <Users className="h-4 w-4 mr-2" />
                    {user?.role === 'admin' ? 'Active Suppliers' : 'Customers'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-900">
                    {user?.role === 'admin' ? '24' : '156'}
                  </div>
                  <p className="text-xs text-purple-600 mt-1">+5.1% from last month</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 hover:shadow-lg transition-all duration-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-orange-700 flex items-center text-sm font-medium">
                    <Target className="h-4 w-4 mr-2" />
                    Conversion Rate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-900">84.2%</div>
                  <p className="text-xs text-orange-600 mt-1">+2.3% from last month</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card className="bg-white/80 backdrop-blur-xl border-gray-200/50 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="h-5 w-5 mr-2" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <Package className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">New order received</p>
                          <p className="text-sm text-gray-600">Order #1234 - $42.50</p>
                        </div>
                      </div>
                      <span className="text-xs text-gray-500">2 min ago</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'messages' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold">Messages</h2>
              <Button className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl">
                <Plus className="h-4 w-4 mr-2" />
                New Message
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle className="text-lg">Conversations</CardTitle>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input className="pl-10 rounded-xl" placeholder="Search messages..." />
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="p-3 hover:bg-gray-50 rounded-xl cursor-pointer border border-gray-100">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900">Customer #{i}</span>
                        <span className="text-xs text-gray-500">2h</span>
                      </div>
                      <p className="text-sm text-gray-600 truncate">Last message preview...</p>
                      {i <= 2 && <Badge className="mt-1 bg-red-100 text-red-800">Unread</Badge>}
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Chat with Customer #1</span>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-gray-50 rounded-xl p-4 mb-4 overflow-y-auto">
                    <div className="space-y-3">
                      <div className="flex justify-start">
                        <div className="bg-white rounded-xl p-3 max-w-xs shadow-sm">
                          <p className="text-sm">Hello, I have a question about my order.</p>
                          <span className="text-xs text-gray-500">10:30 AM</span>
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <div className="bg-blue-500 text-white rounded-xl p-3 max-w-xs">
                          <p className="text-sm">Hi! I'd be happy to help. What's your order number?</p>
                          <span className="text-xs text-blue-100">10:32 AM</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Input className="flex-1 rounded-xl" placeholder="Type your message..." />
                    <Button className="bg-blue-500 hover:bg-blue-600 rounded-xl">Send</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">Notifications</h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Recent Notifications
                    <Button variant="ghost" size="sm">Mark all read</Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { type: 'order', message: 'New order received from John Doe', time: '5 min ago', unread: true },
                    { type: 'payment', message: 'Payment confirmed for order #1234', time: '1 hour ago', unread: true },
                    { type: 'review', message: 'New 5-star review received', time: '2 hours ago', unread: false },
                    { type: 'system', message: 'System maintenance scheduled', time: '1 day ago', unread: false },
                  ].map((notification, i) => (
                    <div key={i} className={`p-4 rounded-xl border ${notification.unread ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'}`}>
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            notification.type === 'order' ? 'bg-green-100' :
                            notification.type === 'payment' ? 'bg-blue-100' :
                            notification.type === 'review' ? 'bg-yellow-100' : 'bg-gray-100'
                          }`}>
                            {notification.type === 'order' && <Package className="h-4 w-4 text-green-600" />}
                            {notification.type === 'payment' && <DollarSign className="h-4 w-4 text-blue-600" />}
                            {notification.type === 'review' && <Star className="h-4 w-4 text-yellow-600" />}
                            {notification.type === 'system' && <Settings className="h-4 w-4 text-gray-600" />}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{notification.message}</p>
                            <p className="text-sm text-gray-600">{notification.time}</p>
                          </div>
                        </div>
                        {notification.unread && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Notification Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    'New orders',
                    'Payment confirmations',
                    'Customer messages',
                    'System updates',
                    'Marketing emails'
                  ].map((setting, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">{setting}</span>
                      <input type="checkbox" defaultChecked={i < 3} className="rounded" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">Analytics & Reports</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    Sales Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl flex items-center justify-center">
                    <p className="text-gray-500">Sales chart would go here</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { label: 'Average Order Value', value: '$34.50', change: '+12%' },
                    { label: 'Customer Retention', value: '78%', change: '+5%' },
                    { label: 'Order Fulfillment Time', value: '24 min', change: '-8%' },
                    { label: 'Customer Satisfaction', value: '4.8/5', change: '+0.2' },
                  ].map((metric, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <span className="text-sm text-gray-700">{metric.label}</span>
                      <div className="text-right">
                        <div className="font-semibold">{metric.value}</div>
                        <div className="text-xs text-green-600">{metric.change}</div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'calendar' && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">Calendar & Events</h2>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    Upcoming Events
                  </span>
                  <Button className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Event
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { title: 'Team Meeting', time: 'Today, 2:00 PM', type: 'meeting' },
                    { title: 'Product Launch', time: 'Tomorrow, 10:00 AM', type: 'event' },
                    { title: 'Supplier Review', time: 'Friday, 3:00 PM', type: 'review' },
                  ].map((event, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <div>
                          <p className="font-medium text-gray-900">{event.title}</p>
                          <p className="text-sm text-gray-600">{event.time}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
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

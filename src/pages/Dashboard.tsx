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
    <div className="h-screen flex bg-gradient-to-br from-slate-50 via-white to-gray-50">
      {/* Sidebar */}
      <div className="w-72 glass-morphism backdrop-blur-xl border-r border-gray-200/50 flex flex-col shadow-xl">
        <div className="p-6 border-b border-gray-200/50">
          <h1 className="text-xl font-bold text-black">
            {user?.role === 'admin' ? 'Admin Dashboard' : 'Supplier Dashboard'}
          </h1>
          <div className="mt-3 p-3 bg-black/5 backdrop-blur-sm rounded-xl border border-gray-200/50">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
              <span className="text-sm font-semibold text-black">
                {user?.firstName} {user?.lastName}
              </span>
            </div>
            {user?.storeName && (
              <p className="text-xs text-black/60 ml-10">Store: {user.storeName}</p>
            )}
            {user?.isGuest && (
              <Badge className="mt-2 bg-gray-100 text-black hover:bg-gray-200">
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
                    ? 'bg-black text-white shadow-lg transform scale-105'
                    : 'hover:bg-black/5 text-black hover:scale-102'
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
              <h2 className="text-3xl font-bold text-black">
                Dashboard Overview
              </h2>
              <div className="flex items-center space-x-3">
                <Button size="sm" className="bg-black hover:bg-gray-800 text-white rounded-xl">
                  <Plus className="h-4 w-4 mr-2" />
                  Add New
                </Button>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="glass-morphism border-gray-200/50 hover:shadow-lg transition-all duration-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-black flex items-center text-sm font-medium">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Total Orders
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-black">
                    {user?.role === 'admin' ? '147' : '23'}
                  </div>
                  <p className="text-xs text-black/60 mt-1">+12% from last month</p>
                </CardContent>
              </Card>

              <Card className="glass-morphism border-gray-200/50 hover:shadow-lg transition-all duration-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-black flex items-center text-sm font-medium">
                    <DollarSign className="h-4 w-4 mr-2" />
                    Revenue
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-black">
                    {user?.role === 'admin' ? '$12,543' : '$3,456'}
                  </div>
                  <p className="text-xs text-black/60 mt-1">+8.2% from last month</p>
                </CardContent>
              </Card>

              <Card className="glass-morphism border-gray-200/50 hover:shadow-lg transition-all duration-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-black flex items-center text-sm font-medium">
                    <Users className="h-4 w-4 mr-2" />
                    {user?.role === 'admin' ? 'Active Suppliers' : 'Customers'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-black">
                    {user?.role === 'admin' ? '24' : '156'}
                  </div>
                  <p className="text-xs text-black/60 mt-1">+5.1% from last month</p>
                </CardContent>
              </Card>

              <Card className="glass-morphism border-gray-200/50 hover:shadow-lg transition-all duration-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-black flex items-center text-sm font-medium">
                    <Target className="h-4 w-4 mr-2" />
                    Conversion Rate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-black">84.2%</div>
                  <p className="text-xs text-black/60 mt-1">+2.3% from last month</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card className="glass-morphism border-gray-200/50 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center text-black">
                  <Activity className="h-5 w-5 mr-2" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-black/5 rounded-xl">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-black/10 rounded-full flex items-center justify-center">
                          <Package className="h-4 w-4 text-black" />
                        </div>
                        <div>
                          <p className="font-medium text-black">New order received</p>
                          <p className="text-sm text-black/60">Order #1234 - $42.50</p>
                        </div>
                      </div>
                      <span className="text-xs text-black/50">2 min ago</span>
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
              <h2 className="text-3xl font-bold text-black">Messages</h2>
              <Button className="bg-black hover:bg-gray-800 text-white rounded-xl">
                <Plus className="h-4 w-4 mr-2" />
                New Message
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-1 glass-morphism border-gray-200/50">
                <CardHeader>
                  <CardTitle className="text-lg text-black">Conversations</CardTitle>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input className="pl-10 rounded-xl bg-white/70 border-gray-300" placeholder="Search messages..." />
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="p-3 hover:bg-black/5 rounded-xl cursor-pointer border border-gray-200/50">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-black">Customer #{i}</span>
                        <span className="text-xs text-black/50">2h</span>
                      </div>
                      <p className="text-sm text-black/60 truncate">Last message preview...</p>
                      {i <= 2 && <Badge className="mt-1 bg-red-100 text-red-800">Unread</Badge>}
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="lg:col-span-2 glass-morphism border-gray-200/50">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-black">
                    <span>Chat with Customer #1</span>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-black/5 rounded-xl p-4 mb-4 overflow-y-auto">
                    <div className="space-y-3">
                      <div className="flex justify-start">
                        <div className="bg-white rounded-xl p-3 max-w-xs shadow-sm border border-gray-200/50">
                          <p className="text-sm text-black">Hello, I have a question about my order.</p>
                          <span className="text-xs text-black/50">10:30 AM</span>
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <div className="bg-black text-white rounded-xl p-3 max-w-xs">
                          <p className="text-sm">Hi! I'd be happy to help. What's your order number?</p>
                          <span className="text-xs text-gray-300">10:32 AM</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Input className="flex-1 rounded-xl bg-white/70 border-gray-300" placeholder="Type your message..." />
                    <Button className="bg-black hover:bg-gray-800 text-white rounded-xl">Send</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-black">Notifications</h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2 glass-morphism border-gray-200/50">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-black">
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
                    <div key={i} className={`p-4 rounded-xl border ${notification.unread ? 'bg-black/5 border-black/20' : 'bg-gray-50 border-gray-200'}`}>
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
                            <p className="font-medium text-black">{notification.message}</p>
                            <p className="text-sm text-black/60">{notification.time}</p>
                          </div>
                        </div>
                        {notification.unread && (
                          <div className="w-2 h-2 bg-black rounded-full"></div>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="glass-morphism border-gray-200/50">
                <CardHeader>
                  <CardTitle className="text-black">Notification Settings</CardTitle>
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
                      <span className="text-sm text-black">{setting}</span>
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
            <h2 className="text-3xl font-bold text-black">Analytics & Reports</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="glass-morphism border-gray-200/50">
                <CardHeader>
                  <CardTitle className="flex items-center text-black">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    Sales Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-black/5 rounded-xl flex items-center justify-center">
                    <p className="text-black/50">Sales chart would go here</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-morphism border-gray-200/50">
                <CardHeader>
                  <CardTitle className="text-black">Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { label: 'Average Order Value', value: '$34.50', change: '+12%' },
                    { label: 'Customer Retention', value: '78%', change: '+5%' },
                    { label: 'Order Fulfillment Time', value: '24 min', change: '-8%' },
                    { label: 'Customer Satisfaction', value: '4.8/5', change: '+0.2' },
                  ].map((metric, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-black/5 rounded-xl">
                      <span className="text-sm text-black">{metric.label}</span>
                      <div className="text-right">
                        <div className="font-semibold text-black">{metric.value}</div>
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
            <h2 className="text-3xl font-bold text-black">Calendar & Events</h2>

            <Card className="glass-morphism border-gray-200/50">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-black">
                  <span className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    Upcoming Events
                  </span>
                  <Button className="bg-black hover:bg-gray-800 text-white rounded-xl">
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
                    <div key={i} className="flex items-center justify-between p-4 bg-black/5 rounded-xl">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-black rounded-full"></div>
                        <div>
                          <p className="font-medium text-black">{event.title}</p>
                          <p className="text-sm text-black/60">{event.time}</p>
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
            <h2 className="text-2xl font-bold mb-6 text-black">Order Management</h2>
            <Card className="glass-morphism border-gray-200/50">
              <CardHeader>
                <CardTitle className="text-black">Recent Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 border border-gray-200/50 rounded-lg">
                    <div>
                      <p className="font-semibold text-black">Order #1234</p>
                      <p className="text-sm text-black/60">Artisanal Pizza - $14.99</p>
                      {user?.role === 'admin' && (
                        <p className="text-xs text-black/50">From: Mario's Pizzeria</p>
                      )}
                    </div>
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                      Completed
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-4 border border-gray-200/50 rounded-lg">
                    <div>
                      <p className="font-semibold text-black">Order #1235</p>
                      <p className="text-sm text-black/60">Gourmet Burger - $12.50</p>
                      {user?.role === 'admin' && (
                        <p className="text-xs text-black/50">From: Burger House</p>
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
            <h2 className="text-2xl font-bold mb-6 text-black">Supplier Management</h2>
            <Card className="glass-morphism border-gray-200/50">
              <CardHeader>
                <CardTitle className="text-black">Active Suppliers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 border border-gray-200/50 rounded-lg">
                    <div>
                      <p className="font-semibold text-black">Mario's Pizzeria</p>
                      <p className="text-sm text-black/60">Italian Cuisine</p>
                    </div>
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                      Active
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-4 border border-gray-200/50 rounded-lg">
                    <div>
                      <p className="font-semibold text-black">Sushi Master</p>
                      <p className="text-sm text-black/60">Japanese Cuisine</p>
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
            <h2 className="text-2xl font-bold mb-6 text-black">Settings</h2>
            <Card className="glass-morphism border-gray-200/50">
              <CardHeader>
                <CardTitle className="text-black">{user?.role === 'admin' ? 'Application Settings' : 'Store Settings'}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-black">
                      {user?.role === 'admin' ? 'Restaurant Name' : 'Store Name'}
                    </label>
                    <input 
                      type="text" 
                      className="w-full p-2 border border-gray-300 rounded-lg bg-white/70"
                      defaultValue={user?.role === 'admin' ? 'GourmetGo' : user?.storeName || ''}
                      disabled={user?.isGuest}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-black">
                      Contact Email
                    </label>
                    <input 
                      type="email" 
                      className="w-full p-2 border border-gray-300 rounded-lg bg-white/70"
                      defaultValue={user?.email || ''}
                      disabled={user?.isGuest}
                    />
                  </div>
                  {user?.phoneNumber && (
                    <div>
                      <label className="block text-sm font-medium mb-2 text-black">
                        Phone Number
                      </label>
                      <input 
                        type="tel" 
                        className="w-full p-2 border border-gray-300 rounded-lg bg-white/70"
                        defaultValue={user.phoneNumber}
                        disabled={user?.isGuest}
                      />
                    </div>
                  )}
                  {user?.location && (
                    <div>
                      <label className="block text-sm font-medium mb-2 text-black">
                        Location
                      </label>
                      <textarea 
                        className="w-full p-2 border border-gray-300 rounded-lg bg-white/70"
                        defaultValue={user.location}
                        disabled={user?.isGuest}
                      />
                    </div>
                  )}
                  {!user?.isGuest && <Button className="bg-black hover:bg-gray-800 text-white">Save Settings</Button>}
                  {user?.isGuest && (
                    <p className="text-sm text-black/50">
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

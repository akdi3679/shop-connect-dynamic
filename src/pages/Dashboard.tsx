import { useState } from 'react';
import { 
  BarChart3, Package, Users, Settings, LogOut, Home, User, 
  MessageSquare, Bell, TrendingUp, Calendar, DollarSign, 
  ShoppingCart, Eye, Filter, Search, Plus, MoreVertical,
  Mail, Phone, MapPin, Clock, Star, Target, Activity, Upload, Save, Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ProductManagement } from '@/components/ProductManagement';
import { Analytics } from '@/components/Analytics';
import { useProducts } from '@/contexts/ProductContext';
import { toast } from 'sonner';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { user, logout } = useAuth();
  const { messages, markMessageAsRead, addMessage } = useProducts();
  const [selectedMessage, setSelectedMessage] = useState<number | null>(null);
  const [newMessageText, setNewMessageText] = useState('');
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDate, setNewEventDate] = useState('');
  const [newEventTime, setNewEventTime] = useState('');
  const [events, setEvents] = useState([
    { id: 1, title: 'Team Meeting', time: 'Today, 2:00 PM', type: 'meeting' },
    { id: 2, title: 'Product Launch', time: 'Tomorrow, 10:00 AM', type: 'event' },
    { id: 3, title: 'Supplier Review', time: 'Friday, 3:00 PM', type: 'review' },
  ]);
  const [suppliers, setSuppliers] = useState([
    { id: 1, name: "Mario's Pizzeria", cuisine: 'Italian Cuisine', status: 'Active', phone: '+1 234-567-8901', email: 'mario@pizzeria.com', location: 'Downtown District' },
    { id: 2, name: "Sushi Master", cuisine: 'Japanese Cuisine', status: 'Active', phone: '+1 234-567-8902', email: 'info@sushimaster.com', location: 'City Center' },
    { id: 3, name: "Burger House", cuisine: 'American Cuisine', status: 'Active', phone: '+1 234-567-8903', email: 'orders@burgerhouse.com', location: 'Mall Area' },
  ]);
  const [selectedSupplier, setSelectedSupplier] = useState<number | null>(null);
  const [supplierMessageText, setSupplierMessageText] = useState('');
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'New Order Received', message: 'Order #1234 has been placed', time: '5 min ago', type: 'order', isRead: false },
    { id: 2, title: 'Payment Confirmed', message: 'Payment for Order #1233 received', time: '15 min ago', type: 'payment', isRead: false },
    { id: 3, title: 'Supplier Update', message: 'Mario\'s Pizzeria updated their menu', time: '1 hour ago', type: 'update', isRead: true },
    { id: 4, title: 'System Maintenance', message: 'Scheduled maintenance tonight at 2 AM', time: '2 hours ago', type: 'system', isRead: false },
    { id: 5, title: 'New Review', message: 'Customer left a 5-star review', time: '3 hours ago', type: 'review', isRead: true },
    { id: 6, title: 'Low Stock Alert', message: 'Pizza dough running low', time: '4 hours ago', type: 'alert', isRead: false },
    { id: 7, title: 'Weekly Report', message: 'Your weekly performance report is ready', time: '1 day ago', type: 'report', isRead: true },
  ]);
  const [settings, setSettings] = useState({
    restaurantName: user?.role === 'admin' ? 'GourmetGo' : user?.storeName || '',
    email: user?.email || '',
    phone: user?.phoneNumber || '',
    location: user?.location || '',
    notifications: {
      orders: true,
      payments: true,
      messages: true,
      updates: false,
      marketing: false
    }
  });

  const unreadMessages = messages.filter(m => !m.isRead);
  const unreadNotifications = notifications.filter(n => !n.isRead);

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'orders', label: 'Orders', icon: Package },
    { id: 'products', label: 'Products', icon: Package, adminOnly: true },
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
    toast.success('Logged out successfully');
    setTimeout(() => {
      window.location.href = '/';
    }, 1000);
  };

  const filteredMenuItems = menuItems.filter(item => 
    !item.adminOnly || user?.role === 'admin'
  );

  const handleSendMessage = () => {
    if (newMessageText.trim() && selectedMessage) {
      const selectedMsg = messages.find(m => m.id === selectedMessage);
      if (selectedMsg) {
        addMessage({
          customerName: 'Support Team',
          customerId: selectedMsg.customerId,
          message: newMessageText
        });
        setNewMessageText('');
        toast.success('Message sent successfully');
      }
    }
  };

  const handleMarkAllRead = () => {
    messages.filter(m => !m.isRead).forEach(message => {
      markMessageAsRead(message.id);
    });
    toast.success('All messages marked as read');
  };

  const handleAddEvent = () => {
    if (newEventTitle.trim() && newEventDate && newEventTime) {
      const newEvent = {
        id: events.length + 1,
        title: newEventTitle,
        time: `${newEventDate}, ${newEventTime}`,
        type: 'event'
      };
      setEvents([...events, newEvent]);
      setNewEventTitle('');
      setNewEventDate('');
      setNewEventTime('');
      toast.success('Event added successfully');
    } else {
      toast.error('Please fill in all event details');
    }
  };

  const handleMessageSupplier = (supplierId: number) => {
    const supplier = suppliers.find(s => s.id === supplierId);
    if (supplier) {
      // Check if conversation already exists
      const existingConversation = messages.find(m => m.customerId === supplierId + 1000);
      if (!existingConversation) {
        // Create a new message thread with the supplier
        addMessage({
          customerName: supplier.name,
          customerId: supplierId + 1000, // Use a unique ID for suppliers
          message: `Started conversation with ${supplier.name}`
        });
      }
      
      // Switch to messages tab and select this conversation
      setActiveTab('messages');
      
      // Find the newly created or existing message and select it
      setTimeout(() => {
        const newMessage = messages.find(m => m.customerId === supplierId + 1000);
        if (newMessage) {
          setSelectedMessage(newMessage.id);
        }
      }, 100);
      
      toast.success(`Started conversation with ${supplier.name}`);
    }
  };

  const handleSendSupplierMessage = () => {
    if (supplierMessageText.trim() && selectedSupplier) {
      const supplier = suppliers.find(s => s.id === selectedSupplier);
      if (supplier) {
        addMessage({
          customerName: supplier.name,
          customerId: selectedSupplier + 1000,
          message: supplierMessageText
        });
        setSupplierMessageText('');
        toast.success(`Message sent to ${supplier.name}`);
      }
    }
  };

  const handleSaveSettings = () => {
    if (user?.isGuest) {
      toast.error('Settings cannot be saved for guest users');
      return;
    }
    
    toast.success('Settings saved successfully');
  };

  const handleNotificationToggle = (key: string) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: !prev.notifications[key as keyof typeof prev.notifications]
      }
    }));
  };

  const markNotificationAsRead = (notificationId: number) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    );
    toast.success('All notifications marked as read');
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'order': return <ShoppingCart className="h-4 w-4" />;
      case 'payment': return <DollarSign className="h-4 w-4" />;
      case 'update': return <Bell className="h-4 w-4" />;
      case 'system': return <Settings className="h-4 w-4" />;
      case 'review': return <Star className="h-4 w-4" />;
      case 'alert': return <Bell className="h-4 w-4" />;
      case 'report': return <BarChart3 className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

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
                {item.id === 'messages' && unreadMessages.length > 0 && (
                  <Badge className="ml-auto bg-red-500 text-white text-xs">{unreadMessages.length}</Badge>
                )}
                {item.id === 'notifications' && unreadNotifications.length > 0 && (
                  <Badge className="ml-auto bg-orange-500 text-white text-xs">{unreadNotifications.length}</Badge>
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
                <Button 
                  size="sm" 
                  className="bg-black hover:bg-gray-800 text-white rounded-xl"
                  onClick={() => {
                    toast.success('New item added successfully');
                  }}
                >
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
                  {[
                    { type: 'order', message: 'New order received', details: 'Order #1234 - $42.50', time: '2 min ago' },
                    { type: 'payment', message: 'Payment confirmed', details: 'Order #1233 - $28.75', time: '15 min ago' },
                    { type: 'message', message: 'New customer message', details: 'Question about delivery', time: '1 hour ago' }
                  ].map((activity, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-black/5 rounded-xl">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-black/10 rounded-full flex items-center justify-center">
                          {activity.type === 'order' && <Package className="h-4 w-4 text-black" />}
                          {activity.type === 'payment' && <DollarSign className="h-4 w-4 text-black" />}
                          {activity.type === 'message' && <MessageSquare className="h-4 w-4 text-black" />}
                        </div>
                        <div>
                          <p className="font-medium text-black">{activity.message}</p>
                          <p className="text-sm text-black/60">{activity.details}</p>
                        </div>
                      </div>
                      <span className="text-xs text-black/50">{activity.time}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'products' && user?.role === 'admin' && (
          <ProductManagement />
        )}

        {activeTab === 'analytics' && (
          <Analytics />
        )}

        {activeTab === 'notifications' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold text-black">Notifications</h2>
              <Button 
                className="bg-black hover:bg-gray-800 text-white rounded-xl"
                onClick={markAllNotificationsAsRead}
                disabled={unreadNotifications.length === 0}
              >
                Mark All Read
              </Button>
            </div>

            <Card className="glass-morphism border-gray-200/50">
              <CardHeader>
                <CardTitle className="text-black">Recent Notifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {notifications.map((notification) => (
                  <div 
                    key={notification.id}
                    className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                      notification.isRead 
                        ? 'border-gray-200/50 bg-white/50' 
                        : 'border-orange-200 bg-orange-50/50'
                    }`}
                    onClick={() => markNotificationAsRead(notification.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          notification.isRead ? 'bg-gray-100' : 'bg-orange-100'
                        }`}>
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <p className="font-semibold text-black">{notification.title}</p>
                            {!notification.isRead && (
                              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                            )}
                          </div>
                          <p className="text-sm text-black/70 mt-1">{notification.message}</p>
                          <p className="text-xs text-black/50 mt-2">{notification.time}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'messages' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold text-black">Messages</h2>
              <Button 
                className="bg-black hover:bg-gray-800 text-white rounded-xl"
                onClick={handleMarkAllRead}
                disabled={unreadMessages.length === 0}
              >
                Mark All Read
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
                  {messages.map((message) => (
                    <div 
                      key={message.id} 
                      className={`p-3 hover:bg-black/5 rounded-xl cursor-pointer border border-gray-200/50 transition-all duration-200 ${
                        selectedMessage === message.id ? 'bg-black/10 border-black/20' : ''
                      }`}
                      onClick={() => {
                        setSelectedMessage(message.id);
                        if (!message.isRead) {
                          markMessageAsRead(message.id);
                        }
                      }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-black">{message.customerName}</span>
                        <span className="text-xs text-black/50">
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-sm text-black/60 truncate">{message.message}</p>
                      {!message.isRead && <Badge className="mt-1 bg-red-100 text-red-800">Unread</Badge>}
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="lg:col-span-2 glass-morphism border-gray-200/50">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-black">
                    <span>
                      {selectedMessage ? `Chat with ${messages.find(m => m.id === selectedMessage)?.customerName}` : 'Select a conversation'}
                    </span>
                    {selectedMessage && (
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedMessage ? (
                    <>
                      <div className="h-64 bg-black/5 rounded-xl p-4 mb-4 overflow-y-auto">
                        <div className="space-y-3">
                          {messages
                            .filter(m => m.customerId === messages.find(msg => msg.id === selectedMessage)?.customerId)
                            .map((msg, index) => (
                            <div key={index} className={`flex ${msg.customerId === 0 ? 'justify-end' : 'justify-start'}`}>
                              <div className={`rounded-xl p-3 max-w-xs ${
                                msg.customerId === 0 ? 'bg-black text-white' : 'bg-white shadow-sm border border-gray-200/50'
                              }`}>
                                <p className="text-sm">{msg.message}</p>
                                <span className={`text-xs ${msg.customerId === 0 ? 'text-gray-300' : 'text-black/50'}`}>
                                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Input 
                          className="flex-1 rounded-xl bg-white/70 border-gray-300" 
                          placeholder="Type your message..."
                          value={newMessageText}
                          onChange={(e) => setNewMessageText(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        />
                        <Button 
                          className="bg-black hover:bg-gray-800 text-white rounded-xl"
                          onClick={handleSendMessage}
                          disabled={!newMessageText.trim()}
                        >
                          Send
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="h-64 flex items-center justify-center text-gray-500">
                      <p>Select a conversation to start chatting</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'suppliers' && user?.role === 'admin' && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-black">Supplier Management</h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2 glass-morphism border-gray-200/50">
                <CardHeader>
                  <CardTitle className="text-black">Active Suppliers</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {suppliers.map((supplier) => (
                    <div 
                      key={supplier.id}
                      className={`p-4 border rounded-xl transition-all duration-200 ${
                        selectedSupplier === supplier.id 
                          ? 'border-black bg-black/5' 
                          : 'border-gray-200/50 hover:bg-black/5'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="font-semibold text-black text-lg">{supplier.name}</p>
                          <p className="text-sm text-black/60">{supplier.cuisine}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-3 py-1 rounded-full text-sm ${
                            supplier.status === 'Active' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {supplier.status}
                          </span>
                          <Button
                            size="sm"
                            className="bg-black hover:bg-gray-800 text-white rounded-lg"
                            onClick={() => handleMessageSupplier(supplier.id)}
                          >
                            <MessageSquare className="h-4 w-4 mr-1" />
                            Message
                          </Button>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4 text-gray-500" />
                          <span className="text-black/70">{supplier.phone}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Mail className="h-4 w-4 text-gray-500" />
                          <span className="text-black/70">{supplier.email}</span>
                        </div>
                        <div className="flex items-center space-x-2 col-span-2">
                          <MapPin className="h-4 w-4 text-gray-500" />
                          <span className="text-black/70">{supplier.location}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="glass-morphism border-gray-200/50">
                <CardHeader>
                  <CardTitle className="text-black">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button className="w-full bg-black hover:bg-gray-800 text-white rounded-xl">
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Supplier
                  </Button>
                  <Button variant="outline" className="w-full rounded-xl border-gray-300">
                    <Upload className="h-4 w-4 mr-2" />
                    Import Suppliers
                  </Button>
                  <Button variant="outline" className="w-full rounded-xl border-gray-300">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    View Reports
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'calendar' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold text-black">Calendar & Events</h2>
              <div className="flex space-x-2">
                <Input 
                  className="rounded-xl bg-white/70 border-gray-300"
                  placeholder="Event title"
                  value={newEventTitle}
                  onChange={(e) => setNewEventTitle(e.target.value)}
                />
                <Input 
                  type="date"
                  className="rounded-xl bg-white/70 border-gray-300"
                  value={newEventDate}
                  onChange={(e) => setNewEventDate(e.target.value)}
                />
                <Input 
                  type="time"
                  className="rounded-xl bg-white/70 border-gray-300"
                  value={newEventTime}
                  onChange={(e) => setNewEventTime(e.target.value)}
                />
                <Button 
                  className="bg-black hover:bg-gray-800 text-white rounded-xl"
                  onClick={handleAddEvent}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Event
                </Button>
              </div>
            </div>

            <Card className="glass-morphism border-gray-200/50">
              <CardHeader>
                <CardTitle className="flex items-center text-black">
                  <Calendar className="h-5 w-5 mr-2" />
                  Upcoming Events
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {events.map((event) => (
                    <div key={event.id} className="flex items-center justify-between p-4 bg-black/5 rounded-xl">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-black rounded-full"></div>
                        <div>
                          <p className="font-medium text-black">{event.title}</p>
                          <p className="text-sm text-black/60">{event.time}</p>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          setEvents(events.filter(e => e.id !== event.id));
                          toast.success('Event removed');
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
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

        {activeTab === 'settings' && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-black">Settings</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="glass-morphism border-gray-200/50">
                <CardHeader>
                  <CardTitle className="text-black">
                    {user?.role === 'admin' ? 'Application Settings' : 'Store Settings'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-black">
                      {user?.role === 'admin' ? 'Restaurant Name' : 'Store Name'}
                    </label>
                    <Input 
                      type="text" 
                      className="w-full rounded-xl bg-white/70 border-gray-300"
                      value={settings.restaurantName}
                      onChange={(e) => setSettings(prev => ({ ...prev, restaurantName: e.target.value }))}
                      disabled={user?.isGuest}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-black">
                      Contact Email
                    </label>
                    <Input 
                      type="email" 
                      className="w-full rounded-xl bg-white/70 border-gray-300"
                      value={settings.email}
                      onChange={(e) => setSettings(prev => ({ ...prev, email: e.target.value }))}
                      disabled={user?.isGuest}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-black">
                      Phone Number
                    </label>
                    <Input 
                      type="tel" 
                      className="w-full rounded-xl bg-white/70 border-gray-300"
                      value={settings.phone}
                      onChange={(e) => setSettings(prev => ({ ...prev, phone: e.target.value }))}
                      disabled={user?.isGuest}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-black">
                      Location
                    </label>
                    <Input 
                      className="w-full rounded-xl bg-white/70 border-gray-300"
                      value={settings.location}
                      onChange={(e) => setSettings(prev => ({ ...prev, location: e.target.value }))}
                      disabled={user?.isGuest}
                    />
                  </div>
                  <div className="pt-4">
                    {!user?.isGuest ? (
                      <Button 
                        className="bg-black hover:bg-gray-800 text-white rounded-xl"
                        onClick={handleSaveSettings}
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Save Settings
                      </Button>
                    ) : (
                      <p className="text-sm text-black/50">
                        Settings are read-only for guest users. Create an account to edit settings.
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-morphism border-gray-200/50">
                <CardHeader>
                  <CardTitle className="text-black">Notification Preferences</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(settings.notifications).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between p-3 bg-black/5 rounded-xl">
                      <span className="text-sm text-black capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      <input 
                        type="checkbox" 
                        checked={value}
                        onChange={() => handleNotificationToggle(key)}
                        className="rounded" 
                        disabled={user?.isGuest}
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

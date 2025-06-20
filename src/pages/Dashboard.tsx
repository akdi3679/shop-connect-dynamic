
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Bell, 
  Users, 
  MessageSquare, 
  Settings, 
  Package, 
  TrendingUp, 
  DollarSign,
  Star,
  Clock,
  Check,
  Send,
  User,
  Trash2
} from 'lucide-react';
import { toast } from 'sonner';

interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  type: 'order' | 'message' | 'system';
}

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'supplier';
  timestamp: Date;
  supplierId: string;
  supplierName: string;
}

interface Conversation {
  id: string;
  supplierId: string;
  supplierName: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  messages: Message[];
}

interface Supplier {
  id: string;
  name: string;
  category: string;
  location: string;
  rating: number;
  orders: number;
  revenue: number;
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'New Order',
      message: 'Order #1234 has been placed',
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      read: false,
      type: 'order'
    },
    {
      id: '2',
      title: 'Supplier Message',
      message: 'Mario\'s Pizzeria sent you a message',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      read: false,
      type: 'message'
    },
    {
      id: '3',
      title: 'System Update',
      message: 'Your dashboard has been updated with new features',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      read: true,
      type: 'system'
    }
  ]);

  const [suppliers, setSuppliers] = useState<Supplier[]>([
    {
      id: '1',
      name: 'Mario\'s Pizzeria',
      category: 'Italian',
      location: 'Downtown',
      rating: 4.8,
      orders: 245,
      revenue: 12450
    },
    {
      id: '2',
      name: 'Sushi Master',
      category: 'Japanese',
      location: 'City Center',
      rating: 4.9,
      orders: 189,
      revenue: 15680
    },
    {
      id: '3',
      name: 'Burger House',
      category: 'American',
      location: 'Mall Area',
      rating: 4.6,
      orders: 312,
      revenue: 8900
    }
  ]);

  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: '1',
      supplierId: '1',
      supplierName: 'Mario\'s Pizzeria',
      lastMessage: 'Thank you for your order!',
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 30),
      unreadCount: 2,
      messages: [
        {
          id: '1',
          text: 'Hello! How can we help you today?',
          sender: 'supplier',
          timestamp: new Date(Date.now() - 1000 * 60 * 60),
          supplierId: '1',
          supplierName: 'Mario\'s Pizzeria'
        },
        {
          id: '2',
          text: 'I wanted to ask about delivery times',
          sender: 'user',
          timestamp: new Date(Date.now() - 1000 * 60 * 45),
          supplierId: '1',
          supplierName: 'Mario\'s Pizzeria'
        },
        {
          id: '3',
          text: 'Thank you for your order!',
          sender: 'supplier',
          timestamp: new Date(Date.now() - 1000 * 60 * 30),
          supplierId: '1',
          supplierName: 'Mario\'s Pizzeria'
        }
      ]
    }
  ]);

  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');

  const unreadNotifications = notifications.filter(n => !n.read).length;
  const totalUnreadMessages = conversations.reduce((sum, conv) => sum + conv.unreadCount, 0);

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(notification => ({ ...notification, read: true })));
    toast.success('All notifications marked as read');
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
    toast.success('Notification deleted');
  };

  const createConversationWithSupplier = (supplier: Supplier) => {
    const existingConversation = conversations.find(conv => conv.supplierId === supplier.id);
    
    if (existingConversation) {
      setSelectedConversation(existingConversation.id);
      setActiveTab('messages');
      return;
    }

    const newConversation: Conversation = {
      id: Date.now().toString(),
      supplierId: supplier.id,
      supplierName: supplier.name,
      lastMessage: 'Conversation started',
      lastMessageTime: new Date(),
      unreadCount: 0,
      messages: [
        {
          id: Date.now().toString(),
          text: `Hello! I'm interested in your ${supplier.category.toLowerCase()} cuisine. How can you help me?`,
          sender: 'user',
          timestamp: new Date(),
          supplierId: supplier.id,
          supplierName: supplier.name
        }
      ]
    };

    setConversations(prev => [newConversation, ...prev]);
    setSelectedConversation(newConversation.id);
    setActiveTab('messages');
    toast.success(`Started conversation with ${supplier.name}`);
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const conversation = conversations.find(conv => conv.id === selectedConversation);
    if (!conversation) return;

    const message: Message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: 'user',
      timestamp: new Date(),
      supplierId: conversation.supplierId,
      supplierName: conversation.supplierName
    };

    setConversations(prev => 
      prev.map(conv => 
        conv.id === selectedConversation
          ? {
              ...conv,
              messages: [...conv.messages, message],
              lastMessage: newMessage,
              lastMessageTime: new Date()
            }
          : conv
      )
    );

    setNewMessage('');

    // Simulate supplier response
    setTimeout(() => {
      const responses = [
        "Thank you for your message! We'll get back to you shortly.",
        "Great to hear from you! How can we help?",
        "We appreciate your interest. What would you like to know?",
        "Thanks for reaching out! We're here to help.",
        "Hello! We're excited to work with you."
      ];

      const supplierMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: responses[Math.floor(Math.random() * responses.length)],
        sender: 'supplier',
        timestamp: new Date(),
        supplierId: conversation.supplierId,
        supplierName: conversation.supplierName
      };

      setConversations(prev => 
        prev.map(conv => 
          conv.id === selectedConversation
            ? {
                ...conv,
                messages: [...conv.messages, supplierMessage],
                lastMessage: supplierMessage.text,
                lastMessageTime: new Date(),
                unreadCount: conv.unreadCount + 1
              }
            : conv
        )
      );
    }, 1500);
  };

  const selectConversation = (conversationId: string) => {
    setSelectedConversation(conversationId);
    
    // Mark as read
    setConversations(prev => 
      prev.map(conv => 
        conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv
      )
    );
  };

  const selectedConv = conversations.find(conv => conv.id === selectedConversation);

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your GourmetGo experience</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Notifications
              {unreadNotifications > 0 && (
                <Badge variant="destructive" className="text-xs">
                  {unreadNotifications}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="messages" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Messages
              {totalUnreadMessages > 0 && (
                <Badge variant="destructive" className="text-xs">
                  {totalUnreadMessages}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="suppliers" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Suppliers
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,234</div>
                  <p className="text-xs text-muted-foreground">+12% from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$45,231</div>
                  <p className="text-xs text-muted-foreground">+8% from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Suppliers</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12</div>
                  <p className="text-xs text-muted-foreground">+2 new this month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
                  <Star className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">4.8</div>
                  <p className="text-xs text-muted-foreground">+0.2 from last month</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest orders and interactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">Order #1234 delivered</p>
                      <p className="text-xs text-muted-foreground">2 minutes ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">New message from Mario's Pizzeria</p>
                      <p className="text-xs text-muted-foreground">15 minutes ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">Order #1233 confirmed</p>
                      <p className="text-xs text-muted-foreground">1 hour ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Notifications</CardTitle>
                  <CardDescription>Stay updated with your latest activities</CardDescription>
                </div>
                {unreadNotifications > 0 && (
                  <Button variant="outline" size="sm" onClick={markAllNotificationsAsRead}>
                    Mark all as read
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96">
                  <div className="space-y-4">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`flex items-start space-x-4 p-4 rounded-lg border transition-colors ${
                          notification.read ? 'bg-gray-50' : 'bg-blue-50 border-blue-200'
                        }`}
                      >
                        <div className="flex-shrink-0">
                          {notification.type === 'order' && <Package className="h-5 w-5 text-green-500" />}
                          {notification.type === 'message' && <MessageSquare className="h-5 w-5 text-blue-500" />}
                          {notification.type === 'system' && <Settings className="h-5 w-5 text-gray-500" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-medium text-gray-900">{notification.title}</h4>
                            <div className="flex items-center space-x-2">
                              {!notification.read && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => markNotificationAsRead(notification.id)}
                                  className="text-xs"
                                >
                                  <Check className="h-3 w-3" />
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteNotification(notification.id)}
                                className="text-xs text-red-600 hover:text-red-800"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                          <div className="flex items-center mt-2 text-xs text-gray-500">
                            <Clock className="h-3 w-3 mr-1" />
                            {notification.timestamp.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="messages" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle className="text-lg">Conversations</CardTitle>
                  <CardDescription>Your message threads</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <ScrollArea className="h-[500px]">
                    <div className="space-y-2 p-4">
                      {conversations.map((conversation) => (
                        <div
                          key={conversation.id}
                          onClick={() => selectConversation(conversation.id)}
                          className={`p-3 rounded-lg cursor-pointer transition-colors ${
                            selectedConversation === conversation.id
                              ? 'bg-blue-100 border-blue-200'
                              : 'hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-sm">{conversation.supplierName}</h4>
                            {conversation.unreadCount > 0 && (
                              <Badge variant="destructive" className="text-xs">
                                {conversation.unreadCount}
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-gray-600 mt-1 truncate">
                            {conversation.lastMessage}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {conversation.lastMessageTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      ))}
                      {conversations.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                          <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                          <p>No conversations yet</p>
                          <p className="text-sm mt-1">Start messaging suppliers from the Suppliers tab</p>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-lg">
                    {selectedConv ? selectedConv.supplierName : 'Select a conversation'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col h-[500px]">
                  {selectedConv ? (
                    <>
                      <ScrollArea className="flex-1 mb-4">
                        <div className="space-y-4 p-4">
                          {selectedConv.messages.map((message) => (
                            <div
                              key={message.id}
                              className={`flex ${
                                message.sender === 'user' ? 'justify-end' : 'justify-start'
                              }`}
                            >
                              <div
                                className={`max-w-[80%] p-3 rounded-lg ${
                                  message.sender === 'user'
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-100 text-gray-900'
                                }`}
                              >
                                <p className="text-sm">{message.text}</p>
                                <p className={`text-xs mt-1 ${
                                  message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                                }`}>
                                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                      <div className="flex space-x-2">
                        <Input
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          placeholder="Type your message..."
                          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                          className="flex-1"
                        />
                        <Button onClick={sendMessage} size="icon">
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="flex-1 flex items-center justify-center text-gray-500">
                      <div className="text-center">
                        <MessageSquare className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                        <p className="text-lg">Select a conversation to start messaging</p>
                        <p className="text-sm mt-2">Choose from your existing conversations or start a new one from the Suppliers tab</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="suppliers" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Partner Suppliers</CardTitle>
                <CardDescription>Manage your supplier relationships</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {suppliers.map((supplier) => (
                    <Card key={supplier.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-semibold">{supplier.name}</h3>
                          <Badge variant="secondary">{supplier.category}</Badge>
                        </div>
                        <div className="space-y-2 text-sm text-gray-600">
                          <div className="flex items-center justify-between">
                            <span>Location:</span>
                            <span>{supplier.location}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Rating:</span>
                            <div className="flex items-center">
                              <Star className="h-4 w-4 text-yellow-400 mr-1" />
                              <span>{supplier.rating}</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Orders:</span>
                            <span>{supplier.orders}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Revenue:</span>
                            <span>${supplier.revenue.toLocaleString()}</span>
                          </div>
                        </div>
                        <div className="mt-4 flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex-1"
                            onClick={() => createConversationWithSupplier(supplier)}
                          >
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Message
                          </Button>
                          <Button variant="outline" size="sm">
                            <User className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

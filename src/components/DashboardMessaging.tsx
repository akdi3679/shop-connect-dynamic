
import { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, User, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useProducts } from '@/contexts/ProductContext';

export const DashboardMessaging = () => {
  const { messages, markMessageAsRead, addMessage } = useProducts();
  const [selectedCustomer, setSelectedCustomer] = useState<number | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const customers = Array.from(new Set(messages.map(m => m.customerId))).map(id => {
    const customerMessages = messages.filter(m => m.customerId === id);
    const latestMessage = customerMessages[0];
    const unreadCount = customerMessages.filter(m => !m.isRead).length;
    
    return {
      id,
      name: latestMessage.customerName,
      latestMessage: latestMessage.message,
      timestamp: latestMessage.timestamp,
      unreadCount
    };
  });

  const selectedCustomerMessages = selectedCustomer 
    ? messages.filter(m => m.customerId === selectedCustomer).reverse()
    : [];

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedCustomer) return;

    const customer = customers.find(c => c.id === selectedCustomer);
    if (!customer) return;

    addMessage({
      customerName: customer.name,
      customerId: selectedCustomer,
      message: newMessage
    });

    setNewMessage('');
  };

  const selectCustomer = (customerId: number) => {
    setSelectedCustomer(customerId);
    // Mark all messages from this customer as read
    messages
      .filter(m => m.customerId === customerId && !m.isRead)
      .forEach(m => markMessageAsRead(m.id));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        Customer Messages
      </h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-96">
        {/* Customer List */}
        <Card className="bg-gradient-to-br from-white to-gray-50 border-gray-200/50 shadow-lg">
          <CardHeader>
            <CardTitle className="text-gray-800 flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Conversations
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-80">
              <div className="space-y-2 p-4">
                {customers.map((customer) => (
                  <div
                    key={customer.id}
                    onClick={() => selectCustomer(customer.id)}
                    className={`p-3 rounded-lg cursor-pointer transition-all duration-300 ${
                      selectedCustomer === customer.id
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                        : 'bg-white hover:bg-gray-50 border border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center">
                          <User className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{customer.name}</p>
                          <p className={`text-xs truncate w-32 ${
                            selectedCustomer === customer.id ? 'text-blue-100' : 'text-gray-500'
                          }`}>
                            {customer.latestMessage}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        {customer.unreadCount > 0 && (
                          <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
                            {customer.unreadCount}
                          </span>
                        )}
                        <p className={`text-xs mt-1 ${
                          selectedCustomer === customer.id ? 'text-blue-100' : 'text-gray-400'
                        }`}>
                          {customer.timestamp.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Chat Area */}
        <div className="lg:col-span-2">
          <Card className="bg-gradient-to-br from-white to-gray-50 border-gray-200/50 shadow-lg h-full flex flex-col">
            {selectedCustomer ? (
              <>
                <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    {customers.find(c => c.id === selectedCustomer)?.name}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="flex-1 flex flex-col p-0">
                  <ScrollArea className="flex-1 p-4">
                    <div className="space-y-4">
                      {selectedCustomerMessages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.customerId === selectedCustomer ? 'justify-start' : 'justify-end'}`}
                        >
                          <div className={`max-w-[80%] p-3 rounded-2xl shadow-sm ${
                            message.customerId === selectedCustomer
                              ? 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800'
                              : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                          }`}>
                            <p className="text-sm">{message.message}</p>
                            <div className="flex items-center gap-1 mt-1">
                              <Clock className="h-3 w-3 opacity-60" />
                              <p className="text-xs opacity-60">
                                {message.timestamp.toLocaleTimeString([], { 
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                                })}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </div>
                  </ScrollArea>
                  
                  <div className="p-4 border-t bg-gray-50">
                    <div className="flex space-x-2">
                      <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your reply..."
                        className="flex-1 rounded-full border-gray-300 focus:border-blue-400"
                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      />
                      <Button 
                        onClick={sendMessage}
                        size="icon"
                        className="rounded-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </>
            ) : (
              <CardContent className="flex-1 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Select a conversation to start messaging</p>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

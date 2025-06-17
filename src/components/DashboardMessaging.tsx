
import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useProducts } from '@/contexts/ProductContext';
import { Send, MessageCircle, Clock, CheckCircle, User, Store } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export const DashboardMessaging = () => {
  const { messages, markMessageAsRead, addMessage } = useProducts();
  const [selectedMessage, setSelectedMessage] = useState<number | null>(null);
  const [replyText, setReplyText] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [newCustomerName, setNewCustomerName] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedMessage]);

  const handleMessageSelect = (messageId: number) => {
    setSelectedMessage(messageId);
    markMessageAsRead(messageId);
  };

  const handleSendReply = () => {
    if (!replyText.trim() || !selectedMessage) return;

    const originalMessage = messages.find(m => m.id === selectedMessage);
    if (!originalMessage) return;

    // Add reply as a new message
    addMessage({
      customerName: 'Store Owner',
      customerId: 0, // Store owner ID
      message: `Reply: ${replyText}`
    });

    setReplyText('');
  };

  const handleSendNewMessage = () => {
    if (!newMessage.trim() || !newCustomerName.trim()) return;

    addMessage({
      customerName: newCustomerName,
      customerId: Date.now(), // Generate unique customer ID
      message: newMessage
    });

    setNewMessage('');
    setNewCustomerName('');
  };

  const unreadCount = messages.filter(m => !m.isRead).length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <h2 className="text-3xl font-bold text-black">Messages</h2>
          {unreadCount > 0 && (
            <Badge variant="destructive" className="animate-pulse">
              {unreadCount} unread
            </Badge>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
        {/* Messages List */}
        <Card className="glass-morphism border-gray-200/50 lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-black flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Conversations
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[500px]">
              <div className="space-y-2 p-4">
                {messages.map((message) => (
                  <button
                    key={message.id}
                    onClick={() => handleMessageSelect(message.id)}
                    className={`w-full p-3 rounded-lg border transition-all text-left ${
                      selectedMessage === message.id
                        ? 'border-black bg-black/5'
                        : 'border-gray-200 bg-white/50 hover:bg-white/80'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center">
                          <User className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-sm text-black">{message.customerName}</p>
                          <p className="text-xs text-gray-600 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        {!message.isRead && (
                          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                        )}
                        {message.isRead && (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 mt-2 line-clamp-2">{message.message}</p>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Message Detail & Reply */}
        <Card className="glass-morphism border-gray-200/50 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-black flex items-center gap-2">
              <Store className="h-5 w-5" />
              {selectedMessage ? 'Conversation' : 'Select a message'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedMessage ? (
              <div className="space-y-4">
                {/* Message Display */}
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-white/30 h-96">
                  <ScrollArea className="h-full">
                    <div className="space-y-4">
                      {messages
                        .filter(m => m.id === selectedMessage)
                        .map((message) => (
                          <div key={message.id} className="space-y-2">
                            <div className="flex items-start gap-3">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center">
                                <User className="h-5 w-5 text-white" />
                              </div>
                              <div className="flex-1">
                                <div className="bg-gray-100 rounded-xl p-3">
                                  <p className="font-semibold text-black">{message.customerName}</p>
                                  <p className="text-gray-800 mt-1">{message.message}</p>
                                  <p className="text-xs text-gray-500 mt-2">
                                    {message.timestamp.toLocaleString()}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      <div ref={messagesEndRef} />
                    </div>
                  </ScrollArea>
                </div>

                {/* Reply Input */}
                <div className="flex gap-2">
                  <Input
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type your reply..."
                    className="flex-1 rounded-lg bg-white/80 border-white/30"
                    onKeyPress={(e) => e.key === 'Enter' && handleSendReply()}
                  />
                  <Button 
                    onClick={handleSendReply}
                    disabled={!replyText.trim()}
                    className="rounded-lg bg-black hover:bg-gray-800 text-white"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-96 text-gray-500">
                <div className="text-center">
                  <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Select a message to view the conversation</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Send New Message */}
      <Card className="glass-morphism border-gray-200/50">
        <CardHeader>
          <CardTitle className="text-black">Send New Message</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              value={newCustomerName}
              onChange={(e) => setNewCustomerName(e.target.value)}
              placeholder="Customer Name"
              className="rounded-lg bg-white/80 border-white/30"
            />
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Message content..."
              className="md:col-span-2 rounded-lg bg-white/80 border-white/30"
              onKeyPress={(e) => e.key === 'Enter' && handleSendNewMessage()}
            />
            <Button 
              onClick={handleSendNewMessage}
              disabled={!newMessage.trim() || !newCustomerName.trim()}
              className="md:col-start-3 rounded-lg bg-black hover:bg-gray-800 text-white"
            >
              Send Message
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

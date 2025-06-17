
import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Send, Users, MessageSquare } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'admin' | 'supplier' | 'customer';
  senderName: string;
  timestamp: Date;
  avatar?: string;
}

interface Conversation {
  id: string;
  participants: string[];
  lastMessage: string;
  unreadCount: number;
  type: 'supplier' | 'customer';
}

export const DashboardMessaging = () => {
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [conversations] = useState<Conversation[]>([
    {
      id: '1',
      participants: ['Admin', 'Fresh Farms Supplier'],
      lastMessage: 'New batch of vegetables ready for delivery',
      unreadCount: 2,
      type: 'supplier'
    },
    {
      id: '2',
      participants: ['Admin', 'Ahmed Hassan'],
      lastMessage: 'Thank you for the quick delivery!',
      unreadCount: 0,
      type: 'customer'
    },
    {
      id: '3',
      participants: ['Admin', 'Dairy Products Co.'],
      lastMessage: 'Price update for cheese products',
      unreadCount: 1,
      type: 'supplier'
    }
  ]);

  const [messages, setMessages] = useState<Record<string, Message[]>>({
    '1': [
      {
        id: '1',
        text: 'Hello! We have a new batch of fresh vegetables ready for delivery.',
        sender: 'supplier',
        senderName: 'Fresh Farms Supplier',
        timestamp: new Date(Date.now() - 3600000),
        avatar: '🌱'
      },
      {
        id: '2',
        text: 'Great! What quantities do you have available?',
        sender: 'admin',
        senderName: 'Site Admin',
        timestamp: new Date(Date.now() - 3500000),
        avatar: '👨‍💼'
      },
      {
        id: '3',
        text: 'We have 50kg tomatoes, 30kg cucumbers, and 25kg bell peppers.',
        sender: 'supplier',
        senderName: 'Fresh Farms Supplier',
        timestamp: new Date(Date.now() - 3000000),
        avatar: '🌱'
      }
    ],
    '2': [
      {
        id: '1',
        text: 'My order arrived perfectly! Thank you for the excellent service.',
        sender: 'customer',
        senderName: 'Ahmed Hassan',
        timestamp: new Date(Date.now() - 7200000),
        avatar: '👤'
      },
      {
        id: '2',
        text: 'Thank you for your feedback! We appreciate your business.',
        sender: 'admin',
        senderName: 'Site Admin',
        timestamp: new Date(Date.now() - 7000000),
        avatar: '👨‍💼'
      }
    ],
    '3': [
      {
        id: '1',
        text: 'We need to update our cheese product prices due to market changes.',
        sender: 'supplier',
        senderName: 'Dairy Products Co.',
        timestamp: new Date(Date.now() - 1800000),
        avatar: '🧀'
      }
    ]
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, activeConversation]);

  const sendMessage = () => {
    if (!newMessage.trim() || !activeConversation) return;

    const message: Message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: 'admin',
      senderName: 'Site Admin',
      timestamp: new Date(),
      avatar: '👨‍💼'
    };

    setMessages(prev => ({
      ...prev,
      [activeConversation]: [...(prev[activeConversation] || []), message]
    }));
    setNewMessage('');

    // Simulate response after 2 seconds
    setTimeout(() => {
      const conversation = conversations.find(c => c.id === activeConversation);
      if (conversation) {
        const responseMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: conversation.type === 'supplier' 
            ? 'Thank you for your message. We will update our inventory accordingly.'
            : 'Thanks for reaching out! How can we help you today?',
          sender: conversation.type === 'supplier' ? 'supplier' : 'customer',
          senderName: conversation.participants[1],
          timestamp: new Date(),
          avatar: conversation.type === 'supplier' ? '🏪' : '👤'
        };

        setMessages(prev => ({
          ...prev,
          [activeConversation]: [...(prev[activeConversation] || []), responseMessage]
        }));
      }
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-black">Messages</h2>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <MessageSquare className="h-4 w-4" />
          <span>{conversations.reduce((sum, conv) => sum + conv.unreadCount, 0)} unread</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
        {/* Conversations List */}
        <Card className="glass-morphism border-gray-200/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-black text-lg flex items-center gap-2">
              <Users className="h-5 w-5" />
              Conversations
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[500px]">
              <div className="space-y-2 p-4">
                {conversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                      activeConversation === conversation.id
                        ? 'bg-orange-100 border border-orange-300'
                        : 'bg-white/50 hover:bg-white/80 border border-gray-200'
                    }`}
                    onClick={() => setActiveConversation(conversation.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src="" />
                          <AvatarFallback>
                            {conversation.type === 'supplier' ? '🏪' : '👤'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-semibold text-black text-sm">
                            {conversation.participants[1]}
                          </p>
                          <p className="text-xs text-gray-600 truncate">
                            {conversation.lastMessage}
                          </p>
                        </div>
                      </div>
                      {conversation.unreadCount > 0 && (
                        <span className="bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                          {conversation.unreadCount}
                        </span>
                      )}
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        conversation.type === 'supplier' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {conversation.type === 'supplier' ? 'Supplier' : 'Customer'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Chat Area */}
        <Card className="lg:col-span-2 glass-morphism border-gray-200/50 flex flex-col">
          {activeConversation ? (
            <>
              <CardHeader className="pb-3 border-b border-gray-200/50">
                <CardTitle className="text-black text-lg">
                  {conversations.find(c => c.id === activeConversation)?.participants[1]}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col p-0">
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {(messages[activeConversation] || []).map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender === 'admin' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[80%] ${
                          message.sender === 'admin'
                            ? 'bg-orange-500 text-white rounded-2xl rounded-br-md'
                            : 'bg-white/80 text-gray-800 rounded-2xl rounded-bl-md border border-gray-200'
                        } p-3 shadow-sm`}>
                          {message.sender !== 'admin' && (
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="text-sm">{message.avatar}</span>
                              <span className="text-xs text-gray-500">{message.senderName}</span>
                            </div>
                          )}
                          <p className="text-sm">{message.text}</p>
                          <p className={`text-xs mt-1 ${
                            message.sender === 'admin' ? 'text-orange-100' : 'text-gray-500'
                          }`}>
                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>
                <div className="p-4 border-t border-gray-200/50">
                  <div className="flex space-x-2">
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1 bg-white/80 border-gray-300 focus:border-orange-400"
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    />
                    <Button 
                      onClick={sendMessage}
                      size="icon"
                      className="bg-orange-500 hover:bg-orange-600"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Select a conversation to start messaging</p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

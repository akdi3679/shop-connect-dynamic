
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Send, MessageCircle, User, Clock } from 'lucide-react';

interface Message {
  id: string;
  from: 'supplier' | 'owner';
  content: string;
  timestamp: Date;
  read: boolean;
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

export const MessagingSystem = () => {
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: '1',
      supplierId: 'sup1',
      supplierName: 'Fresh Ingredients Co.',
      lastMessage: 'Your order has been shipped',
      lastMessageTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
      unreadCount: 2,
      messages: [
        {
          id: 'm1',
          from: 'supplier',
          content: 'Hello! Thank you for your order.',
          timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
          read: true
        },
        {
          id: 'm2',
          from: 'owner',
          content: 'When will it be delivered?',
          timestamp: new Date(Date.now() - 2.5 * 60 * 60 * 1000),
          read: true
        },
        {
          id: 'm3',
          from: 'supplier',
          content: 'Your order has been shipped and will arrive tomorrow.',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          read: false
        }
      ]
    }
  ]);

  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const message: Message = {
      id: `m${Date.now()}`,
      from: 'owner',
      content: newMessage.trim(),
      timestamp: new Date(),
      read: true
    };

    setConversations(prev => prev.map(conv => {
      if (conv.id === selectedConversation) {
        return {
          ...conv,
          messages: [...conv.messages, message],
          lastMessage: message.content,
          lastMessageTime: message.timestamp
        };
      }
      return conv;
    }));

    setNewMessage('');
  };

  const markAsRead = (conversationId: string) => {
    setConversations(prev => prev.map(conv => {
      if (conv.id === conversationId) {
        return {
          ...conv,
          unreadCount: 0,
          messages: conv.messages.map(msg => ({ ...msg, read: true }))
        };
      }
      return conv;
    }));
  };

  const selectedConv = conversations.find(c => c.id === selectedConversation);

  useEffect(() => {
    if (selectedConversation) {
      markAsRead(selectedConversation);
    }
  }, [selectedConversation]);

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-black">Messages</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
        {/* Conversations List */}
        <Card className="glass-morphism border-gray-200/50">
          <CardHeader>
            <CardTitle className="text-black flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Conversations
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[500px]">
              <div className="space-y-2 p-4">
                {conversations.map((conv) => (
                  <div
                    key={conv.id}
                    onClick={() => setSelectedConversation(conv.id)}
                    className={`p-3 rounded-lg cursor-pointer transition-all hover:bg-white/60 ${
                      selectedConversation === conv.id ? 'bg-white/80 border border-gray-200' : 'bg-white/40'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-semibold text-black text-sm">{conv.supplierName}</h4>
                      {conv.unreadCount > 0 && (
                        <Badge variant="destructive" className="text-xs">
                          {conv.unreadCount}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 truncate">{conv.lastMessage}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Clock className="h-3 w-3 text-gray-400" />
                      <span className="text-xs text-gray-400">
                        {conv.lastMessageTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Chat Area */}
        <Card className="lg:col-span-2 glass-morphism border-gray-200/50">
          <CardHeader>
            <CardTitle className="text-black">
              {selectedConv ? selectedConv.supplierName : 'Select a conversation'}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col h-[500px]">
            {selectedConv ? (
              <>
                {/* Messages */}
                <ScrollArea className="flex-1 mb-4">
                  <div className="space-y-3">
                    {selectedConv.messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.from === 'owner' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[70%] p-3 rounded-lg ${
                            message.from === 'owner'
                              ? 'bg-black text-white'
                              : 'bg-white/80 text-black border border-gray-200'
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <User className="h-3 w-3" />
                            <span className="text-xs font-medium">
                              {message.from === 'owner' ? 'You' : selectedConv.supplierName}
                            </span>
                          </div>
                          <p className="text-sm">{message.content}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                {/* Message Input */}
                <div className="flex gap-2">
                  <Textarea
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="resize-none bg-white/80 border-gray-200"
                    rows={2}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                  />
                  <Button
                    onClick={sendMessage}
                    disabled={!newMessage.trim()}
                    className="self-end"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-center">
                <div>
                  <MessageCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Select a conversation to start messaging</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

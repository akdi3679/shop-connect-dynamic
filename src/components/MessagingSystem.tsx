
import { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, X, Phone, Video } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { soundManager } from '@/utils/sounds';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'support' | 'system';
  timestamp: Date;
  avatar?: string;
}

export const MessagingSystem = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Welcome to GourmetGo! How can we help you today? 🍽️',
      sender: 'support',
      timestamp: new Date(),
      avatar: '👨‍🍳'
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    soundManager.play('message');

    // Simulate support response
    setTimeout(() => {
      const supportResponses = [
        "Thanks for your message! Our team will get back to you shortly. 😊",
        "I'll connect you with our specialist right away!",
        "Great question! Let me check that for you...",
        "We're here to help! What specific information do you need?",
        "Thanks for choosing GourmetGo! How can we make your experience better?"
      ];

      const response: Message = {
        id: (Date.now() + 1).toString(),
        text: supportResponses[Math.floor(Math.random() * supportResponses.length)],
        sender: 'support',
        timestamp: new Date(),
        avatar: '👨‍🍳'
      };

      setMessages(prev => [...prev, response]);
      if (!isOpen) {
        setUnreadCount(prev => prev + 1);
        soundManager.play('notification');
      }
    }, 1500);
  };

  const handleOpen = () => {
    setIsOpen(true);
    setUnreadCount(0);
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <Button
        onClick={handleOpen}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-gradient-to-r from-orange-400 to-orange-600 hover:from-orange-500 hover:to-orange-700 shadow-2xl transition-all duration-300 hover:scale-110"
        size="icon"
      >
        <MessageCircle className="h-6 w-6 text-white" />
        {unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center animate-bounce">
            {unreadCount}
          </span>
        )}
      </Button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-96 h-96 bg-white rounded-3xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden animate-scale-in">
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-400 to-orange-600 p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-xl">👨‍🍳</span>
              </div>
              <div>
                <h3 className="font-semibold text-white">GourmetGo Support</h3>
                <p className="text-sm text-orange-100">Online</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button size="sm" variant="ghost" className="text-white hover:bg-white/20 rounded-full p-2">
                <Phone className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="ghost" className="text-white hover:bg-white/20 rounded-full p-2">
                <Video className="h-4 w-4" />
              </Button>
              <Button 
                size="sm" 
                variant="ghost" 
                className="text-white hover:bg-white/20 rounded-full p-2"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] ${
                  message.sender === 'user'
                    ? 'bg-gradient-to-r from-orange-400 to-orange-600 text-white rounded-2xl rounded-br-md'
                    : 'bg-gray-100 text-gray-800 rounded-2xl rounded-bl-md'
                } p-3 shadow-sm`}>
                  {message.sender === 'support' && message.avatar && (
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-sm">{message.avatar}</span>
                      <span className="text-xs text-gray-500">Support</span>
                    </div>
                  )}
                  <p className="text-sm">{message.text}</p>
                  <p className={`text-xs mt-1 ${
                    message.sender === 'user' ? 'text-orange-100' : 'text-gray-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t bg-gray-50">
            <div className="flex space-x-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 rounded-full border-gray-300 focus:border-orange-400"
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              />
              <Button 
                onClick={sendMessage}
                size="icon"
                className="rounded-full bg-gradient-to-r from-orange-400 to-orange-600 hover:from-orange-500 hover:to-orange-700"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

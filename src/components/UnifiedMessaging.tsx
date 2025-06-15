
import { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, X, Bot, Headphones, MessageSquare, Instagram, Phone } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { soundManager } from '@/utils/sounds';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'support' | 'bot';
  timestamp: Date;
  avatar?: string;
}

export const UnifiedMessaging = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'ai' | 'support'>('ai');
  const [supportMessages, setSupportMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Welcome to GourmetGo! How can we help you today? 🍽️',
      sender: 'support',
      timestamp: new Date(),
      avatar: '👨‍🍳'
    }
  ]);
  const [aiMessages, setAiMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi there! I'm your friendly GourmetGo assistant! 🤖✨ I'm here to help you discover amazing food experiences. Ask me about our menu, restaurants, or anything food-related! What delicious adventure can I help you with today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [supportMessages, aiMessages]);

  // Handle click outside to close panel
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const geminiResponses = [
    "🍕 Our artisanal pizzas are made with locally-sourced ingredients and wood-fired to perfection! Each bite is a flavor explosion that'll transport you to Italy!",
    "🥪 Our gourmet sandwiches feature premium ingredients, artisanal breads, and creative combinations that redefine what a sandwich can be! Fresh, bold, and unforgettable!",
    "🥗 Fresh salads made daily by our master chefs! We source the finest ingredients and use traditional techniques for an authentic experience!",
    "✨ GourmetGo connects you with the best local restaurants and artisanal food makers in your area. Quality, convenience, and amazing flavors - that's our promise!",
    "🥔 Our fresh potato dishes feature organic ingredients, seasonal preparations, and house-made sauces. Healthy never tasted so good!",
    "🥤 Refresh yourself with our premium drinks! From fresh juices to artisanal sodas, every sip is crafted with care and quality ingredients!",
    "🎉 GourmetGo is more than food delivery - we're your culinary adventure partner! Discover hidden gems, support local businesses, and treat your taste buds!",
    "💫 Our chefs are passionate artists who create dishes that tell stories. Every meal from GourmetGo is crafted with love and served with pride!"
  ];

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: 'user',
      timestamp: new Date()
    };

    if (activeTab === 'ai') {
      setAiMessages(prev => [...prev, userMessage]);
      setIsTyping(true);
      
      setTimeout(() => {
        const response = geminiResponses[Math.floor(Math.random() * geminiResponses.length)];
        
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: response,
          sender: 'bot',
          timestamp: new Date()
        };

        setAiMessages(prev => [...prev, botMessage]);
        setIsTyping(false);
        soundManager.play('notification');
      }, 2000);
    } else {
      setSupportMessages(prev => [...prev, userMessage]);
      
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

        setSupportMessages(prev => [...prev, response]);
        if (!isOpen) {
          setUnreadCount(prev => prev + 1);
          soundManager.play('notification');
        }
      }, 1500);
    }

    setNewMessage('');
    soundManager.play('message');
  };

  const handleOpen = () => {
    setIsOpen(true);
    setUnreadCount(0);
  };

  const currentMessages = activeTab === 'ai' ? aiMessages : supportMessages;

  return (
    <>
      {/* Unified Chat Toggle Button */}
      <Button
        onClick={handleOpen}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl transition-all duration-300 hover:scale-110 hover:bg-white/20 hover:shadow-3xl"
        size="icon"
      >
        <MessageCircle className="h-7 w-7 text-gray-800" />
        {unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center animate-bounce shadow-lg">
            {unreadCount}
          </span>
        )}
      </Button>

      {/* Elegant Chat Window - iOS 26 Style */}
      {isOpen && (
        <div 
          ref={panelRef}
          className="fixed bottom-6 right-6 z-50 w-96 h-[400px] bg-white/95 backdrop-blur-3xl rounded-3xl shadow-2xl border border-white/30 flex flex-col overflow-hidden animate-scale-in"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)'
          }}
        >
          {/* Elegant Header */}
          <div className="relative bg-gradient-to-r from-white/40 via-white/30 to-white/40 backdrop-blur-xl p-4 border-b border-white/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30">
                  {activeTab === 'ai' ? (
                    <Bot className="h-5 w-5 text-blue-600" />
                  ) : (
                    <Headphones className="h-5 w-5 text-purple-600" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 text-base">
                    {activeTab === 'ai' ? 'AI Assistant' : 'Support Team'}
                  </h3>
                  <p className="text-xs text-gray-600">
                    {activeTab === 'ai' ? 'Always here to help!' : 'Online now'}
                  </p>
                </div>
              </div>
              <Button 
                size="sm" 
                variant="ghost" 
                className="text-gray-600 hover:bg-white/30 rounded-full p-2 backdrop-blur-sm transition-all duration-200"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Elegant Tab Switcher */}
          <div className="flex bg-gradient-to-r from-white/30 via-white/20 to-white/30 backdrop-blur-sm border-b border-white/20 p-1 mx-3 mt-2 rounded-xl">
            <button
              className={`flex-1 py-2 px-3 text-xs font-medium transition-all duration-500 rounded-lg backdrop-blur-sm flex items-center justify-center space-x-2 ${
                activeTab === 'ai'
                  ? 'bg-gradient-to-r from-blue-500/25 to-purple-500/25 text-gray-800 shadow-md border border-white/30'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-white/20'
              }`}
              onClick={() => setActiveTab('ai')}
            >
              <Bot className="h-3 w-3" />
              <span>AI Assistant</span>
            </button>
            <button
              className={`flex-1 py-2 px-3 text-xs font-medium transition-all duration-500 rounded-lg backdrop-blur-sm flex items-center justify-center space-x-2 ${
                activeTab === 'support'
                  ? 'bg-gradient-to-r from-purple-500/25 to-pink-500/25 text-gray-800 shadow-md border border-white/30'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-white/20'
              }`}
              onClick={() => setActiveTab('support')}
            >
              <Headphones className="h-3 w-3" />
              <span>Support</span>
            </button>
          </div>

          {/* Messages with custom scrollbar using Tailwind */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-white/20 to-white/30 backdrop-blur-sm scrollbar-thin scrollbar-track-white/10 scrollbar-thumb-white/30 hover:scrollbar-thumb-white/50 scrollbar-track-rounded-full scrollbar-thumb-rounded-full">
            {currentMessages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[85%] ${
                  message.sender === 'user'
                    ? 'bg-gradient-to-r from-blue-500/90 to-purple-500/90 text-white rounded-2xl rounded-br-md backdrop-blur-xl border border-white/20'
                    : 'bg-white/90 backdrop-blur-xl text-gray-800 rounded-2xl rounded-bl-md border border-white/30'
                } p-3 shadow-lg`}>
                  {(message.sender === 'bot' || message.sender === 'support') && (
                    <div className="flex items-center space-x-2 mb-1">
                      {message.sender === 'bot' ? (
                        <Bot className="h-3 w-3 text-blue-600" />
                      ) : (
                        <Headphones className="h-3 w-3 text-purple-600" />
                      )}
                      <span className="text-xs font-semibold text-gray-600">
                        {message.sender === 'bot' ? 'AI Assistant' : 'Support Team'}
                      </span>
                    </div>
                  )}
                  <p className="text-sm leading-relaxed">{message.text}</p>
                  <p className={`text-xs mt-1 ${
                    message.sender === 'user' ? 'text-white/70' : 'text-gray-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            
            {activeTab === 'ai' && isTyping && (
              <div className="flex justify-start">
                <div className="bg-white/90 backdrop-blur-xl rounded-2xl rounded-bl-md p-3 shadow-lg border border-white/30">
                  <div className="flex items-center space-x-2 mb-1">
                    <Bot className="h-3 w-3 text-blue-600" />
                    <span className="text-xs font-semibold text-gray-600">AI Assistant</span>
                  </div>
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-blue-500/60 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-blue-500/60 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-blue-500/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Support Contact Icons */}
          {activeTab === 'support' && (
            <div className="px-4 py-2 border-t border-white/20 bg-gradient-to-r from-white/25 to-white/35 backdrop-blur-xl">
              <div className="flex items-center justify-center space-x-3">
                <span className="text-xs text-gray-600 font-medium">Quick contact:</span>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="w-7 h-7 rounded-full bg-green-500/20 hover:bg-green-500/30 border border-green-300/30 p-0 transition-all duration-200 hover:scale-105"
                  >
                    <MessageSquare className="h-3 w-3 text-green-600" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="w-7 h-7 rounded-full bg-pink-500/20 hover:bg-pink-500/30 border border-pink-300/30 p-0 transition-all duration-200 hover:scale-105"
                  >
                    <Instagram className="h-3 w-3 text-pink-600" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="w-7 h-7 rounded-full bg-blue-500/20 hover:bg-blue-500/30 border border-blue-300/30 p-0 transition-all duration-200 hover:scale-105"
                  >
                    <Phone className="h-3 w-3 text-blue-600" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Elegant Input with Liquid Glass Send Button */}
          <div className="p-3 border-t border-white/20 bg-gradient-to-r from-white/30 via-white/25 to-white/30 backdrop-blur-xl">
            <div className="flex space-x-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder={activeTab === 'ai' ? "Ask me about GourmetGo..." : "Type your message..."}
                className="flex-1 rounded-xl border-white/30 focus:border-white/50 bg-white/50 backdrop-blur-sm text-gray-800 placeholder:text-gray-500 px-3 py-2 text-sm"
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                disabled={isTyping && activeTab === 'ai'}
              />
              <Button 
                onClick={sendMessage}
                size="icon"
                disabled={isTyping && activeTab === 'ai'}
                className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500/80 to-purple-500/80 hover:from-blue-600/90 hover:to-purple-600/90 backdrop-blur-sm border border-white/30 shadow-lg transition-all duration-300 hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.8), rgba(147, 51, 234, 0.8))',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  boxShadow: '0 8px 32px rgba(59, 130, 246, 0.3)'
                }}
              >
                <Send className="h-4 w-4 text-white" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

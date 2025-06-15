import { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, X, Bot, Users, MessageSquare, Instagram, Phone, ChevronDown, ChevronUp } from 'lucide-react';
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
  const [showContactOptions, setShowContactOptions] = useState(false);
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
      {/* Chat Toggle Button */}
      <Button
        onClick={handleOpen}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-white/80 backdrop-blur-xl border border-white/20 shadow-xl transition-all duration-300 hover:scale-110 hover:bg-white/90"
        size="icon"
      >
        <MessageCircle className="h-7 w-7 text-gray-700" />
        {unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center animate-bounce shadow-lg">
            {unreadCount}
          </span>
        )}
      </Button>

      {/* Chat Window - Glass Effect Restored */}
      {isOpen && (
        <div 
          ref={panelRef}
          className="fixed bottom-6 right-6 z-50 w-96 h-[480px] bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 flex flex-col overflow-hidden animate-scale-in"
        >
          {/* Header */}
          <div className="bg-white/50 backdrop-blur-sm p-4 border-b border-white/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white/60 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20">
                  {activeTab === 'ai' ? (
                    <Bot className="h-6 w-6 text-gray-700" />
                  ) : (
                    <Users className="h-6 w-6 text-gray-700" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 text-lg">
                    {activeTab === 'ai' ? 'AI Assistant' : 'Support Team'}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {activeTab === 'ai' ? 'Always here to help!' : 'Online now'}
                  </p>
                </div>
              </div>
              <Button 
                size="sm" 
                variant="ghost" 
                className="text-gray-500 hover:bg-white/30 rounded-full p-2"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Tab Switcher */}
          <div className="flex bg-white/30 border-b border-white/20 p-1 mx-4 mt-2 rounded-2xl backdrop-blur-sm">
            <button
              className={`flex-1 py-3 px-4 text-sm font-medium transition-all duration-300 rounded-xl flex items-center justify-center space-x-2 ${
                activeTab === 'ai'
                  ? 'bg-white/70 text-gray-800 shadow-sm backdrop-blur-sm'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-white/20'
              }`}
              onClick={() => setActiveTab('ai')}
            >
              <Bot className="h-4 w-4" />
              <span>AI Assistant</span>
            </button>
            <button
              className={`flex-1 py-3 px-4 text-sm font-medium transition-all duration-300 rounded-xl flex items-center justify-center space-x-2 ${
                activeTab === 'support'
                  ? 'bg-white/70 text-gray-800 shadow-sm backdrop-blur-sm'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-white/20'
              }`}
              onClick={() => setActiveTab('support')}
            >
              <Users className="h-4 w-4" />
              <span>Support</span>
            </button>
          </div>

          {/* Messages - No Scrollbar */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
            {currentMessages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[85%] ${
                  message.sender === 'user'
                    ? 'bg-black/80 text-white rounded-2xl rounded-br-md backdrop-blur-sm'
                    : 'bg-white/60 text-gray-800 rounded-2xl rounded-bl-md backdrop-blur-sm border border-white/20'
                } p-4 shadow-sm`}>
                  {(message.sender === 'bot' || message.sender === 'support') && (
                    <div className="flex items-center space-x-2 mb-2">
                      {message.sender === 'bot' ? (
                        <Bot className="h-4 w-4 text-gray-500" />
                      ) : (
                        <Users className="h-4 w-4 text-gray-500" />
                      )}
                      <span className="text-xs font-semibold text-gray-500">
                        {message.sender === 'bot' ? 'AI Assistant' : 'Support Team'}
                      </span>
                    </div>
                  )}
                  <p className="text-sm leading-relaxed">{message.text}</p>
                  <p className={`text-xs mt-2 ${
                    message.sender === 'user' ? 'text-white/70' : 'text-gray-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            
            {activeTab === 'ai' && isTyping && (
              <div className="flex justify-start">
                <div className="bg-white/60 rounded-2xl rounded-bl-md p-4 shadow-sm backdrop-blur-sm border border-white/20">
                  <div className="flex items-center space-x-2 mb-2">
                    <Bot className="h-4 w-4 text-gray-500" />
                    <span className="text-xs font-semibold text-gray-500">AI Assistant</span>
                  </div>
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Contact Options - Support Tab Only (Above Send Button) */}
          {activeTab === 'support' && (
            <div className="px-4 py-3 border-t border-white/20 bg-white/40 backdrop-blur-sm">
              <div className="flex flex-col items-center space-y-3">
                <button
                  onClick={() => setShowContactOptions(!showContactOptions)}
                  className="flex items-center space-x-2 text-xs text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <span>Other ways to reach us</span>
                  {showContactOptions ? (
                    <ChevronUp className="h-3 w-3" />
                  ) : (
                    <ChevronDown className="h-3 w-3" />
                  )}
                </button>
                
                {showContactOptions && (
                  <div className="flex space-x-4 animate-fade-in">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="w-10 h-10 rounded-full bg-green-500/10 hover:bg-green-500/20 p-0 backdrop-blur-sm border border-white/20"
                    >
                      <MessageSquare className="h-5 w-5 text-green-600" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="w-10 h-10 rounded-full bg-pink-500/10 hover:bg-pink-500/20 p-0 backdrop-blur-sm border border-white/20"
                    >
                      <Instagram className="h-5 w-5 text-pink-600" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="w-10 h-10 rounded-full bg-blue-500/10 hover:bg-blue-500/20 p-0 backdrop-blur-sm border border-white/20"
                    >
                      <Phone className="h-5 w-5 text-blue-600" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Input with Glass Send Button */}
          <div className="p-4 border-t border-white/20 bg-white/40 backdrop-blur-sm">
            <div className="flex space-x-3">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder={activeTab === 'ai' ? "Ask me about GourmetGo..." : "Type your message..."}
                className="flex-1 rounded-2xl border-white/30 focus:border-white/50 bg-white/50 text-gray-800 placeholder:text-gray-500 px-4 py-3 backdrop-blur-sm"
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                disabled={isTyping && activeTab === 'ai'}
              />
              <Button 
                onClick={sendMessage}
                size="icon"
                disabled={isTyping && activeTab === 'ai'}
                className="w-12 h-12 rounded-2xl bg-gradient-to-r from-black/70 to-black/80 hover:from-black/80 hover:to-black/90 backdrop-blur-sm shadow-lg transition-all duration-300 hover:scale-105 border border-white/20"
              >
                <Send className="h-5 w-5 text-white" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

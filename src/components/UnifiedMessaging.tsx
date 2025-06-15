
import { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, X } from 'lucide-react';
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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [supportMessages, aiMessages]);

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
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl transition-all duration-300 hover:scale-110 hover:bg-white/20"
        size="icon"
      >
        <MessageCircle className="h-6 w-6 text-black" />
        {unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-bounce">
            {unreadCount}
          </span>
        )}
      </Button>

      {/* Elegant Chat Window - iOS 26 Style */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-96 h-[500px] bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/30 flex flex-col overflow-hidden animate-scale-in">
          {/* Elegant Header */}
          <div className="bg-white/20 backdrop-blur-xl p-4 flex items-center justify-between border-b border-white/20">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center">
                <span className="text-xl">
                  {activeTab === 'ai' ? '🤖' : '👨‍🍳'}
                </span>
              </div>
              <div>
                <h3 className="font-semibold text-black">
                  {activeTab === 'ai' ? 'AI Assistant' : 'GourmetGo Support'}
                </h3>
                <p className="text-sm text-black/70">
                  {activeTab === 'ai' ? 'Always here to help!' : 'Online'}
                </p>
              </div>
            </div>
            <Button 
              size="sm" 
              variant="ghost" 
              className="text-black/70 hover:bg-white/20 rounded-full p-2 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Elegant Tab Switcher */}
          <div className="flex bg-white/10 backdrop-blur-sm border-b border-white/20">
            <button
              className={`flex-1 py-3 px-4 text-sm font-medium transition-all duration-500 backdrop-blur-sm ${
                activeTab === 'ai'
                  ? 'bg-white/30 text-black shadow-lg'
                  : 'text-black/70 hover:text-black hover:bg-white/20'
              }`}
              onClick={() => setActiveTab('ai')}
            >
              AI Assistant
            </button>
            <button
              className={`flex-1 py-3 px-4 text-sm font-medium transition-all duration-500 backdrop-blur-sm ${
                activeTab === 'support'
                  ? 'bg-white/30 text-black shadow-lg'
                  : 'text-black/70 hover:text-black hover:bg-white/20'
              }`}
              onClick={() => setActiveTab('support')}
            >
              Support
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-white/20 to-white/40 backdrop-blur-sm">
            {currentMessages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[85%] ${
                  message.sender === 'user'
                    ? 'bg-black/90 text-white rounded-2xl rounded-br-md backdrop-blur-xl'
                    : 'bg-white/80 backdrop-blur-xl text-black rounded-2xl rounded-bl-md border border-white/30'
                } p-3 shadow-lg`}>
                  {(message.sender === 'bot' || message.sender === 'support') && (
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-sm">{message.sender === 'bot' ? '🤖' : message.avatar}</span>
                      <span className="text-xs font-semibold text-black/60">
                        {message.sender === 'bot' ? 'AI Assistant' : 'Support'}
                      </span>
                    </div>
                  )}
                  <p className="text-sm leading-relaxed">{message.text}</p>
                  <p className={`text-xs mt-2 ${
                    message.sender === 'user' ? 'text-white/70' : 'text-black/50'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            
            {activeTab === 'ai' && isTyping && (
              <div className="flex justify-start">
                <div className="bg-white/80 backdrop-blur-xl rounded-2xl rounded-bl-md p-3 shadow-lg border border-white/30">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-sm">🤖</span>
                    <span className="text-xs font-semibold text-black/60">AI Assistant</span>
                  </div>
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-black/60 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-black/60 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-black/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Elegant Input */}
          <div className="p-4 border-t border-white/20 bg-white/20 backdrop-blur-xl">
            <div className="flex space-x-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder={activeTab === 'ai' ? "Ask me about GourmetGo..." : "Type your message..."}
                className="flex-1 rounded-full border-white/30 focus:border-white/50 bg-white/40 backdrop-blur-sm text-black placeholder:text-black/50"
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                disabled={isTyping && activeTab === 'ai'}
              />
              <Button 
                onClick={sendMessage}
                size="icon"
                disabled={isTyping && activeTab === 'ai'}
                className="rounded-full bg-black/80 hover:bg-black/90 backdrop-blur-sm"
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

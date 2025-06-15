
import { useState } from 'react';
import { MessageCircle, Bot, HeadphonesIcon, Send, X, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { soundManager } from '@/utils/sounds';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot' | 'support';
  timestamp: Date;
}

export const UnifiedMessaging = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'ai' | 'support'>('ai');
  const [aiMessages, setAiMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi there! I'm your GourmetGo AI assistant! ✨ I'm here to help you discover amazing food experiences. Ask me about our menu, special offers, or anything food-related! What delicious adventure can I help you with today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [supportMessages, setSupportMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Welcome to GourmetGo Support! How can we help you today? 🍽️',
      sender: 'support',
      timestamp: new Date()
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const currentMessages = activeTab === 'ai' ? aiMessages : supportMessages;
  const setCurrentMessages = activeTab === 'ai' ? setAiMessages : setSupportMessages;

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setCurrentMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsTyping(true);
    soundManager.play('message');

    // Different responses for AI vs Support
    setTimeout(() => {
      let response: string;
      
      if (activeTab === 'ai') {
        const aiResponses = [
          "🍕 Our artisanal menu features locally-sourced ingredients! Each dish is crafted with passion and love!",
          "✨ GourmetGo is your gateway to culinary excellence! We bring restaurant-quality food right to your door!",
          "🥗 Fresh, healthy, and delicious - that's our promise! Every ingredient is carefully selected for maximum flavor!",
          "🎉 Thank you for choosing GourmetGo! We're committed to making every meal an unforgettable experience!",
          "💫 Our chefs are culinary artists who create dishes that tell stories. Let us surprise your taste buds today!"
        ];
        response = aiResponses[Math.floor(Math.random() * aiResponses.length)];
      } else {
        const supportResponses = [
          "Thanks for your message! Our team will get back to you shortly. 😊",
          "I'll connect you with our specialist right away!",
          "Great question! Let me check that for you...",
          "We're here to help! What specific information do you need?",
          "Thanks for choosing GourmetGo! How can we make your experience better?"
        ];
        response = supportResponses[Math.floor(Math.random() * supportResponses.length)];
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: activeTab === 'ai' ? 'bot' : 'support',
        timestamp: new Date()
      };

      setCurrentMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
      soundManager.play('notification');
    }, 2000);
  };

  return (
    <>
      {/* Unified Message Toggle Button */}
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-2xl transition-all duration-300 hover:scale-110 glass-morphism border-white/20"
        size="icon"
      >
        <MessageCircle className="h-6 w-6 text-white" />
        <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center animate-pulse">
          <Sparkles className="h-3 w-3 text-white" />
        </div>
      </Button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-96 h-[500px] glass-morphism rounded-3xl shadow-2xl border border-white/20 flex flex-col overflow-hidden animate-scale-in">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-500/20 to-purple-600/20 backdrop-blur-xl p-4 flex items-center justify-between border-b border-white/10">
            <div className="flex items-center space-x-3">
              <div className="flex space-x-1">
                <Button
                  size="sm"
                  variant={activeTab === 'ai' ? 'default' : 'ghost'}
                  className={`rounded-full px-4 py-2 transition-all duration-300 ${
                    activeTab === 'ai' 
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white' 
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                  onClick={() => setActiveTab('ai')}
                >
                  <Bot className="h-4 w-4 mr-2" />
                  AI
                </Button>
                <Button
                  size="sm"
                  variant={activeTab === 'support' ? 'default' : 'ghost'}
                  className={`rounded-full px-4 py-2 transition-all duration-300 ${
                    activeTab === 'support' 
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white' 
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                  onClick={() => setActiveTab('support')}
                >
                  <HeadphonesIcon className="h-4 w-4 mr-2" />
                  Support
                </Button>
              </div>
            </div>
            <Button 
              size="sm" 
              variant="ghost" 
              className="text-white hover:bg-white/20 rounded-full p-2"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {currentMessages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[85%] ${
                  message.sender === 'user'
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-2xl rounded-br-md'
                    : message.sender === 'bot'
                    ? 'bg-white/10 backdrop-blur-sm text-white rounded-2xl rounded-bl-md border border-white/20'
                    : 'bg-white/10 backdrop-blur-sm text-white rounded-2xl rounded-bl-md border border-white/20'
                } p-3 shadow-sm`}>
                  {message.sender !== 'user' && (
                    <div className="flex items-center space-x-2 mb-2">
                      {message.sender === 'bot' ? (
                        <>
                          <Bot className="h-4 w-4 text-indigo-400" />
                          <span className="text-xs font-semibold text-indigo-400">AI Assistant</span>
                          <Sparkles className="h-3 w-3 text-cyan-400" />
                        </>
                      ) : (
                        <>
                          <HeadphonesIcon className="h-4 w-4 text-green-400" />
                          <span className="text-xs font-semibold text-green-400">Support Team</span>
                        </>
                      )}
                    </div>
                  )}
                  <p className="text-sm leading-relaxed">{message.text}</p>
                  <p className={`text-xs mt-2 ${
                    message.sender === 'user' ? 'text-blue-100' : 'text-white/60'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl rounded-bl-md p-3 shadow-sm border border-white/20">
                  <div className="flex items-center space-x-2 mb-2">
                    {activeTab === 'ai' ? (
                      <Bot className="h-4 w-4 text-indigo-400" />
                    ) : (
                      <HeadphonesIcon className="h-4 w-4 text-green-400" />
                    )}
                    <span className="text-xs font-semibold text-white/80">Typing...</span>
                  </div>
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-white/10 bg-white/5 backdrop-blur-xl">
            <div className="flex space-x-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder={`Message ${activeTab === 'ai' ? 'AI Assistant' : 'Support'}...`}
                className="flex-1 rounded-full border-white/20 focus:border-indigo-400 bg-white/10 backdrop-blur-sm text-white placeholder:text-white/60"
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                disabled={isTyping}
              />
              <Button 
                onClick={sendMessage}
                size="icon"
                disabled={isTyping}
                className={`rounded-full ${
                  activeTab === 'ai' 
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700'
                    : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700'
                }`}
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

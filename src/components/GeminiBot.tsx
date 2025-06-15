
import { useState } from 'react';
import { Bot, Send, X, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { soundManager } from '@/utils/sounds';

interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export const GeminiBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: "Hi there! I'm Gemini, your friendly GourmetGo assistant! 🤖✨ I'm here to help you discover amazing food experiences. Ask me about our menu, restaurants, or anything food-related! What delicious adventure can I help you with today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const geminiResponses = [
    "🍕 Our artisanal pizzas are made with locally-sourced ingredients and wood-fired to perfection! Each bite is a flavor explosion that'll transport you to Italy!",
    "🍔 Our gourmet burgers feature premium beef, artisanal buns, and creative toppings that redefine what a burger can be! Juicy, bold, and unforgettable!",
    "🍣 Fresh sushi made daily by our master chefs! We source the finest fish and use traditional techniques for an authentic Japanese experience!",
    "✨ GourmetGo connects you with the best local restaurants and artisanal food makers in your area. Quality, convenience, and amazing flavors - that's our promise!",
    "🥗 Our fresh salads feature organic greens, seasonal vegetables, and house-made dressings. Healthy never tasted so good!",
    "🍜 Warm up with our authentic ramen bowls! Rich broth simmered for hours, fresh noodles, and perfectly cooked toppings make every bowl special!",
    "🎉 GourmetGo is more than food delivery - we're your culinary adventure partner! Discover hidden gems, support local businesses, and treat your taste buds!",
    "💫 Our chefs are passionate artists who create dishes that tell stories. Every meal from GourmetGo is crafted with love and served with pride!"
  ];

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: newMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsTyping(true);
    soundManager.play('message');

    // Simulate AI thinking time
    setTimeout(() => {
      const response = geminiResponses[Math.floor(Math.random() * geminiResponses.length)];
      
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
      soundManager.play('notification');
    }, 2000);
  };

  return (
    <>
      {/* AI Bot Toggle Button */}
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 z-50 w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-2xl transition-all duration-300 hover:scale-110"
        size="icon"
      >
        <Bot className="h-6 w-6 text-white" />
        <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center animate-pulse">
          <Sparkles className="h-3 w-3 text-white" />
        </div>
      </Button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 left-6 z-50 w-96 h-96 bg-white rounded-3xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden animate-scale-in">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center relative">
                <Bot className="h-5 w-5 text-white" />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
                  <Sparkles className="h-2 w-2 text-white" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-white">Gemini AI Assistant</h3>
                <p className="text-sm text-purple-100">Always here to help!</p>
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
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-purple-50 to-pink-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[85%] ${
                  message.sender === 'user'
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl rounded-br-md'
                    : 'bg-white text-gray-800 rounded-2xl rounded-bl-md border border-purple-100'
                } p-3 shadow-sm`}>
                  {message.sender === 'bot' && (
                    <div className="flex items-center space-x-2 mb-2">
                      <Bot className="h-4 w-4 text-purple-500" />
                      <span className="text-xs font-semibold text-purple-600">Gemini AI</span>
                      <Sparkles className="h-3 w-3 text-yellow-500" />
                    </div>
                  )}
                  <p className="text-sm leading-relaxed">{message.text}</p>
                  <p className={`text-xs mt-2 ${
                    message.sender === 'user' ? 'text-blue-100' : 'text-gray-400'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white rounded-2xl rounded-bl-md p-3 shadow-sm border border-purple-100">
                  <div className="flex items-center space-x-2 mb-2">
                    <Bot className="h-4 w-4 text-purple-500" />
                    <span className="text-xs font-semibold text-purple-600">Gemini AI</span>
                  </div>
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-4 border-t bg-gradient-to-r from-purple-50 to-pink-50">
            <div className="flex space-x-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Ask me about GourmetGo..."
                className="flex-1 rounded-full border-purple-200 focus:border-purple-400 bg-white"
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                disabled={isTyping}
              />
              <Button 
                onClick={sendMessage}
                size="icon"
                disabled={isTyping}
                className="rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
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


import { useState, useEffect } from 'react';
import { UtensilsCrossed } from 'lucide-react';

interface LoadingScreenProps {
  onLoadingComplete: () => void;
}

export const LoadingScreen = ({ onLoadingComplete }: LoadingScreenProps) => {
  useEffect(() => {
    // Play loading sound
    const loadingSound = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBz2a3u25diMFnwHx');
    loadingSound.volume = 0.3;
    loadingSound.play().catch(() => {});

    const timer = setTimeout(() => {
      onLoadingComplete();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onLoadingComplete]);

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
      <div className="text-center space-y-8">
        <div className="relative">
          <div className="w-32 h-32 mx-auto bg-gradient-to-br from-indigo-400 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl animate-pulse-glow">
            <UtensilsCrossed className="h-16 w-16 text-white animate-spin" style={{ animationDuration: '3s' }} />
          </div>
          <div className="absolute -inset-8 bg-gradient-to-br from-indigo-400/20 to-purple-600/20 rounded-full blur-2xl animate-ping"></div>
        </div>
        
        <div className="space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-600 bg-clip-text text-transparent">
            GourmetGo
          </h1>
          <p className="text-gray-400">Loading your culinary experience...</p>
        </div>
      </div>
    </div>
  );
};

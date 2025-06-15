
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

    const timer = setTimeout(onLoadingComplete, 2000);
    return () => clearTimeout(timer);
  }, [onLoadingComplete]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-50 to-white flex items-center justify-center z-50">
      <div className="text-center space-y-8">
        <div className="relative">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-black to-gray-800 rounded-3xl flex items-center justify-center shadow-2xl float-animation">
            <UtensilsCrossed className="h-12 w-12 text-white" />
          </div>
          <div className="absolute -inset-4 bg-gradient-to-br from-black/20 to-gray-800/20 rounded-full blur-xl animate-ping"></div>
        </div>
        
        <div className="space-y-4">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-black to-gray-700 bg-clip-text text-transparent animate-pulse-glow">
            GourmetGo
          </h1>
          <p className="text-gray-600">Loading your culinary experience...</p>
        </div>
      </div>
    </div>
  );
};

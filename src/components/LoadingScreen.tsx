
import { useState, useEffect } from 'react';
import { UtensilsCrossed } from 'lucide-react';

interface LoadingScreenProps {
  onLoadingComplete: () => void;
}

export const LoadingScreen = ({ onLoadingComplete }: LoadingScreenProps) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Play loading sound
    const loadingSound = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBz2a3u25diMFnwHx');
    loadingSound.volume = 0.3;
    loadingSound.play().catch(() => {});

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onLoadingComplete, 500);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [onLoadingComplete]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-50 to-white flex items-center justify-center z-50">
      <div className="text-center space-y-8">
        <div className="relative">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-orange-400 to-orange-600 rounded-3xl flex items-center justify-center shadow-2xl animate-pulse">
            <UtensilsCrossed className="h-12 w-12 text-white" />
          </div>
          <div className="absolute -inset-4 bg-gradient-to-br from-orange-400/20 to-orange-600/20 rounded-full blur-xl animate-ping"></div>
        </div>
        
        <div className="space-y-4">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-orange-700 bg-clip-text text-transparent">
            GourmetGo
          </h1>
          <p className="text-gray-600">Loading your culinary experience...</p>
        </div>

        <div className="w-64 mx-auto">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-orange-400 to-orange-600 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-500 mt-2">{progress}%</p>
        </div>
      </div>
    </div>
  );
};

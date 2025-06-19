
import { UtensilsCrossed, Settings } from 'lucide-react';
import { Button } from './ui/button';

export const Header = () => {
  const openDashboard = () => {
    window.open('/dashboard', '_blank');
  };

  return (
    <header className="border-b bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between px-4">
        <a href="/" className="flex items-center space-x-2">
          <UtensilsCrossed className="h-6 w-6" />
          <span className="font-bold">GourmetGo</span>
        </a>
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={openDashboard}
            title="Dashboard"
          >
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};


import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Login from '@/components/Login';
import SignUp from '@/components/SignUp';

interface AuthWrapperProps {
  children: React.ReactNode;
}

const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [showSignUp, setShowSignUp] = useState(false);

  if (isAuthenticated) {
    return <>{children}</>;
  }

  if (showSignUp) {
    return <SignUp onSwitchToLogin={() => setShowSignUp(false)} />;
  }

  return <Login onSwitchToSignup={() => setShowSignUp(true)} />;
};

export default AuthWrapper;

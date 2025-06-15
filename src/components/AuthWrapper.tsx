
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Login from '@/components/Login';
import SignUp from '@/components/SignUp';
import Dashboard from '@/pages/Dashboard';

const AuthWrapper: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [showSignUp, setShowSignUp] = useState(false);

  if (isAuthenticated) {
    return <Dashboard />;
  }

  if (showSignUp) {
    return <SignUp onSwitchToLogin={() => setShowSignUp(false)} />;
  }

  return <Login onSwitchToSignup={() => setShowSignUp(true)} />;
};

export default AuthWrapper;

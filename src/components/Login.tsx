
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/contexts/AuthContext';
import { LogIn, Store, UserPlus, Eye, EyeOff, Apple, Sparkles } from 'lucide-react';

interface LoginFormData {
  username: string;
  password: string;
}

interface GuestFormData {
  storeName: string;
}

interface LoginProps {
  onSwitchToSignup: () => void;
}

const Login: React.FC<LoginProps> = ({ onSwitchToSignup }) => {
  const [isGuest, setIsGuest] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login, guestLogin } = useAuth();

  const loginForm = useForm<LoginFormData>();
  const guestForm = useForm<GuestFormData>();

  const onLoginSubmit = async (data: LoginFormData) => {
    setError('');
    const success = await login(data.username, data.password);
    if (!success) {
      setError('Invalid username or password');
    }
  };

  const onGuestSubmit = (data: GuestFormData) => {
    guestLogin(data.storeName);
  };

  if (isGuest) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-20 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-700"></div>
          <div className="absolute -bottom-8 left-40 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
        </div>

        <Card className="w-full max-w-md glass-morphism border-0 shadow-2xl backdrop-blur-xl bg-white/80 relative z-10">
          <CardHeader className="text-center pb-8">
            <div className="mx-auto mb-6 w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg animate-scale-in">
              <Store className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Guest Access
            </CardTitle>
            <CardDescription className="text-gray-600 text-lg">
              Enter your store name to continue
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Form {...guestForm}>
              <form onSubmit={guestForm.handleSubmit(onGuestSubmit)} className="space-y-6">
                <FormField
                  control={guestForm.control}
                  name="storeName"
                  rules={{ required: 'Store name is required' }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-semibold">Store Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter your store name" 
                          className="h-12 bg-white/70 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex gap-3 pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsGuest(false)} 
                    className="flex-1 h-12 rounded-xl border-gray-300 hover:bg-gray-50 transition-all duration-200"
                  >
                    Back
                  </Button>
                  <Button 
                    type="submit" 
                    className="flex-1 h-12 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    Continue as Guest
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-700"></div>
        <div className="absolute -bottom-8 left-40 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
      </div>

      <Card className="w-full max-w-md glass-morphism border-0 shadow-2xl backdrop-blur-xl bg-white/80 relative z-10">
        <CardHeader className="text-center pb-8">
          <div className="mx-auto mb-6 w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg animate-scale-in">
            <LogIn className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-gray-600 text-lg">
            Sign in to your dashboard
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Form {...loginForm}>
            <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-6">
              {error && (
                <div className="p-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl animate-fade-in">
                  {error}
                </div>
              )}
              
              <FormField
                control={loginForm.control}
                name="username"
                rules={{ required: 'Username is required' }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-semibold">Username</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter your username" 
                        className="h-12 bg-white/70 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={loginForm.control}
                name="password"
                rules={{ required: 'Password is required' }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-semibold">Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          type={showPassword ? "text" : "password"} 
                          placeholder="Enter your password" 
                          className="h-12 bg-white/70 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 pr-12" 
                          {...field} 
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                className="w-full h-12 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 text-white font-semibold"
              >
                <LogIn className="h-4 w-4 mr-2" />
                Sign In
              </Button>
            </form>
          </Form>

          <div className="space-y-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-3 text-gray-500 font-medium">Or continue with</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full h-12 rounded-xl border-gray-200 hover:bg-gray-50 transition-all duration-200"
              onClick={() => setIsGuest(true)}
            >
              <Store className="h-4 w-4 mr-2" />
              Continue as Guest
            </Button>

            <Button
              type="button"
              variant="ghost"
              className="w-full h-12 rounded-xl hover:bg-gray-50 transition-all duration-200 text-gray-700"
              onClick={onSwitchToSignup}
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Create New Account
            </Button>
          </div>

          <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <p className="text-xs text-blue-600 flex items-center">
              <Apple className="h-3 w-3 mr-1" />
              <strong>Admin Access:</strong> Username: admin, Password: admin
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;

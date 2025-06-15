
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/contexts/AuthContext';
import { LogIn, Store, UserPlus } from 'lucide-react';

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
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-12 h-12 bg-primary rounded-full flex items-center justify-center">
              <Store className="h-6 w-6 text-primary-foreground" />
            </div>
            <CardTitle className="text-2xl">Guest Access</CardTitle>
            <CardDescription>Enter your store name to continue as guest</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...guestForm}>
              <form onSubmit={guestForm.handleSubmit(onGuestSubmit)} className="space-y-4">
                <FormField
                  control={guestForm.control}
                  name="storeName"
                  rules={{ required: 'Store name is required' }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Store Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your store name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsGuest(false)} className="flex-1">
                    Back
                  </Button>
                  <Button type="submit" className="flex-1">
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 bg-primary rounded-full flex items-center justify-center">
            <LogIn className="h-6 w-6 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl">Welcome Back</CardTitle>
          <CardDescription>Sign in to your dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...loginForm}>
            <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
              {error && (
                <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                  {error}
                </div>
              )}
              
              <FormField
                control={loginForm.control}
                name="username"
                rules={{ required: 'Username is required' }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your username" {...field} />
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
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Enter your password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                Sign In
              </Button>
            </form>
          </Form>

          <div className="mt-6 space-y-3">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => setIsGuest(true)}
            >
              <Store className="h-4 w-4 mr-2" />
              Continue as Guest
            </Button>

            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={onSwitchToSignup}
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Create New Account
            </Button>
          </div>

          <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-xs text-blue-600">
              <strong>Admin Access:</strong> Username: admin, Password: admin
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;

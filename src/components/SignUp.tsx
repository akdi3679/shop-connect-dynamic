
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/contexts/AuthContext';
import { UserPlus, ArrowLeft, Eye, EyeOff, Sparkles, Store } from 'lucide-react';

interface SignUpFormData {
  username: string;
  password: string;
  confirmPassword: string;
  email: string;
  firstName: string;
  lastName: string;
  storeName: string;
  phoneNumber: string;
  location: string;
}

interface SignUpProps {
  onSwitchToLogin: () => void;
}

const SignUp: React.FC<SignUpProps> = ({ onSwitchToLogin }) => {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { signup } = useAuth();
  
  const form = useForm<SignUpFormData>();

  const onSubmit = async (data: SignUpFormData) => {
    setError('');
    setSuccess('');

    if (data.password !== data.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (data.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    const { confirmPassword, ...signupData } = data;
    const success = await signup(signupData);
    
    if (success) {
      setSuccess('Account created successfully! You are now logged in.');
    } else {
      setError('Username already exists. Please choose a different username.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-700"></div>
        <div className="absolute -bottom-8 left-40 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
      </div>

      <Card className="w-full max-w-3xl glass-morphism border-0 shadow-2xl backdrop-blur-xl bg-white/80 relative z-10">
        <CardHeader className="text-center pb-8">
          <div className="mx-auto mb-6 w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg animate-scale-in">
            <UserPlus className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Create Supplier Account
          </CardTitle>
          <CardDescription className="text-gray-600 text-lg">
            Register your store to start managing orders
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {error && (
                <div className="p-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl animate-fade-in">
                  {error}
                </div>
              )}
              
              {success && (
                <div className="p-4 text-sm text-green-600 bg-green-50 border border-green-200 rounded-xl animate-fade-in">
                  {success}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="firstName"
                  rules={{ required: 'First name is required' }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-semibold">First Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter your first name" 
                          className="h-12 bg-white/70 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lastName"
                  rules={{ required: 'Last name is required' }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-semibold">Last Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter your last name" 
                          className="h-12 bg-white/70 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="storeName"
                rules={{ required: 'Store name is required' }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-semibold flex items-center">
                      <Store className="h-4 w-4 mr-2" />
                      Store Name
                    </FormLabel>
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="username"
                  rules={{ 
                    required: 'Username is required',
                    minLength: { value: 3, message: 'Username must be at least 3 characters' }
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-semibold">Username</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Choose a username" 
                          className="h-12 bg-white/70 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  rules={{ 
                    required: 'Email is required',
                    pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' }
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-semibold">Email</FormLabel>
                      <FormControl>
                        <Input 
                          type="email" 
                          placeholder="Enter your email" 
                          className="h-12 bg-white/70 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="phoneNumber"
                rules={{ required: 'Phone number is required' }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-semibold">Phone Number</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter your phone number" 
                        className="h-12 bg-white/70 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                rules={{ required: 'Location is required' }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-semibold">Location</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter your store address/location" 
                        className="bg-white/70 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 min-h-[80px]" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="password"
                  rules={{ 
                    required: 'Password is required',
                    minLength: { value: 6, message: 'Password must be at least 6 characters' }
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-semibold">Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input 
                            type={showPassword ? "text" : "password"} 
                            placeholder="Create a password" 
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

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  rules={{ required: 'Please confirm your password' }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-semibold">Confirm Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input 
                            type={showConfirmPassword ? "text" : "password"} 
                            placeholder="Confirm your password" 
                            className="h-12 bg-white/70 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 pr-12" 
                            {...field} 
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                          >
                            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex gap-4 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onSwitchToLogin}
                  className="flex-1 h-12 rounded-xl border-gray-300 hover:bg-gray-50 transition-all duration-200"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Login
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1 h-12 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Create Account
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignUp;

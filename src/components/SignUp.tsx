
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/contexts/AuthContext';
import { UserPlus, ArrowLeft } from 'lucide-react';

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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 bg-primary rounded-full flex items-center justify-center">
            <UserPlus className="h-6 w-6 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl">Create Supplier Account</CardTitle>
          <CardDescription>Register your store to start managing orders</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {error && (
                <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                  {error}
                </div>
              )}
              
              {success && (
                <div className="p-3 text-sm text-green-600 bg-green-50 border border-green-200 rounded-md">
                  {success}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  rules={{ required: 'First name is required' }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your first name" {...field} />
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
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your last name" {...field} />
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
                    <FormLabel>Store Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your store name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="username"
                  rules={{ 
                    required: 'Username is required',
                    minLength: { value: 3, message: 'Username must be at least 3 characters' }
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="Choose a username" {...field} />
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
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="Enter your email" {...field} />
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
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your phone number" {...field} />
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
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter your store address/location" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="password"
                  rules={{ 
                    required: 'Password is required',
                    minLength: { value: 6, message: 'Password must be at least 6 characters' }
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Create a password" {...field} />
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
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Confirm your password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onSwitchToLogin}
                  className="flex-1"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Login
                </Button>
                <Button type="submit" className="flex-1">
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

'use client';

import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDebounceCallback } from 'usehooks-ts';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import axios, { AxiosError } from 'axios';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { signupSchema } from '@/schemas/signupSchema'
import { Eye, EyeOff } from 'lucide-react';

export default function SignUpPage() {
  const [username, setUsername] = useState('');
  const [usernameMessage, setUsernameMessage] = useState('');
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const debounced = useDebounceCallback(setUsername, 1500);

  const router = useRouter();
 

  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
    },
  });

  useEffect(() => {
    const checkUsernameUnique = async () => {
      
      if (!username || username.length < 3) {
        setUsernameMessage(''); // Clear error
        return; 
      }

      setIsCheckingUsername(true);
      setUsernameMessage('');
      try {
        const response = await axios.get<ApiResponse>(
          `/api/check-username-unique?username=${username}`
        );
        setUsernameMessage(response.data.message);
      } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernameMessage(
            axiosError.response?.data.message ?? 'Error checking username'
          );
        } finally {
          setIsCheckingUsername(false);
        }
      }
    
    checkUsernameUnique();
  }, [username]);

  const onSubmit = async (data: z.infer<typeof signupSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>('/api/sign-up', data);

      toast.success('Success', {
    description: response.data.message,
  });

      router.replace(`/verify/${username}`);

      setIsSubmitting(false);
    } catch (error) {
      console.error('Error during sign-up:', error);
      const axiosError = error as AxiosError<ApiResponse>;

      let errorMessage = axiosError.response?.data.message;
      ('There was a problem with your sign-up. Please try again.');

      toast.error('Sign Up Failed', {
             description: errorMessage,
      });

      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-950 text-white p-4">
      <div className="w-full max-w-md p-8 space-y-8 bg-gray-900 rounded-2xl shadow-xl border border-gray-800 my-8">
        <div className="text-center space-y-3">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-6">
            Say it <span className="text-cyan-400">anonymously</span>.
            <br />
            Say it <span className="text-cyan-400">honestly</span>.
          </h1>
          <p className="text-gray-400">
            Join a safe space for anonymous messages.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="username"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Username</FormLabel>
                  <Input
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      debounced(e.target.value);
                    }}
                    className="bg-gray-950 border-gray-800 text-white focus-visible:ring-cyan-500 h-11"
                    placeholder="Enter unique username"
                  />
                  {isCheckingUsername && <Loader2 className="animate-spin h-4 w-4 text-gray-400" />}
                  {!isCheckingUsername && usernameMessage && (
                    <p
                      className={`text-sm ${
                        usernameMessage === 'Username is unique'
                          ? 'text-green-400'
                          : 'text-red-400'
                      }`}
                    >
                      {usernameMessage}
                    </p>
                  )}
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Email</FormLabel>
                  <Input 
                    {...field} 
                    name="email" 
                    className="bg-gray-950 border-gray-800 text-white focus-visible:ring-cyan-500 h-11" 
                    placeholder="Enter your email"
                  />
                  <p className='text-gray-400 text-xs mt-1'>We will send you a verification code</p>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Password</FormLabel>
                  <Input 
                    type={showPassword ? "text" : "password"}
                    {...field} 
                    name="password" 
                    className="bg-gray-950 border-gray-800 text-white focus-visible:ring-cyan-500 h-11" 
                    placeholder="Create a password"
                  />
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            <Button type="submit" className='w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold h-11 transition-all' disabled={isSubmitting || isCheckingUsername}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                'Sign Up'
              )}
            </Button>
          </form>
        </Form>
        
<div className="text-center mt-6">
  <p className="text-gray-400 text-sm">
    Already a member?{' '}
    <Link href="/sign-in" className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors">
      Sign in
    </Link>
  </p>
  <p className="text-gray-400 text-xs mt-4">
    By signing up, you agree to our{' '}
    <Link href="/safety" className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors">
      Safety Terms
    </Link>{' '}
    and{' '}
    <Link href="/privacy" className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors">
      Privacy Policy
    </Link>
    .
  </p>
</div>
      
      </div>
    </div>
  );
}
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { signIn } from 'next-auth/react';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ButtonLoader from '@/components/ui/ButtonLoader';
import { signinSchema } from '@/schemas/signinSchema';
import { useState } from 'react';
import { toast } from 'sonner';
import { Eye, EyeOff } from 'lucide-react';
export default function SignInPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof signinSchema>>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      identifier: '',
      password: '',
    },
  });

 

 const onSubmit = async (data: z.infer<typeof signinSchema>) => {
  setIsSubmitting(true);
  try {
    const result = await signIn('credentials', {
      redirect: false,
      identifier: data.identifier,
      password: data.password,
    });

    if (result?.error) {
      if (result.error === 'CredentialsSignin') {
        toast.error('Login Failed', { description: 'Incorrect username or password' });
      } else {
        toast.error('Error', { description: result.error });
      }
      
      setIsSubmitting(false);
      return;
    }

if (result?.url) {
  toast.success('Login Successful');
  setIsSubmitting(false); 
 window.location.href = '/dashboard';
}
  } catch (error) {
    toast.error('An unexpected error occurred');
    setIsSubmitting(false);
  }
};

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-950 text-white p-4">
      <div className="w-full max-w-md p-8 space-y-8 bg-gray-900 rounded-2xl shadow-xl border border-gray-800">
        
        <div className="text-center space-y-3">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-6">
            Welcome Back to <span className="text-cyan-400">Whisper Box</span>
          </h1>
          <p className="text-gray-400">
            Sign in to continue your anonymous adventure
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="identifier"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Email/Username</FormLabel>
                  <Input 
                    {...field} 
                    className="bg-gray-950 border-gray-800 text-white focus-visible:ring-cyan-500 h-11"
                    placeholder="Enter username or email" 
                  />
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
                    className="bg-gray-950 border-gray-800 text-white focus-visible:ring-cyan-500 h-11" 
                    placeholder="Enter password"
                  />
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            <Button type="submit" className='w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold h-11 transition-all' disabled={isSubmitting}>
             {isSubmitting ? <ButtonLoader /> : 'Sign In'}
            </Button>
          </form>
        </Form>
        
        <div className="text-center mt-4">
          <p className="text-gray-400 text-sm">
            New here?{' '}
            <Link href="/sign-up" className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors">
              Sign up
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}

'use client';

import ButtonLoader from '@/components/ui/ButtonLoader';
import { verifySchema } from '@/schemas/verifySchema';
import { useParams, useRouter } from 'next/navigation';
import React, { useState } from 'react';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner'; 
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { ApiResponse } from '@/types/ApiResponse';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCcw } from 'lucide-react';
import Link from 'next/link';
const VerifyAccount = () => {
  const router = useRouter();
  const params = useParams<{ username: string }>();
  const [isResending, setIsResending] = useState(false);

  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      code: '',
    },
  });

  //  1. Verify Submission Handler
  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    try {
      const response = await axios.post(`/api/verify-code`, {
        username: params.username,
        code: data.code,
      });

      toast.success('Verified!', {
        description: response.data.message,
      });

      router.replace('/sign-in');
    } catch (error) {
      console.error('Error verifying user', error);
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error('Verification Failed', {
        description:
          axiosError.response?.data.message ?? 'An error occurred. Please try again.',
      });
    }
  };

  //  2. Resend Code Handler
  const handleResendCode = async () => {
    setIsResending(true);
    try {
     
      const response = await axios.post('/api/resend-code', {
        username: params.username,
      });

      toast.success('Code Sent', {
        description: response.data.message || "A new verification code has been sent to your email.",
      });
    } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        toast.error('Error', {
            description: axiosError.response?.data.message || "Failed to resend code.",
        });
    } finally {
      setIsResending(false);
    }
  };

return (
  <div className="flex justify-center items-center min-h-screen bg-gray-950 text-white p-4">
    <div className="w-full max-w-md p-8 space-y-8 bg-gray-900 rounded-2xl shadow-xl border border-gray-800">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-2">
          Verify Your Account
        </h1>
        <p className="text-gray-400 text-sm">
          Enter the verification code sent to your email for <span className='font-semibold text-cyan-400'>@{params.username}</span>
        </p>
      </div>

      {/* Verification Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            name="code"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-300">Verification Code</FormLabel>
                <Input 
                  {...field} 
                  className="bg-gray-950 border-gray-800 text-white focus-visible:ring-cyan-500 h-11 text-center text-lg tracking-widest"
                  placeholder="123456"
                />
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />

          <Button 
              type="submit" 
              className='w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold h-11 transition-all'
          >
            Verify
          </Button>
        </form>
      </Form>

      {/* Resend Option */}
      <div className="text-center mt-6">
          <p className="text-sm text-gray-400 mb-2">
              Didn't receive the code?
          </p>
          <Button
              variant="outline"
              onClick={handleResendCode}
              disabled={isResending}
              className="w-full border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
          >
              {isResending ? (
                  <>
                      <ButtonLoader />
                  </>
              ) : (
                  <>
                      <RefreshCcw className="mr-2 h-4 w-4" />
                      Resend Code
                  </>
              )}
          </Button>
          
          {/* Support Message */}
          <p className="text-xs text-gray-500 mt-4">
              Didn't get the code? Check your spam or{' '}
              <Link href="/about" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                  Contact Support
              </Link>
              .
          </p>
      </div>

    </div>
  </div>
);
}
export default VerifyAccount;
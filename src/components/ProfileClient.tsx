'use client';

import React, { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Loader2, Sparkles, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CardContent, Card } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import * as z from 'zod';
import { ApiResponse } from '@/types/ApiResponse';
import Link from 'next/link';
import { messageSchema } from '@/schemas/messageSchema';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

const specialChar = '||';

const parseStringMessages = (messageString: string): string[] => {
  return messageString.split(specialChar).filter(msg => msg.trim() !== '');
};

const initialMessageString =
  "What's your favorite movie?||Do you have any pets?||What's your dream job?";

export default function ProfileClient({ username }: { username: string }) {
  const [suggestions, setSuggestions] = useState<string[]>(
    parseStringMessages(initialMessageString)
  );
  const [isGeneratingSuggestions, setIsGeneratingSuggestions] = useState(false);
  const [suggestionError, setSuggestionError] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: '',
    },
  });

  const messageContent = form.watch('content');

  // ✅ UX Fix: Confirmation for replacing text with suggestions
  const handleMessageClick = (message: string) => {
    const currentContent = form.getValues('content');
    if (currentContent.trim() !== '' && currentContent !== message) {
      if (window.confirm("Replace your current message with this suggestion?")) {
        form.setValue('content', message);
      }
    } else {
      form.setValue('content', message);
    }
  };

  const generateSuggestions = async () => {
    setIsGeneratingSuggestions(true);
    setSuggestionError(null);
    try {
      const response = await axios.post('/api/suggest-messages');
      const newSuggestions = parseStringMessages(response.data);
      setSuggestions(newSuggestions);
    } catch (error) {
      console.error('Failed to generate suggestions:', error);
      setSuggestionError('Failed to generate new suggestions');
    } finally {
      setIsGeneratingSuggestions(false);
    }
  };

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    // ✅ Defensive trim check
    if (!data.content.trim()) return;

    setIsSending(true);
    try {
      const decodedUsername = decodeURIComponent(username);
      const response = await axios.post<ApiResponse>('/api/send-message', {
        username: decodedUsername,
        content: data.content,
      });

      toast.success(response.data.message ?? 'Message sent successfully!');
      form.reset({ content: '' });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      const status = axiosError.response?.status;

      // ✅ Unified error messaging for 400, 403, 429
      if (status === 400 || status === 403 || status === 429) {
        toast.error('Message could not be delivered', {
          description: "Please try again later.",
          duration: 3000,
        });
      } else {
        toast.error('Failed to send message', {
          description: axiosError.response?.data.message ?? 'An unknown error occurred.',
        });
      }
    } finally {
      setIsSending(false);
    }
  };

  useEffect(() => {
    setIsOpen(true);
  }, []);

  // ✅ Removed document-level dark mode force to prevent global DOM side-effects

  return (
    <div className="min-h-[calc(100vh-80px)] bg-background flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-3xl mx-auto bg-card rounded-2xl shadow-xl overflow-hidden border border-border">
        
        {/* Header Section */}
        <div className="px-6 py-8 sm:px-10 text-center border-b border-border">
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight sm:text-4xl">
            Drop a Message for @{username}
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Send an anonymous message to <span className="font-semibold text-primary">@{username}</span>
          </p>
        </div>

        {/* Form Section */}
        <div className="px-6 py-8 sm:px-10 space-y-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-between items-end">
                      <FormLabel className="font-semibold text-foreground">Your Message</FormLabel>
                      {/* ✅ Optional: Character Counter */}
                      <span className={`text-xs ${messageContent.length > 300 ? 'text-destructive' : 'text-muted-foreground'}`}>
                        {messageContent.length} / 300
                      </span>
                    </div>
                    <FormControl>
                      <Textarea
                        placeholder="Say something nice or ask a question..."
                        className="resize-none min-h-[120px] bg-muted/50 border-input focus:bg-background transition-all text-base text-foreground placeholder:text-muted-foreground"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex justify-center">
                <Button 
                  type="submit" 
                  // ✅ Submit disabled when trimmed empty or over limit
                  disabled={isSending || !messageContent?.trim() || messageContent.length > 300} 
                  className="w-full sm:w-auto min-w-[150px]" 
                >
                  {isSending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Send Message
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>

          {/* Suggestions Section */}
          <div className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Need Inspiration?</h3>
              <Button
                onClick={generateSuggestions}
                disabled={isGeneratingSuggestions}
                variant="outline"
                size="sm"
                className="gap-2 text-muted-foreground border-border hover:text-foreground hover:bg-muted"
              >
                {isGeneratingSuggestions ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
                New Ideas
              </Button>
            </div>

            <Card className="border-dashed border-2 shadow-none bg-muted/30 border-border">
              <CardContent className="p-4">
                {suggestionError && (
                  <p className="text-destructive text-sm mb-2">{suggestionError}</p>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {suggestions.map((message, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="h-auto py-3 px-4 text-left justify-start whitespace-normal bg-card border-border hover:border-primary/50 hover:bg-muted transition-colors text-foreground"
                      onClick={() => handleMessageClick(message)}
                    >
                      <span className="line-clamp-2">{message}</span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="bg-muted/50 px-6 py-6 sm:px-10 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-sm text-muted-foreground font-medium">Want your own anonymous board?</span>
          <Link href={'/sign-up'}>
            <Button variant="secondary" className="shadow-sm border border-border">
              Create Free Account
            </Button>
          </Link>
        </div>
      </div>

      {/* Pop-up Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
          
            <DialogTitle>Welcome to Whisper Box ✌️</DialogTitle>
            <DialogDescription>
              Please be respectful. All messages are anonymous, but we **automatically filter harmful content**. See more about our
              {' '} 
              <Link href="/safety" className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors">
                safety guidelines
              </Link>.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end">
            <Button onClick={() => setIsOpen(false)}>Got it</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
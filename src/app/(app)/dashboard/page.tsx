'use client'

import { Message } from "@/model/User.model";
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { MessageCard } from '@/components/MessageCard';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { User } from "next-auth";
import { Loader2, RefreshCcw, Copy, LayoutDashboard } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import Link from "next/link";
import PageLoader from "@/components/ui/PageLoader";

const Dashboard = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSwitchLoading, setIsSwitchLoading] = useState(false);
    const [baseUrl, setBaseUrl] = useState('');

    const { data: session, status } = useSession();

    const form = useForm({
        resolver: zodResolver(acceptMessageSchema)
    });

    const { register, watch, setValue } = form;
    const acceptMessages = watch('acceptMessages');

    const handleDeleteMessage = (messageId: string) => {
        setMessages(messages.filter((message) => message._id !== messageId));
    };

    const fetchAcceptMessage = useCallback(async () => {
        setIsSwitchLoading(true);
        try {
            const response = await axios.get<ApiResponse>(`/api/accept-messages`);
            setValue('acceptMessages', response.data.isAcceptingMessages ?? false);
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast.error('Error fetching settings', {
                description: axiosError.response?.data.message || "Failed to fetch message settings"
            });
        } finally {
            setIsSwitchLoading(false);
        }
    }, [setValue]);

    const fetchMessages = useCallback(async (refresh: boolean = false) => {
        setIsLoading(true);
        setIsSwitchLoading(false);
        try {
            const response = await axios.get<ApiResponse>(`/api/get-messages`);
            setMessages(response.data.messages || []);
            if (refresh) {
                toast.success('Refreshed messages', {
                    description: "Showing latest messages"
                });
            }
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            if (axiosError.response?.status === 404) {
                setMessages([]);
                toast('No messages found', { description: "Your inbox is empty." });
            } else {
                toast.error('Error', {
                    description: axiosError.response?.data.message || "Failed to fetch messages"
                });
            }
        } finally {
            setIsLoading(false);
        }
    }, [setIsLoading, setMessages]);

    //  1. Initialize Base URL Safe for SSR
    useEffect(() => {
        setBaseUrl(`${window.location.protocol}//${window.location.host}`);
    }, []);

    //  2. Fetch Data
    useEffect(() => {
        if (!session || !session.user) return;
        fetchMessages();
        fetchAcceptMessage();
    }, [session, setValue, fetchAcceptMessage, fetchMessages]);

    // Handle switch change
    const handleSwitchChange = async () => {
        try {
            const response = await axios.post<ApiResponse>(`/api/accept-messages`, {
                acceptMessages: !acceptMessages
            });
            setValue('acceptMessages', !acceptMessages);
            toast.success(response.data.message);
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast.error('Error', {
                description: axiosError.response?.data.message || "Failed to update settings"
            });
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(profileUrl);
        toast.success('Link copied!', {
            description: "Profile URL has been copied to clipboard"
        });
    };

   
    if (status === "loading") {
        return <PageLoader />;
    }

    
    if (!session || !session.user) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[80vh] bg-background p-4 text-center">
                <div className="bg-card p-8 rounded-2xl shadow-lg border border-border max-w-md w-full space-y-6">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <LayoutDashboard className="w-8 h-8 text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold text-foreground">Access Denied</h2>
                    <p className="text-muted-foreground">Please sign in to access your dashboard and manage your anonymous messages.</p>
                    <Link href="/sign-in" className="block w-full">
                        <Button className="w-full gap-2">Sign In</Button>
                    </Link>
                </div>
            </div>
        );
    }

    // Authenticated User Data
    const { username } = session?.user as User;
    const profileUrl = `${baseUrl}/u/${username}`;

    return (
        <div className="min-h-[calc(100vh-80px)] bg-background w-full py-8">
            <div className="mx-4 md:mx-8 lg:mx-auto p-6 bg-card rounded-xl shadow-sm max-w-6xl w-full border border-border">
                
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-4xl font-bold text-foreground">User Dashboard</h1>
                        <p className="text-muted-foreground mt-1">Manage your messages and settings</p>
                    </div>
                    <Button
                        variant="outline"
                        onClick={(e) => {
                            e.preventDefault();
                            fetchMessages(true);
                        }}
                        disabled={isLoading}
                        className="gap-2"
                    >
                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCcw className="h-4 w-4" />}
                        Refresh Messages
                    </Button>
                </div>

                {/* URL Card */}
                <Card className="mb-8 border-dashed border-2 shadow-none bg-muted/30 border-primary/20">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-lg text-foreground flex items-center gap-2">
                             Your Unique Link
                        </CardTitle>
                        <CardDescription>Share this link to receive anonymous messages</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col md:flex-row items-center gap-3">
                            <input
                                type="text"
                                value={profileUrl}
                                disabled
                                className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground disabled:opacity-50 font-mono"
                            />
                            <Button onClick={copyToClipboard} className="w-full md:w-auto gap-2 bg-primary hover:bg-primary/90 text-primary-foreground h-11">
                                <Copy className="w-4 h-4" /> Copy Link
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Switch Section */}
                <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-card shadow-sm mb-8 transition-all hover:shadow-md">
                    <div className="flex flex-col gap-1">
                        <span className="font-semibold text-foreground">Accept Messages</span>
                        <span className="text-sm text-muted-foreground">Enable or disable receiving new messages</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className={`text-sm font-medium ${acceptMessages ? "text-green-500" : "text-gray-500"}`}>
                            {acceptMessages ? "Active" : "Paused"}
                        </span>
                        <Switch
                            {...register('acceptMessages')}
                            checked={acceptMessages}
                            onCheckedChange={handleSwitchChange}
                            disabled={isSwitchLoading}
                        />
                    </div>
                </div>

                <Separator className="my-8" />

                {/* Messages Grid */}
                <div className="flex items-center gap-2 mb-6">
                    <h2 className="text-2xl font-semibold text-foreground">Your Messages</h2>
                    <span className="bg-muted text-muted-foreground text-xs font-medium px-2.5 py-0.5 rounded-full">
                        {messages.length}
                    </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {messages.length > 0 ? (
                        messages.map((message) => (
                            <MessageCard
                                key={String(message._id)}
                                message={message}
                                onMessageDelete={handleDeleteMessage}
                            />
                        ))
                    ) : (
                        <div className="col-span-full flex flex-col items-center justify-center py-24 bg-muted/10 rounded-xl border-2 border-dashed border-muted">
                            <div className="text-6xl mb-4 grayscale opacity-50">📭</div>
                            <h3 className="text-foreground font-semibold text-xl">No messages yet</h3>
                            <p className="text-muted-foreground text-sm mt-2 max-w-sm text-center">
                                Your inbox is waiting! Copy your unique link above and share it on your social media.
                            </p>
                        </div>
                    )}
                   
                
                </div>
                <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
                    <p>Having trouble? Contact <a href="mailto:support@whisper-box.xyz" className="text-primary hover:underline font-medium">Customer Support</a></p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
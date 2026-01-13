'use client';

import { Mail, Shield, Lock, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Autoplay from 'embla-carousel-autoplay';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import Link from 'next/link';

export default function Home() {
  
  const messages = [
    {
      title: "Secret Admirer",
      content: "I really like your style! Keep shining ✨",
      received: "10 mins ago"
    },
    {
      title: "Honest Feedback",
      content: "Your latest project was super helpful. Thanks!",
      received: "2 hours ago"
    },
    {
      title: "Mystery Friend",
      content: "Guess who? We should hang out soon.",
      received: "1 day ago"
    }
  ];

  const features = [
    {
      icon: Lock,
      title: "Anonymous by Default",
      description: "No sender account required"

    },
    {
      icon: Shield,
      title: "Safety Moderation",
      description: "Abusive content is automatically filtered"

    },
    {
      icon: MessageSquare,
      title: "Shareable Link",
      description: "Post it anywhere to start receiving messages"

    }
  ];
return (
    <div className="flex flex-col min-h-[calc(100vh-80px)] bg-background">
      <main className="flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-12">
        {/* Hero Section */}
        <section className="text-center mb-12 md:mb-16 max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground mb-6 leading-tight">
            Dive into the World of <br/>
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
               Anonymous Messages
            </span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                   Start receiving anonymous messages today
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Button size="lg" className="text-lg px-8 py-6 dardk.bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:scale-105 hover:shadow-2xl transition-all duration-300">
               <Link href="/sign-up" >
                Get Started Free
            </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px -8 py-6 hover:bg-primary/10 hover:border-primary hover:scale-105 transition-all duration-300">
              <Link href="/about" >
                See How It Works
            </Link>
            </Button>
          </div>
        </section>

        {/* Feature Cards */}
        <section className="w-full max-w-5xl mb-12 md:mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="border-border bg-card hover:shadow-xl hover:-translate-y-1 hover:border-primary/50 transition-all duration-300 cursor-pointer group">
                <CardContent className="pt-6 text-center">
                  <div className="inline-flex p-3 bg-primary/10 group-hover:bg-primary/20 rounded-full mb-4 transition-colors duration-300">
                    <feature.icon className="w-6 h-6 text-primary group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors duration-300">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Carousel Section */}
        <section className="w-full max-w-4xl">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
            See What You Might Receive
          </h2>
          <Carousel
            plugins={[Autoplay({ delay: 3000 })]}
            className="w-full max-w-lg md:max-w-2xl mx-auto"
          >
            <CarouselContent>
              {messages.map((message, index) => (
                <CarouselItem key={index} className="p-4 basis-full">
                  <Card className="border-border shadow-lg bg-card hover:shadow-2xl hover:border-primary/30 hover:-translate-y-2 transition-all duration-300 select-none group cursor-pointer">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg font-semibold text-card-foreground group-hover:text-primary transition-colors duration-300">
                        {message.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex items-start space-x-4">
                      <div className="p-3 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 group-hover:from-blue-500/30 group-hover:to-indigo-500/30 rounded-full shrink-0 transition-all duration-300">
                        <Mail className="w-5 h-5 text-primary group-hover:scale-110 transition-transform duration-300" />
                      </div>
                      <div className="flex-1">
                        <p className="text-card-foreground text-base leading-relaxed">
                          {message.content}
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {message.received}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </section>

        {/* Social Proof */}
        <section className="mt-16 text-center">
          <p className="text-sm text-muted-foreground">
            Start receiving anonymous messages today
          </p>
        </section>
      </main>
    </div>
  );
}
 
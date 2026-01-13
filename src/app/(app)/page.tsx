'use client';

import { Mail } from 'lucide-react'; 
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Autoplay from 'embla-carousel-autoplay';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';

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

  return (
    <div className="flex flex-col min-h-[calc(100vh-80px)] bg-background">
      <main className="flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-12">
        <section className="text-center mb-8 md:mb-12 max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground mb-4">
            Dive into the World of <br/>
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Anonymous Feedback
            </span>
          </h1>
          <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-xl mx-auto">
            True Feedback - Where your identity remains a secret. Collect honest thoughts from your friends and followers easily.
          </p>
        </section>

        {/* Carousel for Messages */}
        <Carousel
          plugins={[Autoplay({ delay: 2000 })]}
          className="w-full max-w-lg md:max-w-xl"
        >
          <CarouselContent>
            {messages.map((message, index) => (
            
              <CarouselItem key={index} className="p-6 basis-full">
                <Card className="border-border shadow-md bg-card h-full select-none">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-semibold flex items-center gap-2 text-card-foreground">
                       {message.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col md:flex-row items-start space-y-2 md:space-y-0 md:space-x-4">
                    <div className="p-2 bg-primary/10 rounded-full text-primary">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-card-foreground">{message.content}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {message.received}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </main>

    </div>
  );
}
import React from 'react';
import { Mail, ShieldCheck, Zap, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-16">
        
        {/* Section 1: The Story */}
        <section className="text-center space-y-4">
          <h1 className="text-4xl font-extrabold tracking-tight text-primary sm:text-5xl">
            About Whisper Box
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            We built Whisper Box to give people a space for honest, anonymous feedback 
            without the fear of judgment.
          </p>
        </section>

        {/* Section 2: Features/Safety */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 bg-card rounded-xl border border-border space-y-3">
            <Zap className="text-cyan-400 h-8 w-8" />
            <h3 className="font-bold text-lg">Instant Sharing</h3>
            <p className="text-sm text-muted-foreground">Get your unique link and start receiving messages in seconds.</p>
          </div>
          <div className="p-6 bg-card rounded-xl border border-border space-y-3">
            <ShieldCheck className="text-cyan-400 h-8 w-8" />
            <h3 className="font-bold text-lg">AI Moderation</h3>
            <p className="text-sm text-muted-foreground">Our built-in AI filters out hate speech and harassment automatically.</p>
          </div>
          <div className="p-6 bg-card rounded-xl border border-border space-y-3">
            <HelpCircle className="text-cyan-400 h-8 w-8" />
            <h3 className="font-bold text-lg">Total Anonymity</h3>
            <p className="text-sm text-muted-foreground">Senders never need to log in. Your privacy is our priority.</p>
          </div>
        </div>

        <Separator className="bg-border" />

        {/* Section 3: Customer Support (AS REQUESTED) */}
        <section className="bg-muted/30 rounded-2xl p-8 border border-dashed border-border text-center space-y-6">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold">Customer Support</h2>
            <p className="text-muted-foreground">
              Having trouble with your account or noticed a bug? Our team is here to help.
            </p>
          </div>

          <div className="flex flex-col items-center space-y-4">
            <a href="mailto:support@whisper-box.xyz">
              <Button size="lg" className="gap-2 px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-cyan-500/20 transition-all">
                <Mail className="h-5 w-5" />
                Email Support
              </Button>
            </a>
            <p className="text-sm text-muted-foreground italic">
              Typical response time: Within 24 hours
            </p>
          </div>

          {/* Mini FAQ */}
          <div className="pt-8 text-left max-w-2xl mx-auto space-y-4">
            <h4 className="font-bold text-foreground">Common Questions:</h4>
            <div className="space-y-4">
              <details className="group cursor-pointer">
                <summary className="font-medium hover:text-primary transition-colors">How do I delete a message?</summary>
                <p className="text-sm text-muted-foreground mt-2 pl-4 border-l-2 border-primary">Log into your dashboard and click the 'Delete' icon on any message card.</p>
              </details>
              <details className="group cursor-pointer">
                <summary className="font-medium hover:text-primary transition-colors">Can I block a specific user?</summary>
                <p className="text-sm text-muted-foreground mt-2 pl-4 border-l-2 border-primary">Since messages are anonymous, you can turn off "Accept Messages" in your settings to pause all incoming feedback.</p>
              </details>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
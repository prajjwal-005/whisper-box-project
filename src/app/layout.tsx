import type { Metadata } from "next";
import { Inter ,Space_Grotesk } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/context/AuthProvider";
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from '@/components/Navbar';
import { Toaster } from "@/components/ui/sonner";
import Footer from "@/components/Footer";

export const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
});

export const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-space-grotesk",
});


export const metadata: Metadata = {
  metadataBase: new URL('https://whisper-box.xyz'), 
  title: {
    default: 'Whisper Box',
    template: '%s | Whisper Box',
  },
  description: 'Send anonymous messages to your friends. Safe, honest, and fun.',
  openGraph: {
    title: 'Whisper Box | Anonymous Messaging',
    description: 'Send secret messages to your friends. Honest. Safe.',
    images: [
      {
        url: '/og-image.png', 
        width: 1200,
        height: 630,
        alt: 'Whisper Box Preview Image',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Whisper Box | Anonymous Messaging',
    description: 'Send secret messages to your friends. Honest. Safe.',
    images: ['/og-image.png'], 
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning
    className={`${inter.variable} ${spaceGrotesk.variable}`}
    > 
    <body className={`${inter.className} min-h-screen bg-white dark:bg-slate-900 text-gray-900 dark:text-white`}>
      <AuthProvider>
        <ThemeProvider 
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </div>
          <Toaster 
            richColors 
            position="bottom-right" 
            toastOptions={{
              style: { borderRadius: '12px' },
            }}
          />
        </ThemeProvider>
      </AuthProvider>
    </body>
    </html>
  );
}
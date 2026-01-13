'use client'
import React from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { Button } from './ui/button'
import { Loader2 } from 'lucide-react' 
import { ModeToggle } from './mode-toggle' 
import Image from 'next/image';
import { Space_Grotesk } from 'next/font/google';
import { usePathname } from 'next/navigation';

//  Configure the font
const logoFont = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-space-grotesk",
});

const Navbar = () => {
    const { data: session, status } = useSession()
    // Get current path
  const pathname = usePathname();

  // Define pages where Navbar should be HIDDEN
  const disableNavbarRoutes = ['/sign-in', '/sign-up', '/verify'];

  //  If current page is in the list, return nothing
  if (disableNavbarRoutes.includes(pathname) || pathname.startsWith('/verify')) {
    return null; 
  }
    
    return (
        <nav className="p-4 md:p-6 shadow-md bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 transition-colors duration-300">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        
        {/* LOGO SECTION */}
        <Link href="/" className="flex items-center gap-3 mb-4 md:mb-0 group">
          {/* Icon */}
          <Image 
            src="/logo.png" 
            alt="Whisber Box Logo"
            width={40}
            height={40}
            className="object-contain transition-transform group-hover:scale-105" // Subtle zoom on hover
            priority
          />
          
          {/*  Text adapts: Dark in light mode, White in dark mode */}
          <span className={`text-2xl tracking-wide text-gray-900 dark:text-white transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400 ${logoFont.className} font-semibold`}>
            Whisper Box
          </span>
        </Link>

                <div className="flex items-center gap-4"> {/* Wrapper div */}
                    
                    {/* Toggle Button Here */}
                    <ModeToggle /> 

                    {status === 'loading' ? (
                         <div className="flex items-center gap-2 text-muted-foreground text-sm">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Loading...
                         </div>
                    ) : session ? (
                        <>
                            <span className="text-sm text-muted-foreground hidden md:inline">
                                Welcome, <span className="font-semibold text-foreground">{session.user?.username || session.user?.email}</span>
                            </span>
                            <Button className="w-full md:w-auto shadow-sm" onClick={() => signOut()} variant="destructive">
                                Logout
                            </Button>
                        </>
                    ) : (
                        <Link href='/sign-in'>
                            <Button className="w-full md:w-auto shadow-sm">Login</Button>
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    )
}

export default Navbar
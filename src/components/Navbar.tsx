'use client'
import React from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { Button } from './ui/button'
import { Loader2, LogOut, LayoutDashboard } from 'lucide-react' 
import { ModeToggle } from './mode-toggle' 
import Image from 'next/image';
import { Space_Grotesk } from 'next/font/google';
import { usePathname } from 'next/navigation';

const logoFont = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-space-grotesk",
});

const Navbar = () => {
    const { data: session, status } = useSession()
    const pathname = usePathname();

    const disableNavbarRoutes = ['/sign-in', '/sign-up', '/verify'];

    if (disableNavbarRoutes.includes(pathname) || pathname.startsWith('/verify')) {
        return null; 
    }
    
    return (
        <nav className="px-4 py-3 md:px-6 md:py-4 shadow-sm bg-white dark:bg-gray-950/50 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 transition-colors duration-300 sticky top-0 z-50">
            <div className="container mx-auto flex justify-between items-center relative z-50">
                
                {/* LOGO */}
                <Link href="/" prefetch={false} className="flex items-center gap-2 group cursor-pointer relative z-50">
                    <div className="relative w-8 h-8 md:w-10 md:h-10">
                        <Image 
                            src="/logo.png" 
                            alt="Whisper Box Logo"
                            fill
                            className="object-contain transition-transform group-hover:scale-110" 
                            priority
                            sizes="(max-width: 768px) 32px, 40px"
                        />
                    </div>
                    <span className={`text-lg md:text-2xl tracking-tight text-gray-900 dark:text-white transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400 ${logoFont.className} font-bold`}>
                        Whisper Box
                    </span>
                </Link>

                {/* ACTIONS */}
                <div className="flex items-center gap-2 md:gap-4 relative z-50"> 
                    
                    <ModeToggle /> 

                    {status === 'loading' ? (
                    <div className="hidden sm:flex items-center gap-2 text-muted-foreground text-sm">
                        <Loader2 className="w-4 h-4 animate-spin" />
                    </div>
                ) : session ? (
                    <>
                        {/* Show Dashboard button OR Username based on current page */}
                        {pathname.startsWith('/dashboard') ? (
                            <div className="flex items-center gap-2 px-2 md:px-3 py-1.5 md:py-2 rounded-md bg-gray-100 dark:bg-gray-800">
                                <span className="text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 truncate max-w-[80px] md:max-w-none">
                                    {session.user.username}
                                </span>
                            </div>
                        ) : (
                            <Link href="/dashboard" prefetch={false}>
                                <Button size="sm" variant="ghost" className="shadow-sm border border-transparent hover:border-gray-200 dark:hover:border-gray-700">
                                    <LayoutDashboard className="w-4 h-4 md:mr-2" />
                                    <span className="hidden md:inline">Dashboard</span>
                                </Button>
                            </Link>
                        )}
                                                
                        <Button 
                            size="sm" 
                            onClick={() => signOut()} 
                            variant="destructive"
                            className="shadow-sm"
                        >
                            <LogOut className="w-4 h-4 md:mr-2" />
                            <span className="hidden md:inline">Logout</span>
                        </Button>
                    </>
                    ) : (
                        <Link href='/sign-in' prefetch={false}>
                            <Button size="sm" className="shadow-sm">
                                Login
                            </Button>
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    )
}

export default Navbar
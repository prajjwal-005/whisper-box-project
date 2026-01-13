import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="w-full py-6 text-center text-sm bg-transparent border-t border-border text-muted-foreground">
      <div className="space-x-4 mb-2 font-medium">
        <Link 
          href="/safety" 
          className="hover:text-foreground transition-colors"
        >
          Safety Guidelines
        </Link>
        <span>|</span>
        <Link 
          href="/privacy" 
          className="hover:text-foreground transition-colors"
        >
          Privacy Policy
        </Link>
        <span>|</span>
        <Link href="/about"
         className="hover:text-foreground transition-colors">
          About & Support
        </Link>
      </div>
      <p className="text-xs opacity-80">
        © 2026 Whisper-Box . All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
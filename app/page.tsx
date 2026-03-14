'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronUp, Shield, AlertCircle } from 'lucide-react';

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import DashboardSection from "@/components/DashboardSection";
import Insights from "@/components/Insights";
import About from "@/components/About";
import Footer from "@/components/Footer";

// Session timeout in milliseconds (30 minutes)
const SESSION_TIMEOUT = 30 * 60 * 1000;

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Memoized auth check function
  const checkAuth = useCallback(() => {
    try {
      const isLoggedIn = localStorage.getItem('isLoggedIn');
      const loginTimestamp = localStorage.getItem('loginTimestamp');

      // Check if logged in and session hasn't expired
      if (isLoggedIn !== 'true') {
        setAuthError('Please log in to access this page');
        router.push('/login');
        return false;
      }

      // Check session timeout
      if (loginTimestamp) {
        const elapsed = Date.now() - parseInt(loginTimestamp);
        if (elapsed > SESSION_TIMEOUT) {
          // Session expired
          localStorage.removeItem('isLoggedIn');
          localStorage.removeItem('loginTimestamp');
          setAuthError('Session expired. Please log in again');
          router.push('/login');
          return false;
        }
      }

      return true;
    } catch (error) {
      console.error('Auth check error:', error);
      setAuthError('Authentication error');
      router.push('/login');
      return false;
    }
  }, [router]);

  // Handle authentication on mount
  useEffect(() => {
    const authorized = checkAuth();
    
    if (authorized) {
      setIsAuthorized(true);
      
      // Update login timestamp on each visit to extend session
      localStorage.setItem('loginTimestamp', Date.now().toString());
    }

    // Simulate minimum loading time for smooth transition
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [checkAuth]);

  // Handle scroll visibility for back to top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle visibility change (tab switch)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && isAuthorized) {
        // Revalidate session when tab becomes visible
        checkAuth();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isAuthorized, checkAuth]);

  // Handle before unload to clean up
  useEffect(() => {
    const handleBeforeUnload = () => {
      // Optional: clear sensitive data on page refresh
      // Don't clear if you want persistent login
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, []);

  const scrollToSection = useCallback((e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    const element = document.querySelector(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  // Memoize sections to prevent unnecessary re-renders
  const sections = useMemo(() => [
    { id: 'home', component: <Hero />, fullHeight: true },
    { id: 'stats', component: <Stats />, gradient: true },
    { id: 'dashboard', component: <DashboardSection />, scrollMargin: true },
    { id: 'insights', component: <Insights />, scrollMargin: true },
    { id: 'about', component: <About />, scrollMargin: true },
  ], []);

  // Show loading state
  if (!isAuthorized || isLoading) {
    return (
      // Updated: loading screen background
      <div className="min-h-screen bg-gradient-to-br from-background-dark via-background-mid to-background-dark flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          
          {/* Animated Logo */}
          <div className="relative w-28 h-28 mx-auto mb-8">
            {/* Updated: outer rings to primary/accent */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-full animate-ping opacity-20" />
            <div className="absolute inset-2 bg-gradient-to-r from-primary to-accent rounded-full animate-pulse" />
            
            {/* Inner circle with logo */}
            <div className="absolute inset-4 bg-background-dark rounded-full flex items-center justify-center shadow-2xl">
              {/* Updated: inner text gradient */}
              <span className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                TI
              </span>
            </div>
          </div>

          {/* Loading text with animation */}
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-2 text-slate-400">
              <span className="text-lg">Loading TravelScope Intelligence</span>
              <div className="flex gap-1">
                {/* Updated: bouncing dots */}
                <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
                <span className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce [animation-delay:-0.15s]" />
                <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" />
              </div>
            </div>

            {/* Updated: loading progress bar */}
            <div className="w-64 h-1 bg-slate-800 rounded-full mx-auto overflow-hidden">
              <div className="h-full bg-gradient-to-r from-primary to-accent rounded-full animate-loading" />
            </div>

            {/* Auth error message if any */}
            {authError && (
              <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 text-red-400 text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{authError}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    // Updated: main background
    <main className="min-h-screen bg-gradient-to-br from-background-dark via-background-mid to-background-dark text-white">
      
      {/* Navbar - Fixed at top */}
      <Navbar />

      {/* Main content with optimized rendering */}
      <div className="relative">
        {sections.map((section, index) => (
          <section
            key={section.id}
            id={section.id}
            className={`
              relative
              ${section.fullHeight ? 'min-h-screen' : ''}
              ${section.scrollMargin ? 'scroll-mt-20' : ''}
              animate-fadeIn
            `}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Updated: section transition gradient */}
            {section.gradient && (
              <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-background-dark to-transparent pointer-events-none" />
            )}
            
            {section.component}
          </section>
        ))}

        {/* Footer */}
        <Footer />
      </div>

      {/* Updated: back to top button */}
      <button
        onClick={scrollToTop}
        className={`
          fixed bottom-8 right-8 p-3 bg-gradient-to-r from-primary to-accent 
          text-white rounded-full shadow-lg hover:brightness-110
          transition-all duration-300 transform hover:scale-110 z-50 group
          ${showScrollTop ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'}
        `}
        aria-label="Back to top"
      >
        <ChevronUp className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
        
        {/* Tooltip */}
        <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-2 py-1 bg-background-mid text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-slate-700">
          Back to top
        </span>
      </button>

      {/* Session indicator - keep green for status */}
      <div className="fixed bottom-8 left-8 z-50">
        <div className="flex items-center gap-2 bg-slate-900/50 backdrop-blur-sm px-3 py-1.5 rounded-full border border-slate-700 text-xs text-slate-400">
          <Shield className="w-3 h-3 text-green-400" />
          <span>Session active</span>
        </div>
      </div>
    </main>
  );
}

// Add these animations to your global CSS
const styles = `
  @keyframes loading {
    0% { transform: translateX(-100%); }
    50% { transform: translateX(0); }
    100% { transform: translateX(100%); }
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .animate-loading {
    animation: loading 2s ease-in-out infinite;
  }

  .animate-fadeIn {
    animation: fadeIn 0.5s ease-out forwards;
  }
`;
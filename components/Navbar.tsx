'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Menu, 
  X, 
  LogOut, 
  LayoutDashboard,
  BarChart3,
  Info,
  Home,
  Lock
} from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loggedIn);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // 🔥 IMPROVED SCROLL SPY with better detection
  useEffect(() => {
    const handleScrollSpy = () => {
      const sections = ['home', 'dashboard', 'insights', 'about'];
      
      // Find the current section based on scroll position
      let currentSection = '';
      
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          const offset = 150; // Offset for navbar height
          
          // Check if section is in view
          if (rect.top <= offset && rect.bottom >= offset) {
            currentSection = section;
            break;
          }
        }
      }
      
      // If no section is found, check which section is closest to the top
      if (!currentSection) {
        let minDistance = Infinity;
        for (const section of sections) {
          const element = document.getElementById(section);
          if (element) {
            const rect = element.getBoundingClientRect();
            const distance = Math.abs(rect.top - 150);
            if (distance < minDistance) {
              minDistance = distance;
              currentSection = section;
            }
          }
        }
      }
      
      if (currentSection && currentSection !== activeSection) {
        setActiveSection(currentSection);
      }
    };
    
    // Run on mount and on scroll
    handleScrollSpy();
    window.addEventListener('scroll', handleScrollSpy);
    
    return () => {
      window.removeEventListener('scroll', handleScrollSpy);
    };
  }, [activeSection]);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('loginTimestamp');
    setIsLoggedIn(false);
    router.push('/login');
  };

  const scrollToSection = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId);
    
    if (element) {
      setActiveSection(sectionId);
      setIsOpen(false);
      
      const offset = 80; // Offset for navbar height
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  }, []);

  const navLinks = [
    { href: '/', label: 'Home', icon: Home, sectionId: 'home' },
    { href: '#dashboard', label: 'Dashboard', icon: LayoutDashboard, sectionId: 'dashboard' },
    { href: '#insights', label: 'Insights', icon: BarChart3, sectionId: 'insights' },
    { href: '#about', label: 'About', icon: Info, sectionId: 'about' },
  ];

  const isActive = (sectionId: string) => {
    return activeSection === sectionId;
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    scrollToSection(sectionId);
  };

  if (!isLoggedIn) {
    return (
      <nav className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-background-mid/95 backdrop-blur-md border-b border-slate-800 py-3' : 'bg-transparent py-5'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <Link href="/login" className="group flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">TS</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent hidden sm:block">
                TravelScope
              </span>
            </Link>

            <Link
              href="/login"
              className="px-5 py-2 bg-gradient-to-r from-primary to-accent text-white rounded-lg font-semibold hover:brightness-110 transition-all duration-200 flex items-center gap-2"
            >
              <Lock className="w-4 h-4" />
              Login
            </Link>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <>
      <nav
        className={`fixed w-full z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-background-mid/95 backdrop-blur-md border-b border-slate-800 py-3 shadow-lg'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">

            {/* Logo */}
            <Link href="/" className="group flex items-center space-x-2" onClick={() => scrollToSection('home')}>
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">TS</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent hidden sm:block">
                TravelScope
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-2">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => scrollToSection(link.sectionId)}
                  className={`px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                    isActive(link.sectionId)
                      ? 'text-primary bg-primary/10 border-b-2 border-primary'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <link.icon className="w-4 h-4" />
                  {link.label}
                </button>
              ))}
            </div>

            {/* Logout */}
            <div className="hidden md:flex">
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-all duration-200 flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/50"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`fixed inset-x-0 top-[73px] bg-background-mid/95 backdrop-blur-md border-b border-slate-800 md:hidden transition-all duration-300 transform ${
            isOpen 
              ? 'translate-y-0 opacity-100' 
              : '-translate-y-full opacity-0 pointer-events-none'
          }`}
        >
          <div className="px-4 py-6 space-y-4">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => {
                  scrollToSection(link.sectionId);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2 rounded-lg flex items-center gap-2 cursor-pointer ${
                  isActive(link.sectionId)
                    ? 'text-primary bg-primary/10 border-l-2 border-primary'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <link.icon className="w-4 h-4" />
                {link.label}
              </button>
            ))}

            <div className="pt-4 mt-4 border-t border-slate-800">
              <button
                onClick={handleLogout}
                className="w-full px-4 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}

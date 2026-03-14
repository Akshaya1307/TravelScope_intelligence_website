'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, LogIn, AlertCircle, CheckCircle, Lock, Mail } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Check if already logged in
  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn');
    if (loggedIn === 'true') {
      router.push('/');
    }
  }, [router]);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Client-side validation
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (password.length < 3) {
      setError('Password must be at least 3 characters');
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      if (email === 'admin@travelscope.com' && password === '1234') {
        setSuccess('Login successful! Redirecting...');
        
        // Store login state
        localStorage.setItem('isLoggedIn', 'true');
        if (rememberMe) {
          localStorage.setItem('rememberedEmail', email);
        } else {
          localStorage.removeItem('rememberedEmail');
        }
        
        // Redirect after short delay
        setTimeout(() => {
          router.push('/');
        }, 1000);
      } else {
        setError('Invalid email or password. Please try again.');
        setIsLoading(false);
      }
    }, 1500);
  };

  // Load remembered email
  useEffect(() => {
    const remembered = localStorage.getItem('rememberedEmail');
    if (remembered) {
      setEmail(remembered);
      setRememberMe(true);
    }
  }, []);

  return (
    // Updated: main background gradient
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background-dark via-background-mid to-background-dark relative overflow-hidden">
      
      {/* Animated background elements */}
      <div className="absolute inset-0 -z-10">
        {/* Updated: primary blob */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        {/* Keep purple for variety */}
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
        
        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgb(148 163 184 / 0.1) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md mx-4">
        <div className="relative group">
          {/* Updated: card glow effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-300" />
          
          <div className="relative bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 shadow-2xl">
            
            {/* Logo and Title */}
            <div className="text-center mb-8">
              {/* Updated: logo background */}
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-primary to-accent rounded-2xl mb-4 transform group-hover:rotate-6 transition-transform duration-300">
                <Lock className="w-8 h-8 text-white" />
              </div>
              
              <h2 className="text-3xl font-bold mb-2">
                {/* Updated: welcome text gradient */}
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Welcome Back
                </span>
              </h2>
              
              <p className="text-slate-400 text-sm">
                Sign in to access TravelScope Intelligence
              </p>
            </div>

            {/* Messages - keep red/green for status */}
            {error && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 text-red-400 text-sm animate-slideDown">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center gap-2 text-green-400 text-sm animate-slideDown">
                <CheckCircle className="w-4 h-4 flex-shrink-0" />
                <span>{success}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-5">
              
              {/* Email Field */}
              <div className="space-y-2">
                <label className="text-sm text-slate-400 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="admin@travelscope.com"
                    // Updated: focus border to primary
                    className="w-full p-3 pl-10 rounded-lg bg-slate-800/50 border border-slate-700 focus:border-primary outline-none transition-all duration-200 text-white placeholder-slate-500"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    required
                  />
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label className="text-sm text-slate-400 flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••"
                    // Updated: focus border to primary
                    className="w-full p-3 pl-10 pr-10 rounded-lg bg-slate-800/50 border border-slate-700 focus:border-primary outline-none transition-all duration-200 text-white placeholder-slate-500"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    required
                  />
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-slate-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    // Updated: checkbox to primary
                    className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-primary focus:ring-primary focus:ring-offset-0"
                  />
                  <span>Remember me</span>
                </label>
                
                {/* Updated: demo button to primary */}
                <button
                  type="button"
                  onClick={() => {
                    setEmail('admin@travelscope.com');
                    setPassword('1234');
                  }}
                  className="text-primary hover:text-primary-light transition-colors"
                >
                  Use demo credentials
                </button>
              </div>

              {/* Updated: submit button gradient */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-gradient-to-r from-primary to-accent rounded-lg font-semibold hover:brightness-110 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2 group"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Logging in...</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    <span>Sign In</span>
                  </>
                )}
              </button>
            </form>

            {/* Demo Credentials Card */}
            <div className="mt-6 p-4 bg-slate-800/30 rounded-lg border border-slate-800">
              <p className="text-xs text-slate-500 text-center mb-2">
                Demo Credentials
              </p>
              <div className="flex flex-col items-center text-sm text-slate-400">
                <div className="flex items-center gap-2">
                  <Mail className="w-3 h-3" />
                  <span>admin@travelscope.com</span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <Lock className="w-3 h-3" />
                  <span>1234</span>
                </div>
              </div>
            </div>

            {/* Footer Note */}
            <p className="text-xs text-slate-600 text-center mt-6">
              © 2024 TravelScope Intelligence. All rights reserved.
            </p>

          </div>
        </div>
      </div>

      {/* Add required animations */}
      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
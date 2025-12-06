'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { TrendingUp, ArrowRight, Sparkles } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        router.push('/dashboard');
      }
    };
    checkAuth();
  }, [router]);

  return (
    <div className="min-h-[screen] bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/4 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 -right-1/4 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute -bottom-1/4 left-1/3 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 container mx-auto px-6 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-8 w-8 text-blue-600" />
          <span className="text-2xl font-bold text-slate-900">StockBroker</span>
        </div>
        <div className="flex gap-4">
          <Button
            variant="ghost"
            onClick={() => router.push('/login')}
            className="text-slate-700 hover:text-blue-600 hover:bg-blue-100"
          >
            Login
          </Button>
          <Button
            onClick={() => router.push('/register')}
            className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
          >
            Get Started
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 container mx-auto px-6 pt-20 pb-32">
        <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 border border-blue-200 rounded-full text-blue-700 text-sm font-medium shadow-sm">
            <Sparkles className="h-4 w-4" />
            <span>Real-time Stock Market Dashboard</span>
          </div>

          <h1 className="text-6xl md:text-7xl font-bold text-slate-900 leading-tight">
            <span className="block bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-transparent bg-clip-text">
              Stock Broker
            </span>
            Client Web Dashboard.
          </h1>

          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Subscribe to your favorite stocks and get instant price updates. <br />
            Make informed decisions with live market data at your fingertips.
          </p>

          <div className="flex gap-4 justify-center pt-4">
            <Button
              size="lg"
              onClick={() => router.push('/register')}
              className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-6 group shadow-xl hover:shadow-2xl transition-all"
            >
              Start Trading Free
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => router.push('/login')}
              className="border-2 border-slate-300 text-slate-700 hover:bg-slate-100 hover:border-slate-400 text-lg px-8 py-6 shadow-lg"
            >
              Sign In
            </Button>
          </div>

          {/* Stats */}

        </div>
      </div>


      {/* Footer */}


      <style jsx global>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
        
        .delay-1000 {
          animation-delay: 1s;
        }
        
        .delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
}

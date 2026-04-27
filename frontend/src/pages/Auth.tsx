import React, { useState } from 'react';
import { Lock, Mail, ArrowRight, UserPlus, LogIn } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { apiFetch } from '../utils/api';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        await apiFetch('/api/auth/login', {
          method: 'POST',
          body: JSON.stringify({ email, password }),
        });
        alert('Login Successful!');
      } else {
        await apiFetch('/api/auth/register', {
          method: 'POST',
          body: JSON.stringify({ email, password }),
        });
        alert('Registration Successful! You can view this user in the Admin Dashboard.');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to reach server';
      alert(`Auth failed: ${message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 glass-panel p-10 relative overflow-hidden">
        {/* Decorative background glow */}
        <div className={`absolute -top-32 -right-32 w-64 h-64 rounded-full blur-3xl opacity-20 ${isLogin ? 'bg-indigo-500' : 'bg-emerald-500'}`}></div>

        <div>
           <motion.div 
             key={isLogin ? 'login' : 'register'}
             initial={{ scale: 0.5, opacity: 0 }} 
             animate={{ scale: 1, opacity: 1 }} 
             className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center shadow-lg ${isLogin ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'}`}
           >
             {isLogin ? <LogIn className="w-8 h-8" /> : <UserPlus className="w-8 h-8" />}
           </motion.div>
           <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
             {isLogin ? 'Sign in to AlgoVerse' : 'Create an Account'}
           </h2>
           <p className="mt-2 text-center text-sm text-slate-400">
             {isLogin ? "Or " : "Already have an account? "}
             <button onClick={() => setIsLogin(!isLogin)} className={`font-medium ${isLogin ? 'text-indigo-400 hover:text-indigo-300' : 'text-emerald-400 hover:text-emerald-300'} transition-colors`}>
               {isLogin ? 'register a new account' : 'sign in instead'}
             </button>
           </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <label className="sr-only">Email address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                   <Mail className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  type="email" required
                  value={email} onChange={e => setEmail(e.target.value)}
                  className="appearance-none rounded-xl relative block w-full px-3 py-4 pl-10 border border-slate-700 bg-slate-900/50 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm transition-all"
                  placeholder="Email address"
                />
              </div>
            </div>
            <div>
              <label className="sr-only">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                   <Lock className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  type="password" required
                  value={password} onChange={e => setPassword(e.target.value)}
                  className="appearance-none rounded-xl relative block w-full px-3 py-4 pl-10 border border-slate-700 bg-slate-900/50 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm transition-all"
                  placeholder="Password"
                />
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit" disabled={loading}
              className={`group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-bold rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all ${
                 loading ? 'opacity-70 cursor-not-allowed bg-slate-800' : 
                 isLogin ? 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-500/25 shadow-lg' : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/25 shadow-lg'
              }`}
            >
              {loading ? (
                <span className="flex items-center gap-2">Authenticating...</span>
              ) : (
                <span className="flex items-center gap-2">
                   {isLogin ? 'Sign In' : 'Create Account'}
                   <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

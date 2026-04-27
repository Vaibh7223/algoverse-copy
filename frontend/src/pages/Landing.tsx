import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code2, ArrowRight, Zap, Trophy, BookOpen, Star, Mail, User, Sparkles } from 'lucide-react';

interface LandingProps {
  onEnter: (name: string, email: string) => void;
}

const FEATURES = [
  { icon: <BookOpen className="w-5 h-5" />, color: 'from-indigo-500 to-blue-600', title: '12+ Courses', desc: 'Structured learning from Beginner to Expert' },
  { icon: <Zap className="w-5 h-5" />, color: 'from-emerald-500 to-teal-600', title: 'XP & Badges', desc: 'Earn Bronze → Platinum badges as you progress' },
  { icon: <Trophy className="w-5 h-5" />, color: 'from-amber-500 to-orange-600', title: 'Assessments', desc: 'Download PDF reports to study offline' },
  { icon: <Star className="w-5 h-5" />, color: 'from-rose-500 to-pink-600', title: 'Algorithm Battle', desc: 'Compare 20+ algorithms head-to-head' },
];

const FLOATING_WORDS = ['O(log n)', 'BFS', 'DP', 'O(n²)', 'DFS', 'Heap', 'NP', 'MST', 'KMP', 'AVL'];

export default function Landing({ onEnter }: LandingProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'welcome' | 'returning'>('welcome');
  const [returning, setReturning] = useState<{ name: string; email: string } | null>(null);
  const [nameSuggestions, setNameSuggestions] = useState<{ name: string; email: string }[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { setError('Please enter your name.'); return; }
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) { setError('Please enter a valid email address.'); return; }
    setError('');
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      onEnter(name.trim(), email.trim().toLowerCase());
    }, 900);
  };

  // Search saved users by name as user types
  const handleNameChange = (val: string) => {
    setName(val);
    setError('');
    if (val.trim().length >= 2) {
      const users: { name: string; email: string }[] = JSON.parse(localStorage.getItem('algoverse_users') || '[]');
      const matches = users.filter(u =>
        u.name.toLowerCase().startsWith(val.trim().toLowerCase())
      );
      setNameSuggestions(matches);
      setShowSuggestions(matches.length > 0);
    } else {
      setNameSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // Apply a suggested user — auto-fills both name & email and marks as returning
  const applySuggestion = (user: { name: string; email: string }) => {
    setName(user.name);
    setEmail(user.email);
    setReturning(user);
    setStep('returning');
    setShowSuggestions(false);
    setError('');
  };

  // Check returning user on email blur
  const handleEmailBlur = () => {
    if (!email.trim()) return;
    const users: { name: string; email: string }[] = JSON.parse(localStorage.getItem('algoverse_users') || '[]');
    const found = users.find(u => u.email === email.trim().toLowerCase());
    if (found) {
      setReturning(found);
      setName(found.name);
      setStep('returning');
    } else {
      setReturning(null);
      if (step === 'returning') setStep('welcome');
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#030305] text-slate-50 overflow-hidden relative flex flex-col">
      {/* Animated background blobs */}
      <div className="absolute top-[-15%] left-[-10%] w-[55%] h-[55%] rounded-full bg-indigo-600/10 blur-[160px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[45%] h-[45%] rounded-full bg-rose-600/10 blur-[130px] pointer-events-none animate-pulse" style={{ animationDelay: '1.5s' }} />
      <div className="absolute top-[40%] right-[20%] w-[30%] h-[30%] rounded-full bg-cyan-600/5 blur-[100px] pointer-events-none" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.12] pointer-events-none mix-blend-overlay" />

      {/* Floating algorithm words */}
      {FLOATING_WORDS.map((word, i) => (
        <motion.div
          key={word}
          className="absolute text-slate-700 font-black text-sm select-none pointer-events-none"
          style={{
            left: `${8 + (i * 9.2) % 86}%`,
            top: `${10 + (i * 17.3) % 75}%`,
          }}
          animate={{ y: [0, -18, 0], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 4 + i * 0.7, repeat: Infinity, delay: i * 0.4 }}
        >
          {word}
        </motion.div>
      ))}

      {/* Top bar */}
      <header className="flex items-center justify-between px-8 py-5 relative z-10">
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
            className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30"
          >
            <Code2 className="w-5 h-5 text-white" />
          </motion.div>
          <span className="text-xl font-black animate-text-shine">AlgoVerse</span>
        </div>
        <span className="text-xs text-slate-500 font-semibold tracking-widest uppercase">AI Algorithm Platform</span>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-16 px-8 py-12 relative z-10 max-w-6xl mx-auto w-full">

        {/* Left: Hero text */}
        <div className="flex-1 max-w-xl text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-bold mb-6 tracking-widest uppercase">
              <Sparkles className="w-3.5 h-3.5" /> Learn · Visualize · Master
            </div>
            <h1 className="text-5xl lg:text-6xl font-black leading-tight mb-5">
              Master{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
                Algorithms
              </span>
              <br />like a Pro
            </h1>
            <p className="text-slate-400 text-lg mb-10 leading-relaxed">
              Visualize, battle, and learn data structures &amp; algorithms with AI-powered tools, gamified courses, and instant PDF assessments.
            </p>
          </motion.div>

          {/* Feature grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="grid grid-cols-2 gap-3"
          >
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.08 }}
                className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/40 border border-white/5 hover:border-white/10 transition-colors"
              >
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${f.color} flex items-center justify-center text-white flex-shrink-0 shadow-md`}>
                  {f.icon}
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{f.title}</p>
                  <p className="text-[11px] text-slate-500">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Right: Sign-in card */}
        <motion.div
          initial={{ opacity: 0, x: 40, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="w-full max-w-md"
        >
          <div className="glass-panel p-8 border border-white/10 relative overflow-hidden">
            {/* Glow */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

            <AnimatePresence mode="wait">
              {step === 'returning' && returning ? (
                <motion.div
                  key="returning"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center mb-6"
                >
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-2xl font-black text-white mx-auto mb-3 shadow-lg shadow-indigo-500/30">
                    {returning.name.charAt(0).toUpperCase()}
                  </div>
                  <p className="text-emerald-400 text-sm font-bold mb-0.5">Welcome back! 👋</p>
                  <h2 className="text-2xl font-black text-white">{returning.name}</h2>
                  <p className="text-slate-400 text-xs mt-1">Your achievements are safe and ready</p>
                </motion.div>
              ) : (
                <motion.div key="welcome" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mb-6">
                  <div className="flex justify-center mb-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-xl shadow-indigo-500/30">
                      <Code2 className="w-7 h-7 text-white" />
                    </div>
                  </div>
                  <h2 className="text-2xl font-black text-white text-center mb-1">Join AlgoVerse</h2>
                  <p className="text-slate-400 text-sm text-center">Enter your details to start your journey</p>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
              {/* Name field */}
              <div className="relative">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Your Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    value={name}
                    onChange={e => handleNameChange(e.target.value)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                    onFocus={() => nameSuggestions.length > 0 && setShowSuggestions(true)}
                    placeholder="e.g. Rahul Sharma"
                    autoComplete="off"
                    className="w-full pl-10 pr-4 py-3.5 bg-slate-900/60 border border-slate-700/80 rounded-xl text-white text-sm font-medium placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                  />
                </div>

                {/* Name-based suggestions dropdown */}
                <AnimatePresence>
                  {showSuggestions && (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.18 }}
                      className="absolute z-50 top-full mt-1.5 w-full bg-slate-900 border border-indigo-500/30 rounded-xl shadow-2xl shadow-indigo-500/10 overflow-hidden"
                    >
                      <div className="px-3 py-2 border-b border-slate-800 flex items-center gap-1.5">
                        <Sparkles className="w-3 h-3 text-indigo-400" />
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Last logged in as</span>
                      </div>
                      {nameSuggestions.map((u, i) => (
                        <button
                          key={i}
                          type="button"
                          onMouseDown={() => applySuggestion(u)}
                          className="w-full text-left px-4 py-3 hover:bg-indigo-500/15 transition-colors flex items-center gap-3 group"
                        >
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-black text-white text-xs flex-shrink-0 shadow-md">
                            {u.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-white truncate">{u.name}</p>
                            <p className="text-[11px] text-indigo-300 truncate flex items-center gap-1">
                              <Mail className="w-3 h-3 inline flex-shrink-0" /> {u.email}
                            </p>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-indigo-400 transition-colors flex-shrink-0" />
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Email field */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => { setEmail(e.target.value); setError(''); setStep('welcome'); setReturning(null); }}
                    onBlur={handleEmailBlur}
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-3.5 bg-slate-900/60 border border-slate-700/80 rounded-xl text-white text-sm font-medium placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                  />
                </div>
              </div>

              {/* Error */}
              <AnimatePresence>
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-rose-400 text-xs font-semibold"
                  >
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="w-full py-4 mt-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 text-white font-black rounded-xl shadow-xl shadow-indigo-500/30 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
              >
                {loading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                  />
                ) : (
                  <>
                    {step === 'returning' ? 'Continue My Journey' : 'Begin My Journey'}
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </motion.button>

              <p className="text-center text-[11px] text-slate-500 mt-3">
                No password needed · Your progress is saved locally · Returning users keep all achievements
              </p>
            </form>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

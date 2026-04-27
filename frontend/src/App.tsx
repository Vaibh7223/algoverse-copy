import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import {
  Activity, Brain, Code2, LayoutDashboard, Video, BookOpen,
  Swords, Target, Database, Layers, ShieldAlert, Cpu,
  UserCircle, ClipboardList, Lightbulb
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';
import VisualizerPage from './pages/Visualizer';
import Courses from './pages/Courses';
import CoursePlayer from './pages/CoursePlayer';
import AIChatbot from './components/AIChatbot';
import AlgorithmDetail from './pages/AlgorithmDetail';
import Battle from './pages/Battle';
import Interview from './pages/Interview';
import Landing from './pages/Landing';
import Profile from './pages/Profile';
import Assessment from './pages/Assessment';
import Assignment from './pages/Assignment';
import { ALGO_DATABASE } from './utils/algoData';
import { MOCK_COURSES } from './pages/Courses';
import AlgoPreviewVisualizer from './components/AlgoPreviewVisualizer';
import { useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────
interface AlgoUser { name: string; email: string; joinedAt: string; }

// ─── Syllabus Data ────────────────────────────────────────────────────────────
const SYLLABUS = [
  { unit: 'UNIT I',  title: 'Divide & Conquer',    algoCount: 4, icon: <Layers className="w-6 h-6" />,     color: 'from-blue-500 to-indigo-600',   algos: ['Merge Sort', 'Quick Sort', 'Binary Search', 'Heap Sort'] },
  { unit: 'UNIT II', title: 'Greedy Algorithms',   algoCount: 4, icon: <Cpu className="w-6 h-6" />,        color: 'from-emerald-500 to-teal-600',  algos: ['Fractional Knapsack', 'Huffman Coding', 'Kruskal / Prim', 'Dijkstra'] },
  { unit: 'UNIT III',title: 'Dynamic Programming', algoCount: 4, icon: <Database className="w-6 h-6" />,   color: 'from-pink-500 to-rose-600',     algos: ['Matrix Chain Multiplication', '0/1 Knapsack', 'Floyd Warshall', 'Multistage Graph'] },
  { unit: 'UNIT IV', title: 'Backtracking',        algoCount: 4, icon: <Brain className="w-6 h-6" />,      color: 'from-amber-500 to-orange-600',  algos: ['N-Queens', 'Graph Coloring', 'Hamiltonian Cycle', 'Branch & Bound'] },
  { unit: 'UNIT V',  title: 'Advanced & NP',       algoCount: 4, icon: <ShieldAlert className="w-6 h-6" />,color: 'from-purple-500 to-fuchsia-600',algos: ['Fibonacci Heap', 'Max Flow', 'Approximation', 'NP-Complete'] },
];

// ─── Nav Items ────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { to: '/',           label: 'Dashboard',       icon: <LayoutDashboard className="w-5 h-5" />, color: 'text-indigo-400' },
  { to: '/courses',    label: 'Offline Courses', icon: <Video className="w-5 h-5" />,           color: 'text-amber-400'  },
  { to: '/assessment', label: 'Assessments',     icon: <ClipboardList className="w-5 h-5" />,   color: 'text-emerald-400'},
  { to: '/assignment', label: 'Assignments',     icon: <BookOpen className="w-5 h-5" />,        color: 'text-purple-400' },
];

const BONUS_ITEMS = [
  { to: '/battle',    label: 'Algorithm Battle', icon: <Swords className="w-5 h-5" />,  hoverColor: 'hover:text-rose-400',   iconHover: 'group-hover:text-rose-400'  },
  { to: '/interview', label: 'Interview Mode',   icon: <Target className="w-5 h-5" />,  hoverColor: 'hover:text-emerald-400',iconHover: 'group-hover:text-emerald-400'},
];

// ─── Sidebar ──────────────────────────────────────────────────────────────────
function Sidebar({ user }: { user: AlgoUser }) {
  const location = useLocation();

  return (
    <aside className="w-72 h-full glass-panel border-l-0 border-t-0 border-b-0 rounded-none flex-col pt-6 flex hidden md:flex flex-shrink-0 z-20">
      {/* Logo */}
      <div className="px-6 mb-8 flex items-center gap-3">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
          className="bg-gradient-to-br from-indigo-500 to-purple-600 w-10 h-10 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30"
        >
          <Code2 className="w-6 h-6 text-white" />
        </motion.div>
        <div>
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-3xl font-black animate-text-shine tracking-tight drop-shadow-[0_0_10px_rgba(129,140,248,0.3)]"
          >
            AlgoVerse
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-[10px] text-slate-400 uppercase tracking-widest font-bold"
          >
            AI Visualizer Platform
          </motion.p>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto pb-6 custom-scrollbar">
        {/* Main menu */}
        <div className="text-xs font-bold text-slate-500 mb-3 px-4 uppercase tracking-wider">Main Menu</div>
        {NAV_ITEMS.map(item => {
          const active = location.pathname === item.to || (item.to !== '/' && location.pathname.startsWith(item.to));
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${
                active
                  ? 'bg-indigo-500/15 text-white border border-indigo-500/20 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <span className={active ? item.color : 'text-slate-500'}>{item.icon}</span>
              {item.label}
              {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-400" />}
            </Link>
          );
        })}

        {/* Bonus Features */}
        <div className="text-xs font-bold text-slate-500 mt-6 mb-3 px-4 uppercase tracking-wider">Bonus Features</div>
        {BONUS_ITEMS.map(item => {
          const active = location.pathname.startsWith(item.to);
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm group ${
                active
                  ? 'bg-slate-800/80 text-white border border-slate-700/50'
                  : `text-slate-300 hover:text-white hover:bg-slate-800/50 ${item.hoverColor}`
              }`}
            >
              <span className={`${active ? 'text-slate-300' : `text-slate-500 ${item.iconHover} transition-colors`}`}>
                {item.icon}
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User profile area at bottom */}
      <div className="p-4 mt-auto border-t border-slate-800/50">
        <Link
          to="/profile"
          className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-slate-800/50 transition-all group"
        >
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-black text-white text-sm shadow-md flex-shrink-0">
            {user.name.charAt(0).toUpperCase()}{user.name.split(' ')[1]?.charAt(0).toUpperCase() ?? ''}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-white truncate">{user.name}</p>
            <p className="text-[10px] text-slate-500 truncate">{user.email}</p>
          </div>
          <UserCircle className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 transition-colors flex-shrink-0" />
        </Link>
      </div>
    </aside>
  );
}

// ─── Header ───────────────────────────────────────────────────────────────────
function Header({ user }: { user: AlgoUser }) {
  const [query, setQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();

  const filteredAlgos = query.length > 1 ? SYLLABUS.flatMap(u => u.algos).filter(a => 
    a.toLowerCase().includes(query.toLowerCase())
  ) : [];

  const filteredCourses = query.length > 1 ? MOCK_COURSES.filter(c => 
    c.title.toLowerCase().includes(query.toLowerCase()) || 
    c.topics.some(t => t.toLowerCase().includes(query.toLowerCase()))
  ) : [];

  const hasResults = filteredAlgos.length > 0 || filteredCourses.length > 0;

  return (
    <header className="h-16 flex items-center justify-between px-8 border-b border-slate-800/50 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
      <div className="flex items-center gap-4 flex-1 max-w-xl relative">
        <div className="w-full h-10 px-4 bg-slate-900 border border-slate-800 rounded-xl flex items-center shadow-inner group focus-within:border-indigo-500/50 transition-all">
          <Search className="w-4 h-4 text-slate-500 group-focus-within:text-indigo-400" />
          <input 
            type="text" 
            placeholder="Search algorithms, courses, topics..." 
            className="flex-1 bg-transparent border-none focus:ring-0 text-sm text-slate-200 ml-3 placeholder:text-slate-600"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowResults(true);
            }}
            onFocus={() => setShowResults(true)}
          />
          {query && (
            <button onClick={() => setQuery('')} className="p-1 hover:bg-slate-800 rounded-md transition-colors">
              <X className="w-3 h-3 text-slate-500" />
            </button>
          )}
        </div>

        {/* Search Results Dropdown */}
        <AnimatePresence>
          {showResults && query.length > 1 && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowResults(false)} />
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-50 max-h-[400px] overflow-y-auto custom-scrollbar"
              >
                {!hasResults ? (
                  <div className="p-8 text-center text-slate-500 text-sm italic">
                    No results found for "{query}"
                  </div>
                ) : (
                  <div className="p-2 space-y-4">
                    {filteredAlgos.length > 0 && (
                      <div>
                        <div className="px-3 py-2 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-800 mb-1 flex items-center gap-2">
                          <Activity className="w-3 h-3" /> Algorithms
                        </div>
                        {filteredAlgos.map(algo => (
                          <button
                            key={algo}
                            onClick={() => {
                              navigate(`/algo/${encodeURIComponent(algo)}`);
                              setShowResults(false);
                              setQuery('');
                            }}
                            className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-indigo-500/10 text-sm text-slate-300 hover:text-white transition-colors text-left"
                          >
                            {algo}
                            <div className="text-[10px] bg-indigo-500/20 text-indigo-400 px-1.5 py-0.5 rounded border border-indigo-500/20 font-bold">Visualizer</div>
                          </button>
                        ))}
                      </div>
                    )}

                    {filteredCourses.length > 0 && (
                      <div>
                        <div className="px-3 py-2 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-800 mb-1 flex items-center gap-2">
                          <Video className="w-3 h-3" /> Courses
                        </div>
                        {filteredCourses.map(course => (
                          <button
                            key={course.id}
                            onClick={() => {
                              navigate(`/courses/${course.id}`);
                              setShowResults(false);
                              setQuery('');
                            }}
                            className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-emerald-500/10 text-sm text-slate-300 hover:text-white transition-colors text-left"
                          >
                            <div className="truncate pr-4">
                              <div className="font-bold">{course.title}</div>
                              <div className="text-[10px] text-slate-500 truncate">{course.topics.join(', ')}</div>
                            </div>
                            <div className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/20 font-bold shrink-0">Video</div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
      <div className="flex items-center gap-3">
        <Link to="/profile">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black text-sm hover:shadow-lg hover:shadow-indigo-500/30 cursor-pointer transition-shadow"
          >
            {user.name.charAt(0).toUpperCase()}{user.name.split(' ')[1]?.charAt(0).toUpperCase() ?? ''}
          </motion.div>
        </Link>
      </div>
    </header>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
const Dashboard = () => {
  const [selectedUnit, setSelectedUnit] = useState<number | null>(null);
  const [previewAlgo, setPreviewAlgo] = useState<string | null>(null);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out h-full overflow-y-auto pb-20 custom-scrollbar">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <h2 className="text-5xl font-black tracking-tight mb-2">Algorithm <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Syllabus</span></h2>
        <p className="text-slate-400 max-w-2xl text-lg">Select an algorithm to launch the visualizer, view time complexity, or generate AI videos.</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="mb-10 glass-panel p-8 flex justify-between items-center bg-gradient-to-r from-indigo-900/20 to-transparent">
        <div>
          <h3 className="text-2xl font-bold text-white mb-2">Welcome to AlgoVerse Pro</h3>
          <p className="text-slate-400">Select any algorithm below to interact with its AI explainer and graphic engine.</p>
        </div>
        <Activity className="w-16 h-16 text-indigo-500/20" />
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {SYLLABUS.map((unit, idx) => (
          <motion.div
            key={unit.unit}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`glass-panel p-6 border border-slate-700/50 hover:border-slate-500/50 transition-colors cursor-pointer relative overflow-hidden group ${selectedUnit === idx ? 'ring-2 ring-indigo-500 shadow-[0_0_30px_rgba(99,102,241,0.15)]' : ''}`}
            onClick={() => setSelectedUnit(selectedUnit === idx ? null : idx)}
          >
            <div className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl ${unit.color} opacity-10 rounded-full blur-3xl -mr-20 -mt-20 group-hover:opacity-30 group-hover:scale-150 transition-all duration-700 ease-in-out`} />
            <div className={`absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr ${unit.color} opacity-5 rounded-full blur-2xl -ml-16 -mb-16 group-hover:opacity-20 transition-all duration-500`} />

            <motion.div
              whileHover={{ rotate: [0, -10, 10, -5, 5, 0], scale: 1.1 }}
              transition={{ duration: 0.5 }}
              className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${unit.color} flex items-center justify-center text-white mb-6 shadow-[0_0_20px_rgba(0,0,0,0.3)] ring-1 ring-white/20 z-10 relative`}
            >
              {unit.icon}
            </motion.div>

            <div className="flex justify-between items-end mb-2">
              <h3 className="text-2xl font-bold text-white group-hover:text-indigo-300 transition-colors">{unit.unit}</h3>
              <span className="text-xs font-bold text-slate-500 bg-slate-800 px-2 py-1 rounded-md">{unit.algoCount} Algos</span>
            </div>
            <p className="text-slate-400 font-medium text-sm mb-4">{unit.title}</p>

            <AnimatePresence>
              {selectedUnit === idx && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="space-y-2 mt-4 pt-4 border-t border-slate-800"
                >
                  {unit.algos.map((algo, i) => (
                    <button
                      key={i}
                      onClick={(e) => {
                        e.stopPropagation();
                        setPreviewAlgo(previewAlgo === algo ? null : algo);
                      }}
                      className={`w-full flex items-center justify-between p-3 rounded-xl transition-all text-sm font-semibold border ${
                        previewAlgo === algo 
                        ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/50 shadow-lg' 
                        : 'bg-slate-900/50 hover:bg-slate-800 text-slate-300 border-transparent hover:border-slate-700'
                      }`}
                    >
                      {algo}
                      <Activity className={`w-4 h-4 transition-transform duration-300 ${previewAlgo === algo ? 'rotate-90 text-indigo-400' : 'opacity-50'}`} />
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* Algorithm Preview Modal/Drawer Overlay */}
      <AnimatePresence>
        {previewAlgo && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setPreviewAlgo(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-slate-950 border-l border-slate-800 z-[70] shadow-2xl flex flex-col p-8 overflow-y-auto custom-scrollbar"
            >
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-black text-white">{previewAlgo}</h3>
                <button 
                  onClick={() => setPreviewAlgo(null)}
                  className="p-2 hover:bg-slate-900 rounded-xl transition-colors text-slate-500 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Animated Mini Visualizer */}
              <div className="mb-8">
                <div className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <Activity className="w-3 h-3" /> Animated Working
                </div>
                <AlgoPreviewVisualizer algoName={previewAlgo} />
              </div>

              {/* Description Card */}
              <div className="space-y-6">
                <div className="glass-panel p-6 border border-indigo-500/10">
                  <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Brain className="w-4 h-4 text-indigo-400" /> Description
                  </h4>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {ALGO_DATABASE[previewAlgo]?.explanation || "Selecting this algorithm provides a deep dive into its computational logic and structural complexity."}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="glass-panel p-4 border border-rose-500/10 text-center">
                    <p className="text-[10px] font-black text-slate-500 uppercase mb-1">Time</p>
                    <p className="text-sm font-black text-rose-400">{ALGO_DATABASE[previewAlgo]?.complexity?.time || "O(N log N)"}</p>
                  </div>
                  <div className="glass-panel p-4 border border-emerald-500/10 text-center">
                    <p className="text-[10px] font-black text-slate-500 uppercase mb-1">Space</p>
                    <p className="text-sm font-black text-emerald-400">{ALGO_DATABASE[previewAlgo]?.complexity?.space || "O(1)"}</p>
                  </div>
                </div>

                <div className="glass-panel p-6 border border-amber-500/10">
                  <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-amber-400" /> Analogy
                  </h4>
                  <p className="text-sm text-slate-300 italic">
                    "{ALGO_DATABASE[previewAlgo]?.analogy || "Think of it as a master key that unlocks complex data patterns systematically."}"
                  </p>
                </div>

                <Link 
                  to={`/algo/${encodeURIComponent(previewAlgo)}`}
                  className="w-full flex items-center justify-center gap-3 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-black rounded-2xl shadow-xl shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  <Activity className="w-5 h-5" /> Launch Full Visualizer
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─── Main App Shell ────────────────────────────────────────────────────────────
function AppShell({ user, onLogout }: { user: AlgoUser; onLogout: () => void }) {
  return (
    <div className="flex w-full h-full min-h-screen bg-[#030305] text-slate-50 overflow-hidden font-sans selection:bg-indigo-500/30 relative">
      {/* Background FX */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.15] pointer-events-none z-50 mix-blend-overlay" />
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-600/10 blur-[150px] pointer-events-none animate-pulse duration-[3000ms]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-rose-600/10 blur-[120px] pointer-events-none animate-pulse duration-[4000ms]" />
      <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] rounded-full bg-cyan-600/5 blur-[100px] pointer-events-none" />

      <Sidebar user={user} />

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-0 h-full">
        <Header user={user} />
        <div className="flex-1 p-6 lg:p-10 overflow-hidden">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/"            element={<Dashboard />} />
              <Route path="/algo/:id"    element={<AlgorithmDetail />} />
              <Route path="/courses"     element={<Courses />} />
              <Route path="/courses/:id" element={<CoursePlayer />} />
              <Route path="/battle"      element={<Battle />} />
              <Route path="/interview"   element={<Interview />} />
              <Route path="/assessment"  element={<Assessment user={user} />} />
              <Route path="/assignment"  element={<Assignment />} />
              <Route path="/profile"     element={<Profile user={user} onLogout={onLogout} />} />
            </Routes>
          </AnimatePresence>
        </div>
        <AIChatbot />
      </main>
    </div>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState<AlgoUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('algoverse_current_user');
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch {
        localStorage.removeItem('algoverse_current_user');
      }
    }
    setLoading(false);
  }, []);

  const handleEnter = (name: string, email: string) => {
    // Check existing users list, register if new
    const users: AlgoUser[] = JSON.parse(localStorage.getItem('algoverse_users') || '[]');
    let found = users.find(u => u.email === email);
    if (!found) {
      found = { name, email, joinedAt: new Date().toISOString() };
      users.push(found);
      localStorage.setItem('algoverse_users', JSON.stringify(users));
    }
    localStorage.setItem('algoverse_current_user', JSON.stringify(found));
    setUser(found);
  };

  const handleLogout = () => {
    localStorage.removeItem('algoverse_current_user');
    setUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030305] flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-10 h-10 border-2 border-slate-700 border-t-indigo-500 rounded-full"
        />
      </div>
    );
  }

  if (!user) {
    return <Landing onEnter={handleEnter} />;
  }

  return (
    <Router>
      <AppShell user={user} onLogout={handleLogout} />
    </Router>
  );
}

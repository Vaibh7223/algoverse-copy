

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { PlayCircle, Download, Star, Trophy, Zap, Lock, CheckCircle, Filter, Award, Flame } from 'lucide-react';

export type CourseDifficulty = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';

export interface Course {
  id: string;
  title: string;
  thumbnail: string;
  ytId: string;
  description: string;
  difficulty: CourseDifficulty;
  xp: number;
  duration: string;
  topics: string[];
  badge: 'bronze' | 'silver' | 'gold' | 'platinum';
  locked?: boolean;
}

const COURSE_TEMPLATES: Array<Omit<Course, 'id'>> = [
  { title: 'Data Structures Crash Course', thumbnail: 'https://img.youtube.com/vi/RBSGKlAvoiM/mqdefault.jpg', ytId: 'RBSGKlAvoiM', description: 'A rapid overview of arrays, linked lists, trees, and graphs for beginners.', difficulty: 'Beginner', xp: 100, duration: '3h 20m', topics: ['Arrays', 'Linked Lists', 'Trees', 'Graphs'], badge: 'bronze' },
  { title: 'Big-O Notation Explained', thumbnail: 'https://img.youtube.com/vi/V6mKVRU1evU/mqdefault.jpg', ytId: 'V6mKVRU1evU', description: 'Understand time and space complexity with visual examples and real code.', difficulty: 'Beginner', xp: 90, duration: '1h 45m', topics: ['Big-O', 'Big-Theta', 'Space Complexity', 'Trade-offs'], badge: 'bronze' },
  { title: 'Recursion Masterclass', thumbnail: 'https://img.youtube.com/vi/IJDJ0kBx2LM/mqdefault.jpg', ytId: 'IJDJ0kBx2LM', description: 'Master recursion patterns from base cases to tree recursion.', difficulty: 'Beginner', xp: 120, duration: '2h 10m', topics: ['Base Cases', 'Call Stack', 'Backtracking', 'Memoization'], badge: 'bronze' },
  { title: 'Pointers and Sliding Window', thumbnail: 'https://img.youtube.com/vi/wiGpQwVHdE0/mqdefault.jpg', ytId: 'wiGpQwVHdE0', description: 'Learn two pointers and sliding window to solve array and string questions fast.', difficulty: 'Beginner', xp: 130, duration: '2h 20m', topics: ['Two Pointers', 'Windows', 'Strings', 'Arrays'], badge: 'bronze' },
  { title: 'Binary Search Patterns', thumbnail: 'https://img.youtube.com/vi/2wV-5m4i4kY/mqdefault.jpg', ytId: '2wV-5m4i4kY', description: 'Use binary search on answers, ranges, and rotated arrays.', difficulty: 'Beginner', xp: 140, duration: '2h 05m', topics: ['Binary Search', 'Lower Bound', 'Upper Bound', 'Monotonicity'], badge: 'bronze' },
  { title: 'Algorithms Full Course', thumbnail: 'https://img.youtube.com/vi/0IAPZzGSbME/mqdefault.jpg', ytId: '0IAPZzGSbME', description: 'Deep dive into algorithmic complexity, sorting, and dynamic programming.', difficulty: 'Intermediate', xp: 250, duration: '5h 00m', topics: ['Sorting', 'Searching', 'Divide & Conquer', 'DP'], badge: 'silver' },
  { title: 'Sorting Algorithms Visualized', thumbnail: 'https://img.youtube.com/vi/g-PGLbMth_g/mqdefault.jpg', ytId: 'g-PGLbMth_g', description: 'Merge Sort, Quick Sort, Heap Sort visualized and compared side by side.', difficulty: 'Intermediate', xp: 210, duration: '2h 30m', topics: ['Merge Sort', 'Quick Sort', 'Heap Sort', 'Radix Sort'], badge: 'silver' },
  { title: 'Graph Algorithms Bootcamp', thumbnail: 'https://img.youtube.com/vi/tWVWeAqZ0WU/mqdefault.jpg', ytId: 'tWVWeAqZ0WU', description: 'BFS, DFS, shortest paths, and minimum spanning trees.', difficulty: 'Intermediate', xp: 300, duration: '4h 15m', topics: ['BFS', 'DFS', 'Dijkstra', 'MST'], badge: 'silver' },
  { title: 'Heap and Priority Queue Toolkit', thumbnail: 'https://img.youtube.com/vi/HqPJF2L5h9U/mqdefault.jpg', ytId: 'HqPJF2L5h9U', description: 'Build top-k and scheduling solutions using heaps and priority queues.', difficulty: 'Intermediate', xp: 260, duration: '3h 10m', topics: ['Min Heap', 'Max Heap', 'Top K', 'Scheduling'], badge: 'silver' },
  { title: 'Hashing and Maps in Practice', thumbnail: 'https://img.youtube.com/vi/shs0KM3wKv8/mqdefault.jpg', ytId: 'shs0KM3wKv8', description: 'Solve lookup-heavy problems with hash maps and set patterns.', difficulty: 'Intermediate', xp: 230, duration: '2h 45m', topics: ['Hash Maps', 'Frequency Count', 'Sets', 'Collisions'], badge: 'silver' },
  { title: 'Dynamic Programming Zero to Hero', thumbnail: 'https://img.youtube.com/vi/oBt53YbR9Kk/mqdefault.jpg', ytId: 'oBt53YbR9Kk', description: 'Cover DP archetypes including knapsack, LCS, and state transitions.', difficulty: 'Advanced', xp: 500, duration: '5h 45m', topics: ['Knapsack', 'LCS', 'Grid DP', 'State DP'], badge: 'gold' },
  { title: 'Backtracking and Branch-Bound', thumbnail: 'https://img.youtube.com/vi/A80YzvNwqXA/mqdefault.jpg', ytId: 'A80YzvNwqXA', description: 'Use decision trees and pruning to solve hard combinatorial problems.', difficulty: 'Advanced', xp: 420, duration: '4h 30m', topics: ['N-Queens', 'Sudoku', 'Graph Coloring', 'TSP'], badge: 'gold' },
  { title: 'Trie and String Algorithms', thumbnail: 'https://img.youtube.com/vi/zIjfhVPRZCg/mqdefault.jpg', ytId: 'zIjfhVPRZCg', description: 'Build fast prefix search and string matching engines.', difficulty: 'Advanced', xp: 460, duration: '3h 55m', topics: ['Trie', 'KMP', 'Z Algorithm', 'Rabin-Karp'], badge: 'gold' },
  { title: 'Segment Tree and Fenwick Tree', thumbnail: 'https://img.youtube.com/vi/ZBHKZF5w4YU/mqdefault.jpg', ytId: 'ZBHKZF5w4YU', description: 'Master range queries and updates for competitive coding and interviews.', difficulty: 'Advanced', xp: 520, duration: '4h 40m', topics: ['Segment Tree', 'Lazy Propagation', 'BIT', 'Range Query'], badge: 'gold' },
  { title: 'Greedy Algorithms Mastery', thumbnail: 'https://img.youtube.com/vi/ARvQcqJ_-NY/mqdefault.jpg', ytId: 'ARvQcqJ_-NY', description: 'Identify exchange arguments and design optimal greedy solutions.', difficulty: 'Advanced', xp: 410, duration: '3h 35m', topics: ['Intervals', 'Scheduling', 'Proofs', 'Optimization'], badge: 'gold' },
  { title: 'NP-Completeness and Approximation', thumbnail: 'https://img.youtube.com/vi/YX40hbAHx3s/mqdefault.jpg', ytId: 'YX40hbAHx3s', description: 'Explore reductions, hardness, and approximation guarantees.', difficulty: 'Expert', xp: 800, duration: '7h 20m', topics: ['P vs NP', 'Reductions', 'Approximation', 'Randomization'], badge: 'platinum', locked: true },
  { title: 'Competitive Programming Masterclass', thumbnail: 'https://img.youtube.com/vi/GjpufJoemgs/mqdefault.jpg', ytId: 'GjpufJoemgs', description: 'Advanced techniques including flows, FFT, and contest strategy.', difficulty: 'Expert', xp: 1000, duration: '8h 00m', topics: ['Segment Trees', 'FFT', 'Max Flow', 'String Matching'], badge: 'platinum', locked: true },
  { title: 'Advanced Graph Theory for Coding', thumbnail: 'https://img.youtube.com/vi/09_LlHjoEiY/mqdefault.jpg', ytId: '09_LlHjoEiY', description: 'Master SCC, articulation points, bridges, and Euler/Hamilton ideas.', difficulty: 'Expert', xp: 920, duration: '6h 30m', topics: ['SCC', 'Bridges', 'Euler Path', 'Topological Sort'], badge: 'platinum', locked: true },
  { title: 'Math for Algorithms', thumbnail: 'https://img.youtube.com/vi/4u2H0M4C2fM/mqdefault.jpg', ytId: '4u2H0M4C2fM', description: 'Number theory, combinatorics, and modular arithmetic for hard problems.', difficulty: 'Expert', xp: 870, duration: '6h 10m', topics: ['GCD', 'Primes', 'Combinatorics', 'Mod Arithmetic'], badge: 'platinum', locked: true },
  { title: 'System Design for Problem Solvers', thumbnail: 'https://img.youtube.com/vi/F2FmTdLtb_4/mqdefault.jpg', ytId: 'F2FmTdLtb_4', description: 'Translate algorithmic thinking into large-scale system design.', difficulty: 'Expert', xp: 950, duration: '6h 55m', topics: ['Scalability', 'Caching', 'Queues', 'Trade-offs'], badge: 'platinum', locked: true },
];

const TOTAL_OFFLINE_COURSES = 60;

export const MOCK_COURSES: Course[] = Array.from({ length: TOTAL_OFFLINE_COURSES }, (_, index) => {
  const template = COURSE_TEMPLATES[index % COURSE_TEMPLATES.length];
  const level = Math.floor(index / COURSE_TEMPLATES.length) + 1;
  const isBeyondStarterSet = index >= COURSE_TEMPLATES.length;

  return {
    ...template,
    id: `${index + 1}`,
    title: isBeyondStarterSet ? `${template.title} • Batch ${level}` : template.title,
    xp: template.xp + (level - 1) * 15,
    duration: template.duration,
    locked: template.locked ?? false,
  };
});

export const DIFFICULTY_META: Record<CourseDifficulty, { color: string; bg: string; glow: string; order: number }> = {
  Beginner: { color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20', glow: 'shadow-emerald-500/20', order: 0 },
  Intermediate: { color: 'text-sky-400', bg: 'bg-sky-500/10 border-sky-500/20', glow: 'shadow-sky-500/20', order: 1 },
  Advanced: { color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20', glow: 'shadow-amber-500/20', order: 2 },
  Expert: { color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/20', glow: 'shadow-rose-500/20', order: 3 },
};

export const BADGE_META = {
  bronze: { label: 'Bronze', icon: '🥉', gradient: 'from-amber-700 to-yellow-600', glow: 'shadow-amber-600/40', ring: 'ring-amber-600/40' },
  silver: { label: 'Silver', icon: '🥈', gradient: 'from-slate-400 to-slate-300', glow: 'shadow-slate-400/40', ring: 'ring-slate-400/40' },
  gold: { label: 'Gold', icon: '🥇', gradient: 'from-yellow-500 to-amber-400', glow: 'shadow-yellow-500/40', ring: 'ring-yellow-500/40' },
  platinum: { label: 'Platinum', icon: '💎', gradient: 'from-cyan-400 to-indigo-400', glow: 'shadow-cyan-400/40', ring: 'ring-cyan-400/40' },
};

type FilterType = 'All' | CourseDifficulty;

function XPBar({ earned, total }: { earned: number; total: number }) {
  const pct = Math.min(100, Math.round((earned / total) * 100));
  return (
    <div className="w-full">
      <div className="flex justify-between text-xs mb-1">
        <span className="text-indigo-300 font-bold">{earned} XP earned</span>
        <span className="text-slate-500">{total} XP total</span>
      </div>
      <div className="h-3 rounded-full bg-slate-800 overflow-hidden border border-slate-700/50">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 relative"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        >
          <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse" />
        </motion.div>
      </div>
      <div className="text-right text-xs text-slate-500 mt-1">{pct}% of total XP</div>
    </div>
  );
}

function BadgeIcon({ badge, size = 'md' }: { badge: Course['badge']; size?: 'sm' | 'md' | 'lg' }) {
  const m = BADGE_META[badge];
  const sz = size === 'sm' ? 'w-7 h-7 text-sm' : size === 'lg' ? 'w-14 h-14 text-3xl' : 'w-10 h-10 text-xl';
  return (
    <div
      className={`${sz} rounded-full bg-gradient-to-br ${m.gradient} flex items-center justify-center shadow-lg ${m.glow} ring-1 ${m.ring}`}
      title={`${m.label} Badge`}
    >
      <span>{m.icon}</span>
    </div>
  );
}

function AchievementToast({ course, onClose }: { course: Course; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 4500);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 100, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.9 }}
      className="fixed bottom-8 right-8 z-[100] max-w-sm w-full"
    >
      <div className="glass-panel p-5 border border-yellow-500/30 shadow-[0_0_40px_rgba(234,179,8,0.2)] bg-slate-900/90">
        <div className="flex items-start gap-4">
          <BadgeIcon badge={course.badge} size="lg" />
          <div className="flex-1">
            <p className="text-xs font-bold text-yellow-400 uppercase tracking-widest mb-1 flex items-center gap-1">
              <Trophy className="w-3 h-3" /> Achievement Unlocked!
            </p>
            <p className="text-white font-bold text-sm mb-0.5">{course.title}</p>
            <p className="text-slate-400 text-xs mb-2">Completed — earned {course.xp} XP</p>
            <div className="flex items-center gap-2">
              <BadgeIcon badge={course.badge} size="sm" />
              <span className={`text-xs font-bold bg-gradient-to-r ${BADGE_META[course.badge].gradient} bg-clip-text text-transparent`}>
                {BADGE_META[course.badge].label} Badge Earned!
              </span>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white text-lg leading-none mt-0.5">×</button>
        </div>
        {/* animated progress shimmer */}
        <motion.div
          className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-b-2xl"
          initial={{ width: '100%' }}
          animate={{ width: '0%' }}
          transition={{ duration: 4.5, ease: 'linear' }}
        />
      </div>
    </motion.div>
  );
}

function StatsBar({ completedCourses, totalXP, earnedXP, streak }: { completedCourses: number; totalXP: number; earnedXP: number; streak: number }) {
  const stats = [
    { icon: <Trophy className="w-5 h-5 text-yellow-400" />, label: 'Completed', value: completedCourses, suffix: `/ ${MOCK_COURSES.length}` },
    { icon: <Zap className="w-5 h-5 text-indigo-400" />, label: 'Total XP', value: earnedXP, suffix: '' },
    { icon: <Flame className="w-5 h-5 text-orange-400" />, label: 'Day Streak', value: streak, suffix: '🔥' },
    {
      icon: <Award className="w-5 h-5 text-cyan-400" />, label: 'Badges', value: ['bronze', 'silver', 'gold', 'platinum'].filter(b =>
        MOCK_COURSES.some(c => c.badge === b && JSON.parse(localStorage.getItem('completed_courses') || '[]').includes(c.id))
      ).length, suffix: '/ 4'
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {stats.map((s, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08 }}
          className="glass-panel p-4 text-center border border-white/5 hover:border-indigo-500/20 transition-colors"
        >
          <div className="flex justify-center mb-2">{s.icon}</div>
          <div className="text-2xl font-black text-white">{s.value}<span className="text-sm text-slate-500 font-normal ml-1">{s.suffix}</span></div>
          <div className="text-xs text-slate-400 mt-0.5">{s.label}</div>
        </motion.div>
      ))}
    </div>
  );
}

export default function Courses() {
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [downloadedIds, setDownloadedIds] = useState<string[]>([]);
  const [filter, setFilter] = useState<FilterType>('All');
  const [achievement, setAchievement] = useState<Course | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('downloaded_courses');
    if (saved) setDownloadedIds(JSON.parse(saved));
    const comp = localStorage.getItem('completed_courses');
    if (comp) setCompletedIds(JSON.parse(comp));
  }, []);

  const totalXP = MOCK_COURSES.reduce((s, c) => s + c.xp, 0);
  const earnedXP = MOCK_COURSES.filter(c => completedIds.includes(c.id)).reduce((s, c) => s + c.xp, 0);
  const streak = 3; // mock streak

  const filters: FilterType[] = ['All', 'Beginner', 'Intermediate', 'Advanced', 'Expert'];

  const displayed = filter === 'All'
    ? MOCK_COURSES
    : MOCK_COURSES.filter(c => c.difficulty === filter);

  const grouped = (['Beginner', 'Intermediate', 'Advanced', 'Expert'] as CourseDifficulty[]).map(d => ({
    difficulty: d,
    courses: displayed.filter(c => c.difficulty === d),
  })).filter(g => g.courses.length > 0);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out h-full overflow-y-auto pb-24 custom-scrollbar">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-4xl font-black mb-2">Offline <span className="text-gradient">Courses</span></h2>
        <p className="text-slate-400 text-lg max-w-2xl">
          Level up your algorithm skills. Earn XP, unlock badges, and track your coding journey.
        </p>
      </div>

      {/* Stats Bar */}
      <StatsBar
        completedCourses={completedIds.length}
        totalXP={totalXP}
        earnedXP={earnedXP}
        streak={streak}
      />

      {/* Global XP Progress */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="glass-panel p-6 mb-8 border border-indigo-500/10 bg-gradient-to-r from-indigo-900/10 to-purple-900/5"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <Star className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-bold text-white">Overall Progress</p>
              <p className="text-xs text-slate-400">{completedIds.length} of {MOCK_COURSES.length} courses completed</p>
            </div>
          </div>
          <div className="flex gap-2">
            {(['bronze', 'silver', 'gold', 'platinum'] as const).map(b => {
              const unlocked = MOCK_COURSES.some(c => c.badge === b && completedIds.includes(c.id));
              return (
                <div key={b} className={`transition-all duration-300 ${unlocked ? 'opacity-100 scale-100' : 'opacity-20 grayscale scale-90'}`}>
                  <BadgeIcon badge={b} size="sm" />
                </div>
              );
            })}
          </div>
        </div>
        <XPBar earned={earnedXP} total={totalXP} />
      </motion.div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        <div className="flex items-center gap-1 text-slate-500 mr-2">
          <Filter className="w-4 h-4" />
          <span className="text-sm font-semibold">Filter:</span>
        </div>
        {filters.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-bold border transition-all duration-200 ${filter === f
              ? 'bg-indigo-500 text-white border-indigo-500 shadow-lg shadow-indigo-500/30'
              : 'bg-slate-900/50 text-slate-400 border-slate-700/50 hover:border-slate-500'
              }`}
          >
            {f}
            {f !== 'All' && (
              <span className="ml-1.5 opacity-60 text-xs">
                ({MOCK_COURSES.filter(c => c.difficulty === f).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Course Groups */}
      <div className="space-y-12">
        {grouped.map(({ difficulty, courses }) => {
          const meta = DIFFICULTY_META[difficulty];
          return (
            <div key={difficulty}>
              <div className={`flex items-center gap-3 mb-5 px-4 py-2 rounded-xl border ${meta.bg} w-fit`}>
                <span className={`text-lg font-black ${meta.color}`}>{difficulty}</span>
                <span className="text-slate-500 text-sm">· {courses.length} courses</span>
                <BadgeIcon badge={courses[0].badge} size="sm" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {courses.map((course, idx) => {
                  const isCompleted = completedIds.includes(course.id);
                  const isDownloaded = downloadedIds.includes(course.id);
                  const bm = BADGE_META[course.badge];
                  const dm = DIFFICULTY_META[course.difficulty];
                  return (
                    <motion.div
                      key={course.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.07 }}
                      whileHover={course.locked ? {} : { y: -4, scale: 1.01 }}
                      className={`glass-panel group overflow-hidden flex flex-col relative ${isCompleted
                        ? `border border-yellow-500/30 shadow-lg ${bm.glow}`
                        : course.locked
                          ? 'border border-slate-700/30 opacity-60'
                          : 'border border-white/5 hover:border-indigo-500/30'
                        } transition-all duration-300`}
                    >
                      {/* Locked overlay */}
                      {(() => {
                        const idxInDifficulty = courses.findIndex(c => c.id === course.id);
                        const isUnlocked = idxInDifficulty === 0 || completedIds.includes(courses[idxInDifficulty - 1].id);
                        
                        if (!isUnlocked && !isCompleted) {
                          return (
                            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-950/70 backdrop-blur-sm rounded-2xl">
                              <Lock className="w-10 h-10 text-slate-400 mb-2" />
                              <p className="text-slate-300 font-bold text-sm">Course Locked</p>
                              <p className="text-slate-500 text-xs">Finish "{courses[idxInDifficulty - 1].title}" to unlock</p>
                            </div>
                          );
                        }
                        return null;
                      })()}

                      {/* Completed ribbon */}
                      {isCompleted && (
                        <div className={`absolute top-3 right-3 z-20 flex items-center gap-1 px-2 py-1 rounded-full bg-gradient-to-r ${bm.gradient} shadow-lg ${bm.glow}`}>
                          <CheckCircle className="w-3 h-3 text-white" />
                          <span className="text-white text-[10px] font-black">DONE</span>
                        </div>
                      )}

                      {/* Thumbnail */}
                      <div className="relative aspect-video overflow-hidden">
                        <img
                          src={course.thumbnail}
                          alt={course.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                        {/* Play overlay */}
                        {!course.locked && (
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <Link to={`/courses/${course.id}`}>
                              <motion.div
                                whileHover={{ scale: 1.15 }}
                                whileTap={{ scale: 0.95 }}
                                className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center shadow-2xl"
                              >
                                <PlayCircle className="w-10 h-10 text-white" />
                              </motion.div>
                            </Link>
                          </div>
                        )}

                        {/* Duration chip */}
                        <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-slate-950/80 rounded-md text-xs text-slate-300 font-medium backdrop-blur-sm border border-white/5">
                          ⏱ {course.duration}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-5 flex-1 flex flex-col">
                        {/* Difficulty + Badge */}
                        <div className="flex items-center justify-between mb-3">
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${dm.bg} ${dm.color}`}>
                            {course.difficulty}
                          </span>
                          <div className="flex items-center gap-1.5">
                            <BadgeIcon badge={course.badge} size="sm" />
                            <span className={`text-xs font-bold bg-gradient-to-r ${bm.gradient} bg-clip-text text-transparent`}>
                              {bm.label}
                            </span>
                          </div>
                        </div>

                        <h3 className="text-base font-bold text-white mb-1.5 group-hover:text-indigo-300 transition-colors leading-snug">
                          {course.title}
                        </h3>
                        <p className="text-slate-400 text-xs mb-3 line-clamp-2 flex-1">{course.description}</p>

                        {/* Topics */}
                        <div className="flex flex-wrap gap-1 mb-4">
                          {course.topics.map(t => (
                            <span key={t} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700/50">
                              {t}
                            </span>
                          ))}
                        </div>

                        {/* XP bar mini */}
                        <div className="mb-4">
                          <div className="flex justify-between text-[10px] text-slate-500 mb-1">
                            <span>Course XP</span>
                            <span className="text-indigo-400 font-bold">+{course.xp} XP</span>
                          </div>
                          <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
                            <motion.div
                              className={`h-full rounded-full bg-gradient-to-r ${bm.gradient}`}
                              initial={{ width: 0 }}
                              animate={{ width: isCompleted ? '100%' : '0%' }}
                              transition={{ duration: 0.8, delay: idx * 0.07 + 0.3 }}
                            />
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 mt-auto">
                          {(() => {
                            const idxInDifficulty = courses.findIndex(c => c.id === course.id);
                            const isUnlocked = idxInDifficulty === 0 || completedIds.includes(courses[idxInDifficulty - 1].id);
                            
                            return (
                              <Link
                                to={!isUnlocked ? '#' : `/courses/${course.id}`}
                                className={`flex-1 py-2 rounded-xl text-sm font-bold text-center transition-all duration-200 ${!isUnlocked
                                  ? 'bg-slate-800 text-slate-600 cursor-not-allowed'
                                  : isCompleted
                                    ? `bg-gradient-to-r ${bm.gradient} text-white shadow-lg ${bm.glow}`
                                    : 'bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 border border-indigo-500/20 hover:border-indigo-500/40'
                                  }`}
                                onClick={e => !isUnlocked && e.preventDefault()}
                              >
                                {isCompleted ? '▶ Review' : 'Start Course'}
                              </Link>
                            );
                          })()}
                          {isDownloaded ? (
                            <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                              <Download className="w-4 h-4" />
                            </span>
                          ) : (
                            <span className="p-2 rounded-xl bg-slate-800 text-slate-500 border border-slate-700/50">
                              <Download className="w-4 h-4" />
                            </span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Achievement Toast */}
      <AnimatePresence>
        {achievement && (
          <AchievementToast course={achievement} onClose={() => setAchievement(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}

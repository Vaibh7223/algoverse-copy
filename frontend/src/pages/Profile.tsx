import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Zap, BookOpen, Star, LogOut, Clock, Award, Edit3, Check, X } from 'lucide-react';
import { MOCK_COURSES } from './Courses';

interface AlgoUser { name: string; email: string; joinedAt: string; }

const BADGE_META = {
  bronze:   { label: 'Bronze',   icon: '🥉', gradient: 'from-amber-700 to-yellow-600',  glow: 'shadow-amber-600/30'  },
  silver:   { label: 'Silver',   icon: '🥈', gradient: 'from-slate-400 to-slate-300',    glow: 'shadow-slate-300/30'  },
  gold:     { label: 'Gold',     icon: '🥇', gradient: 'from-yellow-500 to-amber-400',  glow: 'shadow-yellow-500/30' },
  platinum: { label: 'Platinum', icon: '💎', gradient: 'from-cyan-400 to-indigo-400',   glow: 'shadow-cyan-400/30'  },
};

function getLevel(xp: number) {
  const level = Math.floor(xp / 500) + 1;
  const progress = xp % 500;
  const needed = 500;
  return { level, progress, needed };
}

function Avatar({ name, size = 'md' }: { name: string; size?: 'sm' | 'md' | 'lg' | 'xl' }) {
  const sz = { sm: 'w-10 h-10 text-base', md: 'w-16 h-16 text-2xl', lg: 'w-20 h-20 text-3xl', xl: 'w-28 h-28 text-4xl' }[size];
  const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  return (
    <div className={`${sz} rounded-full bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 flex items-center justify-center font-black text-white shadow-xl shadow-indigo-500/30 ring-4 ring-indigo-500/20`}>
      {initials}
    </div>
  );
}

interface ProfileProps { user: AlgoUser; onLogout: () => void; }

export default function Profile({ user, onLogout }: ProfileProps) {
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [editName, setEditName] = useState(user.name);
  const [assessmentScores, setAssessmentScores] = useState<Record<string, number>>({});

  useEffect(() => {
    const comp = localStorage.getItem(`completed_courses_${user.email}`);
    if (comp) setCompletedIds(JSON.parse(comp));

    // Also check old key for migration
    const oldComp = localStorage.getItem('completed_courses');
    if (oldComp && !comp) {
      const ids = JSON.parse(oldComp);
      setCompletedIds(ids);
      localStorage.setItem(`completed_courses_${user.email}`, JSON.stringify(ids));
    }

    // Load assessment scores
    const scores: Record<string, number> = {};
    MOCK_COURSES.forEach(c => {
      const s = localStorage.getItem(`assessment_score_${user.email}_${c.id}`);
      if (s) scores[c.id] = parseInt(s);
    });
    setAssessmentScores(scores);
  }, [user.email]);

  const completedCourses = MOCK_COURSES.filter(c => completedIds.includes(c.id));
  const totalXP = completedCourses.reduce((s, c) => s + c.xp, 0);
  const { level, progress, needed } = getLevel(totalXP);

  const unlockedBadges = (Object.keys(BADGE_META) as (keyof typeof BADGE_META)[])
    .filter(b => completedCourses.some(c => c.badge === b));

  const handleSaveName = () => {
    if (!editName.trim()) return;
    // Update in users list
    const users: AlgoUser[] = JSON.parse(localStorage.getItem('algoverse_users') || '[]');
    const idx = users.findIndex(u => u.email === user.email);
    if (idx !== -1) {
      users[idx].name = editName.trim();
      localStorage.setItem('algoverse_users', JSON.stringify(users));
      localStorage.setItem('algoverse_current_user', JSON.stringify({ ...user, name: editName.trim() }));
    }
    setEditMode(false);
    window.location.reload();
  };

  const daysSinceJoin = Math.floor((Date.now() - new Date(user.joinedAt).getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="h-full overflow-y-auto custom-scrollbar pb-24 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Profile Header Card */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-8 mb-8 border border-white/10 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-72 h-72 bg-indigo-600/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-600/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 relative z-10">
          <Avatar name={user.name} size="xl" />

          <div className="flex-1">
            {editMode ? (
              <div className="flex items-center gap-2 mb-2">
                <input
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  className="text-3xl font-black bg-transparent border-b-2 border-indigo-500 text-white outline-none w-64"
                  autoFocus
                />
                <button onClick={handleSaveName} className="text-emerald-400 hover:text-emerald-300"><Check className="w-5 h-5" /></button>
                <button onClick={() => setEditMode(false)} className="text-slate-500 hover:text-white"><X className="w-5 h-5" /></button>
              </div>
            ) : (
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-3xl font-black text-white">{user.name}</h2>
                <button onClick={() => setEditMode(true)} className="text-slate-500 hover:text-indigo-400 transition-colors">
                  <Edit3 className="w-4 h-4" />
                </button>
              </div>
            )}
            <p className="text-slate-400 text-sm mb-3">{user.email}</p>

            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/20 text-indigo-300 text-xs font-bold">
                Level {level} Coder
              </span>
              <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-400 text-xs font-semibold flex items-center gap-1">
                <Clock className="w-3 h-3" /> Joined {daysSinceJoin === 0 ? 'today' : `${daysSinceJoin}d ago`}
              </span>
              <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-bold">
                ⚡ {totalXP} XP Total
              </span>
            </div>

            {/* Level XP bar */}
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-slate-400 font-semibold">Level {level} → {level + 1}</span>
                <span className="text-indigo-400 font-bold">{progress} / {needed} XP</span>
              </div>
              <div className="h-3 rounded-full bg-slate-800 overflow-hidden border border-slate-700/50">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 relative"
                  initial={{ width: 0 }}
                  animate={{ width: `${(progress / needed) * 100}%` }}
                  transition={{ duration: 1.2, ease: 'easeOut' }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse rounded-full" />
                </motion.div>
              </div>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 border border-slate-700/50 hover:border-rose-500/20 transition-all text-sm font-semibold"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </motion.div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Courses Done', value: completedCourses.length, suffix: `/ ${MOCK_COURSES.length}`, icon: <BookOpen className="w-5 h-5 text-indigo-400" />, color: 'border-indigo-500/20' },
          { label: 'Total XP', value: totalXP, suffix: 'XP', icon: <Zap className="w-5 h-5 text-amber-400" />, color: 'border-amber-500/20' },
          { label: 'Badges Earned', value: unlockedBadges.length, suffix: '/ 4', icon: <Trophy className="w-5 h-5 text-yellow-400" />, color: 'border-yellow-500/20' },
          { label: 'Assessments', value: Object.keys(assessmentScores).length, suffix: 'taken', icon: <Star className="w-5 h-5 text-emerald-400" />, color: 'border-emerald-500/20' },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className={`glass-panel p-5 text-center border ${s.color}`}
          >
            <div className="flex justify-center mb-2">{s.icon}</div>
            <div className="text-2xl font-black text-white">{s.value} <span className="text-sm text-slate-500 font-normal">{s.suffix}</span></div>
            <div className="text-xs text-slate-400 mt-0.5">{s.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Badge Collection */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-panel p-6 border border-white/5"
        >
          <h3 className="text-lg font-black text-white mb-5 flex items-center gap-2">
            <Award className="w-5 h-5 text-yellow-400" /> Badge Collection
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {(Object.entries(BADGE_META) as [keyof typeof BADGE_META, typeof BADGE_META[keyof typeof BADGE_META]][]).map(([badge, meta]) => {
              const earned = unlockedBadges.includes(badge);
              const earnedCourse = completedCourses.find(c => c.badge === badge);
              return (
                <div
                  key={badge}
                  className={`p-4 rounded-2xl border transition-all duration-300 ${
                    earned
                      ? `bg-gradient-to-br ${meta.gradient} bg-opacity-5 border-white/10 shadow-lg ${meta.glow}`
                      : 'bg-slate-900/30 border-slate-800/50 opacity-40 grayscale'
                  }`}
                >
                  <div className="text-3xl mb-2">{meta.icon}</div>
                  <p className={`font-black text-sm ${earned ? 'text-white' : 'text-slate-500'}`}>{meta.label}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    {earned ? `Earned · ${earnedCourse?.title}` : 'Not yet unlocked'}
                  </p>
                  {earned && (
                    <div className="mt-2">
                      <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-0.5">
                        <Check className="w-3 h-3" /> Unlocked
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Completed Courses Timeline */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.35 }}
          className="glass-panel p-6 border border-white/5"
        >
          <h3 className="text-lg font-black text-white mb-5 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-400" /> Completed Courses
          </h3>
          {completedCourses.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-5xl mb-3">📚</div>
              <p className="text-slate-400 font-semibold">No courses completed yet</p>
              <p className="text-slate-500 text-sm mt-1">Head to Courses to start learning!</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-80 overflow-y-auto custom-scrollbar pr-1">
              {completedCourses.map((course, i) => {
                const bm = BADGE_META[course.badge];
                return (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + i * 0.05 }}
                    className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/50 border border-slate-800/50 hover:border-slate-700/50 transition-colors"
                  >
                    <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${bm.gradient} flex items-center justify-center text-lg flex-shrink-0 shadow-md`}>
                      {bm.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-white truncate">{course.title}</p>
                      <p className="text-[10px] text-slate-500">{course.difficulty} · +{course.xp} XP</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <span className={`text-[10px] font-bold bg-gradient-to-r ${bm.gradient} bg-clip-text text-transparent`}>
                        {bm.label}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>

      {/* Assessment Scores */}
      {Object.keys(assessmentScores).length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-panel p-6 border border-white/5 mt-8"
        >
          <h3 className="text-lg font-black text-white mb-5 flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-400" /> Assessment Scores
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Object.entries(assessmentScores).map(([courseId, score]) => {
              const course = MOCK_COURSES.find(c => c.id === courseId);
              if (!course) return null;
              const pct = score;
              const grade = pct >= 80 ? { label: 'Excellent', color: 'text-emerald-400' } : pct >= 60 ? { label: 'Good', color: 'text-amber-400' } : { label: 'Needs Work', color: 'text-rose-400' };
              return (
                <div key={courseId} className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/50">
                  <p className="text-xs font-bold text-slate-300 truncate mb-2">{course.title}</p>
                  <div className="flex items-end justify-between">
                    <span className="text-2xl font-black text-white">{pct}%</span>
                    <span className={`text-xs font-bold ${grade.color}`}>{grade.label}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-slate-800 mt-2 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8 }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
}

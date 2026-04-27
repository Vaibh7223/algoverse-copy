import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Download, CheckCircle, ArrowLeft, Camera, Trophy, Star, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MOCK_COURSES } from './Courses';
import Quiz from '../components/Quiz';
import {
  getCompletedCourses, addCompletedCourse,
  getDownloadedCourses, addDownloadedCourse,
  getCourseStep, setCourseStep,
} from '../utils/userStorage';

const BADGE_META = {
  bronze:   { label: 'Bronze',   icon: '🥉', gradient: 'from-amber-700 to-yellow-600',  glow: 'shadow-amber-600/40',  ring: 'ring-amber-600/40',  xpColor: 'text-amber-400' },
  silver:   { label: 'Silver',   icon: '🥈', gradient: 'from-slate-400 to-slate-300',    glow: 'shadow-slate-400/40',  ring: 'ring-slate-400/40',  xpColor: 'text-slate-300' },
  gold:     { label: 'Gold',     icon: '🥇', gradient: 'from-yellow-500 to-amber-400',  glow: 'shadow-yellow-500/40', ring: 'ring-yellow-500/40', xpColor: 'text-yellow-400' },
  platinum: { label: 'Platinum', icon: '💎', gradient: 'from-cyan-400 to-indigo-400',   glow: 'shadow-cyan-400/40',   ring: 'ring-cyan-400/40',   xpColor: 'text-cyan-400'  },
};

function Particle({ x, y, color }: { x: number; y: number; color: string }) {
  return (
    <motion.div
      className={`absolute w-2 h-2 rounded-full ${color}`}
      style={{ left: x, top: y }}
      initial={{ scale: 0, opacity: 1 }}
      animate={{
        scale: [0, 1.5, 0],
        opacity: [1, 1, 0],
        x: (Math.random() - 0.5) * 200,
        y: (Math.random() - 0.5) * 200,
      }}
      transition={{ duration: 1.2, ease: 'easeOut' }}
    />
  );
}

function AchievementModal({ course, onClose }: { course: (typeof MOCK_COURSES)[0]; onClose: () => void }) {
  const bm = BADGE_META[course.badge];
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 400,
    y: Math.random() * 300,
    color: ['bg-yellow-400', 'bg-indigo-400', 'bg-pink-400', 'bg-emerald-400', 'bg-cyan-400'][i % 5],
  }));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.5, opacity: 0, y: 60 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: 'spring', damping: 18, stiffness: 150 }}
        className="relative bg-slate-900 border border-white/10 rounded-3xl p-10 max-w-md w-full mx-4 text-center overflow-hidden shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {particles.map(p => <Particle key={p.id} x={p.x} y={p.y} color={p.color} />)}
        </div>

        {/* Glow BG */}
        <div className={`absolute inset-0 bg-gradient-to-br ${bm.gradient} opacity-5 pointer-events-none`} />

        {/* Badge */}
        <motion.div
          initial={{ rotate: -20, scale: 0 }}
          animate={{ rotate: 0, scale: 1 }}
          transition={{ type: 'spring', delay: 0.2, damping: 12 }}
          className={`w-24 h-24 mx-auto rounded-full bg-gradient-to-br ${bm.gradient} flex items-center justify-center text-5xl shadow-2xl ${bm.glow} ring-4 ${bm.ring} mb-6`}
        >
          {bm.icon}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <p className="text-xs font-bold text-yellow-400 uppercase tracking-widest mb-1 flex items-center justify-center gap-1">
            <Trophy className="w-3 h-3" /> Achievement Unlocked!
          </p>
          <h2 className="text-2xl font-black text-white mb-1">{course.title}</h2>
          <p className="text-slate-400 text-sm mb-5">{course.description}</p>

          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${bm.gradient} shadow-lg ${bm.glow} mb-6`}>
            <Star className="w-4 h-4 text-white" />
            <span className="text-white font-black">{bm.label} Badge Earned!</span>
          </div>

          <div className="flex items-center justify-center gap-6 mb-8">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-3xl font-black text-indigo-400">
                <Zap className="w-6 h-6" />
                +{course.xp}
              </div>
              <p className="text-xs text-slate-500">XP Earned</p>
            </div>
            <div className="w-px h-10 bg-slate-700" />
            <div className="text-center">
              <div className="text-3xl font-black text-emerald-400">✓</div>
              <p className="text-xs text-slate-500">Completed</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r ${bm.gradient} shadow-lg ${bm.glow} hover:opacity-90 transition-opacity text-sm`}
          >
            Claim Reward & Continue
          </button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

function CourseProgressBar({ courseId, totalSteps = 5 }: { courseId: string; totalSteps?: number }) {
  const [step, setStep] = useState(() => getCourseStep(courseId));

  const pct = Math.round((step / totalSteps) * 100);

  const advance = () => {
    if (step < totalSteps) {
      const next = step + 1;
      setStep(next);
      setCourseStep(courseId, next);
    }
  };

  return (
    <div className="glass-panel p-5 border border-indigo-500/10">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-bold text-white flex items-center gap-2">
          <Zap className="w-4 h-4 text-indigo-400" /> Course Progress
        </p>
        <span className="text-xs font-black text-indigo-400">{pct}%</span>
      </div>
      <div className="h-3 rounded-full bg-slate-800 overflow-hidden mb-3 border border-slate-700/50">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 relative"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          {pct > 0 && <div className="absolute inset-0 bg-white/20 animate-pulse rounded-full" />}
        </motion.div>
      </div>
      <div className="flex gap-1.5 mb-3">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div
            key={i}
            className={`flex-1 h-1 rounded-full transition-all duration-500 ${
              i < step ? 'bg-indigo-500' : 'bg-slate-700'
            }`}
          />
        ))}
      </div>
      <p className="text-xs text-slate-400 mb-3">
        Section {Math.min(step + 1, totalSteps)} of {totalSteps} · {totalSteps - step} remaining
      </p>
      {step < totalSteps && (
        <button
          onClick={advance}
          className="w-full py-2 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 rounded-lg text-xs font-bold border border-indigo-500/20 transition-colors"
        >
          Mark Section Complete ✓
        </button>
      )}
      {step >= totalSteps && (
        <div className="text-center text-emerald-400 text-xs font-bold py-2 flex items-center justify-center gap-1">
          <CheckCircle className="w-4 h-4" /> All sections done!
        </div>
      )}
    </div>
  );
}

export default function CoursePlayer() {
  const { id } = useParams<{ id: string }>();
  const course = MOCK_COURSES.find(c => c.id === id);

  const [isDownloaded, setIsDownloaded] = useState(false);
  const [courseCompleted, setCourseCompleted] = useState(false);
  const [showAchievement, setShowAchievement] = useState(false);
  const [showInterpreter, setShowInterpreter] = useState(false);

  useEffect(() => {
    if (course) {
      setIsDownloaded(getDownloadedCourses().includes(course.id));
      setCourseCompleted(getCompletedCourses().includes(course.id));
    }
  }, [course]);

  if (!course) {
    return <div className="text-white">Course not found.</div>;
  }

  const bm = BADGE_META[course.badge];

  const handleDownload = () => {
    addDownloadedCourse(course!.id);
    setIsDownloaded(true);
  };

  const handleComplete = () => {
    if (courseCompleted) return;
    addCompletedCourse(course!.id);
    setCourseCompleted(true);
    setShowAchievement(true);
    // Notify Courses page to recompute unlock states
    window.dispatchEvent(new Event('algoverse:progress'));
  };

  return (
    <div className="flex flex-col h-full gap-6 pb-20 overflow-y-auto animate-in fade-in custom-scrollbar">
      {/* Top nav */}
      <div className="flex items-center justify-between">
        <Link to="/courses" className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
          <ArrowLeft className="w-5 h-5" /> Back to Courses
        </Link>
        <button
          onClick={handleDownload}
          disabled={isDownloaded}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 border ${
            isDownloaded
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 cursor-not-allowed'
              : 'bg-slate-800 text-white hover:bg-slate-700 border-slate-700 hover:border-slate-500'
          }`}
        >
          {isDownloaded
            ? <><CheckCircle className="w-4 h-4" /> Downloaded</>
            : <><Download className="w-4 h-4" /> Download Offline</>}
        </button>
      </div>

      {/* Badge + difficulty header */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${bm.gradient} flex items-center justify-center text-3xl shadow-xl ${bm.glow} ring-2 ${bm.ring}`}>
          {bm.icon}
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-xs font-black px-3 py-0.5 rounded-full bg-gradient-to-r ${bm.gradient} text-white shadow-sm`}>
              {bm.label} Course
            </span>
            <span className="text-xs text-slate-500 font-medium">·</span>
            <span className="text-xs text-slate-400 font-medium">{course.difficulty}</span>
            <span className="text-xs text-slate-500">·</span>
            <span className="text-xs text-indigo-400 font-bold flex items-center gap-0.5">
              <Zap className="w-3 h-3" /> +{course.xp} XP
            </span>
          </div>
          <h1 className="text-2xl font-black text-white">{course.title}</h1>
        </div>
        {courseCompleted && (
          <div className={`ml-auto flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r ${bm.gradient} shadow-lg ${bm.glow}`}>
            <Trophy className="w-4 h-4 text-white" />
            <span className="text-white text-sm font-black">Completed!</span>
          </div>
        )}
      </div>

      <div className="glass-panel p-4 flex flex-col xl:flex-row gap-6">
        {/* Video */}
        <div className="flex-1">
          <div className="aspect-video bg-black rounded-xl overflow-hidden border border-slate-800 shadow-2xl relative">
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube-nocookie.com/embed/${course.ytId}?rel=0`}
              title="Course Player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0"
            />
          </div>

          <div className="mt-5 flex flex-wrap justify-between items-start gap-4">
            <div>
              <p className="text-slate-400 text-sm max-w-xl">{course.description}</p>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {course.topics.map(t => (
                  <span key={t} className="text-xs px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700/50">
                    {t}
                  </span>
                ))}
              </div>
            </div>
            {!courseCompleted ? (
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={handleComplete}
                className={`px-6 py-3 bg-gradient-to-r ${bm.gradient} rounded-xl font-black text-white shadow-xl ${bm.glow} flex items-center gap-2`}
              >
                <Trophy className="w-5 h-5" />
                Mark Complete & Claim {bm.label} Badge
              </motion.button>
            ) : (
              <div className={`px-6 py-3 bg-gradient-to-r ${bm.gradient} rounded-xl font-black text-white shadow-xl ${bm.glow} flex items-center gap-2 opacity-90`}>
                <CheckCircle className="w-5 h-5" /> {bm.label} Badge Claimed!
              </div>
            )}
          </div>
        </div>

        {/* Side panel */}
        <div className="xl:w-80 w-full flex flex-col gap-4">
          {/* Progress tracker */}
          <CourseProgressBar courseId={course.id} totalSteps={5} />

          {/* XP card */}
          <div className={`glass-panel p-4 border ${bm.ring} bg-gradient-to-br from-slate-900 to-slate-950 relative overflow-hidden`}>
            <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl ${bm.gradient} opacity-10 rounded-full blur-2xl`} />
            <p className="text-xs text-slate-400 font-semibold mb-1 flex items-center gap-1">
              <Zap className="w-3 h-3 text-indigo-400" /> XP Reward
            </p>
            <p className={`text-3xl font-black ${bm.xpColor}`}>+{course.xp} XP</p>
            <p className="text-xs text-slate-500 mt-0.5">Earned on completion · {course.duration}</p>
          </div>

          {/* Slide interpreter */}
          <div className="glass-panel p-5 bg-slate-900/50 flex flex-col border border-slate-700/50 flex-1">
            <div className="flex items-center gap-2 mb-3 text-indigo-300">
              <Camera className="w-4 h-4" />
              <h3 className="font-bold text-sm">AI Slide Interpreter</h3>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Upload a slide screenshot for an AI explanation of any chart or diagram.
            </p>
            {!showInterpreter ? (
              <button
                onClick={() => setShowInterpreter(true)}
                className="mt-auto py-3 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm text-white font-medium border border-dashed border-slate-600 transition-colors"
              >
                Take / Upload Screenshot
              </button>
            ) : (
              <div className="mt-auto animate-in fade-in space-y-3">
                <div className="h-28 bg-slate-800 rounded-lg flex items-center justify-center border border-slate-700/50">
                  <p className="text-xs text-slate-500">Processing image...</p>
                </div>
                <div className="bg-indigo-500/10 border border-indigo-500/20 p-3 rounded-lg">
                  <p className="text-xs text-indigo-200">
                    <span className="font-bold">AI Analysis:</span> This is a bar chart showing time complexity. The red curve is O(n²) which grows drastically faster than the blue O(n log n) curve.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quiz section */}
      {courseCompleted && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-4"
        >
          <h2 className="text-2xl font-bold text-white mb-5 flex items-center gap-2">
            <Star className="w-6 h-6 text-yellow-400" /> Course Quiz
          </h2>
          <Quiz courseId={course.id} />
        </motion.div>
      )}

      {/* Achievement Modal */}
      <AnimatePresence>
        {showAchievement && (
          <AchievementModal course={course} onClose={() => setShowAchievement(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}

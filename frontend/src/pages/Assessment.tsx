import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ClipboardList, ChevronDown, Play, CheckCircle, XCircle,
  Download, Mail, RotateCcw, Star, Zap, BookOpen, ArrowRight, Printer
} from 'lucide-react';
import { MOCK_COURSES } from './Courses';

interface AlgoUser { name: string; email: string; }

// ─── Assessment Question Bank ─────────────────────────────────────────────────
interface Question {
  id: number;
  text: string;
  options: string[];
  correct: number; // index
  explanation: string;
}

const COURSE_ASSESSMENTS: Record<string, { title: string; questions: Question[] }> = {
  '1': {
    title: 'Data Structures Fundamentals',
    questions: [
      { id: 1, text: 'What is the time complexity of accessing an element in an array by index?', options: ['O(n)', 'O(log n)', 'O(1)', 'O(n²)'], correct: 2, explanation: 'Array index access is O(1) because arrays are stored in contiguous memory.' },
      { id: 2, text: 'Which data structure uses LIFO order?', options: ['Queue', 'Stack', 'Linked List', 'Tree'], correct: 1, explanation: 'Stack follows Last-In-First-Out (LIFO) — the last element pushed is the first to be popped.' },
      { id: 3, text: 'What is the worst-case time to search in an unsorted linked list?', options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'], correct: 2, explanation: 'You must traverse every node in the worst case, giving O(n).' },
      { id: 4, text: 'In a binary tree, each node has at most ___ children.', options: ['1', '2', '3', 'Unlimited'], correct: 1, explanation: 'A binary tree allows at most 2 children per node: left and right.' },
      { id: 5, text: 'Which structure is best for implementing a priority queue efficiently?', options: ['Array', 'Stack', 'Heap', 'Linked List'], correct: 2, explanation: 'A heap supports O(log n) insert and O(log n) extract-min/max, making it ideal for priority queues.' },
      { id: 6, text: 'What is the space complexity of a graph with V vertices and E edges in adjacency list form?', options: ['O(V)', 'O(E)', 'O(V+E)', 'O(V²)'], correct: 2, explanation: 'Adjacency lists store each vertex and each edge once, giving O(V+E).' },
      { id: 7, text: 'A hash table provides average-case __ complexity for insert and lookup.', options: ['O(n)', 'O(log n)', 'O(1)', 'O(n log n)'], correct: 2, explanation: 'With a good hash function and load factor, hash tables achieve O(1) average for insert/lookup.' },
      { id: 8, text: 'Which traversal visits nodes level by level in a tree?', options: ['Inorder', 'Preorder', 'Postorder', 'BFS/Level-order'], correct: 3, explanation: 'Level-order traversal (BFS) visits all nodes at depth d before depth d+1.' },
    ],
  },
  '2': {
    title: 'Big-O & Complexity Analysis',
    questions: [
      { id: 1, text: 'What does O(1) mean?', options: ['Linear time', 'Constant time', 'Logarithmic time', 'Quadratic time'], correct: 1, explanation: 'O(1) means the algorithm runs in constant time regardless of input size.' },
      { id: 2, text: 'Which is the fastest complexity class?', options: ['O(n)', 'O(log n)', 'O(1)', 'O(n log n)'], correct: 2, explanation: 'O(1) is constant and fastest, independent of n.' },
      { id: 3, text: 'Binary search has a time complexity of:', options: ['O(n)', 'O(log n)', 'O(n log n)', 'O(1)'], correct: 1, explanation: 'Binary search halves the search space each step, giving O(log n).' },
      { id: 4, text: 'Bubble sort worst case is:', options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(log n)'], correct: 2, explanation: 'Bubble sort compares adjacent elements, resulting in O(n²) worst case nested loops.' },
      { id: 5, text: 'Which notation gives the tightest upper bound?', options: ['Big-O (O)', 'Big-Omega (Ω)', 'Big-Theta (Θ)', 'Little-o (o)'], correct: 2, explanation: 'Big-Theta (Θ) gives both an upper and lower bound, making it the tightest bound.' },
      { id: 6, text: 'Merge sort is O(n log n) in which case?', options: ['Best only', 'Worst only', 'Average only', 'All cases (best, avg, worst)'], correct: 3, explanation: 'Merge sort is O(n log n) in all cases because it always divides and merges regardless of input.' },
      { id: 7, text: 'An algorithm with O(2^n) complexity is called:', options: ['Polynomial', 'Exponential', 'Logarithmic', 'Linear'], correct: 1, explanation: 'O(2^n) is exponential — it doubles with each unit increase in n.' },
      { id: 8, text: 'Space complexity measures:', options: ['CPU usage', 'Memory usage relative to input', 'Runtime seconds', 'Number of functions'], correct: 1, explanation: 'Space complexity measures how much memory an algorithm uses as a function of input size.' },
    ],
  },
  '3': {
    title: 'Recursion & Call Stack',
    questions: [
      { id: 1, text: 'What is the base case in recursion?', options: ['The first recursive call', 'The condition that stops recursion', 'The return type', 'The function signature'], correct: 1, explanation: 'The base case stops the recursion to prevent infinite calls / stack overflow.' },
      { id: 2, text: 'What happens when recursion has no base case?', options: ['Returns null', 'Runs forever until stack overflow', 'Returns 0', 'Compiles but does nothing'], correct: 1, explanation: 'Without a base case, the function keeps calling itself until the call stack is exhausted.' },
      { id: 3, text: 'Fibonacci(5) using naive recursion makes how many calls approximately?', options: ['5', '10', '15', '25+'], correct: 3, explanation: 'Naive Fibonacci repeats many subproblems, leading to exponential calls (2^n).' },
      { id: 4, text: 'Memoization improves recursion by:', options: ['Adding more base cases', 'Caching previously computed results', 'Reducing recursion depth', 'Using iteration instead'], correct: 1, explanation: 'Memoization stores results of subproblems, preventing redundant recomputation.' },
      { id: 5, text: 'Tail recursion can be optimized into:', options: ['A loop (iteration)', 'A hash table', 'A tree', 'Another function'], correct: 0, explanation: 'Tail-call optimization converts tail-recursive calls into loops, using O(1) stack space.' },
      { id: 6, text: 'What is tree recursion?', options: ['Recursion only on trees', 'A function that makes multiple recursive calls', 'Recursion with a tree data structure', 'Depth-first recursion'], correct: 1, explanation: 'Tree recursion occurs when a function calls itself more than once per invocation.' },
      { id: 7, text: 'The call stack stores:', options: ['Heap allocations', 'Function frames and local variables', 'Global state', 'Database connections'], correct: 1, explanation: 'Each recursive call creates a new frame on the call stack holding local variables and return address.' },
      { id: 8, text: 'Time complexity of memoized Fibonacci is:', options: ['O(2^n)', 'O(n²)', 'O(n)', 'O(log n)'], correct: 2, explanation: 'With memoization, each subproblem is solved once, giving O(n) total time.' },
    ],
  },
  '4': {
    title: 'Algorithms & Sorting',
    questions: [
      { id: 1, text: 'Which sorting algorithm is stable and has O(n log n) guaranteed?', options: ['Quick Sort', 'Heap Sort', 'Merge Sort', 'Selection Sort'], correct: 2, explanation: 'Merge Sort is stable (preserves order of equal elements) and always runs in O(n log n).' },
      { id: 2, text: 'Quick Sort worst case occurs when:', options: ['Array is random', 'Pivot is always median', 'Array is already sorted', 'Array has duplicates'], correct: 2, explanation: 'When the array is sorted and pivot is always first/last, Quick Sort degrades to O(n²).' },
      { id: 3, text: 'Which algorithm divides the problem into smaller subproblems?', options: ['Greedy', 'Dynamic Programming', 'Divide and Conquer', 'Backtracking'], correct: 2, explanation: 'Divide and Conquer splits problems into smaller independent subproblems, solves them, then merges.' },
      { id: 4, text: 'Insertion sort is efficient for:', options: ['Large random arrays', 'Nearly-sorted arrays', 'Reverse-sorted arrays', 'Arrays with many duplicates'], correct: 1, explanation: 'Insertion sort performs O(n) for nearly-sorted input as few shifts are needed.' },
      { id: 5, text: 'What is the space complexity of Merge Sort?', options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'], correct: 2, explanation: 'Merge Sort requires O(n) extra space for the temporary merge array.' },
      { id: 6, text: 'In-place sorting means:', options: ['Runs in constant time', 'Needs O(1) extra memory', 'Is stable', 'Runs on in-memory data only'], correct: 1, explanation: 'An in-place algorithm uses O(1) (constant) extra memory beyond the input array.' },
      { id: 7, text: 'Radix Sort works on:', options: ['Any comparable elements', 'Only integers or fixed-length strings', 'Only floating point numbers', 'Only strings'], correct: 1, explanation: 'Radix Sort is a non-comparison sort that works on integers or fixed-width keys by sorting digit by digit.' },
      { id: 8, text: 'Which algorithm guarantees O(n log n) in-place but is unstable?', options: ['Merge Sort', 'Quick Sort', 'Heap Sort', 'Tim Sort'], correct: 2, explanation: 'Heap Sort is O(n log n) in all cases, in-place (O(1) space), but unstable.' },
    ],
  },
  '5': {
    title: 'Graph Algorithms & Traversal',
    questions: [
      { id: 1, text: 'BFS uses which data structure internally?', options: ['Stack', 'Queue', 'Priority Queue', 'Deque'], correct: 1, explanation: 'BFS uses a FIFO queue to explore nodes level by level.' },
      { id: 2, text: 'DFS uses which data structure (or approach)?', options: ['Queue', 'Heap', 'Stack or recursion', 'Double-ended queue'], correct: 2, explanation: 'DFS uses a stack (explicit or via recursion) to explore paths as deep as possible first.' },
      { id: 3, text: 'Dijkstra\'s algorithm fails on:', options: ['Directed graphs', 'Negative weight edges', 'Dense graphs', 'Weighted graphs'], correct: 1, explanation: 'Dijkstra assumes all edge weights are non-negative; negative weights break the greedy invariant.' },
      { id: 4, text: 'Bellman-Ford can detect:', options: ['Minimum spanning trees', 'Negative weight cycles', 'Hamiltonian paths', 'Eulerian circuits'], correct: 1, explanation: 'If a node can still be relaxed after V-1 iterations, a negative cycle exists.' },
      { id: 5, text: 'Which MST algorithm sorts all edges first?', options: ["Prim's", "Kruskal's", "Dijkstra's", 'Floyd-Warshall'], correct: 1, explanation: "Kruskal's sorts all edges by weight and adds the minimum that doesn't form a cycle." },
      { id: 6, text: 'Topological sort is applicable to:', options: ['Any graph', 'Undirected graphs only', 'Directed Acyclic Graphs (DAGs)', 'Weighted graphs only'], correct: 2, explanation: 'Topological sort requires a DAG — cycles make a valid topological ordering impossible.' },
      { id: 7, text: 'A graph with V vertices and E edges as adjacency matrix uses:', options: ['O(V+E)', 'O(V)', 'O(V²)', 'O(E log V)'], correct: 2, explanation: 'An adjacency matrix is a V×V grid, using O(V²) space.' },
      { id: 8, text: 'Which algorithm finds ALL-pairs shortest paths?', options: ["Dijkstra's", 'BFS', 'Floyd-Warshall', "Prim's"], correct: 2, explanation: 'Floyd-Warshall computes shortest paths between every pair of vertices in O(V³).' },
    ],
  },
};

// Fallback for courses without specific assessment
const DEFAULT_ASSESSMENT: typeof COURSE_ASSESSMENTS['1'] = {
  title: 'General Algorithm Assessment',
  questions: COURSE_ASSESSMENTS['1'].questions,
};

function getAssessment(courseId: string) {
  return COURSE_ASSESSMENTS[courseId] ?? DEFAULT_ASSESSMENT;
}

// ─── PDF Generator ─────────────────────────────────────────────────────────────
function generatePDFHTML(
  user: AlgoUser,
  courseName: string,
  questions: Question[],
  answers: Record<number, number>,
  score: number
) {
  const date = new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
  const grade = score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : score >= 40 ? 'Average' : 'Needs Improvement';
  const gradeColor = score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : score >= 40 ? '#f97316' : '#ef4444';

  const questionRows = questions.map((q, i) => {
    const chosen = answers[q.id] ?? -1;
    const isCorrect = chosen === q.correct;
    return `
      <div style="margin-bottom:20px;padding:16px;border-radius:10px;background:${isCorrect ? '#f0fdf4' : '#fff1f2'};border-left:4px solid ${isCorrect ? '#10b981' : '#ef4444'}">
        <p style="margin:0 0 8px;font-weight:700;color:#1e293b">Q${i + 1}. ${q.text}</p>
        <p style="margin:0 0 4px;font-size:13px;color:${isCorrect ? '#065f46' : '#9f1239'}">
          ${isCorrect ? '✓ Correct' : '✗ Incorrect'} — Your answer: ${chosen >= 0 ? q.options[chosen] : 'Not answered'}
        </p>
        ${!isCorrect ? `<p style="margin:0 0 4px;font-size:13px;color:#065f46">Correct: ${q.options[q.correct]}</p>` : ''}
        <p style="margin:8px 0 0;font-size:12px;color:#64748b;font-style:italic">${q.explanation}</p>
      </div>`;
  }).join('');

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>AlgoVerse Assessment — ${courseName}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&display=swap');
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Inter', sans-serif; background: #fff; color: #1e293b; padding: 40px; }
    @media print { body { padding: 20px; } }
    .header { display: flex; align-items: center; gap: 16px; margin-bottom: 32px; padding-bottom: 20px; border-bottom: 2px solid #e2e8f0; }
    .logo { width: 48px; height: 48px; background: linear-gradient(135deg, #6366f1, #8b5cf6); border-radius: 12px; display: flex; align-items: center; justify-content: center; }
    .logo-text { color: white; font-weight: 900; font-size: 20px; }
    .brand { font-size: 24px; font-weight: 900; color: #6366f1; }
    .subtitle { font-size: 12px; color: #94a3b8; margin-top: 2px; }
    .score-card { background: linear-gradient(135deg, #6366f1, #8b5cf6); border-radius: 16px; padding: 24px; color: white; margin-bottom: 28px; display: flex; justify-content: space-between; align-items: center; }
    .score-big { font-size: 56px; font-weight: 900; line-height: 1; }
    .meta p { margin-bottom: 6px; font-size: 14px; opacity: 0.9; }
    .grade-badge { display: inline-block; background: rgba(255,255,255,0.2); border-radius: 999px; padding: 4px 16px; font-size: 14px; font-weight: 700; margin-top:8px; }
    .section-title { font-size: 18px; font-weight: 700; color: #1e293b; margin: 24px 0 16px; padding-bottom: 8px; border-bottom: 1px solid #e2e8f0; }
    .footer { margin-top: 32px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #94a3b8; text-align: center; }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo"><span class="logo-text">A</span></div>
    <div>
      <div class="brand">AlgoVerse</div>
      <div class="subtitle">AI Algorithm Learning Platform · Assessment Report</div>
    </div>
    <div style="margin-left:auto;text-align:right;font-size:12px;color:#94a3b8">
      <p>${date}</p>
      <p>${user.email}</p>
    </div>
  </div>

  <div class="score-card">
    <div>
      <p style="font-size:13px;opacity:0.8;margin-bottom:4px">Assessment Report</p>
      <h2 style="font-size:20px;font-weight:900;margin-bottom:4px">${courseName}</h2>
      <p style="font-size:14px;opacity:0.8">Student: ${user.name}</p>
      <span class="grade-badge" style="background:${gradeColor}33;border:1px solid ${gradeColor}55">${grade}</span>
    </div>
    <div style="text-align:right">
      <div class="score-big">${score}<span style="font-size:24px">%</span></div>
      <p style="font-size:14px;opacity:0.8;margin-top:4px">${Object.values(answers).filter((a, i) => a === questions[i]?.correct).length} / ${questions.length} correct</p>
    </div>
  </div>

  <div class="section-title">Detailed Answer Review</div>
  ${questionRows}

  <div class="footer">
    Generated by AlgoVerse · ${user.name} · ${date} · Keep this report for reference
  </div>
</body>
</html>`;
}

// ─── Component ────────────────────────────────────────────────────────────────
interface AssessmentProps { user: AlgoUser; }

export default function Assessment({ user }: AssessmentProps) {
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [phase, setPhase] = useState<'select' | 'quiz' | 'result'>('select');
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [selected, setSelected] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const assessment = selectedCourseId ? getAssessment(selectedCourseId) : null;
  const course = MOCK_COURSES.find(c => c.id === selectedCourseId);

  const score = assessment
    ? Math.round((Object.entries(answers).filter(([id, ans]) => {
        const q = assessment.questions.find(q => q.id === parseInt(id));
        return q && ans === q.correct;
      }).length / assessment.questions.length) * 100)
    : 0;

  const handleAnswer = (optionIdx: number) => {
    if (showFeedback) return;
    setSelected(optionIdx);
    setShowFeedback(true);
    const q = assessment!.questions[currentQ];
    setAnswers(prev => ({ ...prev, [q.id]: optionIdx }));
  };

  const handleNext = () => {
    setShowFeedback(false);
    setSelected(null);
    if (currentQ < assessment!.questions.length - 1) {
      setCurrentQ(q => q + 1);
    } else {
      // Save score
      localStorage.setItem(`assessment_score_${user.email}_${selectedCourseId}`, String(score));
      setPhase('result');
    }
  };

  const handleDownloadPDF = () => {
    if (!assessment || !course) return;
    setDownloading(true);
    const html = generatePDFHTML(user, assessment.title, assessment.questions, answers, score);
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const win = window.open(url, '_blank');
    if (win) {
      setTimeout(() => { win.print(); setDownloading(false); }, 800);
    } else {
      setDownloading(false);
    }
  };

  const handleEmailPDF = () => {
    if (!assessment) return;
    const subject = encodeURIComponent(`AlgoVerse Assessment — ${assessment.title}`);
    const body = encodeURIComponent(
      `Hi ${user.name},\n\nHere is your AlgoVerse assessment result:\n\nCourse: ${assessment.title}\nScore: ${score}%\nDate: ${new Date().toLocaleDateString()}\n\nPlease find the detailed PDF attached (download it from AlgoVerse and attach manually).\n\nKeep learning! 🚀\n— AlgoVerse`
    );
    window.location.href = `mailto:${user.email}?subject=${subject}&body=${body}`;
    setEmailSent(true);
    setTimeout(() => setEmailSent(false), 4000);
  };

  const handleRetake = () => {
    setPhase('quiz');
    setCurrentQ(0);
    setAnswers({});
    setSelected(null);
    setShowFeedback(false);
    setEmailSent(false);
  };

  const q = assessment?.questions[currentQ];
  const progress = assessment ? ((currentQ + (showFeedback ? 1 : 0)) / assessment.questions.length) * 100 : 0;

  return (
    <div className="h-full overflow-y-auto custom-scrollbar pb-24 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-4xl font-black mb-2">
          Course <span className="text-gradient">Assessments</span>
        </h2>
        <p className="text-slate-400 text-lg max-w-2xl">
          Test your knowledge for any course. Get a detailed score report — download as PDF or send it to your email.
        </p>
      </div>

      {/* ── Select Phase ── */}
      {phase === 'select' && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="glass-panel p-8 mb-6 border border-white/5 max-w-2xl">
            <h3 className="text-lg font-black text-white mb-5 flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-indigo-400" /> Choose a Course to Assess
            </h3>

            <div className="space-y-3 mb-6">
              {MOCK_COURSES.map(c => {
                const prevScore = localStorage.getItem(`assessment_score_${user.email}_${c.id}`);
                return (
                  <motion.button
                    key={c.id}
                    whileHover={{ x: 4 }}
                    onClick={() => setSelectedCourseId(c.id)}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all text-left ${
                      selectedCourseId === c.id
                        ? 'bg-indigo-500/15 border-indigo-500/40 shadow-lg shadow-indigo-500/10'
                        : 'bg-slate-900/50 border-slate-800/50 hover:border-slate-600/50'
                    }`}
                  >
                    <img src={c.thumbnail} alt={c.title} className="w-14 h-9 rounded-lg object-cover flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-white text-sm truncate">{c.title}</p>
                      <p className="text-xs text-slate-400">{c.difficulty} · {getAssessment(c.id).questions.length} questions</p>
                    </div>
                    {prevScore && (
                      <span className="text-xs font-black text-indigo-300 px-2 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex-shrink-0">
                        Last: {prevScore}%
                      </span>
                    )}
                    {selectedCourseId === c.id && (
                      <CheckCircle className="w-5 h-5 text-indigo-400 flex-shrink-0" />
                    )}
                  </motion.button>
                );
              })}
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => selectedCourseId && setPhase('quiz')}
              disabled={!selectedCourseId}
              className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-black rounded-xl shadow-xl shadow-indigo-500/20 flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <Play className="w-5 h-5" fill="currentColor" /> Start Assessment
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* ── Quiz Phase ── */}
      {phase === 'quiz' && q && assessment && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl">
          {/* Progress */}
          <div className="mb-6">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-slate-400 font-semibold">{assessment.title}</span>
              <span className="text-indigo-400 font-black">Q{currentQ + 1} / {assessment.questions.length}</span>
            </div>
            <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>
          </div>

          <div className="glass-panel p-8 border border-slate-700/50">
            {/* Question */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQ}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.25 }}
              >
                <p className="text-xs font-black text-indigo-400 uppercase tracking-widest mb-3">Question {currentQ + 1}</p>
                <h3 className="text-xl font-bold text-white mb-6 leading-snug">{q.text}</h3>

                <div className="space-y-3 mb-6">
                  {q.options.map((opt, i) => {
                    let bg = 'bg-slate-800/50 border-slate-700/60 hover:border-slate-500 hover:bg-slate-700/50';
                    let textC = 'text-slate-200';
                    if (showFeedback) {
                      if (i === q.correct) { bg = 'bg-emerald-500/15 border-emerald-500/40'; textC = 'text-emerald-200'; }
                      else if (i === selected && i !== q.correct) { bg = 'bg-rose-500/15 border-rose-500/40'; textC = 'text-rose-200'; }
                      else { bg = 'bg-slate-800/30 border-slate-800 opacity-50'; }
                    }
                    return (
                      <button
                        key={i}
                        onClick={() => handleAnswer(i)}
                        disabled={showFeedback}
                        className={`w-full text-left px-5 py-3.5 rounded-xl border font-semibold text-sm transition-all duration-200 flex items-center gap-3 ${bg} ${textC}`}
                      >
                        <span className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-black border ${
                          showFeedback && i === q.correct ? 'bg-emerald-500 border-emerald-400 text-white' :
                          showFeedback && i === selected && i !== q.correct ? 'bg-rose-500 border-rose-400 text-white' :
                          'border-slate-600 text-slate-400'
                        }`}>
                          {['A','B','C','D'][i]}
                        </span>
                        {opt}
                        {showFeedback && i === q.correct && <CheckCircle className="w-4 h-4 text-emerald-400 ml-auto" />}
                        {showFeedback && i === selected && i !== q.correct && <XCircle className="w-4 h-4 text-rose-400 ml-auto" />}
                      </button>
                    );
                  })}
                </div>

                {/* Explanation */}
                <AnimatePresence>
                  {showFeedback && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-4 rounded-xl mb-4 border ${selected === q.correct ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-amber-500/10 border-amber-500/20'}`}
                    >
                      <p className="text-sm font-bold text-white mb-1">{selected === q.correct ? '🎯 Correct!' : '💡 Explanation'}</p>
                      <p className="text-sm text-slate-300">{q.explanation}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {showFeedback && (
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleNext}
                    className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-black rounded-xl shadow-lg flex items-center justify-center gap-2"
                  >
                    {currentQ < assessment.questions.length - 1 ? (
                      <><ArrowRight className="w-5 h-5" /> Next Question</>
                    ) : (
                      <><Star className="w-5 h-5" /> View Results</>
                    )}
                  </motion.button>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      )}

      {/* ── Result Phase ── */}
      {phase === 'result' && assessment && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl">
          {/* Score card */}
          <div className={`glass-panel p-8 mb-6 border text-center relative overflow-hidden ${
            score >= 80 ? 'border-emerald-500/30' : score >= 60 ? 'border-amber-500/30' : 'border-rose-500/30'
          }`}>
            <div className={`absolute inset-0 opacity-5 ${
              score >= 80 ? 'bg-emerald-500' : score >= 60 ? 'bg-amber-500' : 'bg-rose-500'
            }`} />
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', damping: 12, delay: 0.1 }}
              className="text-8xl font-black text-white mb-2 relative z-10"
            >
              {score}<span className="text-4xl text-slate-400">%</span>
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
              <p className={`text-xl font-black mb-1 relative z-10 ${
                score >= 80 ? 'text-emerald-400' : score >= 60 ? 'text-amber-400' : 'text-rose-400'
              }`}>
                {score >= 80 ? '🏆 Excellent!' : score >= 60 ? '👍 Good Work!' : score >= 40 ? '📚 Keep Practicing' : '💪 Don\'t Give Up!'}
              </p>
              <p className="text-slate-400 text-sm relative z-10">
                {Object.entries(answers).filter(([id, ans]) => assessment.questions.find(q => q.id === parseInt(id))?.correct === ans).length} of {assessment.questions.length} correct · {assessment.title}
              </p>
            </motion.div>
          </div>

          {/* Action buttons */}
          <div className="glass-panel p-6 mb-6 border border-white/5">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">Export Your Report</h3>
            <div className="grid grid-cols-1 gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleDownloadPDF}
                disabled={downloading}
                className="flex items-center gap-3 px-5 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl shadow-xl shadow-indigo-500/20 hover:from-indigo-500 hover:to-purple-500 transition-all disabled:opacity-50"
              >
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                  <Printer className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="font-black">Download PDF Report</p>
                  <p className="text-xs text-indigo-200">Opens print dialog — Save as PDF to your device</p>
                </div>
                <Download className="w-5 h-5 ml-auto" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleEmailPDF}
                className={`flex items-center gap-3 px-5 py-4 rounded-xl font-bold border transition-all ${
                  emailSent
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                    : 'bg-slate-800 border-slate-700 text-slate-200 hover:border-indigo-500/30 hover:text-white'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${emailSent ? 'bg-emerald-500/20' : 'bg-slate-700'}`}>
                  {emailSent ? <CheckCircle className="w-5 h-5 text-emerald-400" /> : <Mail className="w-5 h-5" />}
                </div>
                <div className="text-left">
                  <p className="font-black">{emailSent ? 'Email Client Opened!' : 'Send to My Email'}</p>
                  <p className="text-xs opacity-60">Opens your mail app with report summary to {user.email}</p>
                </div>
              </motion.button>
            </div>
          </div>

          {/* Answer review */}
          <div className="glass-panel p-6 mb-6 border border-white/5">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">Answer Review</h3>
            <div className="space-y-4">
              {assessment.questions.map((question, i) => {
                const given = answers[question.id] ?? -1;
                const correct = given === question.correct;
                return (
                  <motion.div
                    key={question.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className={`p-4 rounded-xl border ${correct ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-rose-500/5 border-rose-500/20'}`}
                  >
                    <div className="flex items-start gap-3">
                      {correct
                        ? <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                        : <XCircle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />}
                      <div>
                        <p className="text-sm font-bold text-white mb-1">Q{i + 1}. {question.text}</p>
                        {!correct && (
                          <p className="text-xs text-rose-300 mb-0.5">Your answer: {given >= 0 ? question.options[given] : 'Not answered'}</p>
                        )}
                        <p className="text-xs text-emerald-300 mb-1">✓ {question.options[question.correct]}</p>
                        <p className="text-xs text-slate-400 italic">{question.explanation}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Retake / New */}
          <div className="flex gap-3">
            <button
              onClick={handleRetake}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold border border-slate-700 transition-all"
            >
              <RotateCcw className="w-4 h-4" /> Retake This
            </button>
            <button
              onClick={() => { setPhase('select'); setSelectedCourseId(''); setAnswers({}); setCurrentQ(0); }}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-indigo-500/15 hover:bg-indigo-500/25 text-indigo-300 font-bold border border-indigo-500/20 transition-all"
            >
              <BookOpen className="w-4 h-4" /> Try Another Course
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}

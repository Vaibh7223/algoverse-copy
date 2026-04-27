import React, { useState } from 'react';
import { Swords, Play, Trophy, Zap, Clock, MemoryStick, CheckCircle, XCircle, ChevronDown, Crown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Algorithm Database ────────────────────────────────────────────────────────
export interface AlgoStats {
  id: string;
  name: string;
  category: string;
  timeAvg: string;
  timeBest: string;
  timeWorst: string;
  space: string;
  stable: boolean;
  inPlace: boolean;
  recursive: boolean;
  parallel: boolean;
  useCases: string[];
  pros: string[];
  cons: string[];
  difficulty: 'Easy' | 'Medium' | 'Hard';
  realWorldUse: string;
  color: string; // tailwind gradient
}

const ALGORITHMS: AlgoStats[] = [
  // ── Sorting ──
  {
    id: 'quicksort', name: 'Quick Sort', category: 'Sorting',
    timeAvg: 'O(n log n)', timeBest: 'O(n log n)', timeWorst: 'O(n²)',
    space: 'O(log n)', stable: false, inPlace: true, recursive: true, parallel: false,
    useCases: ['Large in-memory datasets', 'General-purpose sorting', 'Cache-friendly workloads'],
    pros: ['Fastest average case', 'In-place', 'Cache-efficient'],
    cons: ['Unstable', 'O(n²) worst case', 'Poor for nearly-sorted data'],
    difficulty: 'Medium', realWorldUse: 'C++ std::sort, Java Arrays.sort (primitive)',
    color: 'from-indigo-500 to-blue-600',
  },
  {
    id: 'mergesort', name: 'Merge Sort', category: 'Sorting',
    timeAvg: 'O(n log n)', timeBest: 'O(n log n)', timeWorst: 'O(n log n)',
    space: 'O(n)', stable: true, inPlace: false, recursive: true, parallel: true,
    useCases: ['Linked lists', 'External sorting', 'Stable sort needed'],
    pros: ['Stable', 'Guaranteed O(n log n)', 'Parallelizable'],
    cons: ['Extra O(n) space', 'Slower in practice than Quick Sort', 'Not in-place'],
    difficulty: 'Medium', realWorldUse: 'Python sorted(), Java Arrays.sort (objects)',
    color: 'from-emerald-500 to-teal-600',
  },
  {
    id: 'heapsort', name: 'Heap Sort', category: 'Sorting',
    timeAvg: 'O(n log n)', timeBest: 'O(n log n)', timeWorst: 'O(n log n)',
    space: 'O(1)', stable: false, inPlace: true, recursive: false, parallel: false,
    useCases: ['Real-time systems', 'Memory-constrained sorting', 'Priority queues'],
    pros: ['O(1) space', 'Guaranteed O(n log n)', 'In-place'],
    cons: ['Unstable', 'Poor cache performance', 'Slower than Quick Sort in practice'],
    difficulty: 'Medium', realWorldUse: 'Embedded systems, Linux task scheduler',
    color: 'from-amber-500 to-orange-600',
  },
  {
    id: 'bubblesort', name: 'Bubble Sort', category: 'Sorting',
    timeAvg: 'O(n²)', timeBest: 'O(n)', timeWorst: 'O(n²)',
    space: 'O(1)', stable: true, inPlace: true, recursive: false, parallel: false,
    useCases: ['Educational purposes', 'Nearly-sorted small datasets', 'Simple implementations'],
    pros: ['Simple to implement', 'Stable', 'Detects sorted arrays early'],
    cons: ['O(n²) average case', 'Not suitable for large data', 'Very slow in practice'],
    difficulty: 'Easy', realWorldUse: 'Teaching sorting concepts',
    color: 'from-rose-500 to-pink-600',
  },
  {
    id: 'insertsort', name: 'Insertion Sort', category: 'Sorting',
    timeAvg: 'O(n²)', timeBest: 'O(n)', timeWorst: 'O(n²)',
    space: 'O(1)', stable: true, inPlace: true, recursive: false, parallel: false,
    useCases: ['Small arrays', 'Nearly-sorted data', 'Online sorting (data arriving live)'],
    pros: ['Adaptive: O(n) for nearly sorted', 'Stable', 'Low overhead'],
    cons: ['O(n²) worst case', 'Poor for large random arrays'],
    difficulty: 'Easy', realWorldUse: 'TimSort (used by Python/Java) for small subarrays',
    color: 'from-violet-500 to-purple-600',
  },
  {
    id: 'radixsort', name: 'Radix Sort', category: 'Sorting',
    timeAvg: 'O(nk)', timeBest: 'O(nk)', timeWorst: 'O(nk)',
    space: 'O(n+k)', stable: true, inPlace: false, recursive: false, parallel: true,
    useCases: ['Integer sorting', 'Fixed-length strings', 'Large datasets with bounded keys'],
    pros: ['Linear time for integers', 'Stable', 'Parallelizable'],
    cons: ['Not comparison-based (limited)', 'Extra space needed', 'Complex for floats/strings'],
    difficulty: 'Hard', realWorldUse: 'Network packet sorting, database indexing',
    color: 'from-cyan-500 to-sky-600',
  },
  // ── Searching ──
  {
    id: 'binsearch', name: 'Binary Search', category: 'Searching',
    timeAvg: 'O(log n)', timeBest: 'O(1)', timeWorst: 'O(log n)',
    space: 'O(1)', stable: true, inPlace: true, recursive: true, parallel: false,
    useCases: ['Sorted arrays', 'Dictionary lookups', 'Finding insertion point'],
    pros: ['O(log n): extremely fast', 'Space efficient', 'Simple'],
    cons: ['Requires sorted input', 'Not suitable for linked lists', 'Fails on unsorted data'],
    difficulty: 'Easy', realWorldUse: 'Database indexes, STL lower_bound, git bisect',
    color: 'from-lime-500 to-green-600',
  },
  {
    id: 'linsearch', name: 'Linear Search', category: 'Searching',
    timeAvg: 'O(n)', timeBest: 'O(1)', timeWorst: 'O(n)',
    space: 'O(1)', stable: true, inPlace: true, recursive: false, parallel: true,
    useCases: ['Unsorted data', 'Small lists', 'One-off search without preprocessing'],
    pros: ['Works on unsorted data', 'Simple', 'No preprocessing needed'],
    cons: ['O(n) average case', 'Slow for large datasets'],
    difficulty: 'Easy', realWorldUse: 'Array.find() in JavaScript, grep on small files',
    color: 'from-fuchsia-500 to-pink-600',
  },
  // ── Graph ──
  {
    id: 'dijkstra', name: "Dijkstra's", category: 'Graph',
    timeAvg: 'O((V+E) log V)', timeBest: 'O(V log V)', timeWorst: 'O(V²)',
    space: 'O(V)', stable: true, inPlace: false, recursive: false, parallel: false,
    useCases: ['Shortest path in weighted graphs', 'GPS navigation', 'Network routing'],
    pros: ['Optimal for positive weights', 'Efficient with priority queue', 'Widely applicable'],
    cons: ['Fails with negative weights', 'O(V²) without heap', 'Memory intensive for dense graphs'],
    difficulty: 'Hard', realWorldUse: 'Google Maps, OSPF routing protocol',
    color: 'from-yellow-500 to-amber-600',
  },
  {
    id: 'bellmanford', name: 'Bellman-Ford', category: 'Graph',
    timeAvg: 'O(VE)', timeBest: 'O(E)', timeWorst: 'O(VE)',
    space: 'O(V)', stable: true, inPlace: false, recursive: false, parallel: false,
    useCases: ['Negative weight edges', 'Detecting negative cycles', 'Currency arbitrage'],
    pros: ['Handles negative weights', 'Detects negative cycles', 'Simple implementation'],
    cons: ['Slower than Dijkstra', 'O(VE) complexity', 'Not suitable for large graphs'],
    difficulty: 'Hard', realWorldUse: 'BGP routing, financial arbitrage detection',
    color: 'from-orange-500 to-red-600',
  },
  {
    id: 'bfs', name: 'BFS', category: 'Graph',
    timeAvg: 'O(V+E)', timeBest: 'O(1)', timeWorst: 'O(V+E)',
    space: 'O(V)', stable: true, inPlace: false, recursive: false, parallel: false,
    useCases: ['Shortest path (unweighted)', 'Level-order traversal', 'Social network distance'],
    pros: ['Shortest path guarantee', 'Finds all nodes at distance k', 'Non-recursive'],
    cons: ['High memory usage', 'Slow for deep graphs', 'Not suitable for weighted graphs'],
    difficulty: 'Medium', realWorldUse: 'Facebook friend suggestions, web crawlers',
    color: 'from-sky-500 to-blue-600',
  },
  {
    id: 'dfs', name: 'DFS', category: 'Graph',
    timeAvg: 'O(V+E)', timeBest: 'O(1)', timeWorst: 'O(V+E)',
    space: 'O(V)', stable: true, inPlace: false, recursive: true, parallel: false,
    useCases: ['Topological sort', 'Cycle detection', 'Maze solving'],
    pros: ['Low memory for sparse graphs', 'Simpler recursion', 'Good for backtracking'],
    cons: ['No shortest path guarantee', 'Can get stuck in deep paths', 'Stack overflow risk'],
    difficulty: 'Medium', realWorldUse: 'Compiler dependency resolution, puzzle solving',
    color: 'from-teal-500 to-emerald-600',
  },
  // ── Dynamic Programming ──
  {
    id: 'dp_knapsack', name: '0/1 Knapsack (DP)', category: 'Dynamic Programming',
    timeAvg: 'O(nW)', timeBest: 'O(nW)', timeWorst: 'O(nW)',
    space: 'O(nW)', stable: true, inPlace: false, recursive: false, parallel: false,
    useCases: ['Resource allocation', 'Portfolio optimization', 'Cargo loading'],
    pros: ['Optimal solution', 'Avoids recomputation', 'Widely applicable'],
    cons: ['Pseudo-polynomial time', 'High memory usage', 'Not suitable for non-integer weights'],
    difficulty: 'Hard', realWorldUse: 'Budget planning, cryptography (subset-sum)',
    color: 'from-pink-500 to-rose-600',
  },
  {
    id: 'dp_lcs', name: 'LCS (DP)', category: 'Dynamic Programming',
    timeAvg: 'O(mn)', timeBest: 'O(mn)', timeWorst: 'O(mn)',
    space: 'O(mn)', stable: true, inPlace: false, recursive: false, parallel: false,
    useCases: ['Diff utilities', 'DNA alignment', 'Plagiarism detection'],
    pros: ['Optimal', 'Classic DP pattern', 'Exact answer'],
    cons: ['O(mn) space', 'Slow for very long strings', 'No heuristic speedup'],
    difficulty: 'Hard', realWorldUse: 'Git diff, bioinformatics sequence alignment',
    color: 'from-violet-500 to-indigo-600',
  },
  // ── Divide & Conquer ──
  {
    id: 'strassen', name: "Strassen's Matrix", category: 'Divide & Conquer',
    timeAvg: 'O(n^2.81)', timeBest: 'O(n^2.81)', timeWorst: 'O(n^2.81)',
    space: 'O(n²)', stable: true, inPlace: false, recursive: true, parallel: true,
    useCases: ['Large matrix multiplication', 'Scientific computing', 'Graphics transforms'],
    pros: ['Faster than naive O(n³)', 'Recursive decomposition', 'Parallelizable'],
    cons: ['Large constants', 'Numerical instability', 'Complex implementation'],
    difficulty: 'Hard', realWorldUse: 'BLAS libraries, machine learning backends',
    color: 'from-cyan-500 to-indigo-600',
  },
  // ── Greedy ──
  {
    id: 'kruskal', name: "Kruskal's MST", category: 'Greedy',
    timeAvg: 'O(E log E)', timeBest: 'O(E log E)', timeWorst: 'O(E log E)',
    space: 'O(V)', stable: true, inPlace: false, recursive: false, parallel: false,
    useCases: ['Minimum spanning tree', 'Network design', 'Cluster analysis'],
    pros: ['Simple greedy approach', 'Works well for sparse graphs', 'Optimal MST'],
    cons: ['Requires edge sorting', 'Slower than Prim for dense graphs', 'Union-Find overhead'],
    difficulty: 'Medium', realWorldUse: 'Telecoms cable layout, electrical grid design',
    color: 'from-lime-500 to-emerald-600',
  },
  {
    id: 'prim', name: "Prim's MST", category: 'Greedy',
    timeAvg: 'O(E log V)', timeBest: 'O(E log V)', timeWorst: 'O(V²)',
    space: 'O(V)', stable: true, inPlace: false, recursive: false, parallel: false,
    useCases: ['Dense graphs', 'Network wiring', 'Maze generation'],
    pros: ["Better than Kruskal for dense graphs", 'Grows one MST', 'Efficient with heaps'],
    cons: ['Complex with adjacency matrix', 'Not as intuitive as Kruskal'],
    difficulty: 'Medium', realWorldUse: 'Chip design, road network planning',
    color: 'from-amber-500 to-yellow-600',
  },
  // ── String ──
  {
    id: 'kmp', name: 'KMP Search', category: 'String',
    timeAvg: 'O(n+m)', timeBest: 'O(n)', timeWorst: 'O(n+m)',
    space: 'O(m)', stable: true, inPlace: false, recursive: false, parallel: false,
    useCases: ['Pattern matching', 'Text search', 'DNA pattern finding'],
    pros: ['Linear time', 'No backtracking', 'Efficient for repetitive patterns'],
    cons: ['Complex preprocessing', 'Poor cache for short patterns', 'Hard to implement'],
    difficulty: 'Hard', realWorldUse: 'grep, DNA sequencing, text editors',
    color: 'from-fuchsia-500 to-violet-600',
  },
  {
    id: 'rabin', name: 'Rabin-Karp', category: 'String',
    timeAvg: 'O(n+m)', timeBest: 'O(n+m)', timeWorst: 'O(nm)',
    space: 'O(1)', stable: true, inPlace: true, recursive: false, parallel: true,
    useCases: ['Multiple pattern search', 'Plagiarism detection', 'File comparison'],
    pros: ['Handles multiple patterns', 'Rolling hash: fast skip', 'Simple'],
    cons: ['Hash collisions', 'O(nm) worst case', 'Requires good hash function'],
    difficulty: 'Hard', realWorldUse: 'Google Code Jam, antivirus signature matching',
    color: 'from-rose-500 to-orange-600',
  },
  // ── Tree ──
  {
    id: 'avl', name: 'AVL Tree', category: 'Tree',
    timeAvg: 'O(log n)', timeBest: 'O(1)', timeWorst: 'O(log n)',
    space: 'O(n)', stable: true, inPlace: false, recursive: true, parallel: false,
    useCases: ['Frequent lookups', 'Ordered map/set', 'In-memory databases'],
    pros: ['Strictly balanced', 'Guaranteed O(log n)', 'Fast lookups'],
    cons: ['Complex rotations', 'Slower inserts than Red-Black', 'Extra height field'],
    difficulty: 'Hard', realWorldUse: 'Linux process scheduler (historically), compilers',
    color: 'from-sky-500 to-cyan-600',
  },
  {
    id: 'redblack', name: 'Red-Black Tree', category: 'Tree',
    timeAvg: 'O(log n)', timeBest: 'O(1)', timeWorst: 'O(log n)',
    space: 'O(n)', stable: true, inPlace: false, recursive: true, parallel: false,
    useCases: ['Map/Set implementation', 'Interval trees', 'OS scheduler'],
    pros: ['Faster inserts than AVL', 'Well-studied', 'Self-balancing'],
    cons: ['Not as strictly balanced', 'Complex implementation', 'More rotations for search'],
    difficulty: 'Hard', realWorldUse: 'C++ std::map, Java TreeMap, Linux CFS scheduler',
    color: 'from-red-500 to-rose-600',
  },
];

const CATEGORIES = ['All', ...Array.from(new Set(ALGORITHMS.map(a => a.category)))];

const COMPARISON_ROWS: { key: keyof AlgoStats | 'winner'; label: string; icon: React.ReactNode }[] = [
  { key: 'timeAvg',    label: 'Avg Time Complexity',  icon: <Clock className="w-4 h-4" /> },
  { key: 'timeBest',   label: 'Best Case',             icon: <Zap className="w-4 h-4" /> },
  { key: 'timeWorst',  label: 'Worst Case',            icon: <Zap className="w-4 h-4 text-rose-400" /> },
  { key: 'space',      label: 'Space Complexity',      icon: <MemoryStick className="w-4 h-4" /> },
  { key: 'difficulty', label: 'Difficulty',            icon: <Trophy className="w-4 h-4" /> },
  { key: 'realWorldUse', label: 'Real-World Usage',   icon: <CheckCircle className="w-4 h-4" /> },
];

const BOOL_ROWS: { key: keyof AlgoStats; label: string }[] = [
  { key: 'stable',    label: 'Stable' },
  { key: 'inPlace',   label: 'In-Place' },
  { key: 'recursive', label: 'Recursive' },
  { key: 'parallel',  label: 'Parallelizable' },
];

// Heuristic: lower is "faster" (used for determining winner)
const COMPLEXITY_SCORE: Record<string, number> = {
  'O(1)': 1, 'O(log n)': 2, 'O(n)': 3, 'O(n log n)': 4,
  'O(nk)': 4.5, 'O(n+k)': 3.5, 'O(E log E)': 4, 'O(E log V)': 4,
  'O((V+E) log V)': 5, 'O(V+E)': 3, 'O(n²)': 6, 'O(VE)': 7,
  'O(nW)': 6, 'O(mn)': 6, "O(n^2.81)": 5.5, 'O(n+m)': 3,
};

function getScore(c: string) { return COMPLEXITY_SCORE[c] ?? 5; }

function DiffBadge({ diff }: { diff: AlgoStats['difficulty'] }) {
  const map = { Easy: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20', Medium: 'text-amber-400 bg-amber-500/10 border-amber-500/20', Hard: 'text-rose-400 bg-rose-500/10 border-rose-500/20' };
  return <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${map[diff]}`}>{diff}</span>;
}

function AlgoCard({
  algo, side, selected, onChange, categoryFilter,
}: {
  algo: AlgoStats | null; side: 'left' | 'right'; selected: string;
  onChange: (id: string) => void; categoryFilter: string;
}) {
  const [open, setOpen] = useState(false);
  const filtered = categoryFilter === 'All' ? ALGORITHMS : ALGORITHMS.filter(a => a.category === categoryFilter);
  const color = side === 'left' ? 'from-indigo-500 to-blue-600' : 'from-emerald-500 to-teal-600';
  const label = side === 'left' ? 'Player 1' : 'Player 2';
  const textColor = side === 'left' ? 'text-indigo-400' : 'text-emerald-400';

  return (
    <div className="flex-1 min-w-0">
      <h3 className={`text-lg font-black ${textColor} mb-3 text-center`}>{label}</h3>

      {/* Custom Select */}
      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          className={`w-full flex items-center justify-between px-4 py-3 rounded-xl bg-slate-800/80 border ${
            algo ? `border-slate-600 ring-2 ring-offset-0` : 'border-slate-700'
          } text-white font-bold text-sm transition-all hover:border-slate-500`}
          style={algo ? { borderColor: 'rgba(99,102,241,0.4)' } : {}}
        >
          <span className={algo ? 'text-white' : 'text-slate-400'}>
            {algo ? algo.name : 'Choose Algorithm…'}
          </span>
          <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.97 }}
              transition={{ duration: 0.15 }}
              className="absolute z-50 top-full mt-2 w-full bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden max-h-72 overflow-y-auto custom-scrollbar"
            >
              {Object.entries(
                filtered.reduce((acc, a) => {
                  if (!acc[a.category]) acc[a.category] = [];
                  acc[a.category].push(a);
                  return acc;
                }, {} as Record<string, AlgoStats[]>)
              ).map(([cat, algos]) => (
                <div key={cat}>
                  <div className="px-3 py-1.5 text-[10px] font-black text-slate-500 uppercase tracking-widest bg-slate-800/50 sticky top-0">
                    {cat}
                  </div>
                  {algos.map(a => (
                    <button
                      key={a.id}
                      onClick={() => { onChange(a.id); setOpen(false); }}
                      className={`w-full text-left px-4 py-2.5 text-sm font-semibold transition-colors flex items-center justify-between ${
                        selected === a.id
                          ? 'bg-indigo-500/20 text-indigo-300'
                          : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      {a.name}
                      <DiffBadge diff={a.difficulty} />
                    </button>
                  ))}
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Selected algo preview chip */}
      {algo && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mt-3 p-3 rounded-xl bg-gradient-to-br ${algo.color} bg-opacity-10 border border-white/10`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-black text-white">{algo.category}</span>
            <DiffBadge diff={algo.difficulty} />
          </div>
          <p className="text-xs text-white/70 line-clamp-2">{algo.realWorldUse}</p>
        </motion.div>
      )}
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────────
export default function Battle() {
  const [leftId, setLeftId] = useState('quicksort');
  const [rightId, setRightId] = useState('mergesort');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [running, setRunning] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const left = ALGORITHMS.find(a => a.id === leftId) ?? null;
  const right = ALGORITHMS.find(a => a.id === rightId) ?? null;

  const leftScore = left ? getScore(left.timeAvg) : 99;
  const rightScore = right ? getScore(right.timeAvg) : 99;
  const winner = leftScore < rightScore ? 'left' : rightScore < leftScore ? 'right' : 'tie';

  const startBattle = () => {
    setShowResult(false);
    setRunning(true);
    setTimeout(() => {
      setRunning(false);
      setShowResult(true);
    }, 2200);
  };

  return (
    <div className="h-full overflow-y-auto custom-scrollbar pb-24 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* ── Header ── */}
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="relative">
            <Swords className="w-14 h-14 text-rose-500 drop-shadow-[0_0_20px_rgba(244,63,94,0.6)]" />
            <motion.div
              className="absolute inset-0 rounded-full bg-rose-500/20 blur-xl"
              animate={{ scale: [1, 1.4, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </div>
        <h2 className="text-5xl font-black text-white mb-2">
          Algorithm <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-indigo-400">Battle Arena</span>
        </h2>
        <p className="text-slate-400 text-base max-w-xl mx-auto">
          Pick two algorithms, hit FIGHT, and get a side-by-side performance breakdown with a declared winner.
        </p>
      </div>

      {/* ── Category Filter ── */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-all ${
              categoryFilter === cat
                ? 'bg-rose-500 text-white border-rose-500 shadow-lg shadow-rose-500/30'
                : 'bg-slate-900/50 text-slate-400 border-slate-700/50 hover:border-slate-500 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ── Selector Panel ── */}
      <div className="glass-panel p-6 mb-8 border border-slate-700/50">
        <div className="flex items-start gap-6">
          {/* Player 1 */}
          <AlgoCard
            algo={left} side="left" selected={leftId}
            onChange={setLeftId} categoryFilter={categoryFilter}
          />

          {/* VS Divider */}
          <div className="flex flex-col items-center justify-center pt-8 flex-shrink-0">
            <motion.div
              animate={{ scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-4xl font-black bg-gradient-to-b from-rose-400 to-indigo-400 bg-clip-text text-transparent select-none"
            >
              VS
            </motion.div>
          </div>

          {/* Player 2 */}
          <AlgoCard
            algo={right} side="right" selected={rightId}
            onChange={setRightId} categoryFilter={categoryFilter}
          />
        </div>
      </div>

      {/* ── FIGHT Button ── */}
      <div className="flex justify-center mb-10">
        <motion.button
          onClick={startBattle}
          disabled={running || !left || !right || leftId === rightId}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-3 px-12 py-5 bg-gradient-to-r from-rose-500 via-pink-500 to-indigo-600 rounded-full text-2xl font-black text-white shadow-2xl shadow-rose-500/40 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {running ? (
            <motion.div className="flex items-center gap-3">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
              >
                <Swords className="w-7 h-7" />
              </motion.div>
              Simulating Battle…
            </motion.div>
          ) : (
            <>
              <Play className="w-7 h-7" fill="currentColor" /> ⚔️ FIGHT!
            </>
          )}
        </motion.button>
        {leftId === rightId && (
          <p className="text-rose-400 text-xs text-center mt-2 absolute translate-y-16">Pick two different algorithms to battle!</p>
        )}
      </div>

      {/* ── Comparison Table ── */}
      <AnimatePresence>
        {showResult && left && right && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            {/* Winner Banner */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: 'spring', damping: 14 }}
              className="text-center mb-8"
            >
              {winner === 'tie' ? (
                <div className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-slate-800 border border-slate-600">
                  <span className="text-3xl">🤝</span>
                  <span className="text-2xl font-black text-slate-300">It's a Tie!</span>
                </div>
              ) : (
                <div className={`inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r ${
                  winner === 'left' ? left.color : right.color
                } shadow-2xl`}>
                  <Crown className="w-8 h-8 text-white drop-shadow" />
                  <div className="text-left">
                    <p className="text-xs font-bold text-white/70 uppercase tracking-widest">Winner by Avg Complexity</p>
                    <p className="text-2xl font-black text-white">
                      {winner === 'left' ? left.name : right.name}
                    </p>
                  </div>
                </div>
              )}
            </motion.div>

            {/* ── Comparison Table ── */}
            <div className="glass-panel overflow-hidden border border-slate-700/50">
              {/* Table Header: Algorithm Names */}
              <div className="grid grid-cols-[1fr_1fr_1fr] border-b border-slate-700/50">
                <div className="p-4 text-xs font-black text-slate-500 uppercase tracking-widest">Metric</div>
                <div className={`p-5 text-center border-l border-slate-700/50 bg-gradient-to-br ${left.color} bg-opacity-10 relative`}>
                  {winner === 'left' && (
                    <Crown className="w-5 h-5 text-yellow-400 absolute top-2 right-2 drop-shadow" />
                  )}
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r ${left.color} mb-2`}>
                    <span className="text-xs font-black text-white">{left.category}</span>
                  </div>
                  <h3 className="text-xl font-black text-white">{left.name}</h3>
                  <DiffBadge diff={left.difficulty} />
                </div>
                <div className={`p-5 text-center border-l border-slate-700/50 bg-gradient-to-bl ${right.color} bg-opacity-10 relative`}>
                  {winner === 'right' && (
                    <Crown className="w-5 h-5 text-yellow-400 absolute top-2 right-2 drop-shadow" />
                  )}
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r ${right.color} mb-2`}>
                    <span className="text-xs font-black text-white">{right.category}</span>
                  </div>
                  <h3 className="text-xl font-black text-white">{right.name}</h3>
                  <DiffBadge diff={right.difficulty} />
                </div>
              </div>

              {/* Complexity Rows */}
              {COMPARISON_ROWS.map((row, idx) => {
                const lVal = String(left[row.key as keyof AlgoStats]);
                const rVal = String(right[row.key as keyof AlgoStats]);
                const lScore = getScore(lVal);
                const rScore = getScore(rVal);
                const lWins = lScore < rScore;
                const rWins = rScore < lScore;

                return (
                  <motion.div
                    key={row.key}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * idx + 0.3 }}
                    className={`grid grid-cols-[1fr_1fr_1fr] border-b border-slate-800/70 ${idx % 2 === 0 ? 'bg-slate-900/20' : ''}`}
                  >
                    {/* Metric Label */}
                    <div className="p-4 flex items-center gap-2 text-slate-400 text-sm font-semibold">
                      <span className="text-slate-500">{row.icon}</span>
                      {row.label}
                    </div>

                    {/* Left Value */}
                    <div className={`p-4 border-l border-slate-800/70 text-center flex flex-col items-center justify-center gap-1 ${lWins ? 'bg-indigo-500/5' : ''}`}>
                      <span className={`font-black text-base ${lWins ? 'text-indigo-300' : 'text-slate-300'}`}>
                        {lVal}
                      </span>
                      {lWins && <span className="text-[10px] text-indigo-400 font-bold tracking-widest uppercase">✦ Better</span>}
                    </div>

                    {/* Right Value */}
                    <div className={`p-4 border-l border-slate-800/70 text-center flex flex-col items-center justify-center gap-1 ${rWins ? 'bg-emerald-500/5' : ''}`}>
                      <span className={`font-black text-base ${rWins ? 'text-emerald-300' : 'text-slate-300'}`}>
                        {rVal}
                      </span>
                      {rWins && <span className="text-[10px] text-emerald-400 font-bold tracking-widest uppercase">✦ Better</span>}
                    </div>
                  </motion.div>
                );
              })}

              {/* Boolean Property Rows */}
              <div className={`grid grid-cols-[1fr_1fr_1fr] border-b border-slate-800/70 bg-slate-900/30`}>
                <div className="p-4 text-xs font-black text-slate-500 uppercase tracking-widest self-center">Properties</div>
                <div className="p-4 border-l border-slate-800/70 space-y-2">
                  {BOOL_ROWS.map(r => (
                    <div key={r.key} className="flex items-center justify-between">
                      <span className="text-xs text-slate-400">{r.label}</span>
                      {left[r.key as keyof AlgoStats]
                        ? <CheckCircle className="w-4 h-4 text-emerald-400" />
                        : <XCircle className="w-4 h-4 text-rose-400/50" />}
                    </div>
                  ))}
                </div>
                <div className="p-4 border-l border-slate-800/70 space-y-2">
                  {BOOL_ROWS.map(r => (
                    <div key={r.key} className="flex items-center justify-between">
                      <span className="text-xs text-slate-400">{r.label}</span>
                      {right[r.key as keyof AlgoStats]
                        ? <CheckCircle className="w-4 h-4 text-emerald-400" />
                        : <XCircle className="w-4 h-4 text-rose-400/50" />}
                    </div>
                  ))}
                </div>
              </div>

              {/* Use Cases */}
              <div className="grid grid-cols-[1fr_1fr_1fr]">
                <div className="p-4 text-xs font-black text-slate-500 uppercase tracking-widest self-start pt-5">Best Use Cases</div>
                <div className="p-4 border-l border-slate-800/70 space-y-1.5">
                  {left.useCases.map(u => (
                    <div key={u} className="flex items-start gap-1.5 text-xs text-slate-300">
                      <span className="text-indigo-400 mt-0.5">▸</span> {u}
                    </div>
                  ))}
                </div>
                <div className="p-4 border-l border-slate-800/70 space-y-1.5">
                  {right.useCases.map(u => (
                    <div key={u} className="flex items-start gap-1.5 text-xs text-slate-300">
                      <span className="text-emerald-400 mt-0.5">▸</span> {u}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Pros & Cons side by side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">
              {[left, right].map((algo, i) => (
                <motion.div
                  key={algo.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + i * 0.1 }}
                  className="glass-panel p-5 border border-slate-700/50"
                >
                  <h4 className={`font-black text-base mb-4 flex items-center gap-2 ${i === 0 ? 'text-indigo-300' : 'text-emerald-300'}`}>
                    <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${algo.color}`} />
                    {algo.name} — Pros & Cons
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-2">✓ Pros</p>
                      {algo.pros.map(p => (
                        <div key={p} className="flex items-start gap-1.5 mb-1.5">
                          <CheckCircle className="w-3 h-3 text-emerald-400 mt-0.5 flex-shrink-0" />
                          <span className="text-xs text-slate-300">{p}</span>
                        </div>
                      ))}
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest mb-2">✗ Cons</p>
                      {algo.cons.map(c => (
                        <div key={c} className="flex items-start gap-1.5 mb-1.5">
                          <XCircle className="w-3 h-3 text-rose-400 mt-0.5 flex-shrink-0" />
                          <span className="text-xs text-slate-300">{c}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

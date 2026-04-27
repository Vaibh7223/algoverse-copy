import React, { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, Timer, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DB_QUESTIONS = [
  { q: "Which algorithm uses a divide and conquer approach to sort elements?", options: ["Bubble Sort", "Insertion Sort", "Merge Sort", "Selection Sort"], correct: 2 },
  { q: "What is the worst-case time complexity of Quick Sort?", options: ["O(N)", "O(N log N)", "O(N^2)", "O(log N)"], correct: 2 },
  { q: "Which data structure is fundamentally used for BFS (Breadth-First Search)?", options: ["Stack", "Queue", "Heap", "Tree"], correct: 1 },
  { q: "Dijkstra's Algorithm fails if the graph contains:", options: ["Cycles", "Negative edge weights", "Directed edges", "Thousands of nodes"], correct: 1 },
  { q: "Which traversal of a Binary Search Tree outputs values in sorted order?", options: ["Pre-order", "In-order", "Post-order", "Level-order"], correct: 1 },
  { q: "What is the time complexity of Binary Search?", options: ["O(N)", "O(N^2)", "O(1)", "O(log N)"], correct: 3 },
  { q: "Dynamic Programming significantly improves efficiency by:", options: ["Increasing recursion depth", "Memoizing overlapping subproblems", "Using random pivots", "Eliminating loops"], correct: 1 },
  { q: "Which greedy algorithm is used for lossless data compression?", options: ["Kruskal's", "Prim's", "Huffman Coding", "Fractional Knapsack"], correct: 2 },
  { q: "The Floyd-Warshall algorithm is used to find:", options: ["All-pairs shortest paths", "Minimum spanning tree", "Max flow in a network", "Strongly connected components"], correct: 0 },
  { q: "Backtracking algorithms typically construct a:", options: ["Hash table", "State-space tree", "Linked list", "Fibonacci sequence"], correct: 1 },
  { q: "Which sorting algorithm is heavily reliant on a priority queue?", options: ["Quick Sort", "Heap Sort", "Merge Sort", "Radix Sort"], correct: 1 },
  { q: "What is the optimal substructure property?", options: ["Optimal solutions can be constructed from optimal subproblem solutions", "It uses the absolute minimum memory", "A tree must be perfectly balanced", "Arrays must be contiguous"], correct: 0 },
  { q: "NP-Complete problems are uniquely defined as:", options: ["Polynomial time verifiable but not solvable in polynomial time", "Impossible to solve", "Solvable in O(1)", "Trivially simple"], correct: 0 },
  { q: "In the 0/1 Knapsack problem, the '0/1' indicates:", options: ["Only binary inputs occur", "Items cannot be broken into fractions", "Prices are either 0 or 1", "The backpack holds 1 item"], correct: 1 },
  { q: "Which graph coloring problem relies heavily on Backtracking?", options: ["M-Coloring Problem", "Dijkstra Vertex", "Eulerian Map", "TSP Approach"], correct: 0 },
  { q: "To solve the N-Queens problem efficiently, we implement:", options: ["Greedy Choice", "Backtracking", "Dynamic Programming", "Dijkstra traversal"], correct: 1 },
  { q: "Which algorithmic paradigm is represented by Prim's Minimum Spanning Tree?", options: ["Divide and Conquer", "Dynamic Programming", "Greedy Algorithm", "Backtracking"], correct: 2 },
  { q: "What data structure does Kruskal's algorithm strictly require to prevent cycles?", options: ["Disjoint-set (Union-Find)", "Min-Heap", "Maximum Array", "Hash Map"], correct: 0 },
  { q: "Which of the following sorting algorithms is inherently STABLE?", options: ["Quick Sort", "Selection Sort", "Merge Sort", "Heap Sort"], correct: 2 },
  { q: "A completely unbalanced binary search tree acts like a:", options: ["Hash map", "Heap", "Linked List", "Graph"], correct: 2 }
];

const generateMockQuestions = (topic: string) => {
  // We use the exact 20 distinct DB questions and append a bit of 'topic' flair to the first one just to keep the routing relevance logic visible.
  return DB_QUESTIONS.map((data, i) => ({
    id: i,
    question: `[${i === 0 ? topic : 'Algorithms'}] ${data.q}`,
    options: data.options,
    correct: data.correct,
  }));
};

export default function Quiz({ courseId }: { courseId: string }) {
  const [questions] = useState(generateMockQuestions(courseId));
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15);

  useEffect(() => {
    if (submitted) return;

    if (timeLeft <= 0) {
      handleNext();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, submitted]);

  const handleSelect = (optIdx: number) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [questions[currentIdx].id]: optIdx }));
    // Wait briefly to show selection then move
    setTimeout(() => {
      handleNext();
    }, 500);
  };

  const handleNext = () => {
    if (currentIdx >= questions.length - 1) {
      setSubmitted(true);
      localStorage.setItem(`quiz_score_${courseId}`, calculateScore().toString());
    } else {
      setCurrentIdx(prev => prev + 1);
      setTimeLeft(15);
    }
  };

  const calculateScore = () => {
    let score = 0;
    questions.forEach(q => {
      if (answers[q.id] === q.correct) score++;
    });
    return score;
  };

  if (submitted) {
    return (
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-panel p-10 text-center space-y-6 max-w-2xl mx-auto border-indigo-500/30">
        <div className="w-20 h-20 bg-indigo-500 rounded-full flex items-center justify-center mx-auto shadow-[0_0_40px_rgba(99,102,241,0.5)]">
           <CheckCircle2 className="w-10 h-10 text-white" />
        </div>
        <h3 className="text-4xl font-black text-white">Quiz Completed!</h3>
        <p className="text-slate-400 text-lg">Course: {courseId}</p>
        <div className="p-8 bg-slate-900 border border-slate-700 rounded-2xl">
          <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-2">Final Score</p>
          <p className="text-6xl font-black text-white">{calculateScore()}<span className="text-3xl text-slate-500">/{questions.length}</span></p>
        </div>
      </motion.div>
    );
  }

  const q = questions[currentIdx];

  return (
    <div className="glass-panel p-6 sm:p-10 max-w-3xl mx-auto overflow-hidden relative">
      {/* Progress & Timer Header */}
      <div className="flex justify-between items-end mb-8 border-b border-slate-700/50 pb-6">
        <div>
          <p className="text-xs font-bold text-indigo-400 tracking-wider uppercase mb-1">Question {currentIdx + 1} of {questions.length}</p>
          <div className="flex gap-1 h-1.5 mt-2">
            {questions.map((_, i) => (
              <div key={i} className={`w-8 h-full rounded-full ${i < currentIdx ? 'bg-indigo-500' : i === currentIdx ? 'bg-amber-400' : 'bg-slate-800'}`} />
            ))}
          </div>
        </div>
        
        <div className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold font-mono text-xl ${timeLeft <= 5 ? 'bg-rose-500/20 text-rose-400 animate-pulse' : 'bg-slate-800 text-amber-400'}`}>
          {timeLeft <= 5 ? <AlertCircle className="w-5 h-5" /> : <Timer className="w-5 h-5" />}
          00:{timeLeft.toString().padStart(2, '0')}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div 
          key={currentIdx}
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -50, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="space-y-8"
        >
          <h4 className="text-2xl font-semibold text-slate-200 leading-relaxed">
            {q.question}
          </h4>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {q.options.map((opt, optIdx) => {
              const isSelected = answers[q.id] === optIdx;
              
              return (
                <button
                  key={optIdx}
                  onClick={() => handleSelect(optIdx)}
                  className={`text-left px-6 py-5 rounded-xl transition-all border-2 flex justify-between items-center ${
                    isSelected 
                      ? "bg-indigo-500 border-indigo-400 text-white shadow-lg shadow-indigo-500/30 scale-[1.02]" 
                      : "bg-slate-800 border-transparent hover:border-slate-600 text-slate-300 hover:bg-slate-700"
                  }`}
                >
                  <span className="font-medium text-lg">{opt}</span>
                </button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

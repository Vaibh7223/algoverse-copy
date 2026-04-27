import React from 'react';
import { motion } from 'framer-motion';

interface AlgoPreviewVisualizerProps {
  algoName: string;
}

const AlgoPreviewVisualizer: React.FC<AlgoPreviewVisualizerProps> = ({ algoName }) => {
  const name = algoName.toLowerCase();

  // 1. Sorting Visualizer (Bars)
  if (name.includes('sort')) {
    const bars = [40, 70, 30, 90, 50, 80, 20];
    return (
      <div className="h-32 flex items-end justify-center gap-1.5 p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
        {bars.map((h, i) => (
          <motion.div
            key={i}
            initial={{ height: 0 }}
            animate={{ 
              height: `${h}%`,
              backgroundColor: i === (Date.now() % bars.length) ? '#818cf8' : '#334155'
            }}
            transition={{ 
              duration: 0.5, 
              delay: i * 0.1,
              repeat: Infinity,
              repeatType: 'reverse'
            }}
            className="w-3 rounded-t-sm"
          />
        ))}
      </div>
    );
  }

  // 2. Binary Search (Scanning Array)
  if (name.includes('binary search')) {
    return (
      <div className="h-32 flex items-center justify-center gap-2 p-4 bg-slate-900/50 rounded-xl border border-slate-700/50 overflow-hidden">
        {[10, 20, 30, 40, 50, 60, 70].map((val, i) => (
          <motion.div
            key={i}
            animate={{
              scale: [1, 1.2, 1],
              borderColor: i === 3 ? '#818cf8' : '#334155',
              backgroundColor: i === 3 ? 'rgba(129, 140, 248, 0.1)' : 'transparent'
            }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
            className="w-10 h-10 flex items-center justify-center border rounded-lg text-[10px] font-bold text-slate-500"
          >
            {val}
          </motion.div>
        ))}
        <motion.div 
          animate={{ x: [-100, 0, 100], opacity: [0, 1, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute w-1 h-12 bg-indigo-500/50 blur-sm"
        />
      </div>
    );
  }

  // 3. Graph Visualizer (Nodes & Edges - Dijkstra, Prim, etc.)
  if (name.includes('dijkstra') || name.includes('kruskal') || name.includes('prim') || name.includes('graph') || name.includes('cycle') || name.includes('flow')) {
    const nodes = [
      { x: 30, y: 30 }, { x: 70, y: 20 }, { x: 80, y: 70 }, { x: 20, y: 80 }, { x: 50, y: 50 }
    ];
    return (
      <div className="h-32 relative bg-slate-900/50 rounded-xl border border-slate-700/50 overflow-hidden">
        <svg className="w-full h-full p-4">
          {/* Edges */}
          <motion.line x1="30%" y1="30%" x2="50%" y2="50%" stroke="#334155" strokeWidth="1" />
          <motion.line x1="70%" y1="20%" x2="50%" y2="50%" stroke="#334155" strokeWidth="1" />
          <motion.line x1="80%" y1="70%" x2="50%" y2="50%" stroke="#334155" strokeWidth="1" />
          <motion.line x1="20%" y1="80%" x2="50%" y2="50%" stroke="#334155" strokeWidth="1" />
          
          <motion.line 
            x1="30%" y1="30%" x2="50%" y2="50%" 
            stroke="#818cf8" strokeWidth="2" 
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, repeat: Infinity }}
          />

          {/* Nodes */}
          {nodes.map((n, i) => (
            <motion.circle
              key={i}
              cx={`${n.x}%`}
              cy={`${n.y}%`}
              r="6"
              fill={i === 4 ? '#818cf8' : '#1e293b'}
              stroke="#334155"
              strokeWidth="1"
              animate={{ r: i === 4 ? [6, 8, 6] : 6 }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          ))}
        </svg>
      </div>
    );
  }

  // 4. Dynamic Programming (Grid/Matrix)
  if (name.includes('knapsack') || name.includes('matrix') || name.includes('chain') || name.includes('floyd') || name.includes('multistage')) {
    return (
      <div className="h-32 grid grid-cols-5 grid-rows-3 gap-1 p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
        {Array.from({ length: 15 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0.3 }}
            animate={{ 
              opacity: [0.3, 1, 0.3],
              backgroundColor: i < (Date.now() % 15) ? 'rgba(129, 140, 248, 0.2)' : 'transparent',
              borderColor: i < (Date.now() % 15) ? '#818cf8' : '#334155'
            }}
            transition={{ duration: 2, delay: i * 0.1, repeat: Infinity }}
            className="border border-slate-700 rounded-sm"
          />
        ))}
      </div>
    );
  }

  // 5. Tree/Backtracking (N-Queens, Hamiltonian)
  if (name.includes('queen') || name.includes('backtracking') || name.includes('tree') || name.includes('coloring') || name.includes('bound')) {
     return (
      <div className="h-32 flex flex-col items-center justify-center bg-slate-900/50 rounded-xl border border-slate-700/50 p-4">
        <div className="grid grid-cols-4 grid-rows-4 gap-1 w-24 h-24 border border-slate-700 p-1">
          {Array.from({ length: 16 }).map((_, i) => (
            <motion.div
              key={i}
              animate={{
                backgroundColor: [
                  'transparent', 
                  (i === 2 || i === 7 || i === 8 || i === 13) ? 'rgba(244, 63, 94, 0.4)' : 'transparent',
                  'transparent'
                ]
              }}
              transition={{ duration: 3, repeat: Infinity, delay: (i % 4) * 0.5 }}
              className="w-full h-full border border-slate-800/50 rounded-[2px]"
            />
          ))}
        </div>
      </div>
    );
  }

  // Generic Pulse for others
  return (
    <div className="h-32 flex items-center justify-center p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
      <motion.div
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.5, 1, 0.5],
          rotate: [0, 90, 180, 270, 360]
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        className="w-12 h-12 border-2 border-dashed border-indigo-500/50 rounded-full flex items-center justify-center"
      >
        <div className="w-6 h-6 bg-indigo-500 rounded-full blur-[2px]" />
      </motion.div>
    </div>
  );
};

export default AlgoPreviewVisualizer;

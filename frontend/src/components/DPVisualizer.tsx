import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';

export default function DPVisualizer({ algoName = "DP", dataSize = 6, generationTrigger = 0 }: { algoName?: string, dataSize?: number, generationTrigger?: number }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeCell, setActiveCell] = useState<[number, number] | null>(null);
  const [visited, setVisited] = useState<string[]>([]);
  
  const ROWS = Math.max(3, Math.min(12, Math.floor(dataSize)));
  const COLS = Math.max(4, Math.min(16, ROWS + 2));

  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | undefined;
    if (isPlaying) {
      timer = setInterval(() => {
        setActiveCell(prev => {
          let r = prev ? prev[0] : 0;
          let c = prev ? prev[1] : 0;
          
          if(prev) {
             c++;
             if(c >= COLS) { c = 1; r++; }
          } else {
             r = 1; c = 1;
          }

          if (r >= ROWS) {
            setIsPlaying(false);
            return prev;
          }

          setVisited(v => [...new Set([...v, `${r}-${c}`])]);
          return [r, c];
        });
      }, 400);
    }
    if (!timer) return;
    return () => clearInterval(timer);
  }, [isPlaying]);

  const handleReset = () => {
    setActiveCell(null);
    setVisited([]);
    setIsPlaying(false);
  };

  // Handle Video Generation Trigger
  useEffect(() => {
    if (generationTrigger > 0) {
      handleReset();
      setTimeout(() => setIsPlaying(true), 200);
    }
  }, [generationTrigger]);

  return (
    <div className="flex flex-col h-full gap-6">
      <div className="flex items-center justify-between glass-panel p-4">
        <div>
           <h3 className="text-xl font-bold text-white mb-1">{algoName} Table Filling</h3>
           <p className="text-slate-400 text-sm">Simulating state memoization matrix</p>
        </div>
      </div>

      <div className="flex-1 glass-panel flex items-center justify-center p-8 relative overflow-hidden min-h-[400px]">
         <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))` }}>
            {Array.from({ length: ROWS }).map((_, r) => (
               Array.from({ length: COLS }).map((_, c) => {
                 const isBaseCase = r === 0 || c === 0;
                 const isActive = activeCell?.[0] === r && activeCell?.[1] === c;
                 const isVisited = visited.includes(`${r}-${c}`);
                 
                 let bgClass = "bg-slate-800 border-slate-700/50";
                 if (isBaseCase) bgClass = "bg-slate-950 border-emerald-500/30 text-emerald-500/50";
                 if (isVisited && !isBaseCase) bgClass = "bg-indigo-500/20 border-indigo-500/40 text-indigo-200";
                 if (isActive) bgClass = "bg-pink-500 shadow-[0_0_20px_rgba(236,72,153,0.5)] border-pink-400 text-white z-10 scale-110";

                 return (
                   <motion.div 
                     layout
                     key={`${r}-${c}`} 
                     className={`w-10 h-10 md:w-14 md:h-14 flex items-center justify-center font-mono text-xs md:text-sm font-bold border rounded-lg transition-all duration-300 ${bgClass}`}
                   >
                      {isBaseCase ? '0' : (isVisited ? (r*c).toString() : '')}
                   </motion.div>
                 );
               })
            ))}
         </div>
      </div>

      <div className="glass-panel p-4 flex items-center justify-center gap-6">
        <button onClick={handleReset} className="w-12 h-12 flex items-center justify-center rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors">
          <RotateCcw className="w-5 h-5" />
        </button>
        <button onClick={() => setIsPlaying(!isPlaying)} className="w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-lg hover:scale-105 transition-all">
          {isPlaying ? <Pause className="fill-current w-6 h-6" /> : <Play className="fill-current w-6 h-6 ml-1" />}
        </button>
      </div>
    </div>
  );
}

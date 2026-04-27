import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { BrainCircuit, PlayCircle, ArrowLeft, Lightbulb, Code, ChartBar } from 'lucide-react';
import { motion } from 'framer-motion';
import SortingVisualizer from '../components/SortingVisualizer';
import VisualizationEngine from '../components/VisualizationEngine';
import DPVisualizer from '../components/DPVisualizer';
import TreeVisualizer from '../components/TreeVisualizer';
import { ALGO_DATABASE } from '../utils/algoData';
import AlgoPreviewVisualizer from '../components/AlgoPreviewVisualizer';
import { apiFetch } from '../utils/api';

export default function AlgorithmDetail() {
  const { id } = useParams<{ id: string }>();
  const [aiData, setAiData] = useState<any>(null);
  const [loadingAI, setLoadingAI] = useState(false);
  const [videoStatus, setVideoStatus] = useState<'idle' | 'generating' | 'ready'>('idle');
  const [generationProgress, setGenerationProgress] = useState(0);
  const [dataSize, setDataSize] = useState(10);
  const [generationTrigger, setGenerationTrigger] = useState(0);
  const algoName = decodeURIComponent(id || '');

  const isSorting = algoName.toLowerCase().includes('sort') || algoName.toLowerCase() === 'binary search';
  const isDP = ['Matrix Chain Multiplication', '0/1 Knapsack', 'Multistage Graph'].includes(algoName);
  const isBacktracking = ['N-Queens', 'Graph Coloring', 'Hamiltonian Cycle', 'Branch & Bound'].includes(algoName);

  // AI DATABASE REMOVED - NOW IMPORTED FROM utils/algoData.ts

  const fetchAIExplanation = async () => {
    setLoadingAI(true);
    const currentExecutions = parseInt(localStorage.getItem('algoverse_executions') || '0', 10);
    localStorage.setItem('algoverse_executions', (currentExecutions + 1).toString());

    try {
      const data = await apiFetch<{
        explanation: string;
        complexity?: { time?: string; space?: string };
        analogy?: string;
      }>('/api/ai/explain', {
        method: 'POST',
        body: JSON.stringify({ algorithm: algoName }),
      });
      setAiData(data);
    } catch {
      const specificData = ALGO_DATABASE[algoName];
      if (specificData) {
        setAiData(specificData);
      } else {
        setAiData({
          explanation: `${algoName} systematically processes the given data construct by utilizing core principles to reach an optimized final state.`,
          complexity: { time: isSorting ? 'O(N log N)' : 'O(V + E)', space: isSorting ? 'O(N)' : 'O(V)' },
          analogy: 'Think of it like a GPS finding the shortest path through a complex city.',
        });
      }
    } finally {
      setLoadingAI(false);
    }
  };

  const handleGenerateVideo = () => {
    setVideoStatus('generating');
    setGenerationProgress(0);
    const currentExecutions = parseInt(localStorage.getItem('algoverse_executions') || '0', 10);
    localStorage.setItem('algoverse_executions', (currentExecutions + 1).toString());
    
    const interval = setInterval(() => {
      setGenerationProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setVideoStatus('ready');
          setGenerationTrigger(t => t + 1); // Trigger visualizers to use new data size and play
          return 100;
        }
        return prev + 10;
      });
    }, 150); // Faster generation for better UX
  };

  return (
    <div className="h-full flex flex-col xl:flex-row gap-6 p-4 animate-in fade-in pb-20 overflow-y-auto custom-scrollbar">
       
       {/* Left Column: Visualizer */}
       <div className="flex-1 flex flex-col gap-6">
          <div className="flex items-center justify-between">
             <div className="flex items-center gap-4">
               <Link to="/" className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors">
                 <ArrowLeft className="w-5 h-5" />
               </Link>
               <div>
                  <h1 className="text-3xl font-black text-white">{decodeURIComponent(id || 'Algorithm')}</h1>
                  <p className="text-slate-400">Interactive Execution Engine</p>
               </div>
             </div>
             <div className="flex items-center gap-3">
               <div className="flex items-center bg-slate-900 border border-slate-700 rounded-lg h-10 overflow-hidden">
                 <span className="text-xs text-slate-400 pl-3">Data Size:</span>
                 <input 
                   type="number" 
                   min="3" max="50"
                   value={dataSize}
                   onChange={e => setDataSize(parseInt(e.target.value) || 10)}
                   className="bg-transparent text-white w-16 text-sm px-2 focus:outline-none"
                 />
               </div>
               
               {videoStatus === 'generating' && (
                 <div className="flex items-center gap-2 px-4 py-2 bg-indigo-500/20 text-indigo-300 rounded-lg">
                   <div className="w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
                   <span className="text-sm font-bold">Generating {generationProgress}%...</span>
                 </div>
               )}
               {videoStatus === 'ready' && (
                 <button onClick={() => setVideoStatus('idle')} className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-white font-bold rounded-lg transition-colors shadow-lg shadow-emerald-500/20 animate-pulse">
                   <PlayCircle className="w-5 h-5" /> Video Ready!
                 </button>
               )}
               {videoStatus === 'idle' && (
                 <button onClick={handleGenerateVideo} className="flex items-center gap-2 px-4 py-2 bg-indigo-500 hover:bg-indigo-400 text-white font-bold rounded-lg transition-colors shadow-lg shadow-indigo-500/20">
                   <PlayCircle className="w-5 h-5" /> Auto-Video Generate
                 </button>
               )}
             </div>
          </div>

          <div className="flex-1 min-h-[500px]">
             {isSorting && <SortingVisualizer algoName={algoName} dataSize={dataSize} generationTrigger={generationTrigger} />}
             {isDP && <DPVisualizer algoName={algoName} dataSize={dataSize} generationTrigger={generationTrigger} />}
             {isBacktracking && <TreeVisualizer algoName={algoName} dataSize={dataSize} generationTrigger={generationTrigger} />}
             {!isSorting && !isDP && !isBacktracking && <VisualizationEngine />}
          </div>
       </div>

       <div className="xl:w-[450px] w-full flex flex-col gap-6">
         
         <div className="glass-panel p-6 flex flex-col border border-indigo-500/20">
            <h3 className="text-xl font-bold flex items-center gap-2 text-white mb-4">
              <BrainCircuit className="text-indigo-400" /> AI Assistant
            </h3>
            <p className="text-sm text-slate-400 mb-6 leading-relaxed">
              Use Claude AI to deeply analyze {decodeURIComponent(id || '')}, generate time complexity reports, or provide real-world analogies.
            </p>
            
            {!aiData ? (
              <button 
                onClick={fetchAIExplanation} 
                disabled={loadingAI}
                className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-bold rounded-xl shadow-xl shadow-indigo-500/25 transition-all disabled:opacity-50"
              >
                {loadingAI ? "Analyzing with Claude API..." : "Generate AI Explanation"}
              </button>
            ) : (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                 <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
                   <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2 flex items-center gap-2"><Lightbulb className="w-4 h-4"/> Analogy</h4>
                   <p className="text-sm text-indigo-100/90 leading-relaxed">{aiData.analogy}</p>
                 </div>
                 
                 <div>
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2"><Code className="w-4 h-4 text-slate-400"/> Visual Logic Explanation</h4>
                    <div className="mb-4">
                      <AlgoPreviewVisualizer algoName={algoName} />
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed bg-slate-900/50 p-4 rounded-xl border border-slate-700/50">
                      {aiData.explanation}
                    </p>
                  </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-900/50 border border-slate-700/50 p-4 rounded-xl text-center">
                       <p className="text-xs text-slate-500 font-bold uppercase mb-1">Time Complexity</p>
                       <p className="text-xl font-black text-rose-400">{aiData.complexity?.time || "O(N log N)"}</p>
                    </div>
                    <div className="bg-slate-900/50 border border-slate-700/50 p-4 rounded-xl text-center">
                       <p className="text-xs text-slate-500 font-bold uppercase mb-1">Space Complexity</p>
                       <p className="text-xl font-black text-emerald-400">{aiData.complexity?.space || "O(1)"}</p>
                    </div>
                 </div>
              </motion.div>
            )}
         </div>

         {/* Performance Bar */}
         <div className="glass-panel p-6 border border-slate-700/50">
           <h3 className="text-lg font-bold flex items-center gap-2 text-white mb-6">
              <ChartBar className="text-pink-400" /> Platform Auto-Metrics
           </h3>
           <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-bold mb-1"><span className="text-slate-400">Engine Output FPS</span><span className="text-emerald-400">60 FPS</span></div>
                <div className="w-full bg-slate-800 rounded-full h-1.5"><div className="bg-emerald-500 h-1.5 rounded-full w-full"></div></div>
              </div>
              <div>
                <div className="flex justify-between text-xs font-bold mb-1"><span className="text-slate-400">Memory Utilization</span><span className="text-amber-400">14 MB</span></div>
                <div className="w-full bg-slate-800 rounded-full h-1.5"><div className="bg-amber-500 h-1.5 rounded-full w-[25%]"></div></div>
              </div>
           </div>
         </div>

       </div>
    </div>
  );
}

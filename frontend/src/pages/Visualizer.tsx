import React, { useState } from 'react';
import SortingVisualizer from '../components/SortingVisualizer';
import { Bot, Zap, Code, Terminal, Clock, Box } from 'lucide-react';

export default function VisualizerPage() {
  const [activeTab, setActiveTab] = useState('performance');

  return (
    <div className="animate-in fade-in flex flex-col lg:flex-row h-full gap-6 w-full max-w-7xl mx-auto">
      {/* Main Visualization Canvas */}
      <div className="flex-[2] min-w-0 h-full flex flex-col gap-4 relative">
        <SortingVisualizer />
      </div>

      {/* Side Panel (AI & Performance) */}
      <div className="flex-1 flex flex-col gap-6 min-w-0 h-full shrink-0 lg:max-w-md">
        
        {/* Toggle Tabs */}
        <div className="glass-panel p-1 flex gap-1 rounded-xl">
          <button 
             onClick={() => setActiveTab('performance')}
             className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-lg transition-all ${
               activeTab === 'performance' ? 'bg-slate-800 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
             }`}
          >
            <Zap className="w-4 h-4" />
            Performance
          </button>
          <button 
             onClick={() => setActiveTab('ai')}
             className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-lg transition-all ${
               activeTab === 'ai' ? 'bg-indigo-500/20 text-indigo-300 shadow-md' : 'text-slate-400 hover:text-slate-200'
             }`}
          >
            <Bot className="w-4 h-4" />
            AI Explain
          </button>
        </div>

        {/* Content Area */}
        <div className="glass-panel p-6 flex-1 overflow-y-auto w-full relative">
          {activeTab === 'performance' ? (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
               <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                 <Terminal className="text-emerald-400 w-5 h-5" />
                 Execution Stats
               </h3>
               
               <div className="space-y-4">
                 <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-800/80 hover:bg-slate-800/50 transition-colors">
                   <div className="flex justify-between items-center mb-1">
                     <span className="text-slate-400 text-sm flex items-center gap-2"><Clock className="w-4 h-4" /> Time Complexity</span>
                     <span className="text-indigo-400 font-mono font-bold">O(n log n)</span>
                   </div>
                   <p className="text-xs text-slate-500">Consistent time across worst, average, and best cases.</p>
                 </div>

                 <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-800/80 hover:bg-slate-800/50 transition-colors">
                   <div className="flex justify-between items-center mb-1">
                     <span className="text-slate-400 text-sm flex items-center gap-2"><Box className="w-4 h-4" /> Space Complexity</span>
                     <span className="text-pink-400 font-mono font-bold">O(n)</span>
                   </div>
                   <p className="text-xs text-slate-500">Requires additional memory for the temporary merged arrays.</p>
                 </div>
               </div>

               <div className="mt-8">
                 <h4 className="text-sm font-bold text-slate-300 mb-3 flex items-center gap-2">
                    <Code className="w-4 h-4 text-amber-400" /> Source Highlights
                 </h4>
                 <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 font-mono text-xs text-slate-300 overflow-hidden">
                   <pre>
<span className="text-pink-400">function</span> <span className="text-indigo-300">mergeSort</span>(arr) {'{\n'}
  <span className="text-slate-500">{'// Divide'}</span>
  <span className="text-pink-400">if</span> (arr.length &lt;= 1) <span className="text-pink-400">return</span> arr;
  ...
  <span className="text-slate-500">{'// Conquer & Merge'}</span>
  <span className="text-pink-400">return</span> merge(left, right);
{'}'}
                   </pre>
                 </div>
               </div>
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-left-4 duration-300 h-full flex flex-col">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
                 <Bot className="text-indigo-400 w-5 h-5 flex-shrink-0" />
                 Claude Assistant
              </h3>
              
              <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
                 <div className="bg-slate-900/50 p-4 rounded-xl rounded-tl-sm border border-slate-800/80">
                   <p className="text-sm text-slate-300 leading-relaxed mb-3">
                     I'm monitoring the <strong className="text-indigo-400">Merge Sort</strong> execution. Merge Sort is a divide-and-conquer algorithm that recursively splits the array into two halves until it reaches subarrays of length 1, then merges them back together in sorted order.
                   </p>
                   <p className="text-sm text-slate-300 leading-relaxed">
                     <span className="text-amber-400 font-bold">Current Step insight:</span> Notice how it completely breaks down the left side before touching the right side. This is due to the depth-first recursive nature!
                   </p>
                 </div>
              </div>

              <div className="mt-auto relative">
                <input 
                  type="text" 
                  placeholder="Ask Claude a question..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-white placeholder-slate-500"
                />
                <button className="absolute right-2 top-2 bottom-2 aspect-square flex items-center justify-center bg-indigo-500 hover:bg-indigo-400 text-white rounded-lg transition-colors">
                  <Zap className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

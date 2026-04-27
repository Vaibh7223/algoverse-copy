import React, { useState } from 'react';
import { Target, BrainCircuit, Mic, Send } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Interview() {
  const [chat, setChat] = useState<{speaker: 'ai'|'user', text: string}[]>([
    { speaker: 'ai', text: "Welcome to Algorithm Interview Mode. I am evaluating your structural thinking. First question: Describe an efficient algorithm to find the Kth largest element in an unsorted array." }
  ]);
  const [input, setInput] = useState('');
  const [analyzing, setAnalyzing] = useState(false);

  const submitAnswer = () => {
    if(!input) return;
    setChat(p => [...p, { speaker: 'user', text: input }]);
    setInput('');
    setAnalyzing(true);

    setTimeout(() => {
      setAnalyzing(false);
      setChat(p => [...p, { speaker: 'ai', text: "Good approach using a Min-Heap! It guarantees O(N log K) time complexity. Now, can you write the exact initialization statement for a Min-Heap of size K?" }]);
    }, 1500);
  };

  return (
    <div className="h-full flex flex-col max-w-4xl mx-auto px-4 py-8 relative">
      <div className="flex items-center gap-4 mb-8">
        <Target className="w-12 h-12 text-emerald-500 drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
        <div>
           <h2 className="text-3xl font-black text-white">AI Interview Mode</h2>
           <p className="text-slate-400">Mock FAANG technical interview simulator.</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-6 pb-20 custom-scrollbar pr-4">
        {chat.map((m, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            key={i} 
            className={`flex ${m.speaker === 'user' ? 'justify-end' : 'justify-start'}`}
          >
             <div className={`max-w-[80%] p-5 rounded-3xl ${m.speaker === 'ai' ? 'bg-slate-800 text-slate-200 border border-slate-700/50 rounded-tl-sm' : 'bg-emerald-600 text-white rounded-br-sm'}`}>
                {m.speaker === 'ai' && <div className="text-emerald-400 text-xs font-bold uppercase mb-2 flex items-center gap-2"><BrainCircuit className="w-4 h-4"/> AI Assessor</div>}
                <p className="leading-relaxed">{m.text}</p>
             </div>
          </motion.div>
        ))}
        {analyzing && (
           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
             <div className="bg-slate-800 border border-slate-700/50 text-slate-400 rounded-3xl rounded-tl-sm px-6 py-4 flex gap-2">
               <span className="animate-bounce">.</span><span className="animate-bounce delay-100">.</span><span className="animate-bounce delay-200">.</span> Processing
             </div>
           </motion.div>
        )}
      </div>

      <div className="absolute bottom-4 left-0 right-0 px-4">
        <div className="max-w-4xl mx-auto bg-slate-900 border border-slate-700 p-2 rounded-2xl flex items-end gap-2 shadow-2xl">
          <button className="p-4 text-slate-400 hover:text-emerald-400 hover:bg-slate-800 rounded-xl transition-colors">
            <Mic className="w-6 h-6" />
          </button>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Type your technical answer..."
            className="flex-1 bg-transparent text-white p-4 resize-none h-14 max-h-32 focus:outline-none"
            onKeyDown={e => { if(e.key==='Enter' && !e.shiftKey) { e.preventDefault(); submitAnswer(); }}}
          />
          <button 
             onClick={submitAnswer}
             className="p-4 bg-emerald-500 text-white rounded-xl hover:bg-emerald-400 shadow-lg transition-colors"
          >
            <Send className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}

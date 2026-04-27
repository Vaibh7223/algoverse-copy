import React from 'react';
import { Users, Server, Activity, PlusCircle, Settings, Edit3 } from 'lucide-react';
import { motion } from 'framer-motion';
import { apiFetch } from '../utils/api';

export default function Admin() {
  const [users, setUsers] = React.useState<any[]>([]);
  const [totalUsers, setTotalUsers] = React.useState(0);
  const [executions, setExecutions] = React.useState(0);
  const [apiHealth, setApiHealth] = React.useState('100%');

  React.useEffect(() => {
    const savedUsers = localStorage.getItem('algoverse_users');
    if (savedUsers) {
      const parsed = JSON.parse(savedUsers);
      setUsers(parsed);
      setTotalUsers(parsed.length);
    }
    
    const savedExecutions = localStorage.getItem('algoverse_executions');
    if (savedExecutions) {
      setExecutions(parseInt(savedExecutions, 10));
    }

    const updateHealth = () => {
       setApiHealth(navigator.onLine ? '100%' : '0% (Offline)');
    };
    updateHealth();
    window.addEventListener('online', updateHealth);
    window.addEventListener('offline', updateHealth);

    apiFetch<{ totalUsers: number; totalExecutions: number }>('/api/admin/usage')
      .then((data) => {
        setTotalUsers(data.totalUsers);
        setExecutions(data.totalExecutions);
        setApiHealth('100%');
      })
      .catch(() => {
        // Keep local fallback values when API is unavailable.
      });
    
    return () => {
      window.removeEventListener('online', updateHealth);
      window.removeEventListener('offline', updateHealth);
    };
  }, []);

  return (
    <div className="h-full overflow-y-auto animate-in fade-in custom-scrollbar pb-20">
      <div className="mb-10">
        <h2 className="text-4xl font-black text-white mb-2">Admin Dashboard</h2>
        <p className="text-slate-400">Manage platform algorithms, view analytics, and control server configurations.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
         <div className="glass-panel p-6 border border-indigo-500/30 flex items-center gap-4">
            <div className="p-4 bg-indigo-500/20 rounded-xl"><Users className="w-8 h-8 text-indigo-400"/></div>
            <div>
               <p className="text-slate-400 text-sm font-bold uppercase tracking-wider">Total Users</p>
               <h3 className="text-3xl font-black text-white">{totalUsers}</h3>
            </div>
         </div>
         <div className="glass-panel p-6 border border-emerald-500/30 flex items-center gap-4">
            <div className="p-4 bg-emerald-500/20 rounded-xl"><Activity className="w-8 h-8 text-emerald-400"/></div>
            <div>
               <p className="text-slate-400 text-sm font-bold uppercase tracking-wider">Executions</p>
               <h3 className="text-3xl font-black text-white">{executions}</h3>
            </div>
         </div>
         <div className="glass-panel p-6 border border-pink-500/30 flex items-center gap-4">
            <div className="p-4 bg-pink-500/20 rounded-xl"><Server className="w-8 h-8 text-pink-400"/></div>
            <div>
               <p className="text-slate-400 text-sm font-bold uppercase tracking-wider">API Health</p>
               <h3 className={`text-3xl font-black ${apiHealth === '100%' ? 'text-emerald-400' : 'text-rose-500'}`}>{apiHealth}</h3>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Add Algorithm Form */}
        <div className="xl:col-span-2 glass-panel p-8">
           <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
             <PlusCircle className="text-indigo-400" /> Upload New Algorithm
           </h3>
           <div className="space-y-6">
             <div className="grid grid-cols-2 gap-6">
               <div>
                  <label className="block text-sm font-bold text-slate-400 mb-2">Algorithm Name</label>
                  <input type="text" className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white" placeholder="e.g. Radix Sort" />
               </div>
               <div>
                  <label className="block text-sm font-bold text-slate-400 mb-2">Syllabus Category</label>
                  <select className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white">
                     <option>UNIT I (Sorting)</option>
                     <option>UNIT II (Greedy)</option>
                     <option>UNIT III (DP)</option>
                  </select>
               </div>
             </div>
             <div>
                <label className="block text-sm font-bold text-slate-400 mb-2">Execution Code (JavaScript Virtual Machine mapping)</label>
                <textarea rows={5} className="w-full bg-slate-950 border border-slate-700 rounded-xl p-4 text-emerald-400 font-mono text-sm resize-none custom-scrollbar" placeholder="export function runAlgo(data) { ... }" />
             </div>
             <button className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg transition-colors">
               Deploy to Production
             </button>
           </div>
        </div>

        {/* Existing Content */}
        <div className="glass-panel p-8 flex flex-col">
           <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
             <Settings className="text-slate-400" /> Active Algorithms
           </h3>
           <div className="space-y-4 flex-none pr-2 mb-8">
              {['Merge Sort', 'Quick Sort', 'Dijkstra'].map(a => (
                 <div key={a} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                    <span className="font-semibold text-slate-200">{a}</span>
                    <button className="text-slate-500 hover:text-indigo-400"><Edit3 className="w-4 h-4"/></button>
                 </div>
              ))}
           </div>
           
           <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2 pt-6 border-t border-slate-800">
             <Users className="text-indigo-400" /> Registered Users
           </h3>
           <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
              {users.length === 0 && <p className="text-slate-500 italic text-sm">No users registered yet. Go to Auth page to register.</p>}
              {users.map((u: any) => (
                 <div key={u.id} className="flex items-center justify-between p-4 bg-slate-900/80 rounded-xl border border-indigo-500/20">
                    <div>
                      <p className="font-semibold text-slate-200 text-sm">{u.email}</p>
                      <p className="text-xs text-slate-500">Joined: {new Date(u.joinedAt).toLocaleDateString()}</p>
                    </div>
                    <span className="px-2 py-1 bg-indigo-500/20 text-indigo-300 text-[10px] uppercase font-bold rounded">
                      {u.role}
                    </span>
                 </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
}

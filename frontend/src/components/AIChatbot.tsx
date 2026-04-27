import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Heart, BrainCircuit } from 'lucide-react';
import { apiFetch } from '../utils/api';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai' | 'support';
  text: string;
}

interface ChatApiResponse {
  answer: string;
}

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 'start', sender: 'ai', text: 'Hi! Ask me anything and I will do my best to answer with live context and clear explanations.' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const STRESS_KEYWORDS = ['stressed', 'anxious', 'tired', 'giving up', 'overwhelmed', 'hard', 'depressed', 'can\'t do this'];

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), sender: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Mock Sentiment Analysis
    const lowerInput = input.toLowerCase();
    const isStressed = STRESS_KEYWORDS.some(word => lowerInput.includes(word));

    if (isStressed) {
      const supportMsg: ChatMessage = {
        id: Date.now().toString() + 's',
        sender: 'support',
        text: "I noticed you're feeling overwhelmed. It's completely normal when learning complex subjects. Remember to take breaks. If you need it, our human support counselors are available 24/7 to talk."
      };
      setMessages(prev => [...prev, supportMsg]);
    }

    try {
      const response = await apiFetch<ChatApiResponse>('/api/ai/chat', {
        method: 'POST',
        body: JSON.stringify({ question: userMsg.text }),
      });

      const aiMsg: ChatMessage = {
        id: Date.now().toString() + 'a',
        sender: 'ai',
        text: response.answer || 'I could not generate a response right now. Please try again.',
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch {
      const aiMsg: ChatMessage = {
        id: Date.now().toString() + 'e',
        sender: 'ai',
        text: 'I am having trouble reaching the AI service right now. Please try again in a moment.',
      };
      setMessages(prev => [...prev, aiMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-indigo-500 rounded-full flex items-center justify-center text-white shadow-xl shadow-indigo-500/30 hover:scale-110 active:scale-95 transition-all z-40"
      >
        <MessageSquare className="w-6 h-6" />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 md:w-96 h-[500px] max-h-[80vh] flex flex-col bg-slate-900 border border-slate-700/50 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in slide-in-from-bottom-8">
          {/* Header */}
          <div className="h-16 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-between shadow-md z-10">
             <div className="flex items-center gap-3">
               <div className="p-2 bg-white/20 rounded-lg">
                 <BrainCircuit className="w-5 h-5 text-white" />
               </div>
               <div>
                 <h3 className="font-bold text-white leading-tight">Ignite Assistant</h3>
                 <p className="text-[10px] text-indigo-100 uppercase tracking-widest">24/7 AI Tutor & Support</p>
               </div>
             </div>
             <button onClick={() => setIsOpen(false)} className="text-white/70 hover:text-white transition-colors">
               <X className="w-6 h-6" />
             </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 bg-slate-900/50">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl p-3 text-sm shadow-sm ${
                    msg.sender === 'user' 
                      ? 'bg-indigo-500 text-white rounded-br-sm' 
                      : msg.sender === 'support' 
                        ? 'bg-gradient-to-r from-pink-500/20 to-rose-500/20 border border-pink-500/30 text-rose-200 rounded-bl-sm'
                        : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-bl-sm'
                  }`}>
                  {msg.sender === 'support' && (
                    <div className="flex items-center gap-1.5 mb-1.5 text-pink-400 font-bold text-xs uppercase tracking-wider">
                      <Heart className="w-3.5 h-3.5" fill="currentColor" /> Mental Health Alert
                    </div>
                  )}
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="max-w-[85%] rounded-2xl p-3 text-sm shadow-sm bg-slate-800 text-slate-300 border border-slate-700 rounded-bl-sm">
                  Thinking...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2">
            <input 
              type="text" 
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="Ask a doubt or share feelings..."
              className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
            />
            <button 
              onClick={handleSend}
              className="p-2.5 bg-indigo-500 text-white rounded-xl hover:bg-indigo-400 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

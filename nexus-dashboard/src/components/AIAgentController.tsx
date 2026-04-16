import React, { useState } from 'react';
import { Send, Cpu, Loader2, Sparkles, Terminal } from 'lucide-react';
import { useToast } from './Toast';

export default function AIAgentController() {
  const [instruction, setInstruction] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleExecute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!instruction.trim()) return;

    setIsProcessing(true);
    toast("AI Agent is engaging. Stand by for browser automation.", "success");

    try {
      const response = await fetch('http://localhost:8000/agent/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ instruction }),
      });

      const data = await response.json();

      if (data.execution_result.status === 'success') {
        toast(`Mission Accomplished: ${data.execution_result.message}`, "success");
      } else {
        toast(`Agent Intervention Failed: ${data.execution_result.message}`, "error");
      }
    } catch (error) {
      toast("Error connecting to Agent backend. Is main.py running?", "error");
    } finally {
      setIsProcessing(false);
      setInstruction('');
    }
  };

  return (
    <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] w-full max-w-2xl px-6">
      <div className={`relative group transition-all duration-700 ${isProcessing ? 'scale-105' : 'hover:scale-[1.02]'}`}>
        
        {/* Animated Glow Border */}
        <div className={`absolute -inset-1 rounded-3xl blur-2xl transition-all duration-1000 opacity-20 group-hover:opacity-40 ${isProcessing ? 'bg-indigo-500 animate-pulse' : 'bg-accent'}`} />
        
        <form 
          onSubmit={handleExecute}
          className="relative bg-[#0D0D0D]/90 backdrop-blur-3xl border border-white/10 p-2 rounded-[2rem] flex items-center gap-3 shadow-2xl"
        >
          <div className={`p-4 rounded-2xl ${isProcessing ? 'bg-accent animate-spin-slow' : 'bg-white/5'} transition-colors`}>
            {isProcessing ? <Loader2 size={24} className="text-white animate-spin" /> : <Cpu size={24} className="text-accent" />}
          </div>
          
          <input 
            type="text" 
            autoFocus
            disabled={isProcessing}
            placeholder={isProcessing ? "AI AGENT IS NAVIGATING..." : "Issue a natural language command (e.g. Reset john@co.com)"}
            className="flex-1 bg-transparent border-none outline-none text-white text-sm font-medium placeholder:text-white/20 px-2 disabled:opacity-50"
            value={instruction}
            onChange={(e) => setInstruction(e.target.value)}
          />

          <button 
            type="submit"
            disabled={isProcessing || !instruction.trim()}
            className={`p-4 rounded-2xl flex items-center gap-2 transition-all ${
              isProcessing || !instruction.trim() 
              ? 'bg-white/5 text-white/10 opacity-50' 
              : 'bg-accent text-white hover:shadow-[0_0_30px_rgba(99,102,241,0.4)] active:scale-95'
            }`}
          >
            <span className="text-[10px] font-black uppercase tracking-widest px-2">{isProcessing ? 'Working' : 'Deploy'}</span>
            <Send size={18} />
          </button>
        </form>

        {/* Status Badge */}
        <div className="absolute -top-10 left-8 flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/80 border border-white/5 backdrop-blur-xl animate-in fade-in slide-in-from-bottom-2">
           <div className={`w-1.5 h-1.5 rounded-full ${isProcessing ? 'bg-amber-400 animate-ping' : 'bg-emerald-500'}`} />
           <span className="text-[9px] font-black uppercase tracking-[2px] text-white/60">
             Agent Status: {isProcessing ? 'Processing Mission' : 'Idle & Ready'}
           </span>
        </div>
      </div>
    </div>
  );
}

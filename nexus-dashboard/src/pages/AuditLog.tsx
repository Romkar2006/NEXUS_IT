import React, { useState, useEffect } from "react";
import { 
  Download, Activity, MoreHorizontal, ChevronDown,
  ShieldCheck, Terminal, Zap
} from "lucide-react";

const initialMockLogs = [
  { id: 1, date: "Oct 24", time: "14:22:01", action: "Password Reset", target: "m.chen@architect.io", actor: "Sarah Jenkins", status: "SUCCESS" },
  { id: 2, date: "Oct 24", time: "13:58:44", action: "Access Granted", target: "Internal_DB_Cluster_01", actor: "System Auto-Scale", status: "SUCCESS" },
];

const ProfessionalAvatar = ({ name }: { name: string }) => {
  const initials = name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  return (
    <div className="w-8 h-8 rounded-full bg-[#080808] border border-white/10 flex items-center justify-center text-[10px] font-black text-white/40 group-hover/row:border-accent/40 group-hover/row:text-white transition-all duration-500">
      {initials}
    </div>
  );
};

export default function AuditLog() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/logs");
      if (res.ok) {
        const data = await res.json();
        // Merge with mock logs for a fuller look, but newest API logs on top
        setLogs([...data, ...initialMockLogs]);
      }
    } catch (e) {
      console.error("Audit API offline");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-12 animate-in fade-in duration-1000 pb-20">
      
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 reveal-card">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] text-accent">
             <div className="w-4 h-[1px] bg-accent" />
             Infrastructure Intelligence
          </div>
          <h1 className="text-5xl font-black tracking-tighter text-white">Security Audit Log</h1>
          <p className="text-white/30 text-sm font-medium">Immutable protocol validation and identity trail.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
          <button className="bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 text-white/40 hover:text-white text-[10px] font-black uppercase tracking-[0.3em] px-6 py-4 rounded-2xl transition-all flex items-center gap-3 ml-auto">
             <Download size={14} /> Export CSV
          </button>
        </div>
      </div>

      <div className="glass-card overflow-hidden bg-transparent border-white/5 reveal-card">
        <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
           <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-white/40">Real-Time Protocol Ingestion</h2>
           </div>
           <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-white/5 border border-white/5 px-4 py-2 rounded-lg text-[10px] font-black text-white/60 tracking-widest uppercase">
                {loading ? "Syncing..." : "Live Feed"}
                <Zap size={10} className={loading ? "" : "text-amber-400"} />
              </div>
           </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-black uppercase tracking-[0.25em] text-white/10 border-b border-white/[0.03]">
                <th className="px-10 py-6">Event Cycle</th>
                <th className="px-10 py-6">Initiated By</th>
                <th className="px-10 py-6">Operational Trigger</th>
                <th className="px-10 py-6">Outcome Protocol</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.02]">
              {logs.map((log) => (
                <tr key={log.id} className="group/row hover:bg-white/[0.02] transition-all">
                  <td className="px-10 py-8 relative">
                    <div className="flex items-center gap-6">
                       <div className="w-2 h-2 rounded-full border-2 border-accent/40 bg-transparent group-hover/row:bg-accent group-hover/row:scale-125 transition-all duration-500" />
                       <div>
                          <p className="text-xs text-white/80 font-bold group-hover/row:text-white transition-colors uppercase tracking-tight">{log.date}</p>
                          <p className="text-[10px] text-white/20 font-mono mt-1">{log.time}</p>
                       </div>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-3">
                      <ProfessionalAvatar name={log.actor} />
                      <p className="text-sm font-extrabold text-white/70">{log.actor}</p>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <p className="text-sm font-bold text-white group-hover/row:translate-x-1 transition-transform flex items-center gap-3">
                      <Terminal size={14} className="text-accent" />
                      {log.action}
                    </p>
                    <p className="text-[10px] font-mono text-white/20 mt-1 uppercase tracking-widest">{log.target}</p>
                  </td>
                  <td className="px-10 py-8">
                     <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[10px] font-black tracking-[0.2em] border ${
                        log.status === 'SUCCESS' ? 'bg-emerald-500/5 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/5 text-rose-400 border-rose-500/20'
                      }`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${log.status === 'SUCCESS' ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                        {log.status}
                      </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

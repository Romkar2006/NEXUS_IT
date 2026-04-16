import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import { ToastProvider } from "./components/Toast";
import Users from "./pages/Users";
import CreateUser from "./pages/CreateUser";
import AuditLog from "./pages/AuditLog";
import { Zap, ShieldCheck, ShieldAlert } from "lucide-react";

const API_PULSE_INTERVAL = 5000;

export default function App() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [apiStatus, setApiStatus] = useState<'ONLINE' | 'OFFLINE' | 'SYNCING'>('SYNCING');

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // 🏥 System Pulse Logic
  useEffect(() => {
    const checkPulse = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/users");
        if (res.ok) setApiStatus('ONLINE');
        else setApiStatus('OFFLINE');
      } catch (e) {
        setApiStatus('OFFLINE');
      }
    };
    
    checkPulse();
    const interval = setInterval(checkPulse, API_PULSE_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  return (
    <Router>
      <ToastProvider>
        <div className="relative min-h-screen bg-[#030303] text-primary antialiased font-sans selection:bg-accent/30 selection:text-white overflow-hidden">
          
          {/* 📡 Status Pulse Indicator (Bottom Right Corner) */}
          <div className="fixed bottom-8 right-8 z-[100] flex items-center gap-3 bg-black/40 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-1000">
             <div className="flex flex-col items-end">
                <span className="text-[8px] font-black uppercase tracking-[0.2em] text-white/30">Infrastructure</span>
                <span className={`text-[10px] font-black uppercase tracking-widest ${apiStatus === 'ONLINE' ? 'text-emerald-400' : 'text-rose-500'}`}>
                  {apiStatus}
                </span>
             </div>
             <div className="relative flex items-center justify-center">
                <div className={`absolute w-3 h-3 rounded-full opacity-40 animate-ping ${apiStatus === 'ONLINE' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                <div className={`relative w-2 h-2 rounded-full ${apiStatus === 'ONLINE' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]'}`} />
             </div>
          </div>

          {/* 🕵️‍♂️ Dynamic Cursor Spotlight effect */}
          <div 
            className="fixed inset-0 pointer-events-none z-[1] transition-opacity duration-1000"
            style={{
              background: `radial-gradient(650px circle at ${mousePos.x}px ${mousePos.y}px, rgba(99, 102, 241, 0.15), transparent 80%)`
            }}
          />

          {/* Static Background Meshes */}
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-accent/15 rounded-full blur-[120px] pointer-events-none animate-pulse-slow" />
          
          <div className="flex relative z-10 min-h-screen">
            <Sidebar />
            
            <main className="flex-1 md:ml-72 w-full h-screen overflow-y-auto custom-scrollbar relative">
              <div className="max-w-[1300px] mx-auto p-6 md:p-12 pb-24">
                <Routes>
                  <Route path="/" element={<Users />} />
                  <Route path="/create" element={<CreateUser />} />
                  <Route path="/audit" element={<AuditLog />} />
                </Routes>
              </div>
            </main>
          </div>
        </div>
      </ToastProvider>
    </Router>
  );
}

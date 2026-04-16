import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "../components/Toast";
import { 
  ArrowLeft, Terminal, PlusCircle, 
  Mail, User, ChevronDown
} from "lucide-react";

export default function CreateUser() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState("USER");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "Security Operations"
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
        // 🚀 POST to FastAPI Backend for global persistence
        const response = await fetch("http://localhost:8000/api/users", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: formData.name,
                email: formData.email,
                role: role,
                dept: formData.department,
                status: "Active"
            })
        });

        if (response.ok) {
            // 📜 Log to Audit Trail
            await fetch("http://localhost:8000/api/logs", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
                    action: "User Provisioned",
                    target: formData.email,
                    actor: "Admin (Direct)",
                    status: "SUCCESS"
                })
            });

            toast("Identity successfully committed to directory.", "success");
            navigate("/");
        } else {
            toast("Failed to provision identity.", "error");
        }
    } catch (error) {
        toast("Server connection lost.", "error");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      
      <Link to="/" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-white/30 hover:text-indigo-400 transition-all mb-12 group">
        <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" />
        Return to Directory
      </Link>

      <div className="space-y-12 w-full">
        <div className="space-y-3">
           <div className="flex items-center gap-3 text-indigo-500 transition-all group">
              <Terminal size={18} className="group-hover:rotate-12 transition-transform" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em]">Identity Management</span>
           </div>
           <h1 className="text-5xl font-black tracking-tighter text-white">Add New User</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-8">
             <div className="space-y-2.5">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-1">Full Identity Name</label>
                <div className="relative">
                  <User className="absolute left-8 top-1/2 -translate-y-1/2 text-white/40" size={18} />
                  <input 
                    required
                    type="text" 
                    placeholder="e.g. Marcus Thorne"
                    className="input-premium !pl-20 py-4.5 bg-white/[0.02] w-full text-sm"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
             </div>
             
             <div className="space-y-2.5">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-1">Secure Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-8 top-1/2 -translate-y-1/2 text-white/40" size={18} />
                  <input 
                    required
                    type="email" 
                    placeholder="m.thorne@nexus.it"
                    className="input-premium !pl-20 py-4.5 bg-white/[0.02] w-full text-sm"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
             </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-1">Clearance Level Assignment</label>
            <div className="grid grid-cols-3 gap-3">
              {['USER', 'VIEWER', 'ADMIN'].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`py-4 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all duration-300 ${
                    role === r 
                    ? 'bg-indigo-600/10 border-indigo-500/40 text-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.1)]' 
                    : 'bg-white/[0.02] border-white/5 text-white/20 hover:bg-white/[0.05] hover:border-white/10'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
             <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-1">Assigned Department</label>
             <div className="relative">
                <select 
                  className="input-premium py-4.5 bg-[#030303] appearance-none w-full cursor-pointer pr-12 focus:ring-1 focus:ring-indigo-500/20 text-sm"
                  value={formData.department}
                  onChange={(e) => setFormData({...formData, department: e.target.value})}
                >
                  <option value="Security Operations" className="bg-[#030303] text-white">Security Operations</option>
                  <option value="Architecture Lab" className="bg-[#030303] text-white">Architecture Lab</option>
                  <option value="Data Engineering" className="bg-[#030303] text-white">Data Engineering</option>
                  <option value="Core Infrastructure" className="bg-[#030303] text-white">Core Infrastructure</option>
                </select>
                <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none" size={18} />
             </div>
          </div>

          <div className="pt-4">
            <button 
              type="submit" 
              disabled={loading}
              className={`w-full py-5 rounded-2xl font-black uppercase tracking-[0.3em] text-[11px] flex items-center justify-center gap-3 transition-all duration-500 shadow-xl ${
                loading 
                ? 'bg-white/5 text-white/10 cursor-not-allowed border border-white/5' 
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_40px_rgba(99,102,241,0.3)] hover:-translate-y-1'
              }`}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Encrypting Identity...
                </>
              ) : (
                <>
                  <PlusCircle size={20} />
                  Add User
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

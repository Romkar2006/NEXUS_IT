import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useToast } from "../components/Toast";
import { 
  Plus, Search, Download, MoreVertical, Zap, 
  Hourglass, Users as UsersIcon, ChevronLeft, 
  ChevronRight, Shield, Filter, CheckCircle2,
  Clock, ShieldAlert, MoreHorizontal, UserCheck,
  Activity, Trash2, ShieldPlus, UserMinus, ShieldAlert as ShieldIcon
} from "lucide-react";

// ✨ Clean User Avatar
const CompactAvatar = ({ name, status }: { name: string, status: string }) => {
    const initials = name.split(" ").map(n => n[0]).join("").toUpperCase();
    const isActive = status === 'Active';

    return (
        <div className="relative">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-500 relative overflow-hidden ${isActive ? 'animated-mesh-bg glow-active' : 'bg-white/5 border border-white/10'}`}>
                <span className={`text-xs font-bold relative z-10 ${isActive ? 'text-white' : 'text-white/20'}`}>
                    {initials}
                </span>
            </div>
            <div className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-[#0A0A0A] ${
                status === 'Active' ? 'bg-emerald-500' : 
                status === 'Pending' ? 'bg-blue-500' : 'bg-white/10'
            }`} />
        </div>
    );
};

export default function Users() {
  const { toast } = useToast();
  const [users, setUsers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [resetModalUser, setResetModalUser] = useState<any | null>(null);
  const [passwords, setPasswords] = useState({ new: "", confirm: "" });
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const API_URL = "http://localhost:8000/api";

  const fetchUsers = async () => {
    try {
        const res = await fetch(`${API_URL}/users`);
        if (res.ok) {
            const data = await res.json();
            setUsers(data);
        }
    } catch (e) {
        console.error("Connection lost to API server.");
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    const interval = setInterval(fetchUsers, 2000);
    return () => clearInterval(interval);
  }, []);

  const deleteUser = async (id: number) => {
    try {
        const res = await fetch(`${API_URL}/users/${id}`, { method: 'DELETE' });
        if (res.ok) {
            toast("User deleted from central database.", "success");
            fetchUsers();
            setOpenMenuId(null);
        }
    } catch (e) {
        toast("Failed to delete user.", "error");
    }
  };

  const handleResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) { toast("Passwords do not match.", "error"); return; }
    toast("Password updated centrally.", "success");
    setResetModalUser(null);
    setPasswords({ new: "", confirm: "" });
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = activeFilter === "ALL" || u.role === activeFilter || u.status.toUpperCase() === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20 max-w-7xl mx-auto px-4">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-white/[0.04] pb-10">
        <div className="space-y-1">
          <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-400">Staff List</p>
          <h1 className="text-4xl font-bold text-white tracking-tight">User Directory</h1>
        </div>
        
        <div className="flex items-center gap-4">
           <div className="relative group/search">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-hover/search:text-indigo-400 transition-colors" size={16} />
              <input 
                type="text" 
                placeholder="Search users..." 
                className="bg-white/[0.02] border border-white/10 rounded-xl py-2.5 pl-12 pr-6 text-sm text-white focus:outline-none focus:border-indigo-500/40 w-64 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
           </div>
           <Link to="/create" className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg flex items-center gap-2">
              <Plus size={18} /> Add User
           </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Active Users", value: users.filter(u=>u.status==='Active').length, icon: UserCheck, color: "text-emerald-400" },
          { label: "Total Admins", value: users.filter(u=>u.role==='ADMIN').length, icon: Shield, color: "text-amber-400" },
          { label: "Total Accounts", value: users.length, icon: UsersIcon, color: "text-white/40" },
          { label: "Live Nodes", value: loading ? "..." : "READY", icon: Zap, color: "text-indigo-500" },
        ].map((s, i) => (
          <div key={i} className="bg-white/[0.01] border border-white/[0.04] p-6 rounded-2xl flex items-center justify-between hover:bg-white/[0.02] transition-all">
             <div className="space-y-0.5">
                <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">{s.label}</p>
                <p className="text-2xl font-bold text-white">{s.value}</p>
             </div>
             <div className={`${s.color} opacity-30`}><s.icon size={20} /></div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
        {["ALL", "ADMIN", "USER", "ACTIVE", "PENDING"].map(f => (
          <button 
            key={f}
            onClick={() => { setActiveFilter(f); setCurrentPage(1); }}
            className={`px-5 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${
              activeFilter === f ? 'bg-indigo-600 text-white' : 'text-white/30 hover:text-white bg-white/5'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="bg-[#090909] border border-white/[0.06] rounded-2xl overflow-hidden shadow-2xl relative">
        <div className="scan-line" />

        <table className="w-full text-left relative z-10">
          <thead>
            <tr className="bg-white/[0.01] text-[10px] font-bold uppercase tracking-widest text-white/20 border-b border-white/[0.06]">
              <th className="px-8 py-5">User Info</th>
              <th className="px-8 py-5 text-center">Status</th>
              <th className="px-8 py-5 text-right pr-20">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {paginatedUsers.map((user) => (
              <tr key={user.id} className="group hover:bg-white/[0.01] transition-all">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <CompactAvatar name={user.name} status={user.status} />
                    <div className="space-y-0.5">
                      <p className="text-sm font-bold text-white group-hover:text-indigo-400">{user.name}</p>
                      <p className="text-[11px] font-medium text-white/20">{user.email} • {user.role}</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6 text-center">
                    <div className="inline-flex items-center gap-2 bg-black px-3 py-1 rounded-full border border-white/5">
                        <div className={`w-1.5 h-1.5 rounded-full ${user.status === 'Active' ? 'bg-emerald-500' : 'bg-white/10'}`} />
                        <span className={`text-[10px] font-bold uppercase tracking-widest ${user.status === 'Active' ? 'text-emerald-400' : 'text-white/20'}`}>
                            {user.status}
                        </span>
                    </div>
                </td>
                <td className="px-8 py-6 text-right pr-12">
                   <div className="flex justify-end items-center gap-6">
                      <button 
                        onClick={() => setResetModalUser(user)}
                        name="Reset Password"
                        className="text-[11px] font-bold text-indigo-400 hover:text-white transition-colors uppercase tracking-widest"
                      >
                         Reset
                      </button>

                      <div className="relative">
                        <button 
                           onClick={() => setOpenMenuId(openMenuId === user.id ? null : user.id)}
                           className="p-2 text-white/20 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                        >
                          <MoreHorizontal size={18} />
                        </button>

                        {openMenuId === user.id && (
                          <div className="absolute right-0 mt-2 w-48 bg-[#111111] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden">
                             <div className="p-1.5 space-y-0.5">
                                <button onClick={() => deleteUser(user.id)} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-[10px] font-bold uppercase text-rose-500/70 hover:bg-rose-600/20 hover:text-rose-400 transition-all text-left">
                                   Delete User
                                </button>
                             </div>
                          </div>
                        )}
                      </div>
                   </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="bg-white/[0.01] px-8 py-6 border-t border-white/[0.06] flex justify-between items-center text-[10px] font-bold text-white/20 tracking-widest">
            <span>PAGE {currentPage} OF {totalPages}</span>
            <div className="flex gap-2">
                <button 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  className="p-2.5 rounded-lg border border-white/10 hover:bg-white/5 disabled:opacity-10"
                >
                  <ChevronLeft size={16} />
                </button>
                <button 
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  className="p-2.5 rounded-lg border border-white/10 hover:bg-white/5 disabled:opacity-10"
                >
                  <ChevronRight size={16} />
                </button>
            </div>
        </div>
      </div>
      
      {resetModalUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
           <div className="bg-[#111111] border border-white/10 p-10 w-full max-w-sm rounded-2xl shadow-2xl space-y-8">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-white tracking-tight">Reset Password</h2>
                <p className="text-[11px] font-medium text-white/20 uppercase tracking-widest">User: {resetModalUser.email}</p>
              </div>

              <form onSubmit={handleResetSubmit} className="space-y-4">
                <div className="space-y-1.5">
                   <label className="text-[10px] font-bold text-white/20 uppercase tracking-widest ml-1">New Password</label>
                   <input required type="password" placeholder="Enter new password" className="bg-black border border-white/10 w-full p-4 rounded-xl text-white text-sm outline-none focus:border-indigo-500" value={passwords.new} onChange={(e) => setPasswords({...passwords, new: e.target.value})} />
                </div>
                <div className="space-y-1.5">
                   <label className="text-[10px] font-bold text-white/20 uppercase tracking-widest ml-1">Confirm Password</label>
                   <input required type="password" placeholder="Confirm new password" className="bg-black border border-white/10 w-full p-4 rounded-xl text-white text-sm outline-none focus:border-indigo-500" value={passwords.confirm} onChange={(e) => setPasswords({...passwords, confirm: e.target.value})} />
                </div>
                <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 p-4 rounded-xl font-bold text-xs uppercase tracking-widest text-white transition-all shadow-lg mt-2">Update Password</button>
                <button type="button" onClick={()=>setResetModalUser(null)} className="w-full text-white/30 text-[10px] font-bold uppercase py-2">Cancel</button>
              </form>
           </div>
        </div>
      )}
    </div>
  );
}

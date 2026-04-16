import React, { useEffect, useState } from "react";
import { 
  Users as UsersIcon, 
  Search, 
  UserPlus, 
  MoreVertical, 
  Shield, 
  Key, 
  Trash2, 
  Filter,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Fingerprint
} from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "../components/Toast";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  dept: string;
  status: string;
}

const DEPT_COLORS: Record<string, string> = {
  "Security Operations": "from-emerald-500 to-teal-600",
  "Architecture Lab": "from-indigo-500 to-blue-600",
  "Data Engineering": "from-amber-500 to-orange-600",
  "Core Infrastructure": "from-rose-500 to-pink-600"
};

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/users");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
    const interval = setInterval(fetchUsers, 2500);
    return () => clearInterval(interval);
  }, []);

  const handleDelete = async (id: number, name: string) => {
    try {
      await fetch(`http://localhost:8000/api/users/${id}`, { method: "DELETE" });
      toast(`Identity for ${name} has been purged from the grid.`, "info");
      fetchUsers();
    } catch (err) {
      toast("Purge sequence failed.", "error");
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase();

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* 🚀 Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-accent">
            <Fingerprint size={16} />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Central Identity Registry</span>
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight flex items-center gap-4">
            User Directory
            <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-white/40">
              {users.length} Nodes
            </span>
          </h1>
        </div>
        
        <Link 
          to="/create" 
          className="flex items-center gap-2 bg-accent hover:bg-accent/90 text-white px-6 py-3 rounded-xl font-bold transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(99,102,241,0.3)]"
        >
          <UserPlus size={18} />
          Provision New Member
        </Link>
      </div>

      {/* 📊 Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Active Nodes", val: users.length, color: "text-emerald-400", icon: CheckCircle2 },
          { label: "Admin Clearance", val: users.filter(u => u.role === 'ADMIN').length, color: "text-accent", icon: Shield },
          { label: "Security Pending", val: 0, color: "text-amber-400", icon: Clock },
        ].map((stat, i) => (
          <div key={i} className="bg-white/5 border border-white/10 p-6 rounded-2xl flex items-center justify-between group hover:border-white/20 transition-colors">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-1">{stat.label}</p>
              <p className={`text-3xl font-black ${stat.color}`}>{stat.val}</p>
            </div>
            <stat.icon className="text-white/10 group-hover:text-white/20 transition-colors" size={32} />
          </div>
        ))}
      </div>

      {/* 🔍 Search & Filters */}
      <div className="relative group">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-accent transition-colors" size={20} />
        <input
          type="text"
          placeholder="Search by name, email, or department..."
          className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-white focus:outline-none focus:border-accent transition-all placeholder:text-white/10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* 📂 Identity Grid / Table */}
      <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-md">
        <table className="w-full text-left border-collapse">
          <thead>
             <tr className="border-b border-white/10 bg-white/[0.02]">
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-white/30">Identity</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-white/30">Clearance</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-white/30">Network Node</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-white/30">Status</th>
                <th className="px-8 py-5 text-right"></th>
             </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.05]">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="group hover:bg-white/[0.02] transition-colors">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    {/* 👤 Dynamic Avatar */}
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${DEPT_COLORS[user.dept] || 'from-gray-500 to-gray-700'} flex items-center justify-center text-white font-black text-sm shadow-lg group-hover:scale-110 transition-transform`}>
                        {getInitials(user.name)}
                    </div>
                    <div>
                      <div className="text-[15px] font-bold text-white group-hover:text-accent transition-colors">
                        {user.name}
                      </div>
                      <div className="text-xs text-white/30 font-mono tracking-tight">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border ${
                    user.role === 'ADMIN' ? 'border-rose-500/20 bg-rose-500/10 text-rose-400' : 
                    user.role === 'VIEWER' ? 'border-blue-500/20 bg-blue-500/10 text-blue-400' :
                    'border-emerald-500/20 bg-emerald-500/10 text-emerald-400'
                  } text-[10px] font-bold uppercase tracking-wider`}>
                    <Shield size={10} strokeWidth={3} />
                    {user.role}
                  </div>
                </td>
                <td className="px-8 py-6">
                  <span className="text-xs font-medium text-white/60">{user.dept}</span>
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Secure</span>
                  </div>
                </td>
                <td className="px-8 py-6 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      className="p-2 hover:bg-white/10 rounded-lg text-white/40 hover:text-white transition-all hover:scale-110"
                      title="Password Reset"
                      onClick={() => toast(`Reset protocol initiated for ${user.email}`, "info")}
                    >
                      <Key size={16} />
                    </button>
                    <button 
                      onClick={() => handleDelete(user.id, user.name)}
                      className="p-2 hover:bg-rose-500/20 rounded-lg text-white/40 hover:text-rose-400 transition-all hover:scale-110"
                      title="Purge Identity"
                    >
                      <Trash2 size={16} />
                    </button>
                    <button className="p-2 hover:bg-white/10 rounded-lg text-white/40 hover:text-white transition-all">
                      <ArrowUpRight size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredUsers.length === 0 && (
          <div className="py-24 flex flex-col items-center justify-center text-white/10 space-y-4">
            <UsersIcon size={64} strokeWidth={1} />
            <p className="font-mono text-sm uppercase tracking-[0.2em]">Zero Identities Found</p>
          </div>
        )}
      </div>
    </div>
  );
}

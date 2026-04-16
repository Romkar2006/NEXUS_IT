import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Users, UserPlus, Activity, Settings, 
  Search, Shield, LayoutGrid, Bell, 
  ChevronRight, LogOut, Menu, X 
} from "lucide-react";

export default function Sidebar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navGroups = [
    {
      title: "Workspace",
      links: [
        { name: "User List", href: "/", icon: Users, badge: "128" },
        { name: "Create User", href: "/create", icon: UserPlus },
        { name: "Audit Logs", href: "/audit", icon: Activity },
      ]
    },
    {
      title: "Security",
      links: [
        { name: "Permissions", href: "#", icon: Shield },
        { name: "Access Logs", href: "#", icon: Bell },
      ]
    }
  ];

  return (
    <>
      <button 
        className="md:hidden fixed top-5 right-5 z-[60] glass-card p-2.5"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      <aside className={`fixed inset-y-0 left-0 z-50 w-72 h-screen glass-card !rounded-none border-y-0 border-l-0 border-r border-white/5 flex flex-col transition-transform duration-500 md:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
        {/* Brand Header */}
        <div className="p-8 pb-4">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center shadow-lg shadow-accent/20">
              <Shield className="text-white" size={20} />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">Nexus<span className="text-accent">IT</span></h1>
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold">Admin Console</p>
            </div>
          </div>

          {/* Search Shortcut Placeholder */}
          <div className="group relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20 group-hover:text-white/40 transition-colors" size={14} />
            <div className="w-full bg-white/[0.03] border border-white/5 rounded-xl py-2 px-10 text-xs text-white/30 cursor-pointer hover:bg-white/[0.06] transition-all">
              Search commands...
            </div>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-white/20 px-1.5 py-0.5 border border-white/5 rounded">
              ⌘K
            </div>
          </div>
        </div>

        {/* Navigation Groups */}
        <nav className="flex-1 px-4 py-6 overflow-y-auto space-y-8 scrollbar-hide">
          {navGroups.map((group) => (
            <div key={group.title} className="space-y-2">
              <h2 className="px-4 text-[10px] font-bold uppercase tracking-widest text-white/25 mb-4">{group.title}</h2>
              {group.links.map((link) => {
                const isActive = location.pathname === link.href;
                const Icon = link.icon;
                return (
                  <Link
                    key={link.name}
                    to={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`sidebar-link ${isActive ? "sidebar-link-active" : "sidebar-link-inactive"}`}
                  >
                    <Icon size={18} />
                    <span className="flex-1">{link.name}</span>
                    {link.badge && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-accent/20 text-accent border border-accent/20">
                        {link.badge}
                      </span>
                    )}
                    {isActive && <ChevronRight size={14} className="text-white/40" />}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Footer Profile */}
        <div className="p-6 mt-auto">
          <div className="p-4 glass-card border-white/5 hover:bg-white/[0.02] transition-colors cursor-pointer flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-accent to-purple-400 flex items-center justify-center text-sm font-bold text-white shadow-inner">
                  AD
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[#030303]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">Admin User</p>
                <p className="text-[11px] text-white/40 truncate">Master Control</p>
              </div>
              <LogOut size={16} className="text-white/20 hover:text-white transition-colors" />
          </div>
        </div>
      </aside>

      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-md z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}

import React from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home, 
  Bell, 
  Search, 
  Mic, 
  Settings, 
  LogOut,
  LayoutDashboard,
  Thermometer,
  Music,
  Lightbulb,
  ShieldCheck,
  Zap,
  Calendar,
  Cpu,
  HelpCircle,
  Link as LinkIcon
} from 'lucide-react';

export const SidebarItem = ({ item, active }: { item: any, active: boolean }) => {
  const Icon = item.icon;
  return (
    <RouterLink 
      to={item.path}
      className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all group ${active ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'}`}
    >
      <div className={`transition-transform duration-300 ${active ? 'scale-110' : 'group-hover:scale-110'}`}>
        <Icon size={22} />
      </div>
      <span className={`hidden md:block font-bold text-sm tracking-tight ${active ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`}>
        {item.label}
      </span>
      {active && (
        <motion.div 
          layoutId="active-pill"
          className="absolute left-0 w-1 h-8 bg-white rounded-r-full hidden md:block"
        />
      )}
    </RouterLink>
  );
};

export const PageTitle = () => {
  const location = useLocation();
  const path = location.pathname.split('/')[1] || 'Dashboard';
  const title = path.charAt(0).toUpperCase() + path.slice(1);

  return (
    <div className="flex flex-col">
      <h1 className="text-2xl font-black text-white tracking-tight">{title}</h1>
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Home Control</span>
        <div className="w-1 h-1 rounded-full bg-slate-700" />
        <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">{title} View</span>
      </div>
    </div>
  );
};

export const Layout = ({ children, state }: { children: React.ReactNode, state: any }) => {
  const [showNotifs, setShowNotifs] = React.useState(false);
  const location = useLocation();

  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { id: 'units', icon: LinkIcon, label: 'Units', path: '/units' },
    { id: 'climate', icon: Thermometer, label: 'Climate', path: '/climate', feature: 'climate' },
    { id: 'music', icon: Music, label: 'Music', path: '/music', feature: 'music' },
    { id: 'lighting', icon: Lightbulb, label: 'Lighting', path: '/lighting', feature: 'lighting' },
    { id: 'security', icon: ShieldCheck, label: 'Security', path: '/security', feature: 'security' },
    { id: 'energy', icon: Zap, label: 'Energy', path: '/energy', feature: 'energy' },
    { id: 'schedules', icon: Calendar, label: 'Schedules', path: '/schedules' },
    { id: 'setup', icon: Cpu, label: 'Service Setup', path: '/setup' },
    { id: 'help', icon: HelpCircle, label: 'Help & Support', path: '/help' },
  ].filter(item => !item.feature || state.enabledFeatures.includes(item.feature));

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950">
      {/* Sidebar */}
      <aside className="w-20 md:w-64 glass border-r border-slate-800 flex flex-col items-center md:items-stretch py-8 z-50">
        <div className="px-6 mb-12 flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
            <Home size={24} />
          </div>
          <span className="hidden md:block text-xl font-black text-white tracking-tighter uppercase truncate">{state.appName}</span>
        </div>

        <nav className="flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => (
            <SidebarItem key={item.id} item={item} active={location.pathname === item.path} />
          ))}
        </nav>

        <div className="px-4 mt-auto space-y-2">
          <RouterLink to="/setup" className="w-full flex items-center gap-4 p-4 rounded-2xl text-slate-400 hover:bg-slate-800/50 transition-all">
            <Settings size={22} />
            <span className="hidden md:block font-bold text-sm">Settings</span>
          </RouterLink>
          <button 
            onClick={state.logout}
            className="w-full flex items-center gap-4 p-4 rounded-2xl text-red-400 hover:bg-red-500/10 transition-all"
          >
            <LogOut size={22} />
            <span className="hidden md:block font-bold text-sm">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="h-20 px-8 flex items-center justify-between border-b border-slate-900 bg-slate-950/50 backdrop-blur-md z-40">
          <div className="flex items-center gap-4">
            <PageTitle />
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              System Online
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => {
                const voiceEl = document.getElementById('voice-assistant');
                if (voiceEl) voiceEl.scrollIntoView({ behavior: 'smooth' });
              }}
              className="p-3 rounded-2xl glass text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              <Mic size={20} />
            </button>

            <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-2xl glass text-slate-400">
              <Search size={18} />
              <input type="text" placeholder="Search devices..." className="bg-transparent border-none outline-none text-sm w-48" />
            </div>
            
            <div className="relative">
              <button 
                onClick={() => setShowNotifs(!showNotifs)}
                className="p-3 rounded-2xl glass text-slate-400 hover:text-white transition-colors relative"
              >
                <Bell size={20} />
                {state.notifications.length > 0 && (
                  <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-slate-950" />
                )}
              </button>

              <AnimatePresence>
                {showNotifs && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute top-full right-0 mt-4 w-80 glass border border-slate-800 rounded-3xl p-4 shadow-2xl z-50"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-bold text-white">Notifications</h3>
                      <button onClick={() => state.clearNotifications()} className="text-[10px] font-bold text-blue-400 uppercase">Clear All</button>
                    </div>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {state.notifications.map((n: any) => (
                        <div key={n.id} className="p-3 rounded-2xl bg-slate-900/50 border border-slate-800">
                          <div className="flex justify-between items-start mb-1">
                            <span className="text-[10px] font-bold text-blue-400 uppercase">{n.source}</span>
                            <span className="text-[10px] text-slate-500">{n.time}</span>
                          </div>
                          <p className="text-xs text-slate-300">{n.message}</p>
                        </div>
                      ))}
                      {state.notifications.length === 0 && (
                        <div className="text-center py-8 text-slate-500 text-sm italic">No new notifications</div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="w-10 h-10 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 font-bold overflow-hidden">
              {state.user?.photoURL ? (
                <img src={state.user.photoURL} alt="User" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
              ) : (
                state.user?.email?.charAt(0).toUpperCase()
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, 
  Zap, 
  Thermometer, 
  Music, 
  Lightbulb, 
  Heart,
  Activity,
  AlertTriangle,
  LayoutDashboard,
  Calendar,
  Clock,
  Mic,
  Home,
  Search,
  Bell,
  Plus,
  Trash2,
  Power,
  Play,
  Moon
} from 'lucide-react';
import { Link as RouterLink } from 'react-router-dom';
import { HomeSpectrum } from '../components/3D/HomeSpectrum';

const Card = ({ children, className = "", active = false, ...props }: { children: React.ReactNode, className?: string, active?: boolean, [key: string]: any }) => (
  <div className={`glass rounded-3xl p-6 card-hover ${active ? 'ring-2 ring-blue-500/50 bg-blue-500/5' : ''} ${className}`} {...props}>
    {children}
  </div>
);

const Toggle = ({ on, onClick, activeColor = 'bg-blue-500' }: { on: boolean, onClick: () => void, activeColor?: string }) => (
  <button 
    onClick={(e) => { e.stopPropagation(); onClick(); }}
    className={`relative w-11 h-6 rounded-full transition-colors duration-300 ${on ? activeColor : 'bg-slate-600'}`}
  >
    <motion.div 
      animate={{ x: on ? 22 : 2 }}
      className="absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow-sm"
    />
  </button>
);

const DeviceIcon = ({ type, size = 20 }: { type: string, size?: number }) => {
  switch (type) {
    case 'lighting': return <Lightbulb size={size} />;
    case 'heating': return <Thermometer size={size} />;
    case 'music': return <Music size={size} />;
    case 'security': return <ShieldCheck size={size} />;
    default: return <Zap size={size} />;
  }
};

export const Dashboard = ({ state }: { state: any }) => {
  const [activeTab, setActiveTab] = React.useState('overview');
  const activeDevices = state.devices.slice(0, 4);
  const upcoming = state.schedules.filter((s: any) => s.active).slice(0, 3);
  const isSetupIncomplete = !state.apiKeys?.gemini_api_key;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'spectrum', label: '3D Spectrum', icon: Activity },
    { id: 'schedules', label: 'Schedules', icon: Calendar },
    { id: 'automations', label: 'Automations', icon: Zap }
  ];

  return (
    <div className="space-y-10 pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight">Welcome Home, {state.user?.displayName || 'Admin'}</h2>
          <p className="text-slate-400 font-medium">Your intelligence hub is running at peak efficiency.</p>
        </div>
        <div className="flex gap-3">
          <div className="px-4 py-2 rounded-2xl glass border border-slate-800 flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-white uppercase tracking-widest">System Online</span>
          </div>
          <div className="px-4 py-2 rounded-2xl glass border border-slate-800 flex items-center gap-3">
            <Thermometer size={16} className="text-blue-400" />
            <span className="text-xs font-bold text-white uppercase tracking-widest">72°F Indoor</span>
          </div>
        </div>
      </div>

      {isSetupIncomplete && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-8 rounded-3xl bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 flex flex-col md:flex-row items-center justify-between gap-8"
        >
          <div className="flex items-center gap-6">
            <div className="p-5 rounded-2xl bg-orange-500 text-white shadow-xl shadow-orange-500/30">
              <AlertTriangle size={40} />
            </div>
            <div>
              <h3 className="text-2xl font-black text-white tracking-tight">System Setup Required</h3>
              <p className="text-slate-400 font-medium max-w-md">To enable the Voice Assistant and other smart features, please configure your API keys in the Service Setup.</p>
            </div>
          </div>
          <RouterLink 
            to="/setup" 
            className="px-10 py-4 rounded-2xl bg-white text-slate-950 font-black hover:bg-slate-200 transition-all shadow-xl shadow-white/10 whitespace-nowrap"
          >
            Go to Setup
          </RouterLink>
        </motion.div>
      )}

      {/* Tabbed Interface */}
      <div className="space-y-8">
        <div className="flex items-center gap-2 p-1.5 glass rounded-2xl w-fit border border-slate-800/50">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === tab.id ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div 
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-10"
            >
              <section>
                <div className="flex justify-between items-end mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-white">Quick Control</h3>
                    <p className="text-slate-500 text-sm">Manage your most used devices</p>
                  </div>
                  <RouterLink to="/units" className="text-blue-400 text-sm font-bold hover:text-blue-300 transition-colors">View All Units</RouterLink>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {activeDevices.map((d: any) => (
                    <Card key={d.id} active={d.on}>
                      <div className="flex justify-between items-start mb-6">
                        <div className="p-4 rounded-2xl" style={{ backgroundColor: `${d.color}15`, color: d.color }}>
                          <DeviceIcon type={d.type} size={24} />
                        </div>
                        <Toggle on={d.on} onClick={() => state.toggleDevice(d.id)} />
                      </div>
                      <div className="font-black text-white text-lg mb-1">{d.name}</div>
                      <div className="text-xs text-slate-500 font-bold uppercase tracking-widest">{d.room}</div>
                    </Card>
                  ))}
                </div>
              </section>

              <section>
                <h3 className="text-xl font-bold text-white mb-6">Quick Actions</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {[
                    { id: 'night', label: 'Good Night', icon: Moon, color: 'text-indigo-400', bg: 'bg-indigo-500/10', hBg: 'bg-indigo-500' },
                    { id: 'home', label: 'I\'m Home', icon: Home, color: 'text-emerald-400', bg: 'bg-emerald-500/10', hBg: 'bg-emerald-500' },
                    { id: 'movie', label: 'Movie Mode', icon: Play, color: 'text-purple-400', bg: 'bg-purple-500/10', hBg: 'bg-purple-500' },
                    { id: 'off', label: 'All Off', icon: Power, color: 'text-red-400', bg: 'bg-red-500/10', hBg: 'bg-red-500' }
                  ].map(action => (
                    <button 
                      key={action.id}
                      onClick={() => state.addNotification('System', `${action.label} activated`, 'info')}
                      className="p-6 rounded-3xl glass border border-slate-800/50 flex flex-col items-center gap-4 hover:bg-slate-800/50 transition-all group"
                    >
                      <div className={`p-4 rounded-2xl ${action.bg} ${action.color} group-hover:${action.hBg} group-hover:text-white transition-all shadow-lg`}>
                        <action.icon size={28} />
                      </div>
                      <span className="text-sm font-black text-white tracking-tight">{action.label}</span>
                    </button>
                  ))}
                </div>
              </section>
            </motion.div>
          )}

          {activeTab === 'spectrum' && (
            <motion.div 
              key="spectrum"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <HomeSpectrum enabledFeatures={state.enabledFeatures} />
            </motion.div>
          )}

          {activeTab === 'schedules' && (
            <motion.div 
              key="schedules"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-white">Active Schedules</h3>
                <RouterLink to="/schedules" className="text-blue-400 text-sm font-bold">Manage All</RouterLink>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcoming.map((s: any) => (
                  <Card key={s.id} className="border-l-4 border-emerald-500">
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500">
                        <Clock size={20} />
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-black text-white">{s.start}</div>
                        <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{s.repeat}</div>
                      </div>
                    </div>
                    <div className="font-bold text-white mb-1">{s.name}</div>
                    <div className="text-xs text-slate-400">{s.device} • {s.action}</div>
                  </Card>
                ))}
                {upcoming.length === 0 && (
                  <div className="col-span-full p-12 glass rounded-3xl text-center text-slate-500 italic">No active schedules found.</div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'automations' && (
            <motion.div 
              key="automations"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid md:grid-cols-2 gap-6"
            >
              {state.automations.map((a: any) => (
                <div key={a.id} className="glass rounded-3xl p-6 flex items-center justify-between border border-slate-800/50 hover:border-blue-500/30 transition-all group">
                  <div className="flex items-center gap-6">
                    <div className="p-5 rounded-2xl text-3xl shadow-lg group-hover:scale-110 transition-transform" style={{ backgroundColor: a.iconBg }}>
                      {a.icon === 'Home' ? '🏠' : a.icon === 'Moon' ? '🌙' : '⚡'}
                    </div>
                    <div>
                      <div className="font-black text-white text-lg mb-1">{a.name}</div>
                      <div className="text-xs text-slate-500 font-bold uppercase tracking-widest">Trigger: {a.trigger}</div>
                    </div>
                  </div>
                  <Toggle on={a.active} onClick={() => state.toggleAutomation(a.id)} />
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

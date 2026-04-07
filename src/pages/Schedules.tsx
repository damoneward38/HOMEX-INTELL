import React from 'react';
import { motion } from 'motion/react';
import { 
  Calendar, 
  Clock, 
  Plus, 
  Trash2, 
  Settings, 
  Zap, 
  Activity, 
  Cpu, 
  Link,
  Bell,
  CheckCircle2
} from 'lucide-react';

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

export const SchedulesPage = ({ state }: { state: any }) => {
  const [activeTab, setActiveTab] = React.useState('schedules');

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight">Automation Engine</h2>
          <p className="text-slate-400 font-medium">Schedule and automate your home's intelligence.</p>
        </div>
        <button className="px-8 py-3 rounded-2xl bg-blue-500 text-white font-black text-sm hover:bg-blue-600 transition-all shadow-xl shadow-blue-500/20 flex items-center gap-3">
          <Plus size={20} />
          Create New
        </button>
      </div>

      <div className="flex items-center gap-2 p-1.5 glass rounded-2xl w-fit border border-slate-800/50">
        {[
          { id: 'schedules', label: 'Schedules', icon: Calendar },
          { id: 'automations', label: 'Smart Automations', icon: Zap },
          { id: 'history', label: 'Execution Log', icon: Activity }
        ].map(tab => (
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

      {activeTab === 'schedules' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {state.schedules.map((s: any) => (
            <Card key={s.id} className="p-8 flex flex-col justify-between h-64 border border-slate-800/50">
              <div>
                <div className="flex justify-between items-start mb-6">
                  <div className="p-4 rounded-2xl bg-slate-800 text-blue-400 shadow-lg">
                    <Clock size={28} />
                  </div>
                  <Toggle on={s.active} onClick={() => state.toggleSchedule(s.id)} />
                </div>
                <h3 className="text-xl font-black text-white mb-2">{s.name}</h3>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">{s.device} • {s.action}</p>
              </div>
              
              <div className="flex items-center justify-between pt-6 border-t border-slate-800 mt-6">
                <div className="flex items-center gap-3">
                  <span className="text-lg font-black text-white">{s.start}</span>
                  <span className="text-[10px] text-slate-500 uppercase font-bold px-3 py-1 rounded-full bg-slate-900 border border-slate-800">{s.repeat}</span>
                </div>
                <button 
                  onClick={() => state.deleteSchedule(s.id)}
                  className="p-3 text-slate-600 hover:text-red-400 transition-colors"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {activeTab === 'automations' && (
        <div className="grid md:grid-cols-2 gap-6">
          {state.automations.map((a: any) => (
            <div key={a.id} className="glass rounded-3xl p-8 flex items-center justify-between border border-slate-800/50 hover:border-blue-500/30 transition-all group">
              <div className="flex items-center gap-8">
                <div className="p-6 rounded-2xl text-4xl shadow-xl group-hover:scale-110 transition-transform" style={{ backgroundColor: a.iconBg }}>
                  {a.icon === 'Home' ? '🏠' : a.icon === 'Moon' ? '🌙' : '⚡'}
                </div>
                <div>
                  <div className="font-black text-white text-xl mb-1">{a.name}</div>
                  <div className="text-xs text-slate-500 font-bold uppercase tracking-widest">Trigger: {a.trigger}</div>
                </div>
              </div>
              <Toggle on={a.active} onClick={() => state.toggleAutomation(a.id)} />
            </div>
          ))}
        </div>
      )}

      {activeTab === 'history' && (
        <div className="space-y-4">
          {[
            { event: 'Good Night Routine', status: 'Success', time: '11:00 PM', duration: '1.2s' },
            { event: 'Morning Coffee Start', status: 'Success', time: '07:00 AM', duration: '0.8s' },
            { event: 'Security Arming', status: 'Success', time: '08:30 AM', duration: '2.4s' },
            { event: 'HVAC Optimization', status: 'Success', time: '02:00 PM', duration: '1.5s' }
          ].map((log, i) => (
            <div key={i} className="p-6 glass rounded-3xl border border-slate-800/50 flex items-center justify-between hover:border-blue-500/30 transition-all">
              <div className="flex items-center gap-6">
                <div className="p-4 rounded-2xl bg-emerald-500/10 text-emerald-500">
                  <CheckCircle2 size={24} />
                </div>
                <div>
                  <div className="font-black text-white text-lg">{log.event}</div>
                  <div className="text-xs text-slate-500 font-bold uppercase tracking-widest">Executed at {log.time} • Duration: {log.duration}</div>
                </div>
              </div>
              <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                {log.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

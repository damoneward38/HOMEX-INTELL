import React from 'react';
import { motion } from 'motion/react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  Lock, 
  Clock, 
  Mic, 
  Volume2, 
  Eye, 
  Settings,
  Shield,
  History,
  Video
} from 'lucide-react';

const Card = ({ children, className = "", active = false, ...props }: { children: React.ReactNode, className?: string, active?: boolean, [key: string]: any }) => (
  <div className={`glass rounded-3xl p-6 card-hover ${active ? 'ring-2 ring-emerald-500/50 bg-emerald-500/5' : ''} ${className}`} {...props}>
    {children}
  </div>
);

export const SecurityPage = ({ state }: { state: any }) => {
  const [activeTab, setActiveTab] = React.useState('live');
  const [ringToken, setRingToken] = React.useState(state.apiKeys?.ring_api_key || '');

  const handleSaveAPI = async () => {
    await state.saveApiKeys({ ...state.apiKeys, ring_api_key: ringToken });
  };

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight">Security Command Center</h2>
          <p className="text-slate-400 font-medium">Real-time monitoring and perimeter defense.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={state.toggleSecurity}
            className={`px-8 py-3 rounded-2xl font-black text-sm transition-all flex items-center gap-3 ${state.securityStatus.armed ? 'bg-emerald-500 text-white shadow-xl shadow-emerald-500/30' : 'bg-red-500 text-white shadow-xl shadow-red-500/30'}`}
          >
            {state.securityStatus.armed ? <ShieldCheck size={20} /> : <AlertTriangle size={20} />}
            {state.securityStatus.armed ? 'System Armed' : 'System Disarmed'}
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Viewport */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center gap-2 p-1.5 glass rounded-2xl w-fit border border-slate-800/50">
            {[
              { id: 'live', label: 'Live Feed', icon: Video },
              { id: 'history', label: 'Event History', icon: History },
              { id: 'settings', label: 'Security Settings', icon: Settings }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === tab.id ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'text-slate-500 hover:text-slate-300'}`}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === 'live' && (
            <Card className="p-0 overflow-hidden relative aspect-video group border border-slate-800/50">
              <img 
                src="https://picsum.photos/seed/security-cam/1920/1080" 
                alt="Live Camera Feed" 
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
              <div className="absolute top-6 left-6 flex items-center gap-3 px-4 py-2 rounded-full bg-red-500/90 text-white text-xs font-black uppercase tracking-widest animate-pulse shadow-xl">
                <div className="w-2 h-2 rounded-full bg-white" />
                Live Feed: Front Entrance
              </div>
              <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                <div className="p-4 rounded-2xl glass backdrop-blur-xl border border-white/10">
                  <div className="text-xl font-black text-white tracking-tight">Main Gate</div>
                  <div className="text-xs text-slate-300 font-medium">Motion detected 2m ago • 1080p HDR</div>
                </div>
                <div className="flex gap-3">
                  <button className="p-4 rounded-2xl glass backdrop-blur-xl text-white hover:bg-emerald-500 transition-all shadow-xl">
                    <Mic size={24} />
                  </button>
                  <button className="p-4 rounded-2xl glass backdrop-blur-xl text-white hover:bg-emerald-500 transition-all shadow-xl">
                    <Volume2 size={24} />
                  </button>
                </div>
              </div>
            </Card>
          )}

          {activeTab === 'history' && (
            <div className="space-y-4">
              {[
                { event: 'Motion Detected', time: '10:45 AM', location: 'Front Door', type: 'warning' },
                { event: 'System Armed', time: '08:00 AM', location: 'Internal', type: 'info' },
                { event: 'Person Spotted', time: '07:30 AM', location: 'Driveway', type: 'warning' },
                { event: 'Gate Closed', time: '07:15 AM', location: 'Main Entrance', type: 'info' }
              ].map((log, i) => (
                <div key={i} className="p-6 glass rounded-3xl border border-slate-800/50 flex items-center justify-between hover:border-emerald-500/30 transition-all">
                  <div className="flex items-center gap-6">
                    <div className={`p-4 rounded-2xl ${log.type === 'warning' ? 'bg-orange-500/10 text-orange-400' : 'bg-blue-500/10 text-blue-400'}`}>
                      {log.type === 'warning' ? <AlertTriangle size={24} /> : <ShieldCheck size={24} />}
                    </div>
                    <div>
                      <div className="font-black text-white text-lg">{log.event}</div>
                      <div className="text-xs text-slate-500 font-bold uppercase tracking-widest">{log.location} • {log.time}</div>
                    </div>
                  </div>
                  <button className="text-xs font-black text-emerald-400 uppercase tracking-widest hover:text-emerald-300">View Clip</button>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'settings' && (
            <Card className="p-8 border-l-4 border-emerald-500">
              <h3 className="text-xl font-black text-white mb-6">Ring Integration</h3>
              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Ring API Refresh Token</label>
                  <input 
                    type="password" 
                    value={ringToken}
                    onChange={(e) => setRingToken(e.target.value)}
                    placeholder="Enter your Ring refresh token"
                    className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 text-white outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                  />
                </div>
                <button 
                  onClick={handleSaveAPI}
                  className="px-8 py-4 rounded-2xl bg-emerald-500 text-white font-black hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-500/20"
                >
                  Save Security API
                </button>
              </div>
            </Card>
          )}
        </div>

        {/* Sidebar Info */}
        <div className="space-y-8">
          <Card className="bg-emerald-500/5 border-emerald-500/20">
            <h3 className="font-black text-white mb-6 flex items-center gap-3 uppercase tracking-widest text-sm">
              <Shield size={18} className="text-emerald-400" /> System Status
            </h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400 font-medium">Perimeter</span>
                <span className="text-sm text-emerald-400 font-black uppercase">Secure</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400 font-medium">Sensors</span>
                <span className="text-sm text-emerald-400 font-black uppercase">12 Online</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400 font-medium">Last Event</span>
                <span className="text-sm text-white font-black uppercase">{state.securityStatus.lastEvent}</span>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="font-black text-white mb-6 flex items-center gap-3 uppercase tracking-widest text-sm">
              <Lock size={18} className="text-blue-400" /> Smart Locks
            </h3>
            <div className="space-y-4">
              {['Front Door', 'Garage', 'Back Patio'].map(lock => (
                <div key={lock} className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800 flex items-center justify-between">
                  <span className="text-sm font-bold text-white">{lock}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black text-emerald-500 uppercase">Locked</span>
                    <button className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white">
                      <Settings size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

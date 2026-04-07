import React from 'react';
import { motion } from 'motion/react';
import { 
  Heart, 
  Activity, 
  Moon, 
  Zap, 
  Settings, 
  Cpu, 
  Link,
  Sun,
  TrendingUp,
  TrendingDown,
  Clock,
  User
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

const Card = ({ children, className = "", active = false, ...props }: { children: React.ReactNode, className?: string, active?: boolean, [key: string]: any }) => (
  <div className={`glass rounded-3xl p-6 card-hover ${active ? 'ring-2 ring-red-500/50 bg-red-500/5' : ''} ${className}`} {...props}>
    {children}
  </div>
);

export const HealthPage = ({ state }: { state: any }) => {
  const [activeTab, setActiveTab] = React.useState('stats');
  const [fitbitToken, setFitbitToken] = React.useState(state.apiKeys?.fitbit_token || '');

  const handleSaveAPI = async () => {
    await state.saveApiKeys({ ...state.apiKeys, fitbit_token: fitbitToken });
  };

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight">Health Intelligence</h2>
          <p className="text-slate-400 font-medium">Real-time biometric monitoring and wellness tracking.</p>
        </div>
        <div className="flex gap-3">
          <div className="px-6 py-3 rounded-2xl glass border border-slate-800 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-red-500/10 text-red-500">
              <Heart size={24} />
            </div>
            <div>
              <div className="text-2xl font-black text-white">{state.healthData.heartRate} <span className="text-sm font-medium text-slate-500">BPM</span></div>
              <div className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest flex items-center gap-1">
                <TrendingDown size={10} /> Resting: 64 BPM
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center gap-2 p-1.5 glass rounded-2xl w-fit border border-slate-800/50">
            {[
              { id: 'stats', label: 'Biometrics', icon: Activity },
              { id: 'sleep', label: 'Sleep Quality', icon: Moon },
              { id: 'settings', label: 'Health Settings', icon: Settings }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === tab.id ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'text-slate-500 hover:text-slate-300'}`}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === 'stats' && (
            <div className="space-y-8">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {[
                  { label: 'Steps', value: state.healthData.steps.toLocaleString(), icon: Activity, color: 'text-blue-400', bg: 'bg-blue-500/10' },
                  { label: 'Calories', value: `${state.healthData.calories} kcal`, icon: Zap, color: 'text-orange-400', bg: 'bg-orange-500/10' },
                  { label: 'Blood Pressure', value: state.healthData.bloodPressure, icon: Activity, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
                  { label: 'Oxygen Level', value: `${state.healthData.oxygenLevel}%`, icon: Activity, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
                  { label: 'Active Minutes', value: '45m', icon: Clock, color: 'text-purple-400', bg: 'bg-purple-500/10' },
                  { label: 'Hydration', value: '1.2L', icon: Activity, color: 'text-blue-500', bg: 'bg-blue-500/10' }
                ].map(stat => (
                  <Card key={stat.label} className="p-6 border border-slate-800/50 text-center">
                    <div className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                      <stat.icon size={24} />
                    </div>
                    <div className="text-2xl font-black text-white mb-1">{stat.value}</div>
                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{stat.label}</div>
                  </Card>
                ))}
              </div>

              <Card className="p-8 border border-slate-800/50">
                <h3 className="text-xl font-black text-white mb-10">Heart Rate Trends</h3>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={[
                      { time: '08:00', bpm: 68 },
                      { time: '10:00', bpm: 72 },
                      { time: '12:00', bpm: 85 },
                      { time: '14:00', bpm: 78 },
                      { time: '16:00', bpm: 92 },
                      { time: '18:00', bpm: 75 }
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                      <XAxis dataKey="time" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                      <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                        itemStyle={{ color: '#ef4444', fontSize: '12px' }}
                      />
                      <Line type="monotone" dataKey="bpm" stroke="#ef4444" strokeWidth={3} dot={{ fill: '#ef4444', r: 4 }} activeDot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'sleep' && (
            <div className="space-y-8">
              <Card className="p-8 border border-slate-800/50">
                <div className="flex justify-between items-center mb-10">
                  <div>
                    <h3 className="text-xl font-black text-white">Sleep Analysis</h3>
                    <p className="text-slate-500 text-sm font-medium">Last Night: {state.healthData.sleep}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-black text-white">88%</div>
                    <div className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">Sleep Score</div>
                  </div>
                </div>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={[
                      { time: '22:00', depth: 10 },
                      { time: '00:00', depth: 80 },
                      { time: '02:00', depth: 40 },
                      { time: '04:00', depth: 90 },
                      { time: '06:00', depth: 20 },
                      { time: '08:00', depth: 0 }
                    ]}>
                      <defs>
                        <linearGradient id="colorSleep" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                      <XAxis dataKey="time" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                      <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                        itemStyle={{ color: '#8b5cf6', fontSize: '12px' }}
                      />
                      <Area type="monotone" dataKey="depth" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorSleep)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              <div className="grid md:grid-cols-3 gap-6">
                {[
                  { label: 'Deep Sleep', value: '2h 15m', color: 'text-indigo-400' },
                  { label: 'REM Sleep', value: '1h 45m', color: 'text-purple-400' },
                  { label: 'Light Sleep', value: '3h 30m', color: 'text-blue-400' }
                ].map(stat => (
                  <Card key={stat.label} className="p-6 border border-slate-800/50 text-center">
                    <div className={`text-2xl font-black text-white mb-1 ${stat.color}`}>{stat.value}</div>
                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{stat.label}</div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <Card className="p-8 border-l-4 border-red-500">
              <h3 className="text-xl font-black text-white mb-6">Fitbit Integration</h3>
              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Fitbit OAuth Token</label>
                  <input 
                    type="password" 
                    value={fitbitToken}
                    onChange={(e) => setFitbitToken(e.target.value)}
                    placeholder="Enter your Fitbit token"
                    className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 text-white outline-none focus:ring-2 focus:ring-red-500 transition-all"
                  />
                </div>
                <button 
                  onClick={handleSaveAPI}
                  className="px-8 py-4 rounded-2xl bg-red-500 text-white font-black hover:bg-red-600 transition-all shadow-xl shadow-red-500/20"
                >
                  Save Health API
                </button>
              </div>
            </Card>
          )}
        </div>

        <div className="space-y-8">
          <Card className="bg-red-500/5 border-red-500/20">
            <h3 className="font-black text-white mb-6 flex items-center gap-3 uppercase tracking-widest text-sm">
              <User size={18} className="text-red-400" /> Wellness Profile
            </h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400 font-medium">BMI</span>
                <span className="text-sm text-emerald-400 font-black uppercase">22.4 (Normal)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400 font-medium">Daily Goal</span>
                <span className="text-sm text-white font-black uppercase">85% Completed</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-red-500 h-full w-[85%]" />
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="font-black text-white mb-6 flex items-center gap-3 uppercase tracking-widest text-sm">
              <Activity size={18} className="text-blue-400" /> System Insights
            </h3>
            <div className="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/20">
              <p className="text-xs text-slate-300 leading-relaxed italic">
                "Your heart rate variability is up 5% today. Great job on the morning walk! Consider an earlier bedtime to optimize recovery."
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

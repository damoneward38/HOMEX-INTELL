import React from 'react';
import { motion } from 'motion/react';
import { 
  Zap, 
  TrendingDown, 
  TrendingUp, 
  Clock, 
  Settings, 
  Activity, 
  Cpu, 
  Link,
  Sun,
  Battery
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';

const Card = ({ children, className = "", active = false, ...props }: { children: React.ReactNode, className?: string, active?: boolean, [key: string]: any }) => (
  <div className={`glass rounded-3xl p-6 card-hover ${active ? 'ring-2 ring-yellow-500/50 bg-yellow-500/5' : ''} ${className}`} {...props}>
    {children}
  </div>
);

export const EnergyPage = ({ state }: { state: any }) => {
  const [activeTab, setActiveTab] = React.useState('usage');
  const [smartThingsToken, setSmartThingsToken] = React.useState(state.apiKeys?.smartthings_token || '');

  const handleSaveAPI = async () => {
    await state.saveApiKeys({ ...state.apiKeys, smartthings_token: smartThingsToken });
  };

  const totalEnergy = state.energyData.reduce((acc: number, d: any) => acc + d.usage, 0).toFixed(1);

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight">Energy Intelligence</h2>
          <p className="text-slate-400 font-medium">Monitor consumption and optimize your home's efficiency.</p>
        </div>
        <div className="flex gap-3">
          <div className="px-6 py-3 rounded-2xl glass border border-slate-800 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-yellow-500/10 text-yellow-500">
              <Zap size={24} />
            </div>
            <div>
              <div className="text-2xl font-black text-white">{totalEnergy} <span className="text-sm font-medium text-slate-500">kW/h</span></div>
              <div className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest flex items-center gap-1">
                <TrendingDown size={10} /> -12% vs Last Week
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center gap-2 p-1.5 glass rounded-2xl w-fit border border-slate-800/50">
            {[
              { id: 'usage', label: 'Usage Analytics', icon: Activity },
              { id: 'devices', label: 'Device Breakdown', icon: Cpu },
              { id: 'settings', label: 'Energy Settings', icon: Settings }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === tab.id ? 'bg-yellow-500 text-white shadow-lg shadow-yellow-500/20' : 'text-slate-500 hover:text-slate-300'}`}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === 'usage' && (
            <Card className="p-8 border border-slate-800/50">
              <div className="flex justify-between items-center mb-10">
                <h3 className="text-xl font-black text-white">Consumption Trends</h3>
                <div className="flex gap-2">
                  {['Day', 'Week', 'Month'].map(period => (
                    <button key={period} className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${period === 'Day' ? 'bg-yellow-500 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}>
                      {period}
                    </button>
                  ))}
                </div>
              </div>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={state.energyData}>
                    <defs>
                      <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#eab308" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#eab308" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis dataKey="time" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                      itemStyle={{ color: '#eab308', fontSize: '12px' }}
                    />
                    <Area type="monotone" dataKey="usage" stroke="#eab308" fillOpacity={1} fill="url(#colorUsage)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>
          )}

          {activeTab === 'devices' && (
            <div className="grid md:grid-cols-2 gap-6">
              {[
                { name: 'HVAC System', usage: 4.2, color: 'text-blue-400', bg: 'bg-blue-500/10' },
                { name: 'Kitchen Appliances', usage: 2.1, color: 'text-orange-400', bg: 'bg-orange-500/10' },
                { name: 'Lighting Network', usage: 0.8, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
                { name: 'Entertainment Hub', usage: 1.2, color: 'text-purple-400', bg: 'bg-purple-500/10' }
              ].map(device => (
                <Card key={device.name} className="p-6 border border-slate-800/50 flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className={`p-4 rounded-2xl ${device.bg} ${device.color}`}>
                      <Zap size={24} />
                    </div>
                    <div>
                      <div className="font-black text-white text-lg">{device.name}</div>
                      <div className="text-xs text-slate-500 font-bold uppercase tracking-widest">{device.usage} kW/h Current</div>
                    </div>
                  </div>
                  <button className="p-3 rounded-xl bg-slate-800 text-slate-400 hover:text-white">
                    <Settings size={18} />
                  </button>
                </Card>
              ))}
            </div>
          )}

          {activeTab === 'settings' && (
            <Card className="p-8 border-l-4 border-yellow-500">
              <h3 className="text-xl font-black text-white mb-6">SmartThings Integration</h3>
              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest">SmartThings Personal Access Token</label>
                  <input 
                    type="password" 
                    value={smartThingsToken}
                    onChange={(e) => setSmartThingsToken(e.target.value)}
                    placeholder="Enter your SmartThings token"
                    className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 text-white outline-none focus:ring-2 focus:ring-yellow-500 transition-all"
                  />
                </div>
                <button 
                  onClick={handleSaveAPI}
                  className="px-8 py-4 rounded-2xl bg-yellow-500 text-white font-black hover:bg-yellow-600 transition-all shadow-xl shadow-yellow-500/20"
                >
                  Save Energy API
                </button>
              </div>
            </Card>
          )}
        </div>

        <div className="space-y-8">
          <Card className="bg-yellow-500/5 border-yellow-500/20">
            <h3 className="font-black text-white mb-6 flex items-center gap-3 uppercase tracking-widest text-sm">
              <Sun size={18} className="text-yellow-400" /> Solar Generation
            </h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400 font-medium">Current Yield</span>
                <span className="text-sm text-emerald-400 font-black uppercase">3.4 kW</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400 font-medium">Daily Total</span>
                <span className="text-sm text-white font-black uppercase">18.2 kW/h</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-yellow-500 h-full w-[70%]" />
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="font-black text-white mb-6 flex items-center gap-3 uppercase tracking-widest text-sm">
              <Battery size={18} className="text-blue-400" /> Home Battery
            </h3>
            <div className="text-center py-6">
              <div className="text-4xl font-black text-white mb-2">84%</div>
              <div className="text-xs text-slate-500 font-bold uppercase tracking-widest">Charged • Discharging</div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase">
                <span>Backup Capacity</span>
                <span>12.4 kW/h Remaining</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full w-[84%]" />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { motion } from 'motion/react';
import { 
  Thermometer, 
  Droplets, 
  Wind, 
  Settings, 
  Activity, 
  Cpu, 
  Link,
  Sun,
  Cloud,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

const Card = ({ children, className = "", active = false, ...props }: { children: React.ReactNode, className?: string, active?: boolean, [key: string]: any }) => (
  <div className={`glass rounded-3xl p-6 card-hover ${active ? 'ring-2 ring-blue-500/50 bg-blue-500/5' : ''} ${className}`} {...props}>
    {children}
  </div>
);

export const ClimatePage = ({ state }: { state: any }) => {
  const [activeTab, setActiveTab] = React.useState('controls');
  const [nestToken, setNestToken] = React.useState(state.apiKeys?.nest_api_key || '');

  const handleSaveAPI = async () => {
    await state.saveApiKeys({ ...state.apiKeys, nest_api_key: nestToken });
  };

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight">Climate Intelligence</h2>
          <p className="text-slate-400 font-medium">Precision temperature and air quality management.</p>
        </div>
        <div className="flex gap-3">
          <div className="px-6 py-3 rounded-2xl glass border border-slate-800 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-blue-500/10 text-blue-500">
              <Thermometer size={24} />
            </div>
            <div>
              <div className="text-2xl font-black text-white">{state.climateData.indoorTemp}°F</div>
              <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Indoor Temperature</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center gap-2 p-1.5 glass rounded-2xl w-fit border border-slate-800/50">
            {[
              { id: 'controls', label: 'Thermostat', icon: Thermometer },
              { id: 'air', label: 'Air Quality', icon: Wind },
              { id: 'settings', label: 'Climate Settings', icon: Settings }
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

          {activeTab === 'controls' && (
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="p-10 flex flex-col items-center justify-center border border-slate-800/50">
                <div className="relative w-64 h-64 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-8 border-slate-800" />
                  <div className="absolute inset-0 rounded-full border-8 border-blue-500 border-t-transparent animate-spin-slow" />
                  <div className="text-center">
                    <div className="text-6xl font-black text-white mb-2">{state.climateData.targetTemp}°</div>
                    <div className="text-xs text-slate-500 font-bold uppercase tracking-widest">Target Temperature</div>
                  </div>
                </div>
                <div className="flex gap-6 mt-10">
                  <button 
                    onClick={() => state.setHeatTemp(state.climateData.targetTemp - 1)}
                    className="p-6 rounded-3xl glass border border-slate-800 text-white hover:bg-blue-500 transition-all shadow-xl"
                  >
                    <ArrowDown size={32} />
                  </button>
                  <button 
                    onClick={() => state.setHeatTemp(state.climateData.targetTemp + 1)}
                    className="p-6 rounded-3xl glass border border-slate-800 text-white hover:bg-blue-500 transition-all shadow-xl"
                  >
                    <ArrowUp size={32} />
                  </button>
                </div>
              </Card>

              <div className="space-y-6">
                <Card className="p-6 border border-slate-800/50">
                  <h3 className="font-black text-white mb-6 uppercase tracking-widest text-sm">HVAC Mode</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {['Heat', 'Cool', 'Auto'].map(mode => (
                      <button key={mode} className={`py-4 rounded-2xl text-xs font-bold transition-all ${mode === 'Heat' ? 'bg-blue-500 text-white shadow-lg' : 'glass border border-slate-800 text-slate-500 hover:text-slate-300'}`}>
                        {mode}
                      </button>
                    ))}
                  </div>
                </Card>
                <Card className="p-6 border border-slate-800/50">
                  <h3 className="font-black text-white mb-6 uppercase tracking-widest text-sm">Fan Speed</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {['Low', 'Med', 'High'].map(speed => (
                      <button key={speed} className={`py-4 rounded-2xl text-xs font-bold transition-all ${speed === 'Med' ? 'bg-blue-500 text-white shadow-lg' : 'glass border border-slate-800 text-slate-500 hover:text-slate-300'}`}>
                        {speed}
                      </button>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'air' && (
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { label: 'Humidity', value: `${state.climateData.humidity}%`, icon: Droplets, color: 'text-blue-400', bg: 'bg-blue-500/10' },
                { label: 'Air Quality', value: 'Excellent', icon: Wind, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
                { label: 'CO2 Level', value: '420 ppm', icon: Activity, color: 'text-orange-400', bg: 'bg-orange-500/10' }
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
          )}

          {activeTab === 'settings' && (
            <Card className="p-8 border-l-4 border-blue-500">
              <h3 className="text-xl font-black text-white mb-6">Nest Integration</h3>
              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Nest API Key</label>
                  <input 
                    type="password" 
                    value={nestToken}
                    onChange={(e) => setNestToken(e.target.value)}
                    placeholder="Enter your Nest API key"
                    className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>
                <button 
                  onClick={handleSaveAPI}
                  className="px-8 py-4 rounded-2xl bg-blue-500 text-white font-black hover:bg-blue-600 transition-all shadow-xl shadow-blue-500/20"
                >
                  Save Climate API
                </button>
              </div>
            </Card>
          )}
        </div>

        <div className="space-y-8">
          <Card className="bg-blue-500/5 border-blue-500/20">
            <h3 className="font-black text-white mb-6 flex items-center gap-3 uppercase tracking-widest text-sm">
              <Sun size={18} className="text-orange-400" /> Outdoor Weather
            </h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400 font-medium">Outside Temp</span>
                <span className="text-sm text-white font-black uppercase">{state.climateData.outdoorTemp}°F</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400 font-medium">Condition</span>
                <span className="text-sm text-white font-black uppercase flex items-center gap-2">
                  <Cloud size={14} className="text-slate-400" /> Partly Cloudy
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400 font-medium">Wind Speed</span>
                <span className="text-sm text-white font-black uppercase">12 mph NW</span>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="font-black text-white mb-6 flex items-center gap-3 uppercase tracking-widest text-sm">
              <Activity size={18} className="text-emerald-400" /> Efficiency Score
            </h3>
            <div className="text-center py-6">
              <div className="text-4xl font-black text-white mb-2">92%</div>
              <div className="text-xs text-slate-500 font-bold uppercase tracking-widest">Optimal Performance</div>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full w-[92%]" />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

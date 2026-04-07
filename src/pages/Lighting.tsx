import React from 'react';
import { motion } from 'motion/react';
import { 
  Lightbulb, 
  Settings, 
  Activity, 
  Cpu, 
  Link,
  Sun,
  Moon,
  Palette,
  Layers,
  Power,
  Zap
} from 'lucide-react';
import { ROOMS } from '../constants';

const Card = ({ children, className = "", active = false, ...props }: { children: React.ReactNode, className?: string, active?: boolean, [key: string]: any }) => (
  <div className={`glass rounded-3xl p-6 card-hover ${active ? 'ring-2 ring-yellow-500/50 bg-yellow-500/5' : ''} ${className}`} {...props}>
    {children}
  </div>
);

const Toggle = ({ on, onClick, activeColor = 'bg-yellow-500' }: { on: boolean, onClick: () => void, activeColor?: string }) => (
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

export const LightingPage = ({ state }: { state: any }) => {
  const [activeTab, setActiveTab] = React.useState('rooms');
  const [hueToken, setHueToken] = React.useState(state.apiKeys?.hue_api_key || '');

  const handleSaveAPI = async () => {
    await state.saveApiKeys({ ...state.apiKeys, hue_api_key: hueToken });
  };

  const lightingDevices = state.devices.filter((d: any) => d.type === 'lighting');

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight">Lighting Intelligence</h2>
          <p className="text-slate-400 font-medium">Adaptive illumination and smart ambiance control.</p>
        </div>
        <div className="flex gap-3">
          <div className="px-6 py-3 rounded-2xl glass border border-slate-800 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-yellow-500/10 text-yellow-500">
              <Lightbulb size={24} />
            </div>
            <div>
              <div className="text-2xl font-black text-white">{lightingDevices.filter((d: any) => d.on).length} <span className="text-sm font-medium text-slate-500">Active</span></div>
              <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Lights Online</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center gap-2 p-1.5 glass rounded-2xl w-fit border border-slate-800/50">
            {[
              { id: 'rooms', label: 'By Room', icon: Layers },
              { id: 'scenes', label: 'Lighting Scenes', icon: Palette },
              { id: 'settings', label: 'Lighting Settings', icon: Settings }
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

          {activeTab === 'rooms' && (
            <div className="grid md:grid-cols-2 gap-6">
              {ROOMS.map(room => {
                const roomDevices = lightingDevices.filter((d: any) => d.room === room.name);
                if (roomDevices.length === 0) return null;
                const allOn = roomDevices.every((d: any) => d.on);
                
                return (
                  <Card key={room.name} className="p-8 border border-slate-800/50">
                    <div className="flex justify-between items-start mb-8">
                      <div>
                        <h3 className="text-xl font-black text-white mb-1">{room.name}</h3>
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">{roomDevices.length} Smart Bulbs</p>
                      </div>
                      <Toggle 
                        on={allOn} 
                        onClick={() => roomDevices.forEach((d: any) => state.toggleDevice(d.id))} 
                      />
                    </div>
                    <div className="space-y-4">
                      {roomDevices.map((d: any) => (
                        <div key={d.id} className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/50 border border-slate-800 group hover:border-yellow-500/30 transition-all">
                          <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-xl ${d.on ? 'bg-yellow-500 text-white shadow-lg' : 'bg-slate-800 text-slate-500'}`}>
                              <Lightbulb size={20} />
                            </div>
                            <span className="text-sm font-bold text-white">{d.name}</span>
                          </div>
                          <Toggle on={d.on} onClick={() => state.toggleDevice(d.id)} />
                        </div>
                      ))}
                    </div>
                  </Card>
                );
              })}
            </div>
          )}

          {activeTab === 'scenes' && (
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { name: 'Reading', icon: Sun, color: 'text-orange-400', bg: 'bg-orange-500/10', hBg: 'bg-orange-500' },
                { name: 'Relax', icon: Moon, color: 'text-indigo-400', bg: 'bg-indigo-500/10', hBg: 'bg-indigo-500' },
                { name: 'Concentrate', icon: Activity, color: 'text-blue-400', bg: 'bg-blue-500/10', hBg: 'bg-blue-500' },
                { name: 'Energize', icon: Zap, color: 'text-yellow-400', bg: 'bg-yellow-500/10', hBg: 'bg-yellow-500' },
                { name: 'Movie', icon: Palette, color: 'text-purple-400', bg: 'bg-purple-500/10', hBg: 'bg-purple-500' },
                { name: 'Nightlight', icon: Moon, color: 'text-slate-400', bg: 'bg-slate-500/10', hBg: 'bg-slate-500' }
              ].map(scene => (
                <button 
                  key={scene.name}
                  className="p-8 rounded-3xl glass border border-slate-800/50 flex flex-col items-center gap-4 hover:bg-slate-800/50 transition-all group"
                >
                  <div className={`p-5 rounded-2xl ${scene.bg} ${scene.color} group-hover:${scene.hBg} group-hover:text-white transition-all shadow-xl`}>
                    <scene.icon size={32} />
                  </div>
                  <span className="text-sm font-black text-white tracking-tight">{scene.name}</span>
                </button>
              ))}
            </div>
          )}

          {activeTab === 'settings' && (
            <Card className="p-8 border-l-4 border-yellow-500">
              <h3 className="text-xl font-black text-white mb-6">Philips Hue Integration</h3>
              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Hue Bridge API Key</label>
                  <input 
                    type="password" 
                    value={hueToken}
                    onChange={(e) => setHueToken(e.target.value)}
                    placeholder="Enter your Hue API key"
                    className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 text-white outline-none focus:ring-2 focus:ring-yellow-500 transition-all"
                  />
                </div>
                <button 
                  onClick={handleSaveAPI}
                  className="px-8 py-4 rounded-2xl bg-yellow-500 text-white font-black hover:bg-yellow-600 transition-all shadow-xl shadow-yellow-500/20"
                >
                  Save Lighting API
                </button>
              </div>
            </Card>
          )}
        </div>

        <div className="space-y-8">
          <Card className="bg-yellow-500/5 border-yellow-500/20">
            <h3 className="font-black text-white mb-6 flex items-center gap-3 uppercase tracking-widest text-sm">
              <Sun size={18} className="text-yellow-400" /> Circadian Lighting
            </h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400 font-medium">Color Temp</span>
                <span className="text-sm text-white font-black uppercase">4500K (Warm)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400 font-medium">Brightness</span>
                <span className="text-sm text-white font-black uppercase">65%</span>
              </div>
              <div className="w-full bg-gradient-to-r from-orange-500 via-yellow-200 to-blue-400 h-2 rounded-full" />
              <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest text-center">Syncing with natural daylight</div>
            </div>
          </Card>

          <Card>
            <h3 className="font-black text-white mb-6 flex items-center gap-3 uppercase tracking-widest text-sm">
              <Power size={18} className="text-red-400" /> Quick Overrides
            </h3>
            <div className="space-y-3">
              <button 
                onClick={() => lightingDevices.forEach((d: any) => state.toggleDevice(d.id))}
                className="w-full py-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 font-black text-sm hover:bg-red-500 hover:text-white transition-all"
              >
                All Lights Off
              </button>
              <button 
                className="w-full py-4 rounded-2xl glass border border-slate-800 text-white font-black text-sm hover:bg-slate-800 transition-all"
              >
                Emergency Flash
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Link as LinkIcon, 
  Cpu, 
  Bluetooth, 
  Search, 
  Activity, 
  Plus, 
  Trash2, 
  Settings, 
  Zap, 
  Bell,
  CheckCircle2,
  Lock,
  Clock,
  Mic,
  Home,
  Power,
  Play,
  Save,
  User,
  Database,
  Key
} from 'lucide-react';

const Card = ({ children, className = "", active = false, ...props }: { children: React.ReactNode, className?: string, active?: boolean, [key: string]: any }) => (
  <div className={`glass rounded-3xl p-8 card-hover ${active ? 'ring-2 ring-blue-500/50 bg-blue-500/5' : ''} ${className}`} {...props}>
    {children}
  </div>
);

export const UnitsPage = ({ state }: { state: any }) => {
  const [activeTab, setActiveTab] = React.useState('units');
  const [companyName, setCompanyName] = React.useState('');
  const [unitCode, setUnitCode] = React.useState('');
  const [routerId, setRouterId] = React.useState('');
  const [btCode, setBtCode] = React.useState('');
  const [btDevice, setBtDevice] = React.useState('');
  const [selectedUnitId, setSelectedUnitId] = React.useState('');

  const [healthStatus, setHealthStatus] = React.useState<any[]>([]);

  React.useEffect(() => {
    if (state.units.length > 0) {
      import('../engine').then(({ HomeEngine }) => {
        HomeEngine.getInstance().performSystemHealthCheck(state.units).then(setHealthStatus);
      });
    }
  }, [state.units]);

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight">Hardware Intelligence</h2>
          <p className="text-slate-400 font-medium">Manage your smart hubs, routers, and connected devices.</p>
        </div>
        <div className="flex gap-3">
          <div className="px-6 py-3 rounded-2xl glass border border-slate-800 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-blue-500/10 text-blue-500">
              <LinkIcon size={24} />
            </div>
            <div>
              <div className="text-2xl font-black text-white">{state.units.length} <span className="text-sm font-medium text-slate-500">Active</span></div>
              <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Hub Units Linked</div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 p-1.5 glass rounded-2xl w-fit border border-slate-800/50">
        {[
          { id: 'units', label: 'Hub Units', icon: LinkIcon },
          { id: 'routers', label: 'Heating Routers', icon: Cpu },
          { id: 'bluetooth', label: 'Bluetooth Pairing', icon: Bluetooth }
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

      <AnimatePresence mode="wait">
        {activeTab === 'units' && (
          <motion.div 
            key="units"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid lg:grid-cols-3 gap-8"
          >
            <div className="lg:col-span-2 space-y-8">
              <Card className="border-l-4 border-blue-500">
                <div className="flex justify-between items-center mb-10">
                  <h3 className="text-xl font-black text-white">Link New Hub Unit</h3>
                  <button 
                    onClick={state.scanForUnits}
                    disabled={state.isScanning}
                    className="text-xs font-black text-blue-400 hover:text-blue-300 uppercase tracking-widest flex items-center gap-2"
                  >
                    {state.isScanning ? <Activity size={14} className="animate-spin" /> : <Search size={14} />}
                    {state.isScanning ? 'Scanning Network...' : 'Scan for Units'}
                  </button>
                </div>
                
                {state.discoveredUnits.length > 0 && (
                  <div className="mb-10 p-6 rounded-3xl bg-blue-500/5 border border-blue-500/20 space-y-4">
                    <div className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Discovered on Network</div>
                    {state.discoveredUnits.map((u: any, i: number) => (
                      <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/50 border border-slate-800">
                        <div className="text-sm text-white font-bold">{u.companyName} <span className="text-slate-500 ml-2">({u.unitCode})</span></div>
                        <button 
                          onClick={() => state.linkUnit(u.companyName, u.unitCode)}
                          className="px-6 py-2 rounded-xl bg-blue-500 text-white text-xs font-black hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/20"
                        >
                          Link
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Company Name</label>
                      <input 
                        type="text" value={companyName} onChange={e => setCompanyName(e.target.value)}
                        placeholder="e.g. HomeX Global"
                        className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Unit Serial Code</label>
                      <input 
                        type="text" value={unitCode} onChange={e => setUnitCode(e.target.value)}
                        placeholder="e.g. HX-9000-X"
                        className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      />
                    </div>
                  </div>
                  <button 
                    onClick={() => { state.linkUnit(companyName, unitCode); setCompanyName(''); setUnitCode(''); }}
                    className="w-full py-4 rounded-2xl bg-blue-500 text-white font-black hover:bg-blue-600 transition-all shadow-xl shadow-blue-500/20"
                  >
                    Link Unit Manually
                  </button>
                </div>
              </Card>

              <div className="space-y-4">
                <h3 className="text-xl font-black text-white">Linked Hardware</h3>
                {state.units.map((u: any) => (
                  <div key={u.id} className="p-6 glass rounded-3xl border border-slate-800/50 flex items-center justify-between hover:border-blue-500/30 transition-all group">
                    <div className="flex items-center gap-6">
                      <div className="p-4 rounded-2xl bg-blue-500/10 text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-all shadow-lg">
                        <LinkIcon size={24} />
                      </div>
                      <div>
                        <div className="font-black text-white text-lg">{u.companyName}</div>
                        <div className="text-xs text-slate-500 font-bold uppercase tracking-widest">Serial: {u.unitCode} • Status: Online</div>
                      </div>
                    </div>
                    <button className="p-3 text-slate-600 hover:text-red-400 transition-colors">
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))}
                {state.units.length === 0 && (
                  <div className="p-12 glass rounded-3xl text-center text-slate-500 italic">No hub units linked yet.</div>
                )}
              </div>
            </div>

            <div className="space-y-8">
              <Card className="bg-emerald-500/5 border-emerald-500/20">
                <h3 className="font-black text-white mb-6 flex items-center gap-3 uppercase tracking-widest text-sm">
                  <Activity size={18} className="text-emerald-400" /> Hardware Health
                </h3>
                <div className="space-y-6">
                  {healthStatus.map((h, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <span className="text-sm text-slate-400 font-medium">{h.unit}</span>
                      <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-full ${h.status === 'Healthy' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                        {h.status}
                      </span>
                    </div>
                  ))}
                  {healthStatus.length === 0 && (
                    <div className="text-xs text-slate-500 italic">No health data available.</div>
                  )}
                </div>
              </Card>
            </div>
          </motion.div>
        )}

        {activeTab === 'routers' && (
          <motion.div 
            key="routers"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid lg:grid-cols-3 gap-8"
          >
            <div className="lg:col-span-2 space-y-8">
              <Card className="border-l-4 border-orange-500">
                <div className="flex justify-between items-center mb-10">
                  <h3 className="text-xl font-black text-white">Heating Router Management</h3>
                  {selectedUnitId && (
                    <button 
                      onClick={() => state.scanForRouters(selectedUnitId)}
                      disabled={state.isScanning}
                      className="text-xs font-black text-orange-400 hover:text-orange-300 uppercase tracking-widest flex items-center gap-2"
                    >
                      {state.isScanning ? <Activity size={14} className="animate-spin" /> : <Search size={14} />}
                      {state.isScanning ? 'Scanning Hub...' : 'Scan for Routers'}
                    </button>
                  )}
                </div>

                <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Target Hub Unit</label>
                    <select 
                      value={selectedUnitId} onChange={e => setSelectedUnitId(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 text-white outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                    >
                      <option value="">Select Hub Unit</option>
                      {state.units.map((u: any) => (
                        <option key={u.id} value={u.id}>{u.companyName} ({u.unitCode})</option>
                      ))}
                    </select>
                  </div>

                  {state.discoveredRouters.length > 0 && (
                    <div className="p-6 rounded-3xl bg-orange-500/5 border border-orange-500/20 space-y-4">
                      <div className="text-[10px] font-black text-orange-400 uppercase tracking-widest">Discovered Routers</div>
                      {state.discoveredRouters.map((r: any, i: number) => (
                        <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/50 border border-slate-800">
                          <div className="text-sm text-white font-bold">{r.routerId}</div>
                          <button 
                            onClick={() => state.addRouter(selectedUnitId, r.routerId)}
                            className="px-6 py-2 rounded-xl bg-orange-500 text-white text-xs font-black hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20"
                          >
                            Add
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-4">
                    <input 
                      type="text" value={routerId} onChange={e => setRouterId(e.target.value)}
                      placeholder="Manual Router ID"
                      className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl p-4 text-white outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                    />
                    <button 
                      onClick={() => { if(selectedUnitId) { state.addRouter(selectedUnitId, routerId); setRouterId(''); } }}
                      className="px-10 rounded-2xl bg-orange-500 text-white font-black hover:bg-orange-600 transition-all shadow-xl shadow-orange-500/20"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </Card>

              <div className="space-y-4">
                <h3 className="text-xl font-black text-white">Active Routers</h3>
                {state.routers.map((r: any) => (
                  <div key={r.id} className="p-6 glass rounded-3xl border border-slate-800/50 flex items-center justify-between hover:border-orange-500/30 transition-all group">
                    <div className="flex items-center gap-6">
                      <div className={`w-3 h-3 rounded-full ${r.status === 'online' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]'}`} />
                      <div>
                        <div className="font-black text-white text-lg">{r.routerId}</div>
                        <div className="text-xs text-slate-500 font-bold uppercase tracking-widest">Last Ping: {new Date(r.lastPing).toLocaleTimeString()}</div>
                      </div>
                    </div>
                    <button className="p-3 text-slate-600 hover:text-red-400 transition-colors">
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))}
                {state.routers.length === 0 && (
                  <div className="p-12 glass rounded-3xl text-center text-slate-500 italic">No routers added yet.</div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'bluetooth' && (
          <motion.div 
            key="bluetooth"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid lg:grid-cols-3 gap-8"
          >
            <div className="lg:col-span-2 space-y-8">
              <Card className="border-l-4 border-purple-500">
                <div className="flex justify-between items-center mb-10">
                  <h3 className="text-xl font-black text-white">Bluetooth Device Pairing</h3>
                  <button 
                    onClick={state.discoverBluetooth}
                    disabled={state.isScanning}
                    className="text-xs font-black text-purple-400 hover:text-purple-300 uppercase tracking-widest flex items-center gap-2"
                  >
                    {state.isScanning ? <Activity size={14} className="animate-spin" /> : <Search size={14} />}
                    {state.isScanning ? 'Discovering...' : 'Scan for Devices'}
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Target Hub Unit</label>
                    <select 
                      value={selectedUnitId} onChange={e => setSelectedUnitId(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 text-white outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                    >
                      <option value="">Select Target Unit</option>
                      {state.units.map((u: any) => (
                        <option key={u.id} value={u.id}>{u.companyName} ({u.unitCode})</option>
                      ))}
                    </select>
                  </div>

                  {state.discoveredBT.length > 0 && (
                    <div className="p-6 rounded-3xl bg-purple-500/5 border border-purple-500/20 space-y-4">
                      <div className="text-[10px] font-black text-purple-400 uppercase tracking-widest">Nearby Devices</div>
                      {state.discoveredBT.map((d: any, i: number) => (
                        <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/50 border border-slate-800">
                          <div className="text-sm text-white font-bold">{d.deviceName}</div>
                          <button 
                            onClick={() => state.logBluetoothActivity(selectedUnitId, d.activityCode, d.deviceName)}
                            className="px-6 py-2 rounded-xl bg-purple-500 text-white text-xs font-black hover:bg-purple-600 transition-all shadow-lg shadow-purple-500/20"
                          >
                            Pair
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Device Name</label>
                      <input 
                        type="text" value={btDevice} onChange={e => setBtDevice(e.target.value)}
                        placeholder="e.g. Smart Lock X"
                        className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 text-white outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Pairing Code</label>
                      <input 
                        type="text" value={btCode} onChange={e => setBtCode(e.target.value)}
                        placeholder="e.g. 123456"
                        className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 text-white outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                      />
                    </div>
                  </div>
                  <button 
                    onClick={() => { if(selectedUnitId) { state.logBluetoothActivity(selectedUnitId, btCode, btDevice); setBtCode(''); setBtDevice(''); } }}
                    className="w-full py-4 rounded-2xl bg-purple-500 text-white font-black hover:bg-purple-600 transition-all shadow-xl shadow-purple-500/20"
                  >
                    Pair Device Manually
                  </button>
                </div>
              </Card>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

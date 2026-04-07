import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Settings, 
  Cpu, 
  Link, 
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

export const SetupPage = ({ state }: { state: any }) => {
  const [activeTab, setActiveTab] = React.useState('personalization');
  const [appName, setAppName] = React.useState(state.appName);
  const [geminiKey, setGeminiKey] = React.useState(state.apiKeys?.gemini_api_key || '');

  const handleSavePersonalization = async () => {
    await state.saveApiKeys({ ...state.apiKeys, appName });
  };

  const handleSaveGemini = async () => {
    await state.saveApiKeys({ ...state.apiKeys, gemini_api_key: geminiKey });
  };

  const featureOptions = [
    { id: 'security', label: 'Security Overview', icon: ShieldCheck, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { id: 'energy', label: 'Energy Usage', icon: Zap, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
    { id: 'health', label: 'Smart Health', icon: Heart, color: 'text-red-400', bg: 'bg-red-500/10' },
    { id: 'voice', label: 'Voice Assistant', icon: Mic, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
    { id: 'lighting', label: 'Lighting Control', icon: Lightbulb, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
    { id: 'music', label: 'Music Player', icon: Music, color: 'text-purple-400', bg: 'bg-purple-500/10' },
    { id: 'climate', label: 'Climate Control', icon: Thermometer, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  ];

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight">Service Setup</h2>
          <p className="text-slate-400 font-medium">Configure your intelligence hub and personalize your experience.</p>
        </div>
        <div className="flex gap-3">
          <div className="px-6 py-3 rounded-2xl glass border border-slate-800 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-blue-500/10 text-blue-500">
              <Cpu size={24} />
            </div>
            <div>
              <div className="text-2xl font-black text-white">System Core</div>
              <div className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">v2.4.0 Active</div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 p-1.5 glass rounded-2xl w-fit border border-slate-800/50">
        {[
          { id: 'personalization', label: 'Personalization', icon: User },
          { id: 'api', label: 'API Integrations', icon: Key },
          { id: 'system', label: 'System Settings', icon: Database }
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
        {activeTab === 'personalization' && (
          <motion.div 
            key="personalization"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            <Card className="border-l-4 border-blue-500">
              <h3 className="text-xl font-black text-white mb-8">Brand Identity</h3>
              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Application Name</label>
                  <div className="flex gap-4">
                    <input 
                      type="text" 
                      value={appName}
                      onChange={(e) => setAppName(e.target.value)}
                      placeholder="Enter application name"
                      className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl p-4 text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                    <button 
                      onClick={handleSavePersonalization}
                      className="px-8 rounded-2xl bg-blue-500 text-white font-black hover:bg-blue-600 transition-all shadow-xl shadow-blue-500/20 flex items-center gap-3"
                    >
                      <Save size={20} />
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </Card>

            <Card>
              <h3 className="text-xl font-black text-white mb-8">Feature Toggling</h3>
              <p className="text-slate-500 text-sm font-medium mb-10">Select the features you want to enable for your personalized dashboard.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featureOptions.map(feature => (
                  <button 
                    key={feature.id}
                    onClick={() => state.toggleFeature(feature.id)}
                    className={`p-6 rounded-3xl glass border transition-all flex flex-col items-center gap-4 group ${state.enabledFeatures.includes(feature.id) ? 'border-blue-500/50 bg-blue-500/5' : 'border-slate-800/50 hover:border-blue-500/30'}`}
                  >
                    <div className={`p-5 rounded-2xl ${feature.bg} ${feature.color} group-hover:scale-110 transition-transform shadow-lg`}>
                      <feature.icon size={32} />
                    </div>
                    <div className="text-center">
                      <div className="font-black text-white tracking-tight">{feature.label}</div>
                      <div className={`text-[10px] font-bold uppercase tracking-widest mt-1 ${state.enabledFeatures.includes(feature.id) ? 'text-emerald-500' : 'text-slate-600'}`}>
                        {state.enabledFeatures.includes(feature.id) ? 'Enabled' : 'Disabled'}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </Card>
          </motion.div>
        )}

        {activeTab === 'api' && (
          <motion.div 
            key="api"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            <Card className="border-l-4 border-indigo-500">
              <div className="flex items-center gap-6 mb-8">
                <div className="p-4 rounded-2xl bg-indigo-500 text-white shadow-xl shadow-indigo-500/20">
                  <Mic size={32} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white tracking-tight">Gemini AI Core</h3>
                  <p className="text-slate-500 font-medium">Powers the Voice Assistant and system intelligence.</p>
                </div>
              </div>
              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Gemini API Key</label>
                  <div className="flex gap-4">
                    <input 
                      type="password" 
                      value={geminiKey}
                      onChange={(e) => setGeminiKey(e.target.value)}
                      placeholder="Enter your Gemini API key"
                      className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl p-4 text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    />
                    <button 
                      onClick={handleSaveGemini}
                      className="px-8 rounded-2xl bg-indigo-500 text-white font-black hover:bg-indigo-600 transition-all shadow-xl shadow-indigo-500/20 flex items-center gap-3"
                    >
                      <Save size={20} />
                      Save
                    </button>
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/20 flex items-start gap-4">
                  <AlertTriangle size={20} className="text-indigo-400 mt-1" />
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Your API keys are stored securely in your personal Firestore document. They are never shared or exposed to other users.
                  </p>
                </div>
              </div>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              {[
                { name: 'Spotify', status: state.apiKeys?.spotify_token ? 'Linked' : 'Not Linked', color: 'text-emerald-500' },
                { name: 'Ring', status: state.apiKeys?.ring_api_key ? 'Linked' : 'Not Linked', color: 'text-blue-500' },
                { name: 'Nest', status: state.apiKeys?.nest_api_key ? 'Linked' : 'Not Linked', color: 'text-orange-500' },
                { name: 'SmartThings', status: state.apiKeys?.smartthings_token ? 'Linked' : 'Not Linked', color: 'text-purple-500' }
              ].map(api => (
                <div key={api.name} className="p-6 glass rounded-3xl border border-slate-800/50 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-white font-black">
                      {api.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-black text-white">{api.name}</div>
                      <div className={`text-[10px] font-bold uppercase tracking-widest ${api.status === 'Linked' ? 'text-emerald-500' : 'text-slate-600'}`}>
                        {api.status}
                      </div>
                    </div>
                  </div>
                  <button className="text-xs font-black text-blue-400 uppercase tracking-widest hover:text-blue-300">Configure</button>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'system' && (
          <motion.div 
            key="system"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            <Card className="border-l-4 border-red-500">
              <h3 className="text-xl font-black text-white mb-8">Danger Zone</h3>
              <div className="space-y-6">
                <p className="text-slate-500 text-sm font-medium">These actions are irreversible. Please proceed with extreme caution.</p>
                <div className="flex flex-col md:flex-row gap-4">
                  <button className="px-8 py-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 font-black text-sm hover:bg-red-500 hover:text-white transition-all">
                    Reset All Settings
                  </button>
                  <button className="px-8 py-4 rounded-2xl bg-slate-800 text-slate-400 font-black text-sm hover:bg-red-500 hover:text-white transition-all">
                    Delete Account Data
                  </button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

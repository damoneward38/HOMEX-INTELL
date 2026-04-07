import React from 'react';
import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  Navigate
} from 'react-router-dom';
import { motion } from 'motion/react';
import { Home, ShieldCheck } from 'lucide-react';
import { useHomeState } from './hooks/useHomeState';
import { Layout } from './components/Layout';
import { 
  Dashboard, 
  SecurityPage, 
  EnergyPage, 
  ClimatePage, 
  MusicPage, 
  LightingPage, 
  HealthPage, 
  SchedulesPage, 
  SetupPage, 
  UnitsPage, 
  HelpPage 
} from './pages';

const LoginPage = ({ login }: { login: () => void }) => (
  <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]" />
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-md glass rounded-[40px] p-12 border border-slate-800 shadow-2xl relative z-10"
    >
      <div className="flex flex-col items-center text-center mb-12">
        <div className="w-20 h-20 rounded-3xl bg-blue-500 flex items-center justify-center text-white shadow-2xl shadow-blue-500/40 mb-8">
          <Home size={40} />
        </div>
        <h1 className="text-4xl font-black text-white tracking-tighter mb-4">HOMEX</h1>
        <p className="text-slate-400 font-medium">The future of smart home intelligence starts here.</p>
      </div>
      
      <button 
        onClick={login}
        className="w-full py-5 rounded-2xl bg-white text-slate-950 font-black text-lg hover:bg-slate-200 transition-all shadow-xl shadow-white/5 flex items-center justify-center gap-4"
      >
        <img src="https://www.google.com/favicon.ico" alt="Google" className="w-6 h-6" />
        Sign in with Google
      </button>

      <div className="mt-12 pt-8 border-t border-slate-900 flex justify-center gap-8">
        <div className="flex flex-col items-center gap-2">
          <div className="p-3 rounded-xl bg-slate-900 text-blue-400">
            <ShieldCheck size={20} />
          </div>
          <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Secure</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="p-3 rounded-xl bg-slate-900 text-emerald-400">
            <ShieldCheck size={20} />
          </div>
          <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Private</span>
        </div>
      </div>
    </motion.div>
  </div>
);

export default function App() {
  const state = useHomeState();

  if (!state.isAuthReady) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!state.user) {
    return <LoginPage login={state.login} />;
  }

  return (
    <Router>
      <Layout state={state}>
        <Routes>
          <Route path="/" element={<Dashboard state={state} />} />
          <Route path="/units" element={<UnitsPage state={state} />} />
          <Route path="/climate" element={state.enabledFeatures.includes('climate') ? <ClimatePage state={state} /> : <Navigate to="/" />} />
          <Route path="/music" element={state.enabledFeatures.includes('music') ? <MusicPage state={state} /> : <Navigate to="/" />} />
          <Route path="/lighting" element={state.enabledFeatures.includes('lighting') ? <LightingPage state={state} /> : <Navigate to="/" />} />
          <Route path="/security" element={state.enabledFeatures.includes('security') ? <SecurityPage state={state} /> : <Navigate to="/" />} />
          <Route path="/energy" element={state.enabledFeatures.includes('energy') ? <EnergyPage state={state} /> : <Navigate to="/" />} />
          <Route path="/health" element={state.enabledFeatures.includes('health') ? <HealthPage state={state} /> : <Navigate to="/" />} />
          <Route path="/schedules" element={<SchedulesPage state={state} />} />
          <Route path="/setup" element={<SetupPage state={state} />} />
          <Route path="/help" element={<HelpPage state={state} />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>
    </Router>
  );
}

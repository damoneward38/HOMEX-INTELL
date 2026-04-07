import React from 'react';
import { motion } from 'motion/react';
import { 
  HelpCircle, 
  BookOpen, 
  MessageSquare, 
  Search, 
  Settings, 
  Zap, 
  Activity, 
  Cpu, 
  Link,
  ShieldCheck,
  Thermometer,
  Music,
  Lightbulb,
  Heart,
  ArrowRight
} from 'lucide-react';

const Card = ({ children, className = "", active = false, ...props }: { children: React.ReactNode, className?: string, active?: boolean, [key: string]: any }) => (
  <div className={`glass rounded-3xl p-8 card-hover ${active ? 'ring-2 ring-blue-500/50 bg-blue-500/5' : ''} ${className}`} {...props}>
    {children}
  </div>
);

export const HelpPage = ({ state }: { state: any }) => {
  const [searchQuery, setSearchQuery] = React.useState('');

  const faqs = [
    { q: 'How do I link a new hub unit?', a: 'Navigate to the Units page, click "Scan Network" or enter your unit serial code manually.' },
    { q: 'Can I share access with family?', a: 'Yes, you can manage user permissions in the System Settings under the Setup page.' },
    { q: 'What happens if my internet goes out?', a: 'Most core home functions (lighting, climate) will continue to work locally via your hub unit.' },
    { q: 'How do I reset my API keys?', a: 'Go to the Service Setup page, select the API Integrations tab, and update your keys.' }
  ];

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight">Help & Support</h2>
          <p className="text-slate-400 font-medium">Everything you need to master your intelligence hub.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-8 py-3 rounded-2xl bg-blue-500 text-white font-black text-sm hover:bg-blue-600 transition-all shadow-xl shadow-blue-500/20 flex items-center gap-3">
            <MessageSquare size={20} />
            Live Chat
          </button>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500" size={24} />
        <input 
          type="text" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search documentation, guides, and FAQs..."
          className="w-full bg-slate-900/50 border border-slate-800 rounded-3xl p-6 pl-16 text-white text-lg outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        />
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <Card className="border-l-4 border-blue-500">
          <div className="p-4 rounded-2xl bg-blue-500/10 text-blue-400 w-fit mb-6">
            <BookOpen size={32} />
          </div>
          <h3 className="text-xl font-black text-white mb-2">Knowledge Base</h3>
          <p className="text-slate-500 text-sm font-medium mb-6">Deep dives into every feature and integration.</p>
          <button className="flex items-center gap-2 text-blue-400 font-black text-xs uppercase tracking-widest hover:gap-4 transition-all">
            Browse Articles <ArrowRight size={14} />
          </button>
        </Card>

        <Card className="border-l-4 border-emerald-500">
          <div className="p-4 rounded-2xl bg-emerald-500/10 text-emerald-400 w-fit mb-6">
            <Zap size={32} />
          </div>
          <h3 className="text-xl font-black text-white mb-2">Quick Start Guide</h3>
          <p className="text-slate-500 text-sm font-medium mb-6">Get your home up and running in minutes.</p>
          <button className="flex items-center gap-2 text-emerald-400 font-black text-xs uppercase tracking-widest hover:gap-4 transition-all">
            Read Guide <ArrowRight size={14} />
          </button>
        </Card>

        <Card className="border-l-4 border-purple-500">
          <div className="p-4 rounded-2xl bg-purple-500/10 text-purple-400 w-fit mb-6">
            <Settings size={32} />
          </div>
          <h3 className="text-xl font-black text-white mb-2">Video Tutorials</h3>
          <p className="text-slate-500 text-sm font-medium mb-6">Watch and learn how to optimize your setup.</p>
          <button className="flex items-center gap-2 text-purple-400 font-black text-xs uppercase tracking-widest hover:gap-4 transition-all">
            Watch Videos <ArrowRight size={14} />
          </button>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-2xl font-black text-white tracking-tight">Frequently Asked Questions</h3>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="p-6 glass rounded-3xl border border-slate-800/50 hover:border-blue-500/30 transition-all group">
                <div className="font-black text-white text-lg mb-2 group-hover:text-blue-400 transition-colors">{faq.q}</div>
                <p className="text-slate-400 text-sm font-medium leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          <Card className="bg-blue-500/5 border-blue-500/20">
            <h3 className="font-black text-white mb-6 flex items-center gap-3 uppercase tracking-widest text-sm">
              <Activity size={18} className="text-blue-400" /> System Status
            </h3>
            <div className="space-y-4">
              {[
                { name: 'Cloud API', status: 'Operational' },
                { name: 'Voice Core', status: 'Operational' },
                { name: 'Auth Service', status: 'Operational' },
                { name: 'Database', status: 'Operational' }
              ].map(s => (
                <div key={s.name} className="flex items-center justify-between">
                  <span className="text-sm text-slate-400 font-medium">{s.name}</span>
                  <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">{s.status}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h3 className="font-black text-white mb-6 uppercase tracking-widest text-sm">Need more help?</h3>
            <p className="text-slate-500 text-sm font-medium mb-6">Our support team is available 24/7 for premium subscribers.</p>
            <button className="w-full py-4 rounded-2xl bg-slate-800 text-white font-black text-sm hover:bg-slate-700 transition-all">
              Contact Support
            </button>
          </Card>
        </div>
      </div>
    </div>
  );
};

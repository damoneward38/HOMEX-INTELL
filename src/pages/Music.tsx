import React from 'react';
import { motion } from 'motion/react';
import { 
  Music as MusicIcon, 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  Settings, 
  Activity, 
  Cpu, 
  Link,
  ListMusic,
  Radio,
  Cast
} from 'lucide-react';
import { TRACKS } from '../constants';

const Card = ({ children, className = "", active = false, ...props }: { children: React.ReactNode, className?: string, active?: boolean, [key: string]: any }) => (
  <div className={`glass rounded-3xl p-6 card-hover ${active ? 'ring-2 ring-purple-500/50 bg-purple-500/5' : ''} ${className}`} {...props}>
    {children}
  </div>
);

export const MusicPage = ({ state }: { state: any }) => {
  const [activeTab, setActiveTab] = React.useState('player');
  const [spotifyToken, setSpotifyToken] = React.useState(state.apiKeys?.spotify_token || '');

  const handleSaveAPI = async () => {
    await state.saveApiKeys({ ...state.apiKeys, spotify_token: spotifyToken });
  };

  const currentTrack = TRACKS[state.musicData.currentTrackIndex];

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight">Audio Intelligence</h2>
          <p className="text-slate-400 font-medium">Multi-room audio and immersive soundscapes.</p>
        </div>
        <div className="flex gap-3">
          <div className="px-6 py-3 rounded-2xl glass border border-slate-800 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-purple-500/10 text-purple-500">
              <MusicIcon size={24} />
            </div>
            <div>
              <div className="text-2xl font-black text-white">{state.musicData.playing ? 'Now Playing' : 'Paused'}</div>
              <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{currentTrack.title}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center gap-2 p-1.5 glass rounded-2xl w-fit border border-slate-800/50">
            {[
              { id: 'player', label: 'Now Playing', icon: Play },
              { id: 'library', label: 'Library', icon: ListMusic },
              { id: 'settings', label: 'Audio Settings', icon: Settings }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === tab.id ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/20' : 'text-slate-500 hover:text-slate-300'}`}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === 'player' && (
            <Card className="p-10 flex flex-col items-center justify-center border border-slate-800/50 relative overflow-hidden">
              <div className="absolute inset-0 opacity-10">
                <img src={currentTrack.cover} alt="Background" className="w-full h-full object-cover blur-3xl" referrerPolicy="no-referrer" />
              </div>
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-64 h-64 rounded-3xl overflow-hidden shadow-2xl mb-8 group">
                  <img src={currentTrack.cover} alt="Cover" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
                </div>
                <div className="text-center mb-10">
                  <h3 className="text-3xl font-black text-white tracking-tight mb-2">{currentTrack.title}</h3>
                  <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">{currentTrack.artist}</p>
                </div>
                <div className="flex items-center gap-10 mb-10">
                  <button onClick={state.prevTrack} className="text-slate-500 hover:text-white transition-colors">
                    <SkipBack size={32} />
                  </button>
                  <button 
                    onClick={() => state.setMusicPlaying(!state.musicData.playing)}
                    className="w-20 h-20 rounded-full bg-purple-500 text-white flex items-center justify-center shadow-xl shadow-purple-500/30 hover:scale-110 transition-all"
                  >
                    {state.musicData.playing ? <Pause size={40} /> : <Play size={40} className="ml-2" />}
                  </button>
                  <button onClick={state.nextTrack} className="text-slate-500 hover:text-white transition-colors">
                    <SkipForward size={32} />
                  </button>
                </div>
                <div className="w-full flex items-center gap-4">
                  <Volume2 size={20} className="text-slate-500" />
                  <input 
                    type="range" 
                    min="0" max="100" 
                    value={state.musicData.volume}
                    onChange={(e) => state.setVolume(parseInt(e.target.value))}
                    className="flex-1 h-1.5 bg-slate-800 rounded-full appearance-none cursor-pointer accent-purple-500"
                  />
                  <span className="text-xs font-bold text-slate-500 w-8">{state.musicData.volume}%</span>
                </div>
              </div>
            </Card>
          )}

          {activeTab === 'library' && (
            <div className="grid md:grid-cols-2 gap-4">
              {TRACKS.map((track, i) => (
                <button 
                  key={i}
                  onClick={() => state.setTrack(i)}
                  className={`p-4 rounded-2xl glass border flex items-center gap-4 transition-all group ${state.musicData.currentTrackIndex === i ? 'border-purple-500/50 bg-purple-500/5' : 'border-slate-800/50 hover:border-purple-500/30'}`}
                >
                  <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                    <img src={track.cover} alt="Cover" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div className="text-left flex-1 min-w-0">
                    <div className="font-bold text-white truncate">{track.title}</div>
                    <div className="text-xs text-slate-500 truncate">{track.artist}</div>
                  </div>
                  {state.musicData.currentTrackIndex === i && state.musicData.playing && (
                    <div className="flex gap-0.5 items-end h-4">
                      <div className="w-1 bg-purple-500 animate-music-bar-1" />
                      <div className="w-1 bg-purple-500 animate-music-bar-2" />
                      <div className="w-1 bg-purple-500 animate-music-bar-3" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}

          {activeTab === 'settings' && (
            <Card className="p-8 border-l-4 border-purple-500">
              <h3 className="text-xl font-black text-white mb-6">Spotify Integration</h3>
              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Spotify Client Secret</label>
                  <input 
                    type="password" 
                    value={spotifyToken}
                    onChange={(e) => setSpotifyToken(e.target.value)}
                    placeholder="Enter your Spotify secret"
                    className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 text-white outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                  />
                </div>
                <button 
                  onClick={handleSaveAPI}
                  className="px-8 py-4 rounded-2xl bg-purple-500 text-white font-black hover:bg-purple-600 transition-all shadow-xl shadow-purple-500/20"
                >
                  Save Audio API
                </button>
              </div>
            </Card>
          )}
        </div>

        <div className="space-y-8">
          <Card className="bg-purple-500/5 border-purple-500/20">
            <h3 className="font-black text-white mb-6 flex items-center gap-3 uppercase tracking-widest text-sm">
              <Radio size={18} className="text-purple-400" /> Multi-Room Audio
            </h3>
            <div className="space-y-4">
              {['Living Room', 'Kitchen', 'Master Bedroom', 'Patio'].map(room => (
                <div key={room} className="flex items-center justify-between p-3 rounded-xl bg-slate-900/50 border border-slate-800">
                  <span className="text-sm font-bold text-white">{room}</span>
                  <div className={`w-3 h-3 rounded-full ${room === 'Living Room' ? 'bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]' : 'bg-slate-800'}`} />
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h3 className="font-black text-white mb-6 flex items-center gap-3 uppercase tracking-widest text-sm">
              <Cast size={18} className="text-blue-400" /> Cast Devices
            </h3>
            <div className="space-y-3">
              {[
                { name: 'Apple TV 4K', type: 'TV' },
                { name: 'Sonos One', type: 'Speaker' },
                { name: 'Google Nest Hub', type: 'Hub' }
              ].map(device => (
                <div key={device.name} className="p-4 rounded-2xl glass border border-slate-800 flex items-center justify-between group cursor-pointer hover:border-blue-500/30 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-slate-800 text-slate-500 group-hover:text-blue-400 transition-colors">
                      <Cast size={16} />
                    </div>
                    <div className="text-sm font-bold text-white">{device.name}</div>
                  </div>
                  <span className="text-[10px] font-bold text-slate-600 uppercase">{device.type}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

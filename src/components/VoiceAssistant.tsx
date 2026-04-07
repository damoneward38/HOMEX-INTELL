import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from "@google/genai";
import { Mic, MicOff, Search } from 'lucide-react';

const Card = ({ children, className = "", active = false, ...props }: { children: React.ReactNode, className?: string, active?: boolean, [key: string]: any }) => (
  <div className={`glass rounded-3xl p-6 card-hover ${active ? 'ring-2 ring-indigo-500/50 bg-indigo-500/5' : ''} ${className}`} {...props}>
    {children}
  </div>
);

export const VoiceAssistant = ({ state }: { state: any }) => {
  const [isListening, setIsListening] = React.useState(false);
  const [transcript, setTranscript] = React.useState('');
  const [response, setResponse] = React.useState('');
  const [textInput, setTextInput] = React.useState('');
  const [history, setHistory] = React.useState<{ command: string, response: string, time: string }[]>([]);
  const recognitionRef = React.useRef<any>(null);

  React.useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        setTranscript(text);
        processCommand(text);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        setTranscript('Error: ' + event.error);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const processCommand = async (command: string) => {
    if (!state.apiKeys?.gemini_api_key) {
      setResponse('Please configure your Gemini API key in settings.');
      return;
    }

    try {
      const ai = new GoogleGenAI(state.apiKeys.gemini_api_key);
      
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [{ role: 'user', parts: [{ text: command }] }],
        config: {
          systemInstruction: `You are a smart home assistant. 
          Current devices: ${JSON.stringify(state.devices.map((d: any) => ({ id: d.id, name: d.name, room: d.room, type: d.type, on: d.on })))}.
          Available actions: toggleDevice(id), setHeatTemp(temp), setVolume(vol), setMusicPlaying(bool).
          Respond with a JSON object: { "response": "User-friendly message", "action": { "type": "toggleDevice", "id": 1 } } or null if no action.`,
          responseMimeType: "application/json"
        }
      });

      const data = JSON.parse(response.text || '{}');
      setResponse(data.response);
      
      const newEntry = { 
        command, 
        response: data.response, 
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
      };
      setHistory(prev => [newEntry, ...prev].slice(0, 5));
      
      if (data.action) {
        if (data.action.type === 'toggleDevice') state.toggleDevice(data.action.id);
        if (data.action.type === 'setHeatTemp') state.setHeatTemp(data.action.temp);
        if (data.action.type === 'setVolume') state.setVolume(data.action.vol);
        if (data.action.type === 'setMusicPlaying') state.setMusicPlaying(data.action.bool);
      }
    } catch (error) {
      console.error('Gemini error:', error);
      setResponse('Sorry, I encountered an error processing your command.');
    }
  };

  const handleVoiceCommand = () => {
    if (!recognitionRef.current) {
      setResponse('Speech recognition is not supported in this browser.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      setIsListening(true);
      setTranscript('Listening...');
      setResponse('');
      recognitionRef.current.start();
    }
  };

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (textInput.trim()) {
      setTranscript(textInput);
      processCommand(textInput);
      setTextInput('');
    }
  };

  return (
    <Card id="voice-assistant" className="p-8 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border-indigo-500/20 relative overflow-hidden">
      {isListening && (
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-400 animate-pulse" />
      )}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className={`p-4 rounded-2xl ${isListening ? 'bg-cyan-500 animate-pulse shadow-[0_0_20px_rgba(6,182,212,0.5)]' : 'bg-indigo-500'} text-white transition-all`}>
            {isListening ? <MicOff size={28} /> : <Mic size={28} />}
          </div>
          <div>
            <h3 className="text-xl font-black text-white tracking-tight">Voice Assistant</h3>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Powered by Gemini AI</p>
          </div>
        </div>
        <button 
          onClick={handleVoiceCommand}
          disabled={isListening}
          className={`px-8 py-3 rounded-2xl font-black text-sm transition-all ${isListening ? 'bg-slate-800 text-slate-500' : 'bg-indigo-500 text-white hover:bg-indigo-600 shadow-xl shadow-indigo-500/20'}`}
        >
          {isListening ? 'Listening...' : 'Speak Now'}
        </button>
      </div>
      
      <div className="space-y-6">
        <form onSubmit={handleTextSubmit} className="flex gap-3">
          <input 
            type="text" 
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="Type a command (e.g. 'Turn on living room lights')"
            className="flex-1 bg-slate-900/80 border border-slate-800 rounded-2xl px-6 py-4 text-sm text-white outline-none focus:border-indigo-500 transition-all shadow-inner"
          />
          <button type="submit" className="p-4 rounded-2xl bg-slate-800 text-slate-400 hover:text-white transition-colors shadow-lg">
            <Search size={22} />
          </button>
        </form>

        <div className="p-6 rounded-3xl bg-slate-900/50 border border-slate-800">
          <div className="text-[10px] text-slate-500 uppercase font-black mb-2 tracking-widest">Transcript</div>
          <div className="text-lg text-slate-300 italic font-medium">{transcript || 'Waiting for command...'}</div>
        </div>
        
        <AnimatePresence>
          {response && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 shadow-xl"
            >
              <div className="text-[10px] text-indigo-400 uppercase font-black mb-2 tracking-widest">Assistant Response</div>
              <div className="text-lg text-white font-black tracking-tight">{response}</div>
            </motion.div>
          )}
        </AnimatePresence>

        {history.length > 0 && (
          <div className="pt-6 border-t border-slate-800">
            <div className="text-[10px] text-slate-500 uppercase font-black mb-4 tracking-widest">Command History</div>
            <div className="space-y-3">
              {history.map((item, i) => (
                <div key={i} className="text-sm flex justify-between items-start gap-6 group p-3 rounded-xl hover:bg-slate-900/50 transition-all">
                  <div className="flex-1">
                    <span className="text-slate-400 font-medium">"{item.command}"</span>
                    <div className="text-indigo-400 mt-1 font-bold opacity-0 group-hover:opacity-100 transition-opacity">{item.response}</div>
                  </div>
                  <span className="text-slate-600 font-mono text-xs">{item.time}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

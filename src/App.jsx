import React, { useState, useEffect } from 'react';
import { Terminal, Bus, Volume2, ShieldAlert, Save, Plus, Trash2, Send, Wifi, WifiOff } from 'lucide-react';
import transitData from './data/transit_nodes.json';

export default function App() {
  const [activeTab, setActiveTab] = useState('hub');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  // Workspace State with pre-loaded demo code
  const [files, setFiles] = useState([
    {
      id: '1',
      name: 'main.js',
      content: `// DevSignal Offline Workspace
// Cached KSRTC Route Payload Demo
const transitNode = {
  corridor: "Kochi to Munnar",
  zone: "Adimali Ghats",
  signal: "No Signal",
  fallbackChannel: "Depot Relayer 04"
};

console.log("DevSignal Active:", transitNode);`
    },
    {
      id: '2',
      name: 'emergency_contacts.json',
      content: `{
  "kochi_depot": "+91 484 2372033",
  "munnar_control": "+91 486 5230201",
  "kothamangalam": "+91 485 2862202"
}`
    }
  ]);
  const [activeFileId, setActiveFileId] = useState('1');
  const [newFileName, setNewFileName] = useState('');

  // AI Query State
  const [aiQuery, setAiQuery] = useState('');
  const [aiLogs, setAiLogs] = useState([]);

  // Transit Search State
  const [searchZone, setSearchZone] = useState('');

  // Web Audio State
  const [audioCtx, setAudioCtx] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioType, setAudioType] = useState('brown');

  // Monitor Network Connectivity
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Workspace Functions
  const activeFile = files.find(f => f.id === activeFileId) || files[0];

  const handleContentChange = (e) => {
    const updated = files.map(f => f.id === activeFileId ? { ...f, content: e.target.value } : f);
    setFiles(updated);
  };

  const handleSaveLocal = () => {
    localStorage.setItem('devsignal_files', JSON.stringify(files));
    alert('Workspace saved locally to browser storage!');
  };

  const handleAddFile = () => {
    if (!newFileName.trim()) return;
    const newFile = { id: Date.now().toString(), name: newFileName.trim(), content: '// New offline file\n' };
    setFiles([...files, newFile]);
    setActiveFileId(newFile.id);
    setNewFileName('');
  };

  const handleDeleteFile = (id) => {
    if (files.length === 1) return;
    const filtered = files.filter(f => f.id !== id);
    setFiles(filtered);
    if (activeFileId === id) setActiveFileId(filtered[0].id);
  };

  // Micro-Payload AI Query Handler
  const handleSendAi = (e) => {
    e.preventDefault();
    if (!aiQuery.trim()) return;
    const timestamp = new Date().toLocaleTimeString();
    const newLog = `[${timestamp}] Query: "${aiQuery}" -> Processed via micro-payload channel.`;
    setAiLogs([newLog, ...aiLogs]);
    setAiQuery('');
  };

  // Web Audio Synthesizer
  const toggleAudio = () => {
    if (isPlaying) {
      if (audioCtx) audioCtx.close();
      setAudioCtx(null);
      setIsPlaying(false);
    } else {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const bufferSize = ctx.sampleRate * 2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        if (audioType === 'brown') {
          data[i] = (lastOut + (0.02 * white)) / 1.02;
          lastOut = data[i];
          data[i] *= 3.5;
        } else {
          data[i] = white * 0.1;
        }
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;
      noise.connect(ctx.destination);
      noise.start();

      setAudioCtx(ctx);
      setIsPlaying(true);
    }
  };

  const filteredZones = transitData.low_connectivity_zones.filter(z => 
    z.zone.toLowerCase().includes(searchZone.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-4 md:p-8">
      {/* Top Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-emerald-400 tracking-tight">DevSignal</h1>
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${isOnline ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-rose-950 text-rose-400 border border-rose-800'}`}>
              {isOnline ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
              {isOnline ? 'Online Sync' : 'Offline Mode'}
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">Low-Bandwidth Developer Hub & Incident Transit Locker</p>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex gap-2 bg-slate-900 p-1.5 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('hub')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'hub' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/40' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <Terminal className="w-4 h-4" /> Developer Hub
          </button>
          <button
            onClick={() => setActiveTab('transit')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'transit' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/40' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <Bus className="w-4 h-4" /> Transit Monitor
          </button>
          <button
            onClick={() => setActiveTab('audio')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'audio' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/40' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <Volume2 className="w-4 h-4" /> Focus Audio Studio
          </button>
        </nav>
      </header>

      {/* Main Content Area */}
      <main>
        {/* TAB 1: DEVELOPER HUB */}
        {activeTab === 'hub' && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar File Workspace */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col h-[600px]">
              <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" /> File Workspace
              </h2>

              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  placeholder="filename.js"
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                />
                <button
                  onClick={handleAddFile}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white p-2 rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
                {files.map((file) => (
                  <div
                    key={file.id}
                    onClick={() => setActiveFileId(file.id)}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer text-xs transition-all ${activeFileId === file.id ? 'bg-slate-800 border border-emerald-500/30 text-emerald-300 font-medium' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'}`}
                  >
                    <span className="truncate">{file.name}</span>
                    {files.length > 1 && (
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDeleteFile(file.id); }}
                        className="text-slate-500 hover:text-rose-400 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Code Editor & Micro AI */}
            <div className="lg:col-span-3 space-y-6">
              {/* Code Editor */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col h-[400px]">
                <div className="flex justify-between items-center mb-3 pb-3 border-b border-slate-800">
                  <span className="text-xs text-slate-400">
                    Editing: <strong className="text-emerald-400">{activeFile.name}</strong>
                  </span>
                  <button
                    onClick={handleSaveLocal}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold transition-all shadow-md shadow-emerald-950"
                  >
                    <Save className="w-3.5 h-3.5" /> Save Local
                  </button>
                </div>
                <textarea
                  value={activeFile.content}
                  onChange={handleContentChange}
                  className="flex-1 bg-slate-950 text-slate-200 font-mono text-sm p-4 rounded-xl border border-slate-800/80 focus:outline-none focus:border-emerald-500/50 resize-none"
                />
              </div>

              {/* Micro-Payload AI Query Engine */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> Micro-Payload AI Query Engine
                </h3>
                <form onSubmit={handleSendAi} className="flex gap-2 mb-3">
                  <input
                    type="text"
                    placeholder="Enter low-bandwidth prompt (e.g. Explain binary search in C)..."
                    value={aiQuery}
                    onChange={(e) => setAiQuery(e.target.value)}
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-400 px-4 py-2 rounded-xl text-xs font-semibold border border-slate-700 transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" /> Send
                  </button>
                </form>
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 h-20 overflow-y-auto font-mono text-xs text-slate-400">
                  {aiLogs.length === 0 ? (
                    <span className="text-slate-600">// Query output log renders here...</span>
                  ) : (
                    aiLogs.map((log, idx) => <div key={idx} className="text-emerald-400/90">{log}</div>)
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: TRANSIT MONITOR */}
        {activeTab === 'transit' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-100">{transitData.route_name} <span className="text-emerald-400 text-sm font-normal">({transitData.route_id})</span></h2>
                  <p className="text-xs text-slate-400 mt-0.5">Cached KSRTC Low-Connectivity Transit Corridor Data</p>
                </div>
                <input
                  type="text"
                  placeholder="Search signal zones..."
                  value={searchZone}
                  onChange={(e) => setSearchZone(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-200 w-full md:w-64 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Signal Zone Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredZones.map((item, idx) => (
                  <div key={idx} className="bg-slate-950 border border-slate-800/80 rounded-xl p-4 hover:border-slate-700 transition-all">
                    <h3 className="font-semibold text-sm text-slate-200 mb-1">{item.zone}</h3>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs text-slate-400">Signal Status:</span>
                      <span className={`text-xs font-bold ${item.signal === 'No Signal' ? 'text-rose-400' : item.signal === 'Poor' ? 'text-amber-400' : 'text-emerald-400'}`}>
                        {item.signal}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500">
                      Alternative Channel: <span className="text-slate-300 font-mono">{item.alt_channel}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Emergency Depot Contacts */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <h3 className="text-sm font-semibold text-slate-200 mb-4 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-emerald-400" /> Emergency Depot Contacts
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {transitData.emergency_contacts.map((contact, idx) => (
                  <div key={idx} className="bg-slate-950 border border-slate-800/60 rounded-xl p-3 flex justify-between items-center text-xs">
                    <span className="font-medium text-slate-300">{contact.depot}</span>
                    <span className="font-mono text-emerald-400">{contact.phone}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: FOCUS AUDIO STUDIO */}
        {activeTab === 'audio' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 max-w-2xl mx-auto text-center space-y-6">
            <div>
              <h2 className="text-lg font-bold text-emerald-400 mb-1">Client-Side Web Audio Synthesizer</h2>
              <p className="text-xs text-slate-400">
                Generates pure ambient noise locally using your laptop's sound engine. Zero network bandwidth consumed during playback.
              </p>
            </div>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => setAudioType('brown')}
                className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${audioType === 'brown' ? 'bg-emerald-950 text-emerald-400 border-emerald-600' : 'bg-slate-950 text-slate-400 border-slate-800'}`}
              >
                Deep Brown Noise
              </button>
              <button
                onClick={() => setAudioType('white')}
                className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${audioType === 'white' ? 'bg-emerald-950 text-emerald-400 border-emerald-600' : 'bg-slate-950 text-slate-400 border-slate-800'}`}
              >
                Static Focus Noise
              </button>
            </div>

            <button
              onClick={toggleAudio}
              className={`px-8 py-3 rounded-xl font-bold text-sm transition-all shadow-lg ${isPlaying ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-950' : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950'}`}
            >
              {isPlaying ? 'Stop Focus Audio' : 'Start Focus Audio'}
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
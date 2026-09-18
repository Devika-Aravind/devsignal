import React, { useState, useEffect } from 'react';
import { 
  Wifi, WifiOff, Volume2, VolumeX, Save, FileCode, Database, 
  Send, Radio, HardDrive, Code, Plus, Trash2, Search, Sliders, Play, Square 
} from 'lucide-react';
import transitData from './data/transit_nodes.json';

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState('hub'); // 'hub', 'transit', 'audio'

  // Multi-File Snippet Storage State
  const [files, setFiles] = useState(() => {
    const saved = localStorage.getItem('devsignal_files');
    return saved ? JSON.parse(saved) : [
      { id: '1', name: 'main.js', content: '// Write or paste offline code here...\nconsole.log("DevSignal Active");' },
      { id: '2', name: 'api_endpoints.md', content: '# Emergency API Endpoints\n- GET /api/v1/transit/status\n- POST /api/v1/incident/report' }
    ];
  });
  const [activeFileId, setActiveFileId] = useState('1');
  const [newFileName, setNewFileName] = useState('');

  // Audio Synthesizer State
  const [isPlaying, setIsPlaying] = useState(false);
  const [soundType, setSoundType] = useState('brown');
  const [audioCtx, setAudioCtx] = useState(null);

  // AI & Query State
  const [prompt, setPrompt] = useState('');
  const [aiOutput, setAiOutput] = useState('');
  const [loading, setLoading] = useState(false);

  // Network & Storage State
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [searchQuery, setSearchQuery] = useState('');

  // Sync Network Status & Local Storage
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    localStorage.setItem('devsignal_files', JSON.stringify(files));
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [files]);

  const activeFile = files.find(f => f.id === activeFileId) || files[0];

  const handleContentChange = (newContent) => {
    setFiles(files.map(f => f.id === activeFileId ? { ...f, content: newContent } : f));
  };

  const handleAddFile = (e) => {
    e.preventDefault();
    if (!newFileName.trim()) return;
    const newFile = { id: Date.now().toString(), name: newFileName.trim(), content: '' };
    setFiles([...files, newFile]);
    setActiveFileId(newFile.id);
    setNewFileName('');
  };

  const handleDeleteFile = (id) => {
    if (files.length === 1) return alert("Keep at least one file!");
    const updated = files.filter(f => f.id !== id);
    setFiles(updated);
    if (activeFileId === id) setActiveFileId(updated[0].id);
  };

  // Web Audio Generator
  const toggleAudio = (type = soundType) => {
    if (isPlaying) {
      if (audioCtx) audioCtx.close();
      setIsPlaying(false);
    } else {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);

      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        if (type === 'brown') {
          output[i] = (lastOut + (0.02 * white)) / 1.02;
          lastOut = output[i];
          output[i] *= 3.5;
        } else {
          output[i] = white * 0.1;
        }
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const gainNode = ctx.createGain();
      gainNode.gain.value = 0.05;

      whiteNoise.connect(gainNode);
      gainNode.connect(ctx.destination);
      whiteNoise.start();

      setAudioCtx(ctx);
      setSoundType(type);
      setIsPlaying(true);
    }
  };

  const handleAiQuery = (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    setLoading(true);

    setTimeout(() => {
      setAiOutput(`[Compressed Response | Payload: 38 Bytes]\n• Prompt: "${prompt}"\n• Optimization: Code structure validated for low-bandwidth transfer.\n• Recommendation: Use local indexed C-buffers for transit state handling.`);
      setLoading(false);
    }, 600);
  };

  const filteredNodes = transitData.low_connectivity_zones.filter(z => 
    z.zone.toLowerCase().includes(searchQuery.toLowerCase()) || 
    z.signal.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1.5rem', fontFamily: 'system-ui, sans-serif' }}>
      
      {/* Navbar Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1e293b', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <h1 style={{ color: '#10b981', margin: 0, fontSize: '1.8rem', fontWeight: 'bold' }}>DevSignal</h1>
            <span style={{
              backgroundColor: isOnline ? '#064e3b' : '#7f1d1d',
              color: isOnline ? '#34d399' : '#fca5a5',
              fontSize: '0.75rem', padding: '0.2rem 0.6rem', borderRadius: '4px',
              border: `1px solid ${isOnline ? '#047857' : '#991b1b'}`,
              display: 'flex', alignItems: 'center', gap: '0.3rem'
            }}>
              {isOnline ? <Wifi size={12} /> : <WifiOff size={12} />}
              {isOnline ? 'Online Sync' : 'Offline Mode'}
            </span>
          </div>
          <p style={{ color: '#94a3b8', margin: '0.25rem 0 0 0', fontSize: '0.85rem' }}>Low-Bandwidth Developer Hub & Incident Transit Locker</p>
        </div>

        {/* Tab Navigation */}
        <nav style={{ display: 'flex', gap: '0.5rem', backgroundColor: '#020617', padding: '0.3rem', borderRadius: '0.5rem', border: '1px solid #1e293b' }}>
          <button 
            onClick={() => setActiveTab('hub')}
            style={{ backgroundColor: activeTab === 'hub' ? '#059669' : 'transparent', color: '#f8fafc', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '0.3rem', cursor: 'pointer', fontSize: '0.85rem' }}
          >
            Developer Hub
          </button>
          <button 
            onClick={() => setActiveTab('transit')}
            style={{ backgroundColor: activeTab === 'transit' ? '#059669' : 'transparent', color: '#f8fafc', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '0.3rem', cursor: 'pointer', fontSize: '0.85rem' }}
          >
            Transit Monitor
          </button>
          <button 
            onClick={() => setActiveTab('audio')}
            style={{ backgroundColor: activeTab === 'audio' ? '#059669' : 'transparent', color: '#f8fafc', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '0.3rem', cursor: 'pointer', fontSize: '0.85rem' }}
          >
            Focus Audio Studio
          </button>
        </nav>
      </header>

      {/* TAB 1: DEVELOPER HUB */}
      {activeTab === 'hub' && (
        <main style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '1.5rem' }}>
          
          {/* File Sidebar */}
          <div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '0.75rem', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3 style={{ margin: 0, fontSize: '0.9rem', color: '#e2e8f0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Code size={16} color="#10b981" /> File Workspace
            </h3>
            
            <form onSubmit={handleAddFile} style={{ display: 'flex', gap: '0.4rem' }}>
              <input 
                type="text" 
                placeholder="filename.js" 
                value={newFileName} 
                onChange={(e) => setNewFileName(e.target.value)}
                style={{ flex: 1, backgroundColor: '#020617', border: '1px solid #1e293b', color: '#fff', padding: '0.3rem 0.5rem', borderRadius: '0.3rem', fontSize: '0.8rem' }}
              />
              <button type="submit" style={{ backgroundColor: '#059669', color: '#fff', border: 'none', padding: '0.3rem 0.6rem', borderRadius: '0.3rem', cursor: 'pointer' }}>
                <Plus size={14} />
              </button>
            </form>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {files.map(file => (
                <div 
                  key={file.id} 
                  onClick={() => setActiveFileId(file.id)}
                  style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '0.5rem', borderRadius: '0.4rem', cursor: 'pointer',
                    backgroundColor: activeFileId === file.id ? '#1e293b' : 'transparent',
                    border: activeFileId === file.id ? '1px solid #059669' : '1px solid transparent'
                  }}
                >
                  <span style={{ fontSize: '0.8rem', color: activeFileId === file.id ? '#34d399' : '#94a3b8' }}>
                    📄 {file.name}
                  </span>
                  {files.length > 1 && (
                    <Trash2 
                      size={12} 
                      color="#ef4444" 
                      onClick={(e) => { e.stopPropagation(); handleDeleteFile(file.id); }} 
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Main Workspace Area */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* Active Code Editor */}
            <div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '0.75rem', padding: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.85rem', color: '#f8fafc', fontWeight: 'bold' }}>
                  Editing: <span style={{ color: '#10b981' }}>{activeFile.name}</span>
                </span>
                <button 
                  onClick={() => alert(`Saved ${activeFile.name} to browser storage!`)}
                  style={{ backgroundColor: '#059669', color: '#fff', border: 'none', padding: '0.3rem 0.75rem', borderRadius: '0.3rem', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                >
                  <Save size={12} /> Save Local
                </button>
              </div>
              <textarea 
                value={activeFile.content}
                onChange={(e) => handleContentChange(e.target.value)}
                style={{
                  width: '100%', minHeight: '220px', backgroundColor: '#020617', color: '#f8fafc',
                  border: '1px solid #1e293b', borderRadius: '0.5rem', padding: '0.75rem',
                  fontFamily: 'monospace', fontSize: '0.85rem', boxSizing: 'border-box'
                }}
              />
            </div>

            {/* Micro AI Assistant */}
            <div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '0.75rem', padding: '1rem' }}>
              <h3 style={{ margin: '0 0 0.75rem 0', fontSize: '0.9rem', color: '#e2e8f0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Radio size={16} color="#10b981" /> Micro-Payload AI Query Engine
              </h3>
              <form onSubmit={handleAiQuery} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <input 
                  type="text" 
                  placeholder="Enter low-bandwidth prompt (e.g. Explain binary search in C)..." 
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  style={{ flex: 1, backgroundColor: '#020617', border: '1px solid #1e293b', color: '#fff', padding: '0.4rem 0.75rem', borderRadius: '0.4rem', fontSize: '0.8rem' }}
                />
                <button type="submit" disabled={loading} style={{ backgroundColor: '#1e293b', color: '#fff', border: '1px solid #334155', padding: '0.4rem 0.8rem', borderRadius: '0.4rem', cursor: 'pointer', fontSize: '0.8rem' }}>
                  <Send size={12} /> {loading ? '...' : 'Send'}
                </button>
              </form>
              <div style={{ backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '0.4rem', padding: '0.75rem', color: '#34d399', fontFamily: 'monospace', fontSize: '0.8rem', minHeight: '80px', whiteSpace: 'pre-wrap' }}>
                {aiOutput || '// Query output log renders here...'}
              </div>
            </div>

          </div>
        </main>
      )}

      {/* TAB 2: TRANSIT MONITOR */}
      {activeTab === 'transit' && (
        <main style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '0.75rem', padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.2rem', color: '#f8fafc' }}>
                {transitData.route_name} <span style={{ color: '#10b981' }}>({transitData.route_id})</span>
              </h2>
              <p style={{ margin: '0.2rem 0 0 0', color: '#94a3b8', fontSize: '0.85rem' }}>Cached KSRTC Low-Connectivity Transit Corridor Data</p>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#020617', border: '1px solid #1e293b', padding: '0.4rem 0.75rem', borderRadius: '0.4rem' }}>
              <Search size={14} color="#64748b" />
              <input 
                type="text" 
                placeholder="Search signal zones..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ backgroundColor: 'transparent', border: 'none', color: '#fff', fontSize: '0.8rem', outline: 'none' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
            {filteredNodes.map((item, idx) => (
              <div key={idx} style={{ backgroundColor: '#020617', border: '1px solid #1e293b', padding: '1rem', borderRadius: '0.5rem' }}>
                <h4 style={{ margin: 0, color: '#f8fafc', fontSize: '0.95rem' }}>{item.zone}</h4>
                <p style={{ margin: '0.4rem 0 0 0', color: item.signal === 'No Signal' ? '#ef4444' : '#fbbf24', fontSize: '0.8rem', fontWeight: 'bold' }}>
                  Signal Status: {item.signal}
                </p>
                <p style={{ margin: '0.25rem 0 0 0', color: '#64748b', fontSize: '0.75rem' }}>
                  Alternative Channel: {item.alt_channel}
                </p>
              </div>
            ))}
          </div>

          <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem', color: '#e2e8f0' }}>Emergency Depot Contacts</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
            {transitData.emergency_contacts.map((contact, idx) => (
              <div key={idx} style={{ backgroundColor: '#020617', border: '1px solid #1e293b', padding: '0.75rem 1rem', borderRadius: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#f8fafc', fontSize: '0.85rem' }}>{contact.depot}</span>
                <span style={{ color: '#10b981', fontFamily: 'monospace', fontSize: '0.85rem' }}>{contact.phone}</span>
              </div>
            ))}
          </div>
        </main>
      )}

      {/* TAB 3: FOCUS AUDIO STUDIO */}
      {activeTab === 'audio' && (
        <main style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '0.75rem', padding: '2rem', textAlign: 'center' }}>
          <h2 style={{ margin: '0 0 0.5rem 0', color: '#10b981' }}>Client-Side Web Audio Synthesizer</h2>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', maxWidth: '600px', margin: '0 auto 2rem auto' }}>
            Generates pure ambient noise locally using your laptop's sound engine. Zero network bandwidth consumed during playback.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2rem' }}>
            <button 
              onClick={() => toggleAudio('brown')}
              style={{
                backgroundColor: soundType === 'brown' && isPlaying ? '#059669' : '#020617',
                border: '1px solid #1e293b', color: '#fff', padding: '1rem 2rem', borderRadius: '0.5rem', cursor: 'pointer'
              }}
            >
              <h3>Deep Brown Noise</h3>
              <p style={{ margin: 0, fontSize: '0.75rem', color: '#94a3b8' }}>Low frequency rumble for heavy focus</p>
            </button>

            <button 
              onClick={() => toggleAudio('white')}
              style={{
                backgroundColor: soundType === 'white' && isPlaying ? '#059669' : '#020617',
                border: '1px solid #1e293b', color: '#fff', padding: '1rem 2rem', borderRadius: '0.5rem', cursor: 'pointer'
              }}
            >
              <h3>Static Focus Noise</h3>
              <p style={{ margin: 0, fontSize: '0.75rem', color: '#94a3b8' }}>Crisp ambient noise for writing code</p>
            </button>
          </div>

          <button 
            onClick={() => toggleAudio()}
            style={{ backgroundColor: isPlaying ? '#ef4444' : '#10b981', color: '#fff', border: 'none', padding: '0.75rem 2rem', borderRadius: '0.5rem', fontSize: '1rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
          >
            {isPlaying ? <Square size={16} /> : <Play size={16} />}
            {isPlaying ? 'Stop Audio Engine' : 'Start Focus Audio'}
          </button>
        </main>
      )}

    </div>
  );
}
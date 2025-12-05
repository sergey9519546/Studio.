import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  Bell,
  Box,
  Brain,
  Command,
  FileText,
  Grid,
  Image as ImageIcon,
  Layout,
  Layers,
  MoreHorizontal,
  Palette,
  Plus,
  Settings,
  Sparkles,
  Users,
} from 'lucide-react';

type Project = {
  id: string;
  title: string;
  client?: string;
  status: string;
  description: string;
  tone?: string[];
};

// --- GEMINI API HELPERS ---
const apiKey =
  (typeof process !== 'undefined' && process.env.VITE_GEMINI_API_KEY) ||
  (globalThis as any)?.VITE_GEMINI_API_KEY ||
  '';

const callGemini = async (
  prompt: string,
  systemInstruction = 'You are a helpful assistant.',
) => {
  if (!apiKey) {
    return 'Intelligence offline (missing Gemini API key).';
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          systemInstruction: { parts: [{ text: systemInstruction }] },
        }),
      },
    );
    if (!response.ok) throw new Error(`API Error: ${response.status}`);
    const data = await response.json();
    return (
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      'Intelligence unavailable.'
    );
  } catch (error) {
    console.error('Gemini API Error:', error);
    return 'Connection to Neural Engine failed.';
  }
};

// --- DESIGN TOKENS ---
const LQ = {
  colors: {
    bg: 'bg-[#F5F5F7]',
    card: 'bg-[#FFFFFF]',
    textMain: 'text-[#1D1D1F]',
    textMuted: 'text-[#86868B]',
    accent: 'text-[#000000]',
    border: 'border-black/[0.04]',
    sidebarBg: 'bg-[#FBFBFD]',
  },
  shadows: {
    soft: 'shadow-[0_4px_24px_rgba(0,0,0,0.02)]',
    float: 'shadow-[0_20px_40px_rgba(0,0,0,0.08)]',
    inner: 'shadow-[inset_0_1px_4px_rgba(0,0,0,0.02)]',
  },
  radius: {
    card: 'rounded-[24px]',
    pill: 'rounded-full',
    btn: 'rounded-[14px]',
  },
};

// --- GLOBAL STYLES ---
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
    
    body {
      font-family: 'Inter', sans-serif;
      background-color: #F5F5F7;
      color: #1D1D1F;
      overflow: hidden;
    }

    ::-webkit-scrollbar {
      width: 0px;
      background: transparent;
    }

    .glass-bar {
      background: rgba(255, 255, 255, 0.8);
      backdrop-filter: blur(20px) saturate(180%);
      -webkit-backdrop-filter: blur(20px) saturate(180%);
      border: 1px solid rgba(255, 255, 255, 0.4);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.04);
    }

    .bubble-user {
      background-color: #1D1D1F;
      color: #FFFFFF;
      border-radius: 20px 20px 4px 20px;
      padding: 14px 22px;
      font-size: 15px;
      line-height: 1.5;
      box-shadow: 0 2px 12px rgba(0,0,0,0.1);
    }

    .bubble-ai {
      background-color: #FFFFFF;
      color: #1D1D1F;
      padding: 18px 24px;
      border-radius: 4px 20px 20px 20px;
      font-size: 15px;
      line-height: 1.6;
      border: 1px solid rgba(0,0,0,0.04);
      box-shadow: 0 2px 8px rgba(0,0,0,0.02);
    }

    .kinetic-text {
      letter-spacing: -0.06em;
      line-height: 0.9;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      border-radius: 16px;
      transition: all 0.2s cubic-bezier(0.25, 0.1, 0.25, 1);
      color: #86868B;
      font-weight: 500;
      font-size: 14px;
    }
    
    .nav-item:hover {
      background-color: #F5F5F7;
      color: #1D1D1F;
    }

    .nav-item.active {
      background-color: #1D1D1F;
      color: #FFFFFF;
      font-weight: 600;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }

    @keyframes shimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }
    .shimmer {
      background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0) 100%);
      background-size: 200% 100%;
      animation: shimmer 2s infinite;
    }
  `}</style>
);

// --- COMPONENTS ---

type SidebarProps = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
};

const Sidebar = ({ activeTab, setActiveTab }: SidebarProps) => {
  const operations = [
    { id: 'dashboard', icon: Layout, label: 'Atelier' },
    { id: 'projects', icon: Layers, label: 'Manifests' },
    { id: 'studio', icon: Sparkles, label: 'Studio AI' },
    { id: 'moodboard', icon: Grid, label: 'Visuals' },
    { id: 'roster', icon: Users, label: 'Talent' },
    { id: 'writers-room', icon: FileText, label: "Writer's Room" },
  ];

  return (
    <nav
      className={`fixed left-0 top-0 bottom-0 w-72 flex flex-col py-8 ${LQ.colors.sidebarBg} border-r ${LQ.colors.border} z-50`}
    >
      <div className="px-8 mb-12 flex items-center gap-4">
        <div className="w-10 h-10 bg-[#1D1D1F] rounded-[12px] flex items-center justify-center text-white shadow-xl">
          <div className="w-4 h-4 bg-white rounded-full border-2 border-[#1D1D1F]" />
        </div>
        <div>
          <h1 className="font-bold text-xl tracking-tight text-[#1D1D1F]">
            Studio.
          </h1>
          <p className="text-[10px] text-gray-400 font-medium tracking-widest uppercase">
            OS v3.0
          </p>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-6 space-y-2">
        <div className="px-4 mb-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
          Core Modules
        </div>
        {operations.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`nav-item w-full ${
              activeTab === item.id ? 'active' : ''
            }`}
          >
            <item.icon size={18} strokeWidth={activeTab === item.id ? 2.5 : 2} />
            {item.label}
          </button>
        ))}
      </div>
      <div className="px-6 mt-auto pt-6 border-t border-gray-100/50 flex flex-col gap-2">
        <button className="nav-item w-full text-sm">
          <Settings size={18} />
          System Config
        </button>
        <div className="flex items-center gap-3 p-2 mt-2 rounded-[16px] border border-gray-100 bg-white shadow-sm cursor-pointer hover:border-gray-300 transition-colors">
          <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop"
              className="w-full h-full object-cover"
              alt="Profile"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-bold text-[#1D1D1F] truncate">
              Alex Director
            </div>
            <div className="text-[10px] text-gray-400 truncate">
              Online • Los Angeles
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

const CommandBar = () => {
  return (
    <div className="fixed bottom-8 left-72 right-0 flex justify-center z-[60] px-8 pointer-events-none">
      <div
        className={`glass-bar pointer-events-auto w-full max-w-3xl h-16 ${LQ.radius.pill} flex items-center justify-between px-2 pr-3`}
      >
        <div className="flex items-center pl-4 w-full gap-4">
          <Command size={18} className="text-[#86868B]" />
          <input
            placeholder="Search manifests, assets, or run AI command..."
            className="bg-transparent border-none outline-none h-full w-full text-sm text-[#1D1D1F] placeholder:text-[#86868B]/70 font-medium"
          />
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <div className="hidden md:flex text-[10px] font-bold text-gray-400 bg-gray-100/50 px-2 py-1 rounded-md border border-white/50">
            ⌘ K
          </div>
          <div className="h-6 w-[1px] bg-gray-300/50 mx-1" />
          <button className="w-10 h-10 rounded-full bg-[#1D1D1F] text-white flex items-center justify-center hover:scale-105 transition-transform shadow-lg shadow-black/10">
            <Plus size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

type CardProps = {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  noPadding?: boolean;
};

const Card = ({ children, className = '', onClick, noPadding = false }: CardProps) => (
  <div
    onClick={onClick}
    className={`${LQ.colors.card} border ${LQ.colors.border} ${LQ.radius.card} ${
      noPadding ? '' : 'p-8'
    } transition-all duration-500 ease-out hover:shadow-lg hover:-translate-y-[2px] ${className}`}
  >
    {children}
  </div>
);

const DashboardHome = () => {
  return (
    <div className="animate-in fade-in duration-700 pb-32 pt-12 px-12 max-w-[1600px] mx-auto">
      <header className="mb-12 flex justify-between items-end">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 bg-white border border-gray-200 rounded-lg text-[11px] font-bold uppercase tracking-widest text-gray-500 shadow-sm flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Studio Online
            </span>
          </div>
          <h1 className="text-6xl md:text-7xl font-bold tracking-tighter text-[#1D1D1F] mb-3 kinetic-text">
            Good Morning.
          </h1>
          <p className="text-[#86868B] text-xl font-light tracking-tight">
            The studio focus is nominal.{' '}
            <span className="text-[#1D1D1F] font-medium border-b border-gray-300 pb-0.5">
              2 deadlines approaching.
            </span>
          </p>
        </div>
        <div className="flex gap-3">
          <button className="h-10 w-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-black hover:border-black transition-colors">
            <Bell size={18} />
          </button>
          <button className="h-10 px-5 rounded-full bg-[#1D1D1F] text-white text-xs font-bold uppercase tracking-wider hover:shadow-lg transition-shadow">
            New Project
          </button>
        </div>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-auto md:h-[640px]">
        <Card className="col-span-1 md:col-span-12 lg:col-span-6 relative overflow-hidden group border-0 shadow-2xl h-[400px] lg:h-full" noPadding>
          <img
            src="https://images.unsplash.com/photo-1492551557933-34265f7af79e?q=80&w=2670&auto=format&fit=crop"
            className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-105"
            alt="Hero"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent p-10 flex flex-col justify-end">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-bold text-white uppercase tracking-wider border border-white/20">
                Priority One
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-2 tracking-tight">
              Nebula Phase II
            </h2>
            <p className="text-white/70 text-sm md:text-base line-clamp-2 max-w-md leading-relaxed">
              Comprehensive rebrand focusing on kinetic typography and zero-gravity aesthetics. Client review in 4 hours.
            </p>
          </div>
        </Card>
        <div className="col-span-1 md:col-span-12 lg:col-span-6 grid grid-cols-2 gap-6 h-full">
          <Card className="col-span-2 md:col-span-1 flex flex-col justify-between bg-[#1D1D1F] text-white border-0 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 blur-3xl rounded-full pointer-events-none" />
            <div className="flex justify-between items-start z-10">
              <div className="p-2.5 bg-white/10 rounded-[14px] backdrop-blur-sm">
                <Brain size={20} className="text-white" />
              </div>
              <span className="text-[10px] font-mono text-white/40">AI v4.0</span>
            </div>
            <div className="z-10">
              <h3 className="text-lg font-medium mb-4 leading-tight">
                Spark
                <br />
                Creativity.
              </h3>
              <div className="relative group/input">
                <input
                  placeholder="Concept prompt..."
                  className="w-full bg-white/10 border border-white/5 rounded-[16px] px-4 py-3 text-sm text-white placeholder-white/30 outline-none focus:bg-white/20 transition-all pr-10"
                />
                <button className="absolute right-2 top-2 p-1.5 text-white/50 hover:text-white bg-white/5 hover:bg-white/20 rounded-lg transition-all">
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </Card>
          <Card className="col-span-2 md:col-span-1 flex flex-col relative overflow-hidden shadow-lg border-0 bg-white">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-lg font-bold text-[#1D1D1F]">Daily Vibe</h3>
              <Palette size={20} className="text-gray-300" />
            </div>
            <div className="flex-1 flex flex-col justify-center gap-3">
              <div className="flex gap-2 h-12">
                {['#FF3B30', '#FF9500', '#FFCC00', '#34C759', '#007AFF'].map((c, i) => (
                  <div
                    key={c}
                    className="flex-1 rounded-full shadow-sm border border-black/5 hover:-translate-y-1 transition-transform cursor-pointer"
                    style={{ backgroundColor: c, transitionDelay: `${i * 50}ms` }}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-400 font-mono text-center mt-2">
                PALETTE_NEON_04
              </span>
            </div>
          </Card>
          <Card className="col-span-2 flex flex-col shadow-md border-gray-100/50 bg-white h-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm font-bold uppercase tracking-widest text-[#86868B]">
                Recent Artifacts
              </h3>
              <button className="text-xs font-bold text-[#1D1D1F] hover:opacity-70 transition-opacity">
                View Gallery
              </button>
            </div>
            <div className="flex-1 grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="rounded-[16px] bg-gray-50 border border-gray-100 relative group overflow-hidden cursor-pointer h-full min-h-[100px]"
                >
                  <div className="absolute inset-0 flex items-center justify-center text-gray-300 group-hover:scale-110 transition-transform duration-500">
                    <ImageIcon size={24} />
                  </div>
                  <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-2 left-2 right-2 bg-white/90 backdrop-blur-md px-3 py-2 rounded-xl translate-y-full group-hover:translate-y-0 transition-transform duration-300 border border-gray-100 shadow-sm">
                    <div className="text-[10px] font-bold truncate text-[#1D1D1F]">
                      Render_{i}.png
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

type Message = {
  role: 'system' | 'user';
  text: string;
};

type GuardianRoomProps = {
  project: Project | null;
  onBack: () => void;
};

const GuardianRoom = ({ project, onBack }: GuardianRoomProps) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'system',
      text: 'I\'ve analyzed the "Nebula" brief. The tone is strictly high-key and kinetic. Would you like me to draft the opening monologue or generate a scene breakdown?',
    },
  ]);
  const endRef = useRef<HTMLDivElement | null>(null);

  const send = async () => {
    if (!input.trim()) return;
    const newMsg: Message = { role: 'user', text: input };
    setMessages((p) => [...p, newMsg]);
    setInput('');
    const res = await callGemini(
      input,
      'You are Lumina, a creative AI director. Keep responses concise and focused on film/design direction.',
    );
    setMessages((p) => [...p, { role: 'system', text: res }]);
  };

  useEffect(() => endRef.current?.scrollIntoView({ behavior: 'smooth' }), [messages]);

  return (
    <div className="h-full flex flex-col md:flex-row gap-8 pb-32 animate-in fade-in pt-8 px-8 max-w-[1800px] mx-auto">
      <div className="md:hidden flex items-center gap-4 mb-4">
        <button onClick={onBack}>
          <ArrowRight className="rotate-180 text-gray-500" size={24} />
        </button>
        <h2 className="text-lg font-bold">Writer&apos;s Room</h2>
      </div>
      <div className="hidden md:flex w-[380px] flex-col gap-6 shrink-0 h-full overflow-y-auto pb-4">
        <div className="text-xs font-bold uppercase tracking-widest text-[#86868B] pl-1">
          Project Context
        </div>
        <Card className="bg-white border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-4 text-[#1D1D1F]">
            <FileText size={18} />
            <h3 className="text-sm font-bold">The Brief</h3>
          </div>
          <p className="text-sm text-[#6B7280] leading-relaxed mb-6 font-medium">
            Create a 30s spot for "{project?.title || 'Nebula'}". Focus on the transition from noise to clarity.
          </p>
          <div className="flex gap-2 flex-wrap">
            {['Silence', 'White', 'Kinetic'].map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 bg-[#F5F5F7] rounded-md text-[11px] font-semibold text-[#1D1D1F] border border-gray-200"
              >
                {tag}
              </span>
            ))}
          </div>
        </Card>
        <Card className="bg-white border-gray-100 shadow-sm flex-1">
          <div className="flex items-center gap-3 mb-4 text-[#1D1D1F]">
            <ImageIcon size={18} />
            <h3 className="text-sm font-bold">Visual Language</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="aspect-square bg-[#F5F5F7] rounded-xl border border-gray-100 flex items-center justify-center text-gray-400">
              Ref 1
            </div>
            <div className="aspect-square bg-[#F5F5F7] rounded-xl border border-gray-100 flex items-center justify-center text-gray-400">
              Ref 2
            </div>
            <div className="aspect-square bg-[#F5F5F7] rounded-xl border border-gray-100 flex items-center justify-center text-gray-400">
              Ref 3
            </div>
            <div className="aspect-square border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center text-gray-300 hover:border-[#1D1D1F] hover:text-[#1D1D1F] transition-colors cursor-pointer">
              <Plus size={20} />
            </div>
          </div>
        </Card>
      </div>
      <div className="flex-1 flex flex-col h-full bg-white rounded-[32px] border border-gray-200 shadow-sm relative overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-50 bg-white/80 backdrop-blur-md z-10 sticky top-0">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
            <div>
              <span className="text-sm font-bold text-[#1D1D1F] block">Lumina Intelligence</span>
              <span className="text-[10px] text-gray-400 font-medium">Model: Gemini 2.5 Pro</span>
            </div>
          </div>
          <button className="text-xs text-[#1D1D1F] bg-[#F5F5F7] hover:bg-[#E5E5E5] border border-transparent px-4 py-2 rounded-full font-bold transition-all">
            Export Script
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-[#FAFAFA]">
          {messages.map((m, i) => (
            <div
              key={`${m.role}-${i}`}
              className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start items-start gap-4'} animate-in slide-in-from-bottom-2`}
            >
              {m.role === 'system' && (
                <div className="w-8 h-8 rounded-full bg-white border border-gray-100 flex items-center justify-center mt-4 flex-shrink-0 shadow-sm text-[#1D1D1F]">
                  <Sparkles size={14} />
                </div>
              )}
              <div
                className={`max-w-[85%] md:max-w-[70%] ${
                  m.role === 'user' ? 'bubble-user' : 'bubble-ai'
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}
          <div ref={endRef} />
        </div>
        <div className="p-6 bg-white border-t border-gray-100">
          <div className="relative max-w-4xl mx-auto">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && send()}
              placeholder="Message Lumina..."
              className="w-full bg-[#F5F5F7] border border-transparent focus:border-gray-200 focus:bg-white rounded-[20px] px-6 py-4 text-sm outline-none transition-all pl-6 pr-14 font-medium placeholder:text-gray-400 text-[#1D1D1F]"
            />
            <button
              onClick={send}
              className="absolute right-2 top-2 p-2 bg-[#1D1D1F] text-white rounded-[14px] hover:scale-105 transition-transform shadow-md"
            >
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

type ProjectsViewProps = {
  projects: Project[];
  onSelect: (project: Project) => void;
};

const ProjectsView = ({ projects, onSelect }: ProjectsViewProps) => (
  <div className="pt-12 px-12 max-w-[1600px] mx-auto animate-in fade-in">
    <div className="flex justify-between items-end mb-8">
      <div>
        <h1 className="text-4xl font-bold tracking-tight text-[#1D1D1F] mb-2">Manifests</h1>
        <p className="text-[#86868B] text-sm">Active creative engagements.</p>
      </div>
      <div className="flex gap-2">
        <button className="px-4 py-2 bg-white border border-gray-200 rounded-[14px] text-xs font-bold hover:border-black transition-colors">
          Filter
        </button>
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <div
        className={`group cursor-pointer min-h-[320px] ${LQ.radius.card} border-2 border-dashed border-[#E5E5E5] flex flex-col items-center justify-center hover:border-[#1D1D1F]/30 hover:bg-white/50 transition-all duration-300`}
      >
        <div className="w-16 h-16 rounded-full bg-white shadow-md flex items-center justify-center text-[#86868B] group-hover:text-[#1D1D1F] group-hover:scale-110 transition-all mb-6">
          <Plus size={32} />
        </div>
        <span className="font-medium text-[#86868B] group-hover:text-[#1D1D1F]">
          Initiate Manifest
        </span>
      </div>
      {projects.map((p) => (
        <Card
          key={p.id}
          onClick={() => onSelect(p)}
          className="min-h-[320px] flex flex-col justify-between group cursor-pointer hover:border-[#1D1D1F]/10"
        >
          <div>
            <div className="flex justify-between items-start mb-8">
              <span className="px-3 py-1 bg-[#F5F5F7] border border-gray-100 rounded-lg text-[10px] uppercase font-bold tracking-wider text-[#86868B] flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" /> {p.status}
              </span>
              <button className="text-gray-300 hover:text-black transition-colors">
                <MoreHorizontal size={20} />
              </button>
            </div>
            <h3 className="text-3xl font-bold text-[#1D1D1F] mb-3 group-hover:translate-x-1 transition-transform kinetic-text">
              {p.title}
            </h3>
            <p className="text-[#86868B] text-sm line-clamp-2 leading-relaxed">
              {p.description}
            </p>
          </div>
          <div className="pt-8 border-t border-gray-50 flex justify-between items-end">
            <div className="flex -space-x-3">
              <div className="w-10 h-10 rounded-full bg-gray-100 border-2 border-white" />
              <div className="w-10 h-10 rounded-full bg-gray-200 border-2 border-white" />
            </div>
            <div className="w-12 h-12 rounded-full bg-[#1D1D1F] text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 shadow-xl">
              <ArrowRight size={20} />
            </div>
          </div>
        </Card>
      ))}
    </div>
  </div>
);

// --- MAIN APP COMPOSITOR ---
export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [writerMode, setWriterMode] = useState(false);
  const [projects] = useState<Project[]>([
    {
      id: '1',
      title: 'Nebula Phase II',
      client: 'AeroSpace',
      status: 'In Progress',
      description: 'Rebrand focusing on kinetic typography and zero-gravity aesthetics.',
      tone: ['Ethereal', 'Technical'],
    },
  ]);

  const handleProjectSelect = (p: Project) => {
    setActiveProject(p);
    setWriterMode(true);
  };

  const renderContent = () => {
    if (activeProject) {
      if (writerMode) {
        return <GuardianRoom project={activeProject} onBack={() => setActiveProject(null)} />;
      }
      return <div className="p-12">Project Space Placeholder</div>;
    }
    switch (activeTab) {
      case 'dashboard':
        return <DashboardHome />;
      case 'projects':
        return <ProjectsView projects={projects} onSelect={handleProjectSelect} />;
      case 'writers-room':
        return <GuardianRoom project={null} onBack={() => setActiveTab('dashboard')} />;
      default:
        return (
          <div className="h-full flex flex-col items-center justify-center text-[#86868B]">
            <div className="w-20 h-20 bg-[#F5F5F7] rounded-[24px] flex items-center justify-center mb-6">
              <Box size={32} />
            </div>
            <h3 className="text-lg font-bold text-[#1D1D1F] mb-1">Module Locked</h3>
            <p className="text-sm">This sector is currently under construction.</p>
          </div>
        );
    }
  };

  return (
    <div className="w-full h-screen bg-[#F5F5F7] flex relative overflow-hidden text-[#111111]">
      <GlobalStyles />
      <Sidebar
        activeTab={activeTab}
        setActiveTab={(t) => {
          setActiveTab(t);
          setActiveProject(null);
        }}
      />
      <main className="flex-1 ml-72 h-full overflow-y-auto relative z-0">{renderContent()}</main>
      <CommandBar />
    </div>
  );
}

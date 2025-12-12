import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import { addDoc, collection, getFirestore, onSnapshot, orderBy, query, serverTimestamp } from 'firebase/firestore';
import {
    AlertCircle,
    ArrowRight,
    Check,
    ChevronRight,
    Film,
    FolderKanban,
    Home,
    Lightbulb,
    Loader2,
    MessageSquare,
    PenTool,
    Plus,
    Send,
    Sparkles,
    Star,
    Target,
    User,
    Users,
    Wand2,
    X,
    Zap
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

// --- FIREBASE CONFIG ---
const firebaseConfig = typeof __firebase_config !== 'undefined' 
  ? JSON.parse(__firebase_config) 
  : {
      apiKey: "demo-key",
      authDomain: "demo.firebaseapp.com",
      projectId: "demo-project",
      storageBucket: "demo.appspot.com",
      messagingSenderId: "123456789",
      appId: "1:123456789:web:abc123"
    };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// --- GEMINI API HELPERS ---
const apiKey = typeof __gemini_api_key !== 'undefined' ? __gemini_api_key : '';

const callGemini = async (prompt, systemInstruction = '') => {
  if (!apiKey) {
    return "AI features require a Gemini API key. Please configure your API key.";
  }
  
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        systemInstruction: systemInstruction ? { parts: [{ text: systemInstruction }] } : undefined,
        generationConfig: { temperature: 0.8, maxOutputTokens: 2048 }
      })
    });
    
    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated.';
  } catch (error) {
    console.error('Gemini API error:', error);
    return 'Error connecting to AI service.';
  }
};

const callGeminiJSON = async (prompt, systemInstruction = '') => {
  if (!apiKey) {
    return { error: "AI features require a Gemini API key." };
  }
  
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        systemInstruction: systemInstruction ? { parts: [{ text: systemInstruction }] } : undefined,
        generationConfig: { 
          temperature: 0.3, 
          maxOutputTokens: 2048,
          responseMimeType: "application/json"
        }
      })
    });
    
    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    return text ? JSON.parse(text) : { error: 'No response' };
  } catch (error) {
    console.error('Gemini JSON API error:', error);
    return { error: 'Error parsing AI response.' };
  }
};

// --- DESIGN SYSTEM TOKENS (LIQUID GLASS / SINGULARITY) ---
const DS = {
  colors: {
    void: "bg-[#F5F5F7]",
    surface: "bg-[#FDFDFD]",
    glass: "bg-white/80 backdrop-blur-2xl saturate-150",
    textPrimary: "text-[#1D1D1F]",
    textSecondary: "text-[#6B7280]",
    accent: "text-[#5C5CFF]",
    accentBg: "bg-[#5C5CFF]",
    obsidian: "bg-[#1D1D1F]",
    porcelain: "text-[#FDFDFD]",
  },
  shadows: {
    ambient: "shadow-[0_8px_30px_rgba(0,0,0,0.04)]",
    float: "shadow-[0_20px_50px_rgba(0,0,0,0.08)]",
    deep: "shadow-[0_30px_60px_rgba(0,0,0,0.12)]",
  },
  layout: {
    radius: "rounded-[24px]",
    radiusSm: "rounded-[16px]",
    radiusFull: "rounded-full",
    gap: "gap-6",
    pad: "p-8",
    padSm: "p-6",
  },
  typography: {
    hero: "text-5xl font-semibold tracking-tighter leading-[0.9]",
    heading: "text-2xl font-semibold tracking-tight",
    subheading: "text-lg font-medium tracking-tight",
    body: "text-base font-normal",
    caption: "text-sm font-medium",
    micro: "text-xs font-medium uppercase tracking-wider",
  }
};

// --- MOCK DATA ---
const mockFreelancers = [
  { id: '1', name: 'Sarah Chen', role: 'Director', tags: ['cinematic', 'narrative', 'documentary'], rating: 4.9, avatar: null },
  { id: '2', name: 'Marcus Webb', role: 'Cinematographer', tags: ['moody', 'low-light', 'handheld'], rating: 4.8, avatar: null },
  { id: '3', name: 'Elena Rodriguez', role: 'Editor', tags: ['fast-paced', 'commercial', 'color-grade'], rating: 4.7, avatar: null },
  { id: '4', name: 'James Liu', role: 'Sound Designer', tags: ['ambient', 'foley', 'immersive'], rating: 4.9, avatar: null },
  { id: '5', name: 'Priya Sharma', role: 'VFX Artist', tags: ['compositing', 'motion-graphics', '3d'], rating: 4.6, avatar: null },
];

// --- COMPONENTS ---

// Card Component with Liquid Glass physics
const Card = ({ children, className = '', hover = true, glass = false, onClick }) => (
  <div 
    onClick={onClick}
    className={`
      ${glass ? DS.colors.glass : DS.colors.surface}
      ${DS.layout.radius}
      ${DS.shadows.ambient}
      ${hover ? 'hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] hover:-translate-y-1 cursor-pointer' : ''}
      transition-all duration-300 ease-out
      ${className}
    `}
  >
    {children}
  </div>
);

// Button Component
const Button = ({ children, variant = 'primary', size = 'md', icon: Icon, loading, disabled, className = '', ...props }) => {
  const variants = {
    primary: `${DS.colors.obsidian} ${DS.colors.porcelain} hover:opacity-90`,
    secondary: `${DS.colors.glass} ${DS.colors.textPrimary} hover:bg-white/90`,
    ghost: `bg-transparent ${DS.colors.textSecondary} hover:${DS.colors.textPrimary}`,
    accent: `${DS.colors.accentBg} text-white hover:opacity-90`,
  };
  
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <button
      disabled={disabled || loading}
      className={`
        ${variants[variant]}
        ${sizes[size]}
        ${DS.layout.radiusFull}
        font-medium inline-flex items-center justify-center gap-2
        transition-all duration-200 ease-out
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      {...props}
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : Icon && <Icon className="w-4 h-4" />}
      {children}
    </button>
  );
};

// Input Component
const Input = ({ className = '', ...props }) => (
  <input
    className={`
      w-full bg-[#F3F4F6] ${DS.layout.radiusFull}
      px-6 py-4 ${DS.colors.textPrimary}
      placeholder:${DS.colors.textSecondary}
      focus:outline-none focus:ring-2 focus:ring-[#5C5CFF]/20
      transition-all duration-200
      ${className}
    `}
    {...props}
  />
);

// Textarea Component
const Textarea = ({ className = '', ...props }) => (
  <textarea
    className={`
      w-full bg-[#F3F4F6] ${DS.layout.radiusSm}
      px-6 py-4 ${DS.colors.textPrimary}
      placeholder:${DS.colors.textSecondary}
      focus:outline-none focus:ring-2 focus:ring-[#5C5CFF]/20
      transition-all duration-200 resize-none
      ${className}
    `}
    {...props}
  />
);

// Modal Component
const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      />
      <Card 
        className={`relative z-10 w-full max-w-2xl max-h-[90vh] overflow-auto ${DS.layout.pad}`}
        hover={false}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className={`${DS.typography.heading} ${DS.colors.textPrimary}`}>{title}</h2>
          <button 
            onClick={onClose}
            className={`p-2 ${DS.layout.radiusFull} ${DS.colors.glass} hover:bg-white/90`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        {children}
      </Card>
    </div>
  );
};

// Navigation Dock (Floating Command Bar)
const NavigationDock = ({ currentView, setCurrentView, onCreateProject }) => (
  <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
    <Card glass className="flex items-center gap-2 px-4 py-3" hover={false}>
      <button 
        onClick={() => setCurrentView('dashboard')}
        className={`p-3 ${DS.layout.radiusFull} transition-all ${currentView === 'dashboard' ? DS.colors.obsidian + ' ' + DS.colors.porcelain : 'hover:bg-black/5'}`}
      >
        <Home className="w-5 h-5" />
      </button>
      <button 
        onClick={() => setCurrentView('projects')}
        className={`p-3 ${DS.layout.radiusFull} transition-all ${currentView === 'projects' ? DS.colors.obsidian + ' ' + DS.colors.porcelain : 'hover:bg-black/5'}`}
      >
        <FolderKanban className="w-5 h-5" />
      </button>
      <button 
        onClick={() => setCurrentView('roster')}
        className={`p-3 ${DS.layout.radiusFull} transition-all ${currentView === 'roster' ? DS.colors.obsidian + ' ' + DS.colors.porcelain : 'hover:bg-black/5'}`}
      >
        <Users className="w-5 h-5" />
      </button>
      <button 
        onClick={() => setCurrentView('writers-room')}
        className={`p-3 ${DS.layout.radiusFull} transition-all ${currentView === 'writers-room' ? DS.colors.obsidian + ' ' + DS.colors.porcelain : 'hover:bg-black/5'}`}
      >
        <MessageSquare className="w-5 h-5" />
      </button>
      <div className="w-px h-8 bg-black/10 mx-2" />
      <Button 
        icon={Plus} 
        variant="accent" 
        size="sm"
        onClick={onCreateProject}
      >
        Create
      </Button>
    </Card>
  </div>
);

// Smart Project Genesis Modal
const ProjectGenesisModal = ({ isOpen, onClose, onProjectCreated }) => {
  const [rawText, setRawText] = useState('');
  const [loading, setLoading] = useState(false);
  const [parsedData, setParsedData] = useState(null);
  const [step, setStep] = useState('input'); // 'input' | 'preview' | 'success'

  const handleParse = async () => {
    if (!rawText.trim()) return;
    setLoading(true);
    
    const systemPrompt = `You are a creative project parser. Extract structured project information from unstructured text like emails, notes, or briefs. Return a JSON object with these fields:
    - title: A concise project title
    - description: A 2-3 sentence summary of the project
    - tone: The creative tone/mood (e.g., "cinematic", "playful", "corporate", "moody")
    - dos: Array of 3-5 things to do/include
    - donts: Array of 3-5 things to avoid
    - deadline: Extracted deadline if mentioned, or null
    - budget: Extracted budget if mentioned, or null`;

    const result = await callGeminiJSON(
      `Parse this project brief/email/notes into structured project data:\n\n${rawText}`,
      systemPrompt
    );

    if (result.error) {
      setParsedData({ 
        title: 'New Project', 
        description: rawText.slice(0, 200),
        tone: 'creative',
        dos: ['Define clear objectives', 'Maintain brand consistency'],
        donts: ['Rush the process', 'Ignore feedback'],
        deadline: null,
        budget: null
      });
    } else {
      setParsedData(result);
    }
    
    setStep('preview');
    setLoading(false);
  };

  const handleCreate = async () => {
    setLoading(true);
    try {
      const projectRef = await addDoc(collection(db, 'projects'), {
        ...parsedData,
        status: 'active',
        createdAt: serverTimestamp(),
        assets: [],
        scripts: []
      });
      
      onProjectCreated({ id: projectRef.id, ...parsedData });
      setStep('success');
      setTimeout(() => {
        onClose();
        setStep('input');
        setRawText('');
        setParsedData(null);
      }, 1500);
    } catch (error) {
      console.error('Error creating project:', error);
    }
    setLoading(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Smart Project Genesis">
      {step === 'input' && (
        <div className="space-y-6">
          <p className={DS.colors.textSecondary}>
            Paste an email, notes, or any unstructured brief. AI will extract and structure your project.
          </p>
          <Textarea
            rows={8}
            placeholder="Paste your email, notes, or brief here... 

Example: 'Hey team, we need a 60-second spot for the new product launch. Think Apple meets Nike - clean, aspirational. Need it by end of month. Budget around 50k. Avoid anything too corporate or generic.'"
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
          />
          <div className="flex justify-end">
            <Button 
              icon={Sparkles} 
              variant="accent"
              onClick={handleParse}
              loading={loading}
              disabled={!rawText.trim()}
            >
              Parse with AI
            </Button>
          </div>
        </div>
      )}

      {step === 'preview' && parsedData && (
        <div className="space-y-6">
          <div className={`${DS.colors.void} ${DS.layout.radiusSm} p-6 space-y-4`}>
            <div>
              <span className={`${DS.typography.micro} ${DS.colors.textSecondary}`}>TITLE</span>
              <h3 className={`${DS.typography.subheading} ${DS.colors.textPrimary} mt-1`}>{parsedData.title}</h3>
            </div>
            <div>
              <span className={`${DS.typography.micro} ${DS.colors.textSecondary}`}>DESCRIPTION</span>
              <p className={`${DS.typography.body} ${DS.colors.textPrimary} mt-1`}>{parsedData.description}</p>
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <span className={`${DS.typography.micro} ${DS.colors.textSecondary}`}>TONE</span>
                <p className={`${DS.typography.caption} ${DS.colors.accent} mt-1`}>{parsedData.tone}</p>
              </div>
              {parsedData.deadline && (
                <div className="flex-1">
                  <span className={`${DS.typography.micro} ${DS.colors.textSecondary}`}>DEADLINE</span>
                  <p className={`${DS.typography.caption} ${DS.colors.textPrimary} mt-1`}>{parsedData.deadline}</p>
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className={`${DS.typography.micro} text-green-600`}>DO'S</span>
                <ul className="mt-2 space-y-1">
                  {parsedData.dos?.map((item, i) => (
                    <li key={i} className={`${DS.typography.caption} ${DS.colors.textPrimary} flex items-start gap-2`}>
                      <Check className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <span className={`${DS.typography.micro} text-red-500`}>DON'TS</span>
                <ul className="mt-2 space-y-1">
                  {parsedData.donts?.map((item, i) => (
                    <li key={i} className={`${DS.typography.caption} ${DS.colors.textPrimary} flex items-start gap-2`}>
                      <X className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div className="flex justify-between">
            <Button variant="ghost" onClick={() => setStep('input')}>
              Back
            </Button>
            <Button 
              icon={Zap} 
              variant="primary"
              onClick={handleCreate}
              loading={loading}
            >
              Create Project
            </Button>
          </div>
        </div>
      )}

      {step === 'success' && (
        <div className="text-center py-12">
          <div className={`w-16 h-16 ${DS.colors.accentBg} ${DS.layout.radiusFull} flex items-center justify-center mx-auto mb-4`}>
            <Check className="w-8 h-8 text-white" />
          </div>
          <h3 className={`${DS.typography.heading} ${DS.colors.textPrimary}`}>Project Created!</h3>
          <p className={`${DS.colors.textSecondary} mt-2`}>Your project is ready to go.</p>
        </div>
      )}
    </Modal>
  );
};

// Dashboard View
const DashboardView = ({ projects, setCurrentView, setSelectedProject }) => {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning.' : hour < 18 ? 'Good Afternoon.' : 'Good Evening.';

  return (
    <div className={`min-h-screen ${DS.colors.void} p-8 pb-32`}>
      {/* Noise Overlay */}
      <div className="fixed inset-0 opacity-[0.015] pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNhKSIvPjwvc3ZnPg==')]" />
      
      <div className="max-w-7xl mx-auto relative">
        {/* Hero Greeting */}
        <div className="mb-12">
          <h1 className={`${DS.typography.hero} ${DS.colors.textPrimary}`}>{greeting}</h1>
          <p className={`${DS.typography.subheading} ${DS.colors.textSecondary} mt-2`}>
            {projects.length} active projects in your creative universe.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-12 gap-6">
          {/* Stats Card - Large */}
          <Card className={`col-span-4 ${DS.layout.pad}`}>
            <span className={`${DS.typography.micro} ${DS.colors.textSecondary}`}>ACTIVE PROJECTS</span>
            <div className={`${DS.typography.hero} ${DS.colors.textPrimary} mt-2`}>{projects.length}</div>
            <div className={`flex items-center gap-2 mt-4 ${DS.colors.accent}`}>
              <ArrowRight className="w-4 h-4" />
              <span className={DS.typography.caption}>View all</span>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className={`col-span-4 ${DS.layout.pad}`}>
            <span className={`${DS.typography.micro} ${DS.colors.textSecondary}`}>QUICK ACTIONS</span>
            <div className="mt-4 space-y-3">
              <button 
                onClick={() => setCurrentView('projects')}
                className={`w-full flex items-center justify-between p-3 ${DS.colors.void} ${DS.layout.radiusSm} hover:bg-[#EBEBED] transition-colors`}
              >
                <span className={`${DS.typography.caption} ${DS.colors.textPrimary} flex items-center gap-2`}>
                  <FolderKanban className="w-4 h-4" /> Projects
                </span>
                <ChevronRight className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setCurrentView('roster')}
                className={`w-full flex items-center justify-between p-3 ${DS.colors.void} ${DS.layout.radiusSm} hover:bg-[#EBEBED] transition-colors`}
              >
                <span className={`${DS.typography.caption} ${DS.colors.textPrimary} flex items-center gap-2`}>
                  <Users className="w-4 h-4" /> Talent Roster
                </span>
                <ChevronRight className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setCurrentView('writers-room')}
                className={`w-full flex items-center justify-between p-3 ${DS.colors.void} ${DS.layout.radiusSm} hover:bg-[#EBEBED] transition-colors`}
              >
                <span className={`${DS.typography.caption} ${DS.colors.textPrimary} flex items-center gap-2`}>
                  <MessageSquare className="w-4 h-4" /> Writer's Room
                </span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </Card>

          {/* AI Insight */}
          <Card className={`col-span-4 ${DS.layout.pad} ${DS.colors.obsidian}`}>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-white/60" />
              <span className={`${DS.typography.micro} text-white/60`}>AI INSIGHT</span>
            </div>
            <p className={`${DS.typography.body} text-white/90`}>
              Your projects are 23% ahead of typical timelines. Great momentum—consider assigning additional talent to "Brand Campaign" for faster delivery.
            </p>
          </Card>

          {/* Recent Projects */}
          <div className="col-span-8">
            <div className="flex items-center justify-between mb-4">
              <span className={`${DS.typography.micro} ${DS.colors.textSecondary}`}>RECENT PROJECTS</span>
              <button 
                onClick={() => setCurrentView('projects')}
                className={`${DS.typography.caption} ${DS.colors.accent} flex items-center gap-1`}
              >
                View All <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {projects.slice(0, 4).map(project => (
                <Card 
                  key={project.id} 
                  className={DS.layout.padSm}
                  onClick={() => {
                    setSelectedProject(project);
                    setCurrentView('project-detail');
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className={`${DS.typography.subheading} ${DS.colors.textPrimary}`}>{project.title}</h3>
                      <p className={`${DS.typography.caption} ${DS.colors.textSecondary} mt-1`}>{project.description?.slice(0, 60)}...</p>
                    </div>
                    <span className={`px-3 py-1 ${DS.layout.radiusFull} bg-[#5C5CFF]/10 ${DS.colors.accent} ${DS.typography.micro}`}>
                      {project.tone || 'creative'}
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Team Preview */}
          <Card className={`col-span-4 ${DS.layout.pad}`}>
            <span className={`${DS.typography.micro} ${DS.colors.textSecondary}`}>TOP TALENT</span>
            <div className="mt-4 space-y-3">
              {mockFreelancers.slice(0, 3).map(freelancer => (
                <div key={freelancer.id} className="flex items-center gap-3">
                  <div className={`w-10 h-10 ${DS.colors.void} ${DS.layout.radiusFull} flex items-center justify-center`}>
                    <User className="w-5 h-5 text-gray-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`${DS.typography.caption} ${DS.colors.textPrimary} truncate`}>{freelancer.name}</p>
                    <p className={`${DS.typography.micro} ${DS.colors.textSecondary}`}>{freelancer.role}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                    <span className={`${DS.typography.caption} ${DS.colors.textPrimary}`}>{freelancer.rating}</span>
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

// Projects View
const ProjectsView = ({ projects, setSelectedProject, setCurrentView }) => (
  <div className={`min-h-screen ${DS.colors.void} p-8 pb-32`}>
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className={`${DS.typography.heading} ${DS.colors.textPrimary}`}>Projects</h1>
          <p className={`${DS.colors.textSecondary} mt-1`}>{projects.length} creative projects</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {projects.map(project => (
          <Card 
            key={project.id} 
            className={DS.layout.pad}
            onClick={() => {
              setSelectedProject(project);
              setCurrentView('project-detail');
            }}
          >
            <div className="flex items-start justify-between mb-4">
              <span className={`px-3 py-1 ${DS.layout.radiusFull} bg-[#5C5CFF]/10 ${DS.colors.accent} ${DS.typography.micro}`}>
                {project.tone || 'creative'}
              </span>
              <span className={`${DS.typography.micro} ${DS.colors.textSecondary}`}>
                {project.status || 'active'}
              </span>
            </div>
            <h3 className={`${DS.typography.subheading} ${DS.colors.textPrimary}`}>{project.title}</h3>
            <p className={`${DS.typography.body} ${DS.colors.textSecondary} mt-2 line-clamp-2`}>{project.description}</p>
            
            {(project.dos?.length > 0 || project.donts?.length > 0) && (
              <div className="mt-4 pt-4 border-t border-black/5">
                <div className="flex gap-2 flex-wrap">
                  {project.dos?.slice(0, 2).map((tag, i) => (
                    <span key={i} className={`px-2 py-1 ${DS.layout.radiusFull} bg-green-50 text-green-600 ${DS.typography.micro}`}>
                      {tag.slice(0, 15)}...
                    </span>
                  ))}
                </div>
              </div>
            )}
          </Card>
        ))}

        {projects.length === 0 && (
          <div className="col-span-3 text-center py-24">
            <div className={`w-20 h-20 ${DS.colors.void} ${DS.layout.radiusFull} flex items-center justify-center mx-auto mb-4`}>
              <FolderKanban className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className={`${DS.typography.subheading} ${DS.colors.textPrimary}`}>No projects yet</h3>
            <p className={`${DS.colors.textSecondary} mt-2`}>Create your first project using the command bar below.</p>
          </div>
        )}
      </div>
    </div>
  </div>
);

// Project Detail View (Bento Dashboard)
const ProjectDetailView = ({ project, setCurrentView, onUpdate }) => {
  const [generatingScript, setGeneratingScript] = useState(false);
  const [script, setScript] = useState(project.scripts?.[0] || null);

  const handleGenerateScript = async () => {
    setGeneratingScript(true);
    
    const prompt = `Write a compelling screenplay format script for a creative video project.

Project Details:
- Title: ${project.title}
- Description: ${project.description}
- Tone/Mood: ${project.tone}
- Guidelines to follow: ${project.dos?.join(', ')}
- Things to avoid: ${project.donts?.join(', ')}

Write a 30-60 second script in proper screenplay format with:
- Scene headings (INT./EXT.)
- Action lines
- Dialogue (if appropriate for the tone)
- Visual directions

Make it creative, engaging, and aligned with the project's tone.`;

    const result = await callGemini(prompt, 
      "You are an award-winning screenwriter specializing in commercials and branded content. Write scripts that are visually compelling and emotionally resonant."
    );
    
    setScript(result);
    setGeneratingScript(false);
  };

  return (
    <div className={`min-h-screen ${DS.colors.void} p-8 pb-32`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={() => setCurrentView('projects')}
            className={`p-2 ${DS.layout.radiusFull} ${DS.colors.glass} hover:bg-white/90`}
          >
            <ChevronRight className="w-5 h-5 rotate-180" />
          </button>
          <div>
            <h1 className={`${DS.typography.heading} ${DS.colors.textPrimary}`}>{project.title}</h1>
            <p className={`${DS.colors.textSecondary}`}>{project.tone}</p>
          </div>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-12 gap-6">
          {/* Brief Card */}
          <Card className={`col-span-8 ${DS.layout.pad}`} hover={false}>
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-5 h-5 text-gray-400" />
              <span className={`${DS.typography.micro} ${DS.colors.textSecondary}`}>PROJECT BRIEF</span>
            </div>
            <p className={`${DS.typography.body} ${DS.colors.textPrimary} leading-relaxed`}>{project.description}</p>
          </Card>

          {/* Tone Card */}
          <Card className={`col-span-4 ${DS.layout.pad} ${DS.colors.accentBg}`} hover={false}>
            <span className={`${DS.typography.micro} text-white/60`}>TONE & MOOD</span>
            <div className={`text-3xl font-semibold text-white mt-4 tracking-tight`}>{project.tone}</div>
          </Card>

          {/* Do's */}
          <Card className={`col-span-6 ${DS.layout.pad}`} hover={false}>
            <div className="flex items-center gap-2 mb-4">
              <Check className="w-5 h-5 text-green-500" />
              <span className={`${DS.typography.micro} ${DS.colors.textSecondary}`}>DO'S</span>
            </div>
            <ul className="space-y-2">
              {project.dos?.map((item, i) => (
                <li key={i} className={`${DS.typography.body} ${DS.colors.textPrimary} flex items-start gap-3`}>
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </Card>

          {/* Don'ts */}
          <Card className={`col-span-6 ${DS.layout.pad}`} hover={false}>
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <span className={`${DS.typography.micro} ${DS.colors.textSecondary}`}>DON'TS</span>
            </div>
            <ul className="space-y-2">
              {project.donts?.map((item, i) => (
                <li key={i} className={`${DS.typography.body} ${DS.colors.textPrimary} flex items-start gap-3`}>
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </Card>

          {/* Script Generator */}
          <Card className={`col-span-12 ${DS.layout.pad}`} hover={false}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Film className="w-5 h-5 text-gray-400" />
                <span className={`${DS.typography.micro} ${DS.colors.textSecondary}`}>GENERATIVE SCRIPTWRITER</span>
              </div>
              <Button 
                icon={Sparkles}
                variant="accent"
                size="sm"
                onClick={handleGenerateScript}
                loading={generatingScript}
              >
                ✨ Generate Scene
              </Button>
            </div>
            
            {script ? (
              <div className={`${DS.colors.void} ${DS.layout.radiusSm} p-6`}>
                <pre className={`${DS.typography.body} ${DS.colors.textPrimary} whitespace-pre-wrap font-mono text-sm leading-relaxed`}>
                  {script}
                </pre>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className={`w-16 h-16 ${DS.colors.void} ${DS.layout.radiusFull} flex items-center justify-center mx-auto mb-4`}>
                  <PenTool className="w-8 h-8 text-gray-300" />
                </div>
                <p className={DS.colors.textSecondary}>Click "Generate Scene" to create an AI-powered script based on your project brief.</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

// Talent Roster View
const TalentRosterView = ({ projects, selectedProject }) => {
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeProject, setActiveProject] = useState(selectedProject || projects[0] || null);

  const handleGetRecommendations = async () => {
    if (!activeProject) return;
    setLoading(true);

    const prompt = `Analyze this creative project and recommend the best team members from the available freelancer roster.

Project:
- Title: ${activeProject.title}
- Description: ${activeProject.description}
- Tone: ${activeProject.tone}
- Requirements: ${activeProject.dos?.join(', ')}

Available Freelancers:
${mockFreelancers.map(f => `- ${f.name} (${f.role}): Tags: ${f.tags.join(', ')}, Rating: ${f.rating}`).join('\n')}

Return a JSON object with:
{
  "recommended": [
    { "name": "freelancer name", "reason": "why they're a good fit", "matchScore": 95 }
  ],
  "teamSynopsis": "Brief explanation of why this team would work well together"
}`;

    const result = await callGeminiJSON(prompt,
      "You are a creative talent coordinator. Match freelancers to projects based on skills, style, and project requirements."
    );

    if (!result.error) {
      setRecommendations(result);
    }
    setLoading(false);
  };

  return (
    <div className={`min-h-screen ${DS.colors.void} p-8 pb-32`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className={`${DS.typography.heading} ${DS.colors.textPrimary}`}>Talent Resonance</h1>
            <p className={`${DS.colors.textSecondary} mt-1`}>AI-powered team matching</p>
          </div>
          <div className="flex items-center gap-4">
            <select 
              className={`px-4 py-2 ${DS.colors.glass} ${DS.layout.radiusFull} ${DS.colors.textPrimary} focus:outline-none`}
              value={activeProject?.id || ''}
              onChange={(e) => setActiveProject(projects.find(p => p.id === e.target.value))}
            >
              <option value="">Select Project</option>
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.title}</option>
              ))}
            </select>
            <Button 
              icon={Wand2}
              variant="accent"
              onClick={handleGetRecommendations}
              loading={loading}
              disabled={!activeProject}
            >
              Find Best Match
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Recommendations Panel */}
          {recommendations && (
            <Card className={`col-span-4 ${DS.layout.pad} ${DS.colors.obsidian}`} hover={false}>
              <div className="flex items-center gap-2 mb-6">
                <Sparkles className="w-5 h-5 text-white/60" />
                <span className={`${DS.typography.micro} text-white/60`}>AI RECOMMENDATION</span>
              </div>
              <p className="text-white/80 text-sm mb-6">{recommendations.teamSynopsis}</p>
              <div className="space-y-3">
                {recommendations.recommended?.map((rec, i) => (
                  <div key={i} className="bg-white/10 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-medium">{rec.name}</span>
                      <span className="text-[#5C5CFF] text-sm font-semibold">{rec.matchScore}%</span>
                    </div>
                    <p className="text-white/60 text-sm">{rec.reason}</p>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Freelancer Table */}
          <Card className={`${recommendations ? 'col-span-8' : 'col-span-12'} overflow-hidden`} hover={false}>
            <table className="w-full">
              <thead>
                <tr className={`${DS.colors.void} border-b border-black/5`}>
                  <th className={`${DS.typography.micro} ${DS.colors.textSecondary} text-left px-6 py-4`}>NAME</th>
                  <th className={`${DS.typography.micro} ${DS.colors.textSecondary} text-left px-6 py-4`}>ROLE</th>
                  <th className={`${DS.typography.micro} ${DS.colors.textSecondary} text-left px-6 py-4`}>TAGS</th>
                  <th className={`${DS.typography.micro} ${DS.colors.textSecondary} text-left px-6 py-4`}>RATING</th>
                </tr>
              </thead>
              <tbody>
                {mockFreelancers.map(freelancer => (
                  <tr key={freelancer.id} className="border-b border-black/5 hover:bg-black/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 ${DS.colors.void} ${DS.layout.radiusFull} flex items-center justify-center`}>
                          <User className="w-5 h-5 text-gray-400" />
                        </div>
                        <span className={`${DS.typography.caption} ${DS.colors.textPrimary}`}>{freelancer.name}</span>
                      </div>
                    </td>
                    <td className={`px-6 py-4 ${DS.typography.body} ${DS.colors.textSecondary}`}>{freelancer.role}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2 flex-wrap">
                        {freelancer.tags.map(tag => (
                          <span key={tag} className={`px-2 py-1 ${DS.layout.radiusFull} bg-[#5C5CFF]/10 ${DS.colors.accent} ${DS.typography.micro}`}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                        <span className={`${DS.typography.caption} ${DS.colors.textPrimary}`}>{freelancer.rating}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>
      </div>
    </div>
  );
};

// Writer's Room View
const WritersRoomView = ({ projects }) => {
  const [messages, setMessages] = useState([
    { role: 'system', content: "Welcome to the Writer's Room. I'm aware of all your active projects and ready to brainstorm with you. What creative challenge can I help you tackle today?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    
    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    const projectContext = projects.map(p => 
      `- ${p.title}: ${p.description} (Tone: ${p.tone})`
    ).join('\n');

    const systemInstruction = `You are a senior creative director and brainstorm partner in "The Writer's Room." 
You have access to the user's active creative projects:

${projectContext || 'No active projects yet.'}

Help the user brainstorm ideas, solve creative problems, develop concepts, and refine their creative vision. 
Be collaborative, inspiring, and push creative boundaries while staying practical.
Reference specific projects when relevant to provide more targeted advice.`;

    const prompt = messages.map(m => `${m.role}: ${m.content}`).join('\n') + `\nuser: ${input}`;
    
    const response = await callGemini(prompt, systemInstruction);
    
    setMessages(prev => [...prev, { role: 'system', content: response }]);
    setLoading(false);
  };

  return (
    <div className={`min-h-screen ${DS.colors.void} flex`}>
      {/* Context Sidebar */}
      <div className="w-80 p-6 border-r border-black/5">
        <span className={`${DS.typography.micro} ${DS.colors.textSecondary}`}>ACTIVE PROJECTS</span>
        <div className="mt-4 space-y-3">
          {projects.map(project => (
            <Card key={project.id} className="p-4" hover={false}>
              <h4 className={`${DS.typography.caption} ${DS.colors.textPrimary}`}>{project.title}</h4>
              <p className={`${DS.typography.micro} ${DS.colors.textSecondary} mt-1`}>{project.tone}</p>
            </Card>
          ))}
          {projects.length === 0 && (
            <p className={`${DS.typography.body} ${DS.colors.textSecondary}`}>No active projects. Create one to get started.</p>
          )}
        </div>
      </div>

      {/* Chat Interface */}
      <div className="flex-1 flex flex-col">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-8 pb-32 space-y-6">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-2xl ${msg.role === 'user' 
                ? `${DS.colors.obsidian} text-white ${DS.layout.radius} px-6 py-4` 
                : `${DS.colors.surface} ${DS.colors.textPrimary} ${DS.layout.radius} px-6 py-4 ${DS.shadows.ambient}`
              }`}>
                {msg.role === 'system' && (
                  <div className="flex items-center gap-2 mb-2">
                    <Lightbulb className="w-4 h-4 text-[#5C5CFF]" />
                    <span className={`${DS.typography.micro} ${DS.colors.accent}`}>CREATIVE AI</span>
                  </div>
                )}
                <p className={`${DS.typography.body} leading-relaxed whitespace-pre-wrap`}>{msg.content}</p>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className={`${DS.colors.surface} ${DS.layout.radius} px-6 py-4 ${DS.shadows.ambient}`}>
                <Loader2 className="w-5 h-5 animate-spin text-[#5C5CFF]" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="fixed bottom-24 left-80 right-0 px-8">
          <Card glass className="flex items-center gap-4 px-6 py-4" hover={false}>
            <input
              type="text"
              placeholder="Brainstorm an idea, ask for feedback, or explore concepts..."
              className="flex-1 bg-transparent focus:outline-none text-[#1D1D1F] placeholder:text-gray-400"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <Button 
              icon={Send}
              variant="primary"
              size="sm"
              onClick={handleSend}
              disabled={!input.trim() || loading}
            >
              Send
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

// --- MAIN APP ---
export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState('dashboard');
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showGenesisModal, setShowGenesisModal] = useState(false);

  // Firebase Auth
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
      } else {
        try {
          if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
            // Use provided token
          } else {
            await signInAnonymously(auth);
          }
        } catch (error) {
          console.error('Auth error:', error);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Firestore Projects Subscription
  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const projectsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProjects(projectsData);
    }, (error) => {
      console.error('Firestore error:', error);
      // Use demo data if Firestore fails
      setProjects([
        { 
          id: 'demo-1', 
          title: 'Brand Launch Campaign', 
          description: 'A cinematic brand launch video for a new sustainable fashion line. The video should evoke emotion and tell the story of conscious creation.',
          tone: 'cinematic',
          dos: ['Use natural lighting', 'Feature diverse talent', 'Include behind-the-scenes moments', 'Emphasize craftsmanship'],
          donts: ['Avoid fast cuts', 'No stock footage', 'Skip generic music'],
          status: 'active'
        },
        { 
          id: 'demo-2', 
          title: 'Product Explainer', 
          description: 'A clean, modern explainer video for a SaaS product. Should be professional but not corporate—think Apple meets Notion.',
          tone: 'modern',
          dos: ['Clean transitions', 'Show real UI', 'Include customer testimonials'],
          donts: ['Avoid jargon', 'No cheesy animations', 'Skip generic intro'],
          status: 'active'
        }
      ]);
    });

    return () => unsubscribe();
  }, [user]);

  const handleProjectCreated = (project) => {
    // Project is added via Firestore onSnapshot
    console.log('Project created:', project);
  };

  if (loading) {
    return (
      <div className={`min-h-screen ${DS.colors.void} flex items-center justify-center`}>
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#5C5CFF] mx-auto mb-4" />
          <p className={DS.colors.textSecondary}>Loading Visionary...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="font-['Inter',-apple-system,BlinkMacSystemFont,sans-serif]">
      {/* Render Current View */}
      {currentView === 'dashboard' && (
        <DashboardView 
          projects={projects} 
          setCurrentView={setCurrentView}
          setSelectedProject={setSelectedProject}
        />
      )}
      {currentView === 'projects' && (
        <ProjectsView 
          projects={projects}
          setSelectedProject={setSelectedProject}
          setCurrentView={setCurrentView}
        />
      )}
      {currentView === 'project-detail' && selectedProject && (
        <ProjectDetailView 
          project={selectedProject}
          setCurrentView={setCurrentView}
          onUpdate={(updated) => setSelectedProject(updated)}
        />
      )}
      {currentView === 'roster' && (
        <TalentRosterView 
          projects={projects}
          selectedProject={selectedProject}
        />
      )}
      {currentView === 'writers-room' && (
        <WritersRoomView projects={projects} />
      )}

      {/* Navigation Dock */}
      <NavigationDock 
        currentView={currentView}
        setCurrentView={setCurrentView}
        onCreateProject={() => setShowGenesisModal(true)}
      />

      {/* Smart Project Genesis Modal */}
      <ProjectGenesisModal 
        isOpen={showGenesisModal}
        onClose={() => setShowGenesisModal(false)}
        onProjectCreated={handleProjectCreated}
      />
    </div>
  );
}

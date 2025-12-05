import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, FileText, ImageIcon, Plus, Sparkles } from 'lucide-react';
import Card from '../components/ui/Card';
import { GenAIService } from '../../services/GenAIService';

interface GuardianRoomProps {
  project?: {
    title: string;
  } | null;
  onBack: () => void;
}

const GuardianRoom: React.FC<GuardianRoomProps> = ({ project, onBack }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'system', text: "I've analyzed the \"Nebula\" brief. The tone is strictly high-key and kinetic. Would you like me to draft the opening monologue or generate a scene breakdown?" }
  ]);
  const endRef = useRef<HTMLDivElement>(null);
  const genAIService = GenAIService.getInstance();

  const send = async () => {
    if (!input.trim()) return;
    const newMsg = { role: 'user', text: input };
    setMessages(p => [...p, newMsg]);
    const currentInput = input;
    setInput('');
    try {
      const res = await genAIService.generateEnhancedContent(currentInput, undefined, "You are Lumina, a creative AI director. Keep responses concise and focused on film/design direction.");
      setMessages(p => [...p, { role: 'system', text: res }]);
    } catch (error) {
      console.error("Lumina Intelligence Error:", error);
      setMessages(p => [...p, { role: 'system', text: "My apologies, I'm having trouble connecting to the neural engine." }]);
    }
  };

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="h-full flex flex-col md:flex-row gap-8 pb-32 animate-in fade-in pt-8 px-8 max-w-[1800px] mx-auto">
      
      {/* Header for Mobile */}
      <div className="md:hidden flex items-center gap-4 mb-4">
         <button onClick={onBack}><ArrowRight className="rotate-180 text-gray-500" size={24}/></button>
         <h2 className="text-lg font-bold">Writer's Room</h2>
      </div>

      {/* Left Panel: Context (Hidden on small mobile, visible on desktop) */}
      <div className="hidden md:flex w-[380px] flex-col gap-6 shrink-0 h-full overflow-y-auto pb-4">
        <div className="text-xs font-bold uppercase tracking-widest text-[#86868B] pl-1">Project Context</div>
        
        <Card className="bg-white border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-4 text-[#1D1D1F]">
                <FileText size={18} />
                <h3 className="text-sm font-bold">The Brief</h3>
            </div>
            <p className="text-sm text-[#6B7280] leading-relaxed mb-6 font-medium">
            Create a 30s spot for "{project?.title || 'Nebula'}". Focus on the transition from noise to clarity.
            </p>
            <div className="flex gap-2 flex-wrap">
                {['Silence', 'White', 'Kinetic'].map(tag => (
                    <span key={tag} className="px-2.5 py-1 bg-[#F5F5F7] rounded-md text-[11px] font-semibold text-[#1D1D1F] border border-gray-200">{tag}</span>
                ))}
            </div>
        </Card>

        <Card className="bg-white border-gray-100 shadow-sm flex-1">
            <div className="flex items-center gap-3 mb-4 text-[#1D1D1F]">
                <ImageIcon size={18} />
                <h3 className="text-sm font-bold">Visual Language</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
                <div className="aspect-square bg-[#F5F5F7] rounded-xl border border-gray-100 flex items-center justify-center text-gray-400">Ref 1</div>
                <div className="aspect-square bg-[#F5F5F7] rounded-xl border border-gray-100 flex items-center justify-center text-gray-400">Ref 2</div>
                <div className="aspect-square bg-[#F5F5F7] rounded-xl border border-gray-100 flex items-center justify-center text-gray-400">Ref 3</div>
                <div className="aspect-square border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center text-gray-300 hover:border-[#1D1D1F] hover:text-[#1D1D1F] transition-colors cursor-pointer"><Plus size={20}/></div>
            </div>
        </Card>
      </div>

      {/* Right Panel: Chat */}
      <div className="flex-1 flex flex-col h-full bg-white rounded-[32px] border border-gray-200 shadow-sm relative overflow-hidden">
        {/* Chat Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-50 bg-white/80 backdrop-blur-md z-10 sticky top-0">
           <div className="flex items-center gap-3">
             <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.4)]"/>
             <div>
                <span className="text-sm font-bold text-[#1D1D1F] block">Lumina Intelligence</span>
                <span className="text-[10px] text-gray-400 font-medium">Model: Gemini 2.5 Pro</span>
             </div>
           </div>
           <button className="text-xs text-[#1D1D1F] bg-[#F5F5F7] hover:bg-[#E5E5E5] border border-transparent px-4 py-2 rounded-full font-bold transition-all">Export Script</button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-[#FAFAFA]">
           {messages.map((m, i) => (
             <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start items-start gap-4'} animate-in slide-in-from-bottom-2`}>
                {m.role === 'system' && (
                  <div className="w-8 h-8 rounded-full bg-white border border-gray-100 flex items-center justify-center mt-4 flex-shrink-0 shadow-sm text-[#1D1D1F]">
                    <Sparkles size={14}/>
                  </div>
                )}
                <div className={`max-w-[85%] md:max-w-[70%] ${m.role === 'user' ? 'bubble-user' : 'bubble-ai'}`}>
                  {m.text}
                </div>
             </div>
           ))}
           <div ref={endRef} />
        </div>

        {/* Input */}
        <div className="p-6 bg-white border-t border-gray-100">
            <div className="relative max-w-4xl mx-auto">
                <input 
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && send()}
                    placeholder="Message Lumina..."
                    className="w-full bg-[#F5F5F7] border border-transparent focus:border-gray-200 focus:bg-white rounded-[20px] px-6 py-4 text-sm outline-none transition-all pl-6 pr-14 font-medium placeholder:text-gray-400 text-[#1D1D1F]"
                />
                <button onClick={send} className="absolute right-2 top-2 p-2 bg-[#1D1D1F] text-white rounded-[14px] hover:scale-105 transition-transform shadow-md">
                    <ArrowRight size={18}/>
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default GuardianRoom;

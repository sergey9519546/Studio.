import React, { useState, useEffect, useRef } from 'react';
import { Send, Sparkles, Bot, User as UserIcon, Loader2, Paperclip, Terminal, Trash2, PenTool, Command, Cpu, FileText, X } from 'lucide-react';
import { Freelancer, Project, Assignment } from '../types';

interface AIChatProps {
    freelancers: Freelancer[];
    projects: Project[];
    assignments: Assignment[];
    onCallAction?: (action: string, params: any) => Promise<any>;
    agentMode?: boolean;
    customTitle?: string;
    customSystemInstruction?: string;
    contextData?: string;
}

// Simple Markdown Renderer
const SimpleMarkdown = ({ text }: { text: string }) => {
    const parts = text.split(/(```[\s\S]*?```)/g);
    return (
        <div className="text-sm leading-relaxed text-gray-700 space-y-2">
            {parts.map((part, index) => {
                if (part.startsWith('```')) {
                    const content = part.slice(3, -3);
                    return (
                        <div key={index} className="bg-gray-900 text-gray-100 p-3 rounded-md font-mono text-xs my-2 overflow-x-auto custom-scrollbar">
                            <pre>{content}</pre>
                        </div>
                    );
                }
                return <p key={index} className="whitespace-pre-wrap">{part}</p>;
            })}
        </div>
    );
};

const AIChat: React.FC<AIChatProps> = ({
    freelancers, projects, assignments, onCallAction, agentMode, customTitle, customSystemInstruction, contextData
}) => {
    const [messages, setMessages] = useState<any[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setSelectedFiles(prev => [...prev, ...Array.from(e.target.files!)]);
        }
    };

    const removeFile = (index: number) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleSend = async () => {
        if ((!input.trim() && selectedFiles.length === 0) || isLoading) return;

        const userMsg = input;
        const currentFiles = [...selectedFiles];

        setInput('');
        setSelectedFiles([]);
        setIsLoading(true);

        // Add user message to UI state
        setMessages(prev => [...prev, {
            role: 'user',
            parts: [{ text: userMsg }],
            files: currentFiles.map(f => f.name)
        }]);

        try {
            const formData = new FormData();
            formData.append('message', userMsg);

            // Construct context
            let context = `
            Current Date: ${new Date().toLocaleDateString()}
            Freelancers: ${freelancers.length}
            Projects: ${projects.length}
            Assignments: ${assignments.length}
            `;

            if (contextData) context += `\n\nContext Data:\n${contextData}`;
            formData.append('context', context);

            currentFiles.forEach(file => {
                formData.append('files', file);
            });

            const response = await fetch('/api/ai/chat', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`Server error: ${response.statusText}`);
            }

            const data = await response.json();

            // Handle structured response
            let responseText = data.summary || "Analysis complete.";
            if (data.key_insights) {
                responseText += "\n\n**Key Insights:**\n" + data.key_insights.map((i: string) => `- ${i}`).join('\n');
            }

            setMessages(prev => [...prev, { role: 'model', parts: [{ text: responseText }] }]);

        } catch (e: any) {
            console.error(e);
            setMessages(prev => [...prev, { role: 'model', parts: [{ text: `Error: ${e.message || "I'm having trouble connecting right now."}` }] }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={`flex flex-col h-full bg-white ${agentMode ? '' : 'rounded-2xl border border-gray-100 shadow-sm'}`}>
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center">
                        <Bot size={18} />
                    </div>
                    <div>
                        <div className="text-sm font-bold text-gray-900">{customTitle || 'Studio Intelligence'}</div>
                        <div className="text-[10px] text-gray-500 font-medium flex items-center gap-1">
                            <Sparkles size={10} className="text-emerald-500" /> Gemini 2.5 Flash
                        </div>
                    </div>
                </div>
                {agentMode && (
                    <button className="text-gray-400 hover:text-gray-900 transition-colors">
                        <Terminal size={16} />
                    </button>
                )}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                {messages.length === 0 && (
                    <div className="text-center text-gray-400 mt-10">
                        <Cpu size={32} className="mx-auto mb-3 opacity-50" />
                        <p className="text-sm font-medium">How can I help you manage the studio today?</p>
                    </div>
                )}
                {messages.map((msg, i) => (
                    <div key={i} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-gray-900 text-white' : 'bg-indigo-50 text-indigo-600'}`}>
                            {msg.role === 'user' ? <UserIcon size={14} /> : <Bot size={14} />}
                        </div>
                        <div className={`max-w-[80%] space-y-2`}>
                            <div className={`rounded-2xl p-4 text-sm ${msg.role === 'user' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-800'}`}>
                                <SimpleMarkdown text={msg.parts[0].text || ''} />
                            </div>
                            {msg.files && msg.files.length > 0 && (
                                <div className="flex flex-wrap gap-2 justify-end">
                                    {msg.files.map((f: string, idx: number) => (
                                        <div key={idx} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded flex items-center gap-1">
                                            <FileText size={10} /> {f}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
                            <Bot size={14} />
                        </div>
                        <div className="bg-gray-50 rounded-2xl p-4 flex items-center gap-2 text-gray-400">
                            <Loader2 size={16} className="animate-spin" /> Thinking...
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-100">
                {selectedFiles.length > 0 && (
                    <div className="flex gap-2 mb-2 overflow-x-auto pb-2">
                        {selectedFiles.map((file, i) => (
                            <div key={i} className="flex items-center gap-2 bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap">
                                <FileText size={12} />
                                <span className="max-w-[100px] truncate">{file.name}</span>
                                <button onClick={() => removeFile(i)} className="hover:text-indigo-900"><X size={12} /></button>
                            </div>
                        ))}
                    </div>
                )}
                <div className="relative flex gap-2">
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="p-3 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
                    >
                        <Paperclip size={20} />
                    </button>
                    <input
                        type="file"
                        multiple
                        ref={fileInputRef}
                        className="hidden"
                        onChange={handleFileSelect}
                    />

                    <div className="relative flex-1">
                        <input
                            className="w-full pl-4 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:bg-white transition-all shadow-sm placeholder-gray-400"
                            placeholder="Ask anything..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        />
                        <button
                            onClick={handleSend}
                            disabled={(!input.trim() && selectedFiles.length === 0) || isLoading}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors shadow-sm"
                        >
                            <Send size={14} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AIChat;

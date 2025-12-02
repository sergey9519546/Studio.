import React, { useState, useEffect, useRef } from 'react';
import { Send, Sparkles, Bot, User as UserIcon, Paperclip, FileText, X, Terminal } from 'lucide-react';
import { Freelancer, Project, Assignment } from '../types';

interface AIChatProps {
    freelancers: Freelancer[];
    projects: Project[];
    assignments: Assignment[];
    onCallAction?: (action: string, params: unknown) => Promise<unknown>;
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
    freelancers, projects, assignments, contextData, agentMode, customTitle
}) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [messages, setMessages] = useState<any[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setSelectedFiles(prev => [...prev, ...Array.from(e.target.files || [])]);
        }
    };

    const removeFile = (index: number) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleSend = async () => {
        if ((!input.trim() && selectedFiles.length === 0) || isLoading) return;

        const userMessage = { role: 'user', parts: [{ text: input }], files: selectedFiles.map(f => f.name) };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        const formData = new FormData();
        formData.append('message', input);

        // Add context data
        const context = {
            freelancers,
            projects,
            assignments,
            additionalContext: contextData
        };
        formData.append('context', JSON.stringify(context));

        // Append files
        selectedFiles.forEach(file => {
            formData.append('files', file);
        });

        // Clear selected files after sending
        setSelectedFiles([]);

        try {
            const response = await fetch('/api/ai/chat', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) throw new Error('Failed to fetch response');

            const data = await response.json();

            // Handle tool calls if present
            if (data.toolCalls) {
                const toolCalls = data.toolCalls;
                const toolResults = [];
                for (const toolCall of toolCalls) {
                    if (onCallAction) {
                        const result = await onCallAction(toolCall.name, toolCall.args);
                        toolResults.push({
                            toolCall,
                            result,
                        });
                    }
                }

                // Send the tool results back to the backend to get a final response
                const finalResponse = await fetch('/api/ai/chat', {
                    method: 'POST',
                    body: JSON.stringify({
                        message: input,
                        messages: [...messages, userMessage, { role: 'model', content: JSON.stringify(data) }],
                        context: JSON.stringify({ freelancers, projects, assignments, additionalContext: contextData }),
                        toolResults,
                    }),
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!finalResponse.ok) throw new Error('Failed to fetch final response');

                const finalData = await finalResponse.json();
                setMessages(prev => [...prev, { role: 'model', parts: [{ text: finalData.response }] }]);

            } else {
                setMessages(prev => [...prev, { role: 'model', parts: [{ text: data.response }] }]);
            }
        } catch (e: unknown) {
            console.error(e);
            const errorMessage = e instanceof Error ? e.message : "I'm having trouble connecting right now.";
            setMessages(prev => [...prev, { role: 'model', parts: [{ text: `Error: ${errorMessage}` }] }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={`flex flex-col h-full bg-white ${agentMode ? '' : 'rounded-2xl border border-border-subtle shadow-sm'}`}>
            {/* Header */}
            <div className="px-6 py-4 border-b border-border-subtle flex justify-between items-center bg-subtle/30">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary-tint/20 text-primary rounded-lg flex items-center justify-center">
                        <Bot size={18} />
                    </div>
                    <div>
                        <div className="text-sm font-bold text-ink-primary">{customTitle || 'Studio Intelligence'}</div>
                        <div className="text-[10px] text-ink-secondary font-medium flex items-center gap-1">
                            <Sparkles size={10} className="text-edge-teal" /> Gemini 2.0 Flash
                        </div>
                    </div>
                </div>
                {agentMode && (
                    <button className="text-ink-tertiary hover:text-ink-primary transition-colors">
                        <Terminal size={16} />
                    </button>
                )}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-app/30">
                {messages.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-center p-8">
                        <div className="w-16 h-16 bg-white rounded-2xl shadow-card flex items-center justify-center mb-6 text-primary">
                            <Sparkles size={32} strokeWidth={1.5} />
                        </div>
                        <h3 className="text-lg font-display font-bold text-ink-primary mb-2">Studio Intelligence</h3>
                        <p className="text-sm text-ink-secondary max-w-xs mb-8 leading-relaxed">
                            I can help analyze project data, draft communications, or find the perfect freelancer for your next campaign.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-md">
                            {[
                                "Draft a project brief",
                                "Find available designers",
                                "Summarize active campaigns",
                                "Check production timeline"
                            ].map((suggestion, i) => (
                                <button
                                    key={i}
                                    onClick={() => setInput(suggestion)}
                                    className="text-xs font-medium text-ink-secondary bg-white border border-border-subtle px-4 py-3 rounded-xl hover:border-primary hover:text-primary hover:shadow-sm transition-all text-left"
                                >
                                    {suggestion}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
                {messages.map((msg, i) => (
                    <div key={i} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''} animate-enter`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${msg.role === 'user' ? 'bg-ink-primary text-white' : 'bg-white border border-border-subtle text-primary'}`}>
                            {msg.role === 'user' ? <UserIcon size={14} /> : <Bot size={14} />}
                        </div>
                        <div className={`max-w-[80%] space-y-2`}>
                            <div className={`rounded-2xl p-5 text-sm leading-relaxed shadow-sm ${msg.role === 'user'
                                ? 'bg-ink-primary text-white rounded-tr-sm'
                                : 'bg-white border border-border-subtle text-ink-primary rounded-tl-sm'
                                }`}>
                                <SimpleMarkdown text={msg.parts[0].text || ''} />
                            </div>
                            {msg.files && msg.files.length > 0 && (
                                <div className="flex flex-wrap gap-2 justify-end">
                                    {msg.files.map((f: string, idx: number) => (
                                        <div key={idx} className="text-[10px] bg-subtle text-ink-secondary px-2 py-1 rounded-md flex items-center gap-1 border border-border-subtle font-medium">
                                            <FileText size={10} /> {f}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex gap-4 animate-enter">
                        <div className="w-8 h-8 rounded-full bg-white border border-border-subtle text-primary flex items-center justify-center flex-shrink-0 shadow-sm">
                            <Bot size={14} />
                        </div>
                        <div className="bg-white border border-border-subtle rounded-2xl rounded-tl-sm p-4 flex items-center gap-3 shadow-sm">
                            <div className="flex gap-1">
                                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"></div>
                            </div>
                            <span className="text-xs font-medium text-ink-tertiary uppercase tracking-wide">Analyzing</span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-border-subtle bg-white">
                {selectedFiles.length > 0 && (
                    <div className="flex gap-2 mb-3 overflow-x-auto pb-1 custom-scrollbar">
                        {selectedFiles.map((file, i) => (
                            <div key={i} className="flex items-center gap-2 bg-primary-tint/20 text-primary px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap border border-primary/20">
                                <FileText size={12} />
                                <span className="max-w-[100px] truncate">{file.name}</span>
                                <button onClick={() => removeFile(i)} className="hover:text-ink-primary transition-colors"><X size={12} /></button>
                            </div>
                        ))}
                    </div>
                )}
                <div className="relative flex gap-3 items-end">
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="p-3 text-ink-tertiary hover:text-primary hover:bg-subtle rounded-xl transition-all h-[46px] w-[46px] flex items-center justify-center"
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

                    <div className="relative flex-1 group">
                        <div className="absolute inset-0 bg-primary/5 rounded-xl scale-95 opacity-0 group-focus-within:scale-100 group-focus-within:opacity-100 transition-all duration-300 -z-10"></div>
                        <input
                            className="w-full pl-4 pr-12 py-3 bg-app/50 border border-border-subtle rounded-xl text-sm focus:outline-none focus:border-primary focus:bg-white transition-all shadow-sm placeholder-ink-tertiary text-ink-primary"
                            placeholder="Ask anything..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        />
                        <button
                            onClick={handleSend}
                            disabled={(!input.trim() && selectedFiles.length === 0) || isLoading}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-primary text-white rounded-lg hover:bg-primary-hover disabled:opacity-50 disabled:hover:bg-primary transition-all shadow-sm hover:shadow-glow hover:-translate-y-0.5"
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

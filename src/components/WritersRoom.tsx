import React, { useState } from 'react';
import { Send, Loader2, Copy, Download, Book } from 'lucide-react';
import { Button } from './design/Button';
import { Textarea } from './design/Textarea';
import { LiquidGlassContainer } from './design/LiquidGlassContainer';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  context?: string[];
}

interface GenerationContext {
  projectTitle?: string;
  brief?: string;
  guidelines?: string;
  assetMetadata: unknown[]; 
  projectIntelligence: unknown[]; 
}

interface WritersRoomProps {
  projectId: string;
  projectTitle?: string;
  brief?: string;
  guidelines?: string;
  onGenerateContent?: (prompt: string, context: GenerationContext) => Promise<string>;
}

export const WritersRoom: React.FC<WritersRoomProps> = ({
  projectId: _projectId,
  projectTitle = 'Untitled Project',
  brief = '',
  guidelines = '',
  onGenerateContent,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showContext] = useState(true);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = inputValue;
    setInputValue('');
    
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);

    setIsGenerating(true);
    try {
      const context = {
        projectTitle,
        brief,
        guidelines,
        assetMetadata: [],
        projectIntelligence: [],
      };

      const response = await onGenerateContent?.(userMessage, context) || 
        `Generated response for: ${userMessage}`;

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: response,
        context: [brief, guidelines].filter(Boolean),
      }]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  const handleDownloadMessage = (content: string) => {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
    element.setAttribute('download', `${projectTitle}-script.txt`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="w-full h-full bg-app">
      <div className="max-w-7xl mx-auto p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-ink-primary mb-2">Writer's Room</h1>
          <p className="text-ink-secondary">
            AI-powered content generation with full project context
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar: Context */}
          {showContext && (
            <div className="lg:col-span-1">
              <LiquidGlassContainer level="lg" className="sticky top-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-ink-primary">Context</h2>
                  <Book size={16} className="text-ink-tertiary" />
                </div>

                <div className="space-y-4">
                  {brief && (
                    <div>
                      <h3 className="text-xs font-bold text-ink-secondary uppercase tracking-wide mb-2">
                        Brief
                      </h3>
                      <p className="text-xs text-ink-secondary leading-relaxed line-clamp-4">
                        {brief}
                      </p>
                    </div>
                  )}

                  {guidelines && (
                    <div className="pt-4 border-t border-border-subtle">
                      <h3 className="text-xs font-bold text-ink-secondary uppercase tracking-wide mb-2">
                        Guidelines
                      </h3>
                      <p className="text-xs text-ink-secondary leading-relaxed line-clamp-3">
                        {guidelines}
                      </p>
                    </div>
                  )}

                  <div className="pt-4 border-t border-border-subtle">
                    <h3 className="text-xs font-bold text-ink-secondary uppercase tracking-wide mb-2">
                      Available Tools
                    </h3>
                    <ul className="text-xs text-ink-tertiary space-y-1">
                      <li>• Script Generation</li>
                      <li>• Copywriting</li>
                      <li>• Shotlist Creation</li>
                      <li>• Storyboards</li>
                    </ul>
                  </div>
                </div>
              </LiquidGlassContainer>
            </div>
          )}

          {/* Main: Chat Interface */}
          <div className={`${showContext ? 'lg:col-span-3' : 'lg:col-span-4'}`}>
            <div className="flex flex-col h-[600px] bg-white rounded-[24px] shadow-ambient overflow-hidden">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-center">
                    <div>
                      <Book size={48} className="mx-auto text-ink-tertiary mb-4" />
                      <p className="text-ink-secondary mb-2">
                        Welcome to the Writer's Room
                      </p>
                      <p className="text-xs text-ink-tertiary max-w-sm">
                        Ask me to generate scripts, copy, shotlists, and more. All suggestions are grounded in your project context.
                      </p>
                    </div>
                  </div>
                ) : (
                  messages.map((msg, i) => (
                    <div
                      key={i}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md rounded-[24px] px-4 py-3 ${
                          msg.role === 'user'
                            ? 'bg-primary text-white'
                            : 'bg-subtle text-ink-primary'
                        }`}
                      >
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">
                          {msg.content}
                        </p>
                        {msg.role === 'assistant' && (
                          <div className="flex gap-2 mt-3 pt-3 border-t border-white/10">
                            <button
                              onClick={() => handleCopyMessage(msg.content)}
                              className="p-1 hover:bg-white/10 rounded transition-colors"
                              title="Copy"
                            >
                              <Copy size={14} />
                            </button>
                            <button
                              onClick={() => handleDownloadMessage(msg.content)}
                              className="p-1 hover:bg-white/10 rounded transition-colors"
                              title="Download"
                            >
                              <Download size={14} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
                {isGenerating && (
                  <div className="flex justify-start">
                    <div className="bg-subtle rounded-[24px] px-4 py-3">
                      <Loader2 size={16} className="animate-spin text-primary" />
                    </div>
                  </div>
                )}
              </div>

              {/* Input */}
              <div className="border-t border-subtle p-4">
                <div className="flex gap-3">
                  <Textarea
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Ask me to create a 30-second script, copywriting, etc..."
                    rows={1}
                    variant="secondary"
                    className="resize-none"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || isGenerating}
                    className="self-end"
                  >
                    <Send size={16} />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WritersRoom;

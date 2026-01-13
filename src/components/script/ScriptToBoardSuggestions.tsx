/**
 * SCRIPT-TO-BOARD: AI-POWERED ASSET SUGGESTIONS
 * 
 * This component provides real-time, context-aware asset suggestions as writers
 * type their scripts. It's the core of the "Creative Brain" feature.
 * 
 * Architect: Jules
 * Mission: Bridge the gap between script writing and visual storytelling.
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image, Sparkles, Brain, Lightbulb, Palette, MapPin, Clock, User, Zap } from 'lucide-react';
import { useCreativeBrain, type AssetSuggestion, type ScriptContext } from '../../context/CreativeBrainContext';
import { useDebounce } from '../../hooks/use-throttled-callback';

// ============================================================================
// COMPONENTS
// ============================================================================

interface SuggestionItemProps {
  suggestion: AssetSuggestion;
  onSelect: (suggestion: AssetSuggestion) => void;
  onDragStart: (suggestion: AssetSuggestion) => void;
}

function SuggestionItem({ suggestion, onSelect, onDragStart }: SuggestionItemProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true);
    onDragStart(suggestion);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const getMatchTypeIcon = () => {
    switch (suggestion.matchType) {
      case 'color':
        return <Palette className="w-4 h-4" />;
      case 'mood':
        return <Sparkles className="w-4 h-4" />;
      case 'location':
        return <MapPin className="w-4 h-4" />;
      case 'character':
        return <User className="w-4 h-4" />;
      case 'action':
        return <Zap className="w-4 h-4" />;
      default:
        return <Lightbulb className="w-4 h-4" />;
    }
  };

  const getMatchTypeColor = () => {
    switch (suggestion.matchType) {
      case 'color':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'mood':
        return 'bg-pink-500/20 text-pink-300 border-pink-500/30';
      case 'location':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'character':
        return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
      case 'action':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      default:
        return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30';
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={() => onSelect(suggestion)}
      className={`
        relative group cursor-pointer
        rounded-2xl overflow-hidden
        glass-effect
        border ${isDragging ? 'border-primary' : 'border-border-subtle'}
        transition-all duration-200
        hover:shadow-lg hover:shadow-primary/20
      `}
      style={{
        background: 'rgba(15, 23, 42, 0.6)',
        backdropFilter: 'blur(20px)',
      }}
    >
      {/* Thumbnail Placeholder */}
      <div className="aspect-video bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
        {suggestion.thumbnail ? (
          <img src={suggestion.thumbnail} alt="" className="w-full h-full object-cover" />
        ) : (
          <Image className="w-12 h-12 text-slate-600" />
        )}
      </div>

      {/* Content Overlay */}
      <div className="p-3 space-y-2">
        {/* Match Type Badge */}
        <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium border ${getMatchTypeColor()}`}>
          {getMatchTypeIcon()}
          <span className="capitalize">{suggestion.matchType}</span>
        </div>

        {/* Relevance Score */}
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1.5 bg-slate-700/50 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-purple-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${suggestion.relevanceScore * 100}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
          <span className="text-xs font-semibold text-primary">{Math.round(suggestion.relevanceScore * 100)}%</span>
        </div>

        {/* AI Reasoning */}
        {suggestion.reasoning && (
          <p className="text-xs text-slate-400 line-clamp-2">
            {suggestion.reasoning}
          </p>
        )}
      </div>

      {/* Hover Glow */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    </motion.div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

interface ScriptToBoardSuggestionsProps {
  scriptContent: string;
  scriptId: string;
  onAssetSelect?: (assetId: string, type: 'image' | 'video') => void;
  position?: 'sidebar' | 'floating' | 'inline';
  maxSuggestions?: number;
}

export function ScriptToBoardSuggestions({
  scriptContent,
  scriptId,
  onAssetSelect,
  position = 'floating',
  maxSuggestions = 6,
}: ScriptToBoardSuggestionsProps) {
  const {
    projectDNA,
    isProcessing,
    getAssetSuggestions,
    updateScriptContext,
    trackUserAction,
  } = useCreativeBrain();

  const [suggestions, setSuggestions] = useState<AssetSuggestion[]>([]);
  const [scriptContext, setScriptContext] = useState<ScriptContext>({});
  const [isExpanded, setIsExpanded] = useState(true);
  const [selectedSuggestion, setSelectedSuggestion] = useState<AssetSuggestion | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Debounce script content analysis
  const debouncedContent = useDebounce(scriptContent, 1500);

  // Analyze script and get suggestions
  useEffect(() => {
    if (!debouncedContent.trim()) {
      setSuggestions([]);
      setScriptContext({});
      return;
    }

    let isMounted = true;

    const analyzeScript = async () => {
      try {
        // Parse script context using AI
        const context = await updateScriptContext(scriptId, debouncedContent);
        
        if (!isMounted) return;
        
        setScriptContext(context);

        // Extract query from context for asset search
        const queryParts = [];
        if (context.location) queryParts.push(context.location);
        if (context.time) queryParts.push(context.time);
        if (context.action) queryParts.push(context.action);
        if (context.mood) queryParts.push(context.mood);
        
        const query = queryParts.join(' ') || debouncedContent.slice(0, 100);

        // Get AI-powered suggestions
        const assetSuggestions = await getAssetSuggestions(query, context);
        
        if (!isMounted) return;

        setSuggestions(assetSuggestions.slice(0, maxSuggestions));
      } catch (error) {
        console.error('Failed to analyze script:', error);
      }
    };

    analyzeScript();

    return () => {
      isMounted = false;
    };
  }, [debouncedContent, scriptId, maxSuggestions, updateScriptContext, getAssetSuggestions]);

  // Handle suggestion selection
  const handleSuggestionSelect = useCallback((suggestion: AssetSuggestion) => {
    setSelectedSuggestion(suggestion);
    
    trackUserAction({
      type: 'select',
      feature: 'script',
      entityId: scriptId,
      metadata: { suggestionId: suggestion.assetId, reasoning: suggestion.reasoning },
    });

    onAssetSelect?.(suggestion.assetId, 'image');
  }, [scriptId, onAssetSelect, trackUserAction]);

  // Handle drag start
  const handleDragStart = useCallback((suggestion: AssetSuggestion) => {
    // Set drag data for dropping into script
    const dragData = {
      type: 'asset',
      assetId: suggestion.assetId,
      url: suggestion.url,
      reasoning: suggestion.reasoning,
    };
    
    if (containerRef.current) {
      containerRef.current.setAttribute('data-drag-data', JSON.stringify(dragData));
    }
  }, []);

  // Get project DNA preview
  const getDNAIndicator = () => {
    if (!projectDNA) return null;

    return (
      <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-800/50 border border-border-subtle">
        <div className="flex gap-1.5">
          <div
            className="w-4 h-4 rounded-full ring-2 ring-white/20"
            style={{ backgroundColor: projectDNA.colorPalette.primary }}
          />
          <div
            className="w-4 h-4 rounded-full ring-2 ring-white/20"
            style={{ backgroundColor: projectDNA.colorPalette.secondary }}
          />
          <div
            className="w-4 h-4 rounded-full ring-2 ring-white/20"
            style={{ backgroundColor: projectDNA.colorPalette.accent }}
          />
        </div>
        <div className="flex-1">
          <p className="text-xs font-medium text-ink-primary">
            {projectDNA.visualStyle}
          </p>
          <p className="text-[10px] text-slate-400">
            {projectDNA.moodTags.slice(0, 3).join(' • ')}
          </p>
        </div>
      </div>
    );
  };

  // Get context summary
  const getContextSummary = () => {
    const parts = [];
    if (scriptContext.location) parts.push(scriptContext.location);
    if (scriptContext.time) parts.push(scriptContext.time);
    if (scriptContext.character) parts.push(scriptContext.character);
    return parts.join(' • ') || 'No context detected';
  };

  // Floating panel variant
  if (position === 'floating' && suggestions.length > 0) {
    return (
      <motion.div
        ref={containerRef}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="fixed right-8 top-1/2 -translate-y-1/2 w-80 z-50"
      >
        <motion.div
          className="overflow-hidden rounded-3xl glass-effect border border-border-subtle shadow-2xl"
          style={{
            background: 'rgba(15, 23, 42, 0.8)',
            backdropFilter: 'blur(24px)',
          }}
          layout
        >
          {/* Header */}
          <div className="p-4 border-b border-border-subtle">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-primary animate-pulse" />
                <h3 className="font-semibold text-ink-primary">AI Suggestions</h3>
              </div>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1.5 rounded-lg hover:bg-slate-700/50 transition-colors"
              >
                {isExpanded ? '−' : '+'}
              </button>
            </div>

            <AnimatePresence mode="wait">
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                >
                  {projectDNA && getDNAIndicator()}
                  <div className="mt-3 p-2 rounded-lg bg-slate-800/30">
                    <p className="text-[11px] text-slate-400 mb-1">Detected Context:</p>
                    <p className="text-xs text-ink-primary font-medium">
                      {getContextSummary()}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Suggestions Grid */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-4 max-h-[60vh] overflow-y-auto space-y-3 custom-scrollbar"
              >
                {isProcessing && suggestions.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    >
                      <Sparkles className="w-8 h-8 text-primary" />
                    </motion.div>
                    <p className="text-sm text-slate-400 mt-3">Analyzing script...</p>
                  </div>
                ) : suggestions.length === 0 ? (
                  <div className="text-center py-8">
                    <Lightbulb className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                    <p className="text-sm text-slate-400">
                      Write more context to get suggestions
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-3">
                    <AnimatePresence mode="popLayout">
                      {suggestions.map((suggestion, index) => (
                        <motion.div
                          key={suggestion.assetId}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <SuggestionItem
                            suggestion={suggestion}
                            onSelect={handleSuggestionSelect}
                            onDragStart={handleDragStart}
                          />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Footer */}
          <div className="p-3 border-t border-border-subtle">
            <p className="text-[10px] text-slate-500 text-center">
              Drag images to script or click to insert
            </p>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  // Sidebar variant
  if (position === 'sidebar') {
    return (
      <div ref={containerRef} className="w-full h-full flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-border-subtle">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-ink-primary">Visual Suggestions</h3>
          </div>
          {projectDNA && getDNAIndicator()}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="mb-4 p-3 rounded-xl bg-slate-800/30 border border-border-subtle">
            <p className="text-[11px] text-slate-400 mb-1">Context:</p>
            <p className="text-sm text-ink-primary">{getContextSummary()}</p>
          </div>

          {isProcessing && suggestions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              >
                <Sparkles className="w-10 h-10 text-primary" />
              </motion.div>
              <p className="text-sm text-slate-400 mt-4">Analyzing script...</p>
            </div>
          ) : suggestions.length === 0 ? (
            <div className="text-center py-12">
              <Lightbulb className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <p className="text-sm text-slate-400">
                Add scene details to get visual suggestions
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <AnimatePresence mode="popLayout">
                {suggestions.map((suggestion, index) => (
                  <motion.div
                    key={suggestion.assetId}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <SuggestionItem
                      suggestion={suggestion}
                      onSelect={handleSuggestionSelect}
                      onDragStart={handleDragStart}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Inline variant
  return (
    <div ref={containerRef} className="relative">
      <AnimatePresence>
        {suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="mt-4 p-4 rounded-2xl glass-effect border border-border-subtle"
            style={{
              background: 'rgba(15, 23, 42, 0.6)',
              backdropFilter: 'blur(20px)',
            }}
          >
            <div className="flex items-center gap-2 mb-3">
              <Brain className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-ink-primary">
                AI Visual Suggestions
              </span>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {suggestions.map((suggestion) => (
                <SuggestionItem
                  key={suggestion.assetId}
                  suggestion={suggestion}
                  onSelect={handleSuggestionSelect}
                  onDragStart={handleDragStart}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================================================
// EXPORTS
// ============================================================================

export default ScriptToBoardSuggestions;
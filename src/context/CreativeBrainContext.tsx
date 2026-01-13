/**
 * CREATIVE BRAIN CONTEXT SERVICE
 * 
 * This is the unified context layer that enables "sentient" creative intelligence.
 * It tracks project DNA, user intent, and provides AI-powered suggestions across features.
 * 
 * Architect: Jules
 * Mission: Transform Studio Roster into a Creative Brain that remembers and understands.
 */

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useToast } from './ToastContext';
import { GenAIService } from '../services/GenAIService';
import type { Content } from 'firebase/ai';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * ProjectDNA represents the creative "fingerprint" of a project.
 * Extracted from moodboard images, scripts, and user interactions.
 */
export interface ProjectDNA {
  id: string;
  projectId: string;
  updatedAt: string;
  
  // Visual DNA
  colorPalette: {
    primary: string;
    secondary: string;
    accent: string;
    neutrals: string[];
    harmony: 'monochromatic' | 'complementary' | 'triadic' | 'analogous';
  };
  moodTags: string[];
  visualStyle: string;
  
  // Narrative DNA
  themes: string[];
  tone: string[];
  genre?: string;
  
  // Vector embedding for semantic search
  embedding?: number[];
}

/**
 * ScriptContext represents the parsed understanding of a script line
 */
export interface ScriptContext {
  sceneHeader?: string;
  location?: string;
  time?: string;
  character?: string;
  action?: string;
  dialogue?: string;
  mood?: string;
  visualCues?: string[];
}

/**
 * AssetSuggestion with AI reasoning
 */
export interface AssetSuggestion {
  assetId: string;
  url: string;
  thumbnail: string;
  relevanceScore: number;
  reasoning: string;
  matchType: 'color' | 'mood' | 'location' | 'character' | 'action' | 'semantic';
}

/**
 * UserAction tracking for AI learning
 */
export interface UserAction {
  type: 'view' | 'select' | 'delete' | 'upload' | 'search' | 'write';
  feature: 'project' | 'moodboard' | 'script' | 'catalog' | 'talent';
  entityId?: string;
  metadata?: Record<string, unknown>;
  timestamp: string;
}

/**
 * ContextEvent for real-time collaboration
 */
export interface ContextEvent {
  type: 'project_dna_updated' | 'script_changed' | 'asset_added' | 'user_action';
  projectId: string;
  userId: string;
  data: unknown;
  timestamp: string;
}

// ============================================================================
// SERVICE INTERFACE
// ============================================================================

interface CreativeBrainContextType {
  // State
  activeProjectId: string | null;
  projectDNA: ProjectDNA | null;
  userIntent: string;
  isProcessing: boolean;
  
  // Actions
  setActiveProject: (projectId: string) => Promise<void>;
  extractProjectDNA: (projectId: string) => Promise<ProjectDNA>;
  getAssetSuggestions: (query: string, scriptContext?: ScriptContext) => Promise<AssetSuggestion[]>;
  trackUserAction: (action: Omit<UserAction, 'timestamp'>) => void;
  updateScriptContext: (scriptId: string, line: string) => Promise<ScriptContext>;
  refreshProjectDNA: () => Promise<void>;
}

// ============================================================================
// DEFAULT STATE
// ============================================================================

const defaultState: CreativeBrainContextType = {
  activeProjectId: null,
  projectDNA: null,
  userIntent: 'browsing',
  isProcessing: false,
  setActiveProject: async () => {},
  extractProjectDNA: async () => ({ id: '', projectId: '', updatedAt: '', colorPalette: { primary: '#000000', secondary: '#000000', accent: '#000000', neutrals: [], harmony: 'monochromatic' }, moodTags: [], visualStyle: '', themes: [], tone: [] }),
  getAssetSuggestions: async () => [],
  trackUserAction: () => {},
  updateScriptContext: async () => ({}),
  refreshProjectDNA: async () => {},
};

// ============================================================================
// CONTEXT PROVIDER
// ============================================================================

const CreativeBrainContext = createContext<CreativeBrainContextType>(defaultState);

export function CreativeBrainProvider({ children }: { children: ReactNode }) {
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [projectDNA, setProjectDNA] = useState<ProjectDNA | null>(null);
  const [userIntent, setUserIntent] = useState<string>('browsing');
  const [isProcessing, setIsProcessing] = useState(false);
  const [actionHistory, setActionHistory] = useState<UserAction[]>([]);

  const toast = useToast();
  const genAIService = GenAIService.getInstance();

  /**
   * Extract Project DNA using AI
   * Analyzes moodboard images, scripts, and project metadata
   */
  const extractProjectDNA = useCallback(async (projectId: string): Promise<ProjectDNA> => {
    setIsProcessing(true);

    try {
      // In production, this would:
      // 1. Fetch project moodboard images
      // 2. Use Vision AI to analyze colors, mood, style
      // 3. Analyze script themes and tone
      // 4. Generate vector embeddings

      const systemInstruction = `You are an expert visual designer and creative director.
Analyze project assets and extract creative DNA in JSON format.`;

      const prompt = `Extract creative DNA from this project:
- Identify dominant color palette (primary, secondary, accent, neutrals)
- Determine color harmony type
- Generate mood tags (adjectives like "energetic", "nostalgic", "futuristic")
- Identify visual style
- Extract narrative themes
- Identify tone/mood elements

Return JSON structure:
{
  "colorPalette": {
    "primary": "#hex",
    "secondary": "#hex", 
    "accent": "#hex",
    "neutrals": ["#hex1", "#hex2"],
    "harmony": "monochromatic|complementary|triadic|analogous"
  },
  "moodTags": ["tag1", "tag2", "tag3"],
  "visualStyle": "style description",
  "themes": ["theme1", "theme2"],
  "tone": ["tone1", "tone2"]
}`;

      const response = await genAIService.generateContent(prompt, {
        systemInstruction,
      });

      // Parse AI response (in production, use proper JSON parsing with Zod)
      let aiData;
      try {
        // Extract JSON from response
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          aiData = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('No valid JSON in AI response');
        }
      } catch (error) {
        console.error('Failed to parse AI DNA response:', error);
        // Fallback DNA
        aiData = {
          colorPalette: {
            primary: '#6366F1',
            secondary: '#8B5CF6',
            accent: '#EC4899',
            neutrals: ['#1E1B4B', '#E0E7FF'],
            harmony: 'analogous',
          },
          moodTags: ['modern', 'creative', 'professional'],
          visualStyle: 'Contemporary clean design',
          themes: ['innovation', 'creativity'],
          tone: ['upbeat', 'inspiring'],
        };
      }

      const dna: ProjectDNA = {
        id: `dna_${projectId}_${Date.now()}`,
        projectId,
        updatedAt: new Date().toISOString(),
        colorPalette: aiData.colorPalette,
        moodTags: aiData.moodTags,
        visualStyle: aiData.visualStyle,
        themes: aiData.themes,
        tone: aiData.tone,
      };

      setProjectDNA(dna);
      
      // Broadcast change
      // In production: websocketGateway.broadcast({
      //   type: 'project_dna_updated',
      //   projectId,
      //   data: dna
      // });

      return dna;
    } catch (error) {
      console.error('Failed to extract project DNA:', error);
      toast?.showError('Failed to analyze project DNA');
      
      // Return fallback DNA
      return {
        id: `dna_${projectId}_${Date.now()}`,
        projectId,
        updatedAt: new Date().toISOString(),
        colorPalette: {
          primary: '#6366F1',
          secondary: '#8B5CF6',
          accent: '#EC4899',
          neutrals: ['#1E1B4B', '#E0E7FF'],
          harmony: 'analogous',
        },
        moodTags: ['modern', 'creative'],
        visualStyle: 'Modern professional',
        themes: [],
        tone: [],
      };
    } finally {
      setIsProcessing(false);
    }
  }, [genAIService, toast]);

  /**
   * Set active project and load its DNA
   */
  const setActiveProject = useCallback(async (projectId: string) => {
    setActiveProjectId(projectId);
    
    // Load existing DNA from storage or extract new
    // In production, check Firestore for cached DNA
    const dna = await extractProjectDNA(projectId);
    setProjectDNA(dna);

    // Track action
    trackUserAction({
      type: 'view',
      feature: 'project',
      entityId: projectId,
    });
  }, [extractProjectDNA]);

  /**
   * Get AI-powered asset suggestions for script context
   * This is the CORE of "Script-to-Board" functionality
   */
  const getAssetSuggestions = useCallback(async (
    query: string,
    scriptContext?: ScriptContext
  ): Promise<AssetSuggestion[]> => {
    if (!activeProjectId || !projectDNA) {
      return [];
    }

    setIsProcessing(true);

    try {
      // Build rich context for AI
      const contextParts = [
        `Project Context: ${projectDNA.visualStyle}`,
        `Color Palette: ${projectDNA.colorPalette.primary}, ${projectDNA.colorPalette.secondary}, ${projectDNA.colorPalette.accent}`,
        `Mood Tags: ${projectDNA.moodTags.join(', ')}`,
        `Themes: ${projectDNA.themes.join(', ')}`,
      ];

      if (scriptContext) {
        if (scriptContext.location) {
          contextParts.push(`Scene Location: ${scriptContext.location}`);
        }
        if (scriptContext.time) {
          contextParts.push(`Time of Day: ${scriptContext.time}`);
        }
        if (scriptContext.mood) {
          contextParts.push(`Scene Mood: ${scriptContext.mood}`);
        }
        if (scriptContext.action) {
          contextParts.push(`Action: ${scriptContext.action}`);
        }
      }

      const systemInstruction = `You are an expert visual researcher and storyboard artist.
Given a script context and project DNA, suggest visual assets that would match the scene.
Prioritize assets that match the project's color palette, mood, and visual style.`;

      const prompt = `Find visual assets for: "${query}"

${contextParts.join('\n')}

Return JSON array of suggestions:
{
  "suggestions": [
    {
      "query": "search terms for this asset type",
      "relevanceScore": 0.95,
      "reasoning": "Why this matches the context",
      "matchType": "color|mood|location|character|action|semantic"
    }
  ]
}`;

      const response = await genAIService.generateContent(prompt, {
        systemInstruction,
      });

      // Parse AI response
      let aiData;
      try {
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          aiData = JSON.parse(jsonMatch[0]);
        } else {
          aiData = { suggestions: [] };
        }
      } catch (error) {
        console.error('Failed to parse AI suggestions:', error);
        aiData = { suggestions: [] };
      }

      // In production, this would query actual asset catalog
      // For now, return mock suggestions with the AI reasoning
      const suggestions: AssetSuggestion[] = aiData.suggestions.map((s: any, index: number) => ({
        assetId: `suggested_${index}`,
        url: '', // Would be populated from catalog query
        thumbnail: '',
        relevanceScore: s.relevanceScore || 0.7,
        reasoning: s.reasoning || '',
        matchType: s.matchType || 'semantic',
      }));

      return suggestions;
    } catch (error) {
      console.error('Failed to get asset suggestions:', error);
      return [];
    } finally {
      setIsProcessing(false);
    }
  }, [activeProjectId, projectDNA, genAIService]);

  /**
   * Parse script line and extract context using AI
   */
  const updateScriptContext = useCallback(async (
    scriptId: string,
    line: string
  ): Promise<ScriptContext> => {
    if (!line.trim()) {
      return {};
    }

    setIsProcessing(true);

    try {
      const systemInstruction = `You are a professional script analyst.
Extract structured information from script lines for storyboard creation.
Be precise and thorough.`;

      const prompt = `Analyze this script line and extract context:
"${line}"

Return JSON:
{
  "sceneHeader": "INT/EXT. LOCATION - TIME",
  "location": "location name",
  "time": "DAY/NIGHT/DUSK/DAWN",
  "character": "character name if present",
  "action": "action description",
  "dialogue": "spoken text if any",
  "mood": "emotional tone",
  "visualCues": ["visual element 1", "visual element 2"]
}`;

      const response = await genAIService.generateContent(prompt, {
        systemInstruction,
      });

      let context;
      try {
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          context = JSON.parse(jsonMatch[0]);
        } else {
          context = {};
        }
      } catch (error) {
        console.error('Failed to parse script context:', error);
        context = {};
      }

      // Track action
      trackUserAction({
        type: 'write',
        feature: 'script',
        entityId: scriptId,
        metadata: { line, context },
      });

      return context;
    } catch (error) {
      console.error('Failed to parse script context:', error);
      return {};
    } finally {
      setIsProcessing(false);
    }
  }, [genAIService]);

  /**
   * Track user actions for AI learning and analytics
   */
  const trackUserAction = useCallback((action: Omit<UserAction, 'timestamp'>) => {
    const userAction: UserAction = {
      ...action,
      timestamp: new Date().toISOString(),
    };

    setActionHistory(prev => [...prev, userAction].slice(-100)); // Keep last 100 actions

    // In production, send to backend for analytics
    // await analyticsService.track(userAction);
  }, []);

  /**
   * Refresh project DNA from server
   */
  const refreshProjectDNA = useCallback(async () => {
    if (activeProjectId) {
      await extractProjectDNA(activeProjectId);
    }
  }, [activeProjectId, extractProjectDNA]);

  /**
   * Effect: Auto-detect project from URL
   */
  useEffect(() => {
    // Parse project ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const projectParam = urlParams.get('project');

    if (projectParam && projectParam !== activeProjectId) {
      setActiveProject(projectParam);
    }

    // Detect user intent from path
    const path = window.location.pathname;
    if (path.includes('writers-room') || path.includes('script')) {
      setUserIntent('writing');
    } else if (path.includes('moodboard')) {
      setUserIntent('moodboarding');
    } else if (path.includes('catalog')) {
      setUserIntent('browsing_assets');
    } else if (path.includes('freelancers')) {
      setUserIntent('talent_search');
    } else {
      setUserIntent('browsing');
    }
  }, [activeProjectId, setActiveProject]);

  const value: CreativeBrainContextType = {
    activeProjectId,
    projectDNA,
    userIntent,
    isProcessing,
    setActiveProject,
    extractProjectDNA,
    getAssetSuggestions,
    trackUserAction,
    updateScriptContext,
    refreshProjectDNA,
  };

  return (
    <CreativeBrainContext.Provider value={value}>
      {children}
    </CreativeBrainContext.Provider>
  );
}

// ============================================================================
// HOOK
// ============================================================================

export function useCreativeBrain() {
  const context = useContext(CreativeBrainContext);
  
  if (context === defaultState) {
    console.warn('useCreativeBrain must be used within CreativeBrainProvider');
  }
  
  return context;
}

// ============================================================================
// EXPORTS
// ============================================================================

export type {
  ProjectDNA,
  ScriptContext,
  AssetSuggestion,
  UserAction,
  ContextEvent,
};
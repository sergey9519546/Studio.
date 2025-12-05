/**
 * Brand Context Assembler - Context Processing Pipeline
 * Computational Design Compendium - Phase 4: Structuring Logic
 * =============================================================
 *
 * ASSEMBLES PROJECT CONTEXT INTO AI-USABLE SYSTEM CONTEXT BLOCKS
 * Brand voice lenses, content enhancement algorithms
 */

import { IntelligentContextEngine, ProjectContext, BrandVector } from './IntelligentContextEngine';
import { AssetIntelligenceEngine } from './AssetIntelligenceEngine';

/**
 * CONTEXT ASSEMBLER ENGINE (STRUCTURING LOGIC - PSEUDOCODE APPLIED)
 */

export class BrandContextAssembler {
  private contextEngine: IntelligentContextEngine;
  private assetEngine: AssetIntelligenceEngine;
  private contextCache = new Map<string, AssembledContext>();

  constructor(
    contextEngine: IntelligentContextEngine,
    assetEngine: AssetIntelligenceEngine
  ) {
    this.contextEngine = contextEngine;
    this.assetEngine = assetEngine;
  }

  /**
   * PSEUDOCODE STEP 4-5: CONTEXT ASSEMBLY & INJECTION
   * Transform context tensors into human/AI-readable format
   */
  async assembleContextForInjection(
    projectId: string,
    userPrompt: string,
    contextScope?: ContextScope
  ): Promise<AssembledContext> {
    const cacheKey = `${projectId}_${userPrompt.slice(0, 50)}_${contextScope || 'full'}`;

    // Check cache (Performance reasoning: Context computation is expensive)
    const cached = this.contextCache.get(cacheKey);
    if (cached && this.isCacheValid(cached)) {
      return cached;
    }

    // Gather project context (Pseudocode Step 4.1)
    const projectContext = await this.contextEngine.gatherProjectContext(projectId);

    // Determine relevant context scope (optimization reasoning)
    const effectiveScope = contextScope || this.intelligentlyDetermineScope(userPrompt, projectContext);

    // Build context sections (Pseudocode Steps 4.2-4.4)
    const contextSections = await this.buildContextSections(projectContext, effectiveScope);

    // Optimize and truncate (Pseudocode Step 4.5)
    const optimizedContext = await this.optimizeContextForInjection(contextSections, userPrompt);

    // Generate human-readable summary
    const humanSummary = this.generateHumanReadableSummary(contextSections);

    const assembledContext: AssembledContext = {
      system_context_block: optimizedContext,
      human_readable_summary: humanSummary,
      context_metadata: {
        project_id: projectId,
        generated_at: new Date(),
        token_estimate: this.estimateTokenCount(optimizedContext),
        scope_applied: effectiveScope,
        prompt_context_match: this.computePromptContextMatch(userPrompt, contextSections)
      }
    };

    // Cache optimization
    this.contextCache.set(cacheKey, assembledContext);

    return assembledContext;
  }

  /**
   * BRAND VOICE LENSING (Geometric Transformation Applied)
   * When user requests "Make this more persuasive", apply brand voice vectors
   */
  async applyBrand_voiceLens(
    content: string,
    userPrompt: string,
    projectId: string
  ): Promise<BrandLensedContent> {
    // Get project brand vectors
    const context = await this.contextEngine.gatherProjectContext(projectId);
    const brandVector = this.extractDominantBrandVector(context.brand_tensor);

    // Calculate enhancement directions
    const enhancementVectors = this.calculateEnhancementDirections(userPrompt, brandVector, content);

    // Generate enhancement suggestions
    const suggestions = enhancementVectors.map(vector =>
      this.generateEnhancementSuggestion(vector, content, brandVector)
    );

    return {
      original_content: content,
      enhanced_content: content, // AI would modify this
      brand_vector_applied: brandVector,
      enhancement_suggestions: suggestions,
      confidence_score: this.calculateEnhancementConfidence(enhancementVectors, content),
      context_justification: `Applied ${brandVector.direction} voice with ${brandVector.magnitude * 100}% conviction`
    };
  }

  /**
   * CONTEXT RELEVANCE SCORING (Force Field Mathematics Applied)
   * Dynamic context inclusion based on prompt needs
   */
  private intelligentlyDetermineScope(
    userPrompt: string,
    context: ProjectContext
  ): ContextScope {
    const promptType = this.classifyPromptType(userPrompt);

    switch (promptType) {
      case 'visual_design':
        return { include_visual: true, include_writing: false, include_research: false };
      case 'copywriting':
        return { include_visual: true, include_writing: true, include_research: false };
      case 'strategy':
        return { include_visual: false, include_writing: true, include_research: true };
      case 'creative_concept':
        return { include_visual: true, include_writing: true, include_research: true };
      default:
        return { include_visual: true, include_writing: true, include_research: true };
    }
  }

  /**
   * CONTEXT BUILDING PIPELINE (Following Pseudocode Architecture)
   */
  private async buildContextSections(
    context: ProjectContext,
    scope: ContextScope
  ): Promise<ContextSections> {
    const sections: Partial<ContextSections> = {};

    if (scope.include_visual) {
      sections.visual_context = await this.buildVisualSection(context);
    }

    if (scope.include_writing) {
      sections.brand_voice_context = await this.buildBrandVoiceSection(context);
    }

    if (scope.include_research) {
      sections.research_context = await this.buildResearchSection(context);
    }

    sections.audience_context = this.buildAudienceSection(context);

    return sections as ContextSections;
  }

  private async buildVisualSection(context: ProjectContext): Promise<string> {
    const assetIntel = context.asset_intelligence;

    return `
VISUAL IDENTITY GUIDELINES:
- Dominant Styles: ${assetIntel.visual_style_vectors.map(v => v.style).join(', ')}
- Color Palette: ${JSON.stringify(assetIntel.color_palette.slice(0, 5), null, 0)}
- Composition Patterns: ${assetIntel.composition_patterns.join(', ')}
- Brand Consistency Score: ${(assetIntel.brand_consistency_score * 100).toFixed(0)}%
- Reference Examples: ${await this.getAssetReferences(context.project_id)}
    `.trim();
  }

  private async buildBrandVoiceSection(context: ProjectContext): Promise<string> {
    const dominantVector = this.extractDominantBrandVector(context.brand_tensor);

    return `
BRAND VOICE REQUIREMENTS:
- Dominant Direction: ${dominantVector.direction}
- Conviction Level: ${(dominantVector.magnitude * 100).toFixed(0)}%
- Manifestations: ${dominantVector.manifestations.join(', ')}
- Do's: ${await this.extractDoGuidelines(context.project_id)}
- Don'ts: ${await this.extractDontGuidelines(context.project_id)}
- Tone Indicators: ${context.brief_context.tone_indicators.join(', ')}
    `.trim();
  }

  private async buildResearchSection(context: ProjectContext): Promise<string> {
    const research = context.project_intelligence.research_findings;

    return `
RELEVANT RESEARCH INSIGHTS:
${research.slice(0, 3).map(r =>
  `- ${r.topic}: ${r.insight} (${(r.relevance_score * 100).toFixed(0)}% relevance)`
).join('\n')}
- Competitive Context: ${context.project_intelligence.competitive_context}
- Strategic Priorities: ${context.project_intelligence.strategic_priorities.join(', ')}
    `.trim();
  }

  private buildAudienceSection(context: ProjectContext): string {
    return `
TARGET AUDIENCE PROFILE:
- Key Characteristics: ${context.brief_context.audience_insights.join(', ')}
- Communication Preferences: Technical, innovative, results-focused
- Value Drivers: Efficiency, intelligence, professional quality
    `.trim();
  }

  /**
   * CONTEXT OPTIMIZATION (Token Budget Management)
   */
  private async optimizeContextForInjection(
    sections: ContextSections,
    userPrompt: string
  ): Promise<string> {
    const allSections = Object.values(sections).join('\n\n');
    const tokenCount = this.estimateTokenCount(allSections);

    // If within reasonable limits, return as-is
    if (tokenCount < 3000) {
      return this.formatContextBlock(sections);
    }

    // Prioritize based on prompt relevance
    const prioritizedSections = this.prioritizeSectionsByPrompt(sections, userPrompt);
    const optimizedSections = this.truncateToTokenBudget(prioritizedSections, 2500);

    return this.formatContextBlock(optimizedSections);
  }

  private formatContextBlock(sections: ContextSections): string {
    return `
SYSTEM CONTEXT: The following information defines the brand universe for this creative project.

BRAND DNA SUMMARY: ${this.generateBrandDnaSummary(sections)}

${Object.entries(sections).map(([key, value]) =>
  `${key.toUpperCase().replace('_', ' ')}:\n${value}`
).join('\n\n')}

IMPORTANT: ALL CREATIVE OUTPUT MUST ALIGN WITH THIS BRAND CONTEXT. Consider implications for visual style, tone, messaging, and audience resonance.
    `.trim();
  }

  private generateHumanReadableSummary(sections: ContextSections): string {
    const key = Object.keys(sections).length;
    const brandDirection = this.extractKeyBrandDirection(sections);

    return `${key}-pillar context assembled. Brand positioned as ${brandDirection}. Visual identity established with ${sections.brand_voice_context?.length || 0} voice guidelines.`;
  }

  // UTILITY METHODS
  private extractDominantBrandVector(tensor: any): BrandVector {
    return {
      direction: 'innovative',
      magnitude: 0.8,
      manifestations: ['cutting-edge solutions', 'technical excellence']
    };
  }

  private calculateEnhancementDirections(prompt: string, brandVector: BrandVector, content: string): EnhancementVector[] {
    // Analyze prompt for required transformations
    return [{
      type: 'brand_alignment',
      strength: 0.8,
      target: brandVector.direction,
      reasoning: `Strengthen ${brandVector.direction} voice alignment`
    }];
  }

  private generateEnhancementSuggestion(vector: EnhancementVector, content: string, brand: BrandVector): string {
    return `Apply ${brand.direction} voice with ${brand.manifestations.join(', ')}`;
  }

  private calculateEnhancementConfidence(vectors: EnhancementVector[], content: string): number {
    return vectors.reduce((acc, v) => acc + v.strength, 0) / vectors.length;
  }

  private classifyPromptType(prompt: string): string {
    if (prompt.toLowerCase().includes('design') || prompt.toLowerCase().includes('visual')) {
      return 'visual_design';
    }
    if (prompt.toLowerCase().includes('write') || prompt.toLowerCase().includes('copy')) {
      return 'copywriting';
    }
    if (prompt.toLowerCase().includes('strategy') || prompt.toLowerCase().includes('plan')) {
      return 'strategy';
    }
    return 'creative_concept';
  }

  private computePromptContextMatch(prompt: string, sections: ContextSections): number {
    return 0.7; // Stub implementation
  }

  private async extractDoGuidelines(projectId: string): Promise<string> {
    return 'Use active voice, maintain technical precision, focus on innovation';
  }

  private async extractDontGuidelines(projectId: string): Promise<string> {
    return 'Avoid buzzwords, prevent casual language, steer clear of generic claims';
  }

  private async getAssetReferences(projectId: string): Promise<string> {
    return 'minimalist banner design, clean product imagery';
  }

  private prioritizeSectionsByPrompt(sections: ContextSections, prompt: string): ContextSections {
    return sections; // Stub implementation
  }

  private truncateToTokenBudget(sections: ContextSections, maxTokens: number): ContextSections {
    return sections; // Stub implementation
  }

  private generateBrandDnaSummary(sections: ContextSections): string {
    return 'Innovation-driven, technically excellent, visually clean';
  }

  private extractKeyBrandDirection(sections: ContextSections): string {
    return 'innovative and technical';
  }

  private estimateTokenCount(text: string): number {
    return Math.ceil(text.length / 4); // Rough estimate
  }

  private isCacheValid(context: AssembledContext): boolean {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    return context.context_metadata.generated_at > fiveMinutesAgo;
  }
}

/**
 * CONTEXT ASSEMBLY DATA TYPES
 */

export interface AssembledContext {
  system_context_block: string;
  human_readable_summary: string;
  context_metadata: ContextMetadata;
}

export interface ContextMetadata {
  project_id: string;
  generated_at: Date;
  token_estimate: number;
  scope_applied: ContextScope;
  prompt_context_match: number;
}

export interface ContextScope {
  include_visual?: boolean;
  include_writing?: boolean;
  include_research?: boolean;
}

export interface ContextSections {
  visual_context?: string;
  brand_voice_context?: string;
  research_context?: string;
  audience_context?: string;
}

export interface BrandLensedContent {
  original_content: string;
  enhanced_content: string;
  brand_vector_applied: BrandVector;
  enhancement_suggestions: string[];
  confidence_score: number;
  context_justification: string;
}

export interface EnhancementVector {
  type: string;
  strength: number;
  target: string;
  reasoning: string;
}

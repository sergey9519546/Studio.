/**
 * Type definitions for Omni-Context AI Engine
 * 
 * These types define the data structures used throughout the context
 * building and learning systems.
 */

/**
 * Complete project context for AI
 * Contains all relevant information needed for context-aware AI responses
 */
export interface ProjectContext {
  projectId: string;
  brandVoice?: BrandVoiceContext;
  visualIdentity?: VisualIdentityContext;
  clientPreferences?: ClientPreferenceContext;
  successfulCampaigns?: SuccessfulCampaign[];
  relatedProjects?: RelatedProject[];
  relevantAssets?: RelevantAsset[];
  freelancerNotes?: FreelancerPerformanceNote[];
  confidence: number;
  builtAt: Date;
  expiresAt: Date;
}

/**
 * Brand voice context extracted from agency history
 */
export interface BrandVoiceContext {
  tone: string[]; // e.g., ["aspirational", "empowering", "direct"]
  vocabulary: string[]; // Brand-specific terms
  sentenceStructure: SentenceStructurePattern;
  wordChoicePreferences: WordChoicePattern[];
  taglinePatterns: TaglinePattern[];
  voiceExamples: VoiceExample[];
  confidence: number;
}

/**
 * Visual identity context for creative direction
 */
export interface VisualIdentityContext {
  colorPalettes: ColorPalette[];
  typographyStyles: TypographyStyle[];
  photographyAesthetics: PhotographyAesthetic[];
  compositionPatterns: CompositionPattern[];
  brandGuidelines: BrandGuideline[];
  confidence: number;
}

/**
 * Client preferences learned from feedback
 */
export interface ClientPreferenceContext {
  clientId?: string;
  approvalPatterns: ApprovalPattern[];
  feedbackTriggers: FeedbackTrigger[];
  revisionHotspots: RevisionHotspot[];
  communicationStyle: CommunicationStyle;
  confidence: number;
  sampleSize: number;
}

/**
 * Successful campaign for reference
 */
export interface SuccessfulCampaign {
  projectId: string;
  title: string;
  client: string;
  industry?: string;
  tags: string[];
  successMetrics: SuccessMetrics;
  creativeElements: CreativeElement[];
  completedAt: Date;
}

/**
 * Related project for context
 */
export interface RelatedProject {
  projectId: string;
  title: string;
  client: string;
  similarity: number; // 0.0 - 1.0
  relationshipType: 'same_client' | 'similar_industry' | 'similar_type' | 'shared_talent';
}

/**
 * Relevant asset from knowledge base
 */
export interface RelevantAsset {
  assetId: string;
  type: string;
  url: string;
  title?: string;
  tags: string[];
  moods: string[];
  colors: string[];
  relevanceScore: number; // 0.0 - 1.0
}

/**
 * Freelancer performance note
 */
export interface FreelancerPerformanceNote {
  freelancerId: string;
  name: string;
  skills: string[];
  averageRating: number;
  onTimeDeliveryRate: number;
  recentProjects: string[];
  notes: string[];
}

/**
 * Sentence structure pattern
 */
export interface SentenceStructurePattern {
  avgLength: number;
  lengthVariance: number;
  preferredTenses: string[];
  usesActiveVoice: boolean;
  questionFrequency: number;
  imperativeFrequency: number;
}

/**
 * Word choice pattern
 */
export interface WordChoicePattern {
  category: string; // e.g., "power_words", "emotional_words", "technical_terms"
  words: string[];
  frequency: number; // How often used in successful work
}

/**
 * Tagline pattern from successful campaigns
 */
export interface TaglinePattern {
  pattern: string; // e.g., "verb + noun" or "imperative + benefit"
  examples: string[];
  successRate: number;
}

/**
 * Voice example for AI reference
 */
export interface VoiceExample {
  original: string;
  approved: string;
  feedback: string;
  rating: number;
}

/**
 * Color palette
 */
export interface ColorPalette {
  name: string;
  primary: string[];
  secondary: string[];
  accent: string[];
  usageContext: string; // e.g., "hero_images", "backgrounds"
}

/**
 * Typography style
 */
export interface TypographyStyle {
  fontFamily: string;
  weight: string;
  usage: string[]; // e.g., ["headlines", "subheadings", "body"]
  character: string; // e.g., "bold", "playful", "minimalist"
}

/**
 * Photography aesthetic
 */
export interface PhotographyAesthetic {
  style: string; // e.g., "action", "lifestyle", "studio"
  mood: string[];
  shotTypes: string[];
  lighting: string;
  composition: string;
}

/**
 * Composition pattern
 */
export interface CompositionPattern {
  rule: string; // e.g., "rule_of_thirds", "center_focus", "golden_ratio"
  usage: string[]; // Where this applies
}

/**
 * Brand guideline
 */
export interface BrandGuideline {
  category: string;
  rule: string;
  examples: string[];
  mustHaves: string[];
  mustNotHaves: string[];
}

/**
 * Approval pattern
 */
export interface ApprovalPattern {
  category: string; // e.g., "tone", "length", "messaging"
  preference: string;
  examples: string[];
  approvalRate: number;
}

/**
 * Feedback trigger
 */
export interface FeedbackTrigger {
  trigger: string; // What causes revision
  commonComments: string[];
  frequency: number;
  severity: 'low' | 'medium' | 'high';
}

/**
 * Revision hotspot
 */
export interface RevisionHotspot {
  area: string; // e.g., "headlines", "visuals", "call_to_action"
  revisionRate: number; // % of work revised in this area
  commonIssues: string[];
}

/**
 * Communication style
 */
export interface CommunicationStyle {
  preferredChannels: string[];
  responseExpectations: string;
  feedbackStyle: 'direct' | 'diplomatic' | 'collaborative';
  approvalProcess: string[];
}

/**
 * Success metrics
 */
export interface SuccessMetrics {
  clientRating: number;
  onTimeDelivery: boolean;
  withinBudget: boolean;
  revisionRounds: number;
  reuseInFutureProjects: boolean;
}

/**
 * Creative element from successful work
 */
export interface CreativeElement {
  type: string;
  description: string;
  tags: string[];
  approvedByClient: boolean;
}

/**
 * Context request parameters
 */
export interface ContextRequest {
  projectId: string;
  agencyId?: string;
  include: {
    brandVoice?: boolean;
    visualIdentity?: boolean;
    clientPreferences?: boolean;
    successfulCampaigns?: boolean;
    freelancerNotes?: boolean;
    knowledgeSources?: boolean;
    relatedProjects?: boolean;
  };
  forceRebuild?: boolean;
}

/**
 * Cached context
 */
export interface CachedContext {
  context: ProjectContext;
  expiresAt: number;
  createdAt: number;
}

/**
 * Approval data for learning
 */
export interface ApprovalData {
  projectId: string;
  itemType: string;
  itemId: string;
  rating: number;
  clientId?: string;
  userId?: string;
  tags?: string[];
  metadata?: Record<string, any>;
  feedback?: string;
  approvedAt: Date;
}

/**
 * Vector search result
 */
export interface VectorSearchResult {
  id: string;
  score: number; // Similarity score 0.0 - 1.0
  metadata: Record<string, any>;
}

/**
 * Context build options
 */
export interface ContextBuildOptions {
  cacheEnabled: boolean;
  cacheTTL: number; // milliseconds
  maxHistoryDepth: number; // How many past projects to consider
  minConfidenceThreshold: number;
  enableLearning: boolean;
}

/**
 * Learning feedback
 */
export interface LearningFeedback {
  type: 'approval' | 'rejection' | 'revision' | 'success';
  context: ProjectContext;
  feedback: ApprovalData;
  impact: 'positive' | 'negative' | 'neutral';
}

/**
 * Context query result
 */
export interface ContextQueryResult {
  found: boolean;
  context?: ProjectContext;
  cacheHit: boolean;
  buildTime: number; // milliseconds
  confidence: number;
}
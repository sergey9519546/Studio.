-- Migration: Add Omni-Context AI Tables
-- Created: 2026-01-13
-- Description: Adds tables for brand context and client preferences to support the Omni-Context AI Engine

-- Brand Contexts Table
-- Stores persistent brand voice and visual identity models per agency
CREATE TABLE IF NOT EXISTS "brand_contexts" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "agency_id" VARCHAR(255) NOT NULL,
  "name" VARCHAR(255) NOT NULL,
  "type" VARCHAR(50) NOT NULL,
  
  -- Embeddings for semantic search (JSONB format for flexibility)
  "embeddings" JSONB,
  
  -- Full context data (structured JSON for flexibility)
  "data" JSONB NOT NULL DEFAULT '{}',
  
  -- Additional metadata
  "metadata" JSONB DEFAULT '{}',
  
  -- Quality and usage metrics
  "confidence" FLOAT DEFAULT 0.8,
  "usage_count" INTEGER DEFAULT 0,
  "last_used_at" TIMESTAMP,
  
  -- Timestamps
  "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

  -- Constraints
  CONSTRAINT "brand_contexts_type_check" 
    CHECK (type IN ('BRAND_VOICE', 'VISUAL_IDENTITY', 'MESSAGING_PATTERN', 'CREATIVE_DIRECTION', 'COMPETITIVE_POSITIONING')),
  
  CONSTRAINT "brand_contexts_confidence_check" 
    CHECK (confidence >= 0 AND confidence <= 1)
);

-- Indexes for efficient querying
CREATE INDEX IF NOT EXISTS "idx_brand_contexts_agency_type" 
  ON "brand_contexts"("agency_id", "type");

CREATE INDEX IF NOT EXISTS "idx_brand_contexts_usage" 
  ON "brand_contexts"("usage_count" DESC);

CREATE INDEX IF NOT EXISTS "idx_brand_contexts_last_used" 
  ON "brand_contexts"("last_used_at" DESC);

CREATE INDEX IF NOT EXISTS "idx_brand_contexts_confidence" 
  ON "brand_contexts"("confidence" DESC);

-- Gin index for JSONB queries
CREATE INDEX IF NOT EXISTS "idx_brand_contexts_embeddings_gin" 
  ON "brand_contexts" USING GIN ("embeddings");

CREATE INDEX IF NOT EXISTS "idx_brand_contexts_data_gin" 
  ON "brand_contexts" USING GIN ("data");

-- Trigger to auto-update updated_at
CREATE OR REPLACE FUNCTION update_brand_contexts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS brand_contexts_updated_at_trigger ON "brand_contexts";
CREATE TRIGGER brand_contexts_updated_at_trigger
  BEFORE UPDATE ON "brand_contexts"
  FOR EACH ROW
  EXECUTE FUNCTION update_brand_contexts_updated_at();


-- Client Preferences Table
-- Stores learned client preferences from approvals and feedback
CREATE TABLE IF NOT EXISTS "client_preferences" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Reference to project (optional, preferences can exist at client level)
  "project_id" UUID REFERENCES "projects"("id") ON DELETE CASCADE,
  
  -- Client identifier (could be from clients table or external ID)
  "client_id" VARCHAR(255),
  
  -- Type of preference (tone, messaging, visual, etc.)
  "preference_type" VARCHAR(100) NOT NULL,
  
  -- Structured preference data
  "preferences" JSONB NOT NULL DEFAULT '{}',
  
  -- Quality metrics
  "confidence" FLOAT DEFAULT 0.5,
  "sample_size" INTEGER DEFAULT 1,
  
  -- Timestamps
  "last_updated" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
  "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

  -- Constraints
  CONSTRAINT "client_preferences_confidence_check" 
    CHECK (confidence >= 0 AND confidence <= 1),
  
  CONSTRAINT "client_preferences_sample_size_check" 
    CHECK (sample_size >= 0)
);

-- Unique constraint to prevent duplicate preference types per project/client
CREATE UNIQUE INDEX IF NOT EXISTS "idx_client_preferences_project_type" 
  ON "client_preferences"("project_id", "preference_type") 
  WHERE "project_id" IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS "idx_client_preferences_client_type" 
  ON "client_preferences"("client_id", "preference_type") 
  WHERE "project_id" IS NULL;

-- Indexes for efficient querying
CREATE INDEX IF NOT EXISTS "idx_client_preferences_project" 
  ON "client_preferences"("project_id");

CREATE INDEX IF NOT EXISTS "idx_client_preferences_client" 
  ON "client_preferences"("client_id");

CREATE INDEX IF NOT EXISTS "idx_client_preferences_confidence" 
  ON "client_preferences"("confidence" DESC);

-- Gin index for JSONB queries
CREATE INDEX IF NOT EXISTS "idx_client_preferences_preferences_gin" 
  ON "client_preferences" USING GIN ("preferences");


-- Add helpful comments for documentation
COMMENT ON TABLE "brand_contexts" IS 'Stores persistent brand voice, visual identity, and creative direction models for agencies';
COMMENT ON COLUMN "brand_contexts"."agency_id" IS 'Agency or user ID that owns this brand context';
COMMENT ON COLUMN "brand_contexts"."type" IS 'Type of brand context: BRAND_VOICE, VISUAL_IDENTITY, MESSAGING_PATTERN, CREATIVE_DIRECTION, COMPETITIVE_POSITIONING';
COMMENT ON COLUMN "brand_contexts"."embeddings" IS 'Vector embeddings for semantic search and similarity matching';
COMMENT ON COLUMN "brand_contexts"."data" IS 'Full context data structured as JSON';
COMMENT ON COLUMN "brand_contexts"."confidence" IS 'Quality score (0.0-1.0) indicating how well-established this context is';
COMMENT ON COLUMN "brand_contexts"."usage_count" IS 'Number of times this context has been used in AI requests';

COMMENT ON TABLE "client_preferences" IS 'Stores learned client preferences from approval history and feedback';
COMMENT ON COLUMN "client_preferences"."project_id" IS 'Optional reference to specific project (preferences can exist at client level)';
COMMENT ON COLUMN "client_preferences"."client_id" IS 'Client identifier for client-level preferences that apply across projects';
COMMENT ON COLUMN "client_preferences"."preference_type" IS 'Type of preference: tone, messaging, visual, approval_pattern, revision_hotspot, etc.';
COMMENT ON COLUMN "client_preferences"."preferences" IS 'Structured preference data as JSON';
COMMENT ON COLUMN "client_preferences"."confidence" IS 'Confidence score (0.0-1.0) based on sample size and consistency';
COMMENT ON COLUMN "client_preferences"."sample_size" IS 'Number of data points used to learn this preference';


-- Insert default brand context types (optional reference data)
-- This can be used to populate initial brand contexts for agencies

-- Example brand voice context for reference (not inserted, just documentation)
-- {
--   "voice": {
--     "tone": ["professional", "inspiring", "action-oriented"],
--     "vocabulary": ["achieve", "excel", "perform", "succeed"],
--     "sentenceStructure": {
--       "avgLength": 10,
--       "usesActiveVoice": true,
--       "imperativeFrequency": 0.6
--     },
--     "wordChoicePreferences": [
--       {
--         "category": "action_verbs",
--         "words": ["unleash", "ignite", "fuel", "power"],
--         "frequency": 0.8
--       }
--     ]
--   },
--   "confidence": 0.8
-- }

-- Example client preference (not inserted, just documentation)
-- {
--   "approvalPatterns": [
--     {
--       "category": "tone",
--       "preference": "inspiring and action-oriented",
--       "approvalRate": 0.85,
--       "examples": ["Unleash Your Potential", "Achieve Greatness"]
--     }
--   ],
--   "feedbackTriggers": [
--     {
--       "trigger": "too formal",
--       "commonComments": ["Make it more conversational", "Too stiff"],
--       "frequency": 0.3,
--       "severity": "medium"
--     }
--   ],
--   "revisionHotspots": [
--     {
--       "area": "headlines",
--       "revisionRate": 0.4,
--       "commonIssues": ["too long", "not punchy enough"]
--     }
--   ],
--   "communicationStyle": {
--     "preferredChannels": ["email", "slack"],
--     "responseExpectations": "within 24 hours",
--     "feedbackStyle": "direct",
--     "approvalProcess": ["review", "revision", "final_approval"]
--   },
--   "confidence": 0.7,
--   "sampleSize": 15
-- }
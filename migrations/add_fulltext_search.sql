-- PostgreSQL Full-Text Search Migration
-- This adds tsvector column and GIN index for 10-100x faster search

-- Add tsvector column for full-text search
ALTER TABLE "DocumentChunk" ADD COLUMN IF NOT EXISTS content_tsv tsvector;

-- Create GIN index for fast full-text search
CREATE INDEX IF NOT EXISTS idx_document_chunks_fts 
ON "DocumentChunk" USING GIN (content_tsv);

-- Create function to auto-update tsvector on insert/update
CREATE OR REPLACE FUNCTION document_chunks_fts_trigger() RETURNS trigger AS $$
BEGIN
  NEW.content_tsv := to_tsvector('english', COALESCE(NEW.content, ''));
  RETURN NEW;
END
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update tsvector
DROP TRIGGER IF EXISTS tsvector_update ON "DocumentChunk";
CREATE TRIGGER tsvector_update 
BEFORE INSERT OR UPDATE ON "DocumentChunk" 
FOR EACH ROW EXECUTE FUNCTION document_chunks_fts_trigger();

-- Update existing rows with tsvector values
UPDATE "DocumentChunk" 
SET content_tsv = to_tsvector('english', content)
WHERE content_tsv IS NULL;

-- Verify the migration
SELECT 
  COUNT(*) as total_chunks,
  COUNT(content_tsv) as indexed_chunks
FROM "DocumentChunk";

-- Enable pgvector extension for semantic search
CREATE EXTENSION IF NOT EXISTS vector;

-- Create embeddings table
CREATE TABLE IF NOT EXISTS "Embedding" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "embedding" TEXT NOT NULL,
    "metadata" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create ProjectBrief table
CREATE TABLE IF NOT EXISTS "ProjectBrief" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL UNIQUE,
    "content" TEXT NOT NULL,
    "tone" TEXT,
    "guidelines" TEXT,
    "embedding" TEXT,
    "tags" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for embeddings table
CREATE INDEX "Embedding_projectId_idx" ON "Embedding"("projectId");
CREATE INDEX "Embedding_type_idx" ON "Embedding"("type");
CREATE INDEX "Embedding_sourceId_idx" ON "Embedding"("sourceId");

-- Create index for ProjectBrief
CREATE INDEX "ProjectBrief_projectId_idx" ON "ProjectBrief"("projectId");

-- Add foreign key for ProjectBrief
ALTER TABLE "ProjectBrief" ADD CONSTRAINT "ProjectBrief_projectId_fkey" 
    FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE;

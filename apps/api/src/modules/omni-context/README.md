# Omni-Context AI Engine

## Overview

The Omni-Context AI Engine is a revolutionary context-aware system that maintains persistent, project-spanning understanding of brand voice, client preferences, and creative patterns across all agency projects.

**Core Value Proposition:** An AI creative director with 5 years of agency experience, memory of every project, and perfect recall of client preferences.

## Architecture

```
┌─────────────────────────────────────────┐
│         OMNI-CONTEXT LAYER            │
├─────────────────────────────────────────┤
│  Brand Voice Model                    │
│  ├── Tone descriptors                 │
│  ├── Word choice patterns             │
│  ├── Sentence structure preferences    │
│  └── Brand vocabulary               │
│                                     │
│  Visual Identity Model                │
│  ├── Color palettes                 │
│  ├── Typography styles               │
│  ├── Photography aesthetics          │
│  └── Composition patterns            │
│                                     │
│  Client Preference Model              │
│  ├── Approval history                │
│  ├── Feedback patterns               │
│  ├── Revision triggers              │
│  └── Communication style            │
│                                     │
│  Knowledge Graph                     │
│  ├── Project connections            │
│  ├── Freelancer associations         │
│  ├── Asset relationships           │
│  └── Creative lineage              │
└─────────────────────────────────────────┘
           ↓ ↓ ↓ ↓
┌─────────────────────────────────────────┐
│      SEMANTIC VECTOR STORE            │
│  (Embeddings + Knowledge Graph)      │
└─────────────────────────────────────────┘
           ↓
┌─────────────────────────────────────────┐
│    LLM ORCHESTRATION ENGINE           │
│  (RAG + Context Injection)           │
└─────────────────────────────────────────┘
```

## Key Components

### 1. Context Builder (`OmniContextService.buildContext`)

Builds comprehensive AI context from multiple data sources:

- **Brand Voice:** Tone patterns, vocabulary, sentence structure, tagline patterns
- **Visual Identity:** Color palettes, typography, photography aesthetics, composition patterns
- **Client Preferences:** Approval patterns, feedback triggers, revision hotspots, communication style
- **Successful Campaigns:** Historical wins with metrics and creative elements
- **Related Projects:** Semantically similar projects for reference
- **Relevant Assets:** Knowledge base assets with relevance scores
- **Freelancer Notes:** Performance data and skill assessments

**Performance:** Parallel data fetching with 5-minute caching by default.

### 2. Learning System (`recordApproval`, `recordCreativeWork`)

Continuously improves context through:

- **Approval Recording:** Learns client preferences from every approval
- **Creative Work Analysis:** Extracts patterns from approved creative work
- **Preference Refinement:** Updates models based on feedback
- **Cache Invalidation:** Ensures fresh context after updates

### 3. Context Cache

In-memory caching (production should use Redis):

- **TTL:** 5 minutes (configurable)
- **Cache Key:** `context:{projectId}`
- **Force Rebuild:** Available via API or `forceRebuild` flag

## API Endpoints

### Build Context

```http
POST /omni-context/context/build
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "projectId": "uuid",
  "agencyId": "uuid",
  "include": {
    "brandVoice": true,
    "visualIdentity": true,
    "clientPreferences": true,
    "successfulCampaigns": true,
    "freelancerNotes": true,
    "knowledgeSources": true,
    "relatedProjects": true
  },
  "forceRebuild": false
}
```

**Response:**
```json
{
  "found": true,
  "context": {
    "projectId": "uuid",
    "brandVoice": { /* ... */ },
    "visualIdentity": { /* ... */ },
    "clientPreferences": { /* ... */ },
    "successfulCampaigns": [ /* ... */ ],
    "relatedProjects": [ /* ... */ ],
    "relevantAssets": [ /* ... */ ],
    "freelancerNotes": [ /* ... */ ],
    "confidence": 0.85,
    "builtAt": "2026-01-13T18:00:00Z",
    "expiresAt": "2026-01-13T18:05:00Z"
  },
  "cacheHit": false,
  "buildTime": 245,
  "confidence": 0.85
}
```

### Record Approval

```http
POST /omni-context/context/approval
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "projectId": "uuid",
  "itemType": "headline",
  "itemId": "uuid",
  "approvalRating": 5,
  "clientId": "uuid",
  "userId": "uuid",
  "tags": ["inspiring", "bold"],
  "feedback": "Perfect tone, nailed it!"
}
```

### Record Creative Work

```http
POST /omni-context/context/creative-work
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "projectId": "uuid",
  "content": "Unleash Your Greatness",
  "contentType": "tagline",
  "approved": true,
  "tags": ["aspirational", "empowering"],
  "userId": "uuid"
}
```

### Update Brand Context

```http
PUT /omni-context/context/brand
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "agencyId": "uuid",
  "name": "Nike Brand Voice",
  "type": "BRAND_VOICE",
  "data": {
    "tone": ["aspirational", "empowering", "direct"],
    "vocabulary": ["unleash", "dominate", "achieve"],
    "guidelines": "Always use active voice, keep it short"
  }
}
```

### Query Brand Contexts

```http
GET /omni-context/context/brand?agencyId=uuid&type=BRAND_VOICE&limit=20
Authorization: Bearer <jwt-token>
```

### Clear Cache

```http
DELETE /omni-context/context/cache/:projectId
Authorization: Bearer <jwt-token>
```

### Health Check

```http
GET /omni-context/health
```

## Database Schema

### Brand Context Table

```sql
CREATE TABLE brand_contexts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_id VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL,
  embeddings JSONB,
  metadata JSONB,
  confidence FLOAT DEFAULT 0.8,
  usage_count INTEGER DEFAULT 0,
  last_used_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_brand_contexts_agency_type ON brand_contexts(agency_id, type);
CREATE INDEX idx_brand_contexts_usage ON brand_contexts(usage_count DESC);
```

### Client Preference Table

```sql
CREATE TABLE client_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  client_id VARCHAR(255),
  preference_type VARCHAR(100) NOT NULL,
  preferences JSONB NOT NULL,
  confidence FLOAT DEFAULT 0.5,
  sample_size INTEGER DEFAULT 1,
  last_updated TIMESTAMP DEFAULT NOW(),
  UNIQUE(project_id, preference_type)
);

CREATE INDEX idx_client_preferences_project ON client_preferences(project_id);
```

## Integration Guide

### Frontend Integration

```typescript
import { useApiData } from '@/hooks/useApiData';

// Build context for Writer's Room
function WritersRoom({ projectId }: { projectId: string }) {
  const { data: context, isLoading } = useApiData(
    `/omni-context/context/build`,
    {
      method: 'POST',
      body: {
        projectId,
        include: {
          brandVoice: true,
          clientPreferences: true,
          successfulCampaigns: true
        }
      }
    }
  );

  // Use context in AI requests
  const aiResponse = await callAI(prompt, {
    context: context.brandVoice,
    clientPreferences: context.clientPreferences,
    examples: context.successfulCampaigns
  });
}
```

### AI Service Integration

```typescript
// Inject context into AI prompts
async function callAI(prompt: string, context: ProjectContext) {
  const systemPrompt = buildSystemPrompt(context);
  
  return await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: prompt }
    ],
    temperature: getClientTemperature(context.clientPreferences)
  });
}

function buildSystemPrompt(context: ProjectContext): string {
  const tone = context.brandVoice?.tone.join(', ') || 'professional';
  const vocabulary = context.brandVoice?.vocabulary.join(', ') || '';
  
  return `You are a creative copywriter for ${context.clientPreferences?.clientId || 'our client'}.

Brand Voice:
- Tone: ${tone}
- Key Vocabulary: ${vocabulary}
- Use these words: ${context.brandVoice?.wordChoicePreferences[0]?.words.join(', ')}

Client Preferences:
- Style: ${context.clientPreferences?.communicationStyle.feedbackStyle}
- Common Approval Triggers: ${context.clientPreferences?.feedbackTriggers.map(t => t.trigger).join(', ')}

Reference Successful Campaigns:
${context.successfulCampaigns?.map(c => `- ${c.title}: ${c.creativeElements[0]?.description}`).join('\n')}

Always match brand voice and client preferences in your responses.`;
}
```

### Approval Workflow Integration

```typescript
// When client approves creative work
async function handleApproval(item: CreativeItem, rating: number, feedback: string) {
  // Record approval for learning
  await api.post('/omni-context/context/approval', {
    projectId: currentProject.id,
    itemType: item.type,
    itemId: item.id,
    approvalRating: rating,
    clientId: currentProject.clientId,
    userId: currentUser.id,
    tags: item.tags,
    feedback: feedback
  });

  // If approved creative work, record it too
  if (item.type === 'copy' && rating >= 4) {
    await api.post('/omni-context/context/creative-work', {
      projectId: currentProject.id,
      content: item.content,
      contentType: item.contentType,
      approved: true,
      approvalRating: rating,
      tags: item.tags,
      userId: currentUser.id
    });
  }

  // Show success
  toast.success('Approval recorded. AI will learn from this feedback.');
}
```

## Configuration

### Environment Variables

```env
# Omni-Context AI Configuration
OMNI_CONTEXT_CACHE_TTL=300000          # Cache TTL in milliseconds (default: 5 minutes)
OMNI_CONTEXT_HISTORY_DEPTH=10           # Number of past projects to consider
OMNI_CONTEXT_MIN_CONFIDENCE=0.6         # Minimum confidence threshold
OMNI_CONTEXT_LEARNING_ENABLED=true     # Enable/disable learning system

# Vector Database (Pinecone or Weaviate)
VECTOR_DATABASE_URL=https://vector-db.example.com
VECTOR_DATABASE_API_KEY=your-api-key
VECTOR_DATABASE_INDEX=studio-roster

# AI Service (OpenAI or Anthropic)
AI_SERVICE=openai
AI_API_KEY=your-openai-key
AI_MODEL=gpt-4
AI_EMBEDDING_MODEL=text-embedding-3
```

### Configuration Options

```typescript
// apps/api/src/modules/omni-context/omni-context.config.ts
export const omniContextConfig = {
  // Cache settings
  cache: {
    enabled: true,
    ttl: 5 * 60 * 1000, // 5 minutes
    provider: 'redis', // 'memory' for development
  },

  // Context building
  context: {
    maxHistoryDepth: 10,
    minConfidenceThreshold: 0.6,
    parallelFetch: true,
  },

  // Learning system
  learning: {
    enabled: true,
    approvalThreshold: 4, // Minimum rating to learn from
    reembedThreshold: 0.3, // Significant change threshold
  },

  // Vector database
  vector: {
    provider: 'pinecone', // 'pinecone', 'weaviate', 'pgvector'
    dimensions: 1536,
    metric: 'cosine',
  },

  // AI service
  ai: {
    provider: 'openai',
    model: 'gpt-4',
    embeddingModel: 'text-embedding-3',
    maxTokens: 4000,
    temperature: 0.7,
  },
};
```

## Performance Considerations

### Caching Strategy

1. **Context Cache:** 5-minute TTL per project
2. **Brand Context Cache:** 1-hour TTL per agency
3. **Vector Search Cache:** 30-minute TTL per query
4. **Cache Invalidation:** Automatic on approvals/updates

### Parallel Data Fetching

All context sources are fetched in parallel:

```typescript
const [brandContext, clientPreferences, campaigns, ...] = await Promise.all([
  this.getBrandContext(agencyId),
  this.getClientPreferences(projectId),
  this.getSuccessfulCampaigns(userId, projectId),
  // ... more sources
]);
```

### Database Optimization

- **Indexes:** All foreign keys and filter fields indexed
- **Connection Pooling:** Prisma connection pooling enabled
- **Query Batching:** Parallel queries where possible
- **Result Limiting:** Always use `take()` to prevent large result sets

## Monitoring & Logging

### Structured Logging

```typescript
this.logger.log(`Building context for ${projectId}`);
this.logger.debug(`Cache hit for ${projectId}`);
this.logger.error(`Failed to build context`, error);
this.logger.warn(`Low confidence context: ${confidence}`);
```

### Metrics to Track

1. **Context Build Time:** Average build time per project
2. **Cache Hit Rate:** Percentage of cache hits
3. **Confidence Distribution:** Average context confidence
4. **Learning Events:** Number of approvals/creative works recorded
5. **Error Rate:** Percentage of failed context builds

### Alert Thresholds

- **Context Build Time > 5s:** Alert - performance degradation
- **Cache Hit Rate < 50%:** Alert - cache ineffective
- **Average Confidence < 0.6:** Alert - insufficient data
- **Error Rate > 5%:** Alert - stability issues

## Testing

### Unit Tests

```typescript
describe('OmniContextService', () => {
  it('should build context for project', async () => {
    const context = await service.buildContext({
      projectId: 'test-id',
      include: { brandVoice: true }
    });

    expect(context.found).toBe(true);
    expect(context.context.brandVoice).toBeDefined();
    expect(context.confidence).toBeGreaterThan(0);
  });

  it('should cache context', async () => {
    await service.buildContext({ projectId: 'test-id', include: {} });
    
    // Second call should hit cache
    const result = await service.buildContext({ 
      projectId: 'test-id', 
      include: {} 
    });

    expect(result.cacheHit).toBe(true);
    expect(result.buildTime).toBeLessThan(100);
  });

  it('should learn from approval', async () => {
    await service.recordApproval({
      projectId: 'test-id',
      itemType: 'headline',
      itemId: 'item-1',
      approvalRating: 5
    });

    // Cache should be invalidated
    const result = await service.buildContext({ 
      projectId: 'test-id', 
      include: {} 
    });

    expect(result.cacheHit).toBe(false);
  });
});
```

### Integration Tests

```typescript
describe('Omni-Context Integration', () => {
  it('should build full context from database', async () => {
    // Create test project with related data
    const project = await createTestProject();
    await createTestBrandContext(project.agencyId);
    await createTestApprovals(project.id, 10);
    
    const context = await service.buildContext({
      projectId: project.id,
      include: {
        brandVoice: true,
        clientPreferences: true,
        successfulCampaigns: true
      }
    });

    expect(context.context.brandVoice).toBeDefined();
    expect(context.context.clientPreferences).toBeDefined();
    expect(context.context.successfulCampaigns.length).toBeGreaterThan(0);
    expect(context.confidence).toBeGreaterThan(0.7);
  });
});
```

## Future Enhancements

### Phase 2: Vector Database Integration

- Replace mock vector search with actual Pinecone/Weaviate integration
- Implement semantic search for related projects and assets
- Add re-embedding pipeline for brand context updates

### Phase 3: Advanced ML Models

- Train custom models for brand voice prediction
- Implement client preference clustering
- Add recommendation system for creative directions

### Phase 4: Real-Time Learning

- WebSocket-based context updates
- Real-time confidence tracking
- Live context quality metrics

### Phase 5: Multi-Agency Support

- Agency-level context inheritance
- Shared brand libraries across agencies
- Context versioning and rollback

## Troubleshooting

### Common Issues

**Issue: Low context confidence (< 0.6)**

**Cause:** Insufficient data for project

**Solution:**
1. Record more approvals to build preference model
2. Add brand context manually via API
3. Create more successful campaigns to reference

**Issue: Context build time > 5 seconds**

**Cause:** Too much data being fetched, slow database

**Solution:**
1. Reduce `maxHistoryDepth` in config
2. Add more database indexes
3. Enable Redis caching for hot data

**Issue: Cache not being used**

**Cause:** Always calling with `forceRebuild: true`

**Solution:**
1. Remove `forceRebuild` flag from API calls
2. Check cache TTL is appropriate (default: 5 minutes)
3. Verify cache is being set correctly

## Support

For questions or issues:
- **Documentation:** See `/omni-context/health` for service status
- **Logs:** Check application logs for detailed error messages
- **Metrics:** Monitor context build times and confidence scores

---

**Version:** 1.0.0  
**Last Updated:** 2026-01-13  
**Author:** Senior Computational Design Architect
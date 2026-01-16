# Prisma Migration Commands

## Completed

### Phase 2.1: Update prisma/schema.prisma - Add conversation models ✅
- **Status**: COMPLETE
- **Models Added**:
  - `Conversation` - Chat persistence with project context
  - `Message` - Individual messages with role tracking
  - `ContextSnapshot` - Project context snapshots for RAG
  - `ProjectVersion` - Version history for auto-save
  - `Embedding` - Vector embeddings for semantic search
- **Enums Added**:
  - `ConversationStatus` - ACTIVE, ARCHIVED, STARRED
  - `MessageRole` - USER, ASSISTANT
- **Relations Updated**: Added conversation references to User and Project models
- **Client Generated**: `npx prisma generate` executed successfully

### Phase 2.2: Create Prisma migration - Generate conversation migration
- **Status**: READY
- **Command**: `npx prisma migrate dev --name add-conversation-models`
- **Note**: Migration ready to run when database connection is available

## Next Steps

### Phase 2.3: Create conversations.service.ts - Chat persistence service
- **Location**: `apps/api/src/modules/conversations/conversations.service.ts`
- **Features**: Full CRUD operations for conversations and messages

### Phase 2.4: Create conversations.controller.ts - Conversation API endpoints
- **Location**: `apps/api/src/modules/conversations/conversations.controller.ts`
- **Features**: RESTful API for conversation management

### Phase 2.5: Create conversations.module.ts - NestJS module setup
- **Location**: `apps/api/src/modules/conversations/conversations.module.ts`
- **Features**: Module wiring and dependency injection

## Migration Details

The following tables will be created:

1. **conversations** - Chat conversations
2. **messages** - Individual chat messages
3. **context_snapshots** - Project context snapshots
4. **project_versions** - Project version history
5. **embeddings** - Vector embeddings for search

Indexes will be created for:
- conversations (projectId, userId, status)
- messages (conversationId, role)
- context_snapshots (conversationId)
- project_versions (projectId)

## Usage Examples

After migration, you can:

```typescript
// Create a new conversation
const conversation = await this.conversationsService.create({
  title: "Project Review Discussion",
  projectId: "project-123",
  userId: "user-456"
});

// Add a message
const message = await this.messagesService.create({
  conversationId: conversation.id,
  role: "USER",
  content: "Let's discuss the brand direction for this project."
});

import { Module } from '@nestjs/common';
import { ConversationsController } from './conversations.controller';
import { ConversationsService } from './conversations.service';

@Module({
  controllers: [ConversationsController],
  providers: [ConversationsService],
  exports: [ConversationsService],
})
export class ConversationsModule {}

/*
CONVERSATIONS MODULE DOCUMENTATION

This module provides complete conversation management functionality for AI chat persistence.

Features:
- Create, read, update, delete conversations
- Add messages with role tracking (USER/ASSISTANT)
- Context snapshots for RAG enhancement
- Search and pagination support
- Project-specific conversations
- Statistics and analytics

API Endpoints:
- POST /api/v1/conversations - Create new conversation
- GET /api/v1/conversations - List user conversations
- GET /api/v1/conversations/:id - Get conversation details
- GET /api/v1/conversations/:id/context - Get RAG context
- POST /api/v1/conversations/:id/messages - Add message
- PUT /api/v1/conversations/:id - Update conversation
- POST /api/v1/conversations/:id/archive - Archive conversation
- POST /api/v1/conversations/:id/star - Star conversation
- POST /api/v1/conversations/:id/context-snapshot - Capture context
- DELETE /api/v1/conversations/:id - Delete conversation
- GET /api/v1/conversations/project/:projectId - Project conversations
- GET /api/v1/conversations/search - Search conversations
- GET /api/v1/conversations/stats - Get statistics

Database Models:
- Conversation - Chat conversations with metadata
- Message - Individual messages with roles
- ContextSnapshot - Project context for RAG
- ProjectVersion - Version history for auto-save
- Embedding - Vector embeddings for search

Integration:
- Connects to AI chat endpoints for conversation persistence
- Provides context for RAG system
- Supports real-time collaboration features
- Enables search across conversation history

Usage in other modules:
```typescript
import { ConversationsService } from '../conversations/conversations.service';

constructor(private conversationsService: ConversationsService) {}

async createConversationWithContext(projectId: string, title: string) {
  const conversation = await this.conversationsService.createConversation({
    title,
    projectId,
    userId: 'current-user-id'
  });
  
  // Capture initial context snapshot
  await this.conversationsService.captureContextSnapshot({
    conversationId: conversation.id,
    projectId,
    briefContext: project.brief,
    brandTensor: project.brandContext,
    knowledgeSourceIds: []
  });
  
  return conversation;
}
```
*/

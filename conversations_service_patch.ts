// PATCH: Add missing methods to ConversationsService for AI controller compatibility
// This should be inserted after the constructor in conversations.service.ts

import { create } from "domain";

/**
 * Find conversation by ID (alias for getConversation)
 */
async findById(id: string) {
  return this.getConversation(id);
}

/**
 * Get messages for a conversation
 */
async getMessages(conversationId: string, limit: number = 20) {
  return this.prisma.message.findMany({
    where: { conversationId },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });
}

/**
 * Create a new conversation (alias for createConversation)
 */
async create(dto: CreateConversationDto) {
  return this.createConversation(dto);
}

/**
 * Generate context snapshot (alias for captureContextSnapshot)
 */
async generateContextSnapshot(conversationId: string) {
  return this.captureContextSnapshot({ conversationId });
}

/**
 * Add message with flexible parameters (for AI controller compatibility)
 */
async addMessage(conversationId: string, messageData: { role: string; content: string; tokens?: number }) {
  return this.addMessage({
    conversationId,
    role: messageData.role as MessageRole,
    content: messageData.content,
    tokens: messageData.tokens,
  });
}

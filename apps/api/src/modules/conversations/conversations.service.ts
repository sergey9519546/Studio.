import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ConversationStatus, MessageRole } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

export interface CreateConversationDto {
  title?: string;
  topic?: string;
  projectId?: string;
  userId?: string;
  metadata?: Record<string, any>;
}

export interface AddMessageDto {
  conversationId: string;
  role: MessageRole;
  content: string;
  tokens?: number;
  embeddingId?: string;
  referencedSources?: string[];
}

export interface UpdateConversationDto {
  title?: string;
  topic?: string;
  status?: ConversationStatus;
  metadata?: Record<string, any>;
}

export interface CaptureContextSnapshotDto {
  conversationId: string;
  projectId?: string;
  briefContext?: Record<string, any>;
  brandTensor?: Record<string, any>;
  assetIntelligence?: Record<string, any>;
  knowledgeSourceIds?: string[];
}

@Injectable()
export class ConversationsService {
  constructor(private prisma: PrismaService) {}

  // Missing methods that AI controller expects
  
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
  async addFlexibleMessage(conversationId: string, messageData: { role: string; content: string; tokens?: number; metadata?: any }) {
    return this.addMessage({
      conversationId,
      role: messageData.role as MessageRole,
      content: messageData.content,
      tokens: messageData.tokens,
    });
  }

  /**
   * Create a new conversation
   */
  async createConversation(dto: CreateConversationDto) {
    try {
      const conversation = await this.prisma.conversation.create({
        data: {
          title: dto.title,
          topic: dto.topic,
          projectId: dto.projectId,
          userId: dto.userId,
          metadata: dto.metadata,
          status: ConversationStatus.ACTIVE,
        },
        include: {
          project: {
            select: {
              id: true,
              title: true,
              name: true,
              client: true,
              status: true,
            },
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true,
            },
          },
          messages: {
            take: 10,
            orderBy: {
              createdAt: 'desc',
            },
          },
        },
      });

      return conversation;
    } catch (error) {
      throw new BadRequestException(`Failed to create conversation: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get conversation by ID with full details
   */
  async getConversation(id: string) {
    const conversation = await this.prisma.conversation.findUnique({
      where: { id },
      include: {
        project: {
          select: {
            id: true,
            title: true,
            name: true,
            client: true,
            status: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        messages: {
          orderBy: {
            createdAt: 'asc',
          },
          include: {
            conversation: {
              select: {
                id: true,
              },
            },
          },
        },
        contextSnapshots: {
          orderBy: {
            capturedAt: 'desc',
          },
        },
      },
    });

    if (!conversation) {
      throw new NotFoundException(`Conversation with ID ${id} not found`);
    }

    return conversation;
  }

  /**
   * Get conversation history for RAG context
   */
  async getConversationContext(conversationId: string) {
    const conversation = await this.getConversation(conversationId);
    
    // Get recent messages (last 20 messages)
    const recentMessages = await this.prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    // Get latest context snapshot
    const latestSnapshot = await this.prisma.contextSnapshot.findFirst({
      where: { conversationId },
      orderBy: { capturedAt: 'desc' },
    });

    return {
      conversation: {
        id: conversation.id,
        title: conversation.title,
        topic: conversation.topic,
        projectId: conversation.projectId,
        metadata: conversation.metadata,
      },
      recentMessages: recentMessages.reverse(),
      contextSnapshot: latestSnapshot,
    };
  }

  /**
   * Add a message to a conversation
   */
  async addMessage(dto: AddMessageDto) {
    // Verify conversation exists
    const conversation = await this.prisma.conversation.findUnique({
      where: { id: dto.conversationId },
    });

    if (!conversation) {
      throw new NotFoundException(`Conversation with ID ${dto.conversationId} not found`);
    }

    try {
      const message = await this.prisma.message.create({
        data: {
          conversationId: dto.conversationId,
          role: dto.role,
          content: dto.content,
          tokens: dto.tokens,
          embeddingId: dto.embeddingId,
          referencedSources: dto.referencedSources || [],
        },
        include: {
          conversation: {
            select: {
              id: true,
              title: true,
            },
          },
        },
      });

      // Update conversation's message count
      await this.prisma.conversation.update({
        where: { id: dto.conversationId },
        data: {
          messageCount: {
            increment: 1,
          },
          updatedAt: new Date(),
        },
      });

      return message;
    } catch (error) {
      throw new BadRequestException(`Failed to add message: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get all conversations for a user with pagination
   */
  async getUserConversations(
    userId: string,
    page: number = 1,
    limit: number = 10,
    filters?: {
      projectId?: string;
      status?: ConversationStatus;
      topic?: string;
    }
  ) {
    const skip = (page - 1) * limit;

    const where = {
      userId,
      ...(filters?.projectId && { projectId: filters.projectId }),
      ...(filters?.status && { status: filters.status }),
      ...(filters?.topic && { topic: { contains: filters.topic } }),
    };

    const [conversations, total] = await Promise.all([
      this.prisma.conversation.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          updatedAt: 'desc',
        },
        include: {
          project: {
            select: {
              id: true,
              title: true,
              name: true,
              client: true,
            },
          },
          _count: {
            select: {
              messages: true,
            },
          },
        },
      }),
      this.prisma.conversation.count({ where }),
    ]);

    return {
      conversations,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get conversations for a project
   */
  async getProjectConversations(projectId: string) {
    return this.prisma.conversation.findMany({
      where: { projectId },
      orderBy: {
        updatedAt: 'desc',
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        _count: {
          select: {
            messages: true,
          },
        },
      },
    });
  }

  /**
   * Update conversation
   */
  async updateConversation(id: string, dto: UpdateConversationDto) {
    // Verify conversation exists
    const conversation = await this.prisma.conversation.findUnique({
      where: { id },
    });

    if (!conversation) {
      throw new NotFoundException(`Conversation with ID ${id} not found`);
    }

    return this.prisma.conversation.update({
      where: { id },
      data: {
        ...dto,
        updatedAt: new Date(),
      },
    });
  }

  /**
   * Archive a conversation
   */
  async archiveConversation(id: string) {
    return this.updateConversation(id, {
      status: ConversationStatus.ARCHIVED,
    });
  }

  /**
   * Star a conversation
   */
  async starConversation(id: string) {
    return this.updateConversation(id, {
      status: ConversationStatus.STARRED,
    });
  }

  /**
   * Delete a conversation (cascade deletes messages and snapshots)
   */
  async deleteConversation(id: string) {
    // Verify conversation exists
    const conversation = await this.prisma.conversation.findUnique({
      where: { id },
    });

    if (!conversation) {
      throw new NotFoundException(`Conversation with ID ${id} not found`);
    }

    await this.prisma.conversation.delete({
      where: { id },
    });

    return { message: 'Conversation deleted successfully' };
  }

  /**
   * Capture context snapshot for RAG enhancement
   */
  async captureContextSnapshot(dto: CaptureContextSnapshotDto) {
    // Verify conversation exists
    const conversation = await this.prisma.conversation.findUnique({
      where: { id: dto.conversationId },
    });

    if (!conversation) {
      throw new NotFoundException(`Conversation with ID ${dto.conversationId} not found`);
    }

    return this.prisma.contextSnapshot.create({
      data: {
        conversationId: dto.conversationId,
        projectId: dto.projectId,
        briefContext: dto.briefContext,
        brandTensor: dto.brandTensor,
        assetIntelligence: dto.assetIntelligence,
        knowledgeSourceIds: dto.knowledgeSourceIds || [],
      },
      include: {
        conversation: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });
  }

  /**
   * Get conversation statistics
   */
  async getConversationStats(userId?: string, projectId?: string) {
    const where = {
      ...(userId && { userId }),
      ...(projectId && { projectId }),
    };

    const [
      totalConversations,
      activeConversations,
      archivedConversations,
      starredConversations,
      totalMessages,
      averageMessagesPerConversation,
    ] = await Promise.all([
      this.prisma.conversation.count({ where }),
      this.prisma.conversation.count({
        where: { ...where, status: ConversationStatus.ACTIVE },
      }),
      this.prisma.conversation.count({
        where: { ...where, status: ConversationStatus.ARCHIVED },
      }),
      this.prisma.conversation.count({
        where: { ...where, status: ConversationStatus.STARRED },
      }),
      this.prisma.message.count({
        where: {
          conversation: where,
        },
      }),
      this.prisma.conversation.aggregate({
        where,
        _avg: {
          messageCount: true,
        },
      }),
    ]);

    return {
      totalConversations,
      activeConversations,
      archivedConversations,
      starredConversations,
      totalMessages,
      averageMessagesPerConversation: averageMessagesPerConversation._avg.messageCount || 0,
    };
  }

  /**
   * Search conversations by content
   */
  async searchConversations(
    userId: string,
    query: string,
    page: number = 1,
    limit: number = 10
  ) {
    const skip = (page - 1) * limit;

    const [conversations, total] = await Promise.all([
      this.prisma.conversation.findMany({
        where: {
          userId,
          OR: [
            { title: { contains: query } },
            { topic: { contains: query } },
            { messages: { some: { content: { contains: query } } } },
          ],
        },
        skip,
        take: limit,
        orderBy: {
          updatedAt: 'desc',
        },
        include: {
          project: {
            select: {
              id: true,
              title: true,
              name: true,
            },
          },
          _count: {
            select: {
              messages: true,
            },
          },
        },
      }),
      this.prisma.conversation.count({
        where: {
          userId,
          OR: [
            { title: { contains: query } },
            { topic: { contains: query } },
            { messages: { some: { content: { contains: query } } } },
          ],
        },
      }),
    ]);

    return {
      conversations,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}

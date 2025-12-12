import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ConversationStatus } from '@prisma/client';
import { AddMessageDto, CaptureContextSnapshotDto, ConversationsService, CreateConversationDto, UpdateConversationDto } from './conversations.service';
import { JwtAuthGuard } from '@app/common/guards/jwt-auth.guard';

@Controller('api/v1/conversations')
@UseGuards(JwtAuthGuard)
export class ConversationsController {
  constructor(private readonly conversationsService: ConversationsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createConversation(@Body() dto: CreateConversationDto) {
    return this.conversationsService.createConversation(dto);
  }

  @Get()
  async getUserConversations(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('projectId') projectId?: string,
    @Query('status') status?: ConversationStatus,
    @Query('topic') topic?: string,
  ) {
    return this.conversationsService.getUserConversations(
      'current-user-id', // TODO: Extract from JWT token
      page ? Number(page) : 1,
      limit ? Number(limit) : 10,
      {
        projectId,
        status,
        topic,
      },
    );
  }

  @Get('project/:projectId')
  async getProjectConversations(@Param('projectId', ParseUUIDPipe) projectId: string) {
    return this.conversationsService.getProjectConversations(projectId);
  }

  @Get('search')
  async searchConversations(
    @Query('q') query: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.conversationsService.searchConversations(
      'current-user-id', // TODO: Extract from JWT token
      query,
      page ? Number(page) : 1,
      limit ? Number(limit) : 10,
    );
  }

  @Get('stats')
  async getConversationStats(
    @Query('userId') userId?: string,
    @Query('projectId') projectId?: string,
  ) {
    return this.conversationsService.getConversationStats(userId, projectId);
  }

  @Get(':id')
  async getConversation(@Param('id', ParseUUIDPipe) id: string) {
    return this.conversationsService.getConversation(id);
  }

  @Get(':id/context')
  async getConversationContext(@Param('id', ParseUUIDPipe) id: string) {
    return this.conversationsService.getConversationContext(id);
  }

  @Put(':id')
  async updateConversation(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateConversationDto,
  ) {
    return this.conversationsService.updateConversation(id, dto);
  }

  @Post(':id/messages')
  @HttpCode(HttpStatus.CREATED)
  async addMessage(
    @Param('id', ParseUUIDPipe) conversationId: string,
    @Body() dto: Omit<AddMessageDto, 'conversationId'>,
  ) {
    return this.conversationsService.addMessage({
      ...dto,
      conversationId,
    });
  }

  @Post(':id/archive')
  @HttpCode(HttpStatus.OK)
  async archiveConversation(@Param('id', ParseUUIDPipe) id: string) {
    return this.conversationsService.archiveConversation(id);
  }

  @Post(':id/star')
  @HttpCode(HttpStatus.OK)
  async starConversation(@Param('id', ParseUUIDPipe) id: string) {
    return this.conversationsService.starConversation(id);
  }

  @Post(':id/context-snapshot')
  @HttpCode(HttpStatus.CREATED)
  async captureContextSnapshot(
    @Param('id', ParseUUIDPipe) conversationId: string,
    @Body() dto: Omit<CaptureContextSnapshotDto, 'conversationId'>,
  ) {
    return this.conversationsService.captureContextSnapshot({
      ...dto,
      conversationId,
    });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteConversation(@Param('id', ParseUUIDPipe) id: string) {
    return this.conversationsService.deleteConversation(id);
  }
}

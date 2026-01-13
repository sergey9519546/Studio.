import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Body, 
  Param, 
  Query,
  UseGuards,
  HttpCode,
  HttpStatus 
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiParam, 
  ApiQuery, 
  ApiBody 
} from '@nestjs/swagger';
import { OmniContextService } from './omni-context.service.js';
import {
  BuildContextDto,
  RecordApprovalDto,
  RecordCreativeWorkDto,
  UpdateBrandContextDto,
  QueryBrandContextDto,
} from './dto/omni-context.dto.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';

/**
 * Omni-Context AI Controller
 * 
 * Exposes REST API endpoints for the Omni-Context AI Engine.
 * All endpoints are protected by JWT authentication.
 * 
 * Endpoints:
 * - POST /context/build - Build AI context for a project
 * - POST /context/approval - Record approval feedback
 * - POST /context/creative-work - Record creative work for learning
 * - POST /context/brand - Update brand context
 * - GET /context/brand - Query brand contexts
 * - DELETE /context/cache/:projectId - Clear context cache
 */
@Controller('omni-context')
@ApiTags('Omni-Context AI')
@UseGuards(JwtAuthGuard)
export class OmniContextController {
  constructor(private readonly omniContextService: OmniContextService) {}

  /**
   * Build AI context for a project
   * 
   * This is the main endpoint used by the Writer's Room and other
   * AI-powered features to get comprehensive project context.
   * 
   * The context includes:
   * - Brand voice and tone preferences
   * - Visual identity guidelines
   * - Client approval patterns
   * - Successful past campaigns
   * - Related projects
   * - Relevant knowledge assets
   * - Freelancer performance notes
   * 
   * Response is cached for 5 minutes by default.
   */
  @Post('context/build')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Build AI context for a project',
    description: `
      Builds comprehensive AI context for a project from multiple data sources.
      Includes brand voice, client preferences, successful campaigns, and more.
      Results are cached for 5 minutes unless forceRebuild is true.
    `
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Context built successfully' 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized - missing or invalid JWT token' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Project not found' 
  })
  @ApiBody({ type: BuildContextDto })
  async buildContext(@Body() dto: BuildContextDto) {
    return this.omniContextService.buildContext(dto);
  }

  /**
   * Record approval feedback
   * 
   * Records client approval feedback to improve the AI's understanding
   * of client preferences and brand voice.
   * 
   * Each approval:
   * - Updates client preference model
   * - Refines brand voice if creative content
   * - Invalidates context cache for the project
   * - Contributes to learning system
   */
  @Post('context/approval')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Record approval feedback',
    description: `
      Records client approval feedback to learn preferences and improve AI context.
      This is the primary learning loop of the system.
      Invalidates context cache for the project.
    `
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Approval recorded successfully' 
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Bad request - invalid approval data' 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized - missing or invalid JWT token' 
  })
  @ApiBody({ type: RecordApprovalDto })
  async recordApproval(@Body() dto: RecordApprovalDto) {
    await this.omniContextService.recordApproval(dto);
    return {
      success: true,
      message: 'Approval recorded and context updated',
    };
  }

  /**
   * Record creative work for learning
   * 
   * Records creative work (headlines, copy, taglines, etc.) to
   * analyze and learn brand voice patterns.
   * 
   * Only approved, high-quality work is used for learning.
   * Creative content is analyzed for:
   * - Tone patterns
   * - Vocabulary preferences
   * - Sentence structure
   * - Tagline patterns
   */
  @Post('context/creative-work')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Record creative work for learning',
    description: `
      Records creative work to analyze and learn brand voice patterns.
      Only approved, high-quality work (rating >= 4) is used for learning.
      Analyzes content for tone, vocabulary, sentence structure, and patterns.
    `
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Creative work recorded successfully' 
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Bad request - invalid creative work data' 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized - missing or invalid JWT token' 
  })
  @ApiBody({ type: RecordCreativeWorkDto })
  async recordCreativeWork(@Body() dto: RecordCreativeWorkDto) {
    await this.omniContextService.recordCreativeWork(dto);
    return {
      success: true,
      message: 'Creative work analyzed and brand voice updated',
    };
  }

  /**
   * Update brand context
   * 
   * Manually update or create brand context for an agency.
   * This is useful for:
   * - Initial brand setup
   * - Manual brand guidelines input
   * - Updating brand style guides
   * 
   * Brand context will be embedded for semantic search.
   */
  @Put('context/brand')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update brand context',
    description: `
      Manually update or create brand context for an agency.
      Useful for initial brand setup or updating brand style guides.
      Brand context is embedded for semantic search and AI context building.
    `
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Brand context updated successfully' 
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Bad request - invalid brand context data' 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized - missing or invalid JWT token' 
  })
  @ApiBody({ type: UpdateBrandContextDto })
  async updateBrandContext(@Body() dto: UpdateBrandContextDto) {
    await this.omniContextService.updateBrandContext(dto);
    return {
      success: true,
      message: 'Brand context updated and embedded',
    };
  }

  /**
   * Query brand contexts
   * 
   * Retrieve brand contexts for an agency, optionally filtered by type.
   * 
   * Brand context types:
   * - BRAND_VOICE: Tone, vocabulary, messaging patterns
   * - VISUAL_IDENTITY: Colors, typography, photography style
   * - MESSAGING_PATTERN: Communication patterns and style
   * - CREATIVE_DIRECTION: Overall creative approach and philosophy
   * - COMPETITIVE_POSITIONING: Market positioning strategy
   */
  @Get('context/brand')
  @ApiOperation({
    summary: 'Query brand contexts',
    description: `
      Retrieve brand contexts for an agency, optionally filtered by type.
      Returns contexts sorted by usage frequency.
    `
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Brand contexts retrieved successfully' 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized - missing or invalid JWT token' 
  })
  @ApiQuery({ 
    name: 'agencyId', 
    required: false, 
    description: 'Filter by agency ID' 
  })
  @ApiQuery({ 
    name: 'type', 
    required: false, 
    description: 'Filter by context type',
    enum: ['BRAND_VOICE', 'VISUAL_IDENTITY', 'MESSAGING_PATTERN', 'CREATIVE_DIRECTION', 'COMPETITIVE_POSITIONING']
  })
  @ApiQuery({ 
    name: 'limit', 
    required: false, 
    description: 'Maximum number of results',
    example: 20 
  })
  async queryBrandContexts(
    @Query('agencyId') agencyId?: string,
    @Query('type') type?: string,
    @Query('limit') limit?: string,
  ) {
    const limitNum = limit ? parseInt(limit, 10) : 20;
    return this.omniContextService.queryBrandContexts(agencyId, type, limitNum);
  }

  /**
   * Clear context cache
   * 
   * Manually clear the cached context for a project.
   * This forces the next context build to fetch fresh data.
   * 
   * Use this when:
   * - Project data changes significantly
   * - Testing context updates
   * - Debugging context issues
   */
  @Delete('context/cache/:projectId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Clear context cache',
    description: `
      Manually clear the cached context for a project.
      Forces the next context build to fetch fresh data.
      Use when project data changes significantly or for testing.
    `
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Cache cleared successfully' 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized - missing or invalid JWT token' 
  })
  @ApiParam({ 
    name: 'projectId', 
    description: 'Project ID to clear cache for' 
  })
  async clearCache(@Param('projectId') projectId: string) {
    await this.omniContextService.clearContextCache(projectId);
    return {
      success: true,
      message: `Cache cleared for project ${projectId}`,
    };
  }

  /**
   * Health check endpoint
   * 
   * Simple health check for the Omni-Context AI service.
   * Returns service status and configuration.
   */
  @Get('health')
  @ApiOperation({
    summary: 'Health check',
    description: 'Simple health check for the Omni-Context AI service'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Service is healthy' 
  })
  async health() {
    return {
      status: 'healthy',
      service: 'Omni-Context AI',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
    };
  }
}
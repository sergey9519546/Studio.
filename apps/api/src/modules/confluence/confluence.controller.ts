import { Controller, Get, HttpException, HttpStatus, Param, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { ConfluenceService } from './confluence.service';

/**
 * Controller for Confluence integration endpoints
 */
@Controller('confluence')
export class ConfluenceController {
  constructor(private readonly confluenceService: ConfluenceService) {}

  /**
   * Health check endpoint
   * GET /api/confluence/health
   */
  @Get('health')
  async healthCheck() {
    return this.confluenceService.healthCheck();
  }

  /**
   * Get Confluence configuration
   * GET /api/confluence/config
   */
  @Get('config')
  @UseGuards(JwtAuthGuard)
  async getConfig() {
    return this.confluenceService.getConfig();
  }

  /**
   * Validate page access for authenticated user
   * GET /api/confluence/pages/:pageId/access
   */
  @Get('pages/:pageId/access')
  @UseGuards(JwtAuthGuard)
  async validatePageAccess(
    @Param('pageId') pageId: string,
    @Request() req: { user?: { id: string; email: string } },
  ) {
    if (!pageId) {
      throw new HttpException('Page ID is required', HttpStatus.BAD_REQUEST);
    }

    const userId = req.user?.id;
    if (!userId) {
      throw new HttpException('User not authenticated', HttpStatus.UNAUTHORIZED);
    }

    return this.confluenceService.validatePageAccess(pageId, userId);
  }

  /**
   * Get page metadata
   * GET /api/confluence/pages/:pageId
   */
  @Get('pages/:pageId')
  @UseGuards(JwtAuthGuard)
  async getPageMetadata(@Param('pageId') pageId: string) {
    if (!pageId) {
      throw new HttpException('Page ID is required', HttpStatus.BAD_REQUEST);
    }

    return this.confluenceService.getPageMetadata(pageId);
  }
}

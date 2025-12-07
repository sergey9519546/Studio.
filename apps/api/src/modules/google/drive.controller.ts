
import { Controller, Get } from '@nestjs/common';
import { DriveFileDTO, DriveService } from "./drive.service";
import { GoogleClientFactory } from './google-client.factory';

// In a real app, use @UseGuards(JwtAuthGuard)
@Controller({ path: "google/drive", version: "1" })
export class DriveController {
  constructor(
    private readonly driveService: DriveService,
    private readonly googleFactory: GoogleClientFactory
  ) {}

  @Get("team-assets")
  async getTeamAssets(): Promise<DriveFileDTO[]> {
    return await this.driveService.listTeamAssets();
  }

  @Get("status")
  getAuthStatus() {
    return this.googleFactory.getServiceAccountProfile();
  }
}

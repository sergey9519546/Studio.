
import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { DriveFileDTO, DriveService } from "./drive.service";
import { GoogleClientFactory } from './google-client.factory';

@Controller({ path: "google/drive", version: "1" })
@UseGuards(JwtAuthGuard)
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

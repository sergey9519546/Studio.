
import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { KnowledgeService } from './knowledge.service';

@Controller({ path: "knowledge", version: "1" })
export class KnowledgeController {
  constructor(private readonly knowledgeService: KnowledgeService) {}

  @Post("create-from-asset")
  async createFromAsset(
    @Body("projectId") projectId: string,
    @Body("assetId") assetId: string
  ) {
    return this.knowledgeService.createFromAsset(projectId, assetId);
  }

  @Get(":projectId")
  async findAll() {
    return this.knowledgeService.findAll();
  }

  @Delete(":id")
  async remove(@Param("id") id: string) {
    return this.knowledgeService.remove(id);
  }
}

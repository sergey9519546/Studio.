import { Body, Controller, DefaultValuePipe, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateProjectDto, UpdateProjectDto } from './dto/project.dto.js';
import { ProjectInput, ProjectsService } from './projects.service.js';
import { ProjectsImportService } from './projects.import.service.js';
import 'multer';

@Controller({ path: 'projects', version: '1' })
export class ProjectsController {
  constructor(
    private readonly projectsService: ProjectsService,
    private readonly projectsImportService: ProjectsImportService
  ) { }

  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(50), ParseIntPipe) limit: number
  ) {
    const safePage = page > 0 ? page : 1;
    const safeLimit = limit > 0 ? Math.min(limit, 200) : 50;
    return this.projectsService.findAll(safePage, safeLimit);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectsService.findOne(id);
  }

  @Post()
  create(@Body() createProjectDto: CreateProjectDto) {
    return this.projectsService.create(createProjectDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectsService.update(id, updateProjectDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectsService.remove(id);
  }

  @Post('batch-delete')
  removeBatch(@Body() ids: string[]) {
    return this.projectsService.removeBatch(ids);
  }

  @Post('batch')
  importBatch(@Body() items: ProjectInput[]) {
    return this.projectsService.importBatch(items);
  }

  @Post(':id/script-assist')
  scriptAssist(@Param('id') id: string, @Body('scriptText') scriptText: string) {
    return this.projectsService.scriptAssist(id, scriptText);
  }

  @Post('import')
  @UseInterceptors(FileInterceptor('file'))
  async importFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    const rawData = this.projectsImportService.parseFile(file.buffer, file.mimetype);
    const mappedData = await this.projectsImportService.analyzeAndMap(rawData);
    return this.projectsService.importBatch(mappedData);
  }
}

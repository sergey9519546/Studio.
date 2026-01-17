
import { Body, Controller, DefaultValuePipe, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateProjectDto, UpdateProjectDto } from './dto/project.dto.js';
import { ProjectInput, ProjectsService, type MulterFile } from './projects.service.js';

@Controller({ path: 'projects', version: '1' })
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) { }

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

  @Post('import')
  @UseInterceptors(FileInterceptor('file'))
  async importFromFile(
    @UploadedFile() file: MulterFile
  ) {
    return this.projectsService.importFromFile(file);
  }
}

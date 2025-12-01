
import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ProjectsService, ProjectInput } from './projects.service';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) { }

  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 50
  ) {
    return this.projectsService.findAll(Number(page), Number(limit));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectsService.findOne(id);
  }

  @Post()
  create(@Body() createDto: ProjectInput) {
    return this.projectsService.create(createDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDto: ProjectInput) {
    return this.projectsService.update(id, updateDto);
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
}

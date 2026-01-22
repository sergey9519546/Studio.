import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { CreateScriptDto, GenerateScriptDto, UpdateScriptDto } from './dto/script.dto.js';
import { ScriptsService } from './scripts.service.js';

@Controller({ path: 'scripts', version: '1' })
export class ScriptsController {
  constructor(private readonly scriptsService: ScriptsService) {}

  @Get()
  findAll(@Query('projectId') projectId?: string) {
    return this.scriptsService.findAll(projectId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.scriptsService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateScriptDto) {
    return this.scriptsService.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateScriptDto) {
    return this.scriptsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.scriptsService.remove(id);
  }

  @Post('generate')
  generate(@Body() dto: GenerateScriptDto) {
    return this.scriptsService.generate(dto);
  }
}

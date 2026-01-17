
import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FreelancersService, type MulterFile } from './freelancers.service.js';
import { CreateFreelancerDto, UpdateFreelancerDto, ImportFreelancerDto } from './dto/freelancer.dto.js';

@Controller({ path: 'freelancers', version: '1' })
export class FreelancersController {
  constructor(private readonly freelancersService: FreelancersService) { }

  @Get()
  findAll() {
    return this.freelancersService.findAll();
  }

  @Get('search')
  search(@Query('q') q = '', @Query('limit') limit?: string) {
    const take = limit ? Number(limit) : 10;
    return this.freelancersService.search(q, take);
  }

  @Get('suggested')
  suggested(@Query('limit') limit?: string) {
    const take = limit ? Number(limit) : 5;
    return this.freelancersService.suggested(take);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.freelancersService.findOne(id);
  }

  @Post()
  create(@Body() createFreelancerDto: CreateFreelancerDto) {
    return this.freelancersService.create(createFreelancerDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFreelancerDto: UpdateFreelancerDto) {
    return this.freelancersService.update(id, updateFreelancerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.freelancersService.remove(id);
  }

  @Post('batch')
  importBatch(@Body() items: ImportFreelancerDto[]) {
    return this.freelancersService.createBatch(items);
  }

  @Post('parse-cv')
  @UseInterceptors(FileInterceptor('file'))
  async parseCV(@UploadedFile() file: MulterFile) {
    return this.freelancersService.parseCVAndCreate(file);
  }
}

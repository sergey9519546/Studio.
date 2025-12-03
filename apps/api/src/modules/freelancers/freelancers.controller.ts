
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { FreelancersService } from './freelancers.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CreateFreelancerDto, UpdateFreelancerDto, ImportFreelancerDto } from './dto/freelancer.dto';

@Controller('freelancers')
@UseGuards(JwtAuthGuard)
export class FreelancersController {
  constructor(private readonly freelancersService: FreelancersService) { }

  @Get()
  findAll() {
    return this.freelancersService.findAll();
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
}


import {
  Body,
  Controller,
  Get,
  Injectable,
  Module,
  Param,
  Post,
} from "@nestjs/common";
import { PrismaModule } from "../../prisma/prisma.module.js";
import { PrismaService } from '../../prisma/prisma.service.js';
import { CreateScriptDto } from './dto/script.dto.js';

@Injectable()
export class ScriptsService {
  constructor(private prisma: PrismaService) { }
  async findAll() { return this.prisma.script.findMany(); }
  async create(dto: CreateScriptDto) {
    return this.prisma.script.create({ data: dto });
  }
  async findByProject(projectId: string) { return this.prisma.script.findMany({ where: { projectId } }); }
}

@Controller({ path: "scripts", version: "1" })
export class ScriptsController {
  constructor(private service: ScriptsService) {}
  @Get() findAll() {
    return this.service.findAll();
  }
  @Post() create(@Body() dto: CreateScriptDto) {
    return this.service.create(dto);
  }
  @Get("project/:projectId") findByProject(@Param("projectId") id: string) {
    return this.service.findByProject(id);
  }
}

@Module({
  imports: [PrismaModule],
  controllers: [ScriptsController],
  providers: [ScriptsService],
})
export class ScriptsModule { }

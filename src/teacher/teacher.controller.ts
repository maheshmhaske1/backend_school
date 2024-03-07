import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { TeacherService } from './teacher.service';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { TeacherLoginDto } from './dto/login-teacher.dto';

@Controller('teacher')
export class TeacherController {
  constructor(private readonly teacherService: TeacherService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() createTeacherDto: CreateTeacherDto) {
    return this.teacherService.create(createTeacherDto);
  }

  @Get()
  @UseGuards(AuthGuard)
  findAll() {
    return this.teacherService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: string) {
    return this.teacherService.findOne(id);
  }


  @Get('by-organization/:id')
  @UseGuards(AuthGuard)
  findByOrganizationId(@Param('id') id: string) {
    return this.teacherService.findByOrganizationId(id);
  }


  @Patch(':id')
  @UseGuards(AuthGuard)
  update(@Param('id') id: string, @Body() updateTeacherDto: UpdateTeacherDto) {
    return this.teacherService.update(id, updateTeacherDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string) {
    return this.teacherService.remove(id);
  }

  // Login Teacher
  @Post('login')
  async login(@Body() adminDto: TeacherLoginDto) {
    return this.teacherService.teacherLogin(adminDto);
  }
}

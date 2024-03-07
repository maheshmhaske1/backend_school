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
import { StudentService } from './student.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { StudentLoginDto } from './dto/login-student.dto';


@Controller('student')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() createStudentDto: CreateStudentDto) {
    return this.studentService.create(createStudentDto);
  }

  @Get()
  @UseGuards(AuthGuard)
  findAll() {
    return this.studentService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: string) {
    return this.studentService.findOne(id);
  }

  //findByOrganization
  @Get('/organization/:id')
  @UseGuards(AuthGuard)
  findByOrganization(@Param('id') id: string) {
    return this.studentService.findByOrganization(id);
  }

  
  // findByLevel
  @Get('/level/:id')
  @UseGuards(AuthGuard)
  findByLevel(@Param('id') id: string) {
    return this.studentService.findByLevel(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  update(@Param('id') id: string, @Body() updateStudentDto: UpdateStudentDto) {
    return this.studentService.update(id, updateStudentDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string) {
    return this.studentService.remove(id);
  }

  @Post('login')
  async login(@Body() adminDto: StudentLoginDto) {
    return this.studentService.studentLogin(adminDto);
  }
}

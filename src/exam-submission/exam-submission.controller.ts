import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ExamSubmissionService } from './exam-submission.service';
import { CreateExamSubmissionDto } from './dto/create-exam-submission.dto';
import { UpdateExamSubmissionDto } from './dto/update-exam-submission.dto';
import { AuthGuard } from 'src/auth/auth.guard';
// import { AuthGuard } from '@nestjs/passport';
  

@Controller('exam-submission')
export class ExamSubmissionController {
  constructor(private readonly examSubmissionService: ExamSubmissionService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() body) {
    return this.examSubmissionService.create(body);
  }

  @Get()
  findAll() {
    return this.examSubmissionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.examSubmissionService.findOne(id);
  }

  @Get('/by-examination-id/:id')
  @UseGuards(AuthGuard)
  findByExaminationId(@Param('id') id: string) {
    return this.examSubmissionService.findByExaminationId(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateExamSubmissionDto: UpdateExamSubmissionDto) {
    return this.examSubmissionService.update(+id, updateExamSubmissionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.examSubmissionService.remove(+id);
  }
}

import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ExamService } from './exam.service';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateExamStudentDto } from './dto/create-exam-student.dto';
import { CreateExamQuestiontDto } from './dto/create-exam-question.dto';



@Controller('exam')
export class ExamController {
  constructor(private readonly examService: ExamService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() createExamDto: CreateExamDto) {
    return this.examService.create(createExamDto);
  }

  @Get()
  @UseGuards(AuthGuard)
  findAll() {
    return this.examService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: string) {
    return this.examService.findOne(id);
  }

  @Get('by-organization-id/:id')
  @UseGuards(AuthGuard)
  findByOrganizationId(@Param('id') id: string) {
    return this.examService.findByOrganizationId(id);
  }

  @Post('by-organization-level')
  @UseGuards(AuthGuard)
  findByOrganizationLevel(@Body() body) {
    return this.examService.findByOrganizationLevel(body);
  }
  
  @Patch(':id')
  @UseGuards(AuthGuard)
  update(@Param('id') id: string, @Body() updateExamDto: UpdateExamDto) {
    return this.examService.update(id, updateExamDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string) {
    return this.examService.remove(id);
  }

  @Post("/add-exam-student")
  @UseGuards(AuthGuard)
  addExamStudent(@Body() CreateExamStudentDto: CreateExamStudentDto) {
    return this.examService.addExamStudent(CreateExamStudentDto);
  }

  @Get('/get-exam-student-by-exam-id/:id')
  @UseGuards(AuthGuard)
  getExamStudentByExamId(@Param('id') id: string) {
    return this.examService.getExamStudentByExamId(id);
  }

  //getExamStudentById
  @Get('/get-exam-student-by-id/:id')
  @UseGuards(AuthGuard)
  getExamStudentById(@Param('id') id: string) {
    return this.examService.getExamStudentById(id);
  }

  @Post('/get-exam-student-id')
  @UseGuards(AuthGuard)
  getExamByStudentId(@Body() body ){
    return this.examService.getExamByStudentId(body);
  }
 

  @Delete('/removed-student-from-exam/:id')
  @UseGuards(AuthGuard)
  removeStudentFromExam(@Param('id') id: string) {
    return this.examService.removeStudentFromExam(id);
  }

  @Post("/add-exam-question")
  @UseGuards(AuthGuard)
  addExamQuestion(@Body() CreateExamQuestionDto: CreateExamQuestiontDto) {
    return this.examService.addExamQuestion(CreateExamQuestionDto);
  }


  @Get('/get-exam-qestion-by-exam-id/:id')
  @UseGuards(AuthGuard)
  getExamQuestionByExamId(@Param('id') id: string) {
    return this.examService.getExamQuestiontByExamId(id);
  }

  @Get('/get-exam-practice-question-by-exam-id/:id')
  @UseGuards(AuthGuard)
  getExamPracticeQuestionByExamId(@Param('id') id: string) {
    return this.examService.getExamPracticeQuestionByExamId(id);
  }

  @Delete('/removed-question-from-exam/:id')
  @UseGuards(AuthGuard)
  removeQuestionFromExam(@Param('id') id: string) {
    return this.examService.removeQuestionFromExam(id);
  }

   //findByStudentNotExit
   @Post('/organization-student-not-exit')
   @UseGuards(AuthGuard)
   findStudentByOrganizationForExamNotExist(@Body() data) {
     return this.examService.findStudentByOrganizationForExamNotExist(data);
   }

   //findByStudentNotExit
   @Post('/question-not-exit')
   @UseGuards(AuthGuard)
   findQuestionForExamNotExist(@Body() data) {
     return this.examService.findQuestionForExamNotExist(data);
   }

   @Get('/schedule-exam/:id')
   @UseGuards(AuthGuard)
   scheduleExam(@Param('id') id: string) {
     return this.examService.scheduleExam(id);
   }

   //updateStudentData
   @Post('/update-student-data')
   @UseGuards(AuthGuard)
   updateStudentData(@Body() data) {
     return this.examService.updateStudentData(data);
   }

   //updateStudentCertificate
   @Post('/update-student-certificate')
   @UseGuards(AuthGuard)
   updateStudentCertificate(@Body() data) {
     return this.examService.updateStudentCertificate(data);
   }
  
   //updateStudentCertificateGenerate
   @Get('/update-student-certificate-generate/:id')
   @UseGuards(AuthGuard)
   updateStudentCertificateGenerate(@Param('id') id: string) {
     return this.examService.updateStudentCertificateGenerate(id);
   }

   //recentOrganizations
   @Get("recent/dashboard")
   @UseGuards(AuthGuard)
   recentData() {
     return this.examService.recentData();
   }


}

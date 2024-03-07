import { Module } from '@nestjs/common';
import { ExamService } from './exam.service';
import { ExamController } from './exam.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Exam, ExamSchema } from './entities/exam.entity';
import { ExamStudent, ExamStudentSchema, } from './entities/exam-student';
import { Student, StudentSchema } from 'src/student/entities/student.entity';
import { ExamQuestionSchema, ExamQuestions } from './entities/exam-question';
import { Question, QuestionSchema } from 'src/question/entities/question.entity';
import { Organization, OrganizationSchema } from 'src/organization/entities/organization.entity';
import { Teacher, TeacherSchema } from 'src/teacher/entities/teacher.entity';



@Module({
  imports:[ MongooseModule.forFeature([{ name: Exam.name, schema: ExamSchema }]),MongooseModule.forFeature([{ name: ExamStudent.name, schema: ExamStudentSchema }],),MongooseModule.forFeature([{ name: Student.name, schema: StudentSchema }]),MongooseModule.forFeature([{ name: ExamQuestions.name, schema: ExamQuestionSchema }]),MongooseModule.forFeature([{ name: Question.name, schema: QuestionSchema }]), MongooseModule.forFeature([{ name: Organization.name, schema: OrganizationSchema }]), MongooseModule.forFeature([{ name: Teacher.name, schema: TeacherSchema }])],
  controllers: [ExamController],
  providers: [ExamService],
})
export class ExamModule {}

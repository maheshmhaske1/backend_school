import { Module } from '@nestjs/common';
import { ExamSubmissionService } from './exam-submission.service';
import { ExamSubmissionController } from './exam-submission.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ExamQuestions, ExamQuestionSchema } from 'src/exam/entities/exam-question';
import { ExamStudent, ExamStudentSchema } from 'src/exam/entities/exam-student';
import { Exam, ExamSchema } from 'src/exam/entities/exam.entity';
import { Question, QuestionSchema } from 'src/question/entities/question.entity';
import { Student, StudentSchema } from 'src/student/entities/student.entity';
import { ExamSubmission, ExamSubmissionSchema } from './entities/exam-submission.entity';


@Module({
  imports:[ MongooseModule.forFeature([{ name: Exam.name, schema: ExamSchema }]),MongooseModule.forFeature([{ name: ExamStudent.name, schema: ExamStudentSchema }],),MongooseModule.forFeature([{ name: Student.name, schema: StudentSchema }]),MongooseModule.forFeature([{ name: ExamQuestions.name, schema: ExamQuestionSchema }]),MongooseModule.forFeature([{ name: Question.name, schema: QuestionSchema }]), MongooseModule.forFeature([{ name: ExamSubmission.name, schema: ExamSubmissionSchema }])],
  controllers: [ExamSubmissionController],
  providers: [ExamSubmissionService],
})
export class ExamSubmissionModule {}

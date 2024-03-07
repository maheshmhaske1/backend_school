import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';
import { Exam } from './exam.entity';
import { Student } from 'src/student/entities/student.entity';


@Schema({ timestamps: true }) 
export class ExamStudent extends Document {

  @Prop({default:""})
  exam_certificate: string;

  @Prop({default: 0})
  exam_score: number;

  @Prop({default: 0})
  total_questions: number;

  @Prop({default: 0})
  wrong_questions: number;

  @Prop({default: 0})
  correct_questions: number;

  @Prop({ default: true }) 
  status: boolean;



  @Prop({ default: false }) 
  is_completed: boolean;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'exams' , default: null })
  exam_id: Exam;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'students' })
  student_id: Student;

}

export const ExamStudentSchema = SchemaFactory.createForClass(ExamStudent);

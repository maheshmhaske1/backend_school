import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';
import { Exam } from './exam.entity';
import { Question } from 'src/question/entities/question.entity';

@Schema({ timestamps: true }) 
export class ExamQuestions extends Document {

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'exams' , default: null })
  exam_id: Exam;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'questions', default:null })
  question_id: Question;

  @Prop({ default: true }) 
  status: boolean;

}

export const ExamQuestionSchema = SchemaFactory.createForClass(ExamQuestions);

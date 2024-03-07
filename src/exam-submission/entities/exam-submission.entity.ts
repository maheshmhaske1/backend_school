import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';
import { ExamStudent } from 'src/exam/entities/exam-student';
import { Exam } from 'src/exam/entities/exam.entity';
import { Level } from 'src/levels/entities/level.entity';
import { Organization } from 'src/organization/entities/organization.entity';
import { Question } from 'src/question/entities/question.entity';

@Schema({ timestamps: true })
export class ExamSubmission {

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'exams', default: null })
    exam_id: Exam;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Organization' })
    organization_id: Organization;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'examstudents', default: null })
    examination_id: ExamStudent;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'levels' })
    level_id: Level;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'questions', default: null })
    question_id: Question;

    @Prop({ default: false })
    is_question_answer_right: boolean;


    @Prop({ type: [{ name: String, status: { type: Boolean, default: true }, _id: false, is_answer: { type: Boolean, default: false }, is_true: { type: Boolean, default: false } }], required: true })
    options: { name: string; status: boolean }[];

    @Prop({ default: true })
    status: boolean;

}


export const ExamSubmissionSchema = SchemaFactory.createForClass(ExamSubmission);
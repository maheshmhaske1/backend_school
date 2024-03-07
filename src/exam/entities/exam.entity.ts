import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';
import { Admin } from 'src/admin-user/model/admin-user.model';
import { Level } from 'src/levels/entities/level.entity';
import { Organization } from 'src/organization/entities/organization.entity';
import { Teacher } from 'src/teacher/entities/teacher.entity';

@Schema({ timestamps: true }) 
export class Exam extends Document {

  @Prop({})
  exam_name: string;

  @Prop({ default: true }) 
  status: boolean;

  @Prop({ default: false }) 
  is_completed: boolean;

  @Prop({ default: false }) 
  is_schedule: boolean;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'admins' , default: null })
  created_by: Admin;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Organization' })
  organization_id: Organization;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'teachers', default: null  })
  teacher_id: Teacher;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'levels' })
  level_id: Level;

  @Prop({ type: Date }) 
  examDateTime: Date;

  @Prop({ type: Date }) 
  examEndDateTime: Date;

  @Prop({ default: false }) 
  exam_status: boolean;

  @Prop({ default: "1H" }) 
  exam_duration: string

  @Prop({ default: false }) 
  is_generated: boolean;

  @Prop({ default: 0 }) 
  total_marks: number;

  

}

export const ExamSchema = SchemaFactory.createForClass(Exam);

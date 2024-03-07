import mongoose, { Document, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Organization } from 'src/organization/entities/organization.entity';
import { Level } from 'src/levels/entities/level.entity';
import { Teacher } from 'src/teacher/entities/teacher.entity';
import { Admin } from 'src/admin-user/model/admin-user.model';


@Schema({ collection: 'students', timestamps: true })
export class Student extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  roll_no: number;

  @Prop({ required: true })
  created_type: string;

  @Prop({ required: true })
  mobile_number: string;

  @Prop({ required: true, default: "" })
  email: string;

  @Prop({select: false})
  password: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Organization' })
  organization_id: Organization;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'levels' })
  level_id: Level;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'teachers', default: null  })
  teacher_id: Teacher;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'admins' , default: null })
  admin_id: Admin;

  @Prop({ default: true })
  status: boolean;
}

export const StudentSchema = SchemaFactory.createForClass(Student);

import mongoose, { Document, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Admin } from 'src/admin-user/model/admin-user.model';
import { Level } from 'src/levels/entities/level.entity';

@Schema({ collection: 'questions', timestamps: true })
export class Question extends Document {
  @Prop({ required: true })
  question: string;

  @Prop({ required: true })
  is_type: string;

  @Prop({ default:"" })
  img_url: string;

  @Prop({ type: [{ name: String, status: { type: Boolean, default: true }, _id: false, is_true: { type: Boolean, default: false } }], required: true })
  options: { name: string; status: boolean }[];

  @Prop({ required: true })
  answer: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'levels' })
  level_id: Level;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'admins' , default: null })
  created_by: Admin;

  @Prop({ default: false })
  is_final: boolean;

  @Prop({ default: true })
  status: boolean;


}



export const QuestionSchema = SchemaFactory.createForClass(Question);
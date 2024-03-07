import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose'; // Import Types from mongoose

@Schema({ timestamps: true }) 
export class Teacher extends Document {

  @Prop({ required: true })
  name: string;

  @Prop()
  email: string;

  @Prop()
  mobile_number: string;

  @Prop({select: false})
  password: string;

  @Prop({ default: true }) 
  status: boolean;

  @Prop({ default: "" }) 
  is_type: string;

  // Add a reference to the Organization ID
  @Prop({ type: Types.ObjectId, ref: 'Organization' })
  organization_id: Types.ObjectId;
}


export const TeacherSchema = SchemaFactory.createForClass(Teacher);


// model/admin-user.model.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true }) // Add timestamps option for created_at
export class Admin extends Document {

  
  @Prop({ default: "Admin User" })
  admin_name: string;

  @Prop()
  number: string;

  @Prop()
  email: string;

  @Prop({ required: true })
  username: string;

  @Prop({ required: true, select: false })
  password: string;

  @Prop({ default: true }) // Default status to true
  status: boolean;

  @Prop({ default: "Admin" }) // Default status to Admin
  is_type: string;

  
}

export const AdminSchema = SchemaFactory.createForClass(Admin);

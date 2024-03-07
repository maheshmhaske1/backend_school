
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true }) 
export class Organization extends Document {

  @Prop({ required: true })
  name: string;

  @Prop()
  address: string;

  @Prop()
  email: string;

  @Prop()
  mobile_number: string;

  @Prop({ default: "" })
  logo_url: string;

  @Prop({ default: true }) 
  status: boolean;

  @Prop({ default: "" }) 
  is_type: string;

  
}

export const OrganizationSchema = SchemaFactory.createForClass(Organization);
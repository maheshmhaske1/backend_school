import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ collection: 'levels', timestamps: true })
export class Level extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop()
  imgUrl: string;

  @Prop({ default: true })
  status: boolean;
}


export const LevelSchema = SchemaFactory.createForClass(Level);

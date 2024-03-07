import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Types } from 'mongoose';

export class CreateQuestionDto {
  @IsString()
  @IsNotEmpty()
  question?: string;

  @IsBoolean()
  @IsOptional()
  status?: boolean;

  @IsBoolean()
  @IsOptional()
  is_final?: boolean;

  @IsString()
  @IsNotEmpty()
  is_type?: string;

  @IsString()
  @IsOptional()
  img_url?: string;

  @IsArray()
  @IsNotEmpty()
  options?: [{ name: string; status: boolean, is_true: boolean }];
  
  @IsString()
  @IsNotEmpty()
  level_id?: Types.ObjectId; // Use Types.ObjectId instead of string

  @IsString()
  @IsNotEmpty()
  created_by?: Types.ObjectId; // Use Types.ObjectId instead of string


}

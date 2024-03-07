import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Types } from 'mongoose';

export class CreateExamDto {
  @IsString()
  @IsNotEmpty()
  exam_name?: string;

  @IsBoolean()
  @IsOptional()
  status?: boolean;

  

  @IsBoolean()
  @IsOptional()
  is_completed?: boolean;

  @IsBoolean()
  @IsOptional()
  is_schedule?: boolean;

  @IsNumber()
  @IsOptional()
  total_marks?: number;

  @IsString()
  @IsNotEmpty()
  organization_id?: Types.ObjectId; // Use Types.ObjectId instead of string

  @IsString()
  @IsNotEmpty()
  level_id?: Types.ObjectId; // Use Types.ObjectId instead of string

  @IsString()
  @IsNotEmpty()
  teacher_id?: Types.ObjectId; // Use Types.ObjectId instead of string

  @IsString()
  @IsOptional()
  created_by?: Types.ObjectId; // Use Types.ObjectId instead of string

  @IsNotEmpty()
  examDateTime?: Date;

  @IsNotEmpty()
  examEndDateTime?: Date;
}

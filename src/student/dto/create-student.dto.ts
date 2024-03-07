import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class CreateStudentDto {
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsBoolean()
  @IsOptional()
  status?: boolean;

  @IsString()
  @IsOptional()
  mobile_number?: string;

  @IsString()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  password?: string;

  @IsNumber()
  @IsNotEmpty()
  roll_no?: number;

  @IsString()
  @IsNotEmpty()
  created_type?: string;

  @IsString()
  @IsNotEmpty()
  organization_id?: Types.ObjectId; // Use Types.ObjectId instead of string

  @IsString()
  @IsNotEmpty()
  level_id?: Types.ObjectId; // Use Types.ObjectId instead of string

  @IsString()
  @IsOptional()
  teacher_id?: Types.ObjectId; // Use Types.ObjectId instead of string

  @IsString()
  @IsOptional()
  admin_id?: Types.ObjectId; // Use Types.ObjectId instead of string

  @IsString()
  @IsNotEmpty()
  created_id?: Types.ObjectId; // Use Types.ObjectId instead of string
}

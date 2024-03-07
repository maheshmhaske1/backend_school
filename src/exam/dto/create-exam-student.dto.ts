import {
    IsBoolean,
    IsDate,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
} from 'class-validator';
import { Types } from 'mongoose';

export class CreateExamStudentDto {
    @IsString()
    @IsOptional()
    exam_certificate?: string;

    @IsBoolean()
    @IsOptional()
    status?: boolean;

    @IsBoolean()
    @IsOptional()
    is_completed?: boolean;

    @IsString()
    @IsNotEmpty()
    exam_id?: Types.ObjectId; // Use Types.ObjectId instead of string

    @IsString()
    @IsNotEmpty()
    student_id?: Types.ObjectId; // Use Types.ObjectId instead of string

    @IsNumber()
    @IsOptional()
    exam_score?: number;
   
}

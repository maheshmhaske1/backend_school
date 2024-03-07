import {
    IsBoolean,
    IsDate,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
} from 'class-validator';
import { Types } from 'mongoose';

export class CreateExamQuestiontDto {
   
    @IsBoolean()
    @IsOptional()
    status?: boolean;

    @IsString()
    @IsNotEmpty()
    exam_id?: Types.ObjectId; // Use Types.ObjectId instead of string

    @IsString()
    @IsNotEmpty()
    question_id?: Types.ObjectId; // Use Types.ObjectId instead of string
   
}

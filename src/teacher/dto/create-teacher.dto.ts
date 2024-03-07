
import { IsString, IsNotEmpty, IsEmail, IsBoolean, IsOptional } from 'class-validator';

export class CreateTeacherDto {

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
    is_type?: string;

    @IsString()
    @IsOptional()
    password?: string;

    @IsEmail()
    @IsOptional()
    email?: string;

    @IsString()
    @IsNotEmpty()
    organization_id: string;

}

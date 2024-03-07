// admin-register.dto.ts
import { IsString, IsNotEmpty, IsEmail, IsBoolean, IsOptional } from 'class-validator';

export class AdminRegisterDto {

    @IsString()
    @IsNotEmpty()
    admin_name?: string;

    @IsString()
    @IsNotEmpty()
    username: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsBoolean()
    @IsOptional()
    status?: boolean;

    @IsBoolean()
    @IsOptional()
    is_mobile?: boolean;

    @IsString()
    @IsOptional()
    number?: string;

    @IsEmail()
    @IsOptional()
    email?: string;


}

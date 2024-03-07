
import { IsString, IsNotEmpty, IsEmail, IsBoolean, IsOptional } from 'class-validator';

export class CreateOrganizationDto {

    @IsString()
    @IsNotEmpty()
    name?: string;

    @IsString()
    @IsNotEmpty()
    address: string;

    @IsBoolean()
    @IsOptional()
    status?: boolean;

    @IsString()
    @IsOptional()
    mobile_number?: string;

    @IsString()
    @IsOptional()
    logo_url?: string;

    @IsString()
    @IsOptional()
    is_type?: string;

    @IsEmail()
    @IsOptional()
    email?: string;


}

// admin-login.dto.ts
import { IsString, IsNotEmpty } from 'class-validator';

export class TeacherLoginDto {
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

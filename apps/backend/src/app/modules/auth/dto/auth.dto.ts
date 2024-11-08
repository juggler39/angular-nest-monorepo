import { IsEmail, IsString } from 'class-validator';

export class AuthDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  deviceId: string; // Добавлено поле deviceId
}


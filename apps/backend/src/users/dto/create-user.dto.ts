import { IsEmail, IsStrongPassword } from 'class-validator'
export class CreateUserDto {
  name?: string;
  @IsEmail()
  email: string;
  @IsStrongPassword()
  password: string;
  refreshToken?: string;
}

import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';
import { Expose } from 'class-transformer';


export class LoginDto {
  @IsEmail({}, { message: 'Invalid email format' })
  @Expose()
  email!: string;

  @IsString({ message: 'Password must be a string' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Expose()
  password!: string;
}
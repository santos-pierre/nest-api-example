import { Transform, TransformFnParams } from 'class-transformer';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginUserDto {
  @IsNotEmpty()
  @IsEmail()
  @Transform(({ value }: TransformFnParams) => value.toLowerCase())
  email: string;

  @IsNotEmpty()
  password: string;
}

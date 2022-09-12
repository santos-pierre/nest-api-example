import { Transform, TransformFnParams } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @Length(2, 255)
  @Transform(({ value }: TransformFnParams) => value.trim())
  name: string;

  @IsNotEmpty()
  @Length(1, 255)
  @Transform(({ value }: TransformFnParams) => value.toLowerCase())
  @Transform(({ value }: TransformFnParams) => value.trim())
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @Length(8, 64)
  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W]).+$/, {
    message: 'Your password is too weak',
  })
  password: string;
}

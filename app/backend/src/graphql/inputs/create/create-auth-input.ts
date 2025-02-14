import { InputType, Field } from 'type-graphql';
import { Length, IsEmail, IsStrongPassword } from 'class-validator';

@InputType()
export class CreateUserInput {
  @Field()
  @IsEmail({}, { message: 'The email must be valid.' })
  email!: string;

  @Field()
  @Length(6, 255, { message: 'The password must contain between 6 and 255 characters.' })
  @IsStrongPassword({ minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 }, { message: 'The password must contain at least 8 characters, 1 uppercase letter, 1 lowercase letter, 1 number, and 1 symbol.' })
  password!: string;
}
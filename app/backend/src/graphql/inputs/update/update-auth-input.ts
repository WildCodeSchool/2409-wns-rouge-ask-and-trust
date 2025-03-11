import { InputType, Field } from 'type-graphql';
import { Length, IsEmail, IsOptional } from 'class-validator';

@InputType()
export class UpdateUserInput {
  @Field({ nullable: true })
  @IsEmail({}, { message: 'The email must be valid.' })
  @IsOptional()
  email?: string;

  @Field({ nullable: true })
  @Length(6, 255, { message: 'The password must contain between 6 and 255 characters.' })
  @IsOptional()
  password?: string;
}
import { Field, InputType, ObjectType, OmitType, PartialType } from '@nestjs/graphql';
import { UserBase } from '../interfaces/user.base';

@ObjectType('User')
export class UserOutput implements UserBase {
  @Field(() => String)
  username!: string;

  @Field(() => String)
  email!: string;
}

@ObjectType('LoginUser')
export class LoginUserOutput {
  @Field(() => String, { nullable: false })
  token!: string;

  @Field(() => UserOutput)
  user!: UserOutput;
}

@InputType()
export class LoginUserInput implements UserBase {
  @Field(() => String)
  username!: string;

  @Field(() => String)
  password!: string;
}

@InputType()
export class CreateUserInput implements UserBase {
  @Field(() => String)
  username!: string;

  @Field(() => String)
  email!: string;

  @Field(() => String)
  password!: string;
}

@InputType()
export class DeleteUserInput extends PartialType(OmitType(CreateUserInput, ['password'])) {}

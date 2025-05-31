import { NotFoundException, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { Status } from '../enums/status.enum';
import { UserModel } from '../database/user.schema';
import { User } from '../decorators/user.decorator';
import { UserService } from '../service/user.service';
import { AuthService } from '../auth/auth.service';
import { CreateUserInput, DeleteUserInput, LoginUserInput, LoginUserOutput, UserOutput } from './user.gql';

@Resolver(() => UserOutput)
export class UserResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Query(() => [UserOutput])
  async users() {
    return this.userService.find();
  }

  @Query(() => UserOutput)
  async username(@Args('name', { type: () => String }) username: string) {
    const data = await this.userService.findOne({ username });
    if (!data) {
      throw new NotFoundException();
    }
    return data;
  }

  @Mutation(() => LoginUserOutput)
  async login(@Args('user', { type: () => LoginUserInput }) user: LoginUserInput) {
    const loginResult = await this.authService.login(user);
    return loginResult;
  }

  @Query(() => UserOutput)
  @UseGuards(JwtAuthGuard)
  async whoami(@User() user: UserModel) {
    const { username } = user;
    const data = await this.userService.findOne({ username });
    if (!data) {
      throw new NotFoundException();
    }
    return data;
  }

  @Mutation(() => UserOutput)
  @UseGuards(JwtAuthGuard)
  async createUser(@Args('user', { type: () => CreateUserInput }) user: CreateUserInput) {
    return this.userService.create(user);
  }

  @Mutation(() => Status)
  @UseGuards(JwtAuthGuard)
  async deleteUser(@Args('user', { type: () => DeleteUserInput }) user: DeleteUserInput) {
    return this.userService.delete(user);
  }
}

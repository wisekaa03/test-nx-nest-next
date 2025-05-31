import { createHmac } from 'node:crypto';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { UserModel } from '../database/user.schema';
import { CreateUserInput, DeleteUserInput, UserOutput, LoginUserInput } from '../gql/user.gql';
import { Status } from '../enums/status.enum';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(UserModel.name)
    private readonly userModel: Model<UserModel>,
  ) {}

  async find(): Promise<UserModel[]> {
    return this.userModel.find().exec();
  }

  async findOne(userToFind: Partial<LoginUserInput>): Promise<UserModel | null> {
    return this.userModel.findOne(userToFind).exec();
  }

  async create(userInput: CreateUserInput): Promise<UserOutput> {
    const { username, password, email } = userInput;

    const userInDb = await this.userModel.findOne({ username }).exec();
    if (userInDb) {
      throw new BadRequestException();
    }

    const user: UserModel = new this.userModel({
      username,
      password: createHmac('sha256', password.normalize()).digest('hex'),
      email,
    });

    return user.save();
  }

  async delete(userInput: Partial<DeleteUserInput>): Promise<Status> {
    if (!userInput.email && !userInput.username) {
      throw new BadRequestException();
    }
    const user = await this.userModel.findOne(userInput).exec();
    if (!user) {
      throw new NotFoundException();
    }

    const deleteResult = await user.deleteOne().exec();
    if (deleteResult.deletedCount === 0) {
      return Status.ERROR;
    }

    return Status.OK;
  }
}

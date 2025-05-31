import { createHmac } from 'node:crypto';
import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';

import { JWT_BASE_OPTIONS } from '../interfaces/jwt.payload';
import { UserModel } from '../database/user.schema';
import { LoginUserOutput, LoginUserInput } from '../gql/user.gql';
import { UserService } from '../service/user.service';

@Injectable()
export class AuthService {
  private accessTokenExpires: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {
    this.accessTokenExpires = this.configService.getOrThrow('jwt.access.expires');
  }

  async login({ username, password }: LoginUserInput): Promise<LoginUserOutput> {
    const user = await this.validateUser(username);
    const valid = AuthService.validateCredentials(user.password, password);
    if (!valid) {
      throw new ForbiddenException();
    }
    const token = await this.generateAccessToken(user);
    return {
      token,
      user: {
        username: user.username,
        email: user.email,
      },
    };
  }

  async validateUser(username: string): Promise<UserModel> {
    const user = await this.userService.findOne({ username });
    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }

  async generateAccessToken(user: UserModel): Promise<string> {
    const opts: JwtSignOptions = {
      ...JWT_BASE_OPTIONS,
      subject: String(user.username),
      expiresIn: this.accessTokenExpires,
    };

    return this.jwtService.signAsync({ name: user.username }, opts);
  }

  static validateCredentials(passwordToCheck: string, password: string): boolean {
    const passwordSha256 = createHmac('sha256', password.normalize()).digest('hex');
    return passwordSha256 === passwordToCheck;
  }
}

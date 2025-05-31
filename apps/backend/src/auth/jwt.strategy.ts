import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';

import { UserModel } from '../database/user.schema';
import { JwtPayloadTest } from '../interfaces/jwt.payload';
import { AuthService } from './auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    const secretOrKey = configService.getOrThrow<string>('jwt.access.token');
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey,
    });
  }

  async validate({ sub: username }: JwtPayloadTest): Promise<UserModel | null> {
    if (!username) {
      return null;
    }

    return this.authService.validateUser(username);
  }
}

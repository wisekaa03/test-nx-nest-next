import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { AuthService } from './auth.service';
import { ServiceModule } from '../service/service.module';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        secret: configService.getOrThrow('jwt.access.token'),
        signOptions: {
          algorithm: 'HS256',
          expiresIn: configService.getOrThrow('jwt.access.expires'),
        },
      }),
      inject: [ConfigService],
    }),
    PassportModule,
    ServiceModule,
  ],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}

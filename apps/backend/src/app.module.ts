import { readFileSync } from 'node:fs';
import * as yaml from 'js-yaml';
import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { ConfigFactory, ConfigModule, ConfigService } from '@nestjs/config';

import { LoggerModuleOptions } from './utils/logger-module-options';
import { AuthModule } from './auth/auth.module';
import { ServiceModule } from './service/service.module';
import { DatabaseModule } from './database/database.module';
import { GqlModule } from './gql/gql.module';

const CONFIG_FILENAME = 'config.yaml';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [() => yaml.load(readFileSync(CONFIG_FILENAME, 'utf8')) as ConfigFactory],
    }),

    LoggerModule.forRootAsync({ useFactory: LoggerModuleOptions, inject: [ConfigService] }),

    AuthModule,
    DatabaseModule,
    ServiceModule,
    GqlModule,
  ],
})
export class AppModule {}

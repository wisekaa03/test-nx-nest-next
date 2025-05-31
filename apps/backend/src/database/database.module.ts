import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { UserModel, UserSchema } from './user.schema';
import { MongoDbModuleOptions } from '../utils/mongo-module-options';

@Module({
  imports: [
    MongooseModule.forRootAsync({ useFactory: MongoDbModuleOptions, inject: [ConfigService] }),
    MongooseModule.forFeature([{ name: UserModel.name, schema: UserSchema }]),
  ],
  exports: [MongooseModule],
})
export class DatabaseModule {}

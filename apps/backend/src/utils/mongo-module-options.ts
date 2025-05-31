import { ConfigService } from '@nestjs/config';
import { MongooseModuleOptions } from '@nestjs/mongoose';

export const MongoDbModuleOptions = async (configService: ConfigService): Promise<MongooseModuleOptions> => {
  return {
    uri: configService.getOrThrow('mongodb.uri'),
  };
};

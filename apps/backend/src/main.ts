import { NestFactory } from '@nestjs/core';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';
import { AppModule } from './app.module';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter(), {
    bufferLogs: false,
    autoFlushLogs: false,
  });

  const logger = app.get(Logger);
  app.useLogger(logger);
  app.flushLogs();

  const configService = app.get(ConfigService);
  const port = configService.get<number>('port', 3000);

  app.useGlobalInterceptors(new LoggerErrorInterceptor());

  await app.listen(port, '0.0.0.0');
  logger.log(`🚀 Application is running on: http://0.0.0.0:${port}/`);
}

bootstrap();

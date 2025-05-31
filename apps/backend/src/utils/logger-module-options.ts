import { ConfigService } from '@nestjs/config';
import type { ClientOptions as ElasticClientOptions } from '@elastic/elasticsearch';
import type { PrettyOptions } from 'pino-pretty';
import type pino from 'pino';
import type { LevelWithSilent } from 'pino';
import 'pino-elasticsearch';
import { Params as NestPinoParams } from 'nestjs-pino';

export const LoggerModuleOptions = async (configService: ConfigService): Promise<NestPinoParams> => {
  const targets: pino.TransportTargetOptions[] = [];

  // Pretty-print
  const prettyPrint: pino.TransportTargetOptions<PrettyOptions> = {
    target: process.env.NODE_ENV === 'test' ? 'pino-pretty' : `${__dirname}/pino-pretty.js`,
    options: {
      colorize: process.env.NODE_ENV !== 'production',
      translateTime: 'SYS:yyyy-mm-dd HH:MM:ss',
      singleLine: true,
      ignore: 'pid,hostname',
    },
    level: configService.getOrThrow<LevelWithSilent>('log.level'),
  };
  targets.push(prettyPrint);

  // TODO: add support for pino-elasticsearch
  const kibanaHost = configService.get<string>('kibana.host');
  if (kibanaHost) {
    const kibana: pino.TransportTargetOptions<ElasticClientOptions> = {
      target: 'pino-elasticsearch',
      options: {
        node: kibanaHost,
        compression: true,
      },
      level: configService.get<LevelWithSilent>('log.level', 'debug'),
    };
    targets.push(kibana);
  }

  return {
    pinoHttp: {
      level: configService.get<LevelWithSilent>('log.level', 'debug'),
      transport: { targets },
      autoLogging: false,
    },
  };
};

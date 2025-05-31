import { join as pathJoin } from 'node:path';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

import { AuthModule } from '../auth/auth.module';
import { ServiceModule } from '../service/service.module';
import { UserResolver } from './user.resolver';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      graphiql: true,
      autoSchemaFile: pathJoin(process.cwd(), 'schema.gql'),
      sortSchema: true,
      context: async ({ req, res }: { req: any; res: any }) => ({ req, res }),
    }),

    AuthModule,
    ServiceModule,
  ],
  providers: [UserResolver],
})
export class GqlModule {}

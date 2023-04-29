import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { MessagesModule } from './messages/messages.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { dataSourceOptions } from './db/data-source';
import { AuthModule } from './auth/auth.module';
import { ApiTokenCheckMiddleware } from './middleware/auth.middleware';

@Module({
  imports: [UsersModule, MessagesModule, AuthModule,
    ConfigModule.forRoot({
      isGlobal:true,
      envFilePath: ['.env'],
    }),
    TypeOrmModule.forRoot(
    dataSourceOptions
    )],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ApiTokenCheckMiddleware)
      .exclude(
        { path: 'auth/registration', method: RequestMethod.POST },
        { path: 'auth/login', method: RequestMethod.POST },
        { path: 'auth/activate/:link', method: RequestMethod.GET },
      )
      .forRoutes('*');
  }
  
}


import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { MessagesModule } from './messages/messages.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
// import { dataSourceOptions } from './db/data-source';
import { AuthModule } from './auth/auth.module';
import { ApiTokenCheckMiddleware } from './middleware/auth.middleware';
import { UsersController } from './users/users.controller';

@Module({
  imports: [UsersModule, MessagesModule, AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(
      {
        type:"postgres",
        host:process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        username: process.env.DB_USERNAME,
        password: String(process.env.DB_PASSWORD),
        database: process.env.DB_DATABASE,
        synchronize: true,
        entities: ['dist/**/*.entity.js'],
        migrations: ['dist/db/migrations/*.js'],
    }
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
      )
      .forRoutes('*');
  }
  
}


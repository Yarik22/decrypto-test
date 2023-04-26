import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Token } from './entities/token.entity';
import { UsersModule } from 'src/users/users.module';
import { AuthController } from './auth.controller';
import { MailsModule } from 'src/mails/mails.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports:[
    TypeOrmModule.forFeature([Token]),
    JwtModule,
    MailsModule,
    forwardRef(()=>UsersModule),
  ],
  exports:[
    AuthService
  ]
})
export class AuthModule {}

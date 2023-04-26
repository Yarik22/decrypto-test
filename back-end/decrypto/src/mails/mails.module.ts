import { Module } from "@nestjs/common";
import { MailsService } from "./mails.service";


@Module({
  controllers: [],
  providers: [MailsService],
  imports:[],
  exports:[
    MailsService
  ]
})
export class MailsModule {}

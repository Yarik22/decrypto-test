import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { CodeMessageDto } from './dto/code-message.dto';

@Controller('users/:userId/messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  create(@Body() data: CreateMessageDto,@Param('userId') userId: string) {
    return this.messagesService.create(data,userId);
  }

  @Get()
  findAll(@Param('userId') userId: string) {
    return this.messagesService.findAll(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.messagesService.findOne(id);
  }

  @Patch(':id')
  code(@Param('id') id: string, @Body() data: CodeMessageDto) {
    return this.messagesService.code(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.messagesService.remove(id);
  }
}

import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { CodeMessageDto } from './dto/code-message.dto';
import { Message } from './entities/message.entity';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UpdateMessageDto } from './dto/update-message.dto copy';

@ApiTags("messages")
@Controller('users/:userId/messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @ApiOperation({summary:"Create a message, that relates to a definite user(id)"})
  @ApiResponse({type:Message})  
  @Post()
  create(@Body() data: CreateMessageDto,@Param('userId') userId: string) {
    return this.messagesService.create(data,userId);
  }

  @ApiOperation({summary:"Find all messages, that relates to a definite user(id)"})
  @ApiResponse({type:[Message]})  
  @Get()
  findAll(@Param('userId') userId: string) {
    console.log("messagesssssssssssss")
    return this.messagesService.findAll(userId);
  }

  @ApiOperation({summary:"Find definite message(id), that relates to a definite user(id)"})
  @ApiResponse({type:Message})  
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.messagesService.findOne(id);
  }

  @ApiOperation({summary:"Encode&Decode definite message(id), that relates to a definite user(id)"})
  @ApiResponse({type:Message})  
  @Patch(':id/code')
  code(@Param('id') id: string, @Body() data: CodeMessageDto) {
    return this.messagesService.code(id, data);
  }

  @ApiOperation({summary:"edit definite message(id) data, that relates to a definite user(id)"})
  @ApiResponse({type:Message})  
  @Patch(':id')
  edit(@Param('id') id: string, @Body() data: UpdateMessageDto) {
    return this.messagesService.edit(id, data);
  }

  @ApiOperation({summary:"edit definite message(id) data, that relates to a definite user(id)"})
  @ApiResponse({type:Message})  
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.messagesService.remove(id);
  }
}

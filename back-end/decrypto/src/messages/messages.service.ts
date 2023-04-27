import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { CodeMessageDto } from './dto/code-message.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { Message, encodingTypes } from './entities/message.entity';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message) private readonly messageRepository:Repository<Message>,
    private readonly usersService:UsersService
  ){}
  async create(data: CreateMessageDto,userId:string) {
    if(userId.length!=36){
      throw new HttpException("The user id is incorrect",HttpStatus.BAD_REQUEST)
    }
    const user = await this.usersService.findOne(userId,['messages'])
    if(!user.isActivated){
      throw new HttpException("This user is not activated",HttpStatus.BAD_REQUEST)
    }
    const message = this.messageRepository.create(data)
    message.user=user
    await this.messageRepository.save(message);
    return await this.findOne(message.id)
  }

  encodeDecodeXOR(input: string, key: string): string {
    let output = '';
    for (let i = 0; i < input.length; i++) {
      const inputChar = input.charCodeAt(i);
      const keyChar = key.charCodeAt(i % key.length);
      const encodedChar = inputChar ^ keyChar;
      output += String.fromCharCode(encodedChar);
    }
    return output;
  }
  encodeCaesar(input: string, key: number): string {
    let output = '';
    for (let i = 0; i < input.length; i++) {
      const inputChar = input.charCodeAt(i);
      let encodedChar;
      if ((inputChar >= 1040 && inputChar <= 1071) || (inputChar >= 1072 && inputChar <= 1103)) {
        encodedChar = ((inputChar - (inputChar >= 1040 && inputChar <= 1071 ? 1040 : 1072) + key) % 32) + (inputChar >= 1040 && inputChar <= 1071 ? 1040 : 1072);
      } else if ((inputChar >= 65 && inputChar <= 90) || (inputChar >= 97 && inputChar <= 122)) {
        encodedChar = ((inputChar - (inputChar >= 65 && inputChar <= 90 ? 65 : 97) + key) % 26) + (inputChar >= 65 && inputChar <= 90 ? 65 : 97);
      } else {
        encodedChar = inputChar;
      }
      output += String.fromCharCode(encodedChar);
    }
    return output;
  }
  
  decodeCaesar(input: string, key: number): string {
      let output = '';
      for (let i = 0; i < input.length; i++){
          const inputChar = input.charCodeAt(i);
          if ((inputChar >= 1040 && inputChar <= 1071) || (inputChar >= 1072 && inputChar <= 1103)){
  output+= this.encodeCaesar(input[i], 32 - key);
          }else if ((inputChar >= 65 && inputChar <= 90) || (inputChar >= 97 && inputChar <= 122)) {
        output+= this.encodeCaesar(input[i], 26 - key);
      } else {
        output+=  input[i];
      }
      }
          return output
  }

  async findAll(userId:string) {
    const user = await this.usersService.findOne(userId)
    return this.messageRepository.find({where:{user}});
  }

  async findOne(id: string) {
    const message = await this.messageRepository.findOne({where:{id}})
    if(!message){
      throw new HttpException("There is no such message",HttpStatus.NOT_FOUND)
    }
    return message;
  }

  async code(id: string, data: CodeMessageDto):Promise<Message> {
    const message = await this.findOne(id)
    if(message.encodingType==data.encodingType){
      throw new HttpException("You cannot repeat encoding or decodig",HttpStatus.CONFLICT)
    }
    if(message.encodingType==encodingTypes.DECODED){
      switch (data.encodingType) {
        case encodingTypes.CAESAR:
          if(!isNaN(+data.decodingKey)){
            message.message = this.encodeCaesar(message.message,+data.decodingKey)
            message.encodingType=encodingTypes.CAESAR
            break
          }
          throw new HttpException("Incorrect key format (must be a number)",HttpStatus.CONFLICT)
        case encodingTypes.XOR:
          const key = data.decodingKey
          message.message = this.encodeDecodeXOR(message.message,key)
          message.encodingType=encodingTypes.XOR
          break
        default:
          throw new HttpException("Unhandled exception",HttpStatus.BAD_REQUEST)
      }
    }else{
      switch (message.encodingType) {
        case encodingTypes.CAESAR:
          if(!isNaN(+data.decodingKey)){
            message.message = this.decodeCaesar(message.message,+data.decodingKey)
            message.encodingType=encodingTypes.DECODED
            break
          }
          throw new HttpException("Incorrect key format (must be a number)",HttpStatus.CONFLICT)
          case encodingTypes.XOR:
            const key = data.decodingKey
            message.message = this.encodeDecodeXOR(message.message,key)
            message.encodingType=encodingTypes.DECODED
            break
          default:
            throw new HttpException("Unhandled exception",HttpStatus.BAD_REQUEST)
      }
    }
    console.log(message.message)
    return await this.messageRepository.save(message)
  }

  async remove(id: string) {
    const message = await this.messageRepository.findOne({where:{id}})
    if(!message){
      throw new HttpException("There is no such message",HttpStatus.NOT_FOUND)
    }
    await this.messageRepository.delete(id)
    return message;
  }
}

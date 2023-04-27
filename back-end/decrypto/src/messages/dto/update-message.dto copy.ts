import { PartialType } from '@nestjs/mapped-types';
import { CreateMessageDto } from './create-message.dto';
import { encodingTypes } from '../entities/message.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Length, IsString, IsEnum } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateMessageDto extends PartialType(CreateMessageDto) {
    @ApiProperty({example:"Hello, my beautiful world",description:"User's message name"})
    @IsNotEmpty()
    @Length(0, 500)
    @IsString()
    message:string
    @ApiProperty({example:"Hello, world",description:"User's message"})
    @IsNotEmpty()
    @Length(0, 50)
    @IsString()
    name:string
}

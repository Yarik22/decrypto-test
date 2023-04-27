import { PartialType } from '@nestjs/mapped-types';
import { CreateMessageDto } from './create-message.dto';
import { encodingTypes } from '../entities/message.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Length, IsString, IsEnum } from 'class-validator';
import { Transform } from 'class-transformer';

export class CodeMessageDto extends PartialType(CreateMessageDto) {
    @IsEnum(encodingTypes, { message: 'Invalid type of encoding' })
    @Transform(({value}) =>  {
        if(value){
            value=value.toLowerCase()
        }
        return value
    })
    encodingType:encodingTypes
    @ApiProperty({example:"Hello, world",description:"User's message"})
    @IsNotEmpty()
    @Length(0, 50)
    @IsString()
    decodingKey:string
}

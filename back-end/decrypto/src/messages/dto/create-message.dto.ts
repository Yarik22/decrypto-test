import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, Length, IsString } from "class-validator";

export class CreateMessageDto {
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
    @ApiProperty({example:"22",description:"User's message key"})
    @IsNotEmpty()
    @Length(0, 50)
    @IsString()
    decodingKey:string
}

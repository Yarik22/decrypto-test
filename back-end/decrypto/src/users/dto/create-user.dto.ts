import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsNotEmpty, IsString, IsStrongPassword, Length, NotContains} from "class-validator"

export class CreateUserDto {
    @ApiProperty({example:"Boris",description:"User's name"})
    @IsNotEmpty()
    @Length(2, 32)
    @NotContains(' ')
    @IsString()
    name:string
    @ApiProperty({example:"1qwertyuio1",description:"User's password"})
    @IsNotEmpty()
    @Length(8, 32)
    @NotContains(' ')
    @IsString()
    password:string
    @ApiProperty({example:"decrypto@example.com",description:"User's email"})
    @IsNotEmpty()
    @IsEmail()
    @NotContains(' ')
    @IsString()
    email:string
}

import { ApiProperty } from "@nestjs/swagger"
import { Length } from "class-validator"
import { User } from "src/users/entities/user.entity"
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm"
export enum encodingTypes{
    DECODED='decoded',
    CAESAR='caesar',
    XOR='xor'
}
interface IMessage{
    id:string
    message:string
    name:string
    encodingType:encodingTypes
    decodingKey:string
    user:User
}
@Entity()
export class Message implements IMessage {
    @ApiProperty({example:"jgjfuufvdfjn44jifd4",description:"Message uuid"})
    @PrimaryGeneratedColumn('uuid')
    id:string
    @ApiProperty({example:"Hello, my beautiful world",description:"User's message name"})
    @Column()
    message:string
    @ApiProperty({example:"Hello, world",description:"User's message"})
    @Column()
    name:string
    @ApiProperty({example:"decoded",description:"Message encoding status"})
    @Column({
        type: "enum",
        enum: encodingTypes,
        default: encodingTypes.DECODED,
    })
    encodingType:encodingTypes
    @ApiProperty({example:"22",description:"User's message key"})
    @Column({
        default:"12345"
    })
    decodingKey:string
    @ManyToOne(type=>User,user=>user.messages,{ onDelete: 'CASCADE' })
    user:User
}
import { ApiProperty } from "@nestjs/swagger"
import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert, JoinColumn, OneToOne } from "typeorm"
import * as bcrypt from "bcrypt"
import { Token } from "src/auth/entities/token.entity"

interface IUser{
    id:string
    name:string
    hashedPassword:string
    email:string
    token:Token
}
@Entity()
export class User implements IUser {
    @ApiProperty({example:"jgjfuufvdfjn44jifd4",description:"User's uuid"})
    @PrimaryGeneratedColumn('uuid')
    id:string
    @ApiProperty({example:"Boris",description:"User's name"})
    @Column()
    name:string
    @ApiProperty({example:"gfgkjkFDjfijf4jiog4Fjijio54",description:"User's password"})
    @Column(
    )
    hashedPassword:string
    @ApiProperty({example:"decrypto@example.com",description:"User's email"})
    @Column(
        {
            unique:true
        }
    )
    email:string
    @ApiProperty({example:"jfjDKdsfg5453gGEgj456Fjgjj554ugjHFFiih5fg3245",description:"User's jwt token"})
    @OneToOne(type=>Token,token=>token.user)
    token:Token
    @ApiProperty({example:true,description:"Is user banned"})
    @Column(
        {
            unique:false,
            default:false
        }
    )
    isBanned:boolean
    @ApiProperty({example:"Rude behaviour",description:"Ban reason"})
    @Column(
        {
            nullable:true
        }
    )
    banReason:string
    @ApiProperty({example:false,description:"Email activation status"})
    @Column(
        {
            nullable:true,
            default:false
        }
    )
    isActivated:string
}
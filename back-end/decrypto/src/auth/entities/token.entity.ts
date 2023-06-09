import { ApiProperty } from "@nestjs/swagger"
import { User } from "src/users/entities/user.entity"
import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert, OneToOne, JoinColumn } from "typeorm"
export interface IToken{
    id:string
    refreshToken:string
    user:User
}
@Entity()
export class Token implements IToken{
    @ApiProperty({example:"jgjfuufvdfjn44jifd4",description:"Token's uuid"})
    @PrimaryGeneratedColumn('uuid')
    id:string
    @ApiProperty({example:"jfjDKdsfg5453gGEgj456Fjgjj554ugjHFFiih5fg3245",description:"User's jwt refresh token"})
    @Column(
        {
            unique:true,
            nullable:false
        }
    )
    refreshToken:string
    @OneToOne(type=>User,user=>user.token,  { onDelete: 'CASCADE' })
    @JoinColumn()
    user:User

}
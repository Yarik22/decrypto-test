import { HttpException, HttpStatus, Inject, Injectable, forwardRef } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { Token } from './entities/token.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/entities/user.entity';
import { LoginUserDto } from './dto/login-user.dto';
import * as bcrypt from 'bcryptjs'
import * as uuid from 'uuid'
import { MailsService } from 'src/mails/mails.service';

export interface Tokens{
    refreshToken:string
    accessToken:string
}

@Injectable()
export class AuthService {

    constructor(
        private readonly jwtService:JwtService,
        private readonly mailsService:MailsService,
        @Inject(forwardRef(() => UsersService))
        private readonly usersService:UsersService,
        @InjectRepository(Token) 
        private readonly tokenRepository:Repository<Token>,

    ){}
    async generateTokens(payload:User):Promise<Tokens>{
        const accessToken= await this.jwtService.signAsync(payload, {expiresIn:'30m',secret:process.env.JWT_ACCESS})
        const refreshToken= await this.jwtService.signAsync(payload, {expiresIn:'30d',secret:process.env.JWT_REFRESH})
        return {refreshToken,accessToken}
    }

    async registrate(data: CreateUserDto):Promise<User>{
        const user = await this.usersService.create(data)
        const activationUUID = await uuid.v4();
        const activationLink =`${process.env.API_URL}/auth/activate/${activationUUID}`
        await this.mailsService.sendActivationMail(data.email,activationLink)
        user.activationLink=activationUUID
        await this.usersService.save(user)
        return user
    }


    async loginUser(data: LoginUserDto):Promise<Tokens>{
        const user=await this.usersService.findUserByEmail(data.email,['token'])
        if(!user){
            throw new HttpException(`User with email: ${data.email} is not registrated`,HttpStatus.UNAUTHORIZED)
        }
        if(!user.isActivated){
            throw new HttpException(`User's email: ${data.email} is not activated`,HttpStatus.UNAUTHORIZED)
        }
        const isPasswordEquals=await bcrypt.compare(data.password,user.hashedPassword)
        if(!isPasswordEquals){
            throw new HttpException(`Wrong password for user: ${data.email}`,HttpStatus.BAD_REQUEST)
        }
        const userData=await this.usersService.findUserByEmail(data.email)
        const tokens = await this.generateTokens({...userData})
        let token:Token
        if(!user.token){
            token=this.tokenRepository.create(tokens)
            token.user=user
        }
        else{
            token = await this.tokenRepository.findOne({where:{id:user.token.id}})
            token.refreshToken=tokens.refreshToken
        }
        await this.tokenRepository.save(token)
        return tokens
    }

    async validateAccessToken(token: string) {
        try {
            const userData: User = await this.jwtService.verify(token, { secret: process.env.JWT_ACCESS })
            if (!userData.isActivated) {
                throw new HttpException(`User is unauthorized`, HttpStatus.UNAUTHORIZED)
            }
            return userData
        } catch (error) {
            return null
        }
    }
    async activateUser(activationUUID:string):Promise<Tokens>{
        const user = await this.usersService.getUserByActivasionLink(activationUUID)
        if(!user){
            throw new HttpException("No such user found",HttpStatus.BAD_REQUEST)
        }
        if(user.isActivated){
            throw new HttpException("User is already activated",HttpStatus.BAD_REQUEST)
        }
        user.isActivated=true
        const tokens = await this.generateTokens({...user})
        const token = this.tokenRepository.create(tokens)
        token.user=user
        await this.usersService.save(user)
        await this.tokenRepository.save(token)
        return tokens
    }


    async logoutUser(refreshToken: string) {
        const token = await this.tokenRepository.findOne({where:{refreshToken}})
        await this.removeToken(token.id)
        return token

    }
    
    async removeToken(id:string){
        const token = await this.tokenRepository.delete({id})
        return token
    }

}

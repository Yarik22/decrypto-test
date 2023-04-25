import { HttpException, HttpStatus, Inject, Injectable, forwardRef } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { IToken, Token } from './entities/token.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/entities/user.entity';
import { LoginUserDto } from './dto/login-user.dto';
import * as bcrypt from 'bcryptjs'



@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService:JwtService,
        @Inject(forwardRef(() => UsersService))
        private readonly usersService:UsersService,
        @InjectRepository(Token) 
        private readonly tokenRepository:Repository<Token>,

    ){}
    async generateTokens(payload:User):Promise<IToken>{
        const accessToken= await this.jwtService.signAsync(payload, {expiresIn:'30m',secret:process.env.JWT_ACCESS})
        const refreshToken= await this.jwtService.signAsync(payload, {expiresIn:'30d',secret:process.env.JWT_REFRESH})
        return {refreshToken,accessToken}
    }

    async registrate(data: CreateUserDto):Promise<User>{
        return await this.usersService.create(data)
    }

    async loginUser(data: LoginUserDto):Promise<User>{
        const user=await this.usersService.findUserByEmail(data.email)
        if(!user){
            throw new HttpException(`User with email: ${data.email} is not registrated`,HttpStatus.UNAUTHORIZED)
        }
        if(!user.isActivated){
            throw new HttpException(`User's email: ${data.email} is not activated`,HttpStatus.UNAUTHORIZED)
        }
        const isPasswordEquals=await bcrypt.compare(await this.usersService.hashPassword(data.password),user.hashedPassword)
        console.log(user.hashedPassword)
        console.log(user.hashedPassword)
        console.log(isPasswordEquals)
        if(!isPasswordEquals){
            throw new HttpException(`Wrong password for user: ${data.email}`,HttpStatus.BAD_REQUEST)
        }
        await this.saveToken(user.id)
        return await this.usersService.findUserByEmail(user.email)
    }

    async saveToken(userId:string):Promise<IToken>{
        const user = await this.usersService.findOne(userId)
        const tokens = await this.generateTokens({...user})
        console.log("ACC",tokens.accessToken)
        console.log("REF",tokens.refreshToken)
        if(user.token){
            user.token.refreshToken = tokens.refreshToken
            await this.tokenRepository.save(user.token)
            return tokens
        }
        const token = this.tokenRepository.create(tokens)
        token.user=user
        await this.tokenRepository.save(token)
        return tokens
    }
    async validateAccessToken(token: string) {
        try {
            const userData: User = await this.jwtService.verifyAsync(token, { secret: process.env.JWT_ACCESS })

            if (!userData.isActivated) {
                throw new HttpException(`User is unauthorized`, HttpStatus.UNAUTHORIZED)
            }
            return userData
        } catch (error) {
            return null
        }
    }
    async logoutUser(refreshToken: string) {
        const token = await this.tokenRepository.findOne({where:{refreshToken}})
        if(!token){
            throw new HttpException(`You are already logout`,HttpStatus.BAD_REQUEST)
        }
        await this.removeToken(token.id)
        return token

    }
    
    async removeToken(id:string){
        const token = await this.tokenRepository.delete({id})
        return token
    }

}

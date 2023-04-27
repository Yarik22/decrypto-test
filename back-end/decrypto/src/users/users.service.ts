import { HttpException, HttpStatus, Inject, Injectable, forwardRef } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs'
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository:Repository<User>,
    @Inject(forwardRef(() => AuthService))
    private readonly authService:AuthService
  ){}

  async findUserByEmail(email:string, relations?:string[]):Promise<User>{
    return await this.userRepository.findOne({where:{email},relations})
  }

  async hashPassword(password:string):Promise<string>{
    const salt = await bcrypt.genSalt()
    return await bcrypt.hash(password,salt)
  }
  async create(data: CreateUserDto):Promise<User> {
    const candidate = await this.findUserByEmail(data.email)
    if(candidate){
      throw new HttpException("This email is already exist",HttpStatus.CONFLICT)
    }
    const hashedPassword = await this.hashPassword(data.password)
    return this.userRepository.create({...data,hashedPassword})
  }

  async save(user:User):Promise<User> {
    return await this.userRepository.save(user)
  }


  async findOne(id: string, relations?:string[]):Promise<User> {
    const user = await this.userRepository.findOne({where:{id},relations})
    console.log(user)
    if(!user){
      throw new HttpException("This user is no such user",HttpStatus.NOT_FOUND)
    }
    return user
  }


  async getUserByActivasionLink(activationLink:string,relations?:string[]){
    const user = await this.userRepository.findOne({where:{activationLink}})
    return user
}

}

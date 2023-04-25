import { HttpException, HttpStatus, Inject, Injectable, forwardRef } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
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

  async findUserByEmail(email:string):Promise<User>{
    return await this.userRepository.findOne({where:{email},relations:['token']})
  }

//CRUD
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
    const user = this.userRepository.create({...data,hashedPassword})
    await this.userRepository.save(user)
    await this.authService.saveToken(user.id)
    return await this.findUserByEmail(user.email)
  }
  findAll() {
    return `This action returns all users`;
  }

  async findOne(id: string):Promise<User> {
    const user = await this.userRepository.findOne({where:{id}})
    return user
  }

  update(id: number, data: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}

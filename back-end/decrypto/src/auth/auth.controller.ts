import { Controller, Post, Body, Res, Req, HttpException, HttpStatus, Get, Param} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response, Request } from 'express';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {
    
  }
  @Post("registration")
  async registration(@Body() data:CreateUserDto){
      return await this.authService.registrate(data)
  }  
  @Post("login")
  async login(@Body() data:LoginUserDto, @Res() response: Response){
      const tokens = await this.authService.loginUser(data)
      response.cookie('refreshToken',tokens.refreshToken,{maxAge:30*24*60*60*1000,httpOnly:true})
      response.setHeader('Authorization', `Bearer ${tokens.accessToken}`);
      return response.status(200).send(tokens)
      //redirect
  }

  
  @Post("logout")
  async logout(@Req() request:Request,@Res() response: Response){
      const refreshToken=request.headers.cookie
      if(!refreshToken){
        throw new HttpException(`You are already logout`,HttpStatus.BAD_REQUEST)
      }
      const token = await this.authService.logoutUser(refreshToken.split('=')[1])
      response.setHeader('Authorization', 'Bearer none');
      response.clearCookie('refreshToken')
      return response.status(200).send(token)
  }

  @Get("activate/:link")
  async activate(@Param("link")link:string,@Res()response:Response){
      const tokens = await this.authService.activateUser(link)
      response.cookie('refreshToken',tokens.refreshToken,{maxAge:30*24*60*60*1000,httpOnly:true})
      response.setHeader('Authorization', `Bearer ${tokens.accessToken}`);
      console.log(tokens)
      // response.redirect(process.env.CLIENT_URL)
      return response.status(200).send(tokens)
  }
}

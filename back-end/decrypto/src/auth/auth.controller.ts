import { Controller, Post, Body, Res, Req} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response, Request } from 'express';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/entities/user.entity';
import { LoginUserDto } from './dto/login-user.dto';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {
    
  }
  @Post("registration")
  async registration(@Res() response: Response,@Body() data:CreateUserDto){
      const user = await this.authService.registrate(data)
      response.cookie('refreshToken',user.token.refreshToken,{maxAge:30*24*60*60*1000,httpOnly:true})
      return response.status(200).send(user)
  }  
  @Post("login")
  async login(@Body() data:LoginUserDto, @Res() response: Response){
      const user = await this.authService.loginUser(data)
      response.cookie('refreshToken',user.token.refreshToken,{maxAge:30*24*60*60*1000,httpOnly:true})
      return response.status(200).send(user)
      //redirect
  }

  
  @Post("logout")
  async logout(@Req() request:Request,@Res() response: Response){
      const {refreshToken}=await request.cookies
      const token = await this.authService.logoutUser(refreshToken)
      response.clearCookie('refreshToken')
      return response.status(200).send(token)
  }

  // @Get("activate/:link")
  // async activate(@Param("link")link:string,@Res() response: Response){
  //     await this.authService.activateUser(link)
  //     return response.redirect(process.env.CLIENT_URL)
  // }


  // @Get('refresh')
  // async refreshToken(@Req() request,@Res() response: Response){
  //     const {refreshToken}=await request.cookies
  //     const userData = await this.authService.refreshToken(refreshToken)
  //     response.cookie('refreshToken',userData.refreshToken,{maxAge:30*24*60*60*1000,httpOnly:true})
  //     return response.status(200).send(userData)
  // }


}

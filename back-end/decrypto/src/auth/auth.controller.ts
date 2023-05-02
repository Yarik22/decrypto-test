import { Controller, Post, Body, Res, Req, HttpException, HttpStatus, Get, Param, Header} from '@nestjs/common';
import { AuthService, Tokens } from './auth.service';
import { Response, Request } from 'express';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { User } from 'src/users/entities/user.entity';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';


@ApiTags("auth")
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @ApiOperation({summary:"Register user and send activation link"})
  @ApiResponse({type:User})  
  @Post("registration")
  async registration(@Body() data:CreateUserDto){
    // console.log(data)
      return await this.authService.registrate(data)
  }  
  @ApiOperation({summary:"Sign in the user"})
  @ApiResponse({type:null})  
  @Header('Access-Control-Expose-Headers', 'Authorization, Cookie')
  @Post("login")
  async login(@Body() data:LoginUserDto, @Res() response: Response){
    const tokens = await this.authService.loginUser(data)
    try{
      response.cookie('refreshToken', tokens.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: false })
      response.setHeader('Authorization', `Bearer ${tokens.accessToken}`)
      response.setHeader('Cookie',`refreshToken=${tokens.refreshToken}`)
      return response.status(200).send(null)
    }
    catch(e){
      console.log(e)
    }
  }

  @ApiOperation({summary:"Sign out the user"})
  @Header('Access-Control-Expose-Headers', 'Authorization')
  @ApiResponse({type:null})  
  @Post("logout")
  async logout(@Req() request:Request,@Res() response: Response){
      const auth:string=request.headers.authorization
      const authToken:string = auth.split(' ')[1]
      const user = await this.authService.validateAccessToken(authToken)
      if(!user){
        throw new HttpException(`You are already logout`,HttpStatus.BAD_REQUEST)
      }
      await this.authService.logoutUser(user.id)
      response.setHeader('Authorization', null);
      response.clearCookie('refreshToken')
      return response.status(200).json(null)
  }

  @ApiOperation({summary:"Activate the user"})
  @ApiResponse({type:null}) 
  @Get("activate/:link")
  async activate(@Param("link")link:string,@Res()response:Response){
    const tokens = await this.authService.activateUser(link)
    try {
        response.cookie('refreshToken', tokens.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: false })
        return response.redirect(process.env.CLIENT_URL)
      } catch (e) {
        console.log(e)
      }
    }
}

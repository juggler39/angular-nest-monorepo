import { Body, Controller, Get, Post, Req, Response, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { AccessTokenGuard } from '../common/guards/accessToken.guard';
import { RefreshTokenGuard } from '../common/guards/refreshToken.guard';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto, @Response() res: any,) {
    const userData = await this.authService.signUp(createUserDto)
    // res.cookie('accessToken', userData.accessToken, {
    //   httpOnly: true,
    //   secure: true,
    //   sameSite: 'strict'
    // });

    return res.send(userData);
  }

  @Post('login')
  async signin(@Body() data: AuthDto, @Response() res: any,) {
    const userData = await this.authService.signIn(data)
    return res.send(userData);
  }

  @UseGuards(AccessTokenGuard)
  @Get('logout')
  logout(@Req() req: Request) {
    this.authService.logout(req.user['userId']);
  }

  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  refreshTokens(@Req() req: Request) {
    const userId = req.user['userId'];
    const refreshToken = req.user['refreshToken'];
    return this.authService.refreshTokens(userId, refreshToken);
  }
}

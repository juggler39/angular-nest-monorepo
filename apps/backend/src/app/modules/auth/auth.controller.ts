import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { AccessTokenGuard } from '../../guards/accessToken.guard';
import { RefreshTokenGuard } from '../../guards/refreshToken.guard';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post('signup')
  async signup(
    @Body() createUserDto: CreateUserDto,
    @Body('deviceId') deviceId: string,
    @Res() res: Response,
  ) {
    const userData = await this.authService.signUp(createUserDto, deviceId);
    res.cookie('accessToken', userData.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });

    return res.send(userData);
  }

  @Post('login')
  async signin(
    @Body() data: AuthDto,
    @Body('deviceId') deviceId: string,
    @Res() res: Response,
  ) {
    const userData = await this.authService.signIn(data, deviceId);

    res.cookie('accessToken', userData.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });

    return res.send(userData);
  }

  @UseGuards(AccessTokenGuard)
  @Post('logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    const user = req.user as any;
    res.cookie('accessToken', '', { expires: new Date() });
    await this.authService.logout(user.sub, user.deviceId);
    return res.send({ data: 'logout' });
  }

  @UseGuards(AccessTokenGuard)
  @Get('check')
  check(@Res() res: Response) {
    return res.send({ data: 'logged in' });
  }

  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  async refreshTokens(
    @Req() req: Request,
    @Body('refreshToken') refreshToken: string,
    @Body('deviceId') deviceId: string,
    @Res() res: Response,
  ) {
    const user = req.user as any;
    const userId = user.sub;
    const newTokens = await this.authService.refreshTokens(userId, refreshToken, deviceId);
    res.cookie('accessToken', newTokens.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });
    return res.send(newTokens);
  }
}

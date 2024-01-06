import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
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
  async signup(@Body() createUserDto: CreateUserDto, @Res() res: Response,) {
    const userData = await this.authService.signUp(createUserDto)
    res.cookie('accessToken', userData.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict'
    });

    return res.send(userData);
  }

  @Post('login')
  async signin(@Body() data: AuthDto, @Res() res: Response) {
    const userData = await this.authService.signIn(data)

    res.cookie('accessToken', userData.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict'
    });

    return res.send(userData);
  }

  @UseGuards(AccessTokenGuard)
  @Get('logout')
  logout(@Req() req: Request, @Res() res: Response) {
    res.cookie('accessToken', '', { expires: new Date() });
    this.authService.logout(req.user['sub']);
    return res.send({ data: 'logout' });
  }

  @UseGuards(AccessTokenGuard)
  @Get('check')
  check(@Res() res: Response) {
    return res.send({ data: 'logged in' });
  }

  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  async refreshTokens(@Req() req: Request, @Res() res: Response) {
    const userId = req.user['sub'];
    const refreshToken = req.user['refreshToken'];
    const userData = await this.authService.refreshTokens(userId, refreshToken);
    res.cookie('accessToken', userData.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict'
    });
    return res.send(userData);
  }
}

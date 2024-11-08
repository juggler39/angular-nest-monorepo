// auth/auth.service.ts
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthDto } from './dto/auth.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) { }

  async signUp(createUserDto: CreateUserDto, deviceId: string): Promise<any> {
    const userExists = await this.usersService.findByEmail(createUserDto.email);
    if (userExists) {
      throw new BadRequestException('User already exists');
    }

    const hash = await this.hashData(createUserDto.password);
    const newUser: any = await this.usersService.create({
      ...createUserDto,
      name: createUserDto.email,
      password: hash,
    });

    const tokens = await this.getTokens(newUser._id, newUser.email, deviceId);
    await this.usersService.addDevice(newUser._id, deviceId, await this.hashData(tokens.refreshToken));
    return { ...tokens, userId: newUser._id };
  }

  async signIn(data: AuthDto, deviceId: string) {
    const user: any = await this.usersService.findByEmail(data.email);
    if (!user) throw new BadRequestException('User does not exist');
    const passwordMatches = await argon2.verify(user.password, data.password);
    if (!passwordMatches)
      throw new BadRequestException('Password is incorrect');

    const tokens = await this.getTokens(user._id, user.email, deviceId);
    const existingDevice = user.devices.find(d => d.deviceId === deviceId);
    if (existingDevice) {
      await this.usersService.updateDeviceToken(user._id, deviceId, await this.hashData(tokens.refreshToken));
    } else {
      await this.usersService.addDevice(user._id, deviceId, await this.hashData(tokens.refreshToken));
    }
    return { ...tokens, userId: user._id };
  }

  async logout(userId: string, deviceId: string) {
    await this.usersService.removeDevice(userId, deviceId);
  }

  async refreshTokens(userId: string, refreshToken: string, deviceId: string) {
    const hashedRefreshToken = await this.usersService.getDeviceToken(userId, deviceId);
    if (!hashedRefreshToken)
      throw new ForbiddenException('Access Denied');
    const refreshTokenMatches = await argon2.verify(
      hashedRefreshToken,
      refreshToken,
    );
    if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');

    const user = await this.usersService.findById(userId);
    if (!user) throw new ForbiddenException('Access Denied');

    const tokens = await this.getTokens(userId, user.email, deviceId);
    await this.usersService.updateDeviceToken(userId, deviceId, await this.hashData(tokens.refreshToken));
    return tokens;
  }

  hashData(data: string) {
    return argon2.hash(data);
  }

  async getTokens(userId: string, email: string, deviceId: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { sub: userId, email, deviceId },
        {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
          expiresIn: '1m',
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: '7d',
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}

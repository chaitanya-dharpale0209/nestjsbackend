import { Controller, Post, Body, Res, Get, Req } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';

import { Response, Request } from 'express';
import { UnauthorizedException } from '@nestjs/common';
import { Role } from 'src/models/user.entity';

@Controller('api')
export class AuthController {
  constructor(private authService: AuthService) {}

@Post('admin/auth/login')
@Throttle({ default: { limit: 5, ttl: 60000 } })
async adminLogin(
  @Body() body: { email: string; password: string },
  @Res({ passthrough: true }) res: Response,
) {
  const result = await this.authService.login(body.email, body.password, Role.SuperAdmin);

  res.cookie('jwt', result.accessToken, {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    maxAge: 15 * 60 * 1000,
  });

  res.cookie('refreshToken', result.refreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return { user: result.user }; // ✅ No "status"
}


// Vendor Login: Include status
@Post('vendor/auth/login')
@Throttle({ default: { limit: 5, ttl: 60000 } })
async vendorLogin(
  @Body() body: { email: string; password: string },
  @Res({ passthrough: true }) res: Response,
) {
  const result = await this.authService.login(body.email, body.password, Role.Vendor);

  res.cookie('jwt', result.accessToken, {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    maxAge: 15 * 60 * 1000,
  });

  res.cookie('refreshToken', result.refreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return { status: result.user.status, user: result.user }; // ✅ Include "status"
}


 @Post('auth/refresh')
  async refreshToken(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not provided');
    }

    const { accessToken } = await this.authService.refreshAccessToken(refreshToken);

    res.cookie('jwt', accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000,
    });

    return { status: 'success', accessToken };
  }
}
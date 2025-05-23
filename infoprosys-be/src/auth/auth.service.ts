import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Role, UserDocument } from 'src/models/user.entity';


import { UsersService } from 'src/Modules/users/users.services';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  private createTokenPayload(user: UserDocument) {
  // Convert to plain object first
  const userObj = user.toObject();
  return {
    userId: userObj._id.toString(),
    email: userObj.email,
    role: userObj.role,
    ...(userObj.role === Role.Vendor && { status: userObj.status }),
  };
}
// auth.service.ts
async login(email: string, password: string, role: Role) {
  // Validate inputs
  if (!email || !password) {
    throw new UnauthorizedException('Email and password are required');
  }

  const user = await this.usersService.findByEmail(email);
  
  if (!user) {
    throw new UnauthorizedException('User not found');
  }

  // Debug logging
  console.log('User found for login:', {
    id: user._id,
    hasPassword: !!user.password,
    storedPassword: user.password ? 'exists' : 'missing',
    role: user.role
  });

  // Verify password exists
  if (!user.password) {
    throw new UnauthorizedException('Invalid user credentials - no password set');
  }

  // Compare passwords
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new UnauthorizedException('Invalid credentials');
  }

  // Verify role
  if (user.role !== role) {
    throw new UnauthorizedException('Invalid role for this endpoint');
  }

  // Create tokens
  const payload = {
    userId: user._id.toString(),
    email: user.ContactDetails.email,
    role: user.role,
    ...(user.role === Role.Vendor && { status: user.status }),
  };

  const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
  const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

  await this.usersService.updateUser(user._id.toString(), { refreshToken });

  return {
    accessToken,
    refreshToken,
    user: {
      id: user._id.toString(),
      email: user.ContactDetails.email,
      role: user.role,
      ...(user.role === Role.Vendor && { status: user.status }),
    },
  };
}
  // async login(email: string, password: string, role: Role) {
  //   const user = await this.usersService.findByEmail(email);
    
  //   console.log("user logs ", user)
  //   if (!user || user.role !== role) {
  //     throw new UnauthorizedException('Invalid credentials or role');
  //   }

  //   const isMatch = await bcrypt.compare(password, user.password);
  //   if (!isMatch) {
  //     throw new UnauthorizedException('Invalid credentials');
  //   }

  //   const payload = this.createTokenPayload(user);
  //   const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
  //   const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

  //   await this.usersService.updateUser(user._id.toString(), { refreshToken });

  //   // Return different response for SuperAdmin and Vendor
  //   const userPayload: any = {
  //     id: user._id.toString(),
  //     email: user.ContactDetails.email,
  //     role: user.role,
  //   };

  //   if (user.role === Role.Vendor) {
  //     userPayload.status = user.status;
  //   }

  //   return {
  //     accessToken,
  //     refreshToken,
  //     user: userPayload,
  //   };
  // }

  async refreshAccessToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken);
      const user = await this.usersService.findById(payload.userId);

      if (!user || user.refreshToken !== refreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const newPayload = this.createTokenPayload(user);
      const accessToken = this.jwtService.sign(newPayload, { expiresIn: '15m' });

      return { accessToken };
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}

import { Controller, Get, Query, Res, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Response } from 'express';
import { google } from 'googleapis';
import * as jwt from 'jsonwebtoken';
import { PrismaService } from '../../prisma/prisma.service.js';

@Controller({ path: 'google', version: '1' })
export class GoogleAuthController {
  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  @Get('auth')
  async googleAuth(@Res() res: Response) {
    try {
      const clientId = this.configService.get<string>('GOOGLE_CLIENT_ID');
      const clientSecret = this.configService.get<string>('GOOGLE_CLIENT_SECRET');
      const redirectUri = this.configService.get<string>('GOOGLE_REDIRECT_URI') || 'http://localhost:3000/api/v1/google/callback';

      if (!clientId || !clientSecret) {
        throw new UnauthorizedException('Google OAuth not configured');
      }

      const oauth2Client = new google.auth.OAuth2(
        clientId,
        clientSecret,
        redirectUri
      );

      const scopes = [
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/drive.readonly',
      ];

      const url = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes,
        prompt: 'consent',
      });

      return res.redirect(url);
    } catch (error) {
      console.error('Google OAuth initiation error:', error);
      throw new UnauthorizedException('Failed to initiate Google OAuth');
    }
  }

  @Get('callback')
  async googleCallback(@Query('code') code: string, @Res() res: Response) {
    try {
      const clientId = this.configService.get<string>('GOOGLE_CLIENT_ID');
      const clientSecret = this.configService.get<string>('GOOGLE_CLIENT_SECRET');
      const redirectUri = this.configService.get<string>('GOOGLE_REDIRECT_URI') || 'http://localhost:3000/api/v1/google/callback';
      const jwtSecret = this.configService.get<string>('JWT_SECRET');

      if (!clientId || !clientSecret || !jwtSecret) {
        throw new UnauthorizedException('Google OAuth or JWT not configured');
      }

      const oauth2Client = new google.auth.OAuth2(
        clientId,
        clientSecret,
        redirectUri
      );

      // Exchange code for tokens
      const { tokens } = await oauth2Client.getToken(code);
      oauth2Client.setCredentials(tokens);

      // Get user info from Google
      const oauth2 = google.oauth2({
        auth: oauth2Client,
        version: 'v2',
      });

      const userInfo = await oauth2.userinfo.get();
      const googleUser = userInfo.data;

      if (!googleUser.email || !googleUser.id) {
        throw new UnauthorizedException('Failed to get user information from Google');
      }

      // Find or create user in our database (without googleId field)
      let user = await this.prisma.user.findUnique({
        where: { email: googleUser.email },
      });

      if (!user) {
        user = await this.prisma.user.create({
          data: {
            email: googleUser.email,
            name: googleUser.name || googleUser.email,
            avatar: googleUser.picture,
            role: 'user',
            googleAccessToken: tokens.access_token,
            googleRefreshToken: tokens.refresh_token,
          },
        });
      } else {
        // Update existing user with Google tokens
        user = await this.prisma.user.update({
          where: { id: user.id },
          data: {
            avatar: googleUser.picture,
            name: googleUser.name || user.name,
            googleAccessToken: tokens.access_token,
            googleRefreshToken: tokens.refresh_token,
          },
        });
      }

      // Generate JWT token for the user
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        jwtSecret,
        { expiresIn: '60m' }
      );

      // Redirect back to frontend with token
      const frontendUrl = this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3000';
      const redirectUrl = `${frontendUrl}/auth/callback?token=${token}&user=${encodeURIComponent(JSON.stringify({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar,
      }))}`;

      return res.redirect(redirectUrl);
    } catch (error) {
      console.error('Google OAuth callback error:', error);
      const frontendUrl = this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3000';
      return res.redirect(`${frontendUrl}/auth/error?error=google_auth_failed`);
    }
  }

  @Get('status')
  async getGoogleAuthStatus() {
    const clientId = this.configService.get<string>('GOOGLE_CLIENT_ID');
    const clientSecret = this.configService.get<string>('GOOGLE_CLIENT_SECRET');
    
    return {
      configured: !!(clientId && clientSecret),
      clientId: clientId ? `${clientId.substring(0, 8)}...` : null,
    };
  }
}

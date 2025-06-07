import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { LocalAuthGuard } from './guards/local-auth/local-auth.guard';
import { RefreshAuthGuard } from './guards/refresh-auth/refresh-auth.guard';
import { GoogleAuthGuard } from './guards/google-auth/google-auth.guard';
import { Response } from 'express';
import { Public } from './decorators/public.decorator';
import { Roles } from './decorators/role.decorator';
import { User } from 'generated/prisma';
import { AuthenticatedRequest } from './types/auth.jwtPayload';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('signup')
  signup(@Body() createUserDto: CreateUserDto) {
    return this.authService.registerUser(createUserDto);
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('signin')
  login(@Request() req: AuthenticatedRequest) {
    const user: User = req.user;

    return this.authService.login(user.id, user.name, user.role);
  }

  @Post('signout')
  signout(@Request() req: AuthenticatedRequest) {
    const user: User = req.user;

    return this.authService.signOut(user.id);
  }

  @Roles('ADMIN', 'EDITOR')
  @Get('protected')
  getAll(@Request() req: AuthenticatedRequest) {
    const user: User = req.user;

    return {
      message: `Now you can see this protected route, this is your user id: ${user.id}`,
    };
  }

  @Public()
  @UseGuards(RefreshAuthGuard)
  @Post('refresh')
  refreshToken(@Request() req: AuthenticatedRequest) {
    const user: User = req.user;

    return this.authService.refreshToken(user.id, user.name);
  }

  @Public()
  @UseGuards(GoogleAuthGuard)
  @Get('google/login')
  googleLogin() {}

  @Public()
  @UseGuards(GoogleAuthGuard)
  @Get('google/callback')
  async googleAuthCallback(
    @Request()
    req: AuthenticatedRequest,
    @Res() res: Response,
  ) {
    const user: User = req.user;

    const response = await this.authService.login(
      user.id,
      user.name,
      user.role,
    );

    res.redirect(
      `${process.env.FRONTEND_URL}/api/auth/google/callback?accessToken=${response.accessToken}&refreshToken=${response.refreshToken}&userId=${response.id}&name=${response.name}&role=${response.role}`,
    );
  }
}

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
import { IUser } from 'src/user/types';
import { RefreshAuthGuard } from './guards/refresh-auth/refresh-auth.guard';
import { GoogleAuthGuard } from './guards/google-auth/google-auth.guard';
import { Response } from 'express';
import { Public } from './decorators/public.decorator';

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
  login(@Request() req: { user: IUser }) {
    return this.authService.login(req.user.id, req.user.name);
  }

  @Post('signout')
  signout(@Request() req: { user: IUser }) {
    return this.authService.signOut(req.user.id);
  }

  @Get('protected')
  getAll(@Request() req: { user: IUser }) {
    console.log('🚀 ~ AuthController ~ getAll ~ user:', req.user);
    return {
      message: `Now you can see this protected route, this is your user id: ${req.user.id}`,
    };
  }

  @Public()
  @UseGuards(RefreshAuthGuard)
  @Post('refresh')
  refreshToken(@Request() req: { user: IUser }) {
    return this.authService.refreshToken(req.user.id, req.user.name);
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
    req: {
      user: IUser;
    },
    @Res() res: Response,
  ) {
    const response = await this.authService.login(req.user.id, req.user.name);

    res.redirect(
      `${process.env.FRONTEND_URL}/api/auth/google/callback?accessToken=${response.accessToken}&refreshToken=${response.refreshToken}&userId=${response.id}&name=${response.name}`,
    );
  }
}

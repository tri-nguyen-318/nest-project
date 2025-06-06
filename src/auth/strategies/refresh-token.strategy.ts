import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigType } from '@nestjs/config';
import { AuthJwtPayload } from '../types/auth.jwtPayload';
import { AuthService } from '../auth.service';
import refreshConfig from '../config/refresh.config';

type BodyRefresh = {
  body: {
    refresh: string;
  };
};
@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, 'refresh-jwt') {
  constructor(
    @Inject(refreshConfig.KEY)
    private refreshTokenConfig: ConfigType<typeof refreshConfig>,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refresh'),
      secretOrKey: refreshTokenConfig.secret as string,
      ignoreExpiration: false,
      passReqToCallback: true,
    });
  }

  validate(req: Request & BodyRefresh, payload: AuthJwtPayload) {
    const userId = payload.sub;

    const refreshToken: string = req.body.refresh;

    return this.authService.validateRefreshToken(userId, refreshToken);
  }
}

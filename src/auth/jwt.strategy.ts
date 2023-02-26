import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { jwtConstants } from './constants';
import { UsersService } from 'src/users/services/users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
      passReqToCallback: true,
    });
  }

  async validate(req: any, payload: any) {
    const user = await this.usersService.findUserById(payload.sub);

    // Check if token is in blacklist
    // const tokenValue = req.headers.authorization.split(' ')[1];

    // const isBlacklistedToken =
    //   await this.usersService.checkIfTokenIsInBlacklist(tokenValue);

    // if (isBlacklistedToken) {
    //   throw new UnauthorizedException();
    // }
    if (!user) {
      throw new UnauthorizedException();
    }
    const { password, ...result } = user;
    return result;
  }
}

import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET!,
    });
  }

  async validate(payload: { sub?: string; userId?: string; email: string; role?: string }) {
    return {
      sub: payload.sub ?? payload.userId,
      id: payload.sub ?? payload.userId,
      email: payload.email,
      role: payload.role ?? 'user',
    };
  }
}

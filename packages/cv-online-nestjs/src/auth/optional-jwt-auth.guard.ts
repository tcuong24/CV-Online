import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  handleRequest<TUser = any>(
    _err: any,
    user: TUser | false | null,
  ): TUser | null {
    return user || null;
  }
}

import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { TokenException } from '../share/exceptions/token.exception';
import { AuthService } from '../modules/auth/auth.service';
import { Request } from 'express';
import { ServerException } from '../share/exceptions/server.exception';
import { UnAuthorizedException } from '../share/exceptions/unauthorized.exception';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.getTokenFromRequest(request);
    try {
      const data = await this.authService.verify(token);
      request.user = data.user;
      request.token = data.token;
    } catch (e) {
      if (e.name == TokenException.name || e.name == BadRequestException.name) {
        throw e;
      } else {
        throw new ServerException();
      }
    }
    return true;
  }

  protected getTokenFromRequest(request: Request): string {
    const tokenAuth = request.headers['ecommerce'];
    if (!tokenAuth) throw new UnAuthorizedException('Authenticate failed');
    return tokenAuth as string;
  }
}

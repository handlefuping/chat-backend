import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { UserService } from 'src/modules/user/user.service';
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private userService: UserService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const { userInfo } = request.session;

    if (!userInfo) {
      throw new UnauthorizedException('登陆信息已经过期');
    }
    const user = await this.userService.getUser({ id: userInfo.id });
    if (!user) {
      throw new UnauthorizedException('登陆用户不存在');
    }
    return true;
  }
}

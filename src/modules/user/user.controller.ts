import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Session,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  LoginUserDto,
  CreateUserDto,
  UpdateUserDto,
} from './dto/create-user.dto';
import { CACHE_MANAGER, CacheInterceptor } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { SessionData } from 'express-session';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { LoggerService } from 'src/service/logger.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private loggerService: LoggerService,
  ) {}
  @Post('create')
  createUser(@Body() body: CreateUserDto) {
    return this.userService.save(body);
  }
  @Post('login')
  async loginUser(@Body() body: LoginUserDto, @Session() session: SessionData) {
    const userInfo = await this.userService.getUser(body);
    if (!userInfo) {
      throw new BadRequestException('用户不存在');
    }
    session.userInfo = userInfo;
    return userInfo;
  }
  @UseGuards(AuthGuard)
  @Get(':id')
  @UseInterceptors(CacheInterceptor)
  getUser(@Param('id') id: number) {
    this.loggerService.log('查询用户-哈哈哈');
    return this.userService.getUser({ id });
  }
  @UseGuards(AuthGuard)
  @Post('update')
  async updateUser(
    @Body() body: UpdateUserDto,
    @Session() session: SessionData,
  ) {
    const { id } = session.userInfo!;
    const updateUser = await this.userService.updateUser(id, body);
    return this.cacheManager.set(`/user/${id}`, updateUser);
  }
}

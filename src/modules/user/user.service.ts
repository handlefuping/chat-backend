import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}
  createEntity(user: Partial<User>) {
    return this.usersRepository.create(user);
  }
  async save(user: Partial<User>) {
    const userInfo = await this.usersRepository.save(this.createEntity(user));
    console.log(user, userInfo);
    // https://github.com/typeorm/typeorm/issues/4591#issuecomment-2082728501
    const { password, ...result } = userInfo;
    return result;
  }
  getUser(user: Partial<User>) {
    return this.usersRepository.findOneBy(this.createEntity(user));
  }
  async updateUser(id: number, user: Partial<User>) {
    const userInfo = await this.getUser({ id });
    if (!userInfo) {
      throw new BadRequestException('当前用户不存在');
    }
    Object.assign(userInfo, user);
    return this.save(userInfo);
  }
}

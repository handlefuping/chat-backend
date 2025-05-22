import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { UserRepositoryService } from 'src/service/user-repository.service';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  repository: Repository<User>;
  constructor(private repositoryService: UserRepositoryService) {
    this.repository = repositoryService.getRepository();
  }
  createEntity(user: Partial<User>) {
    return this.repository.create(user);
  }
  async save(user: Partial<User>) {
    const userInfo = await this.repository.save(this.createEntity(user));
    // https://github.com/typeorm/typeorm/issues/4591#issuecomment-2082728501
    const { password, ...result } = userInfo;
    return result;
  }
  getUser(user: Partial<User>) {
    return this.repository.findOneBy(this.createEntity(user));
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

import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/modules/user/entities/user.entity';
import { Repository } from 'typeorm';
import { Request } from 'express';

@Injectable()
export class UserRepositoryService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(User, 'copy')
    private usersRepositoryCopy: Repository<User>,
    @Inject(REQUEST) private request: Request,
  ) {}

  getRepository() {
    const tenant = this.request.headers['x-tenant-id'];
    if (tenant == 'copy') {
      return this.usersRepositoryCopy;
    }
    return this.usersRepository;
  }
}

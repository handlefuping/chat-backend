import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepositoryService } from 'src/service/user-repository.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([User], 'copy'),
  ],
  controllers: [UserController],
  providers: [UserService, UserRepositoryService],
})
export class UserModule {}

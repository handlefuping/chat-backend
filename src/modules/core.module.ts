import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { MsgModule } from './msg/msg.module';
@Module({
  imports: [UserModule, MsgModule],
  exports: [UserModule, MsgModule],
})
export class CoreModule {}

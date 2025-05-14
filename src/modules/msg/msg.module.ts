import { Module } from '@nestjs/common';
import { MsgService } from './msg.service';
import { MsgController } from './msg.controller';

@Module({
  controllers: [MsgController],
  providers: [MsgService],
})
export class MsgModule {}

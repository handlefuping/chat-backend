import { Injectable } from '@nestjs/common';

@Injectable()
export class MsgService {
  findOne(id: number) {
    return `This action returns a #${id} msg`;
  }
}

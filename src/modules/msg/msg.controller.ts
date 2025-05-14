import { Controller, Get, Param } from '@nestjs/common';
import { MsgService } from './msg.service';

@Controller('msg')
export class MsgController {
  constructor(private readonly msgService: MsgService) {}
  @Get(':id')
  findOne(@Param('id') id: string) {
    console.log(id, 1111);

    return this.msgService.findOne(+id);
  }
}

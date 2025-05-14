import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class OneOptionPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata): any {
    console.log(
      metadata.metatype,
      value,
      plainToInstance(metadata.metatype!, value),
    );

    return value;
  }
}

import {
  IsDefined,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  IsStrongPassword,
  Length,
  Matches,
  ValidateIf,
} from 'class-validator';
import { Gender } from '../entities/user.entity';
import { IntersectionType } from '@nestjs/mapped-types';

export class CoreUserDto {
  @IsString()
  @Matches(/^1[3-9]\d{9}$/, { message: '手机号格式错误' })
  phone: string;
  @IsString()
  @Length(1, 20)
  name: string;
  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    },
    { message: '密码需包含大小写字母、数字和符号，至少8位' },
  )
  password: string;
}

export class ExtraUserDto {
  @IsOptional()
  @IsEmail()
  email: string;
  @IsOptional()
  @IsEnum(Gender, { message: '0是女, 1是难' })
  gender: Gender;
}

export class CreateUserDto extends IntersectionType(
  CoreUserDto,
  ExtraUserDto,
) {}

export class LoginUserDto extends CoreUserDto {
  @IsOptional()
  declare phone: string;
  @IsOptional()
  declare name: string;
  // https://github.com/typestack/class-validator/issues/1581#issuecomment-1890490999
  @ValidateIf(
    (o: LoginUserDto) => !!(!o.phone && !o.name) || !!(o.phone && o.name),
  )
  @IsDefined({ message: '手机或者用户名' })
  combinedCheck: undefined;
}

export class UpdateUserDto extends ExtraUserDto {
  @ValidateIf((o: UpdateUserDto) => !!(!o.email && !o.gender))
  @IsDefined({ message: '邮箱或者性别' })
  combinedCheck: undefined;
}

import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({
    type: 'varchar',
    length: 20,
    unique: true,
    comment: '手机号（需符合国际格式）',
  })
  @Index('IDX_PHONE', { unique: true })
  phone: string;
  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    unique: true,
    comment: '用户邮箱',
  })
  @Index('IDX_EMAIL', { unique: true })
  email: string;
  @Column({ type: 'varchar', width: 20 })
  name: string;
  @Column({
    type: 'varchar',
    length: 100,
    select: false,
    comment: '加密后的密码哈希值',
  })
  password: string;
  @Column({
    type: 'enum',
    enum: Gender,
    default: Gender.MALE,
    comment: '用户性别',
  })
  gender: Gender;
  @CreateDateColumn({
    type: 'timestamp',
    precision: 0,
    default: () => 'now()',
    comment: '记录创建时间',
  })
  create_time: string;
}

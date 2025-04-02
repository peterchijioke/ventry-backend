// entities/User.ts
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string; 

  @Column({ default: new Date() })
  createdAt!: Date;

  @Column({ nullable: true })
  updatedAt?: Date;
}
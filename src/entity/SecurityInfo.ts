// src/entity/SecurityInfo.ts
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
export class SecurityInfo {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column()
  message!: string;

  @CreateDateColumn()
  createdAt!: Date;
}

// src/entity/Notification.ts
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
export class Notification {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column("text")
  message!: string;

  @Column({ default: false })
  isUrgent!: boolean;

  @CreateDateColumn()
  createdAt!: Date;
}

// src/entity/User.ts
import { IsEmail, Length } from "class-validator";
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
} from "typeorm";

@Entity()
@Unique(["email"])
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 50 })
  @Length(4, 50)
  username!: string;

  @Column({ length: 100 })
  @IsEmail()
  email!: string;

  @Column()
  @Length(6, 255)
  password!: string;

  @Column({ length: 20, default: "user" })
  @Length(3, 20)
  role!: string;

  @CreateDateColumn()
  created_at!: Date;
}

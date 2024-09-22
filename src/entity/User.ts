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

  @Column({ default: null, nullable: true })
  resetToken?: string | null;

  @Column({ type: "timestamp", default: null, nullable: true })
  resetTokenExpiration?: Date | null;

  @Column({ length: 20, default: "user" })
  @Length(3, 20)
  @Column({
    type: "enum",
    enum: ["admin", "user"],
    default: "user",
  })
  role!: "admin" | "user";

  @CreateDateColumn()
  created_at!: Date;
}

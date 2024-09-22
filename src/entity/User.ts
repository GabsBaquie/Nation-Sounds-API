import { IsEmail, Length } from "class-validator";
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
} from "typeorm";

@Entity()
@Unique(["email", "username"])
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 50, nullable: false }) // username est obligatoire
  @Length(4, 50)
  username!: string;

  @Column({ length: 100, nullable: false }) // email est obligatoire
  @IsEmail()
  email!: string;

  @Column({ nullable: false }) // password est obligatoire
  @Length(6, 255)
  password!: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  resetToken?: string | null;

  @Column({ type: "timestamp", nullable: true })
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

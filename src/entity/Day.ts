// src/entity/Day.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  OneToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Concert } from "./Concert";
import { Program } from "./Program";

@Entity()
export class Day {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  date!: Date;

  @ManyToMany(() => Concert, (concert) => concert.days)
  concerts!: Concert[];

  @OneToOne(() => Program, (program) => program.day)
  program!: Program;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

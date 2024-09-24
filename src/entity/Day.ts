// src/entity/Day.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  OneToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Program } from "./Program";
import { Concert } from "./Concert";

@Entity()
export class Day {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  date!: Date;

  @OneToOne(() => Program, (program) => program.day)
  program!: Program;

  @OneToMany(() => Concert, (concert) => concert.days, { cascade: true })
  concerts!: Concert[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

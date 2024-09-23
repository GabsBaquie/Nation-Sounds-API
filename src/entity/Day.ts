// src/entity/Day.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
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

  @ManyToOne(() => Program, (program) => program.days, { onDelete: "CASCADE" })
  program!: Program;

  @OneToMany(() => Concert, (concert) => concert.day, { cascade: true })
  concerts!: Concert[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

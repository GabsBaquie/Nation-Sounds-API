// src/entity/Concert.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Day } from "./Day";

@Entity()
export class Concert {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column("text")
  description!: string;

  @Column()
  performer!: string;

  @Column()
  startTime!: string;

  @Column()
  endTime!: string;

  @ManyToOne(() => Day, (day) => day.concerts, { onDelete: "CASCADE" })
  day!: Day;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

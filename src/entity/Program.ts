// src/entity/Program.ts
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Program {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  artistName!: string;

  @Column()
  stage!: string;

  @Column("datetime")
  startTime!: Date;

  @Column("datetime")
  endTime!: Date;

  @Column("date")
  date!: Date;
}

// src/entity/Day.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Concert } from "./Concert";
@Entity()
export class Day {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column()
  date!: Date;

  @ManyToMany(() => Concert, (concert: Concert) => concert.days, {
    cascade: false, // Désactive le cascade pour éviter les suppressions circulaires
    eager: true, // Charge automatiquement les concerts associés lors de la récupération de Day
  })
  concerts!: Concert[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

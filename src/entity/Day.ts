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
  title!: string;

  @Column()
  date!: Date;

  @ManyToMany(() => Concert, (concert: Concert) => concert.days, {
    cascade: false, // Désactive le cascade pour éviter les suppressions circulaires
    eager: true, // Charge automatiquement les concerts associés lors de la récupération de Day
  })
  concerts!: Concert[];

  @OneToOne(() => Program, (program: Program) => program.day, {
    nullable: true, // Rendre la relation optionnelle
    onDelete: "SET NULL", // Mettre dayId à NULL lors de la suppression d'un Day
    eager: true, // Charger automatiquement le Program associé
  })
  program?: Program;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

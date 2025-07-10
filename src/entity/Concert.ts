// src/entity/Concert.ts
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
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
  time!: string;

  @Column()
  location!: string;

  @Column({ nullable: true })
  image?: string;

  @ManyToMany(() => Day, (day: Day): Concert[] => day.concerts, {
    cascade: false, // Désactive le cascade pour éviter les suppressions circulaires
    eager: false, // Charge les Days associés uniquement lorsque spécifié
  })
  @JoinTable()
  days!: Day[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

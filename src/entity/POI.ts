// src/entity/POI.ts
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class POI {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  type!: string; // e.g., 'stage', 'shop', 'restroom'

  @Column("double")
  latitude!: number;

  @Column("double")
  longitude!: number;

  @Column({ nullable: true })
  description!: string;
}

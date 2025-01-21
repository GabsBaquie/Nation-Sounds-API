// src/entity/POI.ts
import { Column, Entity, PrimaryGeneratedColumn, UpdateDateColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class POI {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column()
  type!: string; // e.g., 'stage', 'shop', 'restroom'

  @Column('double')
  latitude!: number;

  @Column('double')
  longitude!: number;

  @Column({ nullable: true })
  description!: string;

  @CreateDateColumn()
    createdAt!: Date;
  
  @UpdateDateColumn()
  updatedAt!: Date;
}

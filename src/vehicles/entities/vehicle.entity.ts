import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Vehicle {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  plate: string;

  @Column({ unique: true })
  chassis: string;

  @Column({ unique: true })
  renavam: string;

  @Column()
  model: string;

  @Column()
  brand: string;

  @Column()
  year: number;
}

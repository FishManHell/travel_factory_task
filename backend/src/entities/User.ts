import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export type Role = 'Requester' | 'Validator';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'varchar', length: 100 })
    name!: string;

    @Column({ type: 'varchar', length: 20 })
    role!: Role;
}
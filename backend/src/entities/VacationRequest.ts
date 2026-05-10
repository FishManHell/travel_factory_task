import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
} from 'typeorm';
import { User } from './User';

export type RequestStatus = 'pending' | 'approved' | 'rejected';

@Entity('vacation_requests')
export class VacationRequest {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => User, { eager: true, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user!: User;

    @Column({ type: 'date' })
    startDate!: string;

    @Column({ type: 'date' })
    endDate!: string;

    @Column({ type: 'text', nullable: true })
    reason!: string | null;

    @Column({ type: 'varchar', length: 20, default: 'pending' })
    status!: RequestStatus;

    @Column({ type: 'text', nullable: true })
    comments!: string | null;

    @CreateDateColumn()
    createdAt!: Date;
}
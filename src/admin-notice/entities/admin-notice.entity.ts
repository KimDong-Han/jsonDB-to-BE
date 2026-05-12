import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { v7 as uuidv7 } from 'uuid';

@Entity('admin_notice')
export class AdminNotice {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @BeforeInsert()
  generateId() {
    this.id = uuidv7();
  }

  @Column({ type: 'text', nullable: false })
  content!: string;

  @Column({ type: 'boolean', nullable: false, default: true })
  viewStatus!: boolean;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt!: Date;
}

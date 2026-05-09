import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { v7 as uuidv7 } from 'uuid';

@Entity('event_tag')
export class EventTag {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @BeforeInsert()
  generateId() {
    this.id = uuidv7();
  }

  @Column({ type: 'text', nullable: false, unique: true })
  name: string;

  @Column({ type: 'int', nullable: false, default: 0 })
  sortOrder: number;

  @Column({ type: 'boolean', nullable: false, default: true })
  viewStatus: boolean;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;
}

export type EventTagType = keyof EventTag;

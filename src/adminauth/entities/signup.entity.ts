import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { v7 as uuidv7 } from 'uuid';

@Entity('admin') // 테이블 이ㅁ
export class signup {
  @PrimaryGeneratedColumn('uuid') // 기본 키 (자동 증가)
  id: string;

  @BeforeInsert()
  generateId() {
    this.id = uuidv7(); // 레코드 삽입 전에 UUID v7 생성
  }
  @Column({ type: 'text', nullable: false })
  adminId: string;
  @Column({ type: 'text', nullable: false })
  pw: string;
  @Column({ type: 'text', nullable: false, default: 'subAdmin' })
  permission: string;
  // 생성,업데이트 날짜 자동삽입 - 타임스탬프
  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;
  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;
}

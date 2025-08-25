import { PickType } from '@nestjs/mapped-types';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
} from 'typeorm';
import { v7 as uuidv7 } from 'uuid';
@Entity('armyfestival') // 테이블 이름
export class Armyfestival {
  @PrimaryGeneratedColumn('uuid') // 기본 키 (자동 증가)
  id: string;

  @BeforeInsert()
  generateId() {
    this.id = uuidv7(); // 레코드 삽입 전에 UUID v7 생성
  }

  @Column({ type: 'text', nullable: false })
  title: string;

  @Column({ type: 'text', nullable: false, unique: true }) // 동영상 URL
  url: string;
  @Column({ type: 'text', nullable: false }) // 썸네일 이미지 URL
  iconImg: string;
  @Column({ type: 'varchar', length: 50, default: 'none' }) // 태그
  tag: string;
  @Column({ type: 'timestamp with time zone', nullable: false }) // 업로드 날짜
  uploadDate: Date;

  // 생성,업데이트 날짜 자동삽입 - 타임스탬프
  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;
  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;
}
export type ArmyFestivalType = keyof Armyfestival;

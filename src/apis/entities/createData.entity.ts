import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
@Entity('createData') // 테이블 이ㅁ
export class CreateData {
  @PrimaryGeneratedColumn() // 기본 키 (자동 증가)
  id: number;

  @Column({ type: 'text', nullable: false }) // 동영상 제목 (PostgreSQL의 text 타입)
  title: string;

  @Column({ type: 'text', nullable: false, unique: true }) // 동영상 URL
  url: string;

  @Column({ type: 'text', nullable: false }) // 썸네일 이미지 URL
  iconImg: string;

  @Column({ type: 'varchar', length: 50, default: 'none' }) // 태그
  tag: string;

  @Column({ type: 'timestamp with time zone', nullable: false }) // 업로드 날짜
  uploadDate: Date;
}

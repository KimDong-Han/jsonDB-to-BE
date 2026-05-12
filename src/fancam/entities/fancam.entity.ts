import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Armyfestival } from '../../armyfestival/entities/armyfestival.entity';
import { EventTag } from '../../event-tag/entities/event-tag.entity';

@Entity('fancam')
export class Fancam extends Armyfestival {
  @Column({ type: 'text', nullable: false, default: '' })
  source!: string;

  @Column({ type: 'text', nullable: false, default: '' })
  churl!: string;

  @Column({ type: 'uuid', nullable: true })
  eventTagId!: string | null;

  @ManyToOne(() => EventTag, { nullable: true, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'eventTagId' })
  eventTag?: EventTag | null;
}

export type FancamType = keyof Fancam;

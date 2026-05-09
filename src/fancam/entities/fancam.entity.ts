import { Column, Entity } from 'typeorm';
import { Armyfestival } from '../../armyfestival/entities/armyfestival.entity';

@Entity('fancam')
export class Fancam extends Armyfestival {
  @Column({ type: 'text', nullable: false, default: '' })
  source: string;

  @Column({ type: 'text', nullable: false, default: '' })
  churl: string;
}

export type FancamType = keyof Fancam;

import { PickType } from '@nestjs/mapped-types';
import { Entity } from 'typeorm';
import { v7 as uuidv7 } from 'uuid';
import { Armyfestival } from 'src/armyfestival/entities/armyfestival.entity';

@Entity('newbwg') // 테이블 이름
export class newbwg extends Armyfestival {} //Armyfestival 상속받아서 재활용
export type newbwgType = keyof newbwg;

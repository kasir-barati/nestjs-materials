import { SharedAlert } from 'shared';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AlertType } from '../../alert-type/entities/alert-type.entity';

@Entity()
export class Alert implements SharedAlert {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { length: 200 })
  title: string;

  @Column('varchar', { length: 500 })
  description: string;

  @Column('uuid')
  userId: string;

  @Column('uuid', { nullable: true })
  alertTypeId: string | null;

  @ManyToOne(() => AlertType, { nullable: true })
  alertType: AlertType | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

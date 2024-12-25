import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Alert } from '../../alert/entities/alert.entity';

@Entity()
export class AlertType {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { length: 200 })
  name: string;

  @Column('varchar', { length: 500 })
  description: string;

  @OneToMany((type) => Alert, (photo) => photo.alertType, {
    onDelete: 'SET NULL',
  })
  alerts: Alert[] | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

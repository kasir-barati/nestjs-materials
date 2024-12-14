import {
  Field,
  GraphQLISODateTime,
  ID,
  ObjectType,
} from '@nestjs/graphql';
import {
  CursorConnection,
  FilterableField,
  IDField,
} from '@ptc-org/nestjs-query-graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Alert } from '../../alert/entities/alert.entity';

@ObjectType('AlertType')
@CursorConnection('alerts', () => Alert, {
  update: { enabled: true },
})
@Entity()
export class AlertType {
  @PrimaryGeneratedColumn('uuid')
  @IDField(() => ID, { description: 'ID of the alert type' })
  @FilterableField()
  id: string;

  @Column('varchar', { length: 200 })
  @Field({ description: 'Name of the alert type' })
  @FilterableField()
  name: string;

  @Column('varchar', { length: 500 })
  @Field({ description: 'Description of the alert type' })
  description: string;

  @OneToMany((type) => Alert, (photo) => photo.alertType, {
    onDelete: 'SET NULL',
  })
  alerts: Alert[] | null;

  @CreateDateColumn()
  @Field(() => GraphQLISODateTime, {
    description: 'Creation date of the alert type',
  })
  @FilterableField()
  createdAt: Date;

  @CreateDateColumn()
  @Field(() => GraphQLISODateTime, {
    description:
      "Date of last time that we've updated this alert type",
  })
  updatedAt: Date;
}

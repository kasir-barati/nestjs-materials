import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { YourBaseEntity } from '../../../utils/your-base-entity.util';
import { Comment } from '../../comment/entities/comment.entity';
import { Talent } from '../../talent/entities/talent.entity';

@Entity()
export class Review extends YourBaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  text: string;

  @Column()
  rating: number;

  @ManyToOne(() => Talent, (talent) => talent.reviews)
  @JoinColumn({ name: 'talent_id' })
  talent: Talent;

  @OneToMany(() => Comment, (comment) => comment.review)
  comments: Comment[];
}

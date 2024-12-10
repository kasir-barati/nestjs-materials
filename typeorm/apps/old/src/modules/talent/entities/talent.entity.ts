import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { YourBaseEntity } from '../../../utils/your-base-entity.util';
import { Category } from '../../category/entities/category.entity';
import { Review } from '../../review/entities/review.entity';

// Most of the users' data would be kept in our lovely fusionauth
/**
 * @description TypeORM uses RFC4122 compliant UUID v4 function for drivers which do not have a built-in uuid function
 */
@Entity('talents')
export class Talent extends YourBaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: true, name: 'is_active' })
  isActive: boolean;

  @Column({ name: 'is_adaptable' })
  isAdaptable: boolean;

  @ManyToMany(() => Category, (category) => category.talents)
  @JoinTable({
    name: 'talents_of_categories',
    joinColumn: {
      name: 'category_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'talent_id',
      referencedColumnName: 'id',
    },
  })
  categories: Category[];

  @OneToMany(() => Review, (talentReview) => talentReview.talent)
  reviews: Review[];
}

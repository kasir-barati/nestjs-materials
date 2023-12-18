import {
    BaseEntity,
    Column,
    Entity,
    ManyToMany,
    OneToMany,
    PrimaryColumn,
} from 'typeorm';
import { Category } from '../../category/entities/category.entity';
import { Review } from '../../review/entities/review.entity';

// Most of the users' data would be kept in our lovely fusionauth
@Entity('talents')
export class Talent extends BaseEntity {
    @PrimaryColumn({
        type: 'uuid',
    })
    id: string;

    @Column({ default: true })
    isActive: boolean;

    @Column({})
    isAdaptable: boolean;

    @ManyToMany(() => Category, (category) => category.talents)
    categories: Category[];

    @OneToMany(() => Review, (talentReview) => talentReview.talent)
    reviews: Review[];
}

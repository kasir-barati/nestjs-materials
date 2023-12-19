import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryColumn,
} from 'typeorm';
import { YourBaseEntity } from '../../../utils/your-base-entity.util';
import { Review } from '../../review/entities/review.entity';

@Entity('comments')
export class Comment extends YourBaseEntity {
    @PrimaryColumn()
    id: number;

    @Column()
    text: string;

    // A ref to our fusionauth
    @Column({ name: 'user_id' })
    userId: string;

    @ManyToOne(() => Review, (review) => review.comments)
    @JoinColumn({ name: 'review_id' })
    review: Review;
}

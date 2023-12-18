import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryColumn,
} from 'typeorm';
import { Review } from '../../review/entities/review.entity';

@Entity('comments')
export class Comment {
    @PrimaryColumn()
    id: number;

    @Column()
    text: string;

    // A ref to our fusionauth
    @Column()
    userId: string;

    @ManyToOne(() => Review, (review) => review.comments)
    @JoinColumn({ name: 'review_id' })
    review: Review;
}

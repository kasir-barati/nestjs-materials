import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryColumn,
} from 'typeorm';
import { Comment } from '../../comment/entities/comment.entity';
import { Talent } from '../../talent/entities/talent.entity';

@Entity()
export class Review {
    @PrimaryColumn()
    id: number;

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

import {
    BaseEntity,
    Column,
    Entity,
    ManyToMany,
    PrimaryColumn,
    Unique,
} from 'typeorm';
import { Talent } from '../../talent/entities/talent.entity';

@Entity('categories')
@Unique(['title'])
export class Category extends BaseEntity {
    @PrimaryColumn({
        type: 'uuid',
    })
    id: string;

    @Column({ nullable: true })
    title: string;

    @ManyToMany(() => Talent, (talent) => talent.categories)
    talents: Talent[];
}

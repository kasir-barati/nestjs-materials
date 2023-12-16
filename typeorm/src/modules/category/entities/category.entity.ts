import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    Unique,
    BaseEntity,
    ManyToMany,
} from 'typeorm';
import { Talent } from '../../talent/entities/talent.entity';

@Entity('categories')
@Unique(['title'])
export class Category extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: true })
    title: string;

    // relation to talents
    @ManyToMany(
        (type) => Talent,
        (talentsEntity) => talentsEntity.workingCategories,
        { eager: false },
    )
    talents: Talent[];
}

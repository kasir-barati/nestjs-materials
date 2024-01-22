import {
    Column,
    Entity,
    ManyToMany,
    PrimaryGeneratedColumn,
    Unique,
} from 'typeorm';
import { YourBaseEntity } from '../../../utils/your-base-entity.util';
import { Talent } from '../../talent/entities/talent.entity';

@Entity('categories')
@Unique(['title'])
export class Category extends YourBaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: true })
    title: string;

    @ManyToMany(() => Talent, (talent) => talent.categories)
    talents: Talent[];
}

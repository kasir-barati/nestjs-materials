import {
    Entity,
    PrimaryGeneratedColumn,
    BaseEntity,
    ManyToMany,
    JoinTable,
    Column,
} from 'typeorm';
import { Category } from '../../category/entities/category.entity';

// Most of the users' data would be kept in our lovely fusionauth
@Entity('talents')
export class Talent extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ default: true })
    isActive: boolean;

    @Column({})
    isAdaptable: boolean;

    @ManyToMany((type) => Category, (category) => category.talents, {
        eager: true,
    })
    @JoinTable({ name: 'talents_working_categories' })
    workingCategories: Category[];
}

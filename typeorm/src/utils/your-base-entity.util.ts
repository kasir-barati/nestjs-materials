import {
    BaseEntity,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';

/**
 * @description The number inside the CURRENT_TIMESTAMP parentheses represents the precision of the fractional seconds. In this case, it means the function will include microseconds in the result.
 */
export class YourBaseEntity extends BaseEntity {
    @CreateDateColumn({
        name: 'created_at',
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP(6)',
    })
    public createdAt: Date;

    @UpdateDateColumn({
        name: 'updated_at',
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP(6)',
        onUpdate: 'CURRENT_TIMESTAMP(6)',
    })
    public updatedAt: Date;
}

import { ClassConstructor } from 'class-transformer';

export interface TypeMappings {
    [x: string]: ClassConstructor<any>[];
}

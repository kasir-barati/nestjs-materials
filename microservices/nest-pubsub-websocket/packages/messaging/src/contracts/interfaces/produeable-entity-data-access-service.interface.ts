export interface IProducibleEntityDataAccessService<Entity> {
    getEventRepresentation(entityId: string): Promise<Entity>;
}

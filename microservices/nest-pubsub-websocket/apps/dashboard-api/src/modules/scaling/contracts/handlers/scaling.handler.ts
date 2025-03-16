import { DashboardEvent } from 'common';

export abstract class IScalingHandler {
    abstract broadcast(event: DashboardEvent): Promise<void>;
}

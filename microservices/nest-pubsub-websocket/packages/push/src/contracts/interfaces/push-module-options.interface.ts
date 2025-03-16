export interface PushModuleOptions {
    // We dont need any prefix because each stage has its own redis instance
    channel: string;
}

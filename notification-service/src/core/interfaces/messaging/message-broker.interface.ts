export interface IMessageBroker {
    publish(
        topic: string,
        message: any,
        exchangeType: 'direct' | 'topic' | 'fanout',
        exchangeName?: string
    ): Promise<void>;
    subscribe(
        topic: string,
        handler: (message: any) => Promise<void>,
        exchangeType: 'direct' | 'topic' | 'fanout',
        exchangeName?: string
    ): Promise<void>;
    unsubscribe(topic: string): Promise<void>;
    connect(): Promise<void>;
    disconnect(): Promise<void>;
}
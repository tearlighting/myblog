import type { IBlocker } from './Blocker';

export interface IPublisher<TTopic extends any = string> {
    publish(topic: TTopic, data: any): void
}

export class Publisher<TTopic extends any = string> implements IPublisher<TTopic> {
    constructor(private _blocker: IBlocker<TTopic>) { }
    publish<T = never>(topic: TTopic, data: T) {
        this._blocker.publish(topic, data)
    }
}


import type { IBlocker } from "./Blocker"

export interface ISubscriber<TTopic extends any = string> {
    subscribe(topic: TTopic, callback: (data: any) => void): () => void // return unsubscribe function
}

export class Subscriber<TTopic extends any = string> implements ISubscriber<TTopic> {
    constructor(private _blocker: IBlocker<TTopic>) { }
    subscribe(topic: TTopic, callback: (data: any) => void) {
        return this._blocker.subscribe(topic, callback)
    }

}

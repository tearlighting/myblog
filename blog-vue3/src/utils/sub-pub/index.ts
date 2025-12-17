import { Blocker, type IBlocker } from "./Blocker"
import { Publisher, type IPublisher } from "./Publisher"
import { Subscriber, type ISubscriber } from "./Subscriber"

export class SubPub<TTopic extends any = string> {
    public subscriber: ISubscriber<TTopic>
    public publisher: IPublisher<TTopic>
    public blocker: IBlocker<TTopic>
    constructor() {

        this.blocker = new Blocker()
        this.subscriber = new Subscriber(this.blocker)
        this.publisher = new Publisher(this.blocker)
    }
    publish<TData>(topic: TTopic, data?: TData) {
        this.publisher.publish(topic, data)
    }
    subscribe<TData>(topic: TTopic, callback: (data: TData) => void) {
        this.subscriber.subscribe(topic, callback)
    }
    removeTopic(topic: TTopic) {
        this.blocker.removeTopic(topic)
    }
    destroy() {
        this.blocker.destroy()
    }
}

export const createSubPubIns = <T extends any = string>() => new SubPub<T>()

export const createUseSubBub = <T extends any = string>() => {
    const useSubPub = () => {
        const subPubIns = createSubPubIns<T>();
        const init = (payload: {}) => {

        }
        const dispose = () => {
            subPubIns.destroy()
        }
        return {
            subPubIns,
            init,
            dispose
        }
    }
    return useSubPub
}
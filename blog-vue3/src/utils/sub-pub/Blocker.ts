export interface IBlocker<TTopic extends any = string> {
    subscribe: (topic: TTopic, callback: Function) => () => void // unsubscribe
    removeTopic(topic: TTopic): void
    destroy: () => void
    publish: (topic: TTopic, data: any) => void
}

export class Blocker<TTopic extends any = string> implements IBlocker<TTopic> {
    private _listeners: Map<TTopic, Function[]> = new Map()
    subscribe(topic: TTopic, callback: Function) {
        if (!this._listeners.has(topic)) {
            this._listeners.set(topic, [])
        }
        const listenersAlias = this._listeners.get(topic)!
        listenersAlias.push(callback)
        return () => listenersAlias.splice(listenersAlias.indexOf(callback), 1)
    }
    removeTopic(topic: TTopic) {
        this._listeners.has(topic) && this._listeners.delete(topic)
    }
    destroy() {
        this._listeners.clear()
    }
    publish<T>(topic: TTopic, data: T) {
        const listeners = this._listeners.get(topic) || []
        listeners.forEach((listener) => listener(data))
    }
}

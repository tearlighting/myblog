interface IUseSentinelObserverBuildProps {
    root: HTMLElement
    sentinel: HTMLElement
    onReachBottom: () => void
}

interface IUseSentinelObserver extends IDisposableStore<{}> {
    build: (props: IUseSentinelObserverBuildProps) => void
}
export const useSentinelObserver = (): IUseSentinelObserver => {
    const observer = {
        current: null as IntersectionObserver | null,
    }

    const init = () => {

    }

    const dispose = () => {
        observer.current?.disconnect()
        observer.current = null
    }
    const build = ({ onReachBottom, root, sentinel }: IUseSentinelObserverBuildProps) => {
        if (observer.current) return
        const observerIns = new IntersectionObserver(
            (entries) => {
                const entry = entries[0]
                if (entry.isIntersecting) {
                    onReachBottom()
                }
            },
            {
                root: root,
                rootMargin: '100px', //  提前触发
                threshold: 0,
            }
        )
        observerIns.observe(sentinel)
    }
    return {
        build,
        dispose,
        init
    }

}
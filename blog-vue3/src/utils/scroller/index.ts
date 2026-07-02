import Lenis from "lenis"
interface IScrollOptions {
    smoothWheel?: boolean
    lerp?: number
    /**
     * 触发 虚拟滚动的方法
     */
    eventsTarget?: HTMLElement | Window
    /**
     * 滚动容器
     */
    wrapper?: HTMLElement | Window
    /**
     * 滚动内容
     */
    content?: HTMLElement
}
export const createLenis = ({ lerp = 0.12, smoothWheel = true, eventsTarget = window, wrapper, content }: IScrollOptions = {}) => {
    const lenis = new Lenis({
        smoothWheel,
        lerp,
        eventsTarget,
        wrapper,
        content

    })
    function raf(time: number) {
        lenis!.raf(time)
        requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)
    return lenis
}
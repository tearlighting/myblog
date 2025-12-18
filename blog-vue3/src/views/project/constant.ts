/**
 * 整个页面的运行阶段
 * 主要是动画用
 */
export const enum ECarouselPhase {
    idle = 'idle',
    ready = 'ready',
    switching = 'switching',
}

export const enum ECarouselScroll {
    update = 'update',
    switch = 'switch',
}
/**
 * 整个页面的运行阶段
 * 主要是动画用
 */
export const enum ECarouselPhase {
    /**
     * 渲染对应ProjectItems阶段，css已经包括
     */
    initing = 'initing',
    rendered = 'rendered',
    /**
     * 积累deltY阶段
     */
    dragging = 'dragging',
    /**
     * 超过阈值，触发切换前特效
     */
    committing = 'committing',
    /**
     * 销毁旧ProjectItem，生成新的ProjectItem
     */
    switching = 'switching',
}
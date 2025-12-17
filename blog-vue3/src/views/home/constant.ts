export const enum ELumiState {
    idle = 'idle',
    /**
     * 加载当前图片
     */
    loading = 'loading',
    /**
     * 图片加载完成
     */
    loaded = 'loaded',

    /**
     * 正在展示当前图片
     */
    showing = 'showing',

    /**
     * 离开当前图片
     */
    leaving = 'leaving',
    /**
     * 离开完成
     * 可以切换图片了
     */
    leaved = 'leaved'

}
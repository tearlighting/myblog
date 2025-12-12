// ❗️最终冻结版，不再新增字段
export interface LumiSlideMetrics {
    containerW: number
    containerH: number
    imgW: number
    imgH: number
    scaledH: number
    maxOffset: number
}


export function computeLumiMetrics(
    img: HTMLImageElement,
    container: HTMLElement
): LumiSlideMetrics {
    const { width: containerW, height: containerH } =
        container.getBoundingClientRect()

    const imgW = img.naturalWidth
    const imgH = img.naturalHeight

    // ⚠️ 关键：基于 width 的等比缩放（object-fit: cover）
    const scale = containerW / imgW
    const scaledH = imgH * scale

    const maxOffset = Math.max(0, scaledH - containerH)

    return {
        containerW,
        containerH,
        imgW,
        imgH,
        scaledH,
        maxOffset,
    }
}



/**
 * 数组的循环索引
 * @param index
 * @param length
 * @returns
 */
export function loopIndex(index: number, length: number) {
  return (index + length) % length
}
/**
 *
 * @param ms
 * @returns
 */
export const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms))


export function mergeByKey<T>(
  target: T[],
  incoming: T[],
  getKey: (item: T) => string
) {
  const indexMap = new Map<string, number>()

  // 建立 target 的索引表
  target.forEach((item, index) => {
    indexMap.set(getKey(item), index)
  })

  for (const item of incoming) {
    const key = getKey(item)
    const idx = indexMap.get(key)

    if (idx === undefined) {
      // 新数据 → append
      target.push(item)
    } else {
      // 已存在 → 覆盖（保持数组位置不变）
      target[idx] = item
    }
  }
}


/**
 * 二分查找第一个top小于0的元素
 * @param tocElMap 
 * @param scroller 
 * @param offset 你 sticky header / padding 如果有遮挡，这里加个 offset
 * @param threshold 切换阈值,留一个区间去稳定
 * @returns 
 */
export const getTopElement = (tocElMap: Map<string, HTMLElement>, scroller: HTMLElement, offset: number = 0, threshold = 0) => {
  let left = 0
  let right = tocElMap.size - 1
  const keys = Array.from(tocElMap.keys())
  const topBase = scroller.getBoundingClientRect().top
  while (left < right) {
    //左边保留比较危险，而且mid也是左偏，必须加1
    const mid = Math.floor((left + right + 1) / 2)
    const anchor = keys[mid]
    const el = tocElMap.get(anchor)!
    const d = el.getBoundingClientRect().top - topBase - offset
    if (d <= threshold) {
      left = mid
    } else {
      right = mid - 1
    }
  }
  return keys[left]
}

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
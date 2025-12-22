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

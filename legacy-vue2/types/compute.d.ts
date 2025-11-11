type IsUnion<T, U extends T = T> =
  /**
   * 一开始的any是确保ts会去分发计算里面的
   */
  (T extends any ? (U extends T ? "false" : "true") : never) extends "false" ? "false" : "true"

type TT = { name: string } | 1
type B = IsUnion<TT>

//为什么最后是T
/**
 * 最后一个会变成[last] extends [last,...[]]
 * 最后一次T就是空数组
 */
type ReversArray<T extends []> = T extends [infer One, ...infer Rest] ? [...ReversArray<Rest>, One] : T

type String2Union<T extends string> = T extends `${infer One}${infer Rest}` ? One | String2Union<Rest> : never
// type T = '临兵斗者皆阵列前行'
// type S = String2Union<T>

function isOfType<T>(target: any, ...arg: (keyof T)[]): target is T {
  return arg.every((p) => target[p])
}

// as 的重映射,又或者重命名
interface IConfig {
  name: string
  age: number
}

/**
 * P会分发,在K里面的时候,重新映射为never
 */
type MyOmit<T extends Record<string, any>, K extends keyof T> = {
  [P in keyof T as P extends K ? never : P]: T[P]
}
/**
 * age=>never
 */
type Name = MyOmit<IConfig, "age">

//联合转交叉
type Union2Intersection<T> = T extends any ? (arg: T) => any extends (arg: infer R) => any ? R : never : never

type u = Union2Intersection<{ id: 1 } | { name: 1 }>

//Array转联合

type Array2Union<T extends any[]> = T extends [infer First, ...infer Rest] ? First | Array2Union<Rest> : never

type a = [1, 2, 3]

type ua = Array2Union<a>

//联合转Array

// type Union2Tuple<T,R extends any[] = []> = T extends any ? (((arg: T) => any) extends (arg: infer R) => any ?
//    Union2Tuple<>

// : never) : never

// type TU = { id: 1 } | { name: 1 }

// type b = Union2Tuple<TU>

type ArrayType<T extends any[]> = T extends Array<infer R> ? R : never

import { Module } from "vuex"

/**
 * 为了方便Vuex类型推断
 * @param data
 * @returns
 */
export function createVuexStore<T extends {}, R = {}>(data: Module<T, R>): Module<T, R> {
  return data
}

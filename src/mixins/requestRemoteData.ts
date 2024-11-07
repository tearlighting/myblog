import vue,{ ComponentOptionsBase, ComponentOptionsMixin, VueConstructor, Data } from "vue"

interface IRequestProps<TKey extends string, TValue extends any, TRequestMethod extends string = string> {
  key: TKey
  defaultValue?: TValue
  requestMethod?: string
}

type TData<TKey extends string,TValue,TLoading extends string = AddLoading<TKey>> = {
    [k in TKey]:TValue;
}  & {
	[k in TLoading]:boolean
}

type AddLoading<T extends string> = T extends string? `${T}Loading` :never

export function createRequestMixins<TKey extends string, 
 TValue extends any,
 TRequestMethod extends string = string>({ key, defaultValue = null, requestMethod,}: IRequestProps<TKey, TValue, TRequestMethod>) {
  requestMethod = requestMethod || `get${key.slice(0, 1).toUpperCase()}${key.slice(1)}`
  const res = {
    data() {
      return {
        [key]: defaultValue,
		[`${key}Loading`]:true
      } as TData<TKey, TValue>
    },
    created() {
      ;(this as any)[requestMethod] && (this as any)[requestMethod]()
    },
  }
  return res
}



import { getAuthorization, setAuthorization } from "@/hooks/useAuthorization"
import axios, { type AxiosRequestConfig } from "axios"

function createRequest({ baseURL, timeout = 5000 }: AxiosRequestConfig = {}) {
  const instance = axios.create({
    baseURL,
    timeout,
  })

  instance.interceptors.request.use((config) => {
    const token = getAuthorization()
    if (token) {
      config.headers.authorization = token
    }
    //cors sessinID统一
    config.withCredentials = true
    return config
  })
  instance.interceptors.response.use((response) => {
    setAuthorization(response!.headers as any)
    return response.data
  })

  function request<T>(config: AxiosRequestConfig) {
    const defaultConfig: AxiosRequestConfig = {
      headers: {},
    }
    try {
      return instance({ ...defaultConfig, ...config }).catch((e) => {
        throw e
      }) as any as Promise<IResponse<T>>
    } catch (err) {
      return Promise.reject(err)
    }
  }

  return { request }
}

export const { request } = createRequest({
  baseURL: import.meta.env.VITE_API_BASE_URL,
})

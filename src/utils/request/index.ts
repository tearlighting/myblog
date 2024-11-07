import { getAuthorization, setAuthorization } from "@/hooks/useAuthorization"
import axios, { AxiosRequestConfig } from "axios"

function useRequestHook({ baseURL = "/api", timeout = 5000 }: AxiosRequestConfig = {}) {
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
    setAuthorization(response.headers)
    return response.data
  })

  function request<T>(config: AxiosRequestConfig) {
    const defaultConfig: AxiosRequestConfig = {
      headers: {},
    }
    //@ts-ignore
    return new Promise((resove) => {
      setTimeout(() => {
        resove(instance({ ...defaultConfig, ...config }) as unknown as Promise<IResponse<T>>)
      }, 1000)
    }) as Promise<IResponse<T>>
    // return Promise<IResponse<T>>
  }

  return { request }
}

const { request } = useRequestHook({ baseURL: "http://localhost:8888/api" })

export default request

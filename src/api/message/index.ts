import { request } from "@/utils"
import { ICommentItem } from "blog"
import { messages } from "./mock"

export const getMessages = () => {
  return request<{ total: number; rows: ICommentItem[] }>({
    url: "/message",
  }).catch(() => messages as any)
}

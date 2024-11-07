import { EPemission } from "@/store/pemission"

export interface IUser {
  name: string
  loginId: string
  role: EPemission
}

export interface ILoginProps {
  username: string
  password: string
  captcha: string
  remember?: string | number
}

export interface ILoginReturn extends IUser {
  role: EPemission
}

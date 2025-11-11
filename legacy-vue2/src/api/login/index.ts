import { EPemission } from "@/store/pemission"
import { request } from "@/utils"
import { ILoginProps, ILoginReturn, IUser } from "login"

enum EUserInfo {
  userInfo = "userInfo",
}

// const userInfo: ILoginReturn = {
//   name: "bell",
//   role: EPemission.admin,
// }

export const login = <T extends ILoginProps>({ username: loginId, password: loginPwd, captcha, remember = 1 }: T) => {
  //   fetch("http://localhost:8888/api/login")
  return request<IUser>({
    method: "post",
    url: "login",
    data: {
      loginId,
      loginPwd,
      captcha,
      remember,
    },
    withCredentials: true,
  })

  // .catch(() => {})
  // .then(() => {
  //   localStorage.setItem(EUserInfo.userInfo, JSON.stringify(userInfo))
  //   return {
  //     code: 200,
  //     data: userInfo,
  //   }
  // })
}

export const whoAmI = async () => {
  //   console.log("who ")
  return request<IUser>({
    url: "whoAmI",
    method: "get",
    withCredentials: true,
  })
}

export const getCaptcha = () => {
  return request<Buffer>({
    url: "captcha",
    //想要共享sessionid，需要api统一带cookie
    withCredentials: true,
  })
}

/**
 * 在localStorge中操作
 */
const SITENAME = import.meta.env.VITE_API_SITE_NAME
function useAuthorization() {
  /**
   *  如果同时使用了cookie，可能需要后台清下cookie
   */
  function clearAuthorization() {
    localStorage.removeItem(SITENAME)
  }
  function setAuthorization<T extends { authorization?: string }>({ authorization }: T) {
    authorization && localStorage.setItem(SITENAME, authorization)
  }
  function getAuthorization() {
    return localStorage.getItem(SITENAME)
  }
  return {
    clearAuthorization,
    setAuthorization,
    getAuthorization,
  }
}

export const { clearAuthorization, setAuthorization, getAuthorization } = useAuthorization()

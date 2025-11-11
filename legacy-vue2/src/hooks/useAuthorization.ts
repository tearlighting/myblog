/**
 * 在localStorge中操作
 */
enum EMyblogToken {
  key = "MyblogToken",
}
function useAuthorization() {
  //todo
  /**
   *  如果同时使用了cookie，可能需要后台清下cookie
   */
  function clearAuthorization() {
    localStorage.removeItem(EMyblogToken.key)
  }
  function setAuthorization({ authorization = "" }) {
    authorization && localStorage.setItem(EMyblogToken.key, authorization)
  }
  function getAuthorization() {
    return localStorage.getItem(EMyblogToken.key)
  }
  return {
    clearAuthorization,
    setAuthorization,
    getAuthorization,
  }
}

const { clearAuthorization, setAuthorization, getAuthorization } = useAuthorization()

export { clearAuthorization, setAuthorization, getAuthorization }

// class A {
//   a = "A"
//   test() {
//     console.log(this.a)
//   }
//   t(fun: () => void) {
//     console.log(this)

//     fun()
//   }
// }

// class BB {
//   a = "b"
//   test() {
//     console.log(this)

//     console.log(this.a)
//   }
//   t = () => {
//     //@ts-ignore
//     console.log(this)
//   }
// }

// // const a = new A()
// const b = new BB()

// // a.t(b.t)
// import { EventEmitter } from "../eventmitter"
// const myEmitter = new EventEmitter()

// myEmitter.emit("test")

export function debonce<T extends (...arg: any) => any, TParam extends any[] = Parameters<T>>(func: T, duration = 500) {
  let timer: number = null
  return function (...arg: TParam) {
    timer && clearTimeout(timer)
    timer = setTimeout(() => {
      return func(...arg)
    }, duration) as unknown as number
  }
}

// type MyFunctionParams<T extends (...arg: any) => any> = T extends (first: infer F, ...arg: infer R) => any ? F : never

// function t(a: number, b: string) {}
// type T = Parameters<typeof t>

// function b(...a: T) {}

# avatar

```ts
interface props {
  url?: string //img url
  size?: number //img size
}
```

# icon

```ts
interface props {
  type: "home" | "success" | "close" | "error" | "warn" | "info" | "blog" | "code" | "about" | "wechat" | "email" | "github" | "qq" | "arrowUp" | "arrowDown" | "empty" | "chat"
}
```

# pagination

```ts
interface props {
  current: number
  pageSize?: number
  total: number
  //可以显示的页面数量
  visibleNumber?: number
}

interface emit {
  pageChange: (page: number) => void
}
```

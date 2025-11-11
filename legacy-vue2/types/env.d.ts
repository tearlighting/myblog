// env.d.ts
declare namespace NodeJS {
  interface ProcessEnv {
    VUE_APP_API_PREFIX: string
    NODE_ENV: "development" | "production" | "test"
  }
}

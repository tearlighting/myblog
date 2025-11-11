module.exports = {
  presets: ["@vue/cli-plugin-babel/preset"],
  plugins: [
    [
      "prismjs",
      {
        languages: ["javascript", "css", "typescript"],
        plugins: ["line-numbers", "line-highlight"],
        css: true,
      },
    ],
  ],
}

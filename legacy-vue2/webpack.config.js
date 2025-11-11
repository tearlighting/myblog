module.exports = {
  module: {
    rules: [
      {
        test: /\.(mp3|wav|m4a)$/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 8192, // 8kb 以下的文件会转换为 Base64，以上则交给 file-loader 处理
              name: "assets/audio/[name].[hash:8].[ext]", // 输出路径和文件名
            },
          },
        ],
      },
    ],
  },
}

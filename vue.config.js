module.exports = {
  publicPath: "./",
  indexPath: "index.html",
  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.(wav|m4a|lrc)$/,
          use: [
            {
              loader: "url-loader",
              options: {
                limit: 10, // 8kb 以下的文件会转换为 Base64，以上则交给 file-loader 处理
                name: "assets/audio/[name].[hash:8].[ext]", // 输出路径和文件名
              },
            },
          ],
        },
        {
          test: /\.(jfif)$/,
          use: [
            {
              loader: "file-loader",
              options: {
                name: "[path][name].[ext]",
              },
            },
          ],
        },
      ],
    },
  },
}

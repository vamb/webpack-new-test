const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.ts$|\.js$/,
        use: {
          loader: 'babel-loader',
          options: { presets: ['@babel/preset-typescript'] }
        }
      },
      // {
      //   test: /\.css$/i,
      //   use: ["style-loader", "css-loader"],
      // },
      /**
       * style-loader + css-loader 处理后，样式代码最终会被写入 Bundle 文件，并在运行时通过 style 标签注入到页面。这种将 JS、CSS 代码合并进同一个产物文件的方式有几个问题：
       * 1. JS、CSS 资源无法并行加载，从而降低页面性能；
       * 2. 资源缓存粒度变大，JS、CSS 任意一种变更都会致使缓存失效。
       */
      {
        test: /\.css$/,
        use: [
          // 根据运行环境判断使用那个 loader
          (process.env.NODE_ENV === 'development' ?
            'style-loader' :
            MiniCssExtractPlugin.loader),
          'css-loader'
        ]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin(),
    new HtmlWebpackPlugin({
      title: '模块标识符',
    }),
  ],
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  },
}

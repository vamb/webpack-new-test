const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
  mode: 'development',
  entry: './src/index.tsx',
  devtool: 'inline-source-map',
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
  module: {
    rules: [
      {
        test: /\.ts$|\.js$/,
        use: {
          loader: 'babel-loader',
          options: { presets: ['@babel/preset-typescript'] }
        }
      },
      {
        test: /\.jsx$/, // 处理并转义 jsx react代码
        loader: "babel-loader",
        options: {
          presets: [
            [
              "@babel/preset-react", {
              "runtime": "automatic" // 将 import React from "react" 自动帮我们注入运行时代码
            }
            ]
          ],
        }
      },
      {
        test: /\.tsx$/, // 对typescript文件的兼容转义
        use: 'ts-loader',
        // loader: 'babel-loader',
        // options: {
        //   'presets': [
        //     [
        //       "@babel/preset-react", {
        //         "runtime": "automatic"
        //       }
        //     ],
        //     '@babel/preset-typescript'
        //   ]
        // }
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
      // {
      //   test: /\.css$/, //兼容 postcss 和普通 css 的转义 - v1
      //   use: [
      //     // 根据运行环境判断使用那个 loader
      //     (process.env.NODE_ENV === 'development' ?
      //       'style-loader' :
      //       MiniCssExtractPlugin.loader),
      //     'css-loader',
      //     "postcss-loader"
      //   ]
      // },
      /**
       * PostCSS 最大的优势在于其简单、易用、丰富的插件生态，基本上已经能够覆盖样式开发的方方面面。实践中，经常使用的插件有：
       *    autoprefixer：基于 Can I Use 网站上的数据，自动添加浏览器前缀
       *    postcss-preset-env：一款将最新 CSS 语言特性转译为兼容性更佳的低版本代码的插件
       *    postcss-less：兼容 Less 语法的 PostCSS 插件，类似的还有：postcss-sass、poststylus
       *    stylelint：一个现代 CSS 代码风格检查器，能够帮助识别样式代码中的异常或风格问题
       */
      {
        test: /\.css$/, //兼容 postcss 和普通 css 的转义 - v2
        use: [
          // 根据运行环境判断使用那个 loader
          (process.env.NODE_ENV === 'development' ?
            'style-loader' :
            MiniCssExtractPlugin.loader),
          {
            loader: "css-loader",
            options: {
              importLoaders: 1
            }
          },
          // {
          //   loader: "postcss-loader",
          //   options: {
          //     postcssOptions: {
          //       // 添加 autoprefixer 插件
          //       plugins: [require("autoprefixer")], // 可为 CSS 代码自动添加浏览器前缀
          //     },
          //   },
          // }
          "postcss-loader" // - v3 相关配置 被移到了postcss.config.js里面 --- PostCSS 与预处理器并非互斥关系，我们完全可以在同一个项目中同时使用两者
        ]
      },
      {
        test: /\.less$/, //兼容 less 的转义
        use: [
          // 根据运行环境判断使用那个 loader
          (process.env.NODE_ENV === 'development' ?
            'style-loader' :
            MiniCssExtractPlugin.loader),
          {
            loader: "css-loader",
            options: {
              importLoaders: 1
            }
          },
          "postcss-loader",
          'less-loader'
        ]
      },
      {
        test: /\.s[ac]ss$/, //兼容 sass 的转义
        use: [
          // 根据运行环境判断使用那个 loader
          (process.env.NODE_ENV === 'development' ?
            'style-loader' :
            MiniCssExtractPlugin.loader),
          {
            loader: "css-loader",
            options: {
              importLoaders: 1
            }
          },
          "postcss-loader",
          "sass-loader"
        ],
      },
      {
        test: /\.styl$/, //兼容 stylus 的转义
        use: [
          // 根据运行环境判断使用那个 loader
          (process.env.NODE_ENV === 'development' ?
            'style-loader' :
            MiniCssExtractPlugin.loader),
          {
            loader: "css-loader",
            options: {
              importLoaders: 1
            }
          },
          "postcss-loader",
          "stylus-loader"
        ],
      },
    ]
  },
  devServer: {
    hot: true,
    open: true
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

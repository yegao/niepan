'use strict'
const path = require('path')
const utils = require('./utils')
const config = require('../config')

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

module.exports = {
  context: path.resolve(__dirname, '../'),
  entry: {
    app: './src/index.js'
  },
  output: {
    path: config.build.assetsRoot,//path.resolve(__dirname, '../dist')
    filename: '[name].js',
    publicPath: process.env.NODE_ENV === 'production'
      ? config.build.assetsPublicPath    //'/'
      : config.dev.assetsPublicPath      //'/develop'
  },
  resolve: {
    //require('./a')就可能去找./a.js、./a.vue、./a.json
    extensions: ['.js', '.json', '.np'],
    //require('@/a')相当于require('src/a')
    alias: {
      '@': resolve('src'),
    }
  },
  module: {
    rules: [
      {
        test: /\.np$/,
        loader: 'np-loader',
        // options:
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        //只转化src、node_modules/webpack-dev-server/client这些目录下的js文件
        include: [resolve('src'), resolve('node_modules/webpack-dev-server/client')]
      },
      //图片
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      //音频
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('media/[name].[hash:7].[ext]')
        }
      },
      //字体
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  },
  //node中每个属性都是 Node.js 全局变量或模块的名称
  //每一项的设置值都可以是（true/mock/empty/false）中的一种
  //以确定这些node中的对象在其它环境中是否可用
  node: {
    // prevent webpack from injecting useless setImmediate polyfill because Vue
    // source contains it (although only uses it if it's native).
    // 防止webpack注入无用的setImmediate polyfill，因为Vue的源码中已经包含了这些
    setImmediate: false,
    // prevent webpack from injecting mocks to Node native modules
    // that does not make sense for the client
    // 防止webpack向Node原生模块中注入模拟代码,这个对客户端没有意义
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty'
  }
}

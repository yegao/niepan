'use strict'
const path = require('path')
module.exports = {
  dev: {
    assetsSubDirectory: 'static',//资源子目录
    assetsPublicPath: '/develop',//资源在服务器上的前缀
    proxyTable: {},//定义开发服务器的代理规则
    host: 'localhost', //服务器主机(域名),可以被process.env.HOST重写
    port: 8080, //开发服务器监听的特定端口,可以被process.env.PORT重写,如果端口已经被使用了,就会使用一个随机的端口
    autoOpenBrowser: false,//默认在浏览器中打开
    errorOverlay: true,
    notifyOnErrors: true,
    poll: false, //https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-
    //Source Maps
    // https://webpack.js.org/configuration/devtool/#development
    devtool: 'cheap-module-eval-source-map',
    cacheBusting: true,
    cssSourceMap: true
  },
  build: {
    index: path.resolve(__dirname, '../dist/index.html'),//index.html模板
    // 指向包含应用程序的所有静态资产的根目录
    // 被webpack编译处理过的资源文件都会在这个build.assetsRoot目录下
    assetsRoot: path.resolve(__dirname, '../dist'),//资源根目录
    // 假如build.assetsRoot参数是'/path/to/dist'，build.assetsSubDirectory参数是'static'
    // 那么所有webpack资源会被编译到path/to/dist/static目录。
    // 每次编译前，这个目录会被清空，所以这个只能放编译出来的资源文件。
    // static/目录的文件会在构建过程中直接被拷贝到这个目录。
    // 这意味着如果你要改变这个规则，所有依赖于static/的文件的绝对地址都需要改变。
    assetsSubDirectory: 'static',//资源子目录
    // 服务器中静态资源的前缀
    // 这个是通过http服务器运行的url路径。在大多数情况下，这个是根目录(/)。
    // 如果你的后台框架对静态资源url有前缀要求，你仅需要改变这个参数。
    // 在内部，这个是被webpack当做output.publicPath来处理的。
    assetsPublicPath: '/',
    productionSourceMap: true,//在构建生产环境版本时是否开启source map。
    // https://webpack.js.org/configuration/devtool/#production
    devtool: '#source-map',
    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],
    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  }
}

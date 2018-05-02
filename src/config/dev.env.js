'use strict'
const merge = require('webpack-merge')//一个可以合并数组和对象的插件
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"'
})

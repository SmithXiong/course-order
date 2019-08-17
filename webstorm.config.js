/**
 * 功能描述：
 * 2019/8/17
 * 作者：xm
 */
'use strict';
const path = require('path');

function resolve (dir) {
  return path.join(__dirname, '.', dir)
}

module.exports = {
  context: path.resolve(__dirname, './'),
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      '@': resolve('src')
    }
  }
};

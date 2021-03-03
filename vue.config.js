const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  /* chainWebpack: webpackConfig => {
    webpackConfig.module
     .rule('wasm')
       .test(/.wasm$/)
       .use('wasm-loader')
       .loader('wasm-loader')
  } */
  configureWebpack: {
      plugins: [
          new CopyWebpackPlugin({
            patterns: [{
                from: 'node_modules/@hpcc-js/wasm/dist/graphvizlib.wasm',
                to: path.resolve(__dirname, 'public/js')
            }]
        })
      ]
  }
}
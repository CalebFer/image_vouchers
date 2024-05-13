const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true
})
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = {
  devServer: {
    proxy: {
      '/proxy': {
        target: 'https://sistemas.cepreuna.edu.pe',
        changeOrigin: true,
        pathRewrite: {
          '^/proxy': '/storage/vouchers', // reescribe la ruta
        },
      },
    },
  },
};
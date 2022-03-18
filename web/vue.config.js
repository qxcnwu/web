module.exports={
  pages: {
    index: {
      //入口
      entry:"src/main.js",
    },
  },
  devServer: {
    proxy: {
      '/api': {
        target: 'http://159.75.14.197:80/',
        pathRewrite:{'^/api':''},
        ws: true,
        changeOrigin: true
      }
    }
  }
}


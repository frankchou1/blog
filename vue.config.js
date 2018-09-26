module.exports = {
    devServer: {
        // host: '0.0.0.0',
        // port: 8080,
        // https:false,
        // hotOnly:false,
        proxy:{
            '/api': {
                target: 'http://localhost:1111',
                changeOrigin: true,
                pathRewrite: {
                    '^/api': ''
                }
            }
        }
    }
}
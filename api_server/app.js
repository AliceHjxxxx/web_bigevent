//导入express
const express = require('express')
    //创建服务器的实例化对象
const app = express()
    // 启动服务器
const joi = require('@hapi/joi')
    // 导入 cors 中间件
const cors = require('cors')

// 将 cors 注册为全局中间件
app.use(cors())

//配置解析表单数据的中间件
app.use(express.urlencoded({ extended: false }))
    // 一定要在路由之前封装res.cc函数
app.use((req, res, next) => {
        //status默认值为1，表示失败的情况
        //err的值，可能是个错误对象，也可能是一个错误的描述字符串
        res.cc = function(err, status = 1) {
            res.send({
                status,
                // err instanceof Error表示如果err是Error的一个对象实例，就直接将err给err.message
                message: err instanceof Error ? err.message : err,
            })
        }
        next()
    })
    //解析Token的中间件，一定要在路由之前解析配置token的中间件
const expressJWT = require('express-jwt')
const config = require('./config')
    // 使用 .unless({ path: [/^\/api\//] }) 指定哪些接口不需要进行 Token 的身份认证，
app.use(expressJWT({ secret: config.jwtSecretKey }).unless({ path: [/^\/api\//] }))




// 导入并使用用户路由模块
const userRouter = require('./router/user')
const userinfoRouter = require('./router/userinfo')
app.use('/api', userRouter)
app.use('/my', userinfoRouter)

const artCateRouter = require('./router/artcate')
app.use('/my/artcate', artCateRouter)

const articleRouter = require('./router/article')
app.use('/my/article', articleRouter)
    //定义错误界别的中间件
    // 静态托管upload下的文件
app.use('/upload', express.static('./upload '))
app.use((err, req, res, next) => {
    if (err instanceof joi.ValidationError) return res.cc(err)
    if (err.name === 'UnauthorizedError') return res.cc('身份认证失败')
        //未知的错误
    res.cc(err)

})
app.listen(3007, () => {
    console.log('api server running at http://127.0.0.1:3007')
})
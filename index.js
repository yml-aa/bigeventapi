// 1、导入express模块
const express = require('express')
const cors = require('cors')
const path = require('path')
const jwt = require('express-jwt')
const loginRouter = require(path.join(__dirname,'./routers/login.js'))
const userRouter = require(path.join(__dirname,'./routers/user.js'))
const cateRouter = require(path.join(__dirname,'./routers/cate.js'))
const articleRouter = require(path.join(__dirname,'./routers/article.js'))
// 2、创建express实例
const app = express()

// 处理静态资源服务
// 静态资源服务参数一表示静态资源访问是需要添加一层路径
app.use('/uploads',express.static('uploads'))

// 处理客户端请求参数
// for parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }))
// for parsing application/json
app.use(express.json())

// 设置跨域
app.use(cors())


// 通过中间件统一处理token 解析出用户的信息
// unless的作用：排除一些路径不需要进行token解析
app.use(jwt({secret: 'bigevent'}).unless({path: /^\/api/}))

// 路由需要放在中间件的后面
// 先解析，后面才能获取
// 设置路由
app.use('/api',loginRouter)
app.use('/my',userRouter)
app.use('/my/article',cateRouter)
app.use('/my/article',articleRouter)

// 统一处理不存在的路由
app.all('*',(req,res) => {
    res.status(404).json({
        status: 404,
        message: '请求的资源不存在'
    })
})

// 添加一个中间件 统一处理异常信息
app.use((err,req,res,next) => {
    if(err.status === 401) {
        // status参数401表示http协议的响应状态码
        res.status(401).json({
            status: 401,
            message: err.message
        })
    }else {
        res.json({
            status: 500,
            message: '服务器错误' + err.message
        })
    }
})
// 3、监听端口
app.listen(3000,() =>{
    console.log('running...');
})
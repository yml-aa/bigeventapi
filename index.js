// 1、导入express模块
const express = require('express')
const cors = require('cors')
const path = require('path')
const jwt = require('express-jwt')
const loginRouter = require(path.join(__dirname,'./routers/login.js'))
const userRouter = require(path.join(__dirname,'./routers/user.js'))
// 2、创建express实例
const app = express()

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

// 3、监听端口
app.listen(3000,() =>{
    console.log('running...');
})
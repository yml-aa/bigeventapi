// 1、导入express模块
const express = require('express')
// 2、创建express实例
const app = express()
// 3、监听端口
app.listen(3000,() =>{
    console.log('running...');
})
// 4、处理客户端的请求
app.get('/data',(req,res) => {
    res.send('hello')
})
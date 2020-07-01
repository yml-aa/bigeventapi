/*
    统一管理路由
 */
const express = require('express')
const router = express.Router()
const utils = require('utility')
const jwt = require('jsonwebtoken')
const path = require('path')
const db = require(path.join(__dirname,'../common/db.js'))

// 登录接口
router.post('/login',async (req,res) => {
    // 获取客户端传递过来的参数
    let param = req.body
    // 将密码加密
    param.password = utils.md5(req.body.password)
    // 根据用户名和密码查询数据库
    let sql = 'select * from user where username = ? and password = ?'
    // 如果是查询 ret是数组 如果是增删改 那么ret是对象
    let ret = await db.operateData(sql,[param.username,param.password])
    if(ret && ret.length > 0) {
        // 如果登录成功 就生成一个token
        // jwt.sign方法的参数说明：
        // 1、参数一表示添加到token中的用户信息
        // 2、加密唯一标识(加密的干扰字符串)
        // 3、加密配置选项(可以设置token的有效期)
        let token = jwt.sign({
            username: param.username,
            id: ret[0].id
        },'bigevent',{
            expiresIn: '1h'
        })
        res.json({
            status: 0,
            message: '登录成功',
            // 注意：Bearer 后面需要加空格
            token: 'Bearer ' + token
        })
    }else {
        res.json({
            status: 1,
            message: '登录失败'
        })
    }
})

// 查询 注册接口
router.get('/reguser', async (req, res) => {
    let sql = 'select * from user'
    let ret = await db.operateData(sql, null)
    console.log(ret);
    res.json({
      status: 0,
      data: ret
    })
    // 注册接口
    // async的返回值是一个promise对象
    router.post('/reguser',async (req,res) => {
        // 获得用户输入的信息
        let param = req.body
        console.log(param);
        // 将密码加密
        param.password = utils.md5(req.body.password)
        // 遍历数组
        ret.forEach((item) =>{
            username = item.username
        })
        if(username !== param.username) {
            // 将用户输入的信息插入到数据库中
            let sql = 'insert into user set ?'
            // await 只能出现在async函数中
            // await 的作用是会等待Promise实例完成 将其resolve的结果返回来
            let ret = await db.operateData(sql,param)
            if(ret && ret.affectedRows > 0) {
                res.json({
                    status: 0,
                    message: '注册成功'
                })
            }else {
                res.json({
                    status: 1,
                    message: '注册失败'
                })
            }
        }else {
            res.json({
                message: '用户名被占用'
            })
        }
    })
  })

module.exports = router
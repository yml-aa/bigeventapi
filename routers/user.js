const express = require('express')
const router = express.Router()
const utils = require('utility')
const path = require('path')
const db = require(path.join(__dirname,'../common/db.js'))

// 获取用户信息
router.get('/userinfo',async (req,res) => {
    // 需要根据id去获取用户信息 
    // 用户的id从token中得到 token是加密过的 所有需要解析token得到用户信息id
    // 根据id来查询
    let sql = 'select id,username,nickname,email,user_pic from user where id = ?'
    // 查询 返回的是数组
    // erq.user 是index.js中中间件从token解析出来的用户信息 添加到req.user属性上
    console.log(req.user);
    
    let ret = await db.operateData(sql,req.user.id)
    if(ret && ret.length > 0) {
        res.json({
            status: 0,
            message: '获取用户信息成功！',
            // 取数组中的第一项
            data: ret[0]
        })
    }else {
        res.json({
            status: 1,
            message: '获取用户信息失败！',
        })
    }
})

// 更新用户的基本信息
router.post('/userinfo',async (req,res) => {
    // 获取用户传过来的参数
    let param = req.body
    // console.log(param);
    let sql = 'update user set ? where id = ?'
    let ret = await db.operateData(sql,[{nickname: param.nickname,email: param.email},param.id])
    if(ret && ret.affectedRows > 0){
        res.json({
            status: 0,
            message: '更新用户信息成功'
        })
    }else {
        res.json({
            status: 1,
            message: '更新用户信息失败'
        })
    }
})

// 更改密码
router.post('/updatepwd',async (req,res) => {
    // 获取用户传过来的参数
    let param = req.body
    // console.log(param); 
    // 更改密码的时候也需要加密
    param.oldPwd = utils.md5(param.oldPwd)
    param.newPwd = utils.md5(param.newPwd)
    let id = req.user.id
    let sql = 'update user set password = ? where id = ? and password = ?'
    let ret = await db.operateData(sql,[param.newPwd,id,param.oldPwd])
    if(ret && ret.affectedRows > 0) {
        res.json({
            status: 0,
            message: '修改密码成功'
        })
    }else {
        res.json({
            status: 1,
            message: '修改密码失败'
        })
    }
})

// 更新头像
router.post('/update/avatar',async (req,res) => {
    // 获取用户传过来的参数
    let param = req.body
    // 获取id
    let id = req.user.id
    let sql = 'update user set user_pic = ? where id = ?'
    let ret = await db.operateData(sql,[param.avatar,id])
    if(ret && ret.affectedRows > 0) {
        res.json({
            status: 0,
            message: '更新头像成功'
        })
    }else {
        res.json({
            status: 1,
            message: '更新头像失败'
        })
    }
})
module.exports = router
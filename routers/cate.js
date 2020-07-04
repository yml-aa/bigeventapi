const express = require('express')
const router = express.Router()
const path = require('path')
const db = require(path.join(__dirname,'../common/db.js'))

// 获取文章分类列表
router.get('/cates',async (req,res) => {
    let sql = 'select * from cate'
    let ret = await db.operateData(sql)
    // console.log(ret);
    // 数据库查询 返回得到的是数组
    if(ret && ret.length > 0){
        res.json({
            status: 0,
            message: '查询分类成功!',
            data: ret
        })
    }else {
        res.json({
            status: 1,
            message: '查询分类失败!',
        })
    }
})

// 新增文章分类
router.post('/addcates',async (req,res) => {
    // 获取用户传过来的参数
    let param = req.body
    console.log(param);
    let sql = 'insert into cate set ?'
    let ret = await db.operateData(sql,param)
    if(ret && ret.affectedRows > 0){
        res.json({
            status: 0,
            message: '添加文章分类成功'
        })
    }else {
        res.json({
            status: 1,
            message: '添加文章分类失败'
        })
    }
    
})

// 根据Id删除文章分类
router.get('/deletecate/:id',async (req,res) => {
    // 获取要删除的id
    let id = req.params.id
    // console.log(id);
    // let sql = 'delete from cate where id = ?'
    // 去修改is_delete的状态位去删除分类 而不是彻底的把信息从数据库中删除
    let sql = 'update cate set is_delete = 1 where id = ?'
    let ret = await db.operateData(sql,id)
    if(ret && ret.affectedRows > 0) {
        res.json({
            status: 0,
            message: '删除文章分类成功!'
        })
    }else {
        res.json({
            status: 1,
            message: '删除文章分类失败!'
        })
    }
    
})

// 根据Id获取文章分类
router.get('/cates/:id',async (req,res) => {
    // 获取到id
    let id = req.params.id
    let sql = 'select * from cate where id = ?'
    let ret = await db.operateData(sql,id)
    if(ret && ret.length > 0){
        res.json({
            status: 0,
            message: '获取文章分类数据成功！',
            data: ret
        })
    }else {
        res.json({
            status: 1,
            message: '获取文章分类数据失败！',
        })
    }
})

// 根据Id更新文章分类
router.post('/updatecate',async (req,res) => {
    // 获取用户传过来的参数
    let param = req.body
    let sql = 'update cate set ? where Id = ?'
    let ret = await db.operateData(sql,[{name: param.name,alias: param.alias},param.Id])
    if(ret && ret.affectedRows > 0) {
        res.json({
            "status": 0,
            "message": "更新分类信息成功！"
        })
    }else {
        res.json({
            "status": 1,
            "message": "更新分类信息失败！"
        })
    }
})
module.exports = router
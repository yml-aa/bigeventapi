const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const db = require(path.join(__dirname,'../common/db.js'))
// 设置文件上传的目标路径
const upload = multer({dest: 'uploads/'})

// 发布新文章
router.post('/add',upload.single('cover_img'), async (req,res) => {
    // 获取用户传过来的参数
    let param = req.body
    // 获取用户id
    let id = req.user.id
    // 上传文章封面的路径
    let filePath = '/uploads' + req.file.filename
    let sql = 'insert into article set ?'
    let ret = await db.operateData(sql,{
        title: param.title,
        cate_id: param.cate_id,
        content: param.content,
        cover_img: filePath,
        state: param.state,
        is_delete: 0,
        author_id: id,
        pub_date: new Date()
    })
    if(ret && ret.affectedRows > 0){
        res.json({
            status: 0,
            message: '发布文章成功！'
        })
    }else{
        res.json({
            status: 1,
            message: '发布文章失败！'
        })
    }
})
// 获取文章的列表数据
router.get('/list',async (req,res) => {
    // 获得用户传入的参数
    let param = req.query
    // 得到的数据是字符串 需要转化为数字
    param.pagenum = parseInt(param.pagenum)
    param.pagesize = parseInt(param.pagesize)
    // console.log(param);
    // 操作数据库
    // limit 后的第一个参数是起始位置 表示从第几条开始查询
    // limit 后的第二个参数是长度 也就是表示查询多少条数据
    let condition = ''
  // param = {pagenum: 1, pagesize: 10, cate_id: 1, state: '草稿'}
    for (let key in param) {
        if (key === 'cate_id' && param[key]) {
        condition += key + '=' + param[key] + ' and '
        } else if (key === 'state' && param[key]) {
        condition += key + '="' + param[key] + '" and '
        }
    }
    let sql = 'select a.id, a.title, a.pub_date, a.state, c.name as cate_name from article as a join cate as c on a.cate_id = c.id where a.is_delete = 0 limit ?, ?'
    // 查询列表总数
    let totalSql = 'select count(*) as total from article where is_delete = 0'
    if (condition) {
      condition += ' a.is_delete = 0 '
      // sql = 'select * from article where ' + condition + ' limit ?, ?'
      sql = 'select a.id, a.title, a.pub_date, a.state, c.name as cate_name from article as a join cate as c on a.cate_id = c.id where ' + condition + ' limit ?, ?'
      // 携带条件时查询总数
      totalSql = 'select count(*) as total from article as a where ' + condition
    }
    // 查询列表数据
    let ret = await db.operateData(sql, [param.pagesize * (param.pagenum - 1), param.pagesize])
    // 查询列表总数
    let cret = await db.operateData(totalSql)  
    console.log(cret);
    console.log(ret);
    
    if (ret && ret.length > 0) {
      res.json({
        status: 0,
        message: '查询文章列表数据成功！',
        data: ret,
        total: cret[0].total
      })
    } else {
      res.json({
        status: 1,
        message: '查询文章列表数据失败！'
      })
    }
})
// 根据Id删除文章数据
router.get('/delete/:id',async (req,res) => {
    // 获取用户传过来的id
    let id = req.params.id
    let sql = 'delete from article where id = ?'
    let ret = await db.operateData(sql,3)
    if(ret && ret.affectedRows > 0) {
        res.json({
            "status": 0,
            "message": "删除成功！"
        })
    }else {
        res.json({
            "status": 1,
            "message": "删除失败！"
        })
    }

})
// 根据Id获取文章详情
router.get('/:id',async (req,res) => {
    // 获取用户传过来的参数
    let id = req.params.id
    let sql = 'select * from article where id = ?'
    let ret = await db.operateData(sql,1)
    if(ret && ret.length > 0) {
        res.json({
            status: 0,
            message: '获取文章成功！',
            data: ret
        })
    }else {
        res.json({
            status: 1,
            message: '获取文章失败！',
        })
    }
})
// 根据Id更新文章信息
router.post('/edit',upload.single('cover_img'), async (req,res) =>{
    // 获取用户传递过来的参数
    let param = req.body
    // 上传文章封面的路径
    let filePath = '/uploads' + req.file.filename
    let sql = 'update article set ? where id = ?'
    let ret = await db.operateData(sql,[{
        title: param.title,
        cate_id: param.cate_id,
        content: param.content,
        cover_img: filePath,
        state: param.state
    },param.Id])
    if(ret && ret.affectedRows > 0){
        res.json({
            status: 0,
            message: '修改文章成功'
        })
    }else {
        res.json({
            status: 1,
            message: '修改文章失败'
        })
    }
})
module.exports = router
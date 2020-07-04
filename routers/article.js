const express = require('express')
const router = express.Router()
const path = require('path')
const db = require(path.join(__dirname,'../common/db.js'))

// 发布新文章
router.post('/add',(req,res) => {
    // 获取用户传过来的参数
    let param = req.body
})

// 获取文章的列表数据
router.get('/list',async (req,res) => {
    // 获得用户传入的参数
    let param = req.query
    // 得到的数据是字符串 需要转化为数字
    param.pagenum = parseInt(param.pagenum)
    param.pagesize = parseInt(param.pagesize)
    console.log(param);
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
    // condition = cate_id = 1 and state = '草稿' and
    // 去掉最后一个and 
    condition = condition.substring(0, condition.lastIndexOf('and'))

    let sql = 'select * from article limit ?, ?'
    if (condition) {
        sql = 'select * from article where ' + condition + ' limit ?, ?'
    }
    let ret = await db.operateData(sql,[param.pagesize * (param.pagenum -1),param.pagesize])
    if(ret && ret.length > 0){
        res.json({
            status: 0,
            message: '获取文章列表成功！',
            data: ret
        })
    }else {
        res.json({
            status: 1,
            message: '获取文章列表失败！',
        })
    }
})

// 根据Id删除文章数据
router.get('/delete/:id',(req,res) => {

})

// 根据Id获取文章详情
router.get('/:id',(req,res) => {

})

// 根据Id更新文章信息
router.post('/edit',(req,res) =>{

})
module.exports = router
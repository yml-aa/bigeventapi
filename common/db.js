function operateData (sql,params) {
    return new Promise((resolve, reject) => {
      // 1、导入mysql第三方包
      const mysql = require('mysql')
  
      // 2、准备连接数据库相关参数
      const cn = mysql.createConnection({
        // 数据库所在的电脑的IP地址或者域名
        host: 'localhost',
        // 数据库的端口
        port: 3306,
        // 数据库名称
        database: 'bigeventapi',
        // 数据库账号
        user: 'root',
        // 数据库密码
        password: 'admin123'
      }) 
  
      // 3、执行连接操作
      cn.connect()
  
      // 4、此时就可以对数据库进行操作了
      cn.query(sql, params,(err, result) => {
        if (err) {
          reject(err)
        } else {
          resolve(result)
        }
      })
  
      // 5、关闭数据库连接
      cn.end()
    })
  }
  
  module.exports = {
    operateData
  }
//导入数据库操作模块
const db = require('../db/index')
const bcrypt = require('bcryptjs')
    // 导入生成Token的包
const jwt = require('jsonwebtoken')
    // 导入全局的配置文件
const config = require('../config')
    //注册新用户的处理函数
exports.regUser = (req, res) => {
    //获取客户端提交到服务器的用户信息
    const userinfo = req.body
        // if (!userinfo.username || !userinfo.password) {
        //     return res.cc('用户名或密码不合法')
        //         //res.send({ status: 1, message: '用户名或密码不合法' })
        // }
    const sqlStr = 'select * from ev_users where username=?'
    db.query(sqlStr, userinfo.username, (err, results) => {
        //执行sql语句失败
        if (err) {
            // return res.send({ status: 1, message: err.message })
            return res.cc(err)
        }
        if (results.length > 0) {
            return res.cc('用户名被占用，请更换其他用户名！')
                //res.send({ status: 1, message: '用户名被占用，请更换其他用户名！' })

        }

        //调用hashSync()对密码进行加密
        //console.log(userinfo)
        userinfo.password = bcrypt.hashSync(userinfo.password, 10)
            // console.log(userinfo)
        const sql = 'insert into ev_users set ?'
        db.query(sql, { username: userinfo.username, password: userinfo.password }, (err, results) => {
            if (err) return res.cc(err)
                //return res.send({ status: 1, message: err.message })
                //判断影响行数为是否为1
            if (results.affectedRows !== 1) return res.cc('注册用户失败，请稍后再试')
                //res.send({ status: 1, message: '注册用户失败，请稍后再试' })
            res.cc('注册成功', 0)
                // res.send({ status: 0, message: '注册成功' })
        })
    })

}
exports.login = (req, res) => {
    const userinfo = req.body
    const sqlStr = 'select * from ev_users where username=?'
    db.query(sqlStr, userinfo.username, (err, results) => {
        //执行sql语句失败
        if (err) {
            // return res.send({ status: 1, message: err.message })
            return res.cc(err)
        }
        if (results.length !== 1) {
            return res.cc('登录失败！')
                //res.send({ status: 1, message: '用户名被占用，请更换其他用户名！' })

        }

        const compareResult = bcrypt.compareSync(userinfo.password, results[0].password)
        if (!compareResult) {
            return res.cc('登陆失败')
        }
        const user = {...results[0], password: '', user_pic: '' }
            //    对用户信息进行加密，生成Token字符串
        const tokenStr = jwt.sign(user, config.jwtSecretKey, { expiresIn: config.expiresIn })
            //调用send将token相应给客户端
        res.send({
            status: 0,
            message: '登陆成功',
            token: 'Bearer ' + tokenStr,
        })
    })

}
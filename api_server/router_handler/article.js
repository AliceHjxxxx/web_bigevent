const db = require('../db/index')
    // 导入处理路径的 path 核心模块
const path = require('path')
const firstIndex = 0
    // 发布新文章的处理函数
exports.addArticle = (req, res) => {
    console.log(req.body) // 文本类型的数据
    console.log('--------分割线----------')
    console.log(req.file) // 文件类型的数据
        // 手动判断是否上传了文章封面，关于文章封面在前端已经被限定了
    if (!req.file || req.file.fieldname !== 'cover_img')
        return res.cc('文章封面是必选参数！')


    // TODO 验证完成
    const articleInfo = {
        // 标题、内容、状态、所属的分类Id
        ...req.body,
        // 文章封面在服务器端的存放路径
        cover_img: path.join('/uploads', req.file.filename),
        // 文章发布时间
        pub_date: new Date(),
        // 文章作者的Id
        author_id: req.user.id,
    }
    const sql = `insert into ev_articles set ?`
    db.query(sql, articleInfo, (err, results) => {
        if (err) return res.cc(err)
        if (results.affectedRows !== 1) return res.cc('发布文章失败！')
        res.cc('发布文章成功', 0)
    })
}

exports.initArticle = (req, res) => {
    const firstIndex = 2 * (parseInt(req.body.pagenum) - 1)
    req.body.pagesize = parseInt(req.body.pagesize)
    if (req.body.cate_name && req.body.state) {
        const sql = `SELECT count(*) as total from ev_articles where is_delete=0 and state=? and cate_name=? `
        db.query(sql, [req.body.state, req.body.cate_name], (err, results) => {
            if (err) return res.cc(err)
            if (results.length === 0) return res.cc('不存在相关内容')
            const total = results[0].total
            const sql1 = `SELECT * from ev_articles where is_delete=0  and state=? and cate_name=? limit ?,? `
            db.query(sql1, [req.body.state, req.body.cate_name, firstIndex, req.body.pagesize], (err, results) => {
                if (err) { return res.cc(err) }
                if (results.length === 0) return res.cc('不存在相关内容')
                console.log((2 * (parseInt(req.body.pagenum) - 1)))
                res.send({ status: 0, message: '拉取文章列表成功', data: results, total })
            })
        })

    }
    if (req.body.cate_name && !req.body.state) {
        const sql = `SELECT count(*) as total from ev_articles where is_delete=0 and cate_name=? `
        db.query(sql, [req.body.cate_name], (err, results) => {
            if (err) return res.cc(err)
            if (results.length === 0) return res.cc('不存在相关内容')
            const total = results[0].total
            const sql1 = `SELECT * from ev_articles where is_delete=0 and cate_name=? limit ?,? `
            db.query(sql1, [req.body.cate_name, firstIndex, req.body.pagesize], (err, results) => {
                if (err) { return res.cc(err) }
                if (results.length === 0) return res.cc('不存在相关内容')
                console.log((2 * (parseInt(req.body.pagenum) - 1)))
                res.send({ status: 0, message: '拉取文章列表成功', data: results, total })
            })
        })
    }
    if (!req.body.cate_name && req.body.state) {
        const sql = `SELECT count(*) as total from ev_articles where is_delete=0 and state=?`
        db.query(sql, [req.body.state], (err, results) => {
            if (err) return res.cc(err)
            if (results.length === 0) return res.cc('不存在相关内容')
            const total = results[0].total
            const sql1 = `SELECT * from ev_articles where is_delete=0 and state=? limit ?,? `
            db.query(sql1, [req.body.state, firstIndex, req.body.pagesize], (err, results) => {
                if (err) { return res.cc(err) }
                if (results.length === 0) return res.cc('不存在相关内容')
                console.log((2 * (parseInt(req.body.pagenum) - 1)))
                res.send({ status: 0, message: '拉取文章列表成功', data: results, total })
            })
        })
    }
    if (!req.body.cate_name && !req.body.state) {
        const sql = `SELECT count(*) as total from ev_articles where is_delete=0 `
        db.query(sql, (err, results) => {
            if (err) { return res.cc(err) }
            if (results.length === 0) return res.cc('不存在相关内容')
            const total = results[0].total
            const sql1 = `SELECT * from ev_articles where is_delete=0 limit ?,? `
            db.query(sql1, [firstIndex, req.body.pagesize], (err, results) => {
                if (err) { return res.cc(err) }
                if (results.length === 0) return res.cc('不存在相关内容')
                    // console.log((2 * (parseInt(req.body.pagenum) - 1)))
                res.send({ status: 0, message: '拉取文章列表成功', data: results, total })
            })
        })
    }

}
exports.deleteArticle = (req, res) => {
    const sql = `update ev_articles set is_delete=1 where Id=?`
    db.query(sql, req.params.id, (err, results) => {
        if (err) return res.cc(err)
        if (results.affectedRows !== 1) return res.cc('删除文章失败')

        res.send({ status: 0, message: '删除文章列表成功', data: results })
    })

}

exports.getArticleById = (req, res) => {
    const sql = `select Id,title,cate_name,content,cover_img from ev_articles where Id=? and is_delete=0`
    db.query(sql, req.params.id, (err, results) => {
        if (err) return res.cc(err)
        if (results.length !== 1) return res.cc('查找文章失败')

        res.send({ status: 0, message: '查找文章成功', data: results[0] })
    })

}
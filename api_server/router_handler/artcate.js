const db = require('../db/index')
exports.getArticleCates = (req, res) => {
    // 根据分类的状态，获取所有未被删除的分类列表数据
    // is_delete 为 0 表示没有被 标记为删除 的数据
    const sql = 'select * from ev_article_cate where is_delete=0 order by id asc'
    db.query(sql, (err, results) => {
        if (err) return res.cc(err)
        res.send({
                status: 0,
                message: '获取列表数据成功',
                data: results,
            })
            // res.cc('获取列表数据成功', 0)
    })
}

exports.addArticleCates = (req, res) => {
    // 判断name和alias是不是被占用
    const sql = `select * from ev_article_cate where name=? or alias=?`
    db.query(sql, [req.body.name, req.body.alias], (err, results) => {
        if (err) return res.cc(err)
        if (results.length === 2) return res.cc('分类名称和分类别名被占用！')
        if (results.length === 1 && results[0].name === req.body.name && results[0].alias === req.body.alias) { return res.cc('分类名称或分类别名被占用！') }
        if (results.length === 1 && results[0].name === req.body.name) return res.cc('分类名称被占用，请更换后重试！')
        if (results.length === 1 && results[0].alias === req.body.alias) return res.cc('分类别名被占用，请更换后重试！')

        // todo分类名称和分类别名都可用
        const sql = `insert into ev_article_cate set ?`
        db.query(sql, req.body, (err, results) => {
            if (err) return res.cc(err)
            if (results.affectedRows !== 1) return res.cc('新增文章分类失败！')
            res.send('新增文章分类成功！')
        })
    })

}
exports.deleteCateById = (req, res) => {
    const sql = `update ev_article_cate set is_delete=1 where Id=?`
    db.query(sql, req.params.id, (err, results) => {
        if (err) return res.cc(err)

        // SQL 语句执行成功，但是没有查询到任何数据
        if (results.affectedRows !== 1) return res.cc('删除文章分类失败！')
        res.cc('删除文章分类成功', 0)
    })
}
exports.getArticleById = (req, res) => {
    const sql = `select * from ev_article_cate where is_delete=0 and Id=?`
    db.query(sql, req.params.id, (err, results) => {
        if (err) return res.cc(err)
        if (results.length !== 1) return res.cc('未找到相关分类！')
        res.send({
            status: 0,
            message: '获取数据成功',
            data: results[0],
        })
    })
}
exports.updateCateById = (req, res) => {
    const sql = `select * from ev_article_cate where Id<>? and (name=? or alias=?)`
    db.query(sql, [req.body.Id, req.body.name, req.body.alias], (err, results) => {
        if (err) return res.cc(err)
        if (results.length === 2) return res.cc('分类名称和分类别名被占用！')
        if (results.length === 1 && results[0].name === req.body.name && results[0].alias === req.body.alias) { return res.cc('分类名称或分类别名被占用！') }
        if (results.length === 1 && results[0].name === req.body.name) return res.cc('分类名称被占用，请更换后重试！')
        if (results.length === 1 && results[0].alias === req.body.alias) return res.cc('分类别名被占用，请更换后重试！')


        // todo 未找到相同更新文章
        const sql = `update ev_article_cate set ? where Id=?`
        db.query(sql, [req.body, req.body.Id], (err, results) => {
            if (err) return res.cc(err)
            if (results.affectedRows !== 1) return res.cc('更新文章分类失败！')
            res.send({
                status: 0,
                message: '更新文章分类成功!',
                data: results[0],
            })
        })
    })

}
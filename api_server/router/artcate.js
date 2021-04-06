const express = require('express')
const router = express.Router()
    // 这是路由处理函数 模块
const artcate_handler = require('../router_handler/artcate')
const expressJoi = require('@escook/express-joi')
const { add_cate_schema, delete_cate_schema, update_cate_schema } = require('../schema/artcate')


// 获取文章分类列表数据的路由
router.get('/cates', artcate_handler.getArticleCates)
    // 新增文章分类接口
router.post('/addcates', expressJoi(add_cate_schema), artcate_handler.addArticleCates)
router.get('/deletecate/:id', expressJoi(delete_cate_schema), artcate_handler.deleteCateById)

// 根据Id获取文章分类搜索功能
router.get('/cates/:id', expressJoi(delete_cate_schema), artcate_handler.getArticleById)
    // 根据id跟新文章类别
router.post('/updatecate', expressJoi(update_cate_schema), artcate_handler.updateCateById)
module.exports = router
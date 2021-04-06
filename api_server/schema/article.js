const joi = require('@hapi/joi')

const title = joi.string().required()
const cate_name = joi.string().required()
const content = joi.string().required().allow('')
const state = joi.string().valid('已发布', '草稿').required()
const id = joi.number().integer().min(1).required()


exports.add_article_schema = {
    body: {
        title,
        cate_name,
        content,
        state,
    },
}
exports.delete_article_schema = {
    params: {
        id,
    },
}
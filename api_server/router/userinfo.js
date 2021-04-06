const express = require('express')
const router = express.Router()
    //导入路由处理函数模块
const userinfo_handler = require('../router_handler/userinfo')
    // 1. 导入验证表单数据的中间件
const expressJoi = require('@escook/express-joi')
    // 2. 导入需要的验证规则对象
const { update_userinfo_schema, update_password_schema, update_avater_schema } = require('../schema/user')


router.get('/userinfo', userinfo_handler.getUserInfo)
    // 更新用户信息
router.post('/userinfo', expressJoi(update_userinfo_schema), userinfo_handler.updateUserInfo)
router.post('/updatepwd', expressJoi(update_password_schema), userinfo_handler.updatePassword)
router.post('/update/avater', expressJoi(update_avater_schema), userinfo_handler.updateAvater)





// 挂载路由
module.exports = router
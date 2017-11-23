'use strict';
const express = require('express');
const userController = require('./controllers/userController');
const musicController = require('./controllers/musicController');
// 4:处理请求
//配置路由规则 开始
let router = express.Router();
router.get('/test',userController.doTest)
//检查用户名是否存在
.post('/check-user',userController.checkUser)
.post('/do-register',userController.doRegister)
.post('/do-login',userController.doLogin)
//添加音乐
.post('/add-music',musicController.addMusic)
.put('/update-music',musicController.updateMusic)

//配置路由规则 结束

module.exports = router;
'use strict';
// 引入数据库操作db对象
const db = require('../models/db');
let userController = {

};

/**
 * [测试]
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
userController.doTest = (req,res,next)=>{
    db.q('select * from album_dir',[],(err,data)=>{
        if(err)return next(err);
        res.render('test.html',{
            text:data[0].dir
        })
    })};
/**
 * [检查用户名是否存在]
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
userController.checkUser = (req,res,next)=>{
    //1:获取请求体中的数据 req.body
    let username = req.body.username;
    //2:查询用户名是否存在于数据库中
    db.q('select * from users where username = ?',[username],(err,data)=>{
        if(err) return next(err);
        // console.log(data);
        //判断是否有数据
        if(data.length == 0){
            //可以注册
            res.json({
                code:'001',
                msg:'可以注册'
            })
        }else{
            res.json({
                code:'002',msg:'用户名已经存在'
            })
        }
    });};
/**
 * [注册]
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
userController.doRegister = (req,res,next)=>{
    //1:接收数据
    let userData = req.body;
    let username = userData.username;//后端名称与前端要一致
    let password = userData.password;
    let v_code = userData.v_code;
    let email = userData.email;
    //2:处理数据(验证)
    //2.1:验证验证码（暂留）
    //2.2:验证邮箱
    let regex = /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/;
    if(!regex.test(email)){
        //不满足邮箱字符串
        res.json({
            code:'004',msg:'邮箱不合法'
        });
        return;
    }
    //2.3:验证用户名或者邮箱是否存在
    db.q('select * from users where username = ? or email = ? ',[username,email],(err,data)=>{
        if(err) return next(err);
        if(data.length != 0){
            //有可能邮箱存在，有可能用户名存在
            let user = data[0]; 
            if(user.email == email){
                return res.json({
                    code:'002',msg:'邮箱已经注册'
                });
            }else if( user.username == username){
                return res.json({
                    code:'002',msg:'用户名已经注册'
                });
            }
        }else{
            //用户名和邮箱都不存在，可以注册
            db.q('insert into users (username,password,email) values (?,?,?)',[username,password,email],(err,result)=>{
                if(err) return next(err);
                console.log(result);
                //响应json对象
                res.json({
                    code:'001',msg:'注册成功'
                })
            })
        }
    })};
/**
 * [登录]
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
userController.doLogin = (req,res,next)=>{
    //1:接受参数
    let username = req.body.username;
    let password = req.body.password;
    let remember_me = req.body.remember_me;
    //2:将用户名作为条件查询数据库
    db.q('select * from users where username = ?',[username],(err,data)=>{
        if(err) return next(err);   
        if(data.length == 0){
            return res.json({
                code:'002',msg:'用户名或密码不正确'
            });
        }
        //找到了用户
        let dbUser = data[0];
        if(dbUser.password != password){
            return res.json({
                code:'002',msg:'用户名或密码不正确'
            })
        }
        
        //给session上存储用户数据
        req.session.user = dbUser;
        // 只要session上有.user就说明登录了
        // websocket 主动向客户端推送

        res.json({
            code:'001',msg:'登录成功'
        })
    })};


//向外导出
module.exports = userController;
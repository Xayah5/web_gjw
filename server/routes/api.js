const express = require("express");
const db = require("./../lib/DBHelper");
const moment = require('moment');
const md5 = require("md5");
const jwt = require('jsonwebtoken');
const secret = require("./../config").secret;
const fs = require("fs");
const { response } = require("../app");

let apiRouter = express.Router();

//注册
apiRouter.post("/reg", async function(req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    let uDate = moment(Date.now()).format("YY-MM-DD HH:mm:ss");
    let { uname, upwd } = req.body;
    upwd = md5(upwd);
    let sql = "insert into vip (uName,uPwd,uDate)values(?,?,?);";
    let params = [uname, upwd, uDate];
    let result = await db.execAsync(sql, params);
    console.log(result);
    if (result && result.affectedRows >= 1) {
        res.json({
            msg: "注册成功！",
            status: 1
        })
    } else {
        res.json({
            msg: "注册失败！",
            status: -1
        })
    }
});

//是否已经注册
apiRouter.get("/isReg", async function(req, res, next) {

        //得到用户名
        let { uname } = req.query;
        //准波sql语句
        let sql = "select * from vip where uname=?;";
        //准备参数
        let params = [uname];
        //执行判断结果
        let result = await db.execAsync(sql, params);
        if (result.length >= 1) {
            res.send('false'); //已经注册
        } else {
            res.send('true'); //未注册
        }
    })
    //登录
apiRouter.post("/login", async function(req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");

    //接收前端发过来的数据
    let { uname, upwd } = req.body;
    //密码加密
    upwd = md5(upwd);
    //读取接收的数据
    let sql = "select uId,uName,uDate from vip where uName=? and uPwd=? and uStatus=1;";
    //准备参数
    let params = [uname, upwd];
    let result = await db.execAsync(sql, params);
    console.log(result);
    if (result && result.length >= 1) {
        var token = jwt.sign(JSON.parse(JSON.stringify(result[0])), secret, {
            expiresIn: 60 * 60 * 24 //一天有效
        })
        res.json({
            msg: "登录成功",
            status: 1,
            data: result[0],
            token
        });
    } else {
        res.json({
            msg: "登录失败",
            status: -1
        })
    }
});
//首页
apiRouter.get('/index', function(req, res, next) {
        res.json({
            msg: "查询成功",
            status: 1,
            data: JSON.parse(fs.readFileSync("./data/goods.json").toString())
        })
    })
    //jsonp
apiRouter.get("/goods", function(req, res, next) {
    let gid = req.query.gid;
    console.log(req.query.gid)
    let callback = req.query.cb;
    console.log(callback)
    var data = JSON.parse(fs.readFileSync("./data/goods.json").toString());
    var result = [...data].filter(function(el) {
        return el.id == gid;
    })
    res.type("text/javascript");
    res.send(";" + callback + "(" + JSON.stringify(result[0]) + ");")
})

//加入购物车
apiRouter.post("/addCar", async function(req, res, next) {
        var {
            id: gid,
            name,
            price,
            img,
            num,
            uid
        } = req.body;
        //先查询数据库释放存在，
        let querySql = 'SELECT*FROM shoppingcar WHERE uid=? AND gid=? and gStatus=1;';
        let queryPrams = [uid, gid];
        let queryResult = await db.execAsync(querySql, queryPrams);
        if (queryResult && queryResult.length >= 1) {
            //如果存在就只做数量和总金额的修改
            let updateSql = "update shoppingcar set gNum=gNum+?,gTotal=gNum*gPrice where gId=? and uId=? and gStatus=1;";
            let updateParams = [num, gid, uid];
            let updateResult = await db.execAsync(updateSql, updateParams);
            if (updateResult && updateResult.affectedRows >= 1) {
                res.json({
                    msg: "加入购物车成功u",
                    status: 1
                })
            } else {
                res.json({
                    msg: "加入购物车失败u",
                    status: -1
                })
            }
        } else {
            //否则数据库没有，就做插入
            let insertSql = 'insert into shoppingcar (gId,uId,gName,gPrice,gNum,gImg,gTotal,gTime) values(?,?,?,?,?,?,?,?);';
            //购买时间
            let gTime = moment().format('YYYY-MM-DD HH:mm:ss');
            let insertParams = [gid, uid, name, price, num, img, price * num, gTime];
            console.log(insertParams)
            let insertResult = await db.execAsync(insertSql, insertParams);
            if (insertResult && insertResult.affectedRows >= 1) {
                res.json({
                    msg: "加入购物车成功i",
                    status: 1
                })
            } else {
                res.json({
                    msg: "加入购物车失败i",
                    status: -1
                })
            }
        }
    })
    //显示购物车
apiRouter.post('/getCart', async(req, res, next) => {
        let { uid } = req.body;
        let sql = "select * from shoppingcar where uId=? and gStatus=1;";
        let params = [uid];
        var result = await db.execAsync(sql, params);
        console.log(result.length);
        if (result && result.length >= 1) {
            res.json({
                msg: "success",
                status: 1,
                data: result
            })
        } else {
            res.json({
                msg: "查询失败",
                status: 0
            })
        }
    })
    //修改数量
apiRouter.post("/changeCarNum", async(req, res, next) => {
        let {
            cid,
            gnum
        } = req.body;
        let sql = 'update shoppingcar set gNum=?,gTotal=gNum*gPrice where cid=? and gStatus=1;';
        let params = [gnum, cid];
        let result = await db.execAsync(sql, params);
        if (result && result.affectedRows >= 1) {
            res.json({
                msg: "修改成功",
                status: 1
            })
        } else {
            res.json({
                msg: "修改失败",
                status: -1
            })
        }
    })
    //软删除，修改状态
apiRouter.post("/delete", async(req, res, next) => {
        let { cid } = req.body;
        console.log(req.body)
        let sql = 'update shoppingcar set gStatus=0 where cId=?;';
        let params = [cid];
        let result = await db.execAsync(sql, params);
        if (result && result.affectedRows >= 1) {
            res.json({
                msg: "删除成功",
                status: 1
            })
        } else {
            res.json({
                msg: "删除失败",
                status: -1
            })
        }
    })
    //清空购物车
apiRouter.post("/clearCar", async(req, res, next) => {
    let { uid } = req.body;
    console.log(req.body)
    let sql = 'update shoppingcar set gStatus=0 where uId=?;';
    let params = [uid];
    let result = await db.execAsync(sql, params);
    if (result && result.affectedRows >= 1) {
        res.json({
            msg: "清空完成",
            status: 1
        })
    } else {
        res.json({
            msg: "清空失败",
            status: -1
        })
    }
})
module.exports = {
    apiRouter
}
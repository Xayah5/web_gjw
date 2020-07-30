const mysql = require("mysql");
let db = mysql.createConnection(require("./../../config/index").config)

//连接数据库


module.exports = class DBHelper {
    //打开连接
    static async open() {
            db.connect(function(err) {
                if (err) {
                    console.log("连接数据库失败：" + err.message);
                }
            });
        }
        //非异步
    static async exec(sql, params, callback) {
        DBHelper.open();
        db.query(sql, params, function(err, result) {
            callback(err, result);
            DBHelper.close();
        });
    }

    //异步
    static async execAsync(sql, params) {
            return new Promise(function(resolve, reject) {
                db.query(sql, params, function(err, result) {
                    if (err) {
                        reject(err.message);
                    }
                    resolve(result);
                })
            }).catch(function(err) {
                Promise.reject(err);
            }).finally(function(err) {
                DBHelper.close();
            })
        }
        //关闭连接
    static async close() {
        db.resume(); //释放
    }
}
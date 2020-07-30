$(function() {
    //加载生成验证码的方法
    $.idcode.setCode();
    //自定义规则
    $.validator.addMethod('checkUser', function(val, ele, params) {
        return /^[a-z]\w{5,17}$/.test($(ele).val())
    }, "用户名不合法");
    $("form").validate({
        //规则
        rules: {
            uname: {
                required: true,
                rangelength: [6, 18],
                checkUser: true,
                remote: "./api/isReg"
            },
            upwd: {
                required: true,
                rangelength: [6, 18]
            },
            upwdcheck: {
                equalTo: "#upwd"
            }
        },
        messages: {
            uname: {
                required: "*必填框！",
                rangelength: "用户名长度必须是{0}-{1}之间！",
                remote: "该用户名已注册!"
            },
            upwd: {
                required: "*必填框！",
                rangelength: "密码长度必须是{0}-{1}之间！"
            },
            upwdcheck: {
                equalTo: "两次密码不一致！"
            }
        },
        submitHandler(from) {
            var dataStr = $(from).serialize();
            var IsBy = $.idcode.validateCode();
            if (!IsBy) {
                layer.msg('验证码输入错误，请重试！');
                return false;
            }
            $.ajax({
                //url地址
                url: "./api/reg",
                //参数
                data: dataStr,
                //异步
                async: true,
                //请求方式
                type: "post",
                dataType: "json"
            }).done(function(res) {
                layer.alert(res.msg)
            })
            return false;
        }
    })
})
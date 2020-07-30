$(function() {
    $.idcode.setCode();
    $("form").validate({
        rules: {
            uname: "required",
            upwd: "required"
        },
        messages: {
            uname: {
                required: "账号不能为空！",
            },
            upwd: {
                required: "密码不能为空"
            }
        },
        submitHandler() {
            var IsBy = $.idcode.validateCode();
            if (!IsBy) {
                layer.msg("验证码错误！");
                return false;
            }
            //发送ajax请求
            axios.defaults.baseUrl = 'http://localhost:8082';
            var data = $("form").serialize();
            axios({
                url: "./api/login",
                method: "post",
                data: data
            }).then(function(res) {
                console.log(res);
                console.log(res.data.token);
                if (res.data.status == 1) {
                    localStorage.setItem("token", res.data.token);
                    localStorage.setItem("user", JSON.stringify(res.data.data));
                    layer.alert(res.data.msg);
                    window.location.href = "index.html"
                } else {
                    layer.alert(res.data.msg + ":用户名或密码不正确！");
                }

            })
        }
    })
})
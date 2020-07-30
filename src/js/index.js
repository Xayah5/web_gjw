$(function() {
    //店长推荐模块 左右切换
    {
        $(".arrow_l").css({ opacity: .35, cursor: "default" });
        $(".arrow_l").click(function() {
            $("#slide_active").css({
                "left": "0",
                "transition": "1s",
            });
            $(".arrow_l").css({ opacity: .35, cursor: "default" });
            $(".arrow_r").css({ opacity: 1, cursor: "pointer" });
        })
        $(".arrow_r").click(function() {
            $("#slide_active").css({
                "left": "-1190px",
                "transition": "1s",
            })
            $(".arrow_r").css({ opacity: .35, cursor: "default" });
            $(".arrow_l").css({ opacity: 1, cursor: "pointer" });
        });
    }

    //顶部悬浮
    {
        //获取top的高度
        var topH = $("#topNav").height();
        //在滚动时获取不可见区域的高度
        $(document).scroll(function() {
            var scrollH = $(this).scrollTop();
            if (scrollH > topH) {
                $(".fixedSch").css({ top: 0 })
            } else {
                $(".fixedSch").css({ top: "-100px" })
            }
        })
    }
    //回到顶部
    {
        $('#backTop').click(function() {
            $('html,body').animate({ scrollTop: 0 }, 500);
        });
    }
})

$(function() {
    //发送之前的拦截器
    axios.interceptors.request.use(function(config) {
        config.baseUrl = "http://localhost:8082";
        config.headers.token = localStorage.getItem("token");
        return config;
    })


    // 读取localStorage的用户名并显示在页面上
    let users = JSON.parse(localStorage.getItem('user'));
    console.log(users);
    //如果当前localStorage存在数据就把用户名显示出来，反之显示未登录
    if (localStorage.getItem('user')) {
        let strhtml = "";
        $('#userCon').html('');
        strhtml += `
               Hi,欢迎&nbsp;<a href="#">${users.uName}</a>&nbsp;/&nbsp;<a href="javascript:void(0);" id="exitLogin">退出</a>&nbsp;&nbsp;&nbsp;&nbsp;
               `;
        $('#userCon').html(strhtml);
    } else {
        $('#userCon').html('');
        $('#userCon').html("Hi,请&nbsp;&nbsp;&nbsp;<a href='login.html'>登录</a>&nbsp;/&nbsp;<a href='register.html'>注册&nbsp;</a>");
    }
    //退出登录
    $("#exitLogin").click(function() {
        if (!confirm("确定要退出登录？")) {
            return;
        }
        localStorage.clear(); //清空localStorage的数据
        window.location.reload(true); //自动刷新
    })
    axios({
        url: "./api/index",
        method: "get",
    }).then(function(res) {
        var html = "";
        [...res.data.data].forEach(function(el) {
            // console.log(el)
            // console.log(res.data.data[0]);
            html += `
                <li class="margin_bot">
                    <a href="./goods.html?gid=${el.id}">
                        <div>${el.style}</div>
                        <img src="${el.img}"alt=" ">
                        <p>${el.name}</p>
                        <h2>${el.price}元</h2>
                    </a>
                </li>
        `;
        })
        $('.mtjBoxCon>ul').html(html);

    });
    //显示该用户购物车的数量
    $.ajax({
        url: "./api/getCart",
        type: "post",
        headers: {
            token: localStorage.getItem("token")
        },
        data: {
            uid: JSON.parse(localStorage.getItem("user")).uId
        }
    }).then(function(res) {
        let num = 0;
        //遍历所有返回的数据，把data的gNum字段的值相加
        [...res.data].forEach(el => {
                num += el.gNum;
                console.log(num)
            })
            //显示动态数量
        $(".shopCarBox>.itemNum").text(num)
    })
})
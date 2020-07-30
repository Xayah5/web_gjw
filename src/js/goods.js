function goodsDetail() {
    //放大镜
    {
        $(".show_oneimg").on("mouseenter", function() {
            // console.log("111")
            $(this).find('.middleArea').show();
            $(this).next().show();
            //鼠标在小区域内移动
            $(this).on("mousemove", function(e) {
                // 获得当前鼠标坐标
                var disX = e.pageX;
                var disY = e.pageY;
                //计算边界
                var mX = disX - $(this).offset().left - $(this).find(".middleArea").width() / 2;
                var mY = disY - $(this).offset().top - $(this).find(".middleArea").height() / 2
                if (mX <= 0) {
                    mX = 0
                }
                if (mX >= $(this).width() - $(this).find(".middleArea").width()) {
                    mX = $(this).width() - $(this).find(".middleArea").width();
                }
                if (mY <= 0) {
                    mY = 0;
                }
                if (mY >= $(this).height() - $(this).find(".middleArea").height()) {
                    mY = $(this).height() - $(this).find(".middleArea").height();
                }
                // 移动的比例  小区域移动一丢丢,大图 反正移动n倍数
                var oScale = $(".bigArea").width() / $(".middleArea").width();
                //大图
                $("#bigImg").css({ top: -mY * oScale, left: -mX * oScale });
                // 小图区域
                $(".middleArea").css({ top: mY, left: mX });
            })
        })
        $(".show_oneimg").on("mouseleave", function() {
            $(this).find(".middleArea").hide();
            $(this).next().hide();
        })
        $(".show_left>>ul>li").mouseenter(function() {
            $(".bigArea>img").attr("src", $(this).children().attr("src"))
            $(".show_oneimg>img").attr("src", $(this).children().attr("src"))
            $(this).css("border-color", "#ff0000").siblings().css("border-color", "#EEE");
        });
    }
    //tab_item ，tab栏切换
    {
        $(".tab_item").click(function() {
            $(this).addClass('select').siblings().removeClass('select');
            let $index = $(this).index();
            $('ul.pjlistbox').eq($index).addClass('active_tit').siblings().removeClass('active_tit');
        })
    }
    //点击添加到购物车
    {
        $(".addToCat").on("click", function(e) {
            // 计算抛物线上的三个坐标
            // 1、鼠标坐标；2、购物车终点坐标；3、最高点坐标（自己定）
            var x1 = e.pageX,
                y1 = e.pageY,
                x2 = $(".footer_gwc").offset().left,
                y2 = $(".footer_gwc").offset().top,
                x3 = x2 - 200,
                y3 = y2 - 100

            // 根据数学公式计算抛物线三个系数（这里不用管，拿来用就行）
            var a = -((y2 - y3) * x1 - (x2 - x3) * y1 + x2 * y3 - x3 * y2) / ((x2 - x3) * (x1 - x2) * (x1 - x3));
            var b = ((y2 - y3) * x1 * x1 + x2 * x2 * y3 - x3 * x3 * y2 - (x2 * x2 - x3 * x3) * y1) / ((x2 - x3) * (x1 - x2) * (x1 - x3));
            var c = ((x2 * y3 - x3 * y2) * x1 * x1 - (x2 * x2 * y3 - x3 * x3 * y2) * x1 + (x2 * x2 * x3 - x2 * x3 * x3) * y1) / ((x2 - x3) * (x1 - x2) * (x1 - x3));

            // 创建一个div，添加到页面上
            var imgBox = document.createElement('img')
            imgBox.className = 'active'
            document.body.appendChild(imgBox)
            var AddCarBg = $('.show_onebox>li>img:eq(0)').attr('src')
            $('.active').css({
                    "width": 25,
                    "height": 25,
                    "position": "absolute"
                }).attr('src', "./." + AddCarBg)
                // 让imgBox沿着抛物线运动
                // 先给imgBox一个初始坐标
            imgBox.style.left = x1 + 'px'
            imgBox.style.top = y1 + 'px'
            var timer = setInterval(() => {
                // 横坐标匀速运动
                x1 += 10
                    // 纵坐标按照抛物线公式代入x1计算就行
                y1 = a * x1 * x1 + b * x1 + c
                imgBox.style.left = x1 + 'px'
                imgBox.style.top = y1 + 'px'
                if (x1 >= x2) {
                    // 清除定时器
                    clearInterval(timer)
                        // imgBox移除
                    imgBox.remove()

                }
            }, 20)
        })
    }
    //回到顶部
    {
        $('#backTop').click(function() {
            $('html,body').animate({ scrollTop: 0 }, 500);
        });
    }
    //商品详情数量加减
    {
        $(".addBtn .addN").click(function() {
            // 数量
            let count = $("#goodsNum").val();
            count++;
            $(this).parent().prev().val(count);

        });
        $(".addBtn .diffN").click(function() {
            // 数量
            let count = $("#goodsNum").val();
            count--;
            if (count < 1) {
                count = 0;
            }
            $(this).parent().prev().val(count);
        });
    }
}

$(function() {
    let users = JSON.parse(localStorage.getItem('users'))
    if (localStorage.getItem('users') != null) {
        let strhtml = "";
        $('#userCon').html('');
        strhtml += `
        <a href="#">${users.uName}</a>&nbsp;/&nbsp;<a href="javascript:void(0);" id="exitLogin">退出</a>&nbsp;&nbsp;&nbsp;&nbsp;
        `;
        $('#userCon').html(strhtml);
    }
    if (window.location.search.indexOf("?") != -1) {
        var gid = window.location.search.split("?")[1].split("=")[1];
        $.ajax({
            url: "./api/goods",
            headers: {
                token: localStorage.getItem("token")
            },
            data: {
                gid
            },
            dataType: "jsonp",
            jsonp: "cb",
            jsonpCallback: "fn"
        }).then(function(res) {
            var html = "";
            var htmlT = "";
            html += `
                    <div class="show_left">
                        <div class="show_left_one">
                            <ul class="show_onebox">
                                <li><img src="${res.goodsImg[0]}" alt=""></li>
                                <li><img src="${res.goodsImg[1]}" alt=""></li>
                                <li><img src="${res.goodsImg[2]}" alt=""></li>
                                <li><img src="${res.goodsImg[3]}" alt=""></li>
                                <li><img src="${res.goodsImg[4]}" alt=""></li>
                            </ul>
                        </div>
                        <div class="show_oneimg">
                            <img class="middImg" src="${res.goodsImg[0]}" alt="">
                            <div class="middleArea"></div>
                        </div>
                        <div id="bigArea" class="bigArea">
                            <img id="bigImg" src="${res.goodsImg[0]}" />
                        </div>
                    </div>
                    <div class="itemmsg">
                        <h2 class="itemTit">${res.name}</h2>
                        <p class="redad">登录查看专属会员价</p>
                        <a href="#" class="sppp">茅台品牌馆<em>官方自营</em></a>
                        <div class="priceBox">
                            <div class="newPrice">
                                <p class="newpri">
                                    活动价
                                    <span class="rmbIcon">￥</span>
                                    <span class="price">${res.price}</span>
                                </p>
                            </div>
                            <p class="sale">
                                <span class="sale_fl">促销信息</span>
                                <span class="sale_fr">
                                <span class="redBox">会员价</span>
                                <span class="red">登录后查看更多优惠</span>
                                </span>
                            </p>
                        </div>
                        <div class="upmsg">
                            <div class="transTo">
                                <div class="psz">配 送 至：</div>
                                <a href="#" class="at_btn">上海</a>
                                <span class="yh">单笔订单不满100元，收运费10元</span>
                                <span>满百包邮</span>
                            </div>
                            <div class="pay">
                                <p>关注度<em>&nbsp;376485</em></p><span></span>
                                <p>积累评价<em>&nbsp;446</em></p><span></span>
                                <p class="ls_p">送积分<em>&nbsp;468</em></p>
                            </div>
                            <div class="numBox">
                                <div class="ltText">数&nbsp;量:</div>
                                <div class="ctrlNum">
                                    <input type="text" value="1" id="goodsNum">
                                    <div class="addBtn">
                                        <span class="addN">+</span>
                                        <span class="diffN">-</span>
                                    </div>
                                </div>
                            </div>
                            <div class="btnBox">
                                <a class="addCat">立即购买</a>
                                <a class="addToCat" data-info=${JSON.stringify(res)}><em class="iconfont icon-gouwuche"></em> 加入购物车</a>
                                <div class="apphover">
                                    <em class="iconfont icon-shouji"></em>手机下单更优惠
                                </div>
                            </div>
                        </div>
                    </div>
                    `;
            $(".itemshow").html(html);
            htmlT += `
            <div class="lp">
                <img src="${res.goodsImg[6]}" alt="">
            </div>
            <div class="lp">
                <img src="${res.goodsImg[7]}" alt="">
            </div>
            <div class="lp">
                <img src="${res.goodsImg[8]}" alt="">
            </div>
            <div class="lp">
                <img src="${res.goodsImg[9]}" alt="">
            </div>            
            `;
            $(".picdetai").html(htmlT);
            goodsDetail();
        })
    }
    $(".itemshow").on("click", ".addToCat", function() {
        if (!localStorage.getItem('user')) {
            // window.confirm("你还未登录请先登录！")
            if (!confirm("你还未登录请先登录")) {
                return;
            }
            window.location.href = "login.html";
        }

        $(".shopCarBox>.itemNum").text(parseInt($(".shopCarBox>.itemNum").text()) + 1)
        var data = $(this).data('info');
        delete(data.goodsImg);
        delete(data.style);
        data.num = $("#goodsNum").val();
        data.uid = JSON.parse(localStorage.getItem("user")).uId;
        $.ajax({
            url: "./api/addCar",
            type: "post",
            data: data,
            headers: {
                token: localStorage.getItem("token")
            },
        }).then(function(res) {
            console.log(res)
            if (res.status == 1) {
                console.log("加入购物车成功~")
            } else {
                console.log("加入失败")
            }
        })
    })
})
$(function() {
    // 读取localStorage的用户名并显示在页面上
    let users = JSON.parse(localStorage.getItem('user'));
    //如果当前localStorage存在数据就把用户名显示出来，反之显示未登录
    if (localStorage.getItem('user')) {
        let strhtml = "";
        $('#userCon').html('');
        strhtml += `
               Hi,欢迎&nbsp;<a href="#">${users.uName}</a>&nbsp;/&nbsp;<a href="javascript:void(0);" id="exitLogin">退出</a>&nbsp;&nbsp;&nbsp;&nbsp;
               `;
        $('#userCon').html(strhtml);

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
    });

})
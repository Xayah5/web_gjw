//复选框
jQuery.fn.extend({
    // 参数：
    // $subCheck：子复选框
    // $unBtn:反选按钮
    check: function($subCheck, $unBtn) {
        //点击全选框
        this.click(function() {
            $subCheck.prop("checked", this.checked);
        });
        if ($unBtn) {
            // 点击反选按钮
            $unBtn.click(function() {
                $subCheck.each(function() {
                    // this: 循环时的当前元素
                    this.checked = !this.checked;
                });
                subChangeFather();
            });
        }
        // 点击子复选框
        $subCheck.click(function() {
            subChangeFather();
        })

        var subChangeFather = () => {
            // 循环所有的复选框，看看是不是都选中了呢
            let allCheck = true; //假定都选中了
            $subCheck.each(function() {
                // this:循环时的当前dom对象。
                if (this.checked != true) {
                    allCheck = false;
                }
            });
            this.prop("checked", allCheck);
        }
    }
});

function shoppingcar() {
    $(function() {
            $(".orderInfo :checkbox:eq(0)").check($(".orderInfo :checkbox:gt(0)"));
            $(".orderInfo :checkbox:last").check($(".orderInfo :checkbox"));
            $(":checkbox").click(function() {
                totalMoney();
            });
        })
        // 计算总金额
    function totalMoney() {
        // 
        let money = 0;
        let $tr = $(".listConBox")
        $tr.each(function() {
            // 复选框是不是选中了
            if ($(this).find(":checkbox").prop("checked")) {
                money += parseFloat($(this).find(".col_totals").children("span").html());
            }
        });
        $("#totalMoney").html(money);
    }
}

$(function() {
    $(function() {
        // 读取localStorage的用户名并显示在页面上
        let users = JSON.parse(localStorage.getItem('user'));
        //如果当前localStorage存在数据就把用户名显示出来，反之显示未登录
        if (localStorage.getItem('user')) {
            let strhtml = "";
            $('#userCon').html('');
            strhtml += `
                   <a href="#">${users.uName}</a>&nbsp;/&nbsp;<a href="javascript:void(0);" id="exitLogin">退出</a>
                   `;
            $('#userCon').html(strhtml);
        } else {
            alert("你还未登录请先登录!");
            window.location.href = "login.html"
            $('#userCon').html('');
            $('#userCon').html("<a href='login.html'>登录</a>&nbsp;&nbsp;<a href='register.html'>注册</a>");
        }
        //退出登录
        $("#exitLogin").click(function() {
            if (!confirm("确定要退出登录？")) {
                return;
            }
            localStorage.clear(); //清空localStorage的数据
            window.location.reload(true); //自动刷新
        })
    })
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
        if (!res.data) {
            return;
        }
        if (res.status == -200) {
            alert("请先登录");
            return;
        }
        var strHtml = ``;
        [...res.data].forEach(function(el) {
            console.log(el);
            strHtml += `
                <div class="listConBox">
                    <div class="col_checks">
                        <input type="checkbox">
                        <img src="${el.gImg}" alt="">
                    </div>
                    <div class="col_names"><a href="#">${el.gName}</a></div>
                    <div class="col_prices">￥<span>${el.gPrice}</span></div>
                    <div class="col_discounts">-</div>
                    <div class="col_nums">
                        <div class="col_nums_box">
                            <a href="javascript:void(0)" data-info=${el.cId} id="reduceBtn">-</a>
                            <input type="text" value="${el.gNum}" id="num">
                            <a href="javascript:void(0)" data-info=${el.cId} id="addBtn">+</a>
                        </div>
                    </div>
                    <div class="col_totals">￥<span>${el.gTotal}</span></div>
                    <div class="col_actions">
                        <a href="javascript:void(0)" >收藏</a>&nbsp;&nbsp;&nbsp;
                        <a href="javascript:void(0)" data-info=${el.cId} class="delBtn ">删除</a>
                    </div>
                </div>
            `;
            $('.cearpro').attr("data-info", el.uId)
        });

        $(".listBody").prepend(strHtml);
        shoppingcar();
        //减
        $(".col_nums_box").on("click", "#reduceBtn", function() {
            var num = $(this).next('#num').val();
            if (num <= 1) {
                return;
            }
            num--;
            $(this).next("#num").val(num);
            var price = $(this).parents('.col_nums').prev().prev().children().text();
            $(this).parents('.col_nums').next().children().text(price * num);
            totalMoney()
            var cid = $(this).data("info");
            $.ajax({
                url: "./api/changeCarNum",
                type: "post",
                headers: {
                    token: localStorage.getItem("token")
                },
                data: {
                    cid,
                    gnum: num
                }
            }).then(function(res) {
                console.log(res.msg);
            })
        });
        //加
        $(".col_nums_box").on("click", "#addBtn", function() {
                var num = $(this).prev("#num").val();
                num++;
                $(this).prev("#num").val(num);
                var price = $(this).parents('.col_nums').prev().prev().children().text();
                $(this).parents('.col_nums').next().children().text(price * num);
                totalMoney()
                var cid = $(this).data("info");
                $.ajax({
                    url: "./api/changeCarNum",
                    type: "post",
                    headers: {
                        token: localStorage.getItem("token")
                    },
                    data: {
                        cid,
                        gnum: num
                    }
                }).then(function(res) {
                    console.log(res);
                })
            })
            //删除购物车
        $(".col_actions").on("click", ".delBtn", function() {
            var self = this;
            if (!confirm("您确定要删除吗")) {
                return;
            }
            var cid = $(this).data("info");
            console.log(cid)
            $.ajax({
                url: "./api/delete",
                type: "post",
                headers: {
                    token: localStorage.getItem("token")
                },
                data: {
                    cid
                }
            }).then(function(res) {
                alert(res.msg);
                $(self).parents(".listConBox").remove();
                $("#shopNum span").text($(".listBody").children().length - 2).css("color", "#ea0000");
            })
        });
        //清空购物车
        $(".cearpro").on("click", function() {
                var uid = $(this).data('info');
                console.log(uid);
                $.ajax({
                    url: "./api/clearCar",
                    type: "post",
                    headers: {
                        token: localStorage.getItem("token")
                    },
                    data: {
                        uid
                    }
                }).then(function(result) {
                    alert(result.msg);
                    $(".listBody").children(".listConBox").remove();
                    $("#shopNum span").text($(".listBody").children().length - 2).css("color", "#ea0000");
                })
            })
            //购物车数量
        $("#shopNum span").text($(".listBody").children().length - 2).css("color", "#ea0000");
    })

})
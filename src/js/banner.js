{
    window.onload = function() {
        //获取样式的兼容写法
        function getStyle(dom, attr) {
            if (window.getComputedStyle) {
                return window.getComputedStyle(dom, null)[attr];
            }
            return dom.currentStyle[attr];
        }
        //运动封装
        function animate(ele, json, callback) {
            clearInterval(ele.timer);
            ele.timer = setInterval(() => {
                var flag = true;
                for (var attr in json) {
                    var current = 0;
                    var target = 0;
                    if (attr == 'opacity') {
                        current = parseFloat(getStyle(ele, attr)) * 100;
                        target = parseFloat(json[attr]) * 100;
                    } else {
                        current = parseInt(getStyle(ele, attr));
                        target = parseInt(json[attr]);
                    }
                    var step = (target - current) / 10;
                    step = step > 0 ? Math.ceil(step) : Math.floor(step);

                    if (attr == 'opacity') {
                        ele.style.opacity = (current + step) / 100;
                        ele.style.filter = 'alpha(opacity=' + (current + step) + ')'
                    } else if (attr == 'zIndex') {
                        ele.style.zIndex = target;
                    } else {
                        ele.style[attr] = current + step + "px";
                    }

                    if (current != target) {
                        flag = false;
                    }
                }
                if (flag) {
                    clearInterval(ele.timer);
                    callback && callback();
                }
            }, 20);
        }

        //轮播
        var oBanner = document.getElementById("banner-wrap");
        var oBox = document.getElementById("bannerBox");
        var oUl = document.getElementById("page");


        var playIndex = 0;
        var timer;

        function autoPlay() {
            playIndex++;
            if (playIndex > 5) {
                playIndex = 0;
            }

            Array.from(oBox.children).forEach((el, index) => {
                animate(el, {
                    opacity: 0
                })
            });
            animate(oBox.children[playIndex], {
                opacity: 1
            });

            Array.from(oUl.children).forEach(el => {
                el.style.backgroundColor = "#000";
            })
            oUl.children[playIndex].style.backgroundColor = "#ff0000";
        }
        timer = setInterval(autoPlay, 1500);
        oBanner.addEventListener('mouseenter', function() {
            clearInterval(timer);
        })
        oBanner.addEventListener('mouseleave', function() {
            timer = setInterval(autoPlay, 2000);
        })

        Array.from(oUl.children).forEach((el, index) => {
                el.addEventListener('mouseenter', function() {
                    playIndex = index - 1;
                    autoPlay();
                })
            })
            //左右箭头
        var oPrev = document.getElementById('prevBtn');
        var oNext = document.getElementById('nextBtn');

        var tempIndex = 0;
        oPrev.onclick = function() {
            tempIndex--;
            if (tempIndex < 0) {
                tempIndex = 5;
            }
            Array.from(oBox.children).forEach((el, index) => {
                animate(el, {
                    opacity: 0
                })
            });
            animate(oBox.children[tempIndex], { opacity: 1 });
            Array.from(oUl.children).forEach(el => {
                el.style.backgroundColor = "#000";
            })
            oUl.children[tempIndex].style.backgroundColor = "#ff0000";
        }
        oNext.onclick = function() {
            tempIndex++;
            if (tempIndex > 5) {
                tempIndex = 0;
            }
            Array.from(oBox.children).forEach((el, index) => {
                animate(el, {
                    opacity: 0
                })
            });
            animate(oBox.children[tempIndex], { opacity: 1 });
            Array.from(oUl.children).forEach(el => {
                el.style.backgroundColor = "#000";
            })
            oUl.children[tempIndex].style.backgroundColor = "#ff0000";
        }
    }
}
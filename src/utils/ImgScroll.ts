/*
    comment: 图片查看浏览
*/
// (function() {
export default function(e) {
    var t, pa, ch, mt, timer, time = e.time, n = e.images.children().first().width(), sum = e.images.children().length, sn = e.showlist, w = sum * n + (sum - 1) * e.spacing, a = [], i = !1, o = function(n) {
        i || t == n || (
        
        //图片闪动修改后（加判断，兼容视频房源）
        e.images.parent(".basic-pic-list").prev().children("#jPlayerBtn").length>0 ? e.showImg.hide() : '',
        e.images.parent(".basic-pic-list").prev().children("#jPlayerBtn").length>0 ? e.showDesc.hide() : '',
        
        //图片闪动修改前
        // e.showImg.hide(),
        // e.showDesc.hide(),

        timer = setTimeout(function() {
            e.loading.show()
        }, e.time),
        i = !0,
        n = n > a.length - 1 || 0 > n ? 0 : n,
        r(a[n].src, function() {
            clearTimeout(timer);
            e.loading.hide(),

            //图片闪动修改后（加判断，兼容视频房源）
            e.images.parent(".basic-pic-list").prev().children("#jPlayerBtn").length>0 ? e.showImg.show() : '',
            e.images.parent(".basic-pic-list").prev().children("#jPlayerBtn").length>0 ? e.showDesc.show() : '',

            //图片闪动修改前
            // e.showImg.show(),
            // e.showDesc.show(),

            e.showImg.attr("src", a[n].src).removeClass("maxWidth"),
            pa = e.showImg.parent().height(),
            ch = e.showImg.height(),
            mt = (pa - ch) / 2,
            e.showImg.css("marginTop", mt),
            e.showImg.data("index", n),
            e.showDesc.html(parseInt(n + 1) + "/" + sum),
            e.showImg.attr("alt", parseInt(n + 1) + "/" + sum),
            i = !1
        }))
    }, r = function(src, t) {
        var n = document.createElement("img");
        n.onload = t,
        n.src = src
    }, s = function(a) {
        if (t !== a) {
            e.images.children().removeClass("actives"),
            e.images.children(":eq(" + a + ")").addClass("actives"),
            a -= e.selectPosition;
            if (a < 0 || sum - sn < 0) {
                a = 0
            } else if (a > sum - sn) {
                a = sum - sn
            }
            var i = -(a * n + a * e.spacing);
            e.images.animate({
                left: i
            }, 250)
        }
    }, l = function(e) {
        0 !== a.length && (s(e),
        o(e),
        t = e)
    }, c = function(t) {
        var n = "disable";
        return a.length <= 1 ? (e.pre.addClass("disable"),
        void e.next.addClass("disable")) : (e.pre.removeClass(n),
        void e.next.removeClass(n))
    };
    return e.images.children().each(function(e) {
        var t = $(this);
        t.data("index", e),
        a.push({
            src: t.data("src")
        })
    }),
    e.isBigPic && sum - sn < 0 && e.images.parent().css({
        width: w,
        marginLeft: -w / 2
    }),
    l(0),
    c(0),
    e.pre.on("click", function() {
        if (0 === t)
            var e = a.length - 1;
        else
            var e = t - 1;
        l(e),
        c(e)
    }),
    e.next.on("click", function() {
        if (t === a.length - 1)
            var e = 0;
        else
            var e:number = t + 1;
        l(e),
        c(e)
    }),
    e.images.children().on("click", function() {
        var e = $(this).data("index");
        l(e),
        c(e)
    }),
    {
        setPage: function(e) {
            l(e),
            c(e)
        }
    }
}
// })()

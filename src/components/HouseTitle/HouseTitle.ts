/**
 * 房源头部信息
 */
import "./HouseTitle.less"
import Request, { fLib } from '../../utils/request';

export default class HouseTitle {
    private json4fe;

    constructor (json4fe) {
        this.json4fe=json4fe;
        this.render();
    }

    private render():void{
        let _this=this;

        //页面浏览量
        _this.getTotalCount();

        //扫一扫
        _this.richscan();
        
        //点击电话
        _this.clickPhone();

        // 核验 hover
        _this.cdHY();

        //收藏房源
        _this.collectHouse();
        $.fn.collectHouse = _this.collectHouse.bind(_this);

        //鼠标滑动变化
        _this.bindHover($("#report"), $("#report-bar"));
        _this.bindHover($("#richscan"), $("#richscan-bar"));
        _this.bindHover($("#manage"), $("#manage-bar"));
    }

    //获取页面浏览量
    private getTotalCount():void{
        (<any>window).Counter58 = {
            userlist: [],
            total: 0
        };
        $.ajax({
            url: document.location.protocol + "//jst1.58.com/counter",
            data: {
                infoid: this.json4fe.infoid,
                uname: "",
                userid: "",
                totalControl: "",
                listControl: "",
                sid: 0,
                lid: 0,
                px: 0,
                cfpath: ""
            },
            dataType: "script",
            success: function(data) {
                $("#totalcount").text((<any>window).Counter58.total);
                // @ts-ignore
                fLib.track.sendWM(64326);
            },
            error: () => {
                // @ts-ignore
                fLib.track.sendWM(64327);
            }
        })
    }

    private cdHY():void{
        let _this = this;
        let timer = null
        $('.cd-official-check').hover(function() {
            clearTimeout(timer)
            $(this).find('.qrcode-popover').show();
        }).mouseleave(function() {
            timer = setTimeout(()=>{
                $(this).find('.qrcode-popover').hide();
            }, 500)
        })
    }

    //点击电话
    private clickPhone():void{
        let _this=this;
        $("#gaq_phone").bind('click', ()=>{
            let href=document.location.protocol + "//my.58.com/downloadinfo/inputmobile/" + _this.json4fe.infoid + "/";
            if($('.iframe-wrap').length<1){
                let html=`<div class="iframe-wrap">
                    <div class="title">
                        <p>把该信息发送到手机</p>
                        <span id="close-iframe"></span>
                    </div>
                    <iframe name="myiframe" id="myrame" src="${href}" frameborder="0" align="left" width="570" height="330" scrolling="no">
                        <p>你的浏览器不支持iframe标签</p>
                    </iframe>
                </div>`
                $('.house-title').append(html);
                $("#close-iframe").bind('click', ()=>{
                    $('.iframe-wrap').css('display','none');
                })
            }else{
                $('.iframe-wrap').css('display','block');
            }
        })
    }

    //扫一扫
    private richscan() :void {
        let _this=this;
        $("#richscan-bar").find(".code").empty().qrcode({
            render: !(<any>window).ActiveXObject || $(document).documentMode > 9 ? "canvas" : "table",
            text: document.location.protocol + "//m.58.com/" + _this.json4fe.locallist[0].listname + "/" + _this.json4fe.catentry.listname + "/" + _this.json4fe.infoid + "x.shtml",
            width: 100,
            height: 100
        })
    }

    //鼠标滑动通用方法
    private bindHover(btn, bar):void {
        var clearTime = null;
        btn.bind("mouseenter", function() {
            clearTimeout(clearTime);
            bar.show()
        }).bind("mouseleave", function() {
            clearTime = setTimeout(function() {
                btn.removeClass("hover");
                bar.hide()
            }, 500)
        });
        bar.bind("mouseenter", function() {
            clearTimeout(clearTime)
        }).bind("mouseleave", function() {
            bar.hide()
        })
    }  

    //收藏房源回掉函数
    private collectCallback(res) : void {
        if (res && res.data) {
            var isCollect = res.data.result;
            var $el = $("#su_kfdnew,#su_kfd");
            if (isCollect) {
                $el.addClass("on").find("span,em").text("取消收藏")
            } else {
                $el.removeClass("on").find("span,em").text("加入收藏")
            }
        }
    }

    //收藏房源方法
    private collectHouse(callback?:Object) : void {
        var _this = this
          , callback = callback || _this.collectCallback
          , jumplink = window.location.href;
        Request.jsonp(document.location.protocol + "//apihouse.58.com/favorite/FavoriteInfo", {
            uId: _this.GetCookieValue("58cooper").split("&")[0].split("=")[1] || 0,
            pubUserId: _this.json4fe.userid,
            infoId: _this.json4fe.infoid,
            title: document.title,
            city: _this.json4fe.locallist[0].listname,
            type: _this.json4fe.catentry.listname,
            check: 1,
            successCode: 64328,
            failCode: 64329
        }, 'jsoncallback').then((res: any) => {
            if (!res.code && typeof callback === "function") {
                callback(res)
            }
        })
        // $.ajax({
        //     url: document.location.protocol + "//apihouse.58.com/favorite/FavoriteInfo",
        //     type: "get",
        //     data: {
        //         uId: _this.GetCookieValue("58cooper").split("&")[0].split("=")[1] || 0,
        //         pubUserId: _this.json4fe.userid,
        //         infoId: _this.json4fe.infoid,
        //         title: document.title,
        //         city: _this.json4fe.locallist[0].listname,
        //         type: _this.json4fe.catentry.listname,
        //         check: 1
        //     },
        //     dataType: "jsonp",
        //     jsonp: "jsoncallback",
        //     success: function(res) {
        //         if (!res.code && typeof callback === "function") {
        //             callback(res)
        //         }
        //     }
        // })
    }

    //获取cookie
    private GetCookieValue(name: Number | string) : string {
        var arr = document.cookie.match(new RegExp(name + "=([^&;]+)"));
        if (arr != null) {
            return decodeURI(arr[1])
        }
        return ""
    }
}
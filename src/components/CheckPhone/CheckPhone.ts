import Request from '../../utils/request';
/**
 * 扫码看电话
 */
export default class CheckPhone {
    private config;
    constructor (json4fe) {
        if ($(".house-chat-cover-container").length === 0) {
            // return false;
        }else{
            this.config = {
                infoID: json4fe.infoid,
                list_name: json4fe.catentry.listname,
                local_name: $.isArray(json4fe.locallist) ? json4fe.locallist[0].listname : json4fe.locallist.listname,
                topcate: json4fe.rootcatentry.listname,
                full_path: json4fe.rootcatentry.dispid + "," + json4fe.catentry.dispid,
                pid: 798,
                jumptype: "native",
                wlmode: "qr",
                pagetype: "detail",
                meta_url: "https://apphouse.58.com/api/list",
                isFinish: true,
            };

            if(json4fe.wechatQrcodeUrl){
                this.initJJRCheckPhone(json4fe);
            }
            else{
                this.initCheckphone();
            }
            this.bind();
        }
    }

    private bind():void {
        let $tooltips = $(".phone-qr-tooltips")
          , $binder = $(".house-chat-cover-wrapper")
          , animName = $tooltips.css("animation-name");
        if ($tooltips.length) {
            $binder.hover(function() {
                $tooltips.css({
                    "animation-name": animName
                }).show()
            }, function() {
                $tooltips.css({
                    "animation-name": "none"
                }).stop().fadeOut(100)
            })
        }
    }

    private initJJRCheckPhone(json4fe) : void{
        //todo 进入经纪人扫码导流小程序模式
        let urlBase= json4fe.wechatQrcodeUrl.split("?");
        let urlParam = urlBase[1].split("&");
        let url = urlBase[0] + urlParam[0].split("=")[1] + '/' +urlParam[1].split("=")[1] +'/';
        this.initQRCode(url);

    }

    private initCheckphone () : void {
            let _this = this;
            let _url = _this.initUrl();
            // _this.initQRCode(_url);
            Request.jsonp(window.location.protocol + "//houserent.58.com/tinyurl/api_get_tinyurl", {
                url: encodeURIComponent(_url),
                successCode: 64330,
                failCode: 64331
            }, 'jsoncallback').then((res: any) => {
                if (res.code == 0 && res.data && typeof res.data === "string") {
                    _this.initQRCode(res.data, true)
                }
            })
            // $.ajax({
            //     url: window.location.protocol + "//houserent.58.com/tinyurl/api_get_tinyurl",
            //     type: "get",
            //     data: {
            //         url: encodeURIComponent(_url)
            //     },
            //     dataType: "jsonp",
            //     jsonp: "jsoncallback",
            //     success: function(res) {
            //         if (res.code == 0 && res.data && typeof res.data === "string") {
            //             _this.initQRCode(res.data, true)
            //         }
            //     }
            // })
    }

    private initUrl () :string {
        let _this = this;
        let url = window.location.protocol + "//app.58.com/api/windex/scandetail/car/" +  _this.config.infoID + "/?";
        let params = []
        for (let key in _this.config) {
            if (_this.config.hasOwnProperty(key) && _this.config[key]) {
              params.push( `${key}=${_this.config[key]}`)
            }
        }

        url += params.join('&')

        return url
    }

    private initQRCode (url, isReset?) :void {
        let _hasQRCode = isReset ? false : this.checkQRCode();
        _hasQRCode || $(".phone-qr-code").empty().qrcode({
            render: !(<any>window).ActiveXObject || (<any>document).documentMode > 9 ? "canvas" : "table",
            text: url,
            width: 170,
            height: 170
        })
    }
    
    private checkQRCode () :boolean {
        return $(".phone-qr-code").children().length > 0
    }
}
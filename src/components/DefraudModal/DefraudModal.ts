/**
 * 防诈骗弹框
 */
import './DefraudModal.less'
import Cookies from '../../utils/cookie'

export default class DefraudModal {
    constructor () {
        if (!(<any>window).____json4fe.isbiz) {
            this.render ();
            this.bind();
        }
    }

    private render () :void {
        $(".defraud-layer").after(this.getTemplate());
    }

    private bind () :void{
        let _this = this;
        if (Cookies.get("defraudName") != "defraud") {
            _this.middleposition($(".defraud-layer"), $(".defraud-mask"));
            Cookies.set("defraudName", "defraud", {
                path: "/"
            })
        }
        $(".defraud-close, .defraud-know").bind("click", () => {
            $(".defraud-layer, .defraud-mask").hide();
        });
    }

    // 弹层居中
    private middleposition($layer, $mask) :void {
        let _this = $mask;
        let w1 = _this.width();
        let h1 = _this.height() > $(window).height() ? $(window).height() : _this.height();
        let w2 = $("body").width();
        let hc = ($(window).height() - h1) / 2
        let hs = $(window).scrollTop();
        let w = (w2 - w1) / 2;
        let h = hc + hs;
        $layer.show();
        _this.css({
            "left": w,
            "top": h
        }).show();
        // 图片居中；
        let maxPa = $(window).height() * 0.75;
        let paH = $(".picmask").find("#mainPic").parent().height();
        let pa = paH > maxPa ? maxPa : paH,
            ch = $(".picmask").find("#mainPic").height(),
            mt = (pa - ch) / 2;
        $(".picmask").find("#mainPic").css("marginTop", mt).show();
        $(window).scroll(() => {
            let hs = $(window).scrollTop();
            let h = hc + hs;
            _this.css({
                "position": "absolute",
                "top": h
            })
        })
    }

    private getTemplate () :string {
        return `
        <div class="defraud-mask">
            <div class="defraud-wrap">
                <div class="defraud-link">
                </div>
                <div class="defraud-know">我知道了</div>
            </div>
            <div class="defraud-close close"></div>
        </div>
        `
    }
}
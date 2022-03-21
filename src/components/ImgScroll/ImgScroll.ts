/**
 * 图片轮播组件
*/
import "./ImgScroll.less";
import ImgScrollToll from "../../utils/ImgScroll";
import VideoPlayer from "../../utils/jPlayer";

export default class ImgScroll{
    private config:object;
    private bigConfig:object;
    private jpContainer1;
    private vrBox = $('#bigImg .vr-box');
    private vrLayer = $('#bigImg .vr-layer');
    private playerBtn =  $("#jPlayerBtn");

    constructor () {
        this.config = {
            showImg: $("#smainPic"),
            showDesc: $("#sImgNu"),
            picDescShow: $("#smallPicDescShow"),
            picDescType: $("#smallPicDescType"),
            picDesc: $("#smallPicDesc"),
            pre: $("#slbt"),
            next: $("#srbt"),
            images: $("#leftImg"),
            spacing: 10,
            loading: $("#loadingSmall"),
            selectPosition: 2,
            showlist: 4,
            isBigPic: false,
            time: 300
        };

        this.bigConfig = {
            showImg: $("#mainPic"),
            showDesc: $("#viewNum"),
            picDescShow: $("#bigPicDescShow"),
            picDescType: $("#bigPicDescType"),
            picDesc: $("#bigPicDescWord"),
            pre: $("#blbt"),
            next: $("#brbt"),
            images: $("#smallPic"),
            spacing: 10,
            loading: $("#loadingBig"),
            selectPosition: 2,
            showlist: 6,
            isBigPic: true,
            time: 300
        };

        this.jpContainer1 = $("#jp_container_1");
        
        this.bind();
        this.iconStatusInit();
        this.player ();
        this.vrInit();
    }

    bind () {
        let _this = this;
        ImgScrollToll(_this.config);

        let t = ImgScrollToll(_this.bigConfig);

        $("#bigImg").bind("click", function () {
            // 第一张是视频房源没有大图模式
            // let a = $(this).hasClass("default");
            let a = $('#leftImg').find('li.actives').find('.icon-player').length>0;
            let b = _this.jpContainer1.length;
            let c = $("#leftImg li").eq(0).hasClass("actives");
            if (!a && !(b > 0 && c)) {
                t.setPage($(this).find("img").data("index"));
                _this.middleposition($(".piclayer"), $(".picmask"));
                return false
            }
        });

        // 右侧户型进入大图模式
        $("#generalType").on("click", "li", (event) => {
            if (!$("#generalType").hasClass("default") && $(this).data("index") != undefined) {
                t.setPage($(this).data("index"));
                _this.middleposition($(".piclayer"), $(".picmask"));
                return false
            }
        });

        // 点击房源图片查看大图
        $("#housePicList").on("click", "li", function(event) {
            if (event.target.parentNode.id != "viewMorePic" && !$("#housePicList").hasClass("default")) {
                t.setPage($(this).data("index"));
                _this.middleposition($(".piclayer"), $(".picmask"));
                return false
            }
        });


        //关闭大图查看
        $('body').on("click", '.picclose', () => {
            $(".piclayer,.picmask").hide();
            return false;
        })

        $('.picDescMask').bind("click", () => {
            if ($(this).hasClass('on')) {
                $(this).siblings('.picDescLayer').removeClass('on').addClass('off');
                $(this).removeClass('on').addClass('off');
                (<any>window).clickLog('from=fcpc_detail_esf_' + (<any>_this).city + '_miaoshu_close');
            } else {
                $(this).siblings('.picDescLayer').removeClass('off').addClass('on');
                $(this).removeClass('off').addClass('on');
                (<any>window).clickLog('from=fcpc_detail_esf_' + (<any>_this).city + '_miaoshu_open');
            }
            return false;
        })
        if (_this.jpContainer1.length > 0) {
            $('.picDescLayer,.picDescMask').hide();
        }

    }

    // 弹层居中
    middleposition($layer, $mask) {
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

    videoToggle(h?) {
        let g = this;

        if (!(<any>window).videoPlayerEnter) {
            return
        }
        if (h == "on") {

            (<any>window).videoPlayerEnter.show(true);
            setTimeout(function () {
                (<any>window).videoPlayerEnter.play("play")
            }, 200)
        } else {
            setTimeout(function () {
                (<any>window).videoPlayerEnter.show(false);
                (<any>window).videoPlayerEnter.play("stop")
            }, 200)
        }

    }

    // 播放
    player () {
        let _this = this;

        if (_this.jpContainer1 && _this.jpContainer1.length > 0) {
            (<any>window).clickLog("from=200000000472000100000001"); //视频展现统计
            (<any>window).videoPlayerEnter = new VideoPlayer({
                container: '#jp_container_1',
                videoPath: _this.jpContainer1.data('src'),
                swfPath: 'https://j1.58cdn.com.cn/fangrs/pc-site/pages/esf',
                solution: "html,flash",
                size: {
                    width: "464px",
                    height: "348px",
                    cssClass: "jp-video-400p"
                },
                handleError: (event) => {
                    console.log(event.jPlayer.error);


                }
            });
            (<any>window).videoPlayerEnter.dom.videoWin.on($.jPlayer.event.ended, (c) => {
                (<any>window).clickLog("from=200000000474000100000100"); //视频播放结束展示
            });
            // (<any>window).videoPlayerEnter.dom.videoWin.jPlayer({"$.jPlayer.event.ended": function(event){alert('aa');}})
            // (<any>window).videoPlayerEnter.dom.videoWin.on("stop", (c) => {
            //     (<any>window).clickLog("from=200000000474000100000100"); //视频播放结束展示
            // });
            if($('#leftImg li').eq(0).find('.icon-player').length>0){
                this.playerBtn.show();
            }
            // 播放入口
            $('#jPlayerBtn').on("click", (e) => {
                e.stopPropagation();
                _this.videoToggle('on');
                $('#jPlayerBtn,#smainPic').hide();
                (<any>window).clickLog("from=200000000473000100000010");
            });
        }
    }
    
    // 全景初始化
    vrInit(){
        if(this.vrBox.length > 0){
            this.vrLayer.on('click', (e) => {
                e.stopPropagation();
                this.vrLayer.hide();
            })
        }
    }
    //按钮的展示状态切换
    iconStatusInit(){
        $("#leftImg li,#srbt,#slbt").on("click", () => {
            this.videoToggle();
            
            let imgLi = $('#leftImg').find('li.actives');
            //let vrSmall = $('#leftImg').find('.icon-vr');
            //let vrLi = vrSmall.parent();
            if (imgLi.find('.vr-icon-box').length>0) {
                this.playerBtn.hide();
                this.vrBox.show();
                this.vrLayer.show();                
            } 
            else if(imgLi.find('.icon-player').length>0){
                this.playerBtn.show();
                this.vrBox.hide();
                this.vrLayer.show();
            }
            else {
                this.vrBox.hide();
                this.playerBtn.hide();
                this.vrLayer.show();
            }
        })
    }
}
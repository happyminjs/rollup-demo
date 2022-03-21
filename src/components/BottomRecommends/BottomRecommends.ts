/**
 * 房源基本信息
 */
import './BottomRecommends.less'

export default class BottomRecommends {
    constructor () {
        this.render();
    }
    
    private render():void{
        let _this=this;
        $("#rec-bottom-nav").find("li").bind("click", function() {
            var key = $(this).data("key");
            $(this).siblings("li").removeClass("on");
            $(this).addClass("on");
            $("#rec-bottom-list").find("li").removeClass("on");
            $("#rec-bottom-list").find("li").each(function() {
                if ($(this).data("key") == key) {
                    $(this).addClass("on")
                }
            })
        })
    }   
}
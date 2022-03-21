/*
* 土巴兔广告
* */
import './TubatuAd.less'
export default class TubatuAd {
    constructor(config){
        this.render(config);
    }
    private render(config) :void{
        if ((config.cate.listname == "zufang" || config.cate.listname == "hezu") && config.isFinal) {
            if (config.j && config.j._trackParams && $.isArray(config.j._trackParams) && config.j._trackParams.length) {
                var myObj = config.j._trackParams;
                for (var i = 0, len = myObj.length; i < len; i++) {
                    if (myObj[i].V == "23501337478912" || myObj[i].V == "23402135620608" || myObj[i].V == "15049577632256" || myObj[i].V == "23265983808000" || myObj[i].V == "15126541891072" || myObj[i].V == "19796007901568" || myObj[i].V == "15126629933568" || myObj[i].V == "19441107053696" || myObj[i].V == "19265936414336" || myObj[i].V == "19163145222656" || myObj[i].V == "15126694301824" || myObj[i].V == "15126683624576" || myObj[i].V == "15126737064832" || myObj[i].V == "55908829287" || myObj[i].V == "15126654321920" || myObj[i].V == "15126248751744") {
                        return
                    }
                }
            }
            var iframe = document.createElement("iframe");
            $(iframe).css({
                width: "706px",
                height: "150px",
                "margin-top": "20px"
            });
            iframe.src = document.location.protocol + "//www.to8to.com/huodong/58/zufang.php";
            $("#tbt-bottom-ad").html(iframe)
        }
    }
}


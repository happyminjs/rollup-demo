/**
 * 配置 json4fe 的 city， localist等信息
 */
/*
	comment: 新版租房-event事件函数 
*/
export default function ConfigJson4fe(){
    let feCfg = (<any>window).____json4fe, 
    config= {};

    if (feCfg.locallist) {
        let city, locallist;
        if ($.isArray(feCfg.locallist)) {
            city = feCfg.locallist[0];
            locallist = feCfg.locallist;
        } else {
            city = feCfg.locallist;
            locallist = [city];
        }
        (<any>config).city = city;
        (<any>config).locallist = locallist;
    }
    if (feCfg.catentry) {
        let rootcate, cate, catelist;
        if ($.isArray(feCfg.catentry)) {
            cate = feCfg.catentry[feCfg.catentry.length - 1];
            catelist = feCfg.catentry;
        } else {
            cate = feCfg.catentry;
            catelist = [cate];
        }
        if (feCfg.rootcatentry) {
            catelist.unshift(feCfg.rootcatentry);
        }
        rootcate = catelist[0];
        (<any>config).rootcate = rootcate;
        (<any>config).cate = cate;
        (<any>config).catelist = catelist;
    }
    let g = feCfg.modules,
    f = g == "home" || g == "homepage",
    e = g == "list" || g == "listpage",
    d = g == "final" || g == "finalpage",
    n = g == "my" || g == "mypage",
    k = g == "post" || g == "postpage";
    
    (<any>config).j = feCfg;
    (<any>config).isHome = g == "home" || g == "homepage";
    (<any>config).isList = g == "list" || g == "listpage";
    (<any>config).isFinal = g == "final" || g == "finalpage";
    (<any>config).isMy = g == "my" || g == "mypage";
    (<any>config).isPost = g == "post" || g == "postpage";

    return config;
}
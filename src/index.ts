// import  "../../../../pc/58/utils/initJQ";

/**引入页面样式**/
import './index.less';
import Cookies from "js-cookie";

//ie886
import FangLib from 'fang-flib';
var fLib = new FangLib({
    pc: {
        needIe886: true,
        ie886Config: {
            openBrowserJudge: true, //是否需要判断浏览器版本为IE9以下
            clickClose: true, //弹窗是否支持手动关闭
            autoClose: true, //弹窗是否支持自动关闭
            autoTime: 5000, //弹窗多长时间后自动关闭（单位：毫秒）
            intervalDay: 15, //弹窗每隔多少天展示一次（单位：天）
            totalDay: 3 //弹窗展示上限，每年最多展示几次
        }
    }
});
fLib.track.sendWM(64325);
console.log('这是定位');
// import $ from "jquery";
// // 全局变量
// (<any>window).$ = (<any>window).jQuery = (<any>window).jquery =$;
let json4fe = (<any>window).____json4fe;
// declare global{
//     var $,json4fe  //声明全局变量
// }

// 工具方法：
// 异步加载js
import JSAsyncLoader from './utils/JSAsyncLoader';
// 懒加载
import LazyLoad from './utils/LazyLoad';
// 二维码生成：立即执行函数，HouseTitle、CheckPhone用到里面的生成二维码方法qrcode,用到jq,原来在CheckPhone模块中引入
import  './utils/JQuery.qrcode';


// 页面组件：
// 页面顶部（logo、免费发布等:只有样式，无js）
import HeaderWrap from './components/HeaderWrap/HeaderWrap'
// 房源部分--房源标题：包括顶部栏中收藏、管理、扫一扫等功能：原名InfoHeader
import HouseTitle from "./components/HouseTitle/HouseTitle";
// 房源部分--左侧房源图片:包括查看大图、播放视频，左右箭头等
import ImgScroll from "./components/ImgScroll/ImgScroll";    //todo有问题
// 经纪人电话区域：针对个人房源，鼠标滑动出现二维码看电话功能
import CheckPhone from "./components/CheckPhone/CheckPhone";
// 房源部分--右侧房源经纪人：包括企业信息的接口请求、查看大图、经纪人信息等
import HouseBasicInfo from "./components/HouseBasicInfo/HouseBasicInfo";
// 房源部分--房源详情、小区详情：包括查看更多图片按钮、百度地图等:原：HouseDetailInfos
import HouseDetailDesc from "./components/HouseDetailDesc/HouseDetailDesc";
// 房源部分--聚合经纪人
import AgentAggregation from "./components/AgentAggregation/AgentAggregation";
// 房源部分--推荐数据
import Recommends from "./components/Recommends/Recommends";
// 相关服务(只有样式)
import RelatedServices from "./components/RelatedServices/RelatedServices";
// 土巴兔广告:获取参数工具
import ConfigJson4fe from './utils/ConfigJson4fe';     //todo: export default待改进
// 土巴兔广告:创建iframe，为iframe添加样式和src
import TubatuAd from './components/TubatuAd/TubatuAd'
// 底部热门推荐:tab切换click事件
import BottomRecommends from './components/BottomRecommends/BottomRecommends'
// 微信二维码:包括：经纪人区域二维码+侧边栏区域二维码
import WXMiniProgramQRCode from './components/WXMiniProgramQRCode/WXMiniProgramQRCode'
// 经纪人电话区域：针对经纪人房源，返回电话请求密号并且展示在页面,ajax请求
import PrivacyCallUrl from './components/PrivacyCallUrl/PrivacyCallUrl'
// 防诈骗蒙层:根据模版json4fe.isbiz参数控制是否显示，点击关闭事件等
import DefraudModal from "./components/DefraudModal/DefraudModal";

import WebIM from './components/WebIM/WebIM'

$(function () {
    new WebIM(fLib);
    new LazyLoad(); //懒加载
    new HeaderWrap(); //顶部
    new HouseTitle(json4fe);    //顶部房源标题
    new HouseBasicInfo({locallist: json4fe.locallist, sanWangBrokerId: json4fe.sanWangBrokerId,isDayu: json4fe.isDayu});
    new JSAsyncLoader('//tracklog.58.com/referrer4.js', ()=> {
        new ImgScroll ();
        new Recommends(json4fe);    //推荐房源
        new AgentAggregation(json4fe);    //经纪人聚合
    });
    new HouseDetailDesc();   //房源详情、小区详情
    new RelatedServices();   //服务记录
    new TubatuAd(ConfigJson4fe()); //土巴兔广告
    new BottomRecommends();    //底部推荐
    new JSAsyncLoader('//j1.58cdn.com.cn/resource/xxzl/public/index.js', ()=> {
        new WXMiniProgramQRCode({   // 微信二维码:包括：经纪人区域二维码+侧边栏区域二维码
            houseId: json4fe.houseId,
            sidebarNode: $('body'),
            agentAreaNode: $('.house-agent-info')
        }); 
    }); 
    new CheckPhone (json4fe);
    new DefraudModal();  // 防诈骗蒙层
    new PrivacyCallUrl(json4fe); // 经纪人电话区域
    // 已经在模板中引入
    // new JSAsyncLoader('//adshow.58.com/js/ssp_init.js'); //推广广告
    // new JSAsyncLoader('//j1.58cdn.com.cn/resource/xxzl/xxfw/xxfw.min.js'); //防爬虫
});

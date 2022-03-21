import $ from "jquery";
declare global {
    var $, json4fe  //声明全局变量
}

// 全局变量
(<any>window).$ = (<any>window).jQuery = (<any>window).jquery = $;



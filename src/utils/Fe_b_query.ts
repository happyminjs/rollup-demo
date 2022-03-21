/*
	comment: 搜索跳转韩束
*/
import frame from './Fe_Frame';
let Frame: any = frame();
import Dom from './Fe_dom';
let dom: any = Dom();
import Sift from './ListShift';
let sift: any = Sift();
import url from './Fe_url';
let uri: any = url();
import ConfigJson4fe from './ConfigJson4fe';
let config: any = ConfigJson4fe();

export default function(){
    var b_query = function(args) { 
        //联盟添加跟踪参数 by wanghaixu start
        if(!!(<any>window).____json4fe.urlpara){
            try{
                var utm_source =  (<any>window).____json4fe.urlpara[0].utm_source,
                    spm = (<any>window).____json4fe.urlpara[0].spm;
                if(!!args){
                    args += "&utm_source="+utm_source+"&spm="+spm;
                }else{
                    args = "utm_source="+utm_source+"&spm="+spm;
                }
            }catch(e){}
        }
        //end
        
        //require('config, dom, business.sift, extension.array, util.uri', function(Frame, config, dom, sift, array, uri) {
        (function(){    
          
            var queryInputs = document.getElementsByName("b_q"),      
                keyInputs = Frame.filter(queryInputs, function(input) {      
                    return input.getAttribute('para') == 'key';      
                });      
            //添加搜索统计需求 by wanghaixu  start
            var _cate=[],_local=[];
            try{
                for(var i=0,ln=(<any>window).____json4fe.catentry.length;i<ln;i++){
                _cate.push((<any>window).____json4fe.catentry[i].dispid);
                }
                for(var i=0,ln=(<any>window).____json4fe.locallist.length;i<ln;i++){
                    _local.push((<any>window).____json4fe.locallist[i].dispid);
                }
            }catch(e){}
            var searchLog_val = (<any>window).searchLog_val || keyInputs[0].value;
            // clickLog('from=rawSearch_'+_cate.join(",")+'_'+_local.join(",")+'_'+searchLog_val+'_'+keyInputs[0].value);
            $("input[name='b_q']").attr("tongji_tag", 'rawSearch_'+_cate.join(",")+'_'+_local.join(",")+'_'+searchLog_val+'_'+keyInputs[0].value)
            //end   
            var sourange_0 = dom.get('sourange_0'),      
                //本类搜      
                sourange_1 = dom.get('sourange_1'); //,//全站搜      
    
            //全站搜      
            if (sourange_1 && sourange_1.checked) {      
                if (!keyInputs || ! keyInputs.length) return;      
                var key = sift.getValue(keyInputs[0]);      
                key = uri.decode(key);      
                key = encodeURIComponent(key.replace(/([^\u0391-\uFFE5a-zA-Z0-9@#\+\-_\. ])/ig, ''));    
                if (Frame.isEmpty(key)) {      
                    window.location.reload();      
                    return;      
                }      
          
                var sourcestr = '';      
                if (keyInputs[0]) {      
                    if (keyInputs[0].value == keyInputs[0].getAttribute('data-intellisense')) {      
                        sourcestr = 'sourcetype=1_4';      
                    } else {      
                        sourcestr = 'sourcetype=4';      
                    }      
                }      
                location.href = 'https://' + config.city.listname + '.58.com/sou/jh_' + key + '/final_1/?' + sourcestr + "&from=list-search-xiaoqu";
            } else {      
                //本类搜      
                var sourcestr = '';      
                if (keyInputs[0]) {
                        // if(keyInputs[0].value.substring(0,3)=="请输入"){
                        //  document.location.reload();
                        //  return;
                        // }
                    if (keyInputs[0].value == keyInputs[0].getAttribute('data-intellisense')) {      
                        sourcestr = '1_5';    
                    } else {      
                        sourcestr = '5';      
                    }      
                }      
                var si = dom.create('input', {      
                    id: 'sourcetype',      
                    type: 'hidden',      
                    name: 'b_q',      
                    para: 'sourcetype',      
                    value: sourcestr      
                });
                document.body.appendChild(si);
                if(location.search.indexOf("selpic") > -1){      
                    // 保存图文模式参数
                    var selpic=1;
                    if(location.search.indexOf("selpic=2")>-1 ){
                        selpic=2;
                    }
                }
                if (args) {      
                    if(args == 'duanzu'){
                        sift.search_dz();
                    }
                    //二手房“搜本类”
                    else if(args.indexOf('ershoufang') != -1){
                        sift.search_ershoufang(args);
                    }
                    else{
                        sift.search_par(Frame.urlDecode(args));
                    }     
                }      
                else {      
                    sift.search();      
                }      
            }      
        })();      
    }
    return  b_query;
};
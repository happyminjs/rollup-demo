/**
 * 推荐房源
 */
import './Recommends.less'
import Request from '../../utils/request';

export default class Recommends {
    private json4fe;

    constructor(json4fe){
        this.json4fe=json4fe;
        this.render();
    }

    private render() :void{
        let _this=this;
        //获取数据
        _this.getData(document.location.protocol +"//rentercenter.58.com/recommend/api_recommend_zufang",{
            "infoid": _this.json4fe.infoid,
            "platform": "pc",
            "chlocalid":_this.json4fe.locallist[0].dispid,
            successCode: 64340,
            failCode: 64341
        },0);

         
        if(_this.json4fe.brokerOtherListUrl){
            _this.getData(_this.json4fe.brokerOtherListUrl,{
                successCode: 64342,
                failCode: 64343
            },1);
        }else{
            _this.getData(document.location.protocol +"//apihouse.58.com/house/postOtherInfo",{
                "userId": _this.json4fe.userid,
                "cateId": _this.json4fe.catentry.dispid,
                successCode: 64344,
                failCode: 64345
            },1);
        }

    }
    
    //获取房源数据
    private getData(url:string,urlData,type:number):void{
        let _this=this;
        Request.jsonp(url, urlData, 'jsoncallback').then((data: any) => {
            if(data && data.code==0){
                if(type==0){
                    if(data.data){
                        if(data.data.nearbyHouse){
                            (<any>window).clickLog(data.data.nearbyHouse.clickCode);
                            $('#guess-your-like').append(_this.getTemplate(data.data.nearbyHouse, data.data.nearbyHouse.houseList.length<4 ? data.data.nearbyHouse.houseList.length : 4));  //猜你喜欢
                        }
                        if(data.data.bizAreaHouse){
                            (<any>window).clickLog(data.data.bizAreaHouse.clickCode);
                            $('#see-again-house').append(_this.getTemplate(data.data.bizAreaHouse,data.data.bizAreaHouse.houseList.length<8 ? data.data.bizAreaHouse.houseList.length:8));  //大家都在看
                        }
                        if(data.data.superPPGY){
                            (<any>window).clickLog(data.data.superPPGY.clickCode);
                            $('#premium-brand-apartment').append(_this.getTemplateRightBot(data.data.superPPGY));  //品牌公寓
                        }
                    }
                }
                if(type==1){
                    if(data.data && data.data.length>0){
                        $('#agent-other-house').append(_this.getTemplateRightTop(data.data));  //该联系人的推荐房源                            
                    }
                }
            }
        })      
    }
    
    private getTemplate(data,length:Number) : string{
        let liHtml=``,className='',item='';
        for(let i=0;i<length;i++){
            className = i%4==0  ? "first" : '';
            item=data.houseList[i];
            let quyu = (<any>item).xiaoqu ? (<any>item).xiaoqu : (<any>item).shangqu;
            (<any>item).pic = document.location.protocol + '//' + (<any>item).pic.split('://')[1];
            liHtml +=
                `<li class="${className}">
                <a href="${(<any>item).url}" target="_blank" onclick="clickLog('${(<any>item).clickCode}')" data-index="1">
                    <div class="pic pr">
                        <img src="${(<any>item).pic.split('?')[0]}?w=336&amp;h=240&amp;crop=1" alt="">
                        <span class="price f12 pa">
                            <b class="f18">${(<any>item).price}</b>&nbsp;元/月
                        </span>
                    </div>
                    <p class="title f14 c_333 lh14">${quyu}</p>
                    <p class="area f12 c_888">${(<any>item).huxingshi}室${(<any>item).huxingting}厅&nbsp;/&nbsp;${(<any>item).area}</p>
                </a>
            </li>`
        }

        let innerHtml = `<p class="nav">
                            <span class="f18 c_333">${data.title}</span>
                        </p>
                        <ul class="house-ul">
                            ${liHtml}
                        </ul>
                        `;

        return innerHtml
    }

    private getTemplateRightTop(data) : string{
        let liHtml=``,item='';
        let _this=this;
        let hiretype='';
        if((<any>_this).json4fe.catentry.dispid == 8){
            hiretype='整租';
        }else if((<any>_this).json4fe.catentry.dispid == 10){
            hiretype='合租';
        }
        let title = (<any>_this).json4fe.locallist && (<any>_this).json4fe.locallist[0] && (<any>_this).json4fe.locallist[0].dispid == 1 ? "联系人" : "经纪人";
        for(let i=0;i<data.length;i++){
            item=data[i];
            let jumpUrl=(<any>item).url.replace("http://", window.location.protocol + "//");
            let picUrl=(<any>item).picUrl.replace("http://", window.location.protocol + "//");
            let fittypeInfor=''; 
            fittypeInfor = (<any>item).fittype ? `/&nbsp;${(<any>item).fittype}`:``
            liHtml +=
                `<li> 
                    <a href="${jumpUrl}" target="_blank" onclick="clickLog('from=fcpc_detail_${ (<any>_this).json4fe.locallist[0].listname}_jingjiren_tuijianfy_no${parseInt(<any>i + 1)}')">
                        <div class="pic fl"> 
                            <img lazy_src="${picUrl.split('?')[0]}?w=336&amp;h=240&amp;crop=1" src="//img.58cdn.com.cn/ui9/house/list/lazy_pic.png">
                        </div>
                        <div class="side-right fl">
                            <p class="info-title c_555 f18">${(<any>item).title}</p>
                            <p class="info-area-toward c_888 f12">${(<any>item).huxing}&nbsp;/&nbsp;${(<any>item).area}平<br>${hiretype}&nbsp;${fittypeInfor}</p>
                            <p class="info-price c_ff552e f12"><b class="f18">${(<any>item).price}</b>&nbsp;元/月</p>
                        </div>
                    </a>
                </li>`
        }
        let innerHtml = `<p class="agent-house-nav f18 c_333">该${title}的推荐房源</p>
                        <ul class="agent-otherhouse-list">
                            ${liHtml}
                        </ul>
                        `;
        return innerHtml
    }

    private getTemplateRightBot(data) : string{
        let liHtml=``,item='',tagArr=[];
        let _this=this;

        for(let i=0; data.houseList && i<data.houseList.length;i++){
            item=data.houseList[i];
            tagArr=(<any>item).tags;
            let tagHtml='';
            if(tagArr[0]!=''){
                for(var j=0;j<tagArr.length;j++){
                    tagHtml += `<span>${tagArr[j]}</span>` ;
                }
            }
            (<any>item).pic = document.location.protocol + '//' + (<any>item).pic.split('://')[1];
            liHtml +=
                ` <li>
                    <a href="${(<any>item).url}" target="_blank" onclick="clickLog('${(<any>item).clickCode}')">
                        <div class="pic fl">
                            <img lazy_src="${(<any>item).pic.split('?')[0]}?w=336&amp;h=240&amp;crop=1" src="//img.58cdn.com.cn/ui9/house/list/lazy_pic.png" width="168" height="120">
                            <span class="label">品牌公寓</span>
                        </div>
                        <div class="side-right fl">
                            <p class="info-title c_555 f18 lh20">${(<any>item).title}</p>
                            <p class="info-price c_ff552e f12 lh30">
                                <b class="f18">${(<any>item).price}</b>&nbsp;元/月
                            </p>
                            <p class="info-area-toward c_888 f12">${(<any>item).huxingshi}室${(<any>item).huxingting}厅${(<any>item).huxingwei}卫&nbsp;/&nbsp;${(<any>item).area}&nbsp;/&nbsp;品牌公寓<br></p>
                            <p class="info-special f12">${tagHtml}</p>
                        </div>
                    </a>
                </li>`
        }

        let innerHtml = `<a class="brand-apartment-nav f18 c_333" href="//${(<any>_this).json4fe.locallist[0].listname}.58.com/pinpaigongyu/" onclick="clickLog('from=fcp_detail_czppgy_pinpaigongyu_title')" target="_blank">${data.title}</a>
                        <ul class="brand-apartment-list">
                            ${liHtml}
                            <li class="view-more-apartment view-more"><a href="${window.location.protocol}//${(<any>_this).json4fe.locallist[0].listname}.58.com/pinpaigongyu/" target="_blank">查看更多品牌公寓<i class="icon"></i></a></li>
                        </ul>
                        `;

        return innerHtml
    }

}



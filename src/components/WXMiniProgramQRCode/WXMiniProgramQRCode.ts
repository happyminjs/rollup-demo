/*
* 微信小程序二维码（列表页、详情页右下角悬浮条）
* options:
*   infoId: '',
*   sidebarNode: '侧边栏挂载点',
*   agentAreaNode: '代理人区域挂载点'
*/
import './WXMiniProgramQRCode.less';
import md5 from '../../utils/md5';
import {QRCodeInterface, Res} from '../../interface/CommonComponentsInterface';
import Request from '../../utils/request';

export default class WXMiniProgramQRCode {
    constructor(options: QRCodeInterface, private sourceType:string = ''){
        try {
            this.render(options);
        } catch (error) {
            console.error(error)
        }
    }

    private render(params: QRCodeInterface): void{
        if(params.houseId){
            this.getQRCodeURL(params.houseId).then((data: string) => {
                params.sidebarNode && this.appendQRCodeToSidebar(params.sidebarNode, data);
                params.agentAreaNode && this.appendQRCodeToAgentArea(params.agentAreaNode, data);
            }, (err) => {
                console.log('error occured when getting qrcode: ', err);
            })
        }else{
            let qrcodeURL: string = '//pic1.58cdn.com.cn/nowater/58zfjx/qrcode/n_v2e9beed14f5774049acdf5dd363e280b2.png?w=280';
            params.sidebarNode && this.appendQRCodeToSidebar(params.sidebarNode, qrcodeURL);
        }
    }

    private getQRCodeURL(houseId: string){
        return Request.jsonp(
            document.location.protocol + '//rentercenter.58.com/wechat/api_get_qrcode_v2',
            {
                houseId:  houseId,
                signature: md5.hex_md5(houseId + 'qrcode_get'),
                successCode: 64256,
                failCode: 64257
            },
            'jsoncallback'
        ).then((res: Res) => {
              return res.data;
        });
    }

    /**
     * 添加到右边栏
     */
    private appendQRCodeToSidebar(el: HTMLElement, qrcodeURL: string): void{
        if(el && qrcodeURL){
            let template = this.getSidebarQRCodeTemplate(qrcodeURL);
            let img = document.createElement('img');
            img.src = qrcodeURL;
            img.onload = function () {
                el.append(template);
                $('.wx-xcx-qrcode').hover(function () {
                    $(this).children('.qrcode-popover').show();
                }, function () {
                    $(this).children('.qrcode-popover').hide();
                })
            };
        }
    }

    /**
     * 添加到经纪人区域
     */
    private appendQRCodeToAgentArea(el: HTMLElement, qrcodeURL): void{
        if(el && qrcodeURL){
            let template = this.getAgentAreaQRCodeTemplate(qrcodeURL);
            let img = document.createElement('img');
            img.src = qrcodeURL;
            img.onload = function () {
                el.append(template);
            }
        }
    }

    /*
    * 右边栏二维码
    * */
    private getSidebarQRCodeTemplate(qrcodeURL: string): string{
        qrcodeURL=qrcodeURL.replace("http://", window.location.protocol + "//");
        return `<div class="wx-xcx-qrcode" style="z-index:3">
                    <img src="https://pic1.58cdn.com.cn/nowater/58zfjx/qrcode/n_v25104ba3baeac4770b3c06ea2a9026a42.png?w=80&qa=85">
                    <div class="qrcode-popover">
                        <img src="${qrcodeURL}?w=280">
                        <p>微信扫码拨号</p>
                        <em class="r_jiao"></em>
                    </div>
               </div>`
    }

    /*
    * 经纪人二维码
    * */
    private getAgentAreaQRCodeTemplate(qrcodeURL: string): string{
        qrcodeURL=qrcodeURL.replace("http://", window.location.protocol + "//");
        let qrName = $('#single') && $('#single').length ? 'single-qrcode' : '';
        var qrcodeStr=`<p class="wx-xcx-qrcode-agent ${qrName}">
                            <span>用微信扫码打电话</span>
                            <br/>
                            <img src="${qrcodeURL}?w=200&qa=85">
                        </p>`
        if(this.sourceType == "anjuke"){
            qrcodeStr=``
        }
        return qrcodeStr
    }
}

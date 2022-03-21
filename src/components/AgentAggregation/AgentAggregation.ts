/**
 * 经纪人聚合模块
 */
import './AgentAggregation.less'
import Request from '../../utils/request';

export default class AgentAggregation {
    constructor (props) {
        // 模版上有skuid参数&&有agent-aggregation元素才加载方法
        if(props.skuid && $('.agent-aggregation').length >0){
            this.init(props);
        }
    }
    
    // 初始化
    private init (props) :void {
        let _this=this;
        _this.fetchData(props, (data) => {
            if (data) {
                _this.getTemplate(data,props);
            }
        })
    }

    // 接口请求
    private fetchData (props , cb:Function) : void{
        Request.jsonp("//apihouse.58.com/broker/Api_get_depend", {
            brokerId: props.sanWangBrokerId,
            skuid:props.skuid,
            source:'pc',
            localName:props.locallist[0].listname,
            successCode: 64336,
            failCode: 64337
        }, 'jsoncallback').then((res: any) => {
            if (res && res.code === 0 && res.data) {
                cb(res.data)
            }
        })
        // $.ajax({
        //     url: "//apihouse.58.com/broker/Api_get_depend",
        //     type: "get",
        //     data: {
        //         brokerId: props.sanWangBrokerId,
        //         skuid:props.skuid,
        //         source:'pc',
        //         localName:props.locallist[0].listname
        //     },
        //     dataType: "jsonp",
        //     jsonp: "jsoncallback",
        //     success: (res) => {
        //         if (res && res.code === 0 && res.data) {
        //             cb(res.data)
        //         }
        //     }
        // })
    }

    // 获取模版
    private  getTemplate (data,props):void {
        let _this=this;
        let tempLi=`` , temp=``, more=`` , tempEmploymentRecord=``,tempEmploymentCard=``;

        // 查看更多
        if(data.checkMore){
            more= `<a class="more" href="${data.checkMore}">查看更多</a>`;
            // 查看更多展示埋点
            (<any>window).clickLog('from=200000003383000100000100');
        }else{
            more=``
        }

        // 经纪人列表
        if(data.list&&data.list.length>0){
            for(var i=0;i<data.list.length;i++){
                
                // 城市等于武汉
                if(props.locallist[0].listname=='wh'){
                    var ewmTemp=``;

                    // 判断二维码
                    if(data.list[i].verifyQrCodeUrl){
                        ewmTemp=` <div class="qr-code-wrap">
                                    <span class="code" style="background-image:url(${data.list[i].verifyQrCodeUrl})">
                                    </span>
                                    <p class="word">扫码查看备案信息</p>
                                    <i class="jianjiao icon"></i>
                                </div>`
                    }

                    // 判断核验码
                    if(!data.list[i].verifyRegNumber){
                        tempEmploymentRecord=`<span  class="employment-record-num">
                                                <span class="name">从业备案信息待审核</span>
                                            </span>`
                    }else{
                        tempEmploymentRecord=`<span  class="employment-record-num">
                                <span class="name">从业备案编码：<span class=" ${ data.list[i].verifyQrCodeUrl ? 'active' : ''}">${data.list[i].verifyRegNumber}</span></span>  
                                    ${ewmTemp}
                                </span>`
                    }
                }

                // 城市等于北京
                if(props.locallist[0].listname=='bj'){
                    tempEmploymentCard=`<span class="employment-card">
                                            <span class="name">从业信息卡</span>                                                                       
                                            <span class="agent-img-pop-wrapper">
                                                <a class="agent-img-pop" title="点击查看原图" target="_blank" href="${data.list[i].personalCertificate}">
                                                    <span class="img" style="background-image:url(${data.list[i].personalCertificate});filter: progid:DXImageTransform.Microsoft.AlphaImageLoader(src=${data.list[i].personalCertificate}" ,="" sizingmethod="scale" )"=""></span>
                                                </a>
                                            </span>
                                        </span>`
                }

                 // 活跃经纪人
                 let active_tag= data.list[i].active_tag || undefined;
                 let active_html=``;
 
                 if(active_tag){
                     active_html=`<i class="active-tag">
                                 活跃经纪人
                             </i>`
                 }
                
                tempLi += `<li>
                    <div class="left">
                        <a  class="heada" href="${data.list[i].myShop}" target="_blank">
                            <div class="head" style="background:url('${data.list[i].headPic}');background-size:100% 100%"></div>                           
                        </a>
                        <div class="infor">
                            <div class="name">${data.list[i].brokerName}${active_html}</div>
                            <div class="agent-icon">
                               ${data.list[i].authInfo.mobile ? '<i class="icon pho-approve" title="手机已认证"></i>' : ''}
                               ${data.list[i].authInfo.noraml ? '<i class="icon single-approve" title="身份证已认证"></i>' : ''}
                               ${data.list[i].authInfo.email ? '<i class="icon mail-approve" title="邮件已认证"></i>' : ''}
                            </div>
                            <div class="card-store">

                                ${tempEmploymentCard}
    
                                <span class="agent-store">                            
                                    <a class="ah" href="${data.list[i].myShop}" target="_blank">进入店铺</a>                                 
                                </span>

                                ${tempEmploymentRecord}

                            </div>
                        </div>
                    </div>
                    <div class="right">
                        <div class="house-chat-im im-chat im-offline btn-im"  data-im="${data.list[i].imData}">微聊</div>
                        <div class="btn-phone" data-i="${i}" data-url="${data.list[i].privacyCallUrl.privacyCallUrl}">
                            <div class="phone-icon"></div>
                            <div class="phone-phone" data-i="${i}" data-url="${data.list[i].privacyCallUrl.privacyCallUrl}">点击查看电话</div>
                        </div>
                    </div>
                    <div class="empty"></div>
                </li>`
            }
    
            temp=`
            <div class="title">本房源其他经纪人
                ${more}
            </div>
            <ul  class="agent-list">
                ${tempLi}       
            </ul>`
           
            $('.agent-aggregation').append(temp);

            //次要经纪人电话获取
            // 我也不知道这里怎么了，就是不能直接用，直接输出都有 on 方法的，但是就是报 not a Function 的错误。。。。
            setTimeout(()=>{
                $('.agent-aggregation').on('click', '.btn-phone', function(element) {
                    let _index = $(this).attr('data-i')
                    let privacyCallUrl=$(this).attr('data-url');
                    _this.getPrivacyPhone(privacyCallUrl, $(this).find('.phone-phone'));
                    // //次要经纪人电话点击埋点
                    (<any>window).clickLog('from=200000003381000100000010&position='+(_index+1));
                });
            },0);
            
            //次要经纪人模块展现埋点
            (<any>window).clickLog('from=200000003379000100000100');


            //查看更多点击埋点
            $('.more').on('click', () => {
                (<any>window).clickLog('from=200000003384000100000010');
            })

            //次要经纪人头像点击埋点
            $('.heada').each(
                (_index, element) => $(element).on('click', () => {
                    (<any>window).clickLog('from=200000003382000100000010&position='+(_index+1));
                })
            )
            //次要经纪人微聊点击埋点
            $('.btn-im').each(
                (_index, element) => $(element).on('click', () => {
                    (<any>window).clickLog('from=200000003380000100000010&position='+(_index+1));
                })
            )
        }else{
            $('.agent-aggregation').css({'display':'none'});
        }
    }

    // 获取电话
    private getPrivacyPhone(privacyCallUrl : string ,element): void{
        var _url = privacyCallUrl || '';
        Request.jsonp(_url, {
            json: null,
            successCode: 64338,
            failCode: 64339
        }, 'jsoncallback').then((res: any) => {
            if(res && res.code === 0 && res.data){                       
                var trimPhone=res.data.substr(0);
                element.text(trimPhone);
            }else {
                element.text("空号码");
            }
        })
        // $.ajax({
        //     url:_url,
        //     type:"GET",
        //     data:'json',
        //     dataType: 'jsonp',
        //     jsonp: 'jsoncallback',
        //     success: function(res){
        //         if(res && res.code === 0 && res.data){                       
        //             var trimPhone=res.data.substr(0);
        //             element.text(trimPhone);
        //         }else {
        //             element.text("空号码");
        //         }
        //     }
        // });
    }
}
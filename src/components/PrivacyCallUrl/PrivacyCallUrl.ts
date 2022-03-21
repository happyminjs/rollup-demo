import Request from '../../utils/request';
//点击电话蒙层请求密号
export default class PrivacyCallUrl {
    constructor (json4fe){
        if(json4fe.privacyCallUrl){
            var _url : string  = json4fe.privacyCallUrl || '';
            $('.chat-phone-layer').on('click',function(){
                $('.phone-num').text('');
                Request.jsonp(_url, {
                    'json': null,
                    successCode: 64346,
                    failCode: 64347
                }, 'jsoncallback').then((res: any) => {
                    if(res && res.code === 0 && res.data){
                        var trimPhone=res.data.substr(0);
                        $('.phone-num').text(trimPhone);
                        if(res.message != 'realNum'){
                            $(".house-chat-phonenum").append('<p class="phone-belong"><span>此号码为虚拟号，10分钟内有效</span> </p>');
                            $(".phone-num").removeClass('phone-num').addClass('phone-num-virtual');
                        }
                    }else {
                        console.log('空号码');
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
                //             $('.phone-num').text(trimPhone);
                //             if(res.message != 'realNum'){
                //                 $(".house-chat-phonenum").append('<p class="phone-belong"><span>此号码为虚拟号，10分钟内有效</span> </p>');
                //                 $(".phone-num").removeClass('phone-num').addClass('phone-num-virtual');
                //             }
                //         }else {
                //             console.log('空号码');
                //         }
                //     }
                // });
            })
        }
    }
}
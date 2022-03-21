import FangLib from 'fang-flib';

export default class WebIM{
  constructor(flib: FangLib){
    //微聊的登录前置，目的：登录后刷新页面，确保进入微聊界面是参数是加密（和登录用户相关）后的
    let isLogined = flib.utils.getCookie('PPU')
    !isLogined && $( ".im-chat" ).one( "click", function() { //未登录才绑定登录回调
      flib.adapter.login();
    });
  }
}
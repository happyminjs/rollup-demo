/**
 * 搜索框数据联想
 */
export default class AutoCompare {
    constructor(){
        AutoCompare.placeholder();
        AutoCompare.autoCompare();
    }

    static placeholder () {
        $.fn.placeholder = function(options){
            let sel=this.selector;
            let defaults={
                text:'请输入关键字',
                keyup:$.noop,
                focusColor:'#555',
                blurColor:'#C8C8C8'
            };
            let opt = $.extend(defaults, options);
            $(sel).css('color',opt.blurColor).val(opt.text);
            $(sel).on({
                keyup:function(e){
                    opt.keyup.call(this,e);
                    return false;
                },
                focus:function(){
                    let key=$(this).val();
                    if(key.length==0||key==opt.text){
                        $(this).val('');
                    }
                    $(this).css('color',opt.focusColor)
    
                },
                blur:function(){
                    let key=$(this).val();
                    if(key.length==0){
                        $(this).val(opt.text);
                    }
                    $(this).css('color',opt.blurColor)
                }
            });
            return this;
        };
    }
    
    static autoCompare () {
        $.fn.autoCompare = function(options){
            let sel=this.selector;
            let othis = $(this);
            let defaults={
                sfn:$.noop,
                faSel:'td',
                ulSel:'ul',
                liSel:'li',
                sBtnSel:'.tdNavBtn',
                data:{text:'data_val',key:'id'},
                selectCls:'hoverbg'
            }
            let opt = $.extend(defaults, options);
            function updateData(){
                opt.fa=$(this).parents(opt.faSel);
                opt.sBtn=$(opt.sBtnSel);
                opt.ul=$(opt.ulSel,opt.fa);
                opt.li=$(opt.liSel,opt.ul);
                opt.len=opt.li.length;
                opt.index=-1;
                opt.li.each(function(i){
                    if($(this).hasClass(opt.selectCls)){
                        opt.index=i;
                    }     
                    $(this).bind('click',function(){
                        othis.val($(this).attr("data"));
                        othis.attr('searchId', $(this).attr("id"))
                        opt.sBtn.click();
                    })
                })
            }
            function updatali(index){
                if(opt.len == 0){
                    opt.index=-1;
                    return;
                }
                opt.index=(index>opt.index&&index>=opt.len)?-1:index;
                opt.index=(index<opt.index&&index<=-1)?opt.len:index;
                opt.li.removeClass(opt.selectCls).eq(opt.index<0?0:opt.index).addClass(opt.selectCls);
                var li = opt.li.eq(index)
                $(sel).val(li.attr('data'));
                $(sel).attr('searchId', li.attr('id'));
            }
            function keyupAction(e){
                updateData.call(this);
                switch (e.keyCode){
                    case 40:
                        updatali(opt.index+1);
                        break;
                    case 38:
                        updatali(opt.index-1);
                        break;
                    case 13:
                        opt.sBtn.click();
                        break;
                    default:
                        opt.sfn.call(this,e)
                }
                return false;
            }
            $(sel).bind({
                keyup:function(e){
                    keyupAction.call(this,e)
                    return false;
                },
                blur:function(e){
                    updateData.call(this,e);
                }
            })
            $(document).click(function(e){
                if($(e.target).parents().is(opt.faSel))return;
                opt.ul&&opt.ul.hide();
    
            })
        };
    }
}
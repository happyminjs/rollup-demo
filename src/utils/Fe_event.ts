/*
	comment: 新版租房-event事件函数 
*/

export default function() {
    var getDom = function(id){  
        if ('string' == typeof id || id instanceof String) {  
            return document.getElementById(<any>id);  
        }  
        else   
            if (id && id.nodeName && (id.nodeType == 1 || id.nodeType == 3 || id.nodeType == 9)) {  
                return id;  
            }  
        return null;  
    };
    
    return {
        _listeners: [],  
        on: function(element, type, listener){  
            element = getDom(element);  
            if(!element) return;  
            type = type.replace(/^on/i, '');  
            var realListener = function(ev){  
                    // 1. 这里不支持EventArgument,  原因是跨frame的事件挂载  
                    // 2. element是为了修正this  
                    listener.call(element, ev);  
                },   
                self= this,   
                lis = self._listeners,   
                filter = self._eventFilter,   
                afterFilter,   
                realType = type;  
                type = type.toLowerCase();  
            // filter过滤  
            if (filter && filter[type]) {  
                afterFilter = filter[type](element, type, realListener);  
                realType = afterFilter.type;  
                realListener = afterFilter.listener;  
            }  
              
            // 事件监听器挂载  
            if (element.addEventListener) {  
                element.addEventListener(realType, realListener, false);  
            }  
            else   
                if (element.attachEvent) {  
                    element.attachEvent('on' + realType, realListener);  
                }  
              
            // 将监听器存储到数组中  
            lis[lis.length] = [element, type, listener, realListener, realType];  
            return element;  
        }, 
        
        preventDefault: function(event){  
            if (event.preventDefault) {  
                event.preventDefault();  
            }  
            else {  
                event.returnValue = false;  
            }  
        }
    }
}

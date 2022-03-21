/*
	comment: 新房搜索-dom模块 
*/
import frame from './Fe_Frame';
let Frame: any = frame();
import Event from './Fe_event';
let event: any = Event();
export default function(){
    return {
        _NAME_ATTRS: (function () {  
                var result = {  
                    'cellpadding': 'cellPadding',  
                    'cellspacing': 'cellSpacing',  
                    'colspan': 'colSpan',  
                    'rowspan': 'rowSpan',  
                    'valign': 'vAlign',  
                    'usemap': 'useMap',  
                    'frameborder': 'frameBorder'  
                };  
  
                if (Frame.isIE && !(Frame.isIE8) && !(Frame.isIE9)) {  
                    result['for'] = 'htmlFor';  
                    result['class'] = 'className';  
                } else {  
                    result['htmlFor'] = 'for';  
                    result['className'] = 'class';  
                }  
  
                return result;  
            })(),  
        setAttr: function (element, key, value) {  
                if (arguments.length == 3) {  
                    element = this.get(element);  
                    if ('style' == key) {  
                        element.style.cssText = value;  
                    } else if ('html' == key) {  
                        element.innerHTML = value;  
                    } else if ('listeners' == key) {  
                        for (var eventName in value) {  
                            event.on(element, eventName, value[eventName]);  
                        }  
                    } else if ('childrens' == key) {  
                        for (var i = 0, leni = value.length; i < leni; i++) {  
                            if (Frame.isElement(value[i])) {  
                                element.appendChild(value[i]);  
                            }  
                        }  
                    } else {  
                        key = this._NAME_ATTRS[key] || key;  
                        element.setAttribute(key, value);  
                    }  
                    return element;  
                } else if (arguments.length == 2) {  
                    element = this.get(element);  
                    var attributes = arguments[1]; 
                    var key:any; 
                    for (key in attributes) {  
                        this.setAttr(element, key, attributes[key]);  
                    }  
                    return element;  
                }  
            },
        create: function (tagName, options) {
            if(arguments.length == 1) {  
                var self = this,  
                    tempdiv = self.create('div', {  
                        html : tagName  
                    });  
                return tempdiv.childNodes;  
            } else if(arguments.length == 2) {  
                options = options || {};  
                var el = document.createElement(tagName);  
                return this.setAttr(el, options);  
            }  
        },  
        remove: function (id) {  
            var el = this.get(id);  
            if (el.parentNode) {  
                el.parentNode.removeChild(el);  
            }  
        },    
        show: function (id) {  
            var el = this.get(id);  
            if (Frame.isElement(el) && el.style.display) {  
                el.style.display = "";  
            }  
        },  
        hide: function (id) {  
            var el = this.get(id);  
            if (Frame.isElement(el) && el.style.display != "none") {  
                el.style.display = "none";  
            }  
        },  
        get: function (id) {  
            if ('string' == typeof id || id instanceof String) {  
                return document.getElementById(<any>id);  
            } else if (id && id.nodeName && (id.nodeType == 1 || id.nodeType == 9)) {  
                return id;  
            }  
            return null;  
        },
        
        addClass: function (element, className) {  
            element = this.get(element);  
            if (!element) return;  
            if (!this.hasClass(element, className)) {  
                element.className += ' ' + className;  
            }  
        },  
        removeClass: function (element, className) {  
            element = this.get(element);  
            if (!element) return;  
            if (this.hasClass(element, className)) {  
                var reg = new RegExp('(\\s|^)' + className + '(\\s|$)');  
                element.className = element.className.replace(reg,' ');  
            }  
        },
        hasClass: function (element, className) {  
            element = this.get(element);  
            if (!element) return false;  
            return -1 < (" " + element.className + " ").indexOf(" " + className + " ");  
        },
        _listeners: [],  
        _eventFilter: {}, 
        on: function(element, type, listener){  
                element = (<any>window).getDom(element);  
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
        }
    }
}

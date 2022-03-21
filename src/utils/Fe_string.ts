/*
	comment: 新版租房-字符串封装模块 
*/
import frame from './Fe_Frame';
let Frame: any = frame();

export default function(){
    return {
        /** 
             * 格式化字符串，支持按索引替换 
             */  
        format: function(format){  
            var args = Frame.toArray(arguments, 1);  
            return format.replace(/\{(\d+)\}/g, function(m, i){  
                return args[i];  
            });  
        }, 
        trim: function(source){  
            var re = /^\s+|\s+$/g;  
            return source.replace(re, "");  
        }, 
        isEmpty: function(v, allowBlank) {
            return v === null || v === undefined || ((Frame.isArray(v) && !v.length)) || (!allowBlank ? v === "": false);
        },
        
        each: function(array, fn, scope) {
            if (this.isEmpty(array, true)) {
                return;
            }
            if (typeof array.length == "undefined" || typeof array == "string") {
                array = [array];
            }
            for (var i = 0,
            len = array.length; i < len; i++) {
                if (fn.call(scope || array[i], array[i], i, array) === false) {
                    return i;
                }
            }
        },
        
        urlDecode: function(string, overwrite) {
            var obj = {},
            pairs = string.split("&"),
            d = decodeURIComponent,
            name,
            value;
            this.each(pairs,
            function(pair) {
                pair = pair.split("=");
                name = d(pair[0]);
                value = d(pair[1]);
                obj[name] = overwrite || !obj[name] ? value: [].concat(obj[name]).concat(value);
            });
            return obj;
        },
        
        apply:function(o, c, defaults) {
            if (defaults) Frame.apply(o, defaults);  
            if (o && c && typeof c == 'object') {  
                for (var p in c) {  
                    o[p] = c[p];  
                }  
            }  
            return o;  
        },
        
        isObject: function (v) { 
            return !!v && Object.prototype.toString.call(v) === '[object Object]'; 
        },  
        isString: function (v) { 
            return typeof v === 'string'; 
        }
    }
}

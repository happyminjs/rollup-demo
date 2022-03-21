/*
 *	comment: 新版租房-Frame模块
 *  update: 2016-10-14 by Caroline
 */
export default function(){
    return {
        isArray: function (v) { 
            return Object.prototype.toString.apply(v) === '[object Array]'; 
        },  
        isEmpty: function(v, allowBlank) {
            return v === null || v === undefined || ((this.isArray(v) && !v.length)) || (!allowBlank ? v === "": false);
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
            if (defaults) this.apply(o, defaults);  
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
        },
        
        toArray : function (a, i, j, res) {  
            res = [];  
            this.each(a, function (v) {  
                res.push(v);  
            });  
            if(arguments.length > 1) return res.slice(i || 0, j || res.length);  
            else return res;  
        },
        filter: function(x, v) {
            var t = [], s = 0, r = x.length, w, u;
            if ("function" == typeof v) {
                for (u = 0; u < r; u++) {
                    w = x[u];
                    if (true === v.call(x, w, u)) {
                        t[s++] = w;
                    }
                }
            }
            return t;
        },
        isElement: function(v) {
            return v && v.nodeType == 1 && v.nodeName;
            var re = /^\[object HTML|^\[object .*NodeList\]$|^\[object DOM/;
            if ("toString" in v) {
                return re.test(v.toString()) || v.nodeType == 1 && v.NodeName;
            } else {
                return re.test(String(v)) || v.nodeType == 1 && v.NodeName;
            }
        },
        log: function(obj){
            try{
                if(console){
                    //console.log(obj);
                }else{
                    alert(obj);
                }
            }catch(e){}
        },
        isBoolean: function(v){return typeof v==="boolean";},
        isDefined: function(v){return typeof v!=="undefined";},
        isDate: function(v){return Object.prototype.toString.apply(v)==="[object Date]";}
    }
}
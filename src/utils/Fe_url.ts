/*
	comment: 新版租房-url拼接模块 
*/
import frame from './Fe_Frame';
let Frame: any = frame();
import String from "./Fe_string";
let string : any = String();
import ConfigJson4fe from './ConfigJson4fe';
let config: any = ConfigJson4fe();


export default function () {
    var uri:any = function (url?) {
        if (url) {
            Frame.apply(this, uri.resolve(url));
        } else {
            Frame.apply(this, {
                protocol: location.protocol,
                host: location.host,
                hostname: location.hostname,
                port: location.port,
                pathname: location.pathname,
                search: location.search,
                hash: location.hash
            });
        }
        if (!url) url = location.href;
        var obj = uri.shred(url);
        this.path = obj.pp;
        this.query = obj.sp;
        if (this.path.jh) {
            this.query.key = uri.encode(this.path.jh);
            delete this.path.jh;
        }
    };

    uri.prototype = {
        path: null,
        query: null,
        set: function (path, query) {
            return this.setPath(path).setQuery(query);
        },
        get: function (objName) {
            return this.path[objName] || this.query[objName];
        },
        setQuery: function (queryname, value) {
            if (arguments.length == 1 && Frame.isEmpty(arguments[0])) {
                this.query = {};
            } else if (arguments.length == 2) {
                this.query[queryname] = value;
            } else if (arguments.length == 1 && Frame.isObject(queryname)) {
                Frame.apply(this.query, queryname);
            }
            return this;
        },
        setPath: function (pathname, value) {
            if (arguments.length == 1 && Frame.isEmpty(arguments[0])) {
                this.path = {};
            } else if (arguments.length == 2) {
                this.path[pathname] = value;
            } else if (arguments.length == 1 && Frame.isObject(pathname)) {
                Frame.apply(this.path, pathname);
            }
            return this;
        },
        toString: function () {
            return (<any>uri).create({
                pp: this.path,
                sp: this.query
            });
        }
    };

    // 房产旗舰店的url格式和主站不一样http://shop.58.com/\d{}
    if (config.j.qjd) { 
        Frame.apply(uri, {
            urlpathRegExp: /:\/\/shop\.58\.com\/(\d+)\/(?:([a-zA-Z_]+)\/)?([a-zA-Z]+)\/(?:jh_([^/]*)\/)?(?:(bus|sub)\/)?(?:l([^\/]+)\/)?(?:s([0-9_]+)\/)?(?:t(\d)\/)?(?:(0|1)\/)?(?:([a-zA-Z][0-9]+[a-zA-Z0-9]*)\/)?(?:pn(\d+)\/)?(?:size(\d+)\/)?(?:sort-([a-z|A-Z|0-9]+_[a-z|A-Z]+)\/)?/i,
            urlpathFormat: location.protocol + '//shop.58.com/{0}{1}{2}{3}{4}{5}{6}{7}{8}{9}{10}{11}',
            urlpathParams: [{
                    name: 'city',
                    tpl: '{0}/'
                },
                'local',
                'cate',
                {
                    name: 'jh',
                    tpl: 'jh_{0}/'
                },
                'type',
                {
                    name: 'line',
                    tpl: 'l{0}/'
                },
                {
                    name: 'station',
                    tpl: 's{0}/'
                },
                {
                    name: 'time',
                    tpl: 't{0}/'
                },
                'biz',
                'paras',
                {
                    name: 'page',
                    tpl: 'pn{0}/'
                },
                {
                    name: 'pagesize',
                    tpl: 'size{0}/'
                },
                {
                    name: 'sort',
                    tpl: 'sort-{0}/'
                }
            ],
            pathFormatter: {},
            searchFormatter: {
                key: {
                    encode: function (v) {
                        return uri.encode(v);
                    }
                }
            }
        });
    } else {
        Frame.apply(uri, {
            urlpathRegExp: /:\/\/([^.]+)\.58\.com\/(?:([a-zA-Z_]+)\/)?([a-zA-Z]+)\/(?:jh_([^/]*)\/)?(?:(bus|sub)\/)?(?:l([^\/]+)\/)?(?:s([0-9_]+)\/)?(?:t(\d)\/)?(?:(0|1)\/)?(?:([a-zA-Z][0-9]+[a-zA-Z0-9]*)\/)?(?:pn(\d+)\/)?(?:size(\d+)\/)?(?:sort-([a-z|A-Z|0-9]+_[a-z|A-Z]+)\/)?(?:(pve_[^\/]+))?/i,
            urlpathFormat: location.protocol + '//{0}.58.com/{1}{2}{3}{4}{5}{6}{7}{8}{9}{10}{11}{12}{13}',
            urlpathParams: [{
                    name: 'city',
                    tpl: '{0}'
                },
                'local',
                'cate',
                {
                    name: 'jh',
                    tpl: 'jh_{0}/'
                },
                'type',
                {
                    name: 'line',
                    tpl: 'l{0}/'
                },
                {
                    name: 'station',
                    tpl: 's{0}/'
                },
                {
                    name: 'time',
                    tpl: 't{0}/'
                },
                'biz',
                'paras',
                {
                    name: 'page',
                    tpl: 'pn{0}/'
                },
                {
                    name: 'pagesize',
                    tpl: 'size{0}/'
                },
                {
                    name: 'sort',
                    tpl: 'sort-{0}/'
                },
                'pve'
            ],
            pathFormatter: {},
            searchFormatter: {
                key: {
                    encode: function (v) {
                        return uri.encode(v);
                    }
                }
            },
        });
    }

    Frame.apply(uri, {
        /** 
         * encode keyword 
         **/
        encode: function (value) {
            return (Frame.isEmpty(value) ? '' : encodeURI(escape(value)));
        },
        /** 
         * @alias {util.url.decode} decode keyword 
         * @param {String} value  
         * @return {String} decoded value    
         * 针对escape、encodeURI、encodeURIComponent三种编码方式，根据其编码特征来处理 
         *  
         * 1、escape，特征最为明显，对于值小与255的字符编码格式为%[a-zA-Z0-9]{2}，对值大于255的字符编码格式为%u[a-zA-Z0-9]{4}， 
         *    escape不进行编码的字符有69个： *，+，-，.，/，@，_，0-9，a-z，A-Z 
         * 2、encodeURI，编码格式为%[a-zA-Z0-9]{2}, 
         *    encodeURI不进行编码的字符有82个：!，#，$，&，'，(，)，*，+，,，-，.，/，:，;，=，?，@，_，~，0-9，a-z，A-Z 
         * 3、encodeURIComponent三种编码方式，编码格式为%[a-zA-Z0-9]{2}, 
         *    encodeURIComponent不进行编码的字符有71个：!， '，(，)，*，-，.，_，~，0-9，a-z，A-Z 
         *  
         * 提取三种编码方式不同的部分： 
         * 当字符的值小于255时，三种编码方式结果相同，可以任意使用一种解码方式 
         * 当字符的值大于255时，escape编码的结果与另外两者不同，可根据其编码特征来处理， 
         * 即当编码格式为%u[a-zA-Z0-9]{4}时，使用unescape解码， 
         * 当编码格式为%[a-zA-Z0-9]{2}时，因为encodeURIComponent不进行编码的字符少于encodeURI， 
         * 则可判断decodeURIComponent可以同时针对encodeURI和因为encodeURIComponent两种编码方式进行解码 
         *  
         * 记录解码结果，如果解码后与原字符串相同，则结束递归 
         */
        decode: function (value) {
            var ov = value,
                nv;
            // if (/^((%u[a-zA-Z0-9]{4})|(%[a-zA-Z0-9]{2})|([\*\+-\./@_0-9a-zA-Z]*))*$/ig.test(ov)) nv = unescape(ov);  

            var re4escape = new RegExp('%u[a-zA-Z0-9]{4}', 'ig');
            var re4decodeuri = new RegExp('^((%[a-zA-Z0-9]{2})|([!#\$&\'\(\)\*\+,-\./:;=\?@_~a-zA-Z0-9]))*$', '');

            if (re4escape.test(ov)) nv = unescape(ov);
            else if (re4decodeuri.test(ov)) nv = decodeURIComponent(ov);
            else nv = ov;
            if (ov != nv) return this.decode(nv);
            else return nv;
        },
        /** 
         * @alias {util.uri.resolve} 
         * @params {String} url 
         * @returns {Object} { 
         *     protocol: location.protocol, 
         *     host: location.host, 
         *     hostname: location.hostname, 
         *     port: location.port, 
         *     pathname: location.pathname, 
         *     search: location.search, 
         *     hash: location.hash 
         * } 
         */
        resolve: function (url) {
            var self = this,
                u = url,
                re = /^(http|ftp|https):\/\/(\w*\.)+(\w*)/i,
                full = re.test(u),host,hostname,port,pathname,search,hash,
                protocol = host = hostname = port = pathname = search = hash = '';

            var index = -1,
                str = u,
                parts = [];
            if (full) {
                index = str.indexOf(':');
                protocol = index != -1 ? str.substring(0, index + 1) : '';
                str = str.substring(index + 3);

                index = str.indexOf('/');
                if (index != -1) {
                    parts = str.substring(0, index).split(':');
                    if (parts[0]) {
                        host = parts[0];
                        hostname = parts[0];
                    }
                    if (parts[1]) {
                        port = parts[1];
                    }
                }
                str = str.substring(index + 1);
            }
            var index1 = str.indexOf('?'),
                index2 = str.indexOf('#');
            if (index1 != -1) {
                pathname = str.substring(0, index1);
                if (index2 != -1) {
                    search = str.substring(index1, index2 - index1);
                    host = str.substring(index2);
                } else {
                    search = str.substring(index1);
                    host = '';
                }
            }
            if (index1 == -1) {
                if (index2 != -1) {
                    pathname = str.substring(0, index2);
                    host = str.substring(index2);
                } else {
                    pathname = str;
                }
            }
            return {
                protocol: protocol,
                host: host,
                hostname: hostname,
                port: port,
                pathname: pathname,
                search: search,
                hash: hash
            };
        },
        /** 
         * 分割url，返回相对应的参数 
         * pp，path params 
         * sp，search params 
         * @param {String} url 
         * @return {Object}  
         * { 
         *  pp : pp, 
         *  sp : sp 
         * } 
         */
        shred: function (url) {
            var self = this,
                arr = url.split('?'),
                path = arr.length > 0 ? arr[0] : '',
                search = arr.length > 1 ? arr[1] : '',
                pp = {},
                sp = {};
            /** 
             * 根据配置的url正则来分解path params 
             * 如果没有对应的解码器，则用默认的decodeURIComponent方法 
             */
            if (path.charAt(path.length - 1) != '/') {
                path += '/';
            }
            if (path && self.urlpathRegExp) {
                var m = self.urlpathRegExp.exec(path);
                if (m) {
                    for (var i = 0, leni = self.urlpathParams.length, lenm = m.length - 1; i < leni && i < lenm; i++) {
                        if (m[i + 1]) {
                            var v = m[i + 1],
                                name = '';
                            if (Frame.isString(self.urlpathParams[i])) {
                                name = self.urlpathParams[i];
                            } else {
                                name = self.urlpathParams[i].name;
                            }
                            if (!Frame.isEmpty(name) && !Frame.isEmpty(v)) {
                                if (self.pathFormatter[name] && self.pathFormatter[name].decode)
                                    {
pp[name] = self.pathFormatter[name].decode(v);} else
                                    {
pp[name] = decodeURIComponent(v);
}
                            }
                        }
                    }
                }
            }
            /** 
             * 分解search params参数 
             * 如果没有对应的解码器，则用默认的decodeURIComponent方法 
             */
            if (search) {
                var querys = search.split('&');
                for (var i = 0, leni = querys.length; i < leni; i++) {
                    var temp = querys[i].split('=');
                    if (temp.length != 2) continue;
                    var name:string = temp[0],
                        v = temp[1];
                    if (!Frame.isEmpty(name) && !Frame.isEmpty(v)) {
                        if (self.searchFormatter[name] && self.searchFormatter[name].decode) {
                            sp[name] = self.searchFormatter[name].decode(v);
                        } else {
                            sp[name] = decodeURIComponent(v);
                        }
                    }
                }
            }
            return {
                pp: pp,
                sp: sp
            };
        },
        /** 
         * 根据参数创建一个url 
         * @param {Object} obj {pp:pp, sp:sp} 
         * @return {String} url 
         */
        create: function (obj) {
            if (!obj || !obj.pp) {return '';
}
            var pp = obj.pp,
                sp = obj.sp,
                url,
                path,
                search,
                ppp = [],
                spp = [];
            /** 
             * 根据path params创建url 路径部分 
             * 如果没有对应的编码器，则用默认的encodeURIComponent方法 
             * 
             * 如果配置了单独的tpl，则对参数进行格式化 
             */
            ppp.push(this.urlpathFormat);
            for (var i = 0, leni = this.urlpathParams.length; i < leni; i++) {
                var name, v;
                if (Frame.isString(this.urlpathParams[i])) {
                    name = this.urlpathParams[i];
                    v = pp[name];
                } else {
                    name = this.urlpathParams[i].name;
                    v = pp[name];
                }
                if (!Frame.isEmpty(name) && !Frame.isEmpty(v)) {
                    if (this.pathFormatter[name] && this.pathFormatter[name].encode) {
                        v = this.pathFormatter[name].encode(v);
                    } else {
                        v = encodeURIComponent(v);
                    }
                    if (Frame.isString(this.urlpathParams[i]))
                        {
ppp.push(v + '/');} else
                        {
ppp.push(string.format(this.urlpathParams[i].tpl, v));
}
                } else
                    {
ppp.push('');
}
            }
            path = string.format.apply(null, ppp);

            /** 
             * 根据search params创建url 查询部分 
             * 如果没有对应的编码器，则用默认的encodeURIComponent方法 
             */
            for (var query in sp) {
                if (!Frame.isEmpty(sp[query])) {
                    if (this.urlsearchParams && this.urlsearchParams[query]) {
                        spp.push(query + '=' + this.urlsearchParams[query](sp[query]));
                    } else {
                        spp.push(query + '=' + encodeURIComponent(sp[query]));
                    }
                }
            }
            search = spp.join('&');

            url = path + (Frame.isEmpty(search) ? '' : '?' + search);
            return url;
        }
    });

    return uri;
}

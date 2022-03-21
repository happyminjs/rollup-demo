/*
    comment: 新版租房-搜索跳转函数 
*/
// let ConfigJson4fe= require('./ConfigJson4fe');
import frame from './Fe_Frame';
let Frame: any = frame();
import Dom from './Fe_dom';
let dom: any = Dom();
import String from "./Fe_string";
let string : any = String();
import Url from './Fe_url';
let uri: any = Url();
import ConfigJson4fe from './ConfigJson4fe';
let config: any = ConfigJson4fe();


export default function () {
    function leftPad(num) {
        if (num < 10) return '0' + num;
        else return num + '';
    }

    //提供简洁的筛选条件  
    function ep(obj2) {
        obj2 = obj2 || {};
        if (obj2.postdate) {
            var now = new Date();
            var time = new Date();
            time.setDate(time.getDate() - parseInt(obj2.postdate + ''));
            var str = time.getUTCFullYear() + '' + leftPad(time.getUTCMonth() + 1) + leftPad(time.getUTCDate()) + '00';
            str += "_";
            str += now.getUTCFullYear() + '' + leftPad(now.getUTCMonth() + 1) + leftPad(now.getUTCDate()) + '23';

            obj2.postdate = str;
        }
        return obj2;
    }

    function FilterHtml(val) {
        var v = val.replace(/(<cite.*?>.*?<.cite>)/ig, '').replace(/(<.*?>)/ig, '');
        if (val && val != '') {
            v = val.replace(/(<cite.*?>.*?<.cite>)/ig, '').replace(/(<span.*?>.*?<.span>)/ig, '').replace(/(<.*?>)/ig, '');
        } else {
            v = '';
        }
        return v;
    }

    var sift = {
        queryName: 'b_link',
        paraName: 'para',
        init: function () {
            var queryInputs = document.getElementsByName('b_q'),
                url = new uri(),
                kv = {},
                rv = {};

            /** 
             * 获取所有查询控件 
             */
            for (var i = 0, leni = queryInputs.length; i < leni; i++) {
                var input = queryInputs[i],
                    para = input.getAttribute('para'),
                    rel = input.getAttribute('rel');
                if (!rel) {
                    if (!kv[para]) {
                        kv[para] = [];
                    }
                    kv[para].push(input);
                } else {
                    if (!rv[rel]) {
                        rv[rel] = {
                            radios: [],
                            inputs: []
                        };
                    }
                    if ((<any>input).type == 'radio') rv[rel].radios.push(input);
                    else if ((<any>input).type == 'text') rv[rel].inputs.push(input);
                }
            }

            /** 
             * 给所有para查询控件附上初始值 
             */
            for (var para in kv) {
                if (url.query[para]) {
                    if (kv[para].length == 1) {
                        this.setValue(kv[para][0], FilterHtml(url.query[para]));
                    } else if (kv[para].length == 2) {
                        var arr = url.query[para].split('_');
                        this.setValue(kv[para][0], arr[0]);
                        this.setValue(kv[para][1], arr[1]);
                    } else if (kv[para].length > 2) {
                        var arr = url.query[para].split(',');
                        for (var i = 0,
                            leni = kv[para]; i < leni; i++) {
                            if (arr[i]) this.setValue(kv[para][i], arr[i]);
                        }
                    }
                } else {
                    if (kv[para] > 0) {
                        for (var i = 0,
                            leni = kv[para]; i < leni; i++) {
                            this.clearValue(kv[para][i]);
                        }
                    } else {
                        this.clearValue(kv[para][0]);
                        // var placeholder= $('#keyword1').attr('placeName')||'';
                        // $('#keyword1').placeholder({text:placeholder}); 
                    }
                }
            }

            /** 
             * 给所有radio查询控件赋上初始值 
             */
            for (var rel in rv) {
                for (var i = 0,
                    leni = rv[rel].radios.length; i < leni; i++) {
                    var para = rv[rel].radios[i].getAttribute('para');
                    if (para && url.query[para]) {
                        rv[rel].radios[i].checked = 'checked';
                        var arr = url.query[para].split('_');
                        for (var i = 0,
                            leni = rv[rel].inputs.length; i < leni; i++) {
                            if (arr[i]) this.setValue(rv[rel].inputs[i], arr[i]);
                        }
                        break;
                    }
                }
            }

            /** 
             * 给所有下拉框控件附上初始值 
             */
            var query_selects = document.getElementsByName('b_s');
            for (var i = 0,
                leni = query_selects.length; i < leni; i++) {
                var para = query_selects[i].getAttribute('para'),
                    cv = query_selects[i].getAttribute('cv');
                if (!Frame.isEmpty(para) && !Frame.isEmpty(cv)) {
                    var obj = {};
                    obj[para] = cv;
                    if (url.query[para] == ep(obj)[para] || url.path[para] == ep(obj)[para]) {
                        (<any>query_selects[i]).parentNode.parentNode.parentNode.firstChild.innerHTML = '<b>' + query_selects[i].innerHTML + '</b>';
                    }
                }
            }

            /** 
             * fix列表页路径形式单元参数链接表示不正确的bug 
             */
            Frame.each(document.getElementsByName('b_link'),
                function (item) {
                    if (item) {
                        var ck = item.getAttribute('ck'),
                            para = item.getAttribute('para'),
                            pp = url.path[para];
                        //如果path和query里面同时不存在该key才删除高亮状态和ck、name、para属性
                        if (para != 'custom' && (item.className.indexOf("select") > -1) && (item.className.indexOf("selectMore") == -1) && (item.className.indexOf("icon_check_on") == -1) && ((!url.query[para]) && (!pp || ck && pp.indexOf(ck) == -1))) {
                            dom.removeClass(item, 'select');
                            item.removeAttribute('ck');
                            item.removeAttribute('name');
                            item.removeAttribute('para');
                        }
                    }
                });
            //是否有图筛选  
            var ispic_checkbox = dom.get('ispic');
            if (ispic_checkbox && url.query['ispic']) {
                //ispic_checkbox.checked = true;
                ispic_checkbox.setAttribute('class', 'checked');
            }

            //是否防疫筛选  
            var isfangyi_checkbox = dom.get('isfangyi');
            if (isfangyi_checkbox && url.query['isfy']) {
                isfangyi_checkbox.setAttribute('class', 'checked');
            }


            /** 
             * 给checkbox控件添加响应事件 
             * @param {Object} obj 
             */
            window["click_Ispic"] = function (obj) {
                var u = new uri();
                //if (obj.checked) {
                if ($('#ispic').hasClass('checked')) {
                    location.href = u.setQuery({
                        ispic: '1',
                        selpic: '2'
                    });
                } else {
                    location.href = u.setQuery('ispic', '');
                }
            };

            window["click_Isfangyi"] = function (obj) {
                var u = new uri();
                if ($('#isfangyi').hasClass('checked')) {
                    location.href = u.setQuery({
                        isfy: '1'
                    });
                } else {
                    location.href = u.setQuery('isfy', '');
                }
            };
            // 成都住建委新加 daily/1.0.85 start
            window['click_Ishy'] = function(obj) {
                var u = new uri();
                if ($('#ishy').hasClass('checked')) {
                    location.href = u.setQuery({
                        ishy: '1' // todo 需要和后端协商此字段筛选条件
                    })
                } else {
                    location.href = u.setQuery('ishy', '');
                }
            }
            // 成都住建委新加 daily/1.0.85 end

        },
        containerid: 'selected',
        showsiftbar: function () {
            var container = dom.get(this.containerid);
            if (!container) return;

            var count = 0,
                html = '';

            html += '<span class="condition">条件：</span>';
            var links = document.getElementsByName(this.queryName);
            for (var i = 0, leni = links.length; i < leni; i++) {
                var u = '',
                    para = links[i].getAttribute('para'),
                    pk = links[i].getAttribute('pk'),
                    ck = links[i].getAttribute('ck'),
                    cl = links[i].getAttribute('cl');
                if (!para) continue;
                if (links[i].className.indexOf('select') == -1) continue;

                if (para == 'custom') {
                    if (!cl) continue;
                    u = cl;
                } else if (pk != undefined) {
                    u = new uri();
                    (<any>u).setPath(para, pk);
                    (<any>u).setPath('page', '');
                } else if (ck != undefined) {
                    u = new uri();
                    if ((<any>u).path[para]) {
                        (<any>u).setPath(para, (<any>u).path[para].replace(ck, ''));
                    }
                    if (para === 'line') {
                        (<any>u).setPath('station', '');
                    }
                    (<any>u).setPath('page', '');
                    if ((<any>u).query[para]) {
                        (<any>u).setQuery(para, null);
                    }
                } else {
                    continue;
                }
                html += '<a title="取消" class="par" href="' + u + '"><em>' + links[i].innerHTML + '</em><i>×</i></a>';
                count++;
            }

            var queryInputs = document.getElementsByName('b_q'),
                url = new uri(),
                kv = {},
                rv = {};

            for (var i = 0,
                    leni = queryInputs.length; i < leni; i++) {
                var input = queryInputs[i],
                    para = input.getAttribute('para'),
                    rel = input.getAttribute('rel');
                if (!rel) {
                    if (!kv[para]) {
                        kv[para] = [];
                    }
                    kv[para].push(input);
                } else {
                    if (!rv[rel]) {
                        rv[rel] = {
                            para: '',
                            radios: [],
                            inputs: []
                        };
                    }
                    if ((<any>input).type == 'radio') {
                        if ((<any>input).checked) rv[rel].para = input.getAttribute('para');
                        rv[rel].radios.push(input);
                    } else if ((<any>input).type == 'text') rv[rel].inputs.push(input);
                }
            }

            for (var rel in rv) {
                if (!rel) continue;

                for (var i = 0,
                        leni = rv[rel].radios.length; i < leni; i++) {
                    kv[rv[rel].radios[i].getAttribute('para')] = null;
                }

                if (!rv[rel].para) continue;
                kv[rv[rel].para] = rv[rel].inputs;
            }

            for (var para in kv) {
                if (url.query[para]) {
                    if (para == "isreal" || para == "ispinpaigongyu") continue;
                    var str = '';
                    if (kv[para].length == 1) {
                        str = this.analyzeParams(url.query[para], para, kv[para][0].getAttribute('muti'));
                    } else if (kv[para].length == 2) {
                        var arr = url.query[para].split('_');

                        if (!Frame.isEmpty(arr[0]) && arr[1] != '*') {
                            str = this.analyzeParams(arr[0], para, kv[para][0].getAttribute('muti'));
                            str += '-';
                            str += this.analyzeParams(arr[1], para, kv[para][1].getAttribute('muti'));
                        } else if (Frame.isEmpty(arr[0])) {
                            str = '大于等于' + this.analyzeParams(arr[1], para, kv[para][0].getAttribute('muti'));
                        } else if (arr[1] == '*') {
                            str = '大于等于' + this.analyzeParams(arr[0], para, kv[para][0].getAttribute('muti'));
                        }
                    } else if (kv[para].length == 2) {
                        var arr = url.query[para].split(',');
                        for (var i = 0,
                                leni = kv[para]; i < leni; i++) {
                            if (arr[i]) str += this.analyzeParams(arr[i], para, kv[para][i].getAttribute('muti'));
                        }
                    }
                    if (str) {
                        var tu = new uri();
                        tu.setQuery(para, '');
                        if (para == 'key') {
                            tu.setQuery({
                                "final": null,
                                "jump": null,
                                "searchtype": null,
                                "prekey": null
                            });
                        }
                        tu.setQuery('cmcskey', '');
                        tu.setPath('page', '');
                        var text = '';
                        var node = kv[para][0];
                        for (var i = 0; i < 3; i++) {
                            var inputs = node.getElementsByTagName('input');
                            for (var j = 0,
                                    lenj = inputs.length; j < lenj; j++) {
                                if (inputs[j].type == 'button' && inputs[j].value) {
                                    text = inputs[j].value;
                                }
                            }
                            node = node.parentNode;
                        }
                        if (text) text += ': ';
                        text = '筛选: ';

                        html += '<a title="取消" class="par" href="' + tu + '"><em>' + text + str.replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</em><i>×</i></a>';
                        count++;
                    }
                } else if (para == 'key' && /\/key_.*\//ig.test(location.pathname)) {
                    var tu:any = location.href.replace(/\/key_.*\//ig, '/');
                    html += '<a title="取消" class="par" href="' + tu + '"><em>筛选：' + uri.decode(/\/key_(.*?)\//ig.exec(location.pathname)[1]).replace(/%20/ig, ' ') + '</em></a>';
                    count++;
                }
            }

            if (count == 0) {
                //dom.get(this.containerid).innerHTML = '<div class="barct clearfix"></div>';
                // 隐藏highlightline div 因为样式无数据时不需要那条线  
                //dom.hide("highlightline");
                //dom.hide("line_scatelist");
            } else {
                dom.get(this.containerid).innerHTML = '<div class="barct">' + html + '</div>';
                dom.get(this.containerid).style.display = 'block';
            }
        },

        showsiftbar_ershoufang: function () {
            var container = dom.get(this.containerid);
            if (!container) return;

            var count = 0,
                html = '';

            html += '<span>条件：</span>';
            var links = document.getElementsByName(this.queryName);
            var descs = {};
            for (var i = 0,
                leni = links.length; i < leni; i++) {
                var u = '',
                    para = links[i].getAttribute('para'),
                    pk = links[i].getAttribute('pk'),
                    ck = links[i].getAttribute('ck'),
                    cl = links[i].getAttribute('cl');
                if (!para) continue;
                if (!$(links[i]).hasClass('select')) continue;
                // if (links[i].className.indexOf('select') == -1 && links[i].className.indexOf('icon_check_on') == -1) continue;
                if (links[i].className) {
                    if (para == 'custom') {
                        if (!cl) continue;
                        u = cl;
                    } else if (pk != undefined) {
                        u = new uri();
                        (<any>u).setPath(para, pk);
                        (<any>u).setPath('page', '');
                    } else if (ck != undefined) {
                        u = new uri();
                        if ((<any>u).path[para]) {
                            (<any>u).setPath(para, (<any>u).path[para].replace(ck, ''));
                        }
                        if (para === 'line') {
                            (<any>u).setPath('station', '');
                        }
                        (<any>u).setPath('page', '');
                        if ((<any>u).query[para]) {
                            (<any>u).setQuery(para, null);
                        }
                        //修改复选框对应“已选条件”的url
                        if (links[i].className.indexOf('icon_check_on') != -1) {
                            var _this = $(links[i]);
                            var key = _this.parents('dl').attr('data-para-key') || _this.parent('div').attr('data-para-key');
                            if (key) {
                                var val = (<any>u).get(key);
                                if (val) {
                                    val = '|' + val + '|';
                                    val = val.replace('|' + _this.attr('data-para-value'), '');
                                    if (!val) {
                                        delete (<any>u).query[key];
                                    } else {
                                        if (val.substr(0, 1) == '|') {
                                            val = val.slice(1);
                                        }
                                        if (val.slice(-1) == '|') {
                                            val = val.slice(0, -1);
                                        }
                                        (<any>u).setQuery(key, val);
                                    }
                                }
                            }
                        }

                    } else {
                        continue;
                    }
                }
                var desc = '';
                try {
                    desc = $(links[i]).parents('.fake_select_item').attr('desc') || $(links[i]).parents('.secitem').find('dt').html();
                    //只有价格筛选、总价那块会排除，“房龄、楼层、装修那种多选条件不限制”
                    if (descs[desc] == 1 && desc.indexOf('价') > -1) {
                        continue;
                    }
                    if (!desc) {
                        desc = '';
                    }
                    descs[desc] = 1;
                } catch (e) { }
                if ((<any>links[i]).pathname.indexOf('sub') > -1 && links[i].innerHTML == "不限") {
                    continue
                }
                html += '<a title="取消" class="par" href="' + decodeURIComponent(u) + '"><em>' + desc + links[i].innerHTML.replace(/<span.*>.*<\/span>/img, '') + '</em><i>×</i></a>';
                count++;
            }

            var queryInputs = document.getElementsByName('b_q'),
                url = new uri(),
                kv = {},
                rv = {};

            var combine_query = {};
            //先取出要合并的室、厅、卫
            for (var i = 0,
                leni = queryInputs.length; i < leni; i++) {
                var input = queryInputs[i],
                    para = input.getAttribute('para'),
                    combine_key = input.getAttribute('combine');
                if (!combine_key) continue;

                if (!combine_query[combine_key]) combine_query[combine_key] = [];
                combine_query[combine_key].push(para);
            }

            for (var i = 0,
                leni = queryInputs.length; i < leni; i++) {
                var input = queryInputs[i],
                    para = input.getAttribute('para'),
                    rel = input.getAttribute('rel');
                if (!rel) {
                    if (!kv[para]) {
                        kv[para] = [];
                    }
                    kv[para].push(input);
                } else {
                    if (!rv[rel]) {
                        rv[rel] = {
                            para: '',
                            radios: [],
                            inputs: []
                        };
                    }
                    if ((<any>input).type == 'radio') {
                        if ((<any>input).checked) rv[rel].para = input.getAttribute('para');
                        rv[rel].radios.push(input);
                    } else if ((<any>input).type == 'text') rv[rel].inputs.push(input);
                }
            }

            for (var rel in rv) {
                if (!rel) continue;

                for (var i = 0,
                    leni = rv[rel].radios.length; i < leni; i++) {
                    kv[rv[rel].radios[i].getAttribute('para')] = null;
                }

                if (!rv[rel].para) continue;
                kv[rv[rel].para] = rv[rel].inputs;
            }
            //将室、厅、卫合并
            for (var p in combine_query) {
                var str = '',
                    text = '',
                    tu = new uri();
                for (var index in combine_query[p]) {
                    var para = combine_query[p][index];
                    if (!url.query[para]) continue;
                    var _str = this.analyzeParams(url.query[para], para, kv[para][0].getAttribute('muti'));
                    if (_str) {
                        //在过滤条件中加单位
                        switch (para) {
                            case 'huxingshi':
                                _str += '室';
                                break;
                            case 'huxingting':
                                _str += '厅';
                                break;
                            case 'huxingwei':
                                _str += '卫';
                                break;
                        }

                        tu.setQuery(para, '');
                        tu.setQuery('cmcskey', '');
                        tu.setPath('page', '');
                        var node = kv[para][0];
                        for (var i = 0; i < 3; i++) {
                            var inputs = node.getElementsByTagName('input');
                            for (var j = 0,
                                lenj = inputs.length; j < lenj; j++) {
                                if (inputs[j].type == 'button' && inputs[j].value) {
                                    text = inputs[j].value;
                                }
                            }
                            node = node.parentNode;
                        }
                        if (text) text += '：';
                    }
                    if (_str) {
                        str += _str + ' ';
                    }
                }
                if (str) {
                    html += '<a title="取消" class="par" href="' + tu.toString().replace('%7C', '|') + '"><em>' + text + $.trim(str) + '</em><i>×</i></a>';
                    count++;
                }
            }

            for (var para in kv) {
                var needCombine = false;
                for (var o in combine_query) {
                    if ($.inArray(para, combine_query[o]) > -1) {
                        needCombine = true;
                        break;
                    }
                }
                if (needCombine == true) continue;
                if (url.query[para]) {
                    if (para == "isreal" || para == "ispinpaigongyu") continue;
                    var str = '';
                    if (kv[para].length == 1) {
                        str = this.analyzeParams(url.query[para], para, kv[para][0].getAttribute('muti'));
                    } else if (kv[para].length == 2) {
                        var arr = url.query[para].split('_');

                        //针对二手房列表页的总价自定义筛选做特殊处理：huansuanyue/100,huansuan/1000000
                        var huansuanyueOffset = 1,
                            huansuanOffset = 10000;
                        if ((<any>window).____json4fe.ershoufang_listname === true) {
                            if (para === 'huansuanyue') {
                                if (arr[0] != '*') arr[0] = (arr[0] - 0) / huansuanyueOffset;
                                if (arr[1] != '*') arr[1] = (arr[1] - 0) / huansuanyueOffset;
                            } else if (para === 'huansuan') {
                                if (arr[0] != '*') arr[0] = (arr[0] - 0) / huansuanOffset;
                                if (arr[1] != '*') arr[1] = (arr[1] - 0) / huansuanOffset;
                            }
                            arr[0] = '' + arr[0];
                            arr[1] = '' + arr[1];
                        }

                        if (!Frame.isEmpty(arr[0]) && arr[1] != '*') {
                            if (para === 'huansuanyue' || para === 'huansuan') {
                                str = arr[0] + '-' + arr[1];
                            } else {
                                str = this.analyzeParams(arr[0], para, kv[para][0].getAttribute('muti'));
                                str += '-';
                                str += this.analyzeParams(arr[1], para, kv[para][1].getAttribute('muti'));
                            }
                        } else if (Frame.isEmpty(arr[0])) {
                            if (para === 'huansuanyue' || para === 'huansuan') {
                                str = '大于等于' + arr[1];
                            } else {
                                str = '大于等于' + this.analyzeParams(arr[1], para, kv[para][0].getAttribute('muti'));
                            }

                        } else if (arr[1] == '*') {
                            if (para === 'huansuanyue' || para === 'huansuan') {
                                str = '大于等于' + arr[0];
                            } else {
                                str = '大于等于' + this.analyzeParams(arr[0], para, kv[para][0].getAttribute('muti'));
                            }

                        }
                    } else if (kv[para].length == 2) {
                        var arr = url.query[para].split(',');
                        for (var i = 0,
                            leni = kv[para]; i < leni; i++) {
                            if (arr[i]) str += this.analyzeParams(arr[i], para, kv[para][i].getAttribute('muti'));
                        }
                    }
                    //在过滤条件中加单位
                    switch (para) {
                        case 'shoufu':
                            str += '万';
                            break;
                        case 'huansuanyue':
                            str += '万元';
                            break;
                        case 'huansuan':
                            str += '万元/㎡';
                            break;
                        case 'area':
                            str += '㎡';
                            break;
                        case 'huxingshi':
                            str += '室';
                            break;
                        case 'huxingting':
                            str += '厅';
                            break;
                        case 'huxingwei':
                            str += '卫';
                            break;
                    }
                    if (str) {
                        var tu = new uri();
                        tu.setQuery(para, '');
                        if (para == 'key') {
                            tu.setQuery({
                                "final": null,
                                "jump": null,
                                "searchtype": null,
                                "prekey": null
                            });
                        }
                        tu.setQuery('cmcskey', '');
                        tu.setPath('page', '');
                        var text = '';
                        var node = kv[para][0];
                        for (var i = 0; i < 3; i++) {
                            var inputs = node.getElementsByTagName('input');
                            for (var j = 0,
                                lenj = inputs.length; j < lenj; j++) {
                                if (inputs[j].type == 'button' && inputs[j].value) {
                                    text = inputs[j].value;
                                }
                            }
                            node = node.parentNode;
                        }
                        if ('搜全站' == text) text = '搜本类';
                        if (text == "查找") {
                            text = "首付";
                            tu.setQuery('bunengdaikuan', '')
                        }
                        if (text) text += '：';

                        html += '<a title="取消" class="par" href="' + tu + '"><em>' + text + str + '</em><i>×</i></a>';
                        count++;
                    }
                } else if (para == 'key' && /\/key_.*\//ig.test(location.pathname)) {
                    var tu:any = location.href.replace(/\/key_.*\//ig, '/');
                    html += '<a title="取消" class="par" href="' + tu + '"><em>筛选: ' + uri.decode(/\/key_(.*?)\//ig.exec(location.pathname)[1]).replace(/%20/ig, ' ') + '</em><i>×</i></a>';
                    count++;
                }
            }

            if (count == 0) {
                //dom.get(this.containerid).innerHTML = '<div class="barct"></div>';
                // 隐藏highlightline div 因为样式无数据时不需要那条线  
                //dom.hide("highlightline");
                //dom.hide("line_scatelist");
            } else {
                dom.get(this.containerid).innerHTML = '<div class="barct">' + html + '</div>';
                dom.get(this.containerid).style.display = 'block';
            }
        },
        formatParams: function (v, para, muti) {
            if (para == 'key') {
                v = v || '';
                v = string.trim(v);

                var re1 = new RegExp('[/~!\$%\^&\*\{\}\(\)<>\?:\]\[\?\"？！]?', 'ig');
                var re2 = new RegExp('[/\r\n\t\f\x0B\"]?', 'ig');
                v = v.replace(re1, '').replace(re2, '');
                return uri.encode(v);
            }
            if (muti) {
                muti = parseInt(muti + '');
                if (isNaN(muti)) muti = 1;
                v = parseFloat(v + '');
                if (isNaN(v)) v = 0;

                v = (v * muti).toFixed(0);
                return v;
            } else {
                v = v || '';
                v = string.trim(v);
                return uri.encode(v);
            }
        },

        analyzeParams: function (v, para, muti) {
            v = string.trim(v);
            if (para == 'key') return uri.decode(v);
            if (muti) {
                muti = parseInt(muti + '');
                if (isNaN(muti)) muti = 1;
                v = parseFloat(v + '');
                if (isNaN(v)) v = 0;

                var powNum = 0,
                    temp = muti;
                while (temp / 10 >= 1) {
                    powNum++;
                    temp = temp / 10;
                }
                v = (v / muti).toFixed(powNum).replace(/(\.[1-9]*)0*$/g, '$1').replace(/\.$/g, '');
                return v;
            } else {
                return uri.decode(v);
            }

        },

        getValue: function (el) {
            var v = el.value,
                para = el.getAttribute('para'),
                muti = el.getAttribute('muti'),
                dv = el.getAttribute('fdv'),
                allowDefault = el.getAttribute('allowDefault');
            if (Frame.isEmpty(v)) return '';
            if (v == dv && allowDefault !== 'allowDefault') return '';
            return this.formatParams(v, para, muti);
        },
        setValue: function (el, v) {
            var para = el.getAttribute('para'),
                muti = el.getAttribute('muti');

            if (muti && v == '*') el.value = '';
            else {
                //针对二手房列表页的总价自定义筛选做特殊处理：huansuanyue/100,huansuan/1000000
                var huansuanyueOffset = 1,
                    huansuanOffset = 10000;
                if ((<any>window).____json4fe.ershoufang_listname === true) {
                    if (para === 'huansuanyue') {
                        v = (v - 0) / huansuanyueOffset;
                    } else if (para === 'huansuan') {
                        v = (v - 0) / huansuanOffset;
                    } else {
                        v = this.analyzeParams(v, para, muti);
                    }
                    el.value = v;
                } else {
                    el.value = this.analyzeParams(v, para, muti);
                }
            }
        },
        clearValue: function (el) {
            var fdv = el.getAttribute('fdv');
            if (el.getAttribute('para') != "shoufu") {
                el.value = '';
            }
            if (fdv) {
                el.blur();
            }
        },
        search: function (ap) {
            var queryInputs = document.getElementsByName('b_q'),
                params = {},
                kv = {},
                rv = {},
                url = new uri();

            url.setQuery('jump', null);
            for (var i = 0,
                leni = queryInputs.length; i < leni; i++) {
                var input = queryInputs[i],
                    para = input.getAttribute('para'),
                    rel = input.getAttribute('rel');
                if (!rel) {
                    if (!kv[para]) {
                        kv[para] = [];
                    }
                    if ((<any>input).value.substring(0, 3) == "请输入") {

                    } else {
                        kv[para].push(input);
                    }
                } else {
                    if (!rv[rel]) {
                        rv[rel] = {
                            para: '',
                            radios: [],
                            inputs: []
                        };
                    }
                    if ((<any>input).type == 'radio') {
                        if ((<any>input).checked) rv[rel].para = input.getAttribute('para');
                        rv[rel].radios.push(input);
                    } else if ((<any>input).type == 'text') rv[rel].inputs.push(input);
                }
            }
            for (var rel in rv) {
                if (!rel) continue;

                for (var i = 0,
                    leni = rv[rel].radios.length; i < leni; i++) {
                    kv[rv[rel].radios[i].getAttribute('para')] = null;
                }

                if (!rv[rel].para) continue;
                kv[rv[rel].para] = rv[rel].inputs;
            }

            for (var para in kv) {
                if (!para) continue;
                if (!kv[para]) {
                    params[para] = null;
                } else if (kv[para].length == 1) {
                    params[para] = this.getValue(kv[para][0]);
                } else if (kv[para].length == 2) {
                    var str = [],
                        val1 = this.getValue(kv[para][0]),
                        val2 = this.getValue(kv[para][1]);

                    if (Frame.isEmpty(val1) && Frame.isEmpty(val2)) params[para] = null;
                    else {
                        params[para] = (val1 || '0') + '_' + (val2 || '*');
                    }
                } else if (kv[para].length > 2) {
                    var str = [],
                        flag = true;
                    for (var i = 0,
                        leni = kv[para].length; i < leni; i++) {
                        var val = this.getValue(kv[para][i]);
                        if (Frame.isEmpty) flag = false;
                        else str.push(this.getValue(kv[para][i]));
                    }
                    if (flag) params[para] = str.join(',');
                    else params[para] = null;
                }
            }
            if (Frame.isEmpty(params['key'])) {
                params['final'] = null;
                params['jump'] = null;
                params['searchtype'] = null;
                params['prekey'] = null;
            }
            params['cmcskey'] = null;
            params['page'] = null;

            url.setQuery(ap);
            url.setQuery(params);
            url.setPath({
                page: null
            });
            //去除排斥参数
            var mutexs:any = "";
            if (config.cate.listname === "zufang" || config.cate.listname === "chuzu") {
                mutexs = [{
                    searchitem: /b\d+/,
                    params: ["minprice"],
                    searthname: '租金'
                }];
            } else if (config.cate.listname === "hezu") {
                mutexs = [{
                    searchitem: /k\d+/,
                    params: ["minprice"],
                    searthname: '租金'
                }];
            } else if (config.cate.listname === "pinpaigongyu") {
                mutexs = [{
                    searchitem: /a\d+/,
                    params: ["minprice"],
                    searthname: '租金'
                }];
            }

            if (typeof (mutexs) != "undefined") {
                for (var i = 0; i < mutexs.length; i++) {
                    var mutex = mutexs[i];
                    for (var j = 0,
                        lenj = mutex.params.length; j < lenj; j++) {
                        if (params[mutex.params[j]]) {
                            for (var pkey in url.path) {
                                if (url.path[pkey]) url.path[pkey] = url.path[pkey].replace(mutex.searchitem, '');
                            }
                        }
                    }
                }
            }

            location.href = url.toString();
        },
        search_par: function (ap) {
            var queryInputs = document.getElementsByName('b_q'),
                params = {},
                kv = {},
                rv = {},
                url = new uri();

            url.setQuery('jump', null);
            for (var i = 0,
                leni = queryInputs.length; i < leni; i++) {
                var input = queryInputs[i],
                    para = input.getAttribute('para'),
                    rel = input.getAttribute('rel');
                if (!rel) {
                    if (!kv[para]) {
                        kv[para] = [];
                    }
                    if ((<any>input).value.substring(0, 3) == "请输入") {

                    } else {
                        kv[para].push(input);
                    }
                } else {
                    if (!rv[rel]) {
                        rv[rel] = {
                            para: '',
                            radios: [],
                            inputs: []
                        };
                    }
                    if ((<any>input).type == 'radio') {
                        if ((<any>input).checked) rv[rel].para = input.getAttribute('para');
                        rv[rel].radios.push(input);
                    } else if ((<any>input).type == 'text') rv[rel].inputs.push(input);
                }
            }

            for (var rel in rv) {
                if (!rel) continue;

                for (var i = 0,
                    leni = rv[rel].radios.length; i < leni; i++) {
                    kv[rv[rel].radios[i].getAttribute('para')] = null;
                }

                if (!rv[rel].para) continue;
                kv[rv[rel].para] = rv[rel].inputs;
            }

            for (var para in kv) {
                if (!para) continue;
                if (!kv[para]) {
                    params[para] = null;
                } else if (kv[para].length == 1 && ap != null) {
                    params[para] = this.getValue(kv[para][0]);
                } else if (kv[para].length == 2) {
                    var str = [],
                        val1 = this.getValue(kv[para][0]),
                        val2 = this.getValue(kv[para][1]);

                    if (Frame.isEmpty(val1) && Frame.isEmpty(val2)) params[para] = null;
                    else {
                        params[para] = (val1 || '0') + '_' + (val2 || '*');
                    }
                } else if (kv[para].length > 2) {
                    var str = [],
                        flag = true;
                    for (var i = 0,
                        leni = kv[para].length; i < leni; i++) {
                        var val = this.getValue(kv[para][i]);
                        if (Frame.isEmpty) flag = false;
                        else str.push(this.getValue(kv[para][i]));
                    }
                    if (flag) params[para] = str.join(',');
                    else params[para] = null;
                }
            }

            if (Frame.isEmpty(params['key'])) {
                params['final'] = null;
                params['jump'] = null;
                params['searchtype'] = null;
                params['prekey'] = null;
            }
            params['cmcskey'] = null;
            params['page'] = null;

            url.setQuery(ap);
            url.setQuery(params);
            url.setPath({
                page: null
            });
            //去除排斥参数  
            let mutexs;
            if (typeof (mutexs) != "undefined") {
                for (var i = 0; i < mutexs.length; i++) {
                    var mutex = mutexs[i];
                    for (var j = 0,
                        lenj = mutex.params.length; j < lenj; j++) {
                        if (params[mutex.params[j]]) {
                            for (var pkey in url.path) {
                                if (url.path[pkey]) url.path[pkey] = url.path[pkey].replace(mutex.searchitem, '');
                            }
                        }
                    }
                }
            }

            location.href = url.toString();
        },
        search_dz: function (ap) {
            var queryInputs = document.getElementsByName('b_q'),
                params = {},
                kv = {},
                rv = {},
                url = new uri();

            url.setQuery('jump', null);
            for (var i = 0,
                leni = queryInputs.length; i < leni; i++) {
                var input = queryInputs[i],
                    para = input.getAttribute('para'),
                    rel = input.getAttribute('rel');
                if (!rel) {
                    if (!kv[para]) {
                        kv[para] = [];
                    }
                    kv[para].push(input);
                } else {
                    if (!rv[rel]) {
                        rv[rel] = {
                            para: '',
                            radios: [],
                            inputs: []
                        };
                    }
                    if ((<any>input).type == 'radio') {
                        if ((<any>input).checked) rv[rel].para = input.getAttribute('para');
                        rv[rel].radios.push(input);
                    } else if ((<any>input).type == 'text') rv[rel].inputs.push(input);
                }
            }

            for (var rel in rv) {
                if (!rel) continue;

                for (var i = 0,
                    leni = rv[rel].radios.length; i < leni; i++) {
                    kv[rv[rel].radios[i].getAttribute('para')] = null;
                }

                if (!rv[rel].para) continue;
                kv[rv[rel].para] = rv[rel].inputs;
            }

            for (var para in kv) {
                if (!para) continue;
                if (!kv[para]) {
                    params[para] = null;
                } else if (kv[para].length == 1) {
                    params[para] = this.getValue(kv[para][0]);
                } else if (kv[para].length == 2) {
                    var str = [],
                        val1 = this.getValue(kv[para][0]),
                        val2 = this.getValue(kv[para][1]);

                    if (Frame.isEmpty(val1) && Frame.isEmpty(val2)) params[para] = null;
                    else {
                        params[para] = (val1 || '0') + '_' + (val2 || '*');
                    }
                } else if (kv[para].length > 2) {
                    var str = [],
                        flag = true;
                    for (var i = 0,
                        leni = kv[para].length; i < leni; i++) {
                        var val = this.getValue(kv[para][i]);
                        if (Frame.isEmpty) flag = false;
                        else str.push(this.getValue(kv[para][i]));
                    }
                    if (flag) params[para] = str.join(',');
                    else params[para] = null;
                }
            }

            if (Frame.isEmpty(params['key'])) {
                params['final'] = null;
                params['jump'] = null;
                params['searchtype'] = null;
                params['prekey'] = null;
            }
            params['cmcskey'] = null;
            params['page'] = null;

            url.setQuery(ap);
            url.setQuery(params);
            url.setPath({
                page: null
            });
            //去除排斥参数
            let mutexs
            if (typeof (mutexs) != "undefined") {
                for (var i = 0; i < mutexs.length; i++) {
                    var mutex = mutexs[i];
                    for (var j = 0,
                        lenj = mutex.params.length; j < lenj; j++) {
                        if (params[mutex.params[j]]) {
                            for (var pkey in url.path) {
                                if (url.path[pkey]) url.path[pkey] = url.path[pkey].replace(mutex.searchitem, '');
                            }
                        }
                    }
                }
            }

            location.href = url.toString().replace(/\/b\d+\//, '/');
        }
    };

    (<any>window).ckdecimal = function (e) { //  
        var o = e || document.getElementById(e);
        var max = o.getAttribute("max") || 99999999;
        max = parseFloat(max);
        var min = o.getAttribute("min") || 0;
        min = parseFloat(min);
        var value = o.value;
        var match = value.match(/^\d+(\.\d{1,2})?/mg);
        if (match && match.length > 0) {
            if (value.substring(value.length - 1) == '.') return;
            value = match[0];
            if (value > max) {
                value = max;
            }
            if (value < min) {
                value = min;
            }
            o.value = value;
        } else {
            o.value = '';
        }
    };
    return sift;
};

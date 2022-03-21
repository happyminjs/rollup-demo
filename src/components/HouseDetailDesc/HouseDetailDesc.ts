import './HouseDetailDesc.less'
import Request from '../../utils/request';

interface Xiaoqu {
    name?:any,
    lon?:any,
    lat?:any,
    tuangouList?:any
}

export default class HouseDetailDesc {
    private _localInfoType:Array<any>;
    constructor(){
        this._localInfoType=[];
        this.render();
        this.jumpDitu();
    }
    private render():void{
        $("#viewMorePic").bind("click", function() {
            $(this).siblings("li").removeClass("hide");
            $(this).remove()
        });

        $("#soso_tab").click(function() {
            $(this).addClass("active").siblings().removeClass("active");
            $("#soso_map").addClass("active").siblings().removeClass("active")
        });

        $("#baidu_tab").click(function() {
            $(this).addClass("active").siblings().removeClass("active");
            $("#baidu_map").addClass("active").siblings().removeClass("active")
        })

        function changeSet (obj) {
            if ($(obj).hasClass("open")) {
                $(obj).siblings().addClass("hide");
                $(obj).removeClass("open")
            } else {
                $(obj).siblings().removeClass("hide");
                $(obj).addClass("open")
            }
        }
        var fe = function() {
            var _fe = function() {
                let _this=this;
                var _map, 
                _circle, 
                _xiaoqu : Xiaoqu = {
                    name: (<any>window).____json4fe.xiaoqu.name
                }, 
                _pt_center,
                _tempmarker, 
                _setplans, 
                _setCookie = function(c_name, c_value, c_expires, c_path, c_domain, c_secure) {
                    var tcookie = c_name + "=" + encodeURIComponent(c_value);
                    if (c_expires) {
                        tcookie += ";expires=" + c_expires.toGMTString()
                    } else {
                        var expires = new Date((new Date).getTime() + 24 * 36e5 * 30);
                        tcookie += ";expires=" + (<any>expires).toGMTString()
                    }
                    if (c_path) {
                        tcookie += ";path=" + c_path
                    } else {
                        tcookie += ";path=/"
                    }
                    if (c_domain) {
                        tcookie += ";domain=" + c_domain
                    } else {
                        tcookie += ";domain=58.com"
                    }
                    if (c_secure) {
                        tcookie += ";secure"
                    }
                    document.cookie = tcookie
                },
                 _getCookie = function(sname) {
                    var value = "(?:;)?" + sname + "=([^;]*);?";
                    var patten = new RegExp(value);
                    if (patten.test(document.cookie)) {
                        return decodeURIComponent(RegExp["$1"])
                    } else {
                        return null
                    }
                },
                _getplannumber = function(plans) {
                    var len = plans.length;
                    var list = [0, 1, 2];
                    if (len > 1) {
                        if (plans[0]._duration > plans[1]._duration) {
                            var t = list[1];
                            list[1] = list[0];
                            list[0] = t
                        }
                    }
                    if (len > 2) {
                        if (plans[1]._duration > plans[2]._duration) {
                            var t = list[2];
                            list[2] = list[1];
                            list[1] = t
                        }
                        if (plans[0]._duration > plans[1]._duration) {
                            var t = list[1];
                            list[1] = list[0];
                            list[0] = t
                        }
                    }
                    return list
                },
                _busresult = function(results) {
                    _setplans = results;
                    var start = results.getStart();
                    var end = results.getEnd();
                    if (!start || !end) {
                        $("#map_search_result").hide();
                        alert("查询不到线路，请重新输入公交/地铁站点名称。");
                        return
                    }
                    start = start.title;
                    end = end.title;
                    (<any>window)._setCookie("route_from", start);
                    var list = [];
                    var plan_number = _getplannumber(results._plans);
                    var plan_len = results._plans.length;
                    plan_len = plan_len <= 3 || 3;
                    var html = "";
                    var first_desc = "";
                    for (var i = 0; i < plan_len; i++) {
                        var plan = results.getPlan(plan_number[i]);
                        if (!plan) {
                            continue
                        }
                        var lines = plan._lines;
                        var lines_str = "";
                        for (var j = 0; j < lines.length; j++) {
                            var title = lines[j].title;
                            lines_str += title.substr(0, title.indexOf("("));
                            if (j != lines.length - 1) {
                                lines_str += " → "
                            }
                        }
                        var distance = plan.getDistance();
                        var time = plan.getDuration();
                        var description = plan.getDescription();
                        var descs = description.split("，");
                        var desc = "";
                        var needno = true;
                        for (var j = 0, k = 1; j < descs.length; j++) {
                            var needbr = false;
                            if (descs[j].substring(0, 2) == "到达") {
                                needbr = true
                            }
                            if (needno) {
                                desc += "<p>";
                                needno = false
                            }
                            desc += descs[j];
                            if (!needbr) {
                                desc += "，"
                            }
                            if (needbr) {
                                desc += "</p>";
                                needno = true
                            }
                        }
                        var sel_class = "";
                        if (0 == i) {
                            sel_class = " route_sel";
                            first_desc = desc
                        }
                        var div1 = "<div class='lefttop'>" + (i + 1) + "</div>";
                        var div2 = "<div class='route' start='" + start + "' end='" + end + "' desc='" + desc + "'>" + lines_str + "</div>";
                        var div3 = "<div class='distance_time'>全程约" + time + " / 共" + distance + "</div>";
                        html += "<div onclick='fe58.map.changeroute(this);' class='transit_list" + sel_class + "'>" + div1 + div2 + div3 + "</div>"
                    }
                    var div4 = "<div class='route_detail'><div class='route_start'>" + start + "</div>" + first_desc + "<div class='route_end'>" + end + "</div></div>";
                    html += div4;
                    var msr = $("#map_search_result");
                    msr.html(html);
                    $(".transit_list").eq(0).after($(".route_detail"));
                    msr.show()
                }, _carresult = function(results) {
                    var start = results.getStart();
                    var end = results.getEnd();
                    if (!start || !end) {
                        $("#map_search_result").hide();
                        alert("查询不到线路，请重新输入起点名称。");
                        return
                    }
                    $("#map_search_result").show()
                }, 
                _search = function() {
                    var from = $("#map_route_from");
                    var start = from.val();
                    var end = $("#map_route_to").val();
                    if (!start || !end) {
                        alert("请先输入起点。");
                        from.focus();
                        return
                    }
                    if ($("#map_route_bus").attr("checked")) {
                        _map.clearOverlays();
                        var transit = new (<any>window).BMap.TransitRoute(_map,{
                            renderOptions: {
                                map: _map
                            },
                            policy: (<any>window).BMAP_TRANSIT_POLICY_LEAST_TIME,
                            onSearchComplete: _busresult
                        });
                        transit.search(start, _pt_center)
                    } else {
                        _map.clearOverlays();
                        var transit = new (<any>window).BMap.DrivingRoute(_map,{
                            renderOptions: {
                                panel: "map_search_result",
                                map: _map
                            },
                            policy: 1,
                            onSearchComplete: _carresult
                        });
                        transit.search(start, end)
                    }
                },
                _addicon = function(url, text, lon, lat) {
                    var pt = new (<any>window).BMap.Point(lon,lat);
                    var myIcon = new (<any>window).BMap.Icon(url,new (<any>window).BMap.Size(20,20));
                    var label = new (<any>window).BMap.Label(text,{
                        offset: new (<any>window).BMap.Size(20,0)
                    });
                    var marker = new (<any>window).BMap.Marker(pt,{
                        icon: myIcon
                    });
                    marker.setLabel(label);
                    _map.addOverlay(marker);
                    return marker
                },
                _newsc = function() {
                    var city = (<any>window).____json4fe.locallist[0].listname;
                    var dts = [{
                        keyword: "公交",
                        value: "gongjiao",
                        address: 1,
                        link: 0,
                        icon: document.location.protocol + "//img.58cdn.com.cn/ui8/house/detail/images/ditu_gj@2x.png",
                        clickCode: "from=fcpc_detail_" + city + "_xiaoquxq_ditu_zhoubian_bus"
                    }, {
                        keyword: "地铁",
                        value: "ditie",
                        address: 0,
                        link: 0,
                        icon: document.location.protocol + "//img.58cdn.com.cn/ui8/house/detail/images/ditu_dt@2x.png",
                        clickCode: "from=fcpc_detail_" + city + "_xiaoquxq_ditu_zhoubian_subway"
                    }, {
                        keyword: "超市",
                        value: "chaoshi",
                        address: 0,
                        link: 1,
                        icon: document.location.protocol + "//img.58cdn.com.cn/ui8/house/detail/images/ditu_gw@2x.png",
                        clickCode: "from=fcpc_detail_bj_xiaoquxq_ditu_zhoubian_shopping"
                    }, {
                        keyword: "餐饮",
                        value: "canyin",
                        address: 0,
                        link: 1,
                        icon: document.location.protocol + "//img.58cdn.com.cn/ui8/house/detail/images/ditu_cy@2x.png",
                        clickCode: "from=fcpc_detail_" + city + "_xiaoquxq_ditu_zhoubian_restaurant"
                    }, {
                        keyword: "银行",
                        value: "yinhang",
                        address: 0,
                        link: 1,
                        icon: document.location.protocol + "//img.58cdn.com.cn/ui8/house/detail/images/ditu_yh@2x.png",
                        clickCode: "from=fcpc_detail_" + city + "_xiaoquxq_ditu_zhoubian_bank"
                    }, {
                        keyword: "学校",
                        value: "xuexiao",
                        address: 0,
                        link: 1,
                        icon: document.location.protocol + "//img.58cdn.com.cn/ui8/house/detail/images/ditu_jy@2x.png",
                        clickCode: "from=fcpc_detail_" + city + "_xiaoquxq_ditu_zhoubian_school"
                    }, {
                        keyword: "医院",
                        value: "yiyuan",
                        address: 0,
                        link: 1,
                        icon: document.location.protocol + "//img.58cdn.com.cn/ui8/house/detail/images/ditu_yy@2x.png",
                        clickCode: "from=fcpc_detail_" + city + "_xiaoquxq_ditu_zhoubian_hospital"
                    }];
                    var html = "";
                    html += '<dl class="zbpz-title" onclick="fe58.map.changeSet(this);"><i class="icon"></i>周边配置</dl>';
                    for (var i = 0, i_len = dts.length; i < i_len; i++) {
                        var code = dts[i].clickCode;
                        html += "<dl class='hide'>";
                        html += "<dt class='item-dt' onmouseover='$(this).addClass(\"hove\")' onmouseout='$(this).removeClass(\"hove\")'> <label><input style='padding-right:2px;' type='checkbox' name='local_info' value='" + dts[i].keyword + " ' icon='" + dts[i].icon + "' keyword='" + dts[i].keyword + "' code=" + code + " onclick='fe58.map.linkAll(this);'><span class='dticon" + i + "' src=" + dts[i].icon + "></span> <div class='dt' style='left:40px;'>" + dts[i].keyword + "</div></dt>";
                        html += "</label></dl>"
                    }
                    document.getElementById("map_tab_jtlx").innerHTML = html
                },
                _loadMap = function(map_name) {
                    _this._localInfoType = {};
                    _pt_center = new (<any>window).BMap.Point(_xiaoqu.lon,_xiaoqu.lat);
                    _map.centerAndZoom(_pt_center, 16);
                    _map.addControl(new (<any>window).BMap.NavigationControl);
                    var _centerMark = _addicon(document.location.protocol + "//img.58cdn.com.cn/images/5_0/xq/markerred.gif", _xiaoqu.name, _xiaoqu.lon,_xiaoqu.lat);
                    _centerMark.disableMassClear();
                    _circle = new (<any>window).BMap.Circle(_pt_center,1500,{
                        fillColor: "#A6A6A6",
                        strokeWeight: 1,
                        fillOpacity: .3,
                        strokeOpacity: .3
                    });
                    var ck_routefrom = _getCookie("route_from");
                    if (ck_routefrom) {
                        $("#map_route_from").val(ck_routefrom)
                    }
                    $("#map_route_to").val(_xiaoqu.name);
                    $("#map_route_from").keydown(function(e) {
                        if (13 == e.keyCode) {
                            _search()
                        }
                    });
                    $("#map_route_search").click(_search);
                    _newsc()
                },
                _addMarker = function(point, index, obj) {
                    var icon = $(obj).next().attr("src");
                    var title = obj.value;
                    var myIcon = new (<any>window).BMap.Icon(icon,new (<any>window).BMap.Size(23,25),{
                        offset: new (<any>window).BMap.Size(10,25)
                    });
                    var marker = new (<any>window).BMap.Marker(point,{
                        icon: myIcon,
                        title: title
                    });
                    _map.addOverlay(marker);
                    return marker
                },
                _addInfoWindow = function(marker, poi, index, obj) {
                    var maxLen = 10;
                    var name = null;
                    var keyword = obj.getAttribute("keyword");
                    if (poi.type == (<any>window).BMAP_POI_TYPE_NORMAL) {
                        name = "地址：  "
                    } else if (poi.type == (<any>window).BMAP_POI_TYPE_BUSSTOP) {
                        name = "公交：  "
                    } else if (poi.type == (<any>window).BMAP_POI_TYPE_SUBSTOP) {
                        name = "地铁：  "
                    }
                    var infoWindowTitle = '<div style="font-weight:bold;color:#CE5521;font-size:14px">' + poi.title + "</div>";
                    var infoWindowHtml = [];
                    infoWindowHtml.push('<table cellspacing="0" style="table-layout:fixed;width:100%;font:12px arial,simsun,sans-serif"><tbody>');
                    infoWindowHtml.push("<tr>");
                    infoWindowHtml.push('<td style="vertical-align:top;line-height:16px;width:38px;white-space:nowrap;word-break:keep-all">' + name + "</td>");
                    infoWindowHtml.push('<td style="vertical-align:top;line-height:16px">' + poi.address + " </td>");
                    infoWindowHtml.push("</tr>");
                    infoWindowHtml.push("</tbody></table>");
                    var infoWindow = new (<any>window).BMap.InfoWindow(infoWindowHtml.join(""),{
                        title: infoWindowTitle,
                        width: 200
                    });
                    var openInfoWinFun = function() {
                        marker.openInfoWindow(infoWindow);
                        for (var cnt = 0; cnt < maxLen; cnt++) {
                            if (!document.getElementById("list" + keyword + cnt)) {
                                continue
                            }
                            if (cnt == index) {
                                document.getElementById("list" + keyword + cnt).style.backgroundColor = "#f0f0f0"
                            } else {
                                document.getElementById("list" + keyword + cnt).style.backgroundColor = "#fff"
                            }
                        }
                    };
                    marker.addEventListener("click", openInfoWinFun);
                    return openInfoWinFun
                },
                _getMecator = function(poi) {
                    return _map.getMapType().getProjection().lngLatToPoint(poi)
                },_getPoi = function(mecator) {
                    return _map.getMapType().getProjection().pointToLngLat(mecator)
                }, 
                _getSquareBounds = function(centerPoi, r) {
                    var a = Math.sqrt(2) * r;
                    var mPoi = _getMecator(centerPoi);
                    var x0 = mPoi.x
                      , y0 = mPoi.y;
                    var x1 = x0 + a / 2
                      , y1 = y0 + a / 2;
                    var x2 = x0 - a / 2
                      , y2 = y0 - a / 2;
                    var ne = _getPoi(new (<any>window).BMap.Pixel(x1,y1))
                      , sw = _getPoi(new (<any>window).BMap.Pixel(x2,y2));
                    return new (<any>window).BMap.Bounds(sw,ne)
                },
                 _localInfo = function(obj) {
                    var key = obj.value;
                    var keyword = obj.getAttribute("keyword");
                    var local = null;
                    var options = {
                        onSearchComplete: function(results) {
                            if (local.getStatus() == (<any>window).BMAP_STATUS_SUCCESS) {
                                var s = [];
                                var selected = "";
                                _this._localInfoType[key] = [];
                                var maxNum = 5;
                                var num = results.getCurrentNumPois() < 5 ? results.getCurrentNumPois() : 5;
                                for (var i = 0; i < num; i++) {
                                    var marker = _addMarker(results.getPoi(i).point, i, obj);
                                    var openInfoWinFun = _addInfoWindow(marker, results.getPoi(i), i, obj);
                                    _this._localInfoType[key].push(openInfoWinFun);
                                    if (i == 0) {
                                        _this._localInfoType[key][i]()
                                    }
                                    var poi = results.getPoi(i);
                                    var title = poi.title;
                                    var lon = poi.point.lng;
                                    var lat = poi.point.lat;
                                    var p = new (<any>window).BMap.Point(lon,lat);
                                    var distance = _map.getDistance(_pt_center, p);
                                    distance = Math.floor(distance) + "米";
                                    s.push('<dd id="list' + key + i + '" style="cursor: pointer; overflow: hidden; line-height: 17px;' + selected + '" onclick=\'_localInfoType["' + key + '"][' + i + "]()'>");
                                    s.push('<div style="line-height:20px;width:180px;">');
                                    s.push('<span style="color:#00c;text-decoration:underline">' + results.getPoi(i).title.replace(new RegExp(results.keyword,"g"), "<b>" + results.keyword + "</b>") + "</span>");
                                    s.push("<span> - " + results.getPoi(i).address + "</span>");
                                    s.push("</div>");
                                    s.push('<div class="distance"> - ' + distance + "</div>");
                                    s.push("</dd>");
                                    s.push("")
                                }
                                var html = s.join("")
                            }
                        }
                    };
                    var bounds = _getSquareBounds(_circle.getCenter(), _circle.getRadius());
                    local = new (<any>window).BMap.LocalSearch(_map,options);
                    local.enableAutoViewport();
                    local.searchInBounds(keyword, bounds)
                },_gettuangouInfo = function(lon, lat, fun) {
                    if (_xiaoqu.tuangouList) {
                        fun && fun(_xiaoqu.tuangouList);
                        return
                    }
                    Request.jsonp(document.location.protocol + "//t.58.com/aroundgroupbuys/", {
                        lng: lon,
                        lat: lat,
                        raidus: 1500,
                        successCode: 64334,
                        failCode: 64335
                    }).then((data: any) => {
                        if (data && data.length) {
                            _xiaoqu.tuangouList = data;
                            fun && fun(_xiaoqu.tuangouList)
                        }
                    })
                    // $.ajax({
                    //     url: document.location.protocol + "//t.58.com/aroundgroupbuys/",
                    //     data: {
                    //         lng: lon,
                    //         lat: lat,
                    //         raidus: 1500
                    //     },
                    //     dataType: "jsonp",
                    //     success: function(data) {
                    //         if (data && data.length) {
                    //             _xiaoqu.tuangouList = data;
                    //             fun && fun(_xiaoqu.tuangouList)
                    //         }
                    //     }
                    // })
                };
                this.hideMap = function() {
                    $("#dtjt_wrap").hide()
                }
                ;
                this.changeroute = function(obj) {
                    var o = $(obj).find(".route");
                    $(".route_detail").html("<div class='route_start'>" + o.attr("start") + "</div>" + o.attr("desc") + "<div class='route_end'>" + o.attr("end") + "</div>");
                    $(obj).after($(".route_detail"));
                    _map.clearOverlays();
                    var index = $(obj).index();
                    var firstPlan = _setplans.getPlan(index);
                    for (var i = 0; i < firstPlan.getNumRoutes(); i++) {
                        var walk = firstPlan.getRoute(i);
                        if (walk.getDistance(false) > 0) {
                            _map.addOverlay(new (<any>window).BMap.Polyline(walk.getPath(),{
                                lineColor: "green"
                            }))
                        }
                    }
                    for (i = 0; i < firstPlan.getNumLines(); i++) {
                        var line = firstPlan.getLine(i);
                        _map.addOverlay(new (<any>window).BMap.Polyline(line.getPath()))
                    }
                }
                ;
                this.link = function(obj) {
                    var icon = obj.getAttribute("icon");
                    var lon = obj.getAttribute("lon");
                    var lat = obj.getAttribute("lat");
                    var address = obj.getAttribute("address");
                    var title = obj.getAttribute("title");
                    var pt = new (<any>window).BMap.Point(lon,lat);
                    var myIcon = new (<any>window).BMap.Icon(icon,new (<any>window).BMap.Size(20,20));
                    if (_tempmarker) {
                        _map.removeOverlay(_tempmarker)
                    }
                    _tempmarker = new (<any>window).BMap.Marker(pt,{
                        icon: myIcon
                    });
                    _map.addOverlay(_tempmarker);
                    var infoWindow = new (<any>window).BMap.InfoWindow("<p style='font-size:14px; font-weight:900;'>" + title + "</p><p style='font-size:12px;'>地址：" + address + "</p>");
                    _tempmarker.openInfoWindow(infoWindow);
                    if ("addEventListener"in window) {
                        _tempmarker.addEventListener("click", function() {
                            this.openInfoWindow(infoWindow)
                        })
                    } else {
                        _tempmarker["onclick"] = function() {
                            this.openInfoWindow(infoWindow)
                        }
                    }
                }
                ;
                this.changeSet = function(obj) {
                    if ($(obj).hasClass("open")) {
                        $(obj).siblings().addClass("hide");
                        $(obj).removeClass("open")
                    } else {
                        $(obj).siblings().removeClass("hide");
                        $(obj).addClass("open")
                    }
                }
                ;
                this.linkAll = function(obj) {
                    if (obj.checked) {
                        _localInfo(obj);
                        (<any>window).clickLog && (<any>window).clickLog($(obj).attr("code"));
                        $(obj).parents(".item-dt").siblings().removeClass("on");
                        $(obj).parents(".item-dt").addClass("on")
                    } else {
                        $(obj).parents(".item-dt").removeClass("on");
                        var allMark = _map.getOverlays();
                        for (var i = 0; i < allMark.length; i++) {
                            if (typeof allMark[i].getTitle == "function") {
                                if (allMark[i].getTitle() == obj.value) {
                                    _map.removeOverlay(allMark[i])
                                }
                            }
                        }
                        $(obj.parentNode.parentNode).children("dd").remove()
                    }
                }
                ;
                this.getMap = function() {
                    var script = document.createElement("script");
                    script.src = document.location.protocol + "//api.map.baidu.com/api?v=1.3&callback=fe58.map.init";
                    document.body.appendChild(script)
                }
                ;
                this.init = function() {
                    _xiaoqu.lon = (<any>window).____json4fe.xiaoqu.baidulon || (<any>window).____json4fe.xiaoqu.lon,
                    _xiaoqu.lat = (<any>window).____json4fe.xiaoqu.baidulat || (<any>window).____json4fe.xiaoqu.lat;
                    _map = new (<any>window).BMap.Map("map");
                    _map.setCurrentCity((<any>window).____json4fe.locallist[0].name);
                    _loadMap("map")
                }
                ;
                this.gettuangouInfo = _gettuangouInfo;
                this.togScroll = function(newdivs) {
                    var temp_h1 = document.body.clientHeight;
                    var temp_h2 = document.documentElement.clientHeight;
                    var isXhtml = temp_h2 <= temp_h1 && temp_h2 != 0 ? true : false;
                    var htmlbody = isXhtml ? document.documentElement : document.body;
                    if (newdivs) {
                        htmlbody.style.overflow = "auto";
                        $(window).unbind("scroll", this.settop)
                    } else {
                        htmlbody.style.overflow = "hidden";
                        $(window).bind("scroll", this.settop)
                    }
                }
                ;
                this.settop = function() {
                    $("#map").css({
                        top: $(window).scrollTop() + "px"
                    });
                    $("#baidu_exitfullscreen").css({
                        top: $(window).scrollTop() + 5 + "px"
                    }).show()
                }
                ;
                this.exitfull = function() {
                    $("#map").appendTo($("#dtjt_info")).css({
                        width: "464px",
                        height: "319px",
                        left: 0,
                        top: 0,
                        zIndex: 0
                    });
                    $("#baidu_exitfullscreen").hide()
                }
                ;
                this.setfull = function() {
                    var clienth = window.screen.availHeight
                      , scrollh = $(window).scrollTop();
                    $("#map").appendTo($("body")).css({
                        left: 0,
                        top: scrollh + "px",
                        width: "100%",
                        height: clienth + "px",
                        zIndex: 9999
                    });
                    $("#baidu_exitfullscreen").css({
                        top: scrollh + 5 + "px"
                    }).show()
                }
                ;
                this.recenter = function() {
                    _pt_center = new (<any>window).BMap.Point(_xiaoqu.lon,_xiaoqu.lat);
                    _map.centerAndZoom(_pt_center, 16)
                }
            };
            return _fe
        }();
        (<any>window).fe58 = (<any>window).fe58 || {};
        (<any>window).fe58.map = new fe;

        function getSosoMap() {
            var pano = new (<any>window).soso.maps.Panorama("soso_map");
            var overview = new (<any>window).soso.maps.PanoOverview("static_map",{
                panorama: pano
            });
            var pano_service = new (<any>window).soso.maps.PanoramaService;
            var lon = (<any>window).____json4fe.xiaoqu.baidulon;
            var lat = (<any>window).____json4fe.xiaoqu.baidulat;
            var latlng = new (<any>window).soso.maps.LatLng(lat,lon);
            var navControl = new (<any>window).soso.maps.NavigationControl({
                map: overview.map,
                style: (<any>window).soso.maps.NavigationControlStyle.SMALL
            });
            (<any>window).soso.maps.convertor.translate(latlng, 3, function(res) {
                pano_service.getPano(res[0], 200, function(result) {
                    if (result == null) {
                        hideSosoMap();
                        return
                    }
                    pano.setPano(result.svid)
                });
                var marker = new (<any>window).soso.maps.Marker({
                    map: overview.map,
                    position: res[0]
                })
            });
            var heading = 0;
            var timer = setInterval(function() {
                if (heading >= 360) {
                    heading = 0
                }
                heading += .1;
                pano.setPov({
                    heading: heading
                })
            }, 100);
            (<any>window).soso.maps.event.addListener(pano, "pov_changed", function() {
                var pov = pano.getPov();
                if (Math.abs(pano.getPov().heading - heading) > 1) {
                    clearInterval(timer)
                }
            });
            changeMap();
            mapZoom();
            sosoMapDragZoom()
        }

        function changeMap() {
            $("#soso_tab").click(function() {
                $("#map_search_result").hide();
                $(this).addClass("active").siblings().removeClass("active");
                $("#soso_map").addClass("active").siblings().removeClass("active")
            });
            $("#baidu_tab").click(function() {
                $(this).addClass("active").siblings().removeClass("active");
                $("#baidu_map").addClass("active").siblings().removeClass("active")
            })
        }

        function hideSosoMap() {
            $("#dtjt_title").find("span").hide();
            $("#dtjt_title").find("#baidu_tab").addClass("active").show();
            $("#soso_map").hide()
        }

        function mapZoom() {
            $("#static_map_background").mouseenter(function() {
                $(this).stop(true).animate({
                    width: "220px",
                    height: "220px"
                })
            });
            $("#static_map_background").mouseleave(function() {
                window.setTimeout(function() {
                    $("#static_map_background").stop(true).animate({
                        width: "110px",
                        height: "110px"
                    })
                }, 2200)
            })
        }

        function sosoMapDragZoom() {
            var maxWidth = Math.floor($("#soso_map").width() - 20);
            var maxHeight = Math.floor($("#soso_map").height() - 20);
            var staticMap = $("#static_map_background");
            var mapDrag = $("#map_drag");
            mapDrag.mousedown(function(e) {
                $("#static_map_background").unbind("mouseleave").unbind("mouseenter");
                var _e = e
                  , _width = staticMap.width()
                  , _height = staticMap.height();
                $(document).mousemove((<any>window).sosoMapZoomIn = function(evt) {
                    var width = evt.pageX - _e.pageX;
                    var height = evt.pageY - _e.pageY;
                    var newWidth = Math.floor(_width - width);
                    var newHeight = Math.floor(_height - height);
                    if (newWidth > maxWidth) {
                        staticMap.width(maxWidth)
                    } else if (newWidth < 110) {
                        staticMap.width(110)
                    } else {
                        staticMap.width(newWidth)
                    }
                    if (newHeight > maxHeight) {
                        staticMap.height(maxHeight)
                    } else if (newHeight < 110) {
                        staticMap.height(110)
                    } else {
                        staticMap.height(newHeight)
                    }
                }
                );
                $(document).mouseup((<any>window).sosoMapZoomOut= function() {
                    $(document).unbind("mousemove", (<any>window).sosoMapZoomIn);
                    $(document).unbind("mouseup", (<any>window).sosoMapZoomOut);
                    mapZoom()
                }
                );
                return false
            })
        }

        $.getScript(window.location.protocol + "//open.map.qq.com/plugin/v2/PanoramaOverview/PanoramaOverview-min.js", function() {

                    var div_map = document.getElementById("map");
                    var soso_map = document.getElementById("soso_map");
                    if ("____json4fe"in window && div_map) {

                        if ("xiaoqu"in (<any>window).____json4fe) {
                            var lon = (<any>window).____json4fe.xiaoqu.baidulon || (<any>window).____json4fe.xiaoqu.lon
                              , lat = (<any>window).____json4fe.xiaoqu.baidulat || (<any>window).____json4fe.xiaoqu.lat;
                            if (lon != undefined && lon != null && lon != "0" && lon != "0.0" && lon != "null" && lat != undefined && lat != null && lat != "0" && lat != "null" && lat != "0.0") {
                                (<any>window).fe58.map.getMap();
                                $("body").bind("keyup", function(e) {
                                    var keycode = e.keyCode || e.which;
                                    if (keycode == 27 && $("#map").css("z-index") == 9999) {
                                        (<any>window).fe58.map.exitfull();
                                        (<any>window).fe58.map.recenter();
                                        (<any>window).fe58.map.togScroll(true)
                                    }
                                });
                                $("#baidu_fullscreen").click(function() {
                                    (<any>window).fe58.map.setfull();
                                    (<any>window).fe58.map.recenter();
                                    (<any>window).fe58.map.togScroll(false)
                                });
                                $("#baidu_exitfullscreen").click(function() {
                                    (<any>window).fe58.map.exitfull();
                                    (<any>window).fe58.map.recenter();
                                    (<any>window).fe58.map.togScroll(true)
                                });
                                if (soso_map) {
                                    getSosoMap()
                                } else {
                                    hideSosoMap()
                                }
                                return
                            }
                        }
                    }
                    (<any>window).fe58.map.hideMap();
                    $('a[jumpto="ditu"]').remove()
        })

    }

    private jumpDitu() :void {
        var jump = ["#Immereport", "#districtNav", "#dituNav", "#housedetailNav"];
        for (var i = 0; i < jump.length; i++) {
            $(jump[i]).bind("click", function() {
                var jumptoId = $(this).attr("jumpto");
                if ($("#" + jumptoId).length > 0) {
                    var scrollPosY = $("#" + jumptoId).offset().top - 40;
                    $("html,body").animate({
                        scrollTop: scrollPosY
                    }, 200)
                }
            })
        }
    }
}
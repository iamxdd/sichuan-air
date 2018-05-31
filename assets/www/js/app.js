var map;
var mapCity;
var mapForecast;
var mapZoomindex7=0;
var mapZoomindex8=0;
var globalTime = '';
var  myURL = "http://www.scnewair.cn:3393/rx_data";
var menuFunction={
    // 登录页面初始化
    login_init:function(){
        localStorage.username="test";
        localStorage.password="dqs@123";
        var username=localStorage.username;
        var password=localStorage.password;
        $.ajax({
            type:"GET",
            url:localStorage.loginUrl+"/smartadmin/getLoginDynamicCode",
            dataType:'json',
            async:true,
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            data:{},
            error:function(){$("#ajaxPleaseWait").hide();
                $.mobile.changePage("#indexPage");
            },
            complete:function(XMLHttpRequest){
                var data=eval("("+XMLHttpRequest.responseText+")");
                var newpassword=hex_md5(data.data+password);
                if(data.result){
                    $.ajax({
                        type:"post",
                        url:localStorage.loginUrl+"/smartadmin/login",
                        dataType:'json',
                        async:true,
                        xhrFields: {
                            withCredentials: true
                        },
                        crossDomain: true,
                        data:{"username":username,"password":newpassword},
                        error:function(){$("#ajaxPleaseWait").hide();
                            $.mobile.changePage("#indexPage");
                        },
                        complete:function(XMLHttpRequest){
                            var data=eval("("+XMLHttpRequest.responseText+")");
                            if(data.result){
                                localStorage.username=username;
                                localStorage.Name=data.userName;
                                localStorage.password=password;
                                localStorage.userid=data.userId;
                                localStorage.code="5100";
                            }
                        }
                    });
                }
            }
        });

        $.mobile.changePage("#indexPage");
//      $("#indexGasChangeBar").children("div").eq(0).click();
    },
    // 主页
    indexPage_init:function(){
    	 sessionStorage.setItem("indexmapflag6","1")
        sessionStorage.setItem("indexmapflag7","1")
        sessionStorage.setItem("indexmapflag8","1")
        sessionStorage.setItem("allCityChange","1")
        var maptypeStatu = sessionStorage.getItem("maptype");
        var code = localStorage.code;
        
        var gas;
        $("#indexGasChangeBar").children("div").unbind().click(function(){
            var gas=$(this).attr("gas");
            var mapbarname="map"+gas+"rank.png";
            $("#indexPageMapMarkBar").css("background-image","url(img/mapParam/"+mapbarname.toLowerCase()+")");
            $(".indexGasActive").removeClass("indexGasActive");
             sessionStorage.setItem("activeGas",gas)
            $(this).addClass("indexGasActive");
//          menuFunction.indexPage_mapMark(gas);
            map.clearOverlays();
            mapZoomindex7=0;
            mapZoomindex8=0;
            menuFunction.getGas(map.getZoom(),map);
        });
        var cutHeight=$("#indexPage").children(".ui-header").outerHeight()+$("#indexPage").children(".ui-footer").outerHeight()+$("#indexGasChangeBar").outerHeight();
        var mapDivHeight=$("#login").outerHeight();
        $("#indexPageMap").css("height",680+"px");
//      console.log('mapDivHeight-cutHeight',mapDivHeight-cutHeight);
//       console.log('mapDivHeight',mapDivHeight)
//         console.log('cutHeight',cutHeight)
          
        $("#indexPageMapMarkBar").css("bottom",$("#indexPage").children(".ui-footer").outerHeight()+"px");
        map = new BMap.Map("indexPageMap",{minZoom:6,maxZoom:13});
        tool.mapAddStyle(map);
        map.enableScrollWheelZoom();//启用滚轮放大缩小，默认禁用
        map.enableDragging();//启用地图拖拽，默认启用
         map.addEventListener('dragend',function () {
            var obj = {};
            var bs = map.getBounds();   //获取可视区域
            var bssw = bs.getSouthWest();   //可视区域左下角
            var bsne = bs.getNorthEast();   //可视区域右上角
            var zoomindex = map.getZoom();
            obj.lngmax = bsne.lng;
            obj.lngmin = bssw.lng;
            obj.latmax = bsne.lat;
            obj.latmin = bssw.lat;
            tool.mapSetFreshZoom(map,obj,zoomindex)
        });
             //更具地图层级大小却换地图视觉加载数据
        map.addEventListener("zoomend", function(){
//          console.log("mapzoomlistener",map.getZoom())
            var flag6 = sessionStorage.getItem("indexmapflag6");
            var flag7 = sessionStorage.getItem("indexmapflag7");
            var flag8 = sessionStorage.getItem("indexmapflag8");
            var zoomindex = this.getZoom();
//          console.log(zoomindex)
            menuFunction.getBoundaty(map);
            if(zoomindex>=8){
                if(flag8==="1"){
                    menuFunction.getGas(zoomindex,map);
                    sessionStorage.setItem("indexmapflag8","0")
                    sessionStorage.setItem("indexmapflag7","1")
                    sessionStorage.setItem("indexmapflag6","1")
                }
            }else if(zoomindex==7){
                if(flag7==="1"){
                    menuFunction.getGas(zoomindex,map);
                    sessionStorage.setItem("indexmapflag8","1")
                    sessionStorage.setItem("indexmapflag7","0")
                    sessionStorage.setItem("indexmapflag6","1")
                }
            }else if(zoomindex<7){
                if(flag6==="1"){
                    menuFunction.getGas(zoomindex,map);
                    sessionStorage.setItem("indexmapflag8","1")
                    sessionStorage.setItem("indexmapflag7","1")
                    sessionStorage.setItem("indexmapflag6","0")
                }
            }
        });
        if(localStorage.code=="5100"){
            $("#indexPageHeaderName").text("四川省空气质量地图");
            var pointIndex = new BMap.Point(104.96,29.54);
            map.centerAndZoom(pointIndex,7);
        }else{
            $.each(cityMapDetail,function(i,item){
                if(item.cityCode==localStorage.code){
                    $("#indexPageHeaderName").text(item.cityName);
                    $("#indexStatPageTitleName").text(item.cityName);
                    var p0=((item.point).split("|"))[0];
                    var p1=((item.point).split("|"))[1];
                    p0=parseFloat(p0);
                    p1=parseFloat(p1);
                    var pointIndex = new BMap.Point(p0,p1);
                    map.centerAndZoom(pointIndex,11);
                }
            })
        }
//      map.disableDragging();
//      map.disablePinchToZoom();
//      map.disableDoubleClickZoom();

        $("#indexGasChangeBar").children("div").eq(0).click();

        $("#indexPageRefresh").unbind().click(function(){
        	  mapZoomindex7=0;
              mapZoomindex8=0;
            menuFunction.indexPage_init();
        });
          sessionStorage.setItem("allCityChange","2")
        $("#subSiteChange img").attr("src","img/mapParam/gk.png")
        //切换站点类型更换地图内容
        $("#subSiteChange img").unbind().click(function(){
            var changeFlag = sessionStorage.getItem("allCityChange")
            switch (changeFlag){
                case '1':
                    $("img.subSite").attr("src","img/mapParam/gk.png");
                    sessionStorage.setItem("allCityChange","2");
                    break;
                case '2':
                    $("img.subSite").attr("src","img/mapParam/prc.png");
                    sessionStorage.setItem("allCityChange","3");
                    break;
                case '3':
                    $("img.subSite").attr("src","img/mapParam/every.png");
                    sessionStorage.setItem("allCityChange","1");
                    break;
                default:
                    return 0;
            }
            mapZoomindex7=0;
            mapZoomindex8=0;
            //menuFunction.indexPage_mapMark(map)
            var allOverlay = map.getOverlays();
            for (var i = 0; i < allOverlay.length - 1; i++) {
                if (allOverlay[i] instanceof BMap.Marker) {
                   if (allOverlay[i].getTitle() == "station") {
                       map.removeOverlay(allOverlay[i]);
                    }
                }
            }

            menuFunction.getGas(8,map);
        });
    },
        getBoundaty:function(map){
        var bdary = new BMap.Boundary();
        bdary.get("四川省", function(rs){       //获取行政区域
            //map.clearOverlays();        //清除地图覆盖物
            var count = rs.boundaries.length; //行政区域的点有多少个
            if (count === 0) {
                console.log('未能获取当前输入行政区域');
                return ;
            }
            var pointArray = [];
            for (var i = 0; i < count; i++) {
                var ply = new BMap.Polygon(rs.boundaries[i], {strokeWeight: 2, strokeColor: "#e99477",fillOpacity: 0.05, fillColor: "none"}); //建立多边形覆盖物
                map.addOverlay(ply);  //添加覆盖物
                pointArray = pointArray.concat(ply.getPath());
            }
            // map.setViewport(pointArray);    //调整视野
        });
    },
    getGas:function(zoomindex,map) {
        setTimeout(function() {
            var gas = sessionStorage.getItem("activeGas")
            //menuFunction.getBoundaty(map);
            //map.clearOverlays();//清除加载的地图覆盖物
            if (zoomindex >= 8 || zoomindex < 7) {//市州mapmark
                if (zoomindex >= 8) {
                    $("#subSiteChange").fadeIn()
                    $("#indexPageType").fadeIn()
                } else {
                    $("#subSiteChange").fadeOut()
                    $("#indexPageType").fadeOut()
                }
                var mysubSite = sessionStorage.getItem("allCityChange")
                var param;
                mysubSite == '1' ? param = {type: 'all'} : mysubSite == '2' ? param = {type: 'country'} : mysubSite == '3' ? param = {type: 'other'} : "";

                if(mapZoomindex7==0){
                   config1.http('', 'post', param, function (data) {
                   	   var consoletime=tool.cityGraphTooltipTime(new Date(data[0]["TimePoint"]));
                   	  globalTime = new Date(data[0]["TimePoint"]);
                       $("#indexPageMapTime").text(consoletime + " (实时数据,尚未审核)");

                       $.each(data, function (i, item) {
                           /*console.log("i-->")
                            console.log(i)*/
                           var itemEach = {};
                           itemEach.COUNTYNAME = item.CountyName;
                           itemEach.CITYCODE = item.StationCode;
                           itemEach.CITYNAME = item.StationName;
                           itemEach.CITY = item.CityName;
                           itemEach.POINT = item.Longitude + "|" + item.Latitude;
                           itemEach.VALUE = eval("item." + gas);
                           
//                          if(itemEach.VALUE=="未发布"){
//                          	itemEach.VALUE = '—';
//                          }
//                          if(itemEach.VALUE=="—"){
//                          	itemEach.VALUE = '';
//                          }
//                           console.log('itemEach.VALUE ',itemEach.VALUE )
                           itemEach.GAS = gas;
                           itemEach.STATIONCODE = item.StationCode.replace(/A/g, "1").replace(/E/g, "2").replace(/B/g, "3").replace(/C/g, "4");
                           itemEach.type = item.type;
                           if (gas == "AQI") {
                               var level = tool.levelReturn("AQI", item[gas]);
                           } else {
                               var level = tool.levelReturn("AQI", item["I" + gas]);
                           }
                           var color = tool.levelColor(level);
                           itemEach.COLOR = color;

                           sessionStorage.setItem("siteDetailType", "airSiteCountries")
                           tool.mapAddMark(map, itemEach, "menuFunction.changeToCityPage(" + itemEach.STATIONCODE + ")", "city", "country", zoomindex);

                       })
                   })
                   mapZoomindex7=1;
               }

                var allOverlay = map.getOverlays();
                for (var i = 0; i < allOverlay.length - 1; i++) {
                    //注意：在使用allOverlay[i]要进行是否是Marker的判断，因为getOverlays()后会得到类型不同的对象
                    //只有Marker图像标注类才有getLabel()方法，否则会出现错误：对象不支持“getLabel”属性或方法
                    if (allOverlay[i] instanceof BMap.Marker) {
                        if(zoomindex >= 8){
                            if (allOverlay[i].getTitle() == "station") {
                                allOverlay[i].show();
                            }if (allOverlay[i].getTitle() == "city") {
                                allOverlay[i].hide();
                            }
                        }else if(zoomindex< 7 ){
                            if (allOverlay[i].getTitle() == "station") {
                                allOverlay[i].hide();
                            }if (allOverlay[i].getTitle() == "city") {
                                allOverlay[i].hide();
                            }
                        }

                    }
                }

                }else if (zoomindex >= 7 && zoomindex < 8) {//首页21城市mapmark

                $("#subSiteChange").fadeOut();
                $("#indexPageType").fadeOut();
                if(mapZoomindex8==0){
                    if (localStorage.code == "5100") {
                        config1.http1('/publish/getAllCityRealTimeAQIC', 'post', {}, function (data) {
                            var indexTime = new Date(data.timePoint);
                            globalTime = new Date(data.timePoint);
                            var timearr = tool.publishNotAuditTime(indexTime);
                            $("#indexPageMapTime").text(timearr + " (实时数据,尚未审核)");
                            $.each(data.data, function (i, item) {
                                $.each(cityMapDetail, function (j, itemj) {
                                    if (itemj.cityCode == item.columns.CITYCODE) {
                                        var itemEach = {};
                                        itemEach.CITYCODE = item.columns.CITYCODE;
                                        itemEach.CITY = item.columns.CityName;
                                        item.columns.CITYNAME == '西昌' ? itemEach.CITYNAME = '凉山州' : item.columns.CITYNAME == '康定' ? itemEach.CITYNAME = '甘孜州' : item.columns.CITYNAME == '马尔康' ? itemEach.CITYNAME = '阿坝州' : itemEach.CITYNAME = item.columns.CITYNAME;

                                        itemEach.POINT = itemj.point;
                                        itemEach.VALUE = eval("item.columns." + gas);
                                        itemEach.GAS = gas;
                                        if (gas == "AQI") {
                                            if (!item.columns["INDEX_MARK"]) {
                                                var level = tool.levelReturn("AQI", "—");
                                                itemEach.VALUE = "—";
                                            } else {
                                                var level = tool.levelReturn("AQI", item.columns[gas]);
                                            }  
                                            
                                        } else {
                                            if (!item.columns[gas + "_MARK"] || !item.columns["INDEX_MARK"]) {
                                                var level = tool.levelReturn("AQI", "—");
                                                itemEach.VALUE = "—";
                                            } else {
                                                var level = tool.levelReturn("AQI", item.columns["I" + gas]);
                                            }
                                        }
                                       
                                        var color = tool.levelColor(level);
                                        itemEach.COLOR = color;
                                        sessionStorage.setItem("siteDetailType", "air")
                                        tool.mapAddMark(map, itemEach, "menuFunction.changeToCityPage(" + itemEach.CITYCODE + ")", "city", "city", zoomindex);
                                    }
                                });
                            });
                        })
                    } else {
                        var data = {"cityCode": localStorage.code};
                        config1.http1('/publish/getCityInfoCForApp', 'post', data, function (XMLHttpRequest) {
                            var data = eval("(" + XMLHttpRequest.responseText + ")");
                            var mapdata = data.columns.STATIONREALTIMEAQI.data;
                            $.each(mapdata, function (i, item) {
                                var itemEach = {};
                                itemEach.CITYCODE = item.columns.STATIONCODE;
                                itemEach.CITYNAME = item.columns.STATIONNAME;
                                itemEach.POINT = item.columns.LNG + "|" + item.columns.LAT;
                                itemEach.VALUE = eval("item.columns." + gas);
                                itemEach.GAS = gas;
                                itemEach.CITY = item.columns.CityName;
                                if (gas == "AQI") {
                                    var level = tool.levelReturn("AQI", item.columns[gas]);
                                } else {
                                    var level = tool.levelReturn("AQI", item.columns["I" + gas]);
                                }
                                var color = tool.levelColor(level);
                                itemEach.COLOR = color;
                                tool.mapAddMark(map, itemEach, "", "station", "", zoomindex);
                            });
                        })
                    }
                    mapZoomindex8=1;
                }
                var allOverlay = map.getOverlays();
                for (var i = 0; i < allOverlay.length - 1; i++) {
                    //注意：在使用allOverlay[i]要进行是否是Marker的判断，因为getOverlays()后会得到类型不同的对象
                    //只有Marker图像标注类才有getLabel()方法，否则会出现错误：对象不支持“getLabel”属性或方法
                    if (allOverlay[i] instanceof BMap.Marker) {
                   
                        if (allOverlay[i].getTitle() == "city") {
                            allOverlay[i].show();
                        }if (allOverlay[i].getTitle() == "station") {
                            allOverlay[i].hide();
                        }
                    }
                }

            }
        },0.0000000005)
    },
//    画地图
    indexPage_mapMark:function(gas){
//      $("#ajaxPleaseWait").show();
//      map.clearOverlays();
//      if(localStorage.code=="5100"){
//          $.ajax({
//              type:"post",
//              url:provinceAjax+"/publish/getAllCityRealTimeAQIC",
//              dataType:'json',
//              async:true,
//              data:{},
//              error:function(XMLHttpRequest){
//                  alert("连接失败,请检查网络后重启此程序");
//                  $("#ajaxPleaseWait").hide();
//                  tool.warningAlert("warAFailed","获取地图信息失败");
//              },
//              complete:function(XMLHttpRequest){
//                  $("#ajaxPleaseWait").hide();
//                  var data=eval("("+XMLHttpRequest.responseText+")");
//                  var indexTime=new Date(data.timePoint);
//                  var timearr=tool.publishNotAuditTime(indexTime);
//                  $("#indexPageMapTime").text(timearr+" (实时数据,尚未审核)");
//                  $.each(data.data,function(i,item){
//                      $.each(cityMapDetail,function(j,itemj){
//                          if(itemj.cityCode==item.columns.CITYCODE){
//                              var itemEach={};
//                              itemEach.CITYCODE=item.columns.CITYCODE;
//                              itemEach.CITYNAME=item.columns.CITYNAME;
//                              itemEach.POINT=itemj.point;
//                              itemEach.VALUE=eval("item.columns."+gas);
//                              itemEach.GAS=gas;
//                              if(gas=="AQI"){
//                                  if(!item.columns["INDEX_MARK"]){
//                                      var level=tool.levelReturn("AQI","—");
//                                      itemEach.VALUE="—";
//                                  }else{
//                                      var level=tool.levelReturn("AQI",item.columns[gas]);
//                                  }
//                              }else{
//                                  if(!item.columns[gas+"_MARK"] || !item.columns["INDEX_MARK"]){
//                                      var level=tool.levelReturn("AQI","—");
//                                      itemEach.VALUE="—";
//                                  }else{
//                                      var level=tool.levelReturn("AQI",item.columns["I"+gas]);
//                                  }
//                              }
//                              var color=tool.levelColor(level);
//                              itemEach.COLOR=color;
//                              tool.mapAddMark(map,itemEach,"menuFunction.changeToCityPage("+itemEach.CITYCODE+")","city");
//                          }
//                      });
//                  });
//              }
//          });
//      }else{
//          $.ajax({
//              type:"post",
//              url:provinceAjax+"/publish/getCityInfoCForApp",
//              dataType:'json',
//              async:true,
//              data:{"cityCode":localStorage.code},
//              error:function(){$("#ajaxPleaseWait").hide();
//                  tool.warningAlert("warAFailed","获取地图信息失败");
//              },
//              complete:function(XMLHttpRequest){
//                  $("#ajaxPleaseWait").hide();
//                  var data=eval("("+XMLHttpRequest.responseText+")");
//                  var mapdata=data.columns.STATIONREALTIMEAQI.data;
//                  $.each(mapdata,function(i,item){
//                      var itemEach={};
//                      itemEach.CITYCODE=item.columns.STATIONCODE;
//                      itemEach.CITYNAME=item.columns.STATIONNAME;
//                      itemEach.POINT=item.columns.LNG+"|"+item.columns.LAT;
//                      itemEach.VALUE=eval("item.columns."+gas);
//                      itemEach.GAS=gas;
//                      if(gas=="AQI"){
//                          var level=tool.levelReturn("AQI",item.columns[gas]);
//                      }else{
//                          var level=tool.levelReturn("AQI",item.columns["I"+gas]);
//                      }
//                      var color=tool.levelColor(level);
//                      itemEach.COLOR=color;
//                      tool.mapAddMark(map,itemEach,"","station");
//                  });
//              }
//          });
//      }
//      map.setMapStyle({
//          styleJson:[
//              {
//                  "featureType": "roadName",
//                  "elementType": "all",
//                  "style":"light"
//              }
//          ]
//      });
         var zoomindex=map.getZoom();
  
            menuFunction.getGas(zoomindex,map);
    },
//    跳转到城市页面
    changeToCityPage:function(citycode){
        $.mobile.changePage("#cityPage?citycode="+citycode,{transition:"slide"});
    },
//    全省AQI分布
    AllProvinceAQIDistri:function(){
        var cutHeight=$("#indexStatPage").children(".ui-header").outerHeight()+$("#indexStatPage").children(".ui-footer").outerHeight()+$("#indexStatMenuBar").outerHeight()+$("#aqiDistriGraph").outerHeight()+$("#aqiDistriTable").children(".aqiDistriTableTitle").outerHeight();
        var tableDivHeight=$("#login").outerHeight();
        $("#aqiDistriTableContent").css("height",(tableDivHeight-cutHeight)+"px");
        var contentDiv=$("#aqiDistriTableContent");
        contentDiv.html("");
        $("#ajaxPleaseWait").show();
        $.ajax({
            type:"post",
            url:provinceAjax+"/publish/getAllCityRealTimeAQIC",
            dataType:'json',
            async:true,
            data:{},
            error:function(){$("#ajaxPleaseWait").hide();
                tool.warningAlert("warAFailed","获取列表信息失败");
            },
            complete:function(XMLHttpRequest){
                $("#ajaxPleaseWait").hide();
                var data=eval("("+XMLHttpRequest.responseText+")");
                var level0=0;
                var level1=0;
                var level2=0;
                var level3=0;
                var level4=0;
                var level5=0;
                var level6=0;
                $.each(data.data,function(i,item){
                    var divEach=$("<div class='tableContentItem' onselectstart='return false;'></div>");
                    var div1=$("<div>"+item.columns.CITYNAME+"</div>");
                    var div2=$("<div>"+item.columns.AQI+"</div>");
                    var pullu="无";
                    if(item.columns.AQI>50){
                        pullu=item.columns.PRIMARYPOLLUTANT;
                    }
                    var div3=$("<div>"+pullu+"</div>");
                    divEach.append(div1);
                    divEach.append(div2);
                    divEach.append(div3);
                    contentDiv.append(divEach);

                    var level=tool.levelReturn("AQI",item.columns.AQI);
                    eval("level"+level+"++");
                });

                var scorll=setInterval(function(){
                    $(".tableContentItem").eq(0).stop().animate(
                        {
                            "height" : "0",
                            "opacity" : "0"
                        },"slow",function(){
                            $(this).appendTo(contentDiv);
                            $(this).removeAttr("style");
                        }
                    );
                },1300);

                contentDiv.bind("touchstart",function(){
                    clearInterval(scorll);
                });
                contentDiv.bind("touchend",function(){
                    scorll=setInterval(function(){
                        $(".tableContentItem").eq(0).stop().animate(
                            {
                                "height" : "0",
                                "opacity" : "0"
                            },"slow",function(){
                                $(this).appendTo(contentDiv);
                                $(this).removeAttr("style");
                            }
                        );
                    },1300);
                });
                var AQIDetail="[{\"type\":\"优\",\"value\":"+level1+",\"color\":\"#00E400\"}," +
                    "{\"type\":\"良\",\"value\":"+level2+",\"color\":\"#FFFF00\"}," +
                    "{\"type\":\"轻度\",\"value\":"+level3+",\"color\":\"#FF7E00\"}," +
                    "{\"type\":\"中度\",\"value\":"+level4+",\"color\":\"#FF0000\"}," +
                    "{\"type\":\"重度\",\"value\":"+level5+",\"color\":\"#99004C\"}," +
                    "{\"type\":\"严重\",\"value\":"+level6+",\"color\":\"#7E0023\"}," +
                    "{\"type\":\"离线\",\"value\":"+level0+",\"color\":\"#7B7B7B\"}]";
                AQIDetail=eval(AQIDetail);
                var splitData=new Array();
                var legendarr=new Array();
                $.each(AQIDetail,function(i,item){
                    var itemeach="{value:"+item.value+",name:\""+item.type+item.value+"个\",itemStyle:{normal:{color:\""+item.color+"\"}}}";
                    legendarr.push(item.type+item.value+"个");
                    splitData.push(eval("("+itemeach+")"));
                });

                var myChart = echarts.init(document.getElementById('aqiDistriGraph'));
                myChart.setOption({
                    backgroundColor:"#fff",
                    title:{
                        text:"    全省城市\n空气质量等级",
                        x:115,
                        y:77,
                        textStyle:{
                            fontSize:"14px"
                        }
                    },
                    tooltip : {
                        show:false,
                        trigger:'axis'
                    },
                    toolbox: {
                        show : false
                    },
                    calculable : false,
                    legend: {
                        orient : 'vertical',
                        x:'right',
                        y:'center',
                        data:legendarr
                    },
                    series :[
                        {
                            name:'全省AQI',
                            type:'pie',
                            radius : ['70%', '80%'],
                            center : ['150'],
                            itemStyle : {
                                normal : {
                                    label : {
                                        show : false
                                    },
                                    labelLine : {
                                        show : false
                                    }
                                },
                                emphasis : {
                                    label : {
                                        show : false,
                                        position : 'center',
                                        textStyle : {
                                            fontSize : '30',
                                            fontWeight : 'bold'
                                        }
                                    }
                                }
                            },
                            data:splitData
                        }
                    ]
                });
            }
        });
    },
    // 城市
    cityPage_init:function(citycode){
        if(citycode=="5100"){
            citcode="5101";
        }

        $("#refreshCityPage").unbind().click(function(){
            $(".cityActive").click();
        });
        menuFunction.cityPage_createPage(citycode);
        $("#cityPage_Content6").attr("style","margin-bottom:52px");
    },
//    生成城市页面
    cityPage_createPage:function(citycode){
        $("#cityPage_cityName").attr("citycode",citycode);
        var siteDetailType =  sessionStorage.getItem("siteDetailType");
//                时间
        var timelabel="";
        var today=new Date();
        var weekToday=weekday[today.getDay()];
        if(today.getHours()<10){
            timelabel+="0"+today.getHours();
        }else{
            timelabel+=today.getHours();
        }
        timelabel+=":";
        if(today.getMinutes()<10){
            timelabel+="0"+today.getMinutes();
        }else{
            timelabel+=today.getMinutes();
        }
        timelabel+="  "+weekToday;
        var timeindex=new Date();
        var timearr = tool.publishNotAuditTime(globalTime);
        $("#citypage_Content1Time").text(timearr+" (实时数据,尚未审核)");

        $("#ajaxPleaseWait").show();
        if(siteDetailType == "air"){
        	        $.ajax({
			            type:"GET",
			            url:provinceAjax+"/publish/getAllCityRealTimeAQIC",
			            dataType:'json',
			            async:true,
			            data:{},
			            error:function(){$("#ajaxPleaseWait").hide();
			                tool.warningAlert("warAFailed","获取信息失败");
			            },
			            complete:function(XMLHttpRequest){
			                $("#ajaxPleaseWait").hide();
			                var data=eval("("+XMLHttpRequest.responseText+")");
			                $.each(data.data,function(i,item){
			                    if(item.columns.CITYCODE==citycode){
			                        var eachdata=item.columns;
			                        $("#cityPage_cityName").text(item.columns.CITYNAME);
			                        var cityname=item.columns.CITYNAME;
			                        if(!eachdata.INDEX_MARK){
			                            eachdata.AQI="—";
			                        }
			                        $("#citypage_Content1AQI").text(eachdata.AQI);
			//                        $.ajax({
			//                            type:"GET",
			//                            url:"http://apis.baidu.com/apistore/weatherservice/weather",
			//                            data:{"cityname":cityname},
			//                            beforeSend: function(request) {
			//                                request.setRequestHeader("apikey","8e4564716de8beca94cb4fe23cf31cab");
			//                            },
			//                            complete:function(XMLHttpRequest){
			//                                var data=eval("("+XMLHttpRequest.responseText+")");
			//                                if(data.errMsg=="success"){
			//                                    $("#citypage_Content1Weather").text(data.retData.weather+data.retData.temp+"°");
			//                                    $("#citypage_Content1WindDetail").text(data.retData.WD+" "+data.retData.WS);
			//                                }
			//                            }
			//                        });
			                        var levelname="";
			                        switch(tool.levelReturn("AQI",eachdata.AQI)){
			                            case "0":
			                                levelname="离线";
			                                break;
			                            case "1":
			                                levelname="优";
			                                break;
			                            case "2":
			                                levelname="良";
			                                break;
			                            case "3":
			                                levelname="轻度污染";
			                                break;
			                            case "4":
			                                levelname="中度污染";
			                                break;
			                            case "5":
			                                levelname="重度污染";
			                                break;
			                            case "6":
			                                levelname="严重污染";
			                                break;
			                        }
			                        if(!eachdata.SO2_MARK || !eachdata.INDEX_MARK){
			                            eachdata.ISO2="—";
			                            eachdata.SO2="—";
			                        }
			                        if(!eachdata.NO2_MARK || !eachdata.INDEX_MARK){
			                            eachdata.INO2="—";
			                            eachdata.NO2="—";
			                        }
			                        if(!eachdata.CO_MARK || !eachdata.INDEX_MARK){
			                            eachdata.ICO="—";
			                            eachdata.CO="—";
			                        }
			                        if(!eachdata.O3_MARK || !eachdata.INDEX_MARK){
			                            eachdata.IO3="—";
			                            eachdata.O3="—";
			                        }
			                        if(!eachdata.PM2_5_MARK || !eachdata.INDEX_MARK){
			                            eachdata.IPM2_5="—";
			                            eachdata.PM2_5="—";
			                        }
			                        if(!eachdata.PM10_MARK || !eachdata.INDEX_MARK){
			                            eachdata.IPM10="—";
			                            eachdata.PM10="—";
			                        }
			                        $("#cityPage_Content2ItemSO2").text(eachdata.SO2);
			                        $("#cityPage_Content2ItemNO2").text(eachdata.NO2);
			                        $("#cityPage_Content2ItemCO").text(eachdata.CO);
			                        $("#cityPage_Content2ItemO3").text(eachdata.O3);
			                        $("#cityPage_Content2ItemPM2_5").text(eachdata.PM2_5);
			                        $("#cityPage_Content2ItemPM10").text(eachdata.PM10);
			                        $("#citypage_Content1AQILevel").children("div").text(levelname);
			                        $("#citypage_Content1AQILevel").children("div").css("background-color",tool.levelColor(tool.levelReturn("AQI",eachdata.AQI)).color);
			                        if(eachdata.AQI<=50){
			                            $("#citypage_Content1AQIPull").text("首要污染物:无");
			                        }else{
			                            if(!eachdata.INDEX_MARK){
			                                $("#citypage_Content1AQIPull").html("首要污染物:-");
			                            }else{
			                                $("#citypage_Content1AQIPull").html("首要污染物:"+eachdata.PRIMARYPOLLUTANT.replace(/SO2/,"SO<sub>2</sub>").replace(/NO2/,"NO<sub>2</sub>").replace(/O3/,"O<sub>3</sub>").replace(/PM10/,"PM<sub>10</sub>").replace(/PM2.5/,"PM<sub>2.5</sub>"));
			                            }
			                        }
			                        var backColor=tool.levelColorBackCity(tool.levelReturn("AQI",eachdata.ISO2));
			                        var color=tool.levelColor(tool.levelReturn("AQI",eachdata.ISO2)).color;
			                        $("#cityPage_Content2ItemSO2BarBack").css("background-color",backColor);
			                        $("#cityPage_Content2ItemSO2Bar").css("background-color",color);
			                        $("#cityPage_Content2ItemSO2").css("color",color);
			                        var valueBL=tool.levelReturnBL("AQI",eachdata.ISO2);
			                        $("#cityPage_Content2ItemSO2Bar").css("width",parseFloat(valueBL)*100+"%");
			
			                        var backColor=tool.levelColorBackCity(tool.levelReturn("AQI",eachdata.INO2));
			                        var color=tool.levelColor(tool.levelReturn("AQI",eachdata.INO2)).color;
			                        $("#cityPage_Content2ItemNO2BarBack").css("background-color",backColor);
			                        $("#cityPage_Content2ItemNO2Bar").css("background-color",color);
			                        $("#cityPage_Content2ItemNO2").css("color",color);
			                        var valueBL=tool.levelReturnBL("AQI",eachdata.INO2);
			                        $("#cityPage_Content2ItemNO2Bar").css("width",parseFloat(valueBL)*100+"%");
			
			                        var backColor=tool.levelColorBackCity(tool.levelReturn("AQI",eachdata.ICO));
			                        var color=tool.levelColor(tool.levelReturn("AQI",eachdata.ICO)).color;
			                        $("#cityPage_Content2ItemCOBarBack").css("background-color",backColor);
			                        $("#cityPage_Content2ItemCOBar").css("background-color",color);
			                        $("#cityPage_Content2ItemCO").css("color",color);
			                        var valueBL=tool.levelReturnBL("AQI",eachdata.ICO);
			                        $("#cityPage_Content2ItemCOBar").css("width",parseFloat(valueBL)*100+"%");
			
			                        var backColor=tool.levelColorBackCity(tool.levelReturn("AQI",eachdata.IO3));
			                        var color=tool.levelColor(tool.levelReturn("AQI",eachdata.IO3)).color;
			                        $("#cityPage_Content2ItemO3BarBack").css("background-color",backColor);
			                        $("#cityPage_Content2ItemO3Bar").css("background-color",color);
			                        $("#cityPage_Content2ItemO3").css("color",color);
			                        var valueBL=tool.levelReturnBL("AQI",eachdata.IO3);
			                        $("#cityPage_Content2ItemO3Bar").css("width",parseFloat(valueBL)*100+"%");
			
			                        var backColor=tool.levelColorBackCity(tool.levelReturn("AQI",eachdata.IPM2_5));
			                        var color=tool.levelColor(tool.levelReturn("AQI",eachdata.IPM2_5)).color;
			                        $("#cityPage_Content2ItemPM2_5BarBack").css("background-color",backColor);
			                        $("#cityPage_Content2ItemPM2_5Bar").css("background-color",color);
			                        $("#cityPage_Content2ItemPM2_5").css("color",color);
			                        var valueBL=tool.levelReturnBL("AQI",eachdata.IPM2_5);
			                        $("#cityPage_Content2ItemPM2_5Bar").css("width",parseFloat(valueBL)*100+"%");
			
			                        var backColor=tool.levelColorBackCity(tool.levelReturn("AQI",eachdata.IPM10));
			                        var color=tool.levelColor(tool.levelReturn("AQI",eachdata.IPM10)).color;
			                        $("#cityPage_Content2ItemPM10BarBack").css("background-color",backColor);
			                        $("#cityPage_Content2ItemPM10Bar").css("background-color",color);
			                        $("#cityPage_Content2ItemPM10").css("color",color);
			                        var valueBL=tool.levelReturnBL("AQI",eachdata.IPM10);
			                        $("#cityPage_Content2ItemPM10Bar").css("width",parseFloat(valueBL)*100+"%");
			
			                        var aqilevel=tool.levelReturn("AQI",eachdata.AQI);
			                        $.each(littleTips,function(i,item){
			                            if(item.level==aqilevel){
			                                $("#cityPage_Content3Tips").text(item.content);
			                            }
			                        });
			                        $(".cityPage_Content4Button").unbind().click(function(){
			                            $(".cityPage_Content4ButtonActive").removeClass("cityPage_Content4ButtonActive");
			                            $(this).addClass("cityPage_Content4ButtonActive");
			                            var gas=$(".cityGasActive").attr("gas");
			                            var type=$(this).attr("datatype");
			                            if(type=="hour"){
			                                $("#ajaxPleaseWait").show();
			                                $.ajax({
			                                    type:"GET",
			                                    url:provinceAjax+"/publish/getCity24HRealTimeAQIC",
			                                    dataType:'json',
			                                    async:true,
			                                    data:{"cityCode":citycode},
			                                    error:function(){$("#ajaxPleaseWait").hide();
			                                        tool.warningAlert("warAFailed","获取信息失败");
			                                    },
			                                    complete:function(XMLHttpRequest){
			                                        $("#ajaxPleaseWait").hide();
			                                        var data=eval("("+XMLHttpRequest.responseText+")");
			                                        menuFunction.createCityHourAndDayGraph(gas,type,data);
			                                    }
			                                });
			                            }else if(type=="day"){
			                                $("#ajaxPleaseWait").show();
			                                $.ajax({
			                                    type:"GET",
			                                    url:provinceAjax+"/publish/getCity365DayAQI",
			                                    dataType:'json',
			                                    async:true,
			                                    data:{"cityCode":citycode},
			                                    error:function(){$("#ajaxPleaseWait").hide();
			                                        tool.warningAlert("warAFailed","获取信息失败");
			                                    },
			                                    complete:function(XMLHttpRequest){
			                                        $("#ajaxPleaseWait").hide();
			                                        var data=eval("("+XMLHttpRequest.responseText+")");
			                                        menuFunction.createCityHourAndDayGraph(gas,type,data);
			                                    }
			                                });
			                            }
			                        });
			
			                        mapCity = new BMap.Map("cityPageMap");
			                        var p0="";
			                        var p1="";
			                        var cityzoom=13;
			                        $.each(cityMapDetail,function(i,item){
			                            if(item.cityCode==citycode){
			                                var cityPoint=item.cityPoint;
			                                cityzoom=item.zoom;
			                                cityPoint=cityPoint.split("|");
			                                p0=parseFloat(cityPoint[0]);
			                                p1=parseFloat(cityPoint[1]);
			                            }
			                        });
			                        var pointIndex = new BMap.Point(p0,p1);
			                        mapCity.centerAndZoom(pointIndex,cityzoom);
			                        mapCity.disableDragging();
			                        mapCity.disablePinchToZoom();
			                        mapCity.disableDoubleClickZoom();
			
			
			                        $("#cityGasChangeBar").children("div").unbind().click(function(){
			                            var gas=$(this).attr("gas");
			                            $(".cityGasActive").removeClass("cityGasActive");
			                            $(this).addClass("cityGasActive");
			                            $(".cityPage_Content4ButtonActive").click();
			                        });
			                        $("#cityGasChangeBar").children("div").eq(0).click();
			
			                        $("#cityGasTableChangeBar").children("div").unbind().click(function(){
			                            var gas=$(this).attr("gas");
			                            $(".cityGasTableActive").removeClass("cityGasTableActive");
			                            $(this).addClass("cityGasTableActive");
			                            menuFunction.cityPage_gasTable(gas,citycode);
			                            menuFunction.cityPage_mapMark(gas,citycode);
			                        });
			                        $("#cityGasTableChangeBar").children("div").eq(0).click();
			                        $("#cityPage_Content6").removeAttr("style");
			                    }
			                });
			            }
			        });
    }else if(siteDetailType == "airSiteCountries"){
            var stationcode;
            var review = citycode.substring(4,5);
            var codePart = citycode.substring(0,4);
            review == "1" ? stationcode=codePart+"A" : review=="2" ? stationcode=codePart+"E" : review=="3" ? stationcode=codePart+"B" : review=="4" ? stationcode=codePart+"C" : "";
            $.ajax({
                type:"POST",
                url:myURL+'/station/stationReal',
                dataType:'json',
                async:true,
                data:{
                    stationCode:stationcode
                },
                error:function(){
                    $("#ajaxPleaseWait").hide();
                    tool.warningAlert("warAFailed","获取信息失败");
                },
                complete:function(XMLHttpRequest){
                    $("#ajaxPleaseWait").hide();
                    var data=eval("("+XMLHttpRequest.responseText+")");
//                  var consoletime=tool.cityGraphTooltipTime(new Date(data.TimePoint));
                    var consoletime = tool.publishNotAuditTime(globalTime);
                    $("#citypage_Content1Time").text(consoletime+" (实时数据,尚未审核)");
                    if(data.CountyName){
                        if(data.CountyName=="市区"){
                            if(data.StationName.indexOf(data.CityName)!="-1"){
                                $("#cityPage_cityName").text(data.StationName);
                            }else{
                                $("#cityPage_cityName").text(data.CityName+data.StationName);
                            }
                        }else{
                            if(data.StationName.indexOf(data.CountyName)!="-1"){
                                $("#cityPage_cityName").text(data.StationName);
                            }else{
                                $("#cityPage_cityName").text(data.CountyName+data.StationName);
                            }
                        }
                    }else{
                        if(data.StationName.indexOf(data.CityName)=="-1"){
                            $("#cityPage_cityName").text(data.StationName);
                        }else{
                            $("#cityPage_cityName").text(data.CityName+data.StationName);
                        }
                    }
                    var cityname=data.CityName;
                    $("#citypage_Content1AQI").text(data.AQI);
                    var levelname="";
                    switch(tool.levelReturn("AQI",data.AQI)){
                        case "0":
                            levelname="离线";
                            break;
                        case "1":
                            levelname="优";
                            break;
                        case "2":
                            levelname="良";
                            break;
                        case "3":
                            levelname="轻度污染";
                            break;
                        case "4":
                            levelname="中度污染";
                            break;
                        case "5":
                            levelname="重度污染";
                            break;
                        case "6":
                            levelname="严重污染";
                            break;
                    }
                    $("#cityPage_Content2ItemSO2").text(data.SO2);
                    $("#cityPage_Content2ItemNO2").text(data.NO2);
                    $("#cityPage_Content2ItemCO").text(data.CO);
                    $("#cityPage_Content2ItemO3").text(data.O3);
                    $("#cityPage_Content2ItemPM2_5").text(data.PM2_5);
                    $("#cityPage_Content2ItemPM10").text(data.PM10);
                    $("#citypage_Content1AQILevel").children("div").text(levelname);
                    $("#citypage_Content1AQILevel").children("div").css("background-color",tool.levelColor(tool.levelReturn("AQI",data.AQI))).color;
                    if(data.AQI<=50){
                        $("#citypage_Content1AQIPull").text("首要污染物:无");
                    }else{
                        if(data.PrimaryPollutant==""){
                            $("#citypage_Content1AQIPull").html("首要污染物:-");
                        }else{
                            $("#citypage_Content1AQIPull").html("首要污染物:"+data.PrimaryPollutant.replace(/SO2/,"SO<sub>2</sub>").replace(/NO2/,"NO<sub>2</sub>").replace(/O3/,"O<sub>3</sub>").replace(/PM10/,"PM<sub>10</sub>").replace(/PM2.5/,"PM<sub>2.5</sub>"));
                        }
                    }

                    var backColor=tool.levelColorBackCity(tool.levelReturn("AQI",data.ISO2));
                    var color=tool.levelColor(tool.levelReturn("AQI",data.ISO2)).color;
                    $("#cityPage_Content2ItemSO2BarBack").css("background-color",backColor);
                    $("#cityPage_Content2ItemSO2Bar").css("background-color",color);
                    $("#cityPage_Content2ItemSO2").css("color",color);
                    var valueBL=tool.levelReturnBL("AQI",data.ISO2);
                    $("#cityPage_Content2ItemSO2Bar").css("width",parseFloat(valueBL)*100+"%");

                    var backColor=tool.levelColorBackCity(tool.levelReturn("AQI",data.INO2));
                    var color=tool.levelColor(tool.levelReturn("AQI",data.INO2)).color;
                    $("#cityPage_Content2ItemNO2BarBack").css("background-color",backColor);
                    $("#cityPage_Content2ItemNO2Bar").css("background-color",color);
                    $("#cityPage_Content2ItemNO2").css("color",color);
                    var valueBL=tool.levelReturnBL("AQI",data.INO2);
                    $("#cityPage_Content2ItemNO2Bar").css("width",parseFloat(valueBL)*100+"%");

                    var backColor=tool.levelColorBackCity(tool.levelReturn("AQI",data.ICO));
                    var color=tool.levelColor(tool.levelReturn("AQI",data.ICO)).color;
                    $("#cityPage_Content2ItemCOBarBack").css("background-color",backColor);
                    $("#cityPage_Content2ItemCOBar").css("background-color",color);
                    $("#cityPage_Content2ItemCO").css("color",color);
                    var valueBL=tool.levelReturnBL("AQI",data.ICO);
                    $("#cityPage_Content2ItemCOBar").css("width",parseFloat(valueBL)*100+"%");

                    var backColor=tool.levelColorBackCity(tool.levelReturn("AQI",data.IO3));
                    var color=tool.levelColor(tool.levelReturn("AQI",data.IO3)).color;
                    $("#cityPage_Content2ItemO3BarBack").css("background-color",backColor);
                    $("#cityPage_Content2ItemO3Bar").css("background-color",color);
                    $("#cityPage_Content2ItemO3").css("color",color);
                    var valueBL=tool.levelReturnBL("AQI",data.IO3);
                    $("#cityPage_Content2ItemO3Bar").css("width",parseFloat(valueBL)*100+"%");

                    var backColor=tool.levelColorBackCity(tool.levelReturn("AQI",data.IPM2_5));
                    var color=tool.levelColor(tool.levelReturn("AQI",data.IPM2_5)).color;
                    $("#cityPage_Content2ItemPM2_5BarBack").css("background-color",backColor);
                    $("#cityPage_Content2ItemPM2_5Bar").css("background-color",color);
                    $("#cityPage_Content2ItemPM2_5").css("color",color);
                    var valueBL=tool.levelReturnBL("AQI",data.IPM2_5);
                    $("#cityPage_Content2ItemPM2_5Bar").css("width",parseFloat(valueBL)*100+"%");

                    var backColor=tool.levelColorBackCity(tool.levelReturn("AQI",data.IPM10));
                    var color=tool.levelColor(tool.levelReturn("AQI",data.IPM10)).color;
                    $("#cityPage_Content2ItemPM10BarBack").css("background-color",backColor);
                    $("#cityPage_Content2ItemPM10Bar").css("background-color",color);
                    $("#cityPage_Content2ItemPM10").css("color",color);
                    var valueBL=tool.levelReturnBL("AQI",data.IPM10);
                    $("#cityPage_Content2ItemPM10Bar").css("width",parseFloat(valueBL)*100+"%");

                    var aqilevel=tool.levelReturn("AQI",data.AQI);
                    $.each(littleTips,function(i,item){
                        if(item.level==aqilevel){
                            $("#cityPage_Content3Tips").text(item.content);
                        }
                    });
                    $(".cityPage_Content4Button").unbind().click(function(){
                        $(".cityPage_Content4ButtonActive").removeClass("cityPage_Content4ButtonActive");
                        $(this).addClass("cityPage_Content4ButtonActive");
                        var gas=$(".cityGasActive").attr("gas");
                        var type=$(this).attr("datatype");
                        if(type=="hour"){
                            $("#ajaxPleaseWait").show();
                            $.ajax({
                                type:"POST",
                                url:myURL+'/station/stationHourHis',
                                dataType:'json',
                                async:true,
                                data:{
                                    stationCode:stationcode
                                },
                                error:function(){
                                    $("#ajaxPleaseWait").hide();
                                    tool.warningAlert("warAFailed","获取信息失败");
                                },
                                complete:function(XMLHttpRequest){
                                    $("#ajaxPleaseWait").hide();
                                    var data=eval("("+XMLHttpRequest.responseText+")");
                                    menuFunction.createCityHourAndDayGraph(gas,type,data);
                                }
                            });
                        }
                        else if(type=="day"){
                            $("#ajaxPleaseWait").show();
                            $.ajax({
                                type:"POST",
                                url:myURL+'/station/stationDayHis',
                                dataType:'json',
                                async:true,
                                data:{
                                    stationCode:stationcode
                                },
                                error:function(){
                                    $("#ajaxPleaseWait").hide();
                                    tool.warningAlert("warAFailed","获取信息失败");
                                },
                                complete:function(XMLHttpRequest){
                                    $("#ajaxPleaseWait").hide();
                                    var data=eval("("+XMLHttpRequest.responseText+")");
                                    menuFunction.createCityHourAndDayGraph(gas,type,data);
                                }
                            });
                        }
                    });
                    $(".cityPage_Content4Button").eq(0).click();
                    mapCity = new BMap.Map("cityPageMap");
                    var p0=data.Longitude;
                    var p1=data.Latitude;
                    var cityzoom=13;

                    var pointIndex = new BMap.Point(p0,p1);
                    mapCity.centerAndZoom(pointIndex,cityzoom);
                    mapCity.disableDragging();
                    mapCity.disablePinchToZoom();
                    mapCity.disableDoubleClickZoom();

                    $("#cityGasChangeBar").children("div").unbind().click(function(){
                        var gas=$(this).attr("gas");
                        $(".cityGasActive").removeClass("cityGasActive");
                        $(this).addClass("cityGasActive");
                        $(".cityPage_Content4ButtonActive").click();
                    });
                    $("#cityGasChangeBar").children("div").eq(0).click();

                    $("#cityGasTableChangeBar").children("div").unbind().click(function(){
                        var gas=$(this).attr("gas");
                        $(".cityGasTableActive").removeClass("cityGasTableActive");
                        $(this).addClass("cityGasTableActive");
                        var itemEach={};
                        itemEach.CITYCODE=data.StationCode;
                        itemEach.CITYNAME=data.StationName;
                        itemEach.POINT=data.Longitude+"|"+data.Latitude;
                        itemEach.VALUE=data[gas];
                        itemEach.GAS=gas;
                        if(gas=="AQI"){
                            var level=tool.levelReturn("AQI",itemEach.VALUE);
                            var color=tool.levelColor(level);
                        }else{
                            var valuegas=tool.IAQIHourCal(gas.toLowerCase(),itemEach.VALUE);
                            var level=tool.levelReturn("AQI",valuegas);
                            var color=tool.levelColor(level);
                        }
                        itemEach.COLOR=color;
                        tool.mapAddMark(mapCity,itemEach,"","station","city","13");
                    });
                    $("#cityGasTableChangeBar").children("div").eq(0).click();
                    $("#cityPage_Content6").removeAttr("style");
                }
            });
        }

    },
//    城市页面地图打点
    cityPage_mapMark:function(gas,citycode){
//        $("#ajaxPleaseWait").show();
        mapCity.clearOverlays();
        $.ajax({
            type:"post",
            url:provinceAjax+"/publish/getCityInfoCForApp",
            dataType:'json',
            async:true,
            data:{"cityCode":citycode},
            error:function(){$("#ajaxPleaseWait").hide();
                tool.warningAlert("warAFailed","获取地图信息失败");
            },
            complete:function(XMLHttpRequest){
//                $("#ajaxPleaseWait").hide();
                var data=eval("("+XMLHttpRequest.responseText+")");
                var mapdata=data.columns.STATIONREALTIMEAQI.data;
                $.each(mapdata,function(i,item){
                    var itemEach={};
                    itemEach.CITYCODE=item.columns.STATIONCODE;
                    itemEach.CITYNAME=item.columns.STATIONNAME;
                    itemEach.POINT=item.columns.LNG+"|"+item.columns.LAT;
                    itemEach.VALUE=eval("item.columns."+gas);
                    itemEach.GAS=gas;
                    if(itemEach.CITYCODE=="1008A"){
                        itemEach.POINT="103.85|30.75";
                    }
                    if(gas=="AQI"){
                        var level=tool.levelReturn("AQI",itemEach.VALUE);
                        var color=tool.levelColor(level);
                    }else{
                        var valuegas=tool.IAQIHourCal(gas.toLowerCase(),itemEach.VALUE);
                        var level=tool.levelReturn("AQI",valuegas);
                        var color=tool.levelColor(level);
                    }
                    itemEach.COLOR=color;
                    tool.mapAddMark(mapCity,itemEach,"","station");
                    
                });
            }
        });
    },
//    城市浓度表
    cityPage_gasTable:function(gas,citycode){
        var dw="μg/m³";
        if(dw=="AQI"){
            dw="";
        }else if(dw=="CO"){
            dw="mg/m³";
        }
//        $("#ajaxPleaseWait").show();
        $.ajax({
            type:"post",
            url:provinceAjax+"/publish/getCityInfoCForApp",
            dataType:'json',
            async:true,
            data:{"cityCode":citycode},
            error:function(){$("#ajaxPleaseWait").hide();
                tool.warningAlert("warAFailed","获取浓度信息失败");
            },
            complete:function(XMLHttpRequest){
//                $("#ajaxPleaseWait").hide();
                var data=eval("("+XMLHttpRequest.responseText+")");
                var mapdata=data.columns.STATIONREALTIMEAQI.data;
                $("#cityGasTable").html("");
                $.each(mapdata,function(i,item){
                    var value=eval("item.columns."+gas);
                    if(value==null){
                        value="—";
                    }
                    if(gas=="AQI"){
                        var color=tool.levelColor(tool.levelReturn(gas,value)).color;
                    }else{
                        var valuegas=tool.IAQIHourCal(gas.toLowerCase(),value);
                        var color=tool.levelColor(tool.levelReturn("AQI",valuegas)).color;
                    }
                    var dwuse=dw;
                    if(value=="—"){
                        dwuse="";
                    }
                    var divEach=$("<div class='gasTableItem' stationcode='"+item.columns.STATIONCODE+"'>" +
                        "<div class='gasTableItemName'>"+item.columns.STATIONNAME+"</div>" +
                        "<div><div class='gasTableItemValue numberFontFamily' style='background-color:"+color+"'>"+value+"</div></div></div>");
                    $("#cityGasTable").append(divEach);
                });
            }
        });

    },
//    城市小时和日数据绘图
    /*createCityHourAndDayGraph:function(gas,type,data){
        var siteDetailType =  sessionStorage.getItem("siteDetailType")
        if(siteDetailType == "air"){
            var xlabel=new Array();
            var graphdata=new Array();
            var colorList=new Array();
            var id="";
            if(type=="hour"){
                $("#cityPage_Content4_GraphDay").html("");
                $("#cityPage_Content4_GraphHour").html("");
                $("#cityPage_Content4_GraphOuterDivDay").hide();
                $("#cityPage_Content4_GraphOuterDivHour").show();
                id="cityPage_Content4_GraphHour";
                var yestoday="";
                var divEachDay;
                var loginwidth=$("#login").outerWidth();

                $("#"+id).append($("<div style='display:inline-block;height:118px;border-top:1px solid #a7a7a7;border-bottom:1px solid #a7a7a7;width:"+(loginwidth-22)+"px'></div>"));
                var highlest=0;
                $.each(data,function(i,item){
                    var oldData=item.data.columns;
                    if(oldData[gas]!="-" && oldData[gas]!="—" && oldData[gas]!=""){
                        if(parseFloat(oldData[gas])>highlest){
                            highlest=parseFloat(oldData[gas]);
                        }
                    }
                });
                var perpx=parseFloat((parseFloat(103/highlest)).toFixed(2));
                $.each(data,function(i,item){
                    var oldData=item.data.columns;
                    var time=oldData.TIMEPOINT;
                    var timenew=new Date(time);
                    if(yestoday==""){
                        yestoday=oldData.TIMEPOINT;
                        divEachDay=$("<div class='cityGraphDayDiv'><label class='cityGraphDayDivTime'>"+timenew.getFullYear()+"-"+(timenew.getMonth()+1)+"-"+timenew.getDate()+"</label><div class='cityGraphDayDivButtom'><div class='cityGraphDayDataDivBlank'></div></div></div>");
                        if(timenew.getHours()<10){
                            divEachDay.children(".cityGraphDayDivTime").css("color","#000");
                        }else{
                            divEachDay.children(".cityGraphDayDivTime").css("color","rgba(0,0,0,0)");
                            divEachDay.children(".cityGraphDayDivTime").css("width","8px");
                        }
                    }
                    var color;
                    if(gas=="AQI"){
                        color=tool.levelColor(tool.levelReturn(gas,oldData[gas])).color;
                    }else{
                        var valuegas=tool.IAQIHourCal(gas.toLowerCase(),oldData[gas]);
                        color=tool.levelColor(tool.levelReturn("AQI",valuegas)).color;
                    }
                    var divheight=0;
                    if(oldData[gas]=="—" || !oldData[gas]){
                        divheight="0";
                    }else{
                        divheight=oldData[gas]*perpx;
                    }
                    var gasdata="—";
                    if(oldData[gas]){
                        gasdata=oldData[gas];
                    }
                    if(!tool.ifSameDay(yestoday,time)){
                        $("#"+id).append(divEachDay);
                        divEachDay=$("<div class='cityGraphDayDiv'><label class='cityGraphDayDivTime'>"+timenew.getFullYear()+"-"+(timenew.getMonth()+1)+"-"+timenew.getDate()+"</label><div class='cityGraphDayDivButtom'><div class='cityGraphDayDataDivBlank'></div></div></div>");
                        divEachDay.children(".cityGraphDayDivButtom").append($("<div class='cityGraphDayDataDiv' id='graphBarZZ"+i+"' graphBarCount='"+i+"' style='background-color:"+color+";width:8px;height:"+divheight+"px' gasvalue='"+gasdata+"' gastype='"+gas+"' gastime='"+tool.cityGraphTooltipTime(timenew)+"'></div>"));
                        yestoday=time;
                    }else{
                        divEachDay.children(".cityGraphDayDivButtom").append($("<div class='cityGraphDayDataDiv' id='graphBarZZ"+i+"' graphBarCount='"+i+"' style='background-color:"+color+";width:8px;height:"+divheight+"px' gasvalue='"+gasdata+"' gastype='"+gas+"' gastime='"+tool.cityGraphTooltipTime(timenew)+"'></div>"));
                        yestoday=time;
                    }
                });

                $("#"+id).append(divEachDay);

                $("#cityPage_Content4_GraphOuterDivHour").scrollLeft(10000);
                $(".cityGraphDayDataDivActive").removeClass("cityGraphDayDataDivActive");
                $(".cityGraphDayDataDiv").eq(-1).addClass("cityGraphDayDataDivActive");
                var time=$(".cityGraphDayDataDiv").eq(-1).attr("gastime");
                var type=$(".cityGraphDayDataDiv").eq(-1).attr("gastype");
                var value=$(".cityGraphDayDataDiv").eq(-1).attr("gasvalue");
                $("#cityGraphDateLabelTooltip").children("span").text(time+" "+type+"="+value);

                var outerWidth=$("#login").outerWidth();
                var before = $("#cityPage_Content4_GraphOuterDivHour").scrollLeft();
                var barcount=$(".cityGraphDayDataDiv").length;
                $("#cityPage_Content4_GraphOuterDivHour").bind("scroll",function(){
                    var after = $("#cityPage_Content4_GraphOuterDivHour").scrollLeft();
                    var cha=Math.abs(before-after);
                    if(cha>9.5){
                        if (before<after) {
                            var now=parseInt($(".cityGraphDayDataDivActive").attr("graphBarCount"));
                            if(now!=(barcount-1)){
                                $(".cityGraphDayDataDivActive").removeClass("cityGraphDayDataDivActive");
                                var mustbeselected=$("#graphBarZZ"+(now+1));
                                mustbeselected.addClass("cityGraphDayDataDivActive");
                                var time=mustbeselected.attr("gastime");
                                var type=mustbeselected.attr("gastype");
                                var value=mustbeselected.attr("gasvalue");
                                $("#cityGraphDateLabelTooltip").children("span").text(time+" "+type+"="+value);
                            }
                            before = after;
                        };
                        if (before>after) {
                            var now=parseInt($(".cityGraphDayDataDivActive").attr("graphBarCount"));
                            if(now!=0){
                                $(".cityGraphDayDataDivActive").removeClass("cityGraphDayDataDivActive");
                                var mustbeselected=$("#graphBarZZ"+(now-1));
                                mustbeselected.addClass("cityGraphDayDataDivActive");
                                var time=mustbeselected.attr("gastime");
                                var type=mustbeselected.attr("gastype");
                                var value=mustbeselected.attr("gasvalue");
                                $("#cityGraphDateLabelTooltip").children("span").text(time+" "+type+"="+value);
                            }
                            before = after;
                        };
                    }
                });
                $("#cityPage_Content4_GraphOuterDivHour").on("scrollstop",function(){
                    var mustbeselected=$("#cityPage_Content4_GraphHour .cityGraphDayDataDiv:left(>16):left(<27)");
                    if(mustbeselected.attr("class")=="cityGraphDayDataDiv"){
                        $(".cityGraphDayDataDivActive").removeClass("cityGraphDayDataDivActive");
                        mustbeselected.addClass("cityGraphDayDataDivActive");
                        var time=mustbeselected.attr("gastime");
                        var type=mustbeselected.attr("gastype");
                        var value=mustbeselected.attr("gasvalue");
                        $("#cityGraphDateLabelTooltip").children("span").text(time+" "+type+"="+value);
                    }
                });
                $(".cityGraphDayDivButtom").eq(-1).append($("<div style='background-color:#fff;width:8px;display: inline-block;vertical-align: bottom;margin-left:1px;margin-right:1px;'></div>"));
            }else{
                $("#cityPage_Content4_GraphHour").html("");
                $("#cityPage_Content4_GraphDay").html("");
                $("#cityPage_Content4_GraphOuterDivDay").show();
                $("#cityPage_Content4_GraphOuterDivHour").hide();
                id="cityPage_Content4_GraphDay";
                var yestoday="";
                var divEachDay;
                var loginwidth=$("#login").outerWidth();
                $("#"+id).append($("<div style='display:inline-block;height:118px;border-top:1px solid #a7a7a7;border-bottom:1px solid #a7a7a7;width:"+(loginwidth-22)+"px'></div>"));
                var highlest=0;
                $.each(data,function(i,item){
                    var oldData=item;
                    if(oldData[gas]!="-" && oldData[gas]!="—" && oldData[gas]!=""){
                        if(parseFloat(oldData[gas])>highlest){
                            highlest=parseFloat(oldData[gas]);
                        }
                    }
                });
                var perpx=parseFloat((parseFloat(103/highlest)).toFixed(2));
                $.each(data,function(i,item){
                    var oldData=item;
                    var time=oldData.TIMEPOINT;
                    time=time.replace(/-/g,"/");
                    var timenew=new Date(time);
                    if(yestoday==""){
                        yestoday=oldData.TIMEPOINT;
                        divEachDay=$("<div class='cityGraphDayDiv'><label class='cityGraphDayDivTime'>"+timenew.getFullYear()+"-"+(timenew.getMonth()+1)+"</label><div class='cityGraphDayDivButtom'><div class='cityGraphDayDataDivBlank'></div></div></div>");
                        if(timenew.getHours()<10){
                            divEachDay.children(".cityGraphDayDivTime").css("color","#000");
                        }else{
                            divEachDay.children(".cityGraphDayDivTime").css("color","rgba(0,0,0,0)");
                            divEachDay.children(".cityGraphDayDivTime").css("width","8px");
                        }
                    }
                    var color;
                    if(gas=="AQI"){
                        color=tool.levelColor(tool.levelReturn(gas,oldData[gas])).color;
                    }else{
                        var valuegas=tool.IAQIHourCal(gas.toLowerCase(),oldData[gas]);
                        color=tool.levelColor(tool.levelReturn("AQI",valuegas)).color;
                    }
                    var divheight=0;
                    if(oldData[gas]=="—" || !oldData[gas]){
                        divheight="0";
                    }else{
                        divheight=oldData[gas]*perpx;
                    }
                    var gasdata="—";
                    if(oldData[gas]){
                        gasdata=oldData[gas];
                    }
                    if(!tool.ifSameMonth(yestoday,time)){
                        $("#"+id).append(divEachDay);
                        divEachDay=$("<div class='cityGraphDayDiv'><label class='cityGraphDayDivTime'>"+timenew.getFullYear()+"-"+(timenew.getMonth()+1)+"</label><div class='cityGraphDayDivButtom'><div class='cityGraphDayDataDivBlank'></div></div></div>");
                        divEachDay.children(".cityGraphDayDivButtom").append($("<div class='cityGraphDayDataDiv' id='graphBarZZ"+i+"' graphBarCount='"+i+"' style='background-color:"+color+";width:8px;height:"+divheight+"px' gasvalue='"+gasdata+"' gastype='"+gas+"' gastime='"+tool.cityGraphTooltipTime2(timenew)+"'></div>"));
                        yestoday=time;
                    }else{
                        divEachDay.children(".cityGraphDayDivButtom").append($("<div class='cityGraphDayDataDiv' id='graphBarZZ"+i+"' graphBarCount='"+i+"' style='background-color:"+color+";width:8px;height:"+divheight+"px' gasvalue='"+gasdata+"' gastype='"+gas+"' gastime='"+tool.cityGraphTooltipTime2(timenew)+"'></div>"));
                        yestoday=time;
                    }
                });
                $("#"+id).append(divEachDay);
                $(".cityGraphDayDivButtom").eq(-1).append($("<div style='background-color:#fff;width:8px;display: inline-block;vertical-align: bottom;margin-left:1px;margin-right:1px;'></div>"));

                $(".cityGraphDayDataDivActive").removeClass("cityGraphDayDataDivActive");
                $(".cityGraphDayDataDiv").eq(-1).addClass("cityGraphDayDataDivActive");
                var time=$(".cityGraphDayDataDiv").eq(-1).attr("gastime");
                var type=$(".cityGraphDayDataDiv").eq(-1).attr("gastype");
                var value=$(".cityGraphDayDataDiv").eq(-1).attr("gasvalue");
                $("#cityGraphDateLabelTooltip").children("span").text(time+" "+type+"="+value);
                var outerWidth=$("#login").outerWidth();
                var before = $("#cityPage_Content4_GraphOuterDivDay").scrollLeft();
                var barcount=$(".cityGraphDayDataDiv").length;
                $("#cityPage_Content4_GraphOuterDivDay").bind("scroll",function(){
                    var after = $("#cityPage_Content4_GraphOuterDivDay").scrollLeft();
                    var cha=Math.abs(before-after);
                    if(cha>9.5){
                        if (before<after) {
                            var now=parseInt($(".cityGraphDayDataDivActive").attr("graphBarCount"));
                            if(now!=(barcount-1)){
                                $(".cityGraphDayDataDivActive").removeClass("cityGraphDayDataDivActive");
                                var mustbeselected=$("#graphBarZZ"+(now+1));
                                mustbeselected.addClass("cityGraphDayDataDivActive");
                                var time=mustbeselected.attr("gastime");
                                var type=mustbeselected.attr("gastype");
                                var value=mustbeselected.attr("gasvalue");
                                $("#cityGraphDateLabelTooltip").children("span").text(time+" "+type+"="+value);
                            }
                            before = after;
                        };
                        if (before>after) {
                            var now=parseInt($(".cityGraphDayDataDivActive").attr("graphBarCount"));
                            if(now!=0){
                                $(".cityGraphDayDataDivActive").removeClass("cityGraphDayDataDivActive");
                                var mustbeselected=$("#graphBarZZ"+(now-1));
                                mustbeselected.addClass("cityGraphDayDataDivActive");
                                var time=mustbeselected.attr("gastime");
                                var type=mustbeselected.attr("gastype");
                                var value=mustbeselected.attr("gasvalue");
                                $("#cityGraphDateLabelTooltip").children("span").text(time+" "+type+"="+value);
                            }
                            before = after;
                        };
                    }
                });
                $("#cityPage_Content4_GraphOuterDivDay").on("scrollstop",function(){
                    var mustbeselected=$("#cityPage_Content4_GraphDay .cityGraphDayDataDiv:left(>16):left(<27)");
                    if(mustbeselected.attr("class")=="cityGraphDayDataDiv"){
                        $(".cityGraphDayDataDivActive").removeClass("cityGraphDayDataDivActive");
                        mustbeselected.addClass("cityGraphDayDataDivActive");
                        var time=mustbeselected.attr("gastime");
                        var type=mustbeselected.attr("gastype");
                        var value=mustbeselected.attr("gasvalue");
                        $("#cityGraphDateLabelTooltip").children("span").text(time+" "+type+"="+value);
                    }
                });
                $("#cityPage_Content4_GraphOuterDivDay").scrollLeft(10000);
            }
        }
        else if(siteDetailType == "airSiteCountries"){
            var xlabel=new Array();
            var graphdata=new Array();
            var colorList=new Array();
            var id="";
            if(type=="hour"){
                $("#cityPage_Content4_GraphDay").html("");
                $("#cityPage_Content4_GraphHour").html("");
                $("#cityPage_Content4_GraphOuterDivDay").hide();
                $("#cityPage_Content4_GraphOuterDivHour").show();
                id="cityPage_Content4_GraphHour";
                var yestoday="";
                var divEachDay;
                var loginwidth=$("#login").outerWidth();
                var highlest=0;
                $.each(data,function(i,item){
                    var oldData=item;
                    if(gas='AQI'){
                        if(oldData[gas]!="-" && oldData[gas]!="—" && oldData[gas]!=""){
                            if(parseFloat(oldData[gas])>highlest){
                                highlest=parseFloat(oldData[gas]);
                            }
                        }
                    }else{
                        if(oldData[gas]!="-" && oldData[gas]!="—" && oldData[gas]!=""){
                            if(parseFloat(oldData[gas])>highlest){
                                highlest=parseFloat(oldData[gas]);
                            }
                        }
                    }
                });
                var perpx=parseFloat((parseFloat(103/highlest)).toFixed(2));
                $.each(data,function(i,item){
                    var oldData=item;
                    var time=oldData.TimePoint;
                    var timenew=new Date(time);
                    if(yestoday==""){
                        yestoday=oldData.TimePoint;
                        divEachDay=$("<div class='cityGraphDayDiv'><label class='cityGraphDayDivTime'>"+timenew.getFullYear()+"-"+(timenew.getMonth()+1)+"-"+timenew.getDate()+"</label><div class='cityGraphDayDivButtom'><div class='cityGraphDayDataDivBlank'></div></div></div>");
                        if(timenew.getHours()<10){
                            divEachDay.children(".cityGraphDayDivTime").css("color","#000");
                        }else{
                            divEachDay.children(".cityGraphDayDivTime").css("color","rgba(0,0,0,0)");
                            divEachDay.children(".cityGraphDayDivTime").css("width","8px");
                        }
                    }
                    var color;
                    if(gas=="AQI"){
                        color=tool.levelColor(tool.levelReturn(gas,oldData[gas])).color;
                    }else{
                        var valuegas=tool.IAQIHourCal(gas.toLowerCase(),oldData[gas]);
                        color=tool.levelColor(tool.levelReturn("AQI",valuegas)).color;
                    }
                    var divheight=0;
                    if(oldData[gas]=="—" || !oldData[gas]){
                        divheight="0";
                    }else{
                        divheight=oldData[gas]*perpx;
                    }
                    var gasdata="—";
                    if(oldData[gas]){
                        gasdata=oldData[gas];
                    }
                    if(!tool.ifSameDay(yestoday,time)){
                        $("#"+id).prepend(divEachDay);
                        divEachDay=$("<div class='cityGraphDayDiv'><label class='cityGraphDayDivTime'>"+timenew.getFullYear()+"-"+(timenew.getMonth()+1)+"-"+timenew.getDate()+"</label><div class='cityGraphDayDivButtom'><div class='cityGraphDayDataDivBlank'></div></div></div>");
                        divEachDay.children(".cityGraphDayDivButtom").append($("<div class='cityGraphDayDataDiv' id='graphBarZZ"+i+"' graphBarCount='"+i+"' style='background-color:"+color+";width:8px;height:"+divheight+"px' gasvalue='"+gasdata+"' gastype='"+gas+"' gastime='"+tool.cityGraphTooltipTime(timenew)+"'></div>"));
                        yestoday=time;
                    }else{
                        divEachDay.children(".cityGraphDayDivButtom").append($("<div class='cityGraphDayDataDiv' id='graphBarZZ"+i+"' graphBarCount='"+i+"' style='background-color:"+color+";width:8px;height:"+divheight+"px' gasvalue='"+gasdata+"' gastype='"+gas+"' gastime='"+tool.cityGraphTooltipTime(timenew)+"'></div>"));
                        yestoday=time;
                    }
                });

                $("#"+id).prepend(divEachDay);
                $("#"+id).prepend($("<div style='display:inline-block;height:118px;border-top:1px solid #a7a7a7;border-bottom:1px solid #a7a7a7;width:"+(loginwidth-22)+"px'></div>"));
                $("#cityPage_Content4_GraphOuterDivHour").scrollLeft(10000);
                $(".cityGraphDayDataDivActive").removeClass("cityGraphDayDataDivActive");
                $(".cityGraphDayDataDiv").eq(-1).addClass("cityGraphDayDataDivActive");
                var time=$(".cityGraphDayDataDiv").eq(-1).attr("gastime");
                var type=$(".cityGraphDayDataDiv").eq(-1).attr("gastype");
                var value=$(".cityGraphDayDataDiv").eq(-1).attr("gasvalue");
                $("#cityGraphDateLabelTooltip").children("span").text(time+" "+type+"="+value);

                var outerWidth=$("#login").outerWidth();
                var before = $("#cityPage_Content4_GraphOuterDivHour").scrollLeft();
                var barcount=$(".cityGraphDayDataDiv").length;
                $("#cityPage_Content4_GraphOuterDivHour").bind("scroll",function(){
                    var after = $("#cityPage_Content4_GraphOuterDivHour").scrollLeft();
                    var cha=Math.abs(before-after);
                    if(cha>9.5){
                        if (before<after) {
                            var now=parseInt($(".cityGraphDayDataDivActive").attr("graphBarCount"));
                            if(now!=(barcount-1)){
                                $(".cityGraphDayDataDivActive").removeClass("cityGraphDayDataDivActive");
                                var mustbeselected=$("#graphBarZZ"+(now+1));
                                mustbeselected.addClass("cityGraphDayDataDivActive");
                                var time=mustbeselected.attr("gastime");
                                var type=mustbeselected.attr("gastype");
                                var value=mustbeselected.attr("gasvalue");
                                $("#cityGraphDateLabelTooltip").children("span").text(time+" "+type+"="+value);
                            }
                            before = after;
                        };
                        if (before>after) {
                            var now=parseInt($(".cityGraphDayDataDivActive").attr("graphBarCount"));
                            if(now!=0){
                                $(".cityGraphDayDataDivActive").removeClass("cityGraphDayDataDivActive");
                                var mustbeselected=$("#graphBarZZ"+(now-1));
                                mustbeselected.addClass("cityGraphDayDataDivActive");
                                var time=mustbeselected.attr("gastime");
                                var type=mustbeselected.attr("gastype");
                                var value=mustbeselected.attr("gasvalue");
                                $("#cityGraphDateLabelTooltip").children("span").text(time+" "+type+"="+value);
                            }
                            before = after;
                        };
                    }
                });
                $("#cityPage_Content4_GraphOuterDivHour").on("scrollstop",function(){
                    var mustbeselected=$("#cityPage_Content4_GraphHour .cityGraphDayDataDiv:left(>16):left(<27)");
                    if(mustbeselected.attr("class")=="cityGraphDayDataDiv"){
                        $(".cityGraphDayDataDivActive").removeClass("cityGraphDayDataDivActive");
                        mustbeselected.addClass("cityGraphDayDataDivActive");
                        var time=mustbeselected.attr("gastime");
                        var type=mustbeselected.attr("gastype");
                        var value=mustbeselected.attr("gasvalue");
                        $("#cityGraphDateLabelTooltip").children("span").text(time+" "+type+"="+value);
                    }
                });
                $(".cityGraphDayDivButtom").eq(-1).append($("<div style='background-color:#fff;width:8px;display: inline-block;vertical-align: bottom;margin-left:1px;margin-right:1px;'></div>"));
            }else{
                $("#cityPage_Content4_GraphHour").html("");
                $("#cityPage_Content4_GraphDay").html("");
                $("#cityPage_Content4_GraphOuterDivDay").show();
                $("#cityPage_Content4_GraphOuterDivHour").hide();
                id="cityPage_Content4_GraphDay";
                var yestoday="";
                var divEachDay;
                var loginwidth=$("#login").outerWidth();
                var highlest=0;
                $.each(data,function(i,item){
                    var oldData=item;
                    if(oldData[gas]!="-" && oldData[gas]!="—" && oldData[gas]!=""){
                        if(parseFloat(oldData[gas])>highlest){
                            highlest=parseFloat(oldData[gas]);
                        }
                    }
                });
                var perpx=parseFloat((parseFloat(103/highlest)).toFixed(2));
                $.each(data,function(i,item){
                    var oldData=item;
                    var time=oldData.TimePoint;
                    var timenew=new Date(time);
                    if(yestoday==""){
                        yestoday=oldData.TimePoint;
                        divEachDay=$("<div class='cityGraphDayDiv'><label class='cityGraphDayDivTime'>"+timenew.getFullYear()+"-"+(timenew.getMonth()+1)+"</label><div class='cityGraphDayDivButtom'><div class='cityGraphDayDataDivBlank'></div></div></div>");
                        if(timenew.getHours()<10){
                            divEachDay.children(".cityGraphDayDivTime").css("color","#000");
                        }else{
                            divEachDay.children(".cityGraphDayDivTime").css("color","rgba(0,0,0,0)");
                            divEachDay.children(".cityGraphDayDivTime").css("width","8px");
                        }
                    }
                    var color;
                    if(gas=="AQI"){
                        color=tool.levelColor(tool.levelReturn(gas,oldData[gas])).color;
                    }else{
                        var valuegas=tool.IAQIHourCal(gas.toLowerCase(),oldData[gas]);
                        color=tool.levelColor(tool.levelReturn("AQI",valuegas)).color;
                    }
                    var divheight=0;
                    if(oldData[gas]=="—" || !oldData[gas]){
                        divheight="0";
                    }else{
                        divheight=oldData[gas]*perpx;
                    }
                    var gasdata="—";
                    if(oldData[gas]){
                        gasdata=oldData[gas];
                    }
                    if(!tool.ifSameMonth(yestoday,time)){
                        $("#"+id).append(divEachDay);
                        divEachDay=$("<div class='cityGraphDayDiv'><label class='cityGraphDayDivTime'>"+timenew.getFullYear()+"-"+(timenew.getMonth()+1)+"</label><div class='cityGraphDayDivButtom'><div class='cityGraphDayDataDivBlank'></div></div></div>");
                        divEachDay.children(".cityGraphDayDivButtom").append($("<div class='cityGraphDayDataDiv' id='graphBarZZ"+i+"' graphBarCount='"+i+"' style='background-color:"+color+";width:8px;height:"+divheight+"px' gasvalue='"+gasdata+"' gastype='"+gas+"' gastime='"+tool.cityGraphTooltipTime2(timenew)+"'></div>"));
                        yestoday=time;
                    }else{
                        divEachDay.children(".cityGraphDayDivButtom").append($("<div class='cityGraphDayDataDiv' id='graphBarZZ"+i+"' graphBarCount='"+i+"' style='background-color:"+color+";width:8px;height:"+divheight+"px' gasvalue='"+gasdata+"' gastype='"+gas+"' gastime='"+tool.cityGraphTooltipTime2(timenew)+"'></div>"));
                        yestoday=time;
                    }
                });
                $("#"+id).prepend(divEachDay);
                $(".cityGraphDayDivButtom").eq(-1).append($("<div style='background-color:#fff;width:8px;display: inline-block;vertical-align: bottom;margin-left:1px;margin-right:1px;'></div>"));
                $(".cityGraphDayDataDivActive").removeClass("cityGraphDayDataDivActive");
                $(".cityGraphDayDataDiv").eq(-1).addClass("cityGraphDayDataDivActive");
                var time=$(".cityGraphDayDataDiv").eq(-1).attr("gastime");
                var type=$(".cityGraphDayDataDiv").eq(-1).attr("gastype");
                var value=$(".cityGraphDayDataDiv").eq(-1).attr("gasvalue");
                $("#cityGraphDateLabelTooltip").children("span").text(time+" "+type+"="+value);
                var outerWidth=$("#login").outerWidth();
                var before = $("#cityPage_Content4_GraphOuterDivDay").scrollLeft();
                var barcount=$(".cityGraphDayDataDiv").length;
                $("#cityPage_Content4_GraphOuterDivDay").bind("scroll",function(){
                    var after = $("#cityPage_Content4_GraphOuterDivDay").scrollLeft();
                    var cha=Math.abs(before-after);
                    if(cha>9.5){
                        if (before<after) {
                            var now=parseInt($(".cityGraphDayDataDivActive").attr("graphBarCount"));
                            if(now!=(barcount-1)){
                                $(".cityGraphDayDataDivActive").removeClass("cityGraphDayDataDivActive");
                                var mustbeselected=$("#graphBarZZ"+(now+1));
                                mustbeselected.addClass("cityGraphDayDataDivActive");
                                var time=mustbeselected.attr("gastime");
                                var type=mustbeselected.attr("gastype");
                                var value=mustbeselected.attr("gasvalue");
                                $("#cityGraphDateLabelTooltip").children("span").text(time+" "+type+"="+value);
                            }
                            before = after;
                        };
                        if (before>after) {
                            var now=parseInt($(".cityGraphDayDataDivActive").attr("graphBarCount"));
                            if(now!=0){
                                $(".cityGraphDayDataDivActive").removeClass("cityGraphDayDataDivActive");
                                var mustbeselected=$("#graphBarZZ"+(now-1));
                                mustbeselected.addClass("cityGraphDayDataDivActive");
                                var time=mustbeselected.attr("gastime");
                                var type=mustbeselected.attr("gastype");
                                var value=mustbeselected.attr("gasvalue");
                                $("#cityGraphDateLabelTooltip").children("span").text(time+" "+type+"="+value);
                            }
                            before = after;
                        };
                    }
                });
                $("#cityPage_Content4_GraphOuterDivDay").on("scrollstop",function(){
                    var mustbeselected=$("#cityPage_Content4_GraphDay .cityGraphDayDataDiv:left(>16):left(<27)");
                    if(mustbeselected.attr("class")=="cityGraphDayDataDiv"){
                        $(".cityGraphDayDataDivActive").removeClass("cityGraphDayDataDivActive");
                        mustbeselected.addClass("cityGraphDayDataDivActive");
                        var time=mustbeselected.attr("gastime");
                        var type=mustbeselected.attr("gastype");
                        var value=mustbeselected.attr("gasvalue");
                        $("#cityGraphDateLabelTooltip").children("span").text(time+" "+type+"="+value);
                    }
                });
                $("#"+id).prepend($("<div style='display:inline-block;height:118px;border-top:1px solid #a7a7a7;border-bottom:1px solid #a7a7a7;width:"+(loginwidth-22)+"px'></div>"));
                $("#cityPage_Content4_GraphOuterDivDay").scrollLeft(10000);
            }
        }
    },*/

    createCityHourAndDayGraph:function(gas,type,data){
        var siteDetailType =  sessionStorage.getItem("siteDetailType")
        console.log("siteDetailType--->")
        console.log(siteDetailType)
        if(siteDetailType == "air"){
            var xlabel=new Array();
            var graphdata=new Array();
            var colorList=new Array();
            var id="";
            if(type=="hour"){
                console.log("hour小时---->")
                $("#cityPage_Content4_GraphDay").html("");
                $("#cityPage_Content4_GraphHour").html("");
                $("#cityPage_Content4_GraphOuterDivDay").hide();
                $("#cityPage_Content4_GraphOuterDivHour").show();
                id="cityPage_Content4_GraphHour";
                var yestoday="";
                var divEachDay;
                var loginwidth=$("#login").outerWidth();

                $("#"+id).append($("<div style='display:inline-block;height:118px;border-top:1px solid #a7a7a7;border-bottom:1px solid #a7a7a7;width:"+(loginwidth-22)+"px'></div>"));
                var highlest=0;
                $.each(data,function(i,item){
                    var oldData=item.data.columns;
                    if(oldData[gas]!="-" && oldData[gas]!="—" && oldData[gas]!=""){
                        if(parseFloat(oldData[gas])>highlest){
                            highlest=parseFloat(oldData[gas]);
                        }
                    }
                });
                var perpx=parseFloat((parseFloat(103/highlest)).toFixed(2));
                $.each(data,function(i,item){
                    var oldData=item.data.columns;
                    var time=oldData.TIMEPOINT;
                    var timenew=new Date(time);
                    if(yestoday==""){
                        yestoday=oldData.TIMEPOINT;
                        divEachDay=$("<div class='cityGraphDayDiv'><label class='cityGraphDayDivTime'>"+timenew.getFullYear()+"-"+(timenew.getMonth()+1)+"-"+timenew.getDate()+"</label><div class='cityGraphDayDivButtom'><div class='cityGraphDayDataDivBlank'></div></div></div>");
                        if(timenew.getHours()<10){
                            divEachDay.children(".cityGraphDayDivTime").css("color","#000");
                        }else{
                            divEachDay.children(".cityGraphDayDivTime").css("color","rgba(0,0,0,0)");
                            divEachDay.children(".cityGraphDayDivTime").css("width","8px");
                        }
                    }
                    var color;
                    if(gas=="AQI"){
                        color=tool.levelColor(tool.levelReturn(gas,oldData[gas])).color;
                    }else{
                        var valuegas=tool.IAQIHourCal(gas.toLowerCase(),oldData[gas]);
                        color=tool.levelColor(tool.levelReturn("AQI",valuegas)).color;
                    }
                    var divheight=0;
                    if(oldData[gas]=="—" || !oldData[gas]){
                        divheight="0";
                    }else{
                        divheight=oldData[gas]*perpx;
                    }
                    var gasdata="—";
                    if(oldData[gas]){
                        gasdata=oldData[gas];
                    }
                    if(!tool.ifSameDay(yestoday,time)){
                        $("#"+id).append(divEachDay);
                        divEachDay=$("<div class='cityGraphDayDiv'><label class='cityGraphDayDivTime'>"+timenew.getFullYear()+"-"+(timenew.getMonth()+1)+"-"+timenew.getDate()+"</label><div class='cityGraphDayDivButtom'><div class='cityGraphDayDataDivBlank'></div></div></div>");
                        divEachDay.children(".cityGraphDayDivButtom").append($("<div class='cityGraphDayDataDiv' id='graphBarZZ"+i+"' graphBarCount='"+i+"' style='background-color:"+color+";width:8px;height:"+divheight+"px' gasvalue='"+gasdata+"' gastype='"+gas+"' gastime='"+tool.cityGraphTooltipTime(timenew)+"'></div>"));
                        yestoday=time;
                    }else{
                        divEachDay.children(".cityGraphDayDivButtom").append($("<div class='cityGraphDayDataDiv' id='graphBarZZ"+i+"' graphBarCount='"+i+"' style='background-color:"+color+";width:8px;height:"+divheight+"px' gasvalue='"+gasdata+"' gastype='"+gas+"' gastime='"+tool.cityGraphTooltipTime(timenew)+"'></div>"));
                        yestoday=time;
                    }
                });

                $("#"+id).append(divEachDay);

                $("#cityPage_Content4_GraphOuterDivHour").scrollLeft(10000);
                $(".cityGraphDayDataDivActive").removeClass("cityGraphDayDataDivActive");
                $(".cityGraphDayDataDiv").eq(-1).addClass("cityGraphDayDataDivActive");
                var time=$(".cityGraphDayDataDiv").eq(-1).attr("gastime");
                var type=$(".cityGraphDayDataDiv").eq(-1).attr("gastype");
                var value=$(".cityGraphDayDataDiv").eq(-1).attr("gasvalue");
                $("#cityGraphDateLabelTooltip").children("span").text(time+" "+type+"="+value);

                var outerWidth=$("#login").outerWidth();
                var before = $("#cityPage_Content4_GraphOuterDivHour").scrollLeft();
                var barcount=$(".cityGraphDayDataDiv").length;
                $("#cityPage_Content4_GraphOuterDivHour").bind("scroll",function(){
                    var after = $("#cityPage_Content4_GraphOuterDivHour").scrollLeft();
                    var cha=Math.abs(before-after);
                    if(cha>9.5){
                        if (before<after) {
                            var now=parseInt($(".cityGraphDayDataDivActive").attr("graphBarCount"));
                            if(now!=(barcount-1)){
                                $(".cityGraphDayDataDivActive").removeClass("cityGraphDayDataDivActive");
                                var mustbeselected=$("#graphBarZZ"+(now+1));
                                mustbeselected.addClass("cityGraphDayDataDivActive");
                                var time=mustbeselected.attr("gastime");
                                var type=mustbeselected.attr("gastype");
                                var value=mustbeselected.attr("gasvalue");
                                $("#cityGraphDateLabelTooltip").children("span").text(time+" "+type+"="+value);
                            }
                            before = after;
                        };
                        if (before>after) {
                            var now=parseInt($(".cityGraphDayDataDivActive").attr("graphBarCount"));
                            if(now!=0){
                                $(".cityGraphDayDataDivActive").removeClass("cityGraphDayDataDivActive");
                                var mustbeselected=$("#graphBarZZ"+(now-1));
                                mustbeselected.addClass("cityGraphDayDataDivActive");
                                var time=mustbeselected.attr("gastime");
                                var type=mustbeselected.attr("gastype");
                                var value=mustbeselected.attr("gasvalue");
                                $("#cityGraphDateLabelTooltip").children("span").text(time+" "+type+"="+value);
                            }
                            before = after;
                        };
                    }
                });
                $("#cityPage_Content4_GraphOuterDivHour").on("scrollstop",function(){
                    var mustbeselected=$("#cityPage_Content4_GraphHour .cityGraphDayDataDiv:left(>16):left(<27)");
                    if(mustbeselected.attr("class")=="cityGraphDayDataDiv"){
                        $(".cityGraphDayDataDivActive").removeClass("cityGraphDayDataDivActive");
                        mustbeselected.addClass("cityGraphDayDataDivActive");
                        var time=mustbeselected.attr("gastime");
                        var type=mustbeselected.attr("gastype");
                        var value=mustbeselected.attr("gasvalue");
                        $("#cityGraphDateLabelTooltip").children("span").text(time+" "+type+"="+value);
                    }
                });
                $(".cityGraphDayDivButtom").eq(-1).append($("<div style='background-color:#fff;width:8px;display: inline-block;vertical-align: bottom;margin-left:1px;margin-right:1px;'></div>"));
            }else{
                $("#cityPage_Content4_GraphHour").html("");
                $("#cityPage_Content4_GraphDay").html("");
                $("#cityPage_Content4_GraphOuterDivDay").show();
                $("#cityPage_Content4_GraphOuterDivHour").hide();
                id="cityPage_Content4_GraphDay";
                var yestoday="";
                var divEachDay;
                var loginwidth=$("#login").outerWidth();
                $("#"+id).append($("<div style='display:inline-block;height:118px;border-top:1px solid #a7a7a7;border-bottom:1px solid #a7a7a7;width:"+(loginwidth-22)+"px'></div>"));
                var highlest=0;
                $.each(data,function(i,item){
                    var oldData=item;
                    if(oldData[gas]!="-" && oldData[gas]!="—" && oldData[gas]!=""){
                        if(parseFloat(oldData[gas])>highlest){
                            highlest=parseFloat(oldData[gas]);
                        }
                    }
                });
                var perpx=parseFloat((parseFloat(103/highlest)).toFixed(2));
                $.each(data,function(i,item){
                    var oldData=item;
                    var time=oldData.TIMEPOINT;
                    time=time.replace(/-/g,"/");
                    var timenew=new Date(time);
                    if(yestoday==""){
                        yestoday=oldData.TIMEPOINT;
                        divEachDay=$("<div class='cityGraphDayDiv'><label class='cityGraphDayDivTime'>"+timenew.getFullYear()+"-"+(timenew.getMonth()+1)+"</label><div class='cityGraphDayDivButtom'><div class='cityGraphDayDataDivBlank'></div></div></div>");
                        if(timenew.getHours()<10){
                            divEachDay.children(".cityGraphDayDivTime").css("color","#000");
                        }else{
                            divEachDay.children(".cityGraphDayDivTime").css("color","rgba(0,0,0,0)");
                            divEachDay.children(".cityGraphDayDivTime").css("width","8px");
                        }
                    }
                    var color;
                    if(gas=="AQI"){
                        color=tool.levelColor(tool.levelReturn(gas,oldData[gas])).color;
                    }else{
                        var valuegas=tool.IAQIHourCal(gas.toLowerCase(),oldData[gas]);
                        color=tool.levelColor(tool.levelReturn("AQI",valuegas)).color;
                    }
                    var divheight=0;
                    if(oldData[gas]=="—" || !oldData[gas]){
                        divheight="0";
                    }else{
                        divheight=oldData[gas]*perpx;
                    }
                    var gasdata="—";
                    if(oldData[gas]){
                        gasdata=oldData[gas];
                    }
                    if(!tool.ifSameMonth(yestoday,time)){
                        $("#"+id).append(divEachDay);
                        divEachDay=$("<div class='cityGraphDayDiv'><label class='cityGraphDayDivTime'>"+timenew.getFullYear()+"-"+(timenew.getMonth()+1)+"</label><div class='cityGraphDayDivButtom'><div class='cityGraphDayDataDivBlank'></div></div></div>");
                        divEachDay.children(".cityGraphDayDivButtom").append($("<div class='cityGraphDayDataDiv' id='graphBarZZ"+i+"' graphBarCount='"+i+"' style='background-color:"+color+";width:8px;height:"+divheight+"px' gasvalue='"+gasdata+"' gastype='"+gas+"' gastime='"+tool.cityGraphTooltipTime2(timenew)+"'></div>"));
                        yestoday=time;
                    }else{
                        divEachDay.children(".cityGraphDayDivButtom").append($("<div class='cityGraphDayDataDiv' id='graphBarZZ"+i+"' graphBarCount='"+i+"' style='background-color:"+color+";width:8px;height:"+divheight+"px' gasvalue='"+gasdata+"' gastype='"+gas+"' gastime='"+tool.cityGraphTooltipTime2(timenew)+"'></div>"));
                        yestoday=time;
                    }
                });
                $("#"+id).append(divEachDay);
                $(".cityGraphDayDivButtom").eq(-1).append($("<div style='background-color:#fff;width:8px;display: inline-block;vertical-align: bottom;margin-left:1px;margin-right:1px;'></div>"));

                $(".cityGraphDayDataDivActive").removeClass("cityGraphDayDataDivActive");
                $(".cityGraphDayDataDiv").eq(-1).addClass("cityGraphDayDataDivActive");
                var time=$(".cityGraphDayDataDiv").eq(-1).attr("gastime");
                var type=$(".cityGraphDayDataDiv").eq(-1).attr("gastype");
                var value=$(".cityGraphDayDataDiv").eq(-1).attr("gasvalue");
                $("#cityGraphDateLabelTooltip").children("span").text(time+" "+type+"="+value);
                var outerWidth=$("#login").outerWidth();
                var before = $("#cityPage_Content4_GraphOuterDivDay").scrollLeft();
                var barcount=$(".cityGraphDayDataDiv").length;
                $("#cityPage_Content4_GraphOuterDivDay").bind("scroll",function(){
                    var after = $("#cityPage_Content4_GraphOuterDivDay").scrollLeft();
                    var cha=Math.abs(before-after);
                    if(cha>9.5){
                        if (before<after) {
                            var now=parseInt($(".cityGraphDayDataDivActive").attr("graphBarCount"));
                            if(now!=(barcount-1)){
                                $(".cityGraphDayDataDivActive").removeClass("cityGraphDayDataDivActive");
                                var mustbeselected=$("#graphBarZZ"+(now+1));
                                mustbeselected.addClass("cityGraphDayDataDivActive");
                                var time=mustbeselected.attr("gastime");
                                var type=mustbeselected.attr("gastype");
                                var value=mustbeselected.attr("gasvalue");
                                $("#cityGraphDateLabelTooltip").children("span").text(time+" "+type+"="+value);
                            }
                            before = after;
                        };
                        if (before>after) {
                            var now=parseInt($(".cityGraphDayDataDivActive").attr("graphBarCount"));
                            if(now!=0){
                                $(".cityGraphDayDataDivActive").removeClass("cityGraphDayDataDivActive");
                                var mustbeselected=$("#graphBarZZ"+(now-1));
                                mustbeselected.addClass("cityGraphDayDataDivActive");
                                var time=mustbeselected.attr("gastime");
                                var type=mustbeselected.attr("gastype");
                                var value=mustbeselected.attr("gasvalue");
                                $("#cityGraphDateLabelTooltip").children("span").text(time+" "+type+"="+value);
                            }
                            before = after;
                        };
                    }
                });
                $("#cityPage_Content4_GraphOuterDivDay").on("scrollstop",function(){
                    var mustbeselected=$("#cityPage_Content4_GraphDay .cityGraphDayDataDiv:left(>16):left(<27)");
                    if(mustbeselected.attr("class")=="cityGraphDayDataDiv"){
                        $(".cityGraphDayDataDivActive").removeClass("cityGraphDayDataDivActive");
                        mustbeselected.addClass("cityGraphDayDataDivActive");
                        var time=mustbeselected.attr("gastime");
                        var type=mustbeselected.attr("gastype");
                        var value=mustbeselected.attr("gasvalue");
                        $("#cityGraphDateLabelTooltip").children("span").text(time+" "+type+"="+value);
                    }
                });
                $("#cityPage_Content4_GraphOuterDivDay").scrollLeft(10000);
            }
        }
        if(siteDetailType == "airSiteCountries"){
            var xlabel=new Array();
            var graphdata=new Array();
            var colorList=new Array();
            var id="";
            if(type=="hour"){
                console.log("hour小时---->")
                $("#cityPage_Content4_GraphDay").html("");
                $("#cityPage_Content4_GraphHour").html("");
                $("#cityPage_Content4_GraphOuterDivDay").hide();
                $("#cityPage_Content4_GraphOuterDivHour").show();
                id="cityPage_Content4_GraphHour";
                var yestoday="";
                var divEachDay;
                var loginwidth=$("#login").outerWidth();

                $("#"+id).append($("<div style='display:inline-block;height:118px;border-top:1px solid #a7a7a7;border-bottom:1px solid #a7a7a7;width:"+(loginwidth-22)+"px'></div>"));
                var highlest=0;
                $.each(data,function(i,item){
                    var oldData=item;
                    if(oldData[gas]!="-" && oldData[gas]!="—" && oldData[gas]!=""){
                        if(parseFloat(oldData[gas])>highlest){
                            highlest=parseFloat(oldData[gas]);
                        }
                    }
                });
                var perpx=parseFloat((parseFloat(103/highlest)).toFixed(2));
                $.each(data,function(i,item){
                    var oldData=item;
                    var time=oldData.TimePoint;
                    var timenew=new Date(time);
                    if(yestoday==""){
                        yestoday=oldData.TimePoint;
                        divEachDay=$("<div class='cityGraphDayDiv'><label class='cityGraphDayDivTime'>"+timenew.getFullYear()+"-"+(timenew.getMonth()+1)+"-"+timenew.getDate()+"</label><div class='cityGraphDayDivButtom'><div class='cityGraphDayDataDivBlank'></div></div></div>");
                        if(timenew.getHours()<10){
                            divEachDay.children(".cityGraphDayDivTime").css("color","#000");
                        }else{
                            divEachDay.children(".cityGraphDayDivTime").css("color","rgba(0,0,0,0)");
                            divEachDay.children(".cityGraphDayDivTime").css("width","8px");
                        }
                    }
                    var color;
                    if(gas=="AQI"){
                        color=tool.levelColor(tool.levelReturn(gas,oldData[gas])).color;
                    }else{
                        var valuegas=tool.IAQIHourCal(gas.toLowerCase(),oldData[gas]);
                        color=tool.levelColor(tool.levelReturn("AQI",valuegas)).color;
                    }
                    var divheight=0;
                    if(oldData[gas]=="—" || !oldData[gas]){
                        divheight="0";
                    }else{
                        divheight=oldData[gas]*perpx;
                    }
                    var gasdata="—";
                    if(oldData[gas]){
                        gasdata=oldData[gas];
                    }
                    if(!tool.ifSameDay(yestoday,time)){
                        $("#"+id).append(divEachDay);
                        divEachDay=$("<div class='cityGraphDayDiv'><label class='cityGraphDayDivTime'>"+timenew.getFullYear()+"-"+(timenew.getMonth()+1)+"-"+timenew.getDate()+"</label><div class='cityGraphDayDivButtom'><div class='cityGraphDayDataDivBlank'></div></div></div>");
                        divEachDay.children(".cityGraphDayDivButtom").append($("<div class='cityGraphDayDataDiv' id='graphBarZZ"+i+"' graphBarCount='"+i+"' style='background-color:"+color+";width:8px;height:"+divheight+"px' gasvalue='"+gasdata+"' gastype='"+gas+"' gastime='"+tool.cityGraphTooltipTime(timenew)+"'></div>"));
                        yestoday=time;
                    }else{
                        divEachDay.children(".cityGraphDayDivButtom").append($("<div class='cityGraphDayDataDiv' id='graphBarZZ"+i+"' graphBarCount='"+i+"' style='background-color:"+color+";width:8px;height:"+divheight+"px' gasvalue='"+gasdata+"' gastype='"+gas+"' gastime='"+tool.cityGraphTooltipTime(timenew)+"'></div>"));
                        yestoday=time;
                    }
                });

                $("#"+id).append(divEachDay);

                $("#cityPage_Content4_GraphOuterDivHour").scrollLeft(10000);
                $(".cityGraphDayDataDivActive").removeClass("cityGraphDayDataDivActive");
                $(".cityGraphDayDataDiv").eq(-1).addClass("cityGraphDayDataDivActive");
                var time=$(".cityGraphDayDataDiv").eq(-1).attr("gastime");
                var type=$(".cityGraphDayDataDiv").eq(-1).attr("gastype");
                var value=$(".cityGraphDayDataDiv").eq(-1).attr("gasvalue");
                $("#cityGraphDateLabelTooltip").children("span").text(time+" "+type+"="+value);

                var outerWidth=$("#login").outerWidth();
                var before = $("#cityPage_Content4_GraphOuterDivHour").scrollLeft();
                var barcount=$(".cityGraphDayDataDiv").length;
                $("#cityPage_Content4_GraphOuterDivHour").bind("scroll",function(){
                    var after = $("#cityPage_Content4_GraphOuterDivHour").scrollLeft();
                    var cha=Math.abs(before-after);
                    if(cha>9.5){
                        if (before<after) {
                            var now=parseInt($(".cityGraphDayDataDivActive").attr("graphBarCount"));
                            if(now!=(barcount-1)){
                                $(".cityGraphDayDataDivActive").removeClass("cityGraphDayDataDivActive");
                                var mustbeselected=$("#graphBarZZ"+(now+1));
                                mustbeselected.addClass("cityGraphDayDataDivActive");
                                var time=mustbeselected.attr("gastime");
                                var type=mustbeselected.attr("gastype");
                                var value=mustbeselected.attr("gasvalue");
                                $("#cityGraphDateLabelTooltip").children("span").text(time+" "+type+"="+value);
                            }
                            before = after;
                        };
                        if (before>after) {
                            var now=parseInt($(".cityGraphDayDataDivActive").attr("graphBarCount"));
                            if(now!=0){
                                $(".cityGraphDayDataDivActive").removeClass("cityGraphDayDataDivActive");
                                var mustbeselected=$("#graphBarZZ"+(now-1));
                                mustbeselected.addClass("cityGraphDayDataDivActive");
                                var time=mustbeselected.attr("gastime");
                                var type=mustbeselected.attr("gastype");
                                var value=mustbeselected.attr("gasvalue");
                                $("#cityGraphDateLabelTooltip").children("span").text(time+" "+type+"="+value);
                            }
                            before = after;
                        };
                    }
                });
                $("#cityPage_Content4_GraphOuterDivHour").on("scrollstop",function(){
                    var mustbeselected=$("#cityPage_Content4_GraphHour .cityGraphDayDataDiv:left(>16):left(<27)");
                    if(mustbeselected.attr("class")=="cityGraphDayDataDiv"){
                        $(".cityGraphDayDataDivActive").removeClass("cityGraphDayDataDivActive");
                        mustbeselected.addClass("cityGraphDayDataDivActive");
                        var time=mustbeselected.attr("gastime");
                        var type=mustbeselected.attr("gastype");
                        var value=mustbeselected.attr("gasvalue");
                        $("#cityGraphDateLabelTooltip").children("span").text(time+" "+type+"="+value);
                    }
                });
                $(".cityGraphDayDivButtom").eq(-1).append($("<div style='background-color:#fff;width:8px;display: inline-block;vertical-align: bottom;margin-left:1px;margin-right:1px;'></div>"));
            }else{
                $("#cityPage_Content4_GraphHour").html("");
                $("#cityPage_Content4_GraphDay").html("");
                $("#cityPage_Content4_GraphOuterDivDay").show();
                $("#cityPage_Content4_GraphOuterDivHour").hide();
                id="cityPage_Content4_GraphDay";
                var yestoday="";
                var divEachDay;
                var loginwidth=$("#login").outerWidth();
                $("#"+id).append($("<div style='display:inline-block;height:118px;border-top:1px solid #a7a7a7;border-bottom:1px solid #a7a7a7;width:"+(loginwidth-22)+"px'></div>"));
                var highlest=0;
                $.each(data,function(i,item){
                    var oldData=item;
                    if(oldData[gas]!="-" && oldData[gas]!="—" && oldData[gas]!=""){
                        if(parseFloat(oldData[gas])>highlest){
                            highlest=parseFloat(oldData[gas]);
                        }
                    }
                });
                var perpx=parseFloat((parseFloat(103/highlest)).toFixed(2));
                $.each(data,function(i,item){
                    var oldData=item;
                    var time=oldData.TimePoint;
                    //time=time.replace(/-/g,"/");
                    var timenew=new Date(time);
                    if(yestoday==""){
                        yestoday=oldData.TimePoint;
                        divEachDay=$("<div class='cityGraphDayDiv'><label class='cityGraphDayDivTime'>"+timenew.getFullYear()+"-"+(timenew.getMonth()+1)+"</label><div class='cityGraphDayDivButtom'><div class='cityGraphDayDataDivBlank'></div></div></div>");
                        if(timenew.getHours()<10){
                            divEachDay.children(".cityGraphDayDivTime").css("color","#000");
                        }else{
                            divEachDay.children(".cityGraphDayDivTime").css("color","rgba(0,0,0,0)");
                            divEachDay.children(".cityGraphDayDivTime").css("width","8px");
                        }
                    }
                    var color;
                    if(gas=="AQI"){
                        color=tool.levelColor(tool.levelReturn(gas,oldData[gas])).color;
                    }else{
                        var valuegas=tool.IAQIHourCal(gas.toLowerCase(),oldData[gas]);
                        color=tool.levelColor(tool.levelReturn("AQI",valuegas)).color;
                    }
                    var divheight=0;
                    if(oldData[gas]=="—" || !oldData[gas]){
                        divheight="0";
                    }else{
                        divheight=oldData[gas]*perpx;
                    }
                    var gasdata="—";
                    if(oldData[gas]){
                        gasdata=oldData[gas];
                    }
                    if(!tool.ifSameMonth(yestoday,time)){
                        $("#"+id).append(divEachDay);
                        divEachDay=$("<div class='cityGraphDayDiv'><label class='cityGraphDayDivTime'>"+timenew.getFullYear()+"-"+(timenew.getMonth()+1)+"</label><div class='cityGraphDayDivButtom'><div class='cityGraphDayDataDivBlank'></div></div></div>");
                        divEachDay.children(".cityGraphDayDivButtom").append($("<div class='cityGraphDayDataDiv' id='graphBarZZ"+i+"' graphBarCount='"+i+"' style='background-color:"+color+";width:8px;height:"+divheight+"px' gasvalue='"+gasdata+"' gastype='"+gas+"' gastime='"+tool.cityGraphTooltipTime2(timenew)+"'></div>"));
                        yestoday=time;
                    }else{
                        divEachDay.children(".cityGraphDayDivButtom").append($("<div class='cityGraphDayDataDiv' id='graphBarZZ"+i+"' graphBarCount='"+i+"' style='background-color:"+color+";width:8px;height:"+divheight+"px' gasvalue='"+gasdata+"' gastype='"+gas+"' gastime='"+tool.cityGraphTooltipTime2(timenew)+"'></div>"));
                        yestoday=time;
                    }
                });
                $("#"+id).append(divEachDay);
                $(".cityGraphDayDivButtom").eq(-1).append($("<div style='background-color:#fff;width:8px;display: inline-block;vertical-align: bottom;margin-left:1px;margin-right:1px;'></div>"));

                $(".cityGraphDayDataDivActive").removeClass("cityGraphDayDataDivActive");
                $(".cityGraphDayDataDiv").eq(-1).addClass("cityGraphDayDataDivActive");
                var time=$(".cityGraphDayDataDiv").eq(-1).attr("gastime");
                var type=$(".cityGraphDayDataDiv").eq(-1).attr("gastype");
                var value=$(".cityGraphDayDataDiv").eq(-1).attr("gasvalue");
                $("#cityGraphDateLabelTooltip").children("span").text(time+" "+type+"="+value);
                var outerWidth=$("#login").outerWidth();
                var before = $("#cityPage_Content4_GraphOuterDivDay").scrollLeft();
                var barcount=$(".cityGraphDayDataDiv").length;
                $("#cityPage_Content4_GraphOuterDivDay").bind("scroll",function(){
                    var after = $("#cityPage_Content4_GraphOuterDivDay").scrollLeft();
                    var cha=Math.abs(before-after);
                    if(cha>9.5){
                        if (before<after) {
                            var now=parseInt($(".cityGraphDayDataDivActive").attr("graphBarCount"));
                            if(now!=(barcount-1)){
                                $(".cityGraphDayDataDivActive").removeClass("cityGraphDayDataDivActive");
                                var mustbeselected=$("#graphBarZZ"+(now+1));
                                mustbeselected.addClass("cityGraphDayDataDivActive");
                                var time=mustbeselected.attr("gastime");
                                var type=mustbeselected.attr("gastype");
                                var value=mustbeselected.attr("gasvalue");
                                $("#cityGraphDateLabelTooltip").children("span").text(time+" "+type+"="+value);
                            }
                            before = after;
                        };
                        if (before>after) {
                            var now=parseInt($(".cityGraphDayDataDivActive").attr("graphBarCount"));
                            if(now!=0){
                                $(".cityGraphDayDataDivActive").removeClass("cityGraphDayDataDivActive");
                                var mustbeselected=$("#graphBarZZ"+(now-1));
                                mustbeselected.addClass("cityGraphDayDataDivActive");
                                var time=mustbeselected.attr("gastime");
                                var type=mustbeselected.attr("gastype");
                                var value=mustbeselected.attr("gasvalue");
                                $("#cityGraphDateLabelTooltip").children("span").text(time+" "+type+"="+value);
                            }
                            before = after;
                        };
                    }
                });
                $("#cityPage_Content4_GraphOuterDivDay").on("scrollstop",function(){
                    var mustbeselected=$("#cityPage_Content4_GraphDay .cityGraphDayDataDiv:left(>16):left(<27)");
                    if(mustbeselected.attr("class")=="cityGraphDayDataDiv"){
                        $(".cityGraphDayDataDivActive").removeClass("cityGraphDayDataDivActive");
                        mustbeselected.addClass("cityGraphDayDataDivActive");
                        var time=mustbeselected.attr("gastime");
                        var type=mustbeselected.attr("gastype");
                        var value=mustbeselected.attr("gasvalue");
                        $("#cityGraphDateLabelTooltip").children("span").text(time+" "+type+"="+value);
                    }
                });
                $("#cityPage_Content4_GraphOuterDivDay").scrollLeft(10000);
            }
        }
        /*else if(siteDetailType == "airSiteCountries"){
         var xlabel=new Array();
         var graphdata=new Array();
         var colorList=new Array();
         var id="";
         if(type=="hour"){
         $("#cityPage_Content4_GraphDay").html("");
         $("#cityPage_Content4_GraphHour").html("");
         $("#cityPage_Content4_GraphOuterDivDay").hide();
         $("#cityPage_Content4_GraphOuterDivHour").show();
         id="cityPage_Content4_GraphHour";
         var yestoday="";
         var divEachDay;
         var loginwidth=$("#login").outerWidth();
         var highlest=0;
         $.each(data,function(i,item){
         var oldData=item;
         if(gas='AQI'){
         if(oldData[gas]!="-" && oldData[gas]!="—" && oldData[gas]!=""){
         if(parseFloat(oldData[gas])>highlest){
         highlest=parseFloat(oldData[gas]);
         }
         }
         }else{
         if(oldData[gas]!="-" && oldData[gas]!="—" && oldData[gas]!=""){
         if(parseFloat(oldData[gas])>highlest){
         highlest=parseFloat(oldData[gas]);
         }
         }
         }
         });
         var perpx=parseFloat((parseFloat(103/highlest)).toFixed(2));
         $.each(data,function(i,item){
         var oldData=item;
         var time=oldData.TimePoint;
         var timenew=new Date(time);
         if(yestoday==""){
         yestoday=oldData.TimePoint;
         divEachDay=$("<div class='cityGraphDayDiv'><label class='cityGraphDayDivTime'>"+timenew.getFullYear()+"-"+(timenew.getMonth()+1)+"-"+timenew.getDate()+"</label><div class='cityGraphDayDivButtom'><div class='cityGraphDayDataDivBlank'></div></div></div>");
         if(timenew.getHours()<10){
         divEachDay.children(".cityGraphDayDivTime").css("color","#000");
         }else{
         divEachDay.children(".cityGraphDayDivTime").css("color","rgba(0,0,0,0)");
         divEachDay.children(".cityGraphDayDivTime").css("width","8px");
         }
         }
         var color;
         if(gas=="AQI"){
         color=tool.levelColor(tool.levelReturn(gas,oldData[gas])).color;
         }else{
         var valuegas=tool.IAQIHourCal(gas.toLowerCase(),oldData[gas]);
         color=tool.levelColor(tool.levelReturn("AQI",valuegas)).color;
         }
         var divheight=0;
         if(oldData[gas]=="—" || !oldData[gas]){
         divheight="0";
         }else{
         divheight=oldData[gas]*perpx;
         }
         var gasdata="—";
         if(oldData[gas]){
         gasdata=oldData[gas];
         }
         if(!tool.ifSameDay(yestoday,time)){
         $("#"+id).prepend(divEachDay);
         divEachDay=$("<div class='cityGraphDayDiv'><label class='cityGraphDayDivTime'>"+timenew.getFullYear()+"-"+(timenew.getMonth()+1)+"-"+timenew.getDate()+"</label><div class='cityGraphDayDivButtom'><div class='cityGraphDayDataDivBlank'></div></div></div>");
         divEachDay.children(".cityGraphDayDivButtom").append($("<div class='cityGraphDayDataDiv' id='graphBarZZ"+i+"' graphBarCount='"+i+"' style='background-color:"+color+";width:8px;height:"+divheight+"px' gasvalue='"+gasdata+"' gastype='"+gas+"' gastime='"+tool.cityGraphTooltipTime(timenew)+"'></div>"));
         yestoday=time;
         }else{
         divEachDay.children(".cityGraphDayDivButtom").append($("<div class='cityGraphDayDataDiv' id='graphBarZZ"+i+"' graphBarCount='"+i+"' style='background-color:"+color+";width:8px;height:"+divheight+"px' gasvalue='"+gasdata+"' gastype='"+gas+"' gastime='"+tool.cityGraphTooltipTime(timenew)+"'></div>"));
         yestoday=time;
         }
         });

         $("#"+id).prepend(divEachDay);
         $("#"+id).prepend($("<div style='display:inline-block;height:118px;border-top:1px solid #a7a7a7;border-bottom:1px solid #a7a7a7;width:"+(loginwidth-22)+"px'></div>"));
         $("#cityPage_Content4_GraphOuterDivHour").scrollLeft(10000);
         $(".cityGraphDayDataDivActive").removeClass("cityGraphDayDataDivActive");
         $(".cityGraphDayDataDiv").eq(-1).addClass("cityGraphDayDataDivActive");
         var time=$(".cityGraphDayDataDiv").eq(-1).attr("gastime");
         var type=$(".cityGraphDayDataDiv").eq(-1).attr("gastype");
         var value=$(".cityGraphDayDataDiv").eq(-1).attr("gasvalue");
         $("#cityGraphDateLabelTooltip").children("span").text(time+" "+type+"="+value);

         var outerWidth=$("#login").outerWidth();
         var before = $("#cityPage_Content4_GraphOuterDivHour").scrollLeft();
         var barcount=$(".cityGraphDayDataDiv").length;
         $("#cityPage_Content4_GraphOuterDivHour").bind("scroll",function(){
         var after = $("#cityPage_Content4_GraphOuterDivHour").scrollLeft();
         var cha=Math.abs(before-after);
         if(cha>9.5){
         if (before<after) {
         var now=parseInt($(".cityGraphDayDataDivActive").attr("graphBarCount"));
         if(now!=(barcount-1)){
         $(".cityGraphDayDataDivActive").removeClass("cityGraphDayDataDivActive");
         var mustbeselected=$("#graphBarZZ"+(now+1));
         mustbeselected.addClass("cityGraphDayDataDivActive");
         var time=mustbeselected.attr("gastime");
         var type=mustbeselected.attr("gastype");
         var value=mustbeselected.attr("gasvalue");
         $("#cityGraphDateLabelTooltip").children("span").text(time+" "+type+"="+value);
         }
         before = after;
         };
         if (before>after) {
         var now=parseInt($(".cityGraphDayDataDivActive").attr("graphBarCount"));
         if(now!=0){
         $(".cityGraphDayDataDivActive").removeClass("cityGraphDayDataDivActive");
         var mustbeselected=$("#graphBarZZ"+(now-1));
         mustbeselected.addClass("cityGraphDayDataDivActive");
         var time=mustbeselected.attr("gastime");
         var type=mustbeselected.attr("gastype");
         var value=mustbeselected.attr("gasvalue");
         $("#cityGraphDateLabelTooltip").children("span").text(time+" "+type+"="+value);
         }
         before = after;
         };
         }
         });
         $("#cityPage_Content4_GraphOuterDivHour").on("scrollstop",function(){
         var mustbeselected=$("#cityPage_Content4_GraphHour .cityGraphDayDataDiv:left(>16):left(<27)");
         if(mustbeselected.attr("class")=="cityGraphDayDataDiv"){
         $(".cityGraphDayDataDivActive").removeClass("cityGraphDayDataDivActive");
         mustbeselected.addClass("cityGraphDayDataDivActive");
         var time=mustbeselected.attr("gastime");
         var type=mustbeselected.attr("gastype");
         var value=mustbeselected.attr("gasvalue");
         $("#cityGraphDateLabelTooltip").children("span").text(time+" "+type+"="+value);
         }
         });
         $(".cityGraphDayDivButtom").eq(-1).append($("<div style='background-color:#fff;width:8px;display: inline-block;vertical-align: bottom;margin-left:1px;margin-right:1px;'></div>"));
         }else{
         $("#cityPage_Content4_GraphHour").html("");
         $("#cityPage_Content4_GraphDay").html("");
         $("#cityPage_Content4_GraphOuterDivDay").show();
         $("#cityPage_Content4_GraphOuterDivHour").hide();
         id="cityPage_Content4_GraphDay";
         var yestoday="";
         var divEachDay;
         var loginwidth=$("#login").outerWidth();
         var highlest=0;
         $.each(data,function(i,item){
         var oldData=item;
         if(oldData[gas]!="-" && oldData[gas]!="—" && oldData[gas]!=""){
         if(parseFloat(oldData[gas])>highlest){
         highlest=parseFloat(oldData[gas]);
         }
         }
         });
         var perpx=parseFloat((parseFloat(103/highlest)).toFixed(2));
         $.each(data,function(i,item){
         var oldData=item;
         var time=oldData.TimePoint;
         var timenew=new Date(time);
         if(yestoday==""){
         yestoday=oldData.TimePoint;
         divEachDay=$("<div class='cityGraphDayDiv'><label class='cityGraphDayDivTime'>"+timenew.getFullYear()+"-"+(timenew.getMonth()+1)+"</label><div class='cityGraphDayDivButtom'><div class='cityGraphDayDataDivBlank'></div></div></div>");
         if(timenew.getHours()<10){
         divEachDay.children(".cityGraphDayDivTime").css("color","#000");
         }else{
         divEachDay.children(".cityGraphDayDivTime").css("color","rgba(0,0,0,0)");
         divEachDay.children(".cityGraphDayDivTime").css("width","8px");
         }
         }
         var color;
         if(gas=="AQI"){
         color=tool.levelColor(tool.levelReturn(gas,oldData[gas])).color;
         }else{
         var valuegas=tool.IAQIHourCal(gas.toLowerCase(),oldData[gas]);
         color=tool.levelColor(tool.levelReturn("AQI",valuegas)).color;
         }
         var divheight=0;
         if(oldData[gas]=="—" || !oldData[gas]){
         divheight="0";
         }else{
         divheight=oldData[gas]*perpx;
         }
         var gasdata="—";
         if(oldData[gas]){
         gasdata=oldData[gas];
         }
         if(!tool.ifSameMonth(yestoday,time)){
         $("#"+id).append(divEachDay);
         divEachDay=$("<div class='cityGraphDayDiv'><label class='cityGraphDayDivTime'>"+timenew.getFullYear()+"-"+(timenew.getMonth()+1)+"</label><div class='cityGraphDayDivButtom'><div class='cityGraphDayDataDivBlank'></div></div></div>");
         divEachDay.children(".cityGraphDayDivButtom").append($("<div class='cityGraphDayDataDiv' id='graphBarZZ"+i+"' graphBarCount='"+i+"' style='background-color:"+color+";width:8px;height:"+divheight+"px' gasvalue='"+gasdata+"' gastype='"+gas+"' gastime='"+tool.cityGraphTooltipTime2(timenew)+"'></div>"));
         yestoday=time;
         }else{
         divEachDay.children(".cityGraphDayDivButtom").append($("<div class='cityGraphDayDataDiv' id='graphBarZZ"+i+"' graphBarCount='"+i+"' style='background-color:"+color+";width:8px;height:"+divheight+"px' gasvalue='"+gasdata+"' gastype='"+gas+"' gastime='"+tool.cityGraphTooltipTime2(timenew)+"'></div>"));
         yestoday=time;
         }
         });
         $("#"+id).prepend(divEachDay);
         $(".cityGraphDayDivButtom").eq(-1).append($("<div style='background-color:#fff;width:8px;display: inline-block;vertical-align: bottom;margin-left:1px;margin-right:1px;'></div>"));
         $(".cityGraphDayDataDivActive").removeClass("cityGraphDayDataDivActive");
         $(".cityGraphDayDataDiv").eq(-1).addClass("cityGraphDayDataDivActive");
         var time=$(".cityGraphDayDataDiv").eq(-1).attr("gastime");
         var type=$(".cityGraphDayDataDiv").eq(-1).attr("gastype");
         var value=$(".cityGraphDayDataDiv").eq(-1).attr("gasvalue");
         $("#cityGraphDateLabelTooltip").children("span").text(time+" "+type+"="+value);
         var outerWidth=$("#login").outerWidth();
         var before = $("#cityPage_Content4_GraphOuterDivDay").scrollLeft();
         var barcount=$(".cityGraphDayDataDiv").length;
         $("#cityPage_Content4_GraphOuterDivDay").bind("scroll",function(){
         var after = $("#cityPage_Content4_GraphOuterDivDay").scrollLeft();
         var cha=Math.abs(before-after);
         if(cha>9.5){
         if (before<after) {
         var now=parseInt($(".cityGraphDayDataDivActive").attr("graphBarCount"));
         if(now!=(barcount-1)){
         $(".cityGraphDayDataDivActive").removeClass("cityGraphDayDataDivActive");
         var mustbeselected=$("#graphBarZZ"+(now+1));
         mustbeselected.addClass("cityGraphDayDataDivActive");
         var time=mustbeselected.attr("gastime");
         var type=mustbeselected.attr("gastype");
         var value=mustbeselected.attr("gasvalue");
         $("#cityGraphDateLabelTooltip").children("span").text(time+" "+type+"="+value);
         }
         before = after;
         };
         if (before>after) {
         var now=parseInt($(".cityGraphDayDataDivActive").attr("graphBarCount"));
         if(now!=0){
         $(".cityGraphDayDataDivActive").removeClass("cityGraphDayDataDivActive");
         var mustbeselected=$("#graphBarZZ"+(now-1));
         mustbeselected.addClass("cityGraphDayDataDivActive");
         var time=mustbeselected.attr("gastime");
         var type=mustbeselected.attr("gastype");
         var value=mustbeselected.attr("gasvalue");
         $("#cityGraphDateLabelTooltip").children("span").text(time+" "+type+"="+value);
         }
         before = after;
         };
         }
         });
         $("#cityPage_Content4_GraphOuterDivDay").on("scrollstop",function(){
         var mustbeselected=$("#cityPage_Content4_GraphDay .cityGraphDayDataDiv:left(>16):left(<27)");
         if(mustbeselected.attr("class")=="cityGraphDayDataDiv"){
         $(".cityGraphDayDataDivActive").removeClass("cityGraphDayDataDivActive");
         mustbeselected.addClass("cityGraphDayDataDivActive");
         var time=mustbeselected.attr("gastime");
         var type=mustbeselected.attr("gastype");
         var value=mustbeselected.attr("gasvalue");
         $("#cityGraphDateLabelTooltip").children("span").text(time+" "+type+"="+value);
         }
         });
         $("#"+id).prepend($("<div style='display:inline-block;height:118px;border-top:1px solid #a7a7a7;border-bottom:1px solid #a7a7a7;width:"+(loginwidth-22)+"px'></div>"));
         $("#cityPage_Content4_GraphOuterDivDay").scrollLeft(10000);
         }
         }*/
    },
//    城市_站点
    indexCityPage_StationInit:function(citycode,stationcode){
        $("#cityPage_stationBackToCity").unbind().click(function(){
            $.mobile.changePage("#cityPage?citycode="+citycode,{transition:"slide",reverse:"true"});
        });
        $("#ajaxPleaseWait").show();
        $.ajax({
            type:"post",
            url:provinceAjax+"/publish/getCityInfoCForApp",
            dataType:'json',
            async:true,
            data:{"cityCode":citycode},
            error:function(){$("#ajaxPleaseWait").hide();
                tool.warningAlert("warAFailed","获取地图信息失败");
            },
            complete:function(XMLHttpRequest){
                $("#ajaxPleaseWait").hide();
                var data=eval("("+XMLHttpRequest.responseText+")");
                var mapdata=data.columns.STATIONREALTIMEAQI.data;
                $("#cityGasTable").html("");
                $.each(mapdata,function(i,item){
                    if(item.columns.STATIONCODE==stationcode){
                        $("#cityPage_stationTitle").text(item.columns.STATIONNAME);
                        $("#cityPageStationAQIValue").text(item.columns.AQI);
                        var level=tool.levelReturn("AQI",item.columns.AQI);
                        $.each(levelColor,function(j,itemj){
                            if(itemj.level==level){
                                $("#cityPageStationLevel").text(itemj.type);
                                $("#cityPageStationLevel").css("background-color",itemj.color)
                            }
                        });
                        $("#cityPageStation_Content2ItemSO2").text(item.columns.SO2);
                        $("#cityPageStation_Content2ItemNO2").text(item.columns.NO2);
                        $("#cityPageStation_Content2ItemCO").text(item.columns.CO);
                        $("#cityPageStation_Content2ItemO3").text(item.columns.O3);
                        $("#cityPageStation_Content2ItemPM2_5").text(item.columns.PM2_5);
                        $("#cityPageStation_Content2ItemPM10").text(item.columns.PM10);


                        var backColor=tool.levelColorBack(tool.levelReturn("AQI",item.columns.ISO2));
                        var color=tool.levelColor(tool.levelReturn("AQI",item.columns.ISO2)).color;
                        $("#cityPageStation_Content2ItemSO2BarBack").css("background-color",backColor);
                        $("#cityPageStation_Content2ItemSO2Bar").css("background-color",color);

                        var backColor=tool.levelColorBack(tool.levelReturn("AQI",item.columns.INO2));
                        var color=tool.levelColor(tool.levelReturn("AQI",item.columns.INO2)).color;
                        $("#cityPageStation_Content2ItemNO2BarBack").css("background-color",backColor);
                        $("#cityPageStation_Content2ItemNO2Bar").css("background-color",color);

                        var backColor=tool.levelColorBack(tool.levelReturn("AQI",item.columns.ICO));
                        var color=tool.levelColor(tool.levelReturn("AQI",item.columns.ICO)).color;
                        $("#cityPageStation_Content2ItemCOBarBack").css("background-color",backColor);
                        $("#cityPageStation_Content2ItemCOBar").css("background-color",color);

                        var backColor=tool.levelColorBack(tool.levelReturn("AQI",item.columns.IO3));
                        var color=tool.levelColor(tool.levelReturn("AQI",item.columns.IO3)).color;
                        $("#cityPageStation_Content2ItemO3BarBack").css("background-color",backColor);
                        $("#cityPageStation_Content2ItemO3Bar").css("background-color",color);

                        var backColor=tool.levelColorBack(tool.levelReturn("AQI",item.columns.IPM2_5));
                        var color=tool.levelColor(tool.levelReturn("AQI",item.columns.IPM2_5)).color;
                        $("#cityPageStation_Content2ItemPM2_5BarBack").css("background-color",backColor);
                        $("#cityPageStation_Content2ItemPM2_5Bar").css("background-color",color);

                        var backColor=tool.levelColorBack(tool.levelReturn("AQI",item.columns.IPM10));
                        var color=tool.levelColor(tool.levelReturn("AQI",item.columns.IPM10)).color;
                        $("#cityPageStation_Content2ItemPM10BarBack").css("background-color",backColor);
                        $("#cityPageStation_Content2ItemPM10Bar").css("background-color",color);

                        $("#cityStationGasChangeBar").children("div").unbind().click(function(){
                            var gas=$(this).attr("gas");
                            $(".cityStationGasTableActive").removeClass("cityStationGasTableActive");
                            $(this).addClass("cityStationGasTableActive");
                            var type=$(".cityStationPage_Content3ButtonActive").attr("datatype");
                            if(type=="hour"){
                                $("#ajaxPleaseWait").show();
                                $.ajax({
                                    type:"GET",
                                    url:provinceAjax+"/publish/getStationOneMonthRealTimeAQIForApp",
                                    dataType:'json',
                                    async:true,
                                    data:{"stationCode":stationcode},
                                    error:function(){$("#ajaxPleaseWait").hide();
                                        tool.warningAlert("warAFailed","获取信息失败");
                                    },
                                    complete:function(XMLHttpRequest){
                                        $("#ajaxPleaseWait").hide();
                                        var data=eval("("+XMLHttpRequest.responseText+")");
                                        menuFunction.createCityStationHourAndDayGraph(type,data,gas);
                                    }
                                });
                            }else if(type=="day"){
                                $("#ajaxPleaseWait").show();
                                $.ajax({
                                    type:"GET",
                                    url:provinceAjax+"/publish/getStation365DayAQIForApp",
                                    dataType:'json',
                                    async:true,
                                    data:{"stationCode":stationcode},
                                    error:function(){$("#ajaxPleaseWait").hide();
                                        tool.warningAlert("warAFailed","获取信息失败");
                                    },
                                    complete:function(XMLHttpRequest){
                                        $("#ajaxPleaseWait").hide();
                                        var data=eval("("+XMLHttpRequest.responseText+")");
                                        menuFunction.createCityStationHourAndDayGraph(type,data,gas);
                                    }
                                });
                            }
                        });

                        $(".cityPageStation_Content3Button").unbind().click(function(){
                            $(".cityStationPage_Content3ButtonActive").removeClass("cityStationPage_Content3ButtonActive");
                            $(this).addClass("cityStationPage_Content3ButtonActive");
                            $(".cityStationGasTableActive").click();
                        });
                        $(".cityPageStation_Content3Button").eq(0).click();

                    }
                });
            }
        });
    },
//    站点绘图
    createCityStationHourAndDayGraph:function(type,data,gas){
        var gasUp=gas.toUpperCase();
        var xlabel=new Array();
        var graphdata=new Array();
        var colorList=new Array();
        var id="";
        if(type=="hour"){
            $.each(data,function(i,item){
                var oldData=item;
                var hourtime=new Date(oldData.timePoint);
                hourtime=hourtime.getFullYear()+"/"+(hourtime.getMonth()+1)+"/"+hourtime.getDate()+" "+hourtime.getHours()+":00";
                xlabel.push(hourtime);
                var datavalue="";
                if(oldData.data.columns[gasUp]){
                    datavalue=oldData.data.columns[gasUp];
                }else{
                    datavalue="-";
                }
                graphdata.push(datavalue);
                if(gas=="aqi"){
                    var color=tool.levelColor(tool.levelReturn(gasUp,datavalue)).color;
                    colorList.push(color);
                }else{
                    var valuegas=tool.IAQIHourCal(gas,datavalue);
                    var color=tool.levelColor(tool.levelReturn("AQI",valuegas)).color;
                    colorList.push(color);
                }
            });
            id="cityPageStation_Content3_GraphHour";
            $("#cityPageStation_Content3_GraphOuterDivDay").hide();
            $("#cityPageStation_Content3_GraphOuterDivHour").show();
            $("#cityPageStation_Content3_GraphHour").css("width","3500px");
        }else{
            $.each(data,function(i,item){
                var oldData=item;
                var time=new Date(oldData.TIMEPOINT);
                xlabel.push(time.getFullYear()+"/"+time.getMonth()+"/"+time.getDate());
                graphdata.push(oldData.AQI);
                var color=tool.levelColor(tool.levelReturn("AQI",oldData.AQI)).color;
                colorList.push(color);
            });
            id="cityPageStation_Content3_GraphDay";
            $("#cityPageStation_Content3_GraphOuterDivDay").show();
            $("#cityPageStation_Content3_GraphOuterDivHour").hide();
            $("#cityPageStation_Content3_GraphDay").css("width","3500px");
        }

        var myChart = echarts.init(document.getElementById(id));
        myChart.setOption({
            backgroundColor:"#fff",
            grid:{
                x:0,
                y:0,
                x2:0,
                y2:0
            },
            tooltip : {
                trigger:'axis'
            },
            toolbox: {
                show : false
            },
            calculable : false,
            legend: {
                show:false,
                data:[gasUp]
            },
            xAxis : [
                {
                    type : 'category',
                    data : xlabel
                }
            ],
            yAxis : [
                {
                    type : 'value',
                    show:false
                }
            ],
            series :[
                {
                    name:gasUp,
                    type:'bar',
                    itemStyle: {
                        normal: {
                            color: function(params) {
                                return colorList[params.dataIndex]
                            }
                        }
                    },
                    data:graphdata
                }
            ]
        });

        $("#cityPageStation_Content3_GraphOuterDivHour").scrollLeft(3500);
        $("#cityPageStation_Content3_GraphOuterDivDay").scrollLeft(3500);
    },
    // 审核
    auditPage_init:function(){
        var time=new Date((new Date()).setDate((new Date()).getDate()-1));
        time=time.getFullYear()+"-"+(time.getMonth()+1)+"-"+time.getDate();
        $("#auditPage_Content").html("");$("#ajaxPleaseWait").show();
        $.ajax({
            type:"GET",
            url:provinceAjax+"/publish/getAllCityRealTimeAQIC",
            dataType:'json',
            async:true,
            data:{},
            error:function(){$("#ajaxPleaseWait").hide();
                tool.warningAlert("warAFailed","获取信息失败");
            },
            complete:function(XMLHttpRequest){
                $("#ajaxPleaseWait").hide();
                var data=eval("("+XMLHttpRequest.responseText+")");
                $("#auditPage_Content").append($("<div class='auditPageTimeTitle'><i class='iconNew-alertMessage' style='margin-right: 3px;'></i>"+tool.publishNotAuditTime(new Date(data.timePoint))+"(实时数据,尚未审核)</div>"));
                var statdata=data.data;
                $.each(statdata,function(i,item){
                    if(!item.columns.INDEX_MARK){
                        item.columns.AQI="—";
                    }
                    var cityname=item.columns.CITYNAME;

                    var div=$("<div class='auditPageContentItem' citycode='"+item.columns.CITYCODE+"' cityname='"+cityname+"'></div>");
                    var title=$("<div class='auditPageContentTitle'><i class='iconNew-listcity'></i><span>"+cityname+"</span><span class='auditPageWeatherDetailLast'><span class='numberFontFamily'></span></span><span class='auditPageWeatherDetail'><i class='iconNew-WD'></i><span></span></span><span class='auditPageWeatherDetailFirst'><i class='iconNew-weather'></i><span></span></span></div>");
                    var color=tool.levelColor(tool.levelReturn("AQI",item.columns.AQI)).color;
                    var levelvalue=tool.levelReturn("AQI",item.columns.AQI);
                    var level="";
                    $.each(levelColor,function(j,itemj){
                        if(itemj.level==levelvalue){
                            level=itemj.type;
                        }
                    });

                    var pullu="无";
                    if(item.columns.AQI>50){
                        pullu=item.columns.PRIMARYPOLLUTANT;
                    }
                    if(!item.columns.INDEX_MARK){
                        pullu="—";
                        level="—";
                    }
                    var aqi=$("<div class='auditPageContentAqi'><div class='auditPageContentAqiLabel numberFontFamily' style='color:"+color+"'>"+item.columns.AQI+"</div><div class='auditPageContentAqiTitle'>AQI</div><div class='auditPageContentLevel' style='background-color:"+color+"'>"+level+"</div><label class='auditPageContentLabel'>详情></label></div>");
                    var pull=$("<div class='auditPageContentPull'><div class='auditPageContentPullDetail'>首要污染物:"+pullu+"</div></div>");
//                                var audit=$("<div class='auditPageContentDetail'></div>");
                    div.append(title);
                    div.append(aqi);
                    div.append(pull);
//                                div.append(audit);
                    $("#auditPage_Content").append(div);

                });
                $(".auditPageContentItem").unbind().click(function(){
                    var citycode=$(this).attr("citycode");
                    $.mobile.changePage("#cityPage?citycode="+citycode,{transition:"slide"});
                });

                $(".auditPageContentItem").each(function(){
                    var itscityname=$(this).attr("cityname");
                    var citydiv=$(this);
                    $.ajax({
                        type:"GET",
                        url:"http://apis.baidu.com/heweather/weather/free",
                        data:{"city":itscityname},
                        async:true,
                        beforeSend: function(request) {
                            request.setRequestHeader("apikey","8e4564716de8beca94cb4fe23cf31cab");
                        },
                        complete:function(XMLHttpRequest){
                            var dataTemp=eval("("+XMLHttpRequest.responseText+")");
                            $.each(dataTemp,function(rr,temprr){
                                var dataTempEach=temprr[0].daily_forecast[0];
                                citydiv.find(".auditPageWeatherDetailLast").children("span").text(dataTempEach.tmp.min+"-"+dataTempEach.tmp.max+"℃");
                                citydiv.find(".auditPageWeatherDetail").children("span").text(dataTempEach.wind.dir);
                                citydiv.find(".auditPageWeatherDetailFirst").children("span").text(dataTempEach.cond.txt_d);
                            });
                            if(dataTemp.errMsg=="success"){
                            }
                        }
                    });
                });
            }
        });
        $("#auditPageRefresh").unbind().click(function(){
            menuFunction.auditPage_init();
        });
    },
//    外部预报
    forePubPage_init:function(){
        var today=new Date();
        var tomorrow=new Date((new Date()).setDate((new Date()).getDate()+1));
        var aftTomorrow=new Date((new Date()).setDate((new Date()).getDate()+2));
        var fourow = new Date((new Date()).setDate((new Date()).getDate()+3));
        var fiverow = new Date((new Date()).setDate((new Date()).getDate()+4));

        var todayDate=(today.getMonth()+1)+"月"+today.getDate()+"日";
        var tomororrowDate=(tomorrow.getMonth()+1)+"月"+tomorrow.getDate()+"日";
        var aftTomorrowDate=(aftTomorrow.getMonth()+1)+"月"+aftTomorrow.getDate()+"日";
        var fourDate = (fourow.getMonth()+1)+"月"+fourow.getDate()+"日";
        var fiveDate = (fiverow.getMonth()+1)+"月"+fiverow.getDate()+"日";

        $("#forePubTimeChooseBar").children("div").eq(0).text(todayDate);
        $("#forePubTimeChooseBar").children("div").eq(1).text(tomororrowDate);
        $("#forePubTimeChooseBar").children("div").eq(2).text(aftTomorrowDate);
        $("#forePubTimeChooseBar").children("div").eq(3).text(fourDate);
        $("#forePubTimeChooseBar").children("div").eq(4).text(fiveDate);

        mapForecast = new BMap.Map("forePubPageMap");
        var pointIndex = new BMap.Point(104.76,29.54);
        mapForecast.centerAndZoom(pointIndex,7);
        mapForecast.disableDragging();
        mapForecast.disablePinchToZoom();
        mapForecast.disableDoubleClickZoom();

        mapForecast.setMapStyle({
            styleJson:[
                {
                    "featureType": "roadName",
                    "elementType": "all",
                    "style":"light"
                }
            ]
        });
        var tablebodyheight=$("#login").outerHeight()-$("#forePubPage").children("div[data-role='header']").outerHeight()-300-$("#forePubTimeChooseBar").outerHeight()-$("#forePubPage").find(".footerMenuUl").outerHeight()-$("#forePubPageTableHead").outerHeight();
        $("#forePubPageTableBody").css("height",tablebodyheight+"px");
        var d = new Date();
        if (d.getHours() <= 16) {
            d.setDate(d.getDate() - 1);
        }
        d.setHours(0);
        d.setMinutes(0);
        d.setSeconds(0);
        d.setMilliseconds(0);
        $("#ajaxPleaseWait").show();
        $.ajax({
            type:"GET",
            url:provinceAjax+"/smartadmin/forecast/getCityAuditResult",
            dataType:'json',
            async:true,
            data:{"timePoint": d.getTime()},
            error:function(){$("#ajaxPleaseWait").hide();
                tool.warningAlert("warAFailed","获取城市信息失败");
            },
            complete:function(XMLHttpRequest){
                var data=eval("("+XMLHttpRequest.responseText+")");
                $("#forePubPageTableBody").data("forecastData",data.data.forecast);

                $("#forePubTimeChooseBar").children("div").unbind().click(function(){
                    $(".forePubTimeChooseActive").removeClass("forePubTimeChooseActive");
                    $(this).addClass("forePubTimeChooseActive");
                    menuFunction.createCityForecastPubTable($(this).attr("dataType"));
                    menuFunction.forecastPubMapPoint($(this).attr("dataType"));
                });
                $("#forePubTimeChooseBar").children("div").eq(0).click();

                var timeArea=new Date();
                timeArea.setDate(timeArea.getDate()-1);
                timeArea.setHours(0);
                timeArea.setMinutes(0);
                timeArea.setSeconds(0);
                timeArea.setMilliseconds(0);
                timeArea=timeArea.getTime();
                $.getJSON(provinceAjax+"/smartadmin/forecast/showData",{"timePoint":timeArea},function(data){
                    $("#ajaxPleaseWait").hide();
                    if(data.result){
                        if(null!==data.data){
                            var content=(data.data.TRENDFORECAST).replace(/\n/g,"<br/>");
                            $("#forecastPubAreaDivContentBody").html(content);
                        }else{
                            $("#forecastPubAreaDivContentBody").html("本日暂无预报");
                        }
                    }
                    $("#forecastPageAreaButton").unbind().click(function(){
                        $("#forecastPubAreaDiv").show();
                        var marginTop=($("#login").outerHeight()-$("#forecastPubAreaDivContent").outerHeight())/2;
                        $("#forecastPubAreaDivContent").css("margin-top",marginTop);
                        $("#forecastPubAreaDivBack").unbind().click(function(){
                            $("#forecastPubAreaDiv").hide();
                        });
                        $("#forecastPubAreaDivContentHeadCloseButton").unbind().click(function(){
                            $("#forecastPubAreaDiv").hide();
                        });
                    });
                });
            }
        });
    },
//    外部预报数据
    createCityForecastPubTable: function (dataType) {
        dataType=parseInt(dataType);
        var data=$("#forePubPageTableBody").data("forecastData");
        $("#forePubPageTableBody").html("");
        $.each(data, function (i, item) {
            var name = item.CITYNAME;
            //console.log(item.PM2_5);

            item.PM2_5 = item.PM2_5 == null ? "—" : item.PM2_5;
            item.AQI = item.AQI == null ? "—" : item.AQI;
            item.QUALITY = item.QUALITY == null ? "—" : item.QUALITY;
            item.PRIMARYPOLLUTANT = item.PRIMARYPOLLUTANT == null ? "—" : item.PRIMARYPOLLUTANT;

            var PM2_5 = item.PM2_5_REAL.split("|")[dataType];
            var AQI = item.AQI.split("|")[dataType];
            var QUALITY = item.QUALITY.split("|")[dataType];
            var PRIMARYPOLLUTANT = item.PRIMARYPOLLUTANT.split("|")[dataType];
            //console.log(PRIMARYPOLLUTANT);
            QUALITY = QUALITY.replace(/优/g, "<span style='color:#6FC547'>优</span>").replace(/良/g, "<span style='color:#fdc61e'>良</span>")
                .replace(/轻度污染/g, "<span style='color:#FF7E00'>轻度污染</span>").replace(/中度污染/g, "<span style='color:#FF0000'>中度污染</span>")
                .replace(/重度污染/g, "<span style='color:#99004C'>重度污染</span>").replace(/严重污染/g, "<span style='color:#7E0023'>严重污染</span>");

            PRIMARYPOLLUTANT = PRIMARYPOLLUTANT.replace(/细颗粒物\(PM2.5\)/g, "<span style='color:#545454'>细颗粒物(PM2.5)</span>").replace(/臭氧8小时/g, "<span style='color:#545454'>臭氧8小时</span>")
                .replace(/二氧化硫/g, "<span style='color:#545454'>二氧化硫</span>").replace(/二氧化氮/g, "<span style='color:#545454'>二氧化氮</span>")
                .replace(/颗粒物\(PM10\)/g, "<span style='color:#545454'>颗粒物(PM10)</span>")
                .replace(/一氧化碳/g, "<span style='color:#545454'>一氧化碳</span>").replace(/无/g, "<span style='color:#545454'>无</span>");
            var divEach = $("<li class='forePubTableBodyTr'></li>");
            var td1 = $("<div>" + name.replace(/市/,"") + "</div>");
            var td3 = $("<div>" + AQI + "</div>");
            var td4 = $("<div>" + QUALITY + "</div>");
            var td5 = $("<div>" + PRIMARYPOLLUTANT + "</div>");

            divEach.append(td1);
            divEach.append(td3);
            divEach.append(td4);
            divEach.append(td5);
            $("#forePubPageTableBody").append(divEach);
        });
        var contentDiv=$("#forePubPageTableBody");
        var scorll=setInterval(function(){
            $(".forePubTableBodyTr").eq(0).stop().animate(
                {
                    height : "0px",
                    opacity:"0"
                },"slow",function(){
                    $(this).appendTo(contentDiv);
                    $(this).removeAttr("style");
                }
            );
        },1300);

        contentDiv.bind("touchend",function(){
            scorll=setInterval(function(){
                $(".tableContentItem").eq(0).stop().animate(
                    {
                        "padding":"0",
                        "height" : "0",
                        "opacity" : "0"
                    },"slow",function(){
                        $(this).appendTo(contentDiv);
                        $(this).removeAttr("style");
                    }
                );
            },1300);
        });
    },
    forecastPubMapPoint:function(dataType){
        mapForecast.clearOverlays();
        dataType=parseInt(dataType);
        var data=$("#forePubPageTableBody").data("forecastData");
        $.each(data,function(i,item){
            $.each(cityMapDetail,function(j,itemj){
                if(itemj.cityCode==item.CITYCODE){
                    var itemEach={};
                    itemEach.CITYCODE=item.CITYCODE;
                    itemEach.CITYNAME=item.CITYNAME;
                    itemEach.POINT=itemj.point;
                    var quality=item.QUALITY.split("|")[dataType];
                    if(quality.search("至")!=-1){
                        quality=quality.split("至");
                        itemEach.COLOR1=(tool.levelColorBack(quality[0])).replace(/color:/,"");
                        itemEach.COLOR2=(tool.levelColorBack(quality[1])).replace(/color:/,"");
                    }else if(quality.search("或")!=-1){
                        quality=quality.split("或");
                        itemEach.COLOR1=(tool.levelColorBack(quality[0])).replace(/color:/,"");
                        itemEach.COLOR2=(tool.levelColorBack(quality[1])).replace(/color:/,"");
                    }else{
                        itemEach.COLOR1=(tool.levelColorBack(quality)).replace(/color:/,"");
                        itemEach.COLOR2=(tool.levelColorBack(quality)).replace(/color:/,"");
                    }
                    tool.mapForePubAddMark(mapForecast,itemEach);
                }
            });
        });
    },
    cityRankPage_init:function(){
        $("#cityRankPageRefresh").unbind().click(function(){
            menuFunction.cityRankPage_init();
        });
        $("#cityRankMarkBar").children("div").unbind().click(function(){
            $(".cityRankMarkBarActive").removeClass("cityRankMarkBarActive");
            $(this).addClass("cityRankMarkBarActive");
            var type=$(this).attr("datatype");
            switch(type){
                case "real":
                    menuFunction.cityRankRealTable();
                    break;
                case "day":
                    menuFunction.cityRankDayTable();
                    break;
                case "month":
                    menuFunction.cityRankMonthTable();
                    break;
            }
        });
        $("#cityRankMarkBar").children("div").eq(0).click();
    },
    cityRankRealTable:function(){
        $("#ajaxPleaseWait").show();
        $.ajax({
            type: "GET",
            url: provinceAjax + "/publish/getAllCityRealTimeAQIASC",
            dataType: 'json',
            async: true,
            data: {},
            error: function () {
                tool.warningAlert("warAFailed", "获取城市信息失败");
            },
            complete: function (XMLHttpRequest) {
                $("#ajaxPleaseWait").hide();
                var data = eval("(" + XMLHttpRequest.responseText + ")");
                $("#cityRank_ContentTime").html("<i class='iconNew-alertMessage' style='margin-right: 3px;'></i>"+tool.publishNotAuditTime(globalTime)+"(实时数据,尚未审核)");
                $("#cityRank_ContentTable").html("");
                $.each(data.data,function(i,item){
                    var dataeach=item.columns;
                    var div=$("<div class='cityRankTableTr' citycode='"+dataeach.CITYCODE+"'></div>");
                    if(i+1>=10){
                        var td1=$("<div class='cityRankTableTrNo numberFontFamily' style='padding-left:6px!important'>"+(i+1)+"</div>");
                        var td2=$("<div class='cityRankTableTrName' style='float:right;margin-right:4px'>"+dataeach.CITYNAME+"</div>");
                    }else{
                        var td1=$("<div class='cityRankTableTrNo numberFontFamily'>"+(i+1)+"</div>");
                        var td2=$("<div class='cityRankTableTrName' style='float:right'>"+dataeach.CITYNAME+"</div>");
                    }
                    var level=tool.levelReturn("AQI",dataeach.AQI);
                    var color=tool.levelColor(level).color;
                    var td3=$("<div class='cityRankTableTrValue numberFontFamily' style='float:right;color:"+color+"'>"+dataeach.AQI+"</div>");
                    var levelname="离线";
                    switch(level){
                        case "1":
                            levelname="优";
                            break;
                        case "2":
                            levelname="良";
                            break;
                        case "3":
                            levelname="轻度污染";
                            break;
                        case "4":
                            levelname="中度污染";
                            break;
                        case "5":
                            levelname="重度污染";
                            break;
                        case "6":
                            levelname="严重污染";
                            break;
                    }
                    var td4=$("<div class='cityRankTableTrLevel' style='float:right'><label style='background-color:"+color+"'>"+levelname+"</label></div>");
                    var td5=$("<div class='cityRankTableTrDetail' style='float:right'>详情></div>");
                    div.append(td1);
                    div.append(td5);
                    div.append(td4);
                    div.append(td3);
                    div.append(td2);
                    $("#cityRank_ContentTable").append(div);
                });
                $(".cityRankTableTr").unbind().click(function(){
                    var citycode=$(this).attr("citycode");
                    $.mobile.changePage("#cityPage?citycode="+citycode,{transition:"slide"});
                });
            }
        });
    },
    cityRankDayTable:function(){
        $("#ajaxPleaseWait").show();
        $.ajax({
            type: "GET",
            url: provinceAjax + "/publish/getAllCity24HoursAQIAVG",
            dataType: 'json',
            async: true,
            data: {},
            error: function () {
                tool.warningAlert("warAFailed", "获取城市信息失败");
            },
            complete: function (XMLHttpRequest) {
                $("#ajaxPleaseWait").hide();
                var data = eval("(" + XMLHttpRequest.responseText + ")");
                $("#cityRank_ContentTime").html("<i class='iconNew-alertMessage' style='margin-right: 3px;'></i>数据更新时间:"+data[0].TIMEPOINT+"(实时数据,尚未审核)");
                $("#cityRank_ContentTable").html("");
                $.each(data,function(i,item){
                    var dataeach=item;
                    var div=$("<div class='cityRankTableTr' citycode='"+dataeach.CITYCODE+"'></div>");
                    var td1=$("<div class='cityRankTableTrNo numberFontFamily'>"+(i+1)+"</div>");
                    var td2=$("<div class='cityRankTableTrName' style='float:right'>"+dataeach.CITYNAME.replace(/市/,"")+"</div>");
                    var level=tool.levelReturn("AQI",dataeach.AQI_AVG);
                    var color=tool.levelColor(level).color;
                    var td3=$("<div class='cityRankTableTrValue numberFontFamily' style='float:right;color:"+color+"'>"+dataeach.AQI_AVG+"</div>");
                    var levelname="离线";
                    switch(level){
                        case "1":
                            levelname="优";
                            break;
                        case "2":
                            levelname="良";
                            break;
                        case "3":
                            levelname="轻度污染";
                            break;
                        case "4":
                            levelname="中度污染";
                            break;
                        case "5":
                            levelname="重度污染";
                            break;
                        case "6":
                            levelname="严重污染";
                            break;
                    }

                    var td4=$("<div class='cityRankTableTrLevel' style='float:right'><label style='background-color:"+color+"'>"+levelname+"</label></div>");
                    var td5=$("<div class='cityRankTableTrDetail' style='float:right'>详情></div>");
                    div.append(td1);
                    div.append(td5);
                    div.append(td4);
                    div.append(td3);
                    div.append(td2);
                    $("#cityRank_ContentTable").append(div);
                });
                $(".cityRankTableTr").unbind().click(function(){
                    var citycode=$(this).attr("citycode");
                    $.mobile.changePage("#cityPage?citycode="+citycode,{transition:"slide"});
                });
            }
        });
    },
    cityRankMonthTable:function(){
        $("#ajaxPleaseWait").show();
        $.ajax({
            type: "GET",
            url: provinceAjax + "/publish/getAllCity30DaysAQIAVG",
            dataType: 'json',
            async: true,
            data: {},
            error: function () {
                tool.warningAlert("warAFailed", "获取城市信息失败");
            },
            complete: function (XMLHttpRequest) {
                $("#ajaxPleaseWait").hide();
                var data = eval("(" + XMLHttpRequest.responseText + ")");
                $("#cityRank_ContentTime").html("<i class='iconNew-alertMessage' style='margin-right: 3px;'></i>时间:"+data[0].TIMEPOINT+"(城市环境空气综合指数)");
                $("#cityRank_ContentTable").html("");
                $.each(data,function(i,item){
                    var dataeach=item;
                    var div=$("<div class='cityRankTableTr' citycode='"+dataeach.CITYCODE+"'></div>");
                    var td1=$("<div class='cityRankTableTrNo numberFontFamily'>"+(i+1)+"</div>");
                    var td2=$("<div class='cityRankTableTrName' style='float:right'>"+dataeach.CITYNAME+"</div>");
                    var color="";
                    var rank=dataeach.RANK;
                    var rankdetail="";
                    var arrow="";
                    if(rank==0){
                        color="#529DFA";
                        rankdetail="较上月持平";
                        arrow="iconNew-ping";
                    }else if(rank<0){
                        color="#E30000";
                        rankdetail="较上月降"+rank*(-1)+"名";
                        arrow="iconNew-down";
                    }else if(rank>0){
                        color="#6FC547";
                        rankdetail="较上月升"+rank+"名";
                        arrow="iconNew-up";
                    }
                    var td3=$("<div class='cityRankTableTrValue3' style='float:right;color:"+color+"'>"+dataeach.AQI_AVG+"</div>");
                    var td4=$("<div class='cityRankTableTrDetail3 numberFontFamily' style='float:right;color:"+color+"'><i class='"+arrow+"'></i></div>");
                    var td5=$("<div class='cityRankTableTrLevel3' style='float:right'><label style='background-color:"+color+"'>"+rankdetail+"</label></div>");
                    div.append(td1);
                    div.append(td5);
                    div.append(td4);
                    div.append(td3);
                    div.append(td2);
                    $("#cityRank_ContentTable").append(div);
                });
            }
        });
    },
    settingPage_init:function(){
        $("#closeTheApp").unbind().click(function(){
            navigator.app.exitApp();
        });
        if(!localStorage.receivePush){
            localStorage.receivePush=1;
            $("#ifReceivePush").prop("checked",true);
        }else{
            if(localStorage.receivePush==1){
                $("#ifReceivePush").prop("checked",true);
            }else{
                $("#ifReceivePush").prop("checked",false);
            }
        }

        $("#ifReceivePush").unbind().click(function(){
            if($("#ifReceivePush").prop("checked")){
                localStorage.receivePush=1;
                window.plugins.jPushPlugin.resumePush();
                window.plugins.jPushPlugin.clearAllNotification();
                tool.warningAlert("warAFailed", "开启推送");
            }else{
                localStorage.receivePush=0;
                window.plugins.jPushPlugin.stopPush();
                tool.warningAlert("warAFailed", "关闭推送");
            }
        });
    },
    infomationPage_init:function(){
        $("#infomationPage_Content1FooterButton").unbind().click(function(){
            var title="空气质量指数";
            var body=$("<div class='infoFanDivContent'></div>");
            var label1=$("<label class='infoFanDivLabel'>&nbsp&nbsp空气质量指数(Air Quality Index，简称AQI)是定量描述空气质量状况的无量纲指数。</label>");
            var label2=$("<label class='infoFanDivLabel'>&nbsp&nbsp针对单项污染物的还规定了空气质量分指数。参与空气质量评价的主要污染物为细颗粒物、可吸入颗粒物、二氧化硫、二氧化氮、臭氧、一氧化碳等六项。</label>");
            var label3=$("<label class='infoFanDivTitle'>质量等级</label>");
            var table=$("<div class='infoFanDivTable'></div>");
            var tableleft1=$("<div class='infoFanDivTdLeft'>等级</div>");
            var tableright1=$("<div class='infoFanDivTdRight'>无量纲</div>");
            var tableleft2=$("<div class='infoFanDivTdLeft' style='color:#00E400'>优</div>");
            var tableright2=$("<div class='infoFanDivTdRight'>0~50</div>");
            var tableleft3=$("<div class='infoFanDivTdLeft' style='color:#fdc61e'>良</div>");
            var tableright3=$("<div class='infoFanDivTdRight'>51~100</div>");
            var tableleft4=$("<div class='infoFanDivTdLeft' style='color:#FF7E00'>轻度污染</div>");
            var tableright4=$("<div class='infoFanDivTdRight'>101~150</div>");
            var tableleft5=$("<div class='infoFanDivTdLeft' style='color:#FF0000'>中度污染</div>");
            var tableright5=$("<div class='infoFanDivTdRight'>151~200</div>");
            var tableleft6=$("<div class='infoFanDivTdLeft' style='color:#99004C'>重度污染</div>");
            var tableright6=$("<div class='infoFanDivTdRight'>201~300</div>");
            var tableleft7=$("<div class='infoFanDivTdLeft' style='color:#7E0023'>严重污染</div>");
            var tableright7=$("<div class='infoFanDivTdRight'>>300</div>");
            table.append(tableleft1);
            table.append(tableright1);
            table.append(tableleft2);
            table.append(tableright2);
            table.append(tableleft3);
            table.append(tableright3);
            table.append(tableleft4);
            table.append(tableright4);
            table.append(tableleft5);
            table.append(tableright5);
            table.append(tableleft6);
            table.append(tableright6);
            table.append(tableleft7);
            table.append(tableright7);
            body.append(label1);
            body.append(label2);
            body.append(label3);
            body.append(table);
            tool.infomationFancyDiv(title,body);
        });
        $(".infomationGasItem").unbind().click(function(){
            var gas=$(this).attr("gas");
            var data=gasDetail[gas];
            var title=data.NAME;
            var body=$("<div class='infoFanDivContent'></div>");
            var label1=$("<label class='infoFanDivTitle'>主要来源</label>");
            var label2=$("<label class='infoFanDivLabel'>&nbsp&nbsp"+data.RES+"</label>");
            var label3=$("<label class='infoFanDivTitle'>浓度限值</label>");
            var table=$("<div class='infoFanDivTable'></div>");
            var tableleft1=$("<div class='infoFanDivTdLeft'>等级</div>");
            var tableright1=$("<div class='infoFanDivTdRight'>无量纲</div>");
            var tableleft2=$("<div class='infoFanDivTdLeft' style='color:#00E400'>空气质量优</div>");
            var tableright2=$("<div class='infoFanDivTdRight'>"+data.level1+"</div>");
            var tableleft3=$("<div class='infoFanDivTdLeft' style='color:#fdc61e'>空气质量良</div>");
            var tableright3=$("<div class='infoFanDivTdRight'>"+data.level2+"</div>");
            var tableleft4=$("<div class='infoFanDivTdLeft' style='color:#FF7E00'>轻度污染</div>");
            var tableright4=$("<div class='infoFanDivTdRight'>"+data.level3+"</div>");
            var tableleft5=$("<div class='infoFanDivTdLeft' style='color:#FF0000'>中度污染</div>");
            var tableright5=$("<div class='infoFanDivTdRight'>"+data.level4+"</div>");
            var tableleft6=$("<div class='infoFanDivTdLeft' style='color:#99004C'>重度污染</div>");
            var tableright6=$("<div class='infoFanDivTdRight'>"+data.level5+"</div>");
            var tableleft7=$("<div class='infoFanDivTdLeft' style='color:#7E0023'>严重污染</div>");
            var tableright7=$("<div class='infoFanDivTdRight'>"+data.level6+"</div>");
            var label4=$("<label class='infoFanDivTitle'>对健康的影响</label>");
            var label5=$("<label class='infoFanDivLabel'>&nbsp&nbsp"+data.HEAL+"</label>");
            table.append(tableleft1);
            table.append(tableright1);
            table.append(tableleft2);
            table.append(tableright2);
            table.append(tableleft3);
            table.append(tableright3);
            table.append(tableleft4);
            table.append(tableright4);
            table.append(tableleft5);
            table.append(tableright5);
            table.append(tableleft6);
            table.append(tableright6);
            table.append(tableleft7);
            table.append(tableright7);
            body.append(label1);
            body.append(label2);
            body.append(label3);
            body.append(table);
            body.append(label4);
            body.append(label5);
            tool.infomationFancyDiv(title,body);
        });
    }
}

menuFunction.login_init();


var testUrl = "http://www.scnewair.cn:3393/rx_data/station/findAll";
var config1 = {
    http:function (url,method,params,fn) {
        var needurl = testUrl+url;
        $.ajax({
            url:needurl,
            type:method,
            data:params,
            dataType:'json',
            async:true,
            success:function (data) {
                fn(data)
            },
            error:function (err) {
                //alert("连接失败,请检查网络后重启此程序");
                tool.warningAlert("warAFailed","获取地图信息失败");
            },

        })
    },
    http1:function (url,method,params,fn) {
        var needurl = provinceAjax+url;
        $.ajax({
            url:needurl,
            type:method,
            data:params,
            dataType:'json',
            async:true,
            success:function (data) {
                fn(data)
            },
            error:function (err) {
                //alert("连接失败,请检查网络后重启此程序");
                tool.warningAlert("warAFailed","获取地图信息失败");
            },
        })
    }
}
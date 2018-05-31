// var provinceAjax="http://xsscd.xicp.net:5100";
// var cityAjax="http://xsscd.xicp.net:";
var bottomFooterHeight=58;
var provinceAjax="http://www.scnewair.cn:3389";
var cityAjax="http://www.scnewair.cn:";
var testUrl = "http://www.scnewair.cn:3393/rx_data/station/findAll";
localStorage.code="5100";
localStorage.loginUrl=provinceAjax;
var forecastRange;
//var config1 = {
//  http:function (url,method,params,fn) {
//      var needurl = testUrl+url;
//      $.ajax({
//          url:needurl,
//          type:method,
//          data:params,
//          dataType:'json',
//          async:true,
//          success:function (data) {
//              var newary=data.slice(0, 50)
//              console.log(data)
//              console.log(newary)
//              fn(data)
//          },
//          error:function (err) {
//              //alert("连接失败,请检查网络后重启此程序");
//              tool.warningAlert("warAFailed","获取地图信息失败");
//          },
//
//      })
//  },
//  http1:function (url,method,params,fn) {
//      var needurl = provinceAjax+url;
//      $.ajax({
//          url:needurl,
//          type:method,
//          data:params,
//          dataType:'json',
//          async:true,
//          success:function (data) {
//              fn(data)
//          },
//          error:function (err) {
//              //alert("连接失败,请检查网络后重启此程序");
//              tool.warningAlert("warAFailed","获取地图信息失败");
//          },
//      })
//  }
//};
var app = {
    initialize: function() {
        this.bindEvents();
    },
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    onDeviceReady: function() {
        tool.onDeviceReady();
    }
};

app.initialize();
var router=new $.mobile.Router(
    {
        "#login": {handler: "login", events: "bc,c,i,bs,s,bh,h" },
        "#indexPage": {handler: "indexPage", events: "bc,c,i,bs,s,bh,h" },
        "#cityPage": {handler: "cityPage", events: "bc,c,i,bs,s,bh,h" },
        "#auditPage": {handler: "auditPage", events: "bc,c,i,bs,s,bh,h" },
        "#cityRankPage": {handler: "cityRankPage", events: "bc,c,i,bs,s,bh,h" },
        "#forePubPage": {handler: "forePubPage", events: "bc,c,i,bs,s,bh,h" },
        "#settingPage": {handler: "settingPage", events: "bc,c,i,bs,s,bh,h" },
        "#infomationPage": {handler: "infomationPage", events: "bc,c,i,bs,s,bh,h" }
    },{
        login: function(type,match,ui){
            if(type=="pageshow"){
                menuFunction.login_init();
            }
        },
        indexPage: function(type,match,ui){
            if(type=="pagebeforeshow"){
                tool.footerMenuInit("indexPage","indexPage");
            }
            if(type=="pageshow"){
                tool.topRightMenu("indexPage");
                menuFunction.indexPage_init();
//              navigator.splashscreen.hide();
            }
           
//         debugger;
        },
        cityPage: function(type,match,ui){
            if(type=="pageshow"){
                outerWidthForAll=$("#login").outerWidth();
                var citycode;
                if(match[1]==undefined){
                	match[1] = "citycode=5100";
                }
                if(match[1]){
                    var arr=match[1];
                    citycode=arr.replace(/citycode=/,"");
                    if(citycode==""){
                        citycode=tool.localCityWorkForSichuan();
                    }
                    if(citycode=="5100"){
                        citycode=5101
                    }
                    tool.topRightMenu("cityPage");
                    menuFunction.cityPage_init(citycode);
                }else{
                    // var myCity = new BMap.LocalCity();
                    // myCity.get(tool.getCityByIP);
                    // citycode=tool.localCityWorkForSichuan();


                    navigator.geolocation.getCurrentPosition(function(position){
                        //onSuccees
                        // alert(position.coords.latitude + "<br>" + position.coords.longitude);

                        var localmap = new BMap.Map("allmap");
                        var point = new BMap.Point(position.coords.longitude,position.coords.latitude);
                        var geoc = new BMap.Geocoder();
                        geoc.getLocation(point, function(rs){
                            var addComp = rs.addressComponents;
                            citycode=tool.localCityWorkForSichuan(addComp.city);
                            if(citycode=="5100"){
                                citycode=5101
                            }
                            tool.topRightMenu("cityPage");
                            menuFunction.cityPage_init(citycode);
                        });
                    } ,function(){
                        //onError
                    } ,{ maximumAge: 3000, timeout: 5000, enableHighAccuracy: true });
                }
            }
        },
        auditPage: function(type,match,ui){
            if(type=="pagebeforeshow"){
                tool.footerMenuInit("auditPage","auditPage");
            }
            if(type=="pageshow"){
                tool.topRightMenu("auditPage");
                menuFunction.auditPage_init();
            }
        },
        cityRankPage: function(type,match,ui){
            if(type=="pagebeforeshow"){
                tool.footerMenuInit("cityRankPage","cityRankPage");
            }
            if(type=="pageshow"){
                tool.topRightMenu("cityRankPage");
                menuFunction.cityRankPage_init();
            }
        },
        forePubPage:function(type,match,ui){
            if(type=="pagebeforeshow"){
                tool.footerMenuInit("forePubPage","forePubPage");
            }
            if(type=="pageshow"){
                tool.topRightMenu("forePubPage");
                menuFunction.forePubPage_init();
            }
        },
        settingPage:function(type,match,ui){
            if(type=="pageshow"){
                menuFunction.settingPage_init();
            }
        },
        infomationPage:function(type,match,ui){
            if(type=="pageshow"){
                menuFunction.infomationPage_init();
            }
        }
    }, {
        defaultHandler: function(type, ui, page) {
        },
        defaultHandlerEvents: "s",
        defaultArgsRe: true
    }
);

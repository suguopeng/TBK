
var commissionAdd=1;
var commissionCut=0;
var judgeValue;

var preYear;
var preAxisYear;
var preAxisMonth;

var left=0;
var right=0;
var leftYear;
var mark=0;
var oddNums=[];
var oddCount=0;
//配置请求
var  AwardPage_AjaxConfig = {
    ajaxing: false,
    ajaxUrl: "http://localhost:63342/TBK/data/tsconfig.json",
    ajaxData: {
        pageNum: 0,
        pageCount:3,
    },
    have: true,
};
//ajax请求
var AwardPage_GetItemsList = function () {
    if (!AwardPage_AjaxConfig.ajaxing && AwardPage_AjaxConfig.have) {
        $.ajax({
            async: false,
            type: "get",
            url: AwardPage_AjaxConfig.ajaxUrl,
            dataType: "json",
            data: AwardPage_AjaxConfig.ajaxData,
            beforeSend: function () {
                AwardPage_AjaxConfig.ajaxing = true;
                $(".loading").show();
            },
            success: function (result) {
                if (result.pageCount <= 0) {
                    AwardPage_AjaxConfig.have = false;
                } else {
                    AwardPage_AjaxConfig.have = true;
                }
                AwardPage_AjaxConfig.ajaxData.pageNum++;
                AwardPage.pageCount = result.pageCount;
                // AwardPage.bountyChange = result.bountyChange;
                // AwardPage.personalOrTeams = result.personalOrTeams;
                AwardPage.awards= [];
                $.each(result.awards, function (i, data){
                    if (result.awards != undefined && result.awards != null) {
                        if(mark==0){
                            timeProcess(data);
                        }else if(mark==1 && "且听风吟"==data.orderOrigin){
                            timeProcess(data);
                        }else if(mark==2 && "且听风吟"!=data.orderOrigin){
                            timeProcess(data);
                        }else if(mark==3 && data.bounty>0){
                            timeProcess(data);
                        }else if(mark==4 && data.bounty<0){
                            timeProcess(data);
                        }
                    }
                    // if(mark==0){
                    //     AwardPage.Award.push(itemAward);
                    // }else if(mark==1){
                    //     if("且听风吟"==data.orderOrigin){
                    //         AwardPage.Award.push(itemAward);
                    //     }
                    // }else if(mark==2){
                    //     if(data.orderOrigin!="且听风吟"){
                    //         AwardPage.Award.push(itemAward);
                    //     }
                    // }else if(mark==3){
                    //     if(data.bounty>0){
                    //         AwardPage.Award.push(itemAward);
                    //     }
                    // }else{
                    //     if(data.bounty<0){
                    //         AwardPage.Award.push(itemAward);
                    //     }
                    // }
                })
            },
            error: function () {
                $(".loading").hide();
                console.log("请求商品数据出错");
            },
            complete: function () {
                left=0;
                right=0;
                $(".loading").hide();
                AwardPage_BindItemsList();
                getTimeAxisHeight();
                axisPosition();
                showStar();
                yearMonthRound();
                yearMonthRoundPosition();
                $(".axis-time").css({"position":"static"});
                positionTime();
                AwardPage_AjaxConfig.ajaxing = false;

            }
        })
    }
};
//处理订单号中间的星号
var plusStar=function(str,fromLen,endLen) {
    var len = str.length-fromLen-endLen;
    var star = '';
    for (var i=0;i<len;i++) {
        star+='*';
    }
    return str.substr(0,fromLen)+star+str.substr(str.length-endLen);
}
//时间处理
var timeProcess=function(data){
    var itemAward = new Model_AwardDetail();
    if(preAxisYear==undefined && preAxisMonth==undefined){
        itemAward.axisTime = splitTime(Util_FormatDate(new Date(data.orderTime*1000))) ;
        preAxisYear=itemAward.axisTime.year;
        preAxisMonth=itemAward.axisTime.month;
    }else {
        var axisYear=splitTime(Util_FormatDate(new Date(data.orderTime*1000))).year;
        var axisMonth=splitTime(Util_FormatDate(new Date(data.orderTime*1000))).month;
        if(axisYear==preAxisYear && axisMonth==preAxisMonth){
            itemAward.axisTime =splitTime(Util_FormatDate(new Date(data.orderTime*1000)));
            delete itemAward.axisTime.year;
            delete itemAward.axisTime.month;
        }else{
            itemAward.axisTime =splitTime(Util_FormatDate(new Date(data.orderTime*1000)));
            preAxisYear=axisYear;
            preAxisMonth=axisMonth;
        }
    }
    if(preYear==undefined || preYear==null){
        itemAward.orderTime = splitTime(Util_FormatDate(new Date(data.orderTime*1000),'second'));
        preYear=itemAward.orderTime.year;
    }else {
        var year=splitTime(Util_FormatDate(new Date(data.orderTime*1000),'second')).year;
        if(year==preYear){
            itemAward.orderTime =splitTime(Util_FormatDate(new Date(data.orderTime*1000),'second'));
            delete itemAward.orderTime.year;
        }else{
            itemAward.orderTime =splitTime(Util_FormatDate(new Date(data.orderTime*1000),'second'));
            preYear=year;
        }
    }
    itemAward.bounty = data.bounty;
    itemAward.balance = data.balance;
    itemAward.orderFrom = data.orderOrigin;
    itemAward.oddNum = data.oddNum;
    oddNums.push(data.oddNum);
    itemAward.orderImg = data.orderImg;
    itemAward.PaymentAmount = data.PaymentAmount;
    itemAward.myCommission = data.myCommission;
    itemAward.branchCommission = data.branchCommission;
    AwardPage.awards.push(itemAward);
};
//
//拆分时间
var splitTime = function (date) {
    var time = {};
    var f = date.split(' ', 2);//过滤空格
    if (f[0].search("/") != -1) {//判断是否包含-
        var d = (f[0] ? f[0] : '').split('/', 3);//过滤-
    } else {
        var d = (f[0] ? f[0] : '').split('-', 3);//过滤-
    }
    time.year = parseInt(d[0]);//转换成整数形式的原因是 过滤掉 月份和时分秒的首位补零的情况
    time.month = parseInt(d[1]);
    time.day = parseInt(d[2]);
    var t = (f[1] ? f[1] : '').split(':', 3);//过滤:
    time.hour = parseInt(t[0]);
    time.minute = parseInt(t[1]);
    time.second = parseInt(t[2]);
    return time;
}
//绑定页面数据
var AwardPage_BindItemsList = function () {
    var html = '';
    var timeHtml='';
    var yearMonthHtml="";
    var yearCount;
    $.each(AwardPage.awards, function (i, data) {

              timeHtml+=  '<div class="time-axis-right">';
            timeHtml+='<div id="time-right" time="' + data.axisTime.year +'.'+ data.axisTime.month +'.'+ data.axisTime.day + '" countRight="' + right++ + '"></div>';
            yearCount=right;
            if(data.axisTime.year!=undefined && data.axisTime.month!=undefined){
                timeHtml+='<div class="time-year-wrap" style="position:relative">';
                if((data.axisTime.month).toString().length>1){
                    timeHtml+='<span class="time time-year-month" style="position:relative;right:6px">'+data.axisTime.year+'.'+data.axisTime.month+'</span>\n';
                }else{
                    timeHtml+='<span class="time time-year-month" >'+data.axisTime.year+'.'+data.axisTime.month+'</span>\n';
                }
                timeHtml+='<span class="round time-year-month-round" style="background:#e72434;top:9px;right:-16px"></span>\n'+
                    '</div>';
            }
            if((data.axisTime.day).toString().length>1){
                timeHtml+='<div class="time-day-wrap" style="position:relative">' +
                    '<span class="time time-day">'+data.axisTime.day+'</span>\n'+
                    '<span class="round  day-round" style="right:-17.5px;"></span>\n'+
                    '</div>';
            }else{
                timeHtml+='<div class="time-day-wrap" style="position:relative">' +
                    '<span class="time time-day" style="right:-7px;">'+data.axisTime.day+'</span>\n' +
                    '<span class="round day-round" style="right:-17.5px;"></span>\n'+
                    '</div>';
            }
            timeHtml+= '</div>';
        if(data.axisTime.year!=undefined && data.axisTime.month!=undefined){
                yearMonthHtml+='<div class="time-axis-right" >';
                yearMonthHtml+='<div id="time-right" time="' + data.axisTime.year +'.'+ data.axisTime.month +'.'+ data.axisTime.day + '"  countRight="' + yearCount+ '"></div>';
                yearMonthHtml+='<div class="time-year-wrap" style="">';
                    if((data.axisTime.month).toString().length>1){
                        yearMonthHtml+= '<span class="time time-year-month TYM" style="position:relative;right:7px">'+data.axisTime.year+'.'+data.axisTime.month+'</span>\n';
                        yearMonthHtml+= '<span class="round year-month-round YMR" style="background:#e72434;right:5px"></span>\n';
                    }else{
                        yearMonthHtml+= '<span class="time time-year-month TYM">'+data.axisTime.year+'.'+data.axisTime.month+'</span>\n';
                        yearMonthHtml+= '<span class="round year-month-round YMR" style="background:#e72434;right:5px"></span>\n';
                   }
                   yearMonthHtml+= '</div>';
            yearMonthHtml+= '</div>';
            }
        if(parseInt(data.bounty)>0){
            html += '<div class="timeline-row" orderFrom="' + data.orderFrom + '" commission="' + commissionAdd+ '">\n' ;
        }else{
            html += '<div class="timeline-row" orderFrom="' + data.orderFrom + '" commission="' + commissionCut+ '">\n' ;
        }

       html+='<div id="time-left" time="' + data.orderTime.year +'.'+ data.orderTime.month +'.'+ data.orderTime.day + '" countLeft="' + left++ + '"></div>';
        if(data.orderTime.year!=undefined&&data.orderTime.year!=null){
           html+= ' <div class="timeline-year"><em class="time-year" time-year="' + data.orderTime.year + '">' + data.orderTime.year + '</em><span>年</span></div>\n' ;
        }
           html+= '                                    <div class="timeline-msg">\n' +
            '                                        <div class="timeline-datetime">\n' +
            '                                            <div class="timeline-date"><em time-month="' + data.orderTime.month + '">' + data.orderTime.month + '</em><span>月</span><em>' + data.orderTime.day + '</em><span>日</span>\n' +
            '                                            </div>\n' +
            '                                            <div class="timeline-time">\n' +
            '                                                <em>' + data.orderTime.hour + '</em><span>时</span><em>' + data.orderTime.minute + '</em><span>分</span><em>' + data.orderTime.second + '</em><span>秒</span>\n' +
            '                                            </div>\n' +
            '                                        </div>\n' +
            '                                        <div class="timeline-char"></div>\n' +
            '                                        <div class="timeline-info">\n' +
            '                                            <div>奖励金增加<b class="plus">' + data.bounty + '</b>元</div>\n' +
            '                                            <div>变动后余额<b class="now">' + data.balance + '</b>元</div>\n' +
               '                                            <div>奖励金变动类型<b class="now">' + data.balance + '</b>元</div>\n' +
            '                                            <div class="remark" orderFrom="' + data.orderFrom + '">来自<em>' + data.orderFrom + '</em>的订单</div>\n';
                                                       if(data.orderFrom=='且听风吟'){
                                                           html+=' <div class="remark"  oddCount="'+oddCount++ +'">单号<em>' + data.oddNum + '</em></div>\n' ;
                                                        }else{
                                                           html+='<div class="remark remark-star" oddCount="'+oddCount++ +'">单号<em class="star">' +plusStar(data.oddNum.toString(),3,3) + '</em></div>\n';
                                                       }
        html+=  '                                            <div class="remark">定单ID<em>' + data.oddNum + '</em></div>\n' +
            '                                            <div class="item clearfix">\n' +
            '                                                <a class="image" href="item.html?id=1111"><img\n' +
            '                                                        src="' + data.orderImg + '" /></a>\n' +
            '                                                <div class="info">\n' +
            '                                                    <div class="sale-price">买家付款:<i>' + data.PaymentAmount + '</i>元</div>\n' +
            '                                                    <div class="branch-price">下级佣金:<i>' + data.branchCommission + '</i>元</div>\n' +
            '                                                    <div class="my-price">我的佣金:<i myCommission="' + data.myCommission + '">' + data.myCommission + '</i>元</div>\n' +
            '                                                </div>\n' +
            '                                            </div>\n' +
            '                                        </div>\n' +
            '                                    </div>\n' +
            '                                    </div>\n' +
            '                                  </div>\n';
        // if((data.axisTime.month)!=undefined && (data.axisTime.month).toString().length>1 ){
        //     $(".axis-time").css({"position":"relative","right":"-7px"});
        // }else{
        //
        // }
    });
    $(".timeline-row-wrap").append(html);
    $(".axis-time").append(timeHtml);
    if(judgeAxisHeight()){
        $(".axis-time").empty($(timeHtml));
        $(".axis-time").append($(yearMonthHtml));
        getTimeAxisHeight();
        axisPosition();
    }
};
//设置光有年月的round定位
var yearMonthRound=function(){
    var i=9;
 $(".year-month-round").each(function(){
     $(this).css({"top":i});
     i=i+24;
 })
}

var yearMonthRoundPosition=function(){
    $(".TYM").each(function(){
        if( parseInt($(this).text().split(".")[1])>=10){
            $(".YMR").each(function(i,ymr){
               $(ymr).css("right","3px")
            });
            console.log( $(".YMR").css("right"));
            return false;
        }
    })
}
//设置时间的定位
var positionTime=function(){
    var list=$(".time-year-month");
    for(i=0;i<list.length;i++){
        if ($( list[i]).text().split(".")[1].toString().length>1){
            $(".axis-time").css({"position":"relative","right":"-7px"});
            $(".time-year-month-round").css({"position":"absolute","right":"-9px"});
            break;
        }
    }
    // $.each($(".time-year-month"),function(i,dom){
    //     if( parseInt($(dom).text().split(".")[1]).length>1){
    //         $(".axis-time").css({"position":"relative","right":"-7px"});
    //     }
    // })
};
//设置时间轴线的高度和时间轴的居中
var getTimeAxisHeight=function(){
    var h=$(".time-axis").height();
    var viewHeight=$(window).height();
    $(".axis-line").css("height",h);
    $(".time-axis").css("margin-top", (viewHeight-h)/2-25-30);
};
//判断时间轴的高度是否大于窗口的高度
var judgeAxisHeight=function(){
    var axisHeight=$(".time-axis").height();
    var viewHeight=$(window).height();
    if(axisHeight>viewHeight-130){
        judgeValue=1;
    }else{
        judgeValue=0;
    }
    return  judgeValue;
}
//设置头部
// $(window).on("scroll",function(){
//     var scroH = $(document).scrollTop();  //滚动高度
//     if(scroH>50){
//         $(".myprice-title").css({"position":"fixed","z-index":"20","background":"#fff","height":"50",
//        "width":"100%","top":"0","background-color":"rgba(255, 255, 255, 0.9)"});
//         $(".myprice-title>ul").css( {"padding-top":"20px",
//         "display": "flex","justify-content":"space-around","align-items":"center","width":"100%"});
//         $(".myprice-timeline-wrap").css({"top":"50","position":"relative"});
//         // $(".time-axis").css({"top":"60","position":"fixed"});
//     }else{
//         $(".myprice-title").css({"position":"static"});
//     }
// })
// $(window).scroll(function(){
//     var scroH = $(document).scrollTop();  //滚动高度
//     if(scroH>50){
//         $(".myprice-title").css({"position":"fixed","z-index":"20"})
//     }
// })

//切换按钮的时候设置订单的时间
// var resetTime=function(){
//     var year=$(".timeline-row").find("input").val();
// }

//根据时间轴搜索订单
var axisPosition=function(){
    $(".time-axis-right").click(function(){
        // var str="undefined";
        var $this=$(this);
        var timeRight=$this.find("#time-right").attr("countRight");//这个地方是我获取的右边时间轴的时间  通过点击触发
        // while(timeRight.indexOf(str)>0){
        //     timeRight=$this.prev().find("#time-right").attr("time");
        //     $this=$this.prev();
        // }

        var targetTime= $(".timeline-row").children("div[countLeft='"+timeRight+"']").parent(".timeline-row");//这个地方是获取到和右边时间相等订单
        var targetDomPosition=$(targetTime).offset().top;
        window.scrollTo(0,targetDomPosition-50);
    });
}
//点击有星号的订单号
var showStar=function(){
    $(".timeline-row").find(".remark-star").click(function(){
        var attrIndex=$(this).attr("oddCount");
        $(this).find("em.star").text(oddNums[attrIndex]);
    });
}
//设置页面事件
var AwardPage_SetPageEvent = function(){
    //点击全部订单
    $(".all").click(function() {
        // $("div.timeline-row").show();
        // getTimeAxisHeight();
        // mark=0;
        $(".timeline-row-wrap").empty();
        $(".axis-time").empty();
        mark=0;
        AwardPage_GetItemsList();
    });
    //点击个人订单
    $(".personal").click(function() {
        // $("div.timeline-row[orderFrom='" + user.nickname + "']").show().siblings().hide();
        // $('.timeline-row[orderFrom="且听风吟"]').show();
        // $('.timeline-row[orderFrom!="且听风吟"]').hide();
        // getTimeAxisHeight();
        $(".timeline-row-wrap").empty();
        $(".axis-time").empty();
        mark=1;
        preYear=undefined;
        preAxisYear=undefined;
        preAxisMonth=undefined;
        AwardPage_GetItemsList();
    });
    //点击团队订单
    $(".team").click(function() {
        // $("div.timeline-row[orderFrom!='" + user.nickname + "']").show().siblings().hide();
        // $('.timeline-row[orderFrom="且听风吟"]').hide();
        // $('.timeline-row[orderFrom!="且听风吟"]').show();
        // resetTime();
        $(".timeline-row-wrap").empty();
        $(".axis-time").empty();
        mark=2;
        preYear=undefined;
        preAxisYear=undefined;
        preAxisMonth=undefined;
        AwardPage_GetItemsList();
    });
    //点击奖励金增加
    $(".commissionAdd").click(function(){
        // $(".timeline-row[commission='" + commissionAdd + "']").show().siblings().hide();
        // $(".timeline-row[commission='" + commissionAdd + "']").show();
        // $(".timeline-row[commission='" + commissionCut + "']").hide();
        $(".timeline-row-wrap").empty();
        $(".axis-time").empty();
        mark=3;
        preYear=undefined;
        preAxisYear=undefined;
        preAxisMonth=undefined;
        AwardPage_GetItemsList();
    });
    //点击奖励金减少
    $(".commissionCut").click(function() {
        // $(".timeline-row[commission='" + commissionCut + "']").show().siblings().hide();
        // $(".timeline-row[commission='" + commissionCut+ "']").show();
        // $(".timeline-row[commission='" + commissionAdd + "']").hide();
        $(".timeline-row-wrap").empty();
        $(".axis-time").empty();
        mark=4;
        preYear=undefined;
        preAxisYear=undefined;
        preAxisMonth=undefined;
        AwardPage_GetItemsList();
    });
};
//页面加载
var AwardPage_Init = function(){
    AwardPage_GetItemsList();
    AwardPage_SetPageEvent();
};
$(document).ready(function(){
    AwardPage_Init();
});
var AwardPage = new Model_AwardList();
var imgUrl = "http://bjq1.fzojq.info";

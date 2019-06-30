var time = {};
var times=[];
var preYear;
//配置请求
var OrderPage_AjaxConfig = {
    ajaxing: false,
    ajaxUrl: "http://localhost:63342/TBK/data/tsconfig.json",
    ajaxData: {
        pageNum: 0,
        pageCount:3,
    },
    have: true,
};
//ajax请求
var OrderPage_GetItemsList = function () {
    if (!OrderPage_AjaxConfig.ajaxing && OrderPage_AjaxConfig.have) {
        $.ajax({
            async: true,
            type: "get",
            url: OrderPage_AjaxConfig.ajaxUrl,
            dataType: "json",
            data: OrderPage_AjaxConfig.ajaxData,
            beforeSend: function () {
                OrderPage_AjaxConfig.ajaxing = true;
                $(".loading").show();
            },
            success: function (result) {
                if (result.pageCount <= 0) {
                    OrderPage_AjaxConfig.have = false;
                } else {
                    OrderPage_AjaxConfig.have = true;
                }
                OrderPage_AjaxConfig.ajaxData.pageNum++;
                OrderPage.pageCount = result.pageCount;
                // OrderPage.bountyChange = result.bountyChange;
                // OrderPage.personalOrTeams = result.personalOrTeams;
                OrderPage.orders = [];
                $.each(result.orders, function (i, data) {
                    var itemOrder = new Model_OrderDetail();
                    if (result.orders != undefined && result.orders != null) {

                        if(preYear==undefined || preYear==null){
                            itemOrder.orderTime = splitTime(formatDate(data.orderTime)) ;
                            preYear=itemOrder.orderTime.year;
                        }else {
                            var year=splitTime(formatDate(data.orderTime)).year;
                            if(year==preYear){
                                itemOrder.orderTime =splitTime(formatDate(data.orderTime));
                                delete itemOrder.orderTime.year;
                            }else{
                                itemOrder.orderTime =splitTime(formatDate(data.orderTime)) ;
                                preYear=year;
                            }
                        }
                        // time = splitTime(itemOrder.orderTime);
                        itemOrder.bounty = data.bounty;
                        itemOrder.balance = data.balance;
                        itemOrder.orderOrigin = data.orderOrigin;
                        itemOrder.oddNum = data.oddNum;
                        itemOrder.orderImg = data.orderImg;
                        itemOrder.PaymentAmount = data.PaymentAmount;
                        itemOrder.myCommission = data.myCommission;
                        itemOrder.branchCommission = data.branchCommission;
                    }
                    times.push(time);
                    OrderPage.orders.push(itemOrder);
                })
            },
            error: function () {
                $(".loading").hide();
                console.log("请求商品数据出错");
            },
            complete: function () {
                $(".loading").hide();
                OrderPage_BindItemsList();
                OrderPage_AjaxConfig.ajaxing = false;
            }
        })
    }
};
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
var OrderPage_BindItemsList = function () {
    var html = '';
    var timeHtml='';
    $.each(function(){

    });
    $.each(OrderPage.orders, function (i, data) {
        html += '<div class="timeline-row">\n' ;
        if(data.orderTime.year!=undefined&&data.orderTime.year!=null){
           html+= ' <div class="timeline-year"><em>' + data.orderTime.year + '</em><span>年</span></div>\n' ;
        }
           html+= '                                    <div class="timeline-msg">\n' +
            '                                        <div class="timeline-datetime">\n' +
            '                                            <div class="timeline-date"><em>' + data.orderTime.month + '</em><span>月</span><em>' + data.orderTime.day + '</em><span>日</span>\n' +
            '                                            </div>\n' +
            '                                            <div class="timeline-time">\n' +
            '                                                <em>' + data.orderTime.hour + '</em><span>时</span><em>' + data.orderTime.minute + '</em><span>分</span><em>' + data.orderTime.second + '</em><span>秒</span>\n' +
            '                                            </div>\n' +
            '                                        </div>\n' +
            '                                        <div class="timeline-char"></div>\n' +
            '                                        <div class="timeline-info">\n' +
            '                                            <div>奖励金增加<b class="plus">' + data.bounty + '</b>元</div>\n' +
            '                                            <div>变动后余额<b class="now">' + data.balance + '</b>元</div>\n' +
            '                                            <div class="remark">来自<em>' + data.orderOrigin + '</em>的订单</div>\n' +
            '                                            <div class="remark">单号<em>' + data.oddNum + '</em></div>\n' +
            '                                            <div class="item clearfix">\n' +
            '                                                <a class="image" href="item.html?id=1111"><img\n' +
            '                                                        src="' + data.orderImg + '" /></a>\n' +
            '                                                <div class="info">\n' +
            '                                                    <div class="sale-price">买家付款:<i>' + data.PaymentAmount + '</i>元</div>\n' +
            '                                                    <div class="get-price">下级佣金:<i>' + data.branchCommission + '</i>元</div>\n' +
            '                                                    <div class="my-price">我的佣金:<i>' + data.myCommission + '</i>元</div>\n' +
            '                                                </div>\n' +
            '                                            </div>\n' +
            '                                        </div>\n' +
            '                                    </div>\n' +
            '                                    </div>\n' +
            '                                  </div>\n';

    });
    $(".myprice-timeline").append(html);
}
$(document).ready(function () {
    OrderPage_GetItemsList();
})
var OrderPage = new Model_OrdersList();
var imgUrl = "http://bjq1.fzojq.info";

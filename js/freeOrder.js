//配置请求
var FreeOrderPage_AjaxConfig = {
    ajaxing: false,
    ajaxUrl: "http://v.msno1.vip/goods_bbs_api/FreeGoods_GetOrderListByUID",
    ajaxData: {
        pageNum:0,
        pageCount:20,
        uid:758648,
    },
    have: true,
};
//免单列表模型
var Model_FreeOrderList = function () {
    return {
        //商品的标题
        goodTitle:"",
        //商品图片
        goodImage:"",
        //订单号
        orderNum:0,
        //商品的金额
        goodAmount:0,
        //提交时间
        submissionTime:0,
        //是否发放
        isGrant:0,
    };
};
function utc2beijing(utc_datetime) {
    // 转为正常的时间格式 年-月-日 时:分:秒
    var T_pos = utc_datetime.indexOf('T');
    var Z_pos = utc_datetime.indexOf('Z');
    var year_month_day = utc_datetime.substr(0,T_pos);
    var hour_minute_second = utc_datetime.substr(T_pos+1,Z_pos-T_pos-1);
    var new_datetime = year_month_day+" "+hour_minute_second; // 2017-03-31 08:02:06

    // 处理成为时间戳
    timestamp = new Date(Date.parse(new_datetime));
    timestamp = timestamp.getTime();
    timestamp = timestamp/1000;

    // 增加8个小时，北京时间比utc时间多八个时区
    var timestamp = timestamp+8*60*60;

    // 时间戳转为时间
    var beijing_datetime = new Date(parseInt(timestamp) * 1000).toLocaleString().replace(/年|月/g, "-").replace(/日/g, " ");
    return beijing_datetime; // 2017-03-31 16:02:06
}

var freeOrderLists=[];
//ajax请求
var FreeOrderPage_GetItemsList = function () {
    if (!FreeOrderPage_AjaxConfig.ajaxing && FreeOrderPage_AjaxConfig.have) {
        $.ajax({
            async: false,
            type: "get",
            url: FreeOrderPage_AjaxConfig.ajaxUrl,
            dataType: "json",
            data: FreeOrderPage_AjaxConfig.ajaxData,
            beforeSend: function () {
                FreeOrderPage_AjaxConfig.ajaxing = true;
            },
            success: function (result) {
                if (result.data.length<20){
                    FreeOrderPage_AjaxConfig.have = false;
                } else {
                    FreeOrderPage_AjaxConfig.have = true;
                }
                FreeOrderPage_AjaxConfig.ajaxData.pageNum++;
                $.each(result.data, function (i,data){
                    var freeOrderList = new Model_FreeOrderList();
                    freeOrderList.goodTitle=data.item_title   ;
                    freeOrderList.goodImage=data.pic_url;
                    freeOrderList.orderNum=data.num_iid;
                    freeOrderList.goodAmount=data.free_price;
                    freeOrderList.submissionTime=utc2beijing(data.create_time);
                    freeOrderList.isGrant=data.status;
                    freeOrderLists.push(freeOrderList);
                })
            },
            error: function () {
                console.log("请求商品数据出错");
            },
            complete: function () {
                FreeOrderPage_BindItemsList();
                FreeOrderPage_AjaxConfig.ajaxing = false;
            }
        })
    }
};
var FreeOrderPage_BindItemsList = function (){
    var html="";
    $.each(freeOrderLists,function(i,data){
       html+='<div class="content" >\n' +
           '                <div class="left" >\n' +
           '                    <div class="goodImage">\n' +
           '                        <img src="'+ imgUrl +data.goodImage+'" alt="">\n' +
           '                    </div>\n' +
           '                    <div class="submInfo">\n' +
           '                        <div class="good-title">'+data.goodTitle+'</div>\n' +
           '                        <div class="order-number">'+data.orderNum+'</div>\n' +
           '                        <div class="subsidies">补贴金额：'+data.goodAmount+'元</div>\n' +
           '                        <div class="submission-time">提交时间：'+data.submissionTime+'</div>\n' +
           '                    </div>\n' +
           '                </div>\n' +
           '                <div class="right">\n' ;
               if(data.isGrant==0){
                  html+= ' <div class="is-dissemina" style="color:red">已发放</div>\n';
               }else{
                   html+= ' <div class="is-dissemina" style="color:red">未发放</div>\n';
               }
          html+= '<a href="">\n'+
           '          <div class="task">任务情况</div>\n' +
           '</a>\n'+
           '                </div>\n' +
           '            </div>\n' +
           '<div class="bottom-line"></div>';
    });
    $(".content-wrap").append(html);
};
//下拉滚动
$(window).scroll(function () {
    if ($(this).scrollTop() + $(window).height() + 20 >= $(document).height()) {
        FreeOrderPage_GetItemsList();
    }
});
// var FreeOrderPage_Init=function(){
//     FreeOrderPage_GetItemsList();
// }
$(document).ready(function(){
    FreeOrderPage_GetItemsList();
});
var imgUrl = "http://bjq1.fzojq.info";

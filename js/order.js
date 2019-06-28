var OrderPage_AjaxConfig = {
    ajaxing: false,
    ajaxUrl: "../tsconfig.json",
    ajaxData: {
        pageNum: 0,
        pageCount: 20,
    },
    have: true,
};
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
                if (result.QParams.pageCount < 20) {
                    OrderPage_AjaxConfig.have = false;
                } else {
                    OrderPage_AjaxConfig.have = true;
                }
                OrderPage_AjaxConfig.ajaxData.pageNum++;
                OrderPage.pageCount = result.pageCount;
                OrderPage.bountyChange = result.bountyChange;
                OrderPage.personalOrTeams = result.personalOrTeams;
                OrderPage.orders = [];
                $.each(result.orders, function (i, data) {
                    var itemOrder= new Model_OrderDetail();
                    if (data.orders != undefined && data.orders != null) {
                        itemOrder.orderTime = data.orderTime;
                        itemOrder.bounty = data.bounty;
                        itemOrder.balance = data.balance;
                        itemOrder.orderOrigin = data.orderOrigin;
                        itemOrder.oddNum = data.oddNum;
                        itemOrder.orderImg = data.orderImg;
                        itemOrder.PaymentAmount = data.PaymentAmount;
                        itemOrder.myCommission = data.myCommission;
                        itemOrder.branchCommission = data.branchCommission;
                    }
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
$(document).ready(function (){
    OrderPage_GetItemsList();
});
var OrderPage = new Model_OrdersList();
var imgUrl = "http://bjq1.fzojq.info";
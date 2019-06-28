var picCount = 0;
var groupTimer;
var GroupPage_AjaxConfig = {
    ajaxing: false,
    ajaxUrl: "http://v.msno1.vip/goods_bbs_api/getitemslist",
    ajaxData: {
        pageNum: 0,
        pageCount: 20,
        tr_count_max:5,
        isFree: "",
        goodId:""
    },
    have: true,
};
//ajax 获取页面数据
var GroupPage_GetItemsList = function () {
    if (!GroupPage_AjaxConfig.ajaxing && GroupPage_AjaxConfig.have) {
        $.ajax({
            async: false,
            type: "get",
            url: GroupPage_AjaxConfig.ajaxUrl,
            dataType: "json",
            data: GroupPage_AjaxConfig.ajaxData,
            beforeSend: function () {
                GroupPage_AjaxConfig.ajaxing = true;
                $(".loading").show();
            },
            success: function (result) {
                if (result.QParams.pageCount < 20) {
                    GroupPage_AjaxConfig.have = false;
                } else {
                    GroupPage_AjaxConfig.have = true;
                }
                if (result.pageNum) {
                    GroupPage_AjaxConfig.ajaxData.pageNum = result.pageNum;
                } else {
                    GroupPage_AjaxConfig.ajaxData.pageNum++;
                }
                GroupPage.pageCount = result.Page_ItemCount;
                GroupPage.items = [];
                $.each(result.Items, function (i, data) {
                    var itemGroup = new Model_Item();
                    if (data.goods_info != undefined && data.goods_info != null) {
                        //商品id
                        itemGroup.goodId = data.goods_info.id;
                        //商品名称
                        itemGroup.itemTitle = data.goods_info.name;
                        //商品组图
                        // itemGroup.itemImages=data.CoverPics.map(function(value){
                        //     return value.path;
                        // });
                        $.each(data.CoverPics, function (i, data) {
                            var imgModel = new imageModel();
                            imgModel.imgPath = data.path;
                            imgModel.imgIndex = picCount;
                            picCount++;
                            itemGroup.itemImages.unshift(imgModel);
                        });
                        //是否免单
                        itemGroup.isFree = data.goods_info.is_free;
                        //商品文案
                        itemGroup.itemBody = data.goods_info.item_body;
                        //淘宝商品id
                        itemGroup.itemId = data.goods_info.num_iid;
                        //商品原价
                        itemGroup.sourcePrice = data.goods_info.market_price;
                        //商品现价
                        itemGroup.salePrice = data.goods_info.price;
                        //佣金
                        itemGroup.getPrice = data.goods_info.tb_commission;
                        //优惠券金额
                        itemGroup.couponPrice = data.goods_info.coupon_price;
                        //商品发布时间
                        itemGroup.itemTime =  data.goods_info.create_time;
                    }
                    if(itemGroup.isFree==0){
                        GroupPage.items.unshift(itemGroup);
                    }
                })
                // GroupPage.items.sort(function(a.isFree,b.isFee){
                //     return b.isFree-a.isFree;
                // })
            },
            error: function () {
                $(".loading").hide();
                console.log("请求商品数据出错");
            },
            complete: function () {
                $(".loading").hide();
                // $("img").lazyload({effect: "fadeIn"});
                GroupPage_BindItemsList();
                scrollBottom();
                // imgLazyload();
                GroupPage_AjaxConfig.ajaxing = false;
                initPhotoSwipeFromDOM('.my-gallery');

            }
        })
    }

};
var scrollBottom = function () {
    window.scrollTo(0, getDocScrollHeight());

};
//绑定页面数据
var GroupPage_BindItemsList = function () {
    var html = "";
    var FShtml="";
    FShtml += '<li class="free_item">\n' +
        '            <div class="po-avt-wrap">\n' +
        '                <img class="po-avt" src="' + user.head + '">\n' +
        '                </div>\n' +
        '                <div class="po-cmt">\n' +

        '                <div class="po-hd">\n' +
        '                <p class="po-name">\n' +
        '               ' + user.nickname + '\n' +
        '        </p>\n' +
        '</div>\n' +
        '      <div class="post free_post" style="padding:5px;display:flex;align-items: center">\n'+
        '<a  class="free_link" href="free.html" >\n';
    FShtml += '<img class="Free-image" src="image/free-sheet.jpg" style="max-width:30px;max-height:30px">';
    FShtml += '    <span class="post-title free_title">免单大福利，限量抢购100份</span>\n' +
        '</a>\n'+
        '</div>\n';
    FShtml += '   <div class="comment" style="margin-top:10px;">\n' +
        '<span class="time" time="1分钟前"></span>\n'+
   '</div>\n'+
        '</div>\n' +
        '</li>';
    $.each(GroupPage.items, function (i, data) {
        // html+='<input  type="hidden" class="GroupCodeType" code="' + data.GroupCodeType + '">';
        var reg = new RegExp("/Public/static/kindeditor/plugins/", "g");
        data.itemBody = data.itemBody.replace(reg, imgUrl + "/Public/static/kindeditor/plugins/");
        data.itemBody = data.itemBody.replace(/券后[\s\S]{1,7}元/g, '券后' + data.sourcePrice + '元');//这个是替换原价
        data.itemBody = data.itemBody.replace(/卷后[\s\S]{1,7}元/g, '券后' + data.sourcePrice + '元');//这个是替换原价
        data.itemBody = data.itemBody.replace(/券后[\s\S]{1,7}元/g, '券后' + data.sourcePrice + '元');//这个是替换券后价
        html += ' <li class="wechat-group item" goodId="' + data.goodId + '">\n' +
            '            <div class="wechat-group-content">\n' +
            '                <div class="po-avt-wrap">\n' +
            '                    <img class="po-avt" src="' + user.head + '">\n' +
            '                </div>\n' +
            '\n' +
            '                <div class="po-cmt po-text">\n' +
            '                    <p class="po-name">\n' +
            '                        ' + user.nickname + '\n' +
            '                    </p>\n' +
            '               <div class="post-out">\n' +
            '                    <div class="post getcode" taobao_id="' + data.itemId + '" is_free="' + data.isFree + '">\n' +
            '                        <p class="post-title">' + data.itemTitle + '</p>\n' +
            '                        <p class="post-content">\n' +
            '                            ' + data.itemBody + '\n' +
            '                        </p>\n';
        if (data.isFree == 0) {
            html += '<p class="copyTaoCode"><span style="color:red">复制这条信息，打开【手机淘宝】</span><span class="rushToBy" style="color:red">立即抢购</span></p>'
            html += '<a class="get_price" href="item.html?id=data.itemId">分享我，约赚取' + (data.getPrice * user.getPoint / 100).toFixed(2) + '元</a>';
        } else if (data.isFree == 1) {
            html += '<a class="get_price" href="free.html?id=data.itemId&gid=data.goodId">点击这里可以免单</a>';
        }
        html += '                    </div>\n' +
            '                    </div>\n' +
            '                </div>\n' +
            '            </div>\n';
        $.each(data.itemImages, function (i, image) {
            html +=
                '            <div class="wechat-group-content">\n' +
                '                <div class="po-avt-wrap">\n' +
                '                    <img class="po-avt" src="' + user.head + '">\n' +
                '                </div>\n' +
                '                <div class="po-cmt po-image">\n' +
                '                    <p class="po-name">\n' +
                '                        ' + user.nickname + '\n' +
                '                    </p>\n' +
                '<div class="my-gallery" itemscope="" itemtype="http://schema.org/ImageGallery">' +
                '  <figure class="img-wrap" itemprop="associatedMedia" itemscope="" itemtype="http://schema.org/ImageObject" good_count="' + data.goodId + '">\n' +
                '        <a href="' + imgUrl + image.imgPath + '"  itemprop="contentUrl" data-size="1980x1080">' +
                ' <img  class="figure-image image-item""    src="' + imgUrl + image.imgPath + '"  itemprop="thumbnail"  alt="' + (image.imgIndex) + '" /> </a>\n' +
                '        <figcaption  itemprop="caption description">\n' +
                '          ' + data.itemTitle + '<br/>' + "原价" + data.sourcePrice + "元券后价【" + data.salePrice + "元】" + '\n';
            if (data.isFree == 0) {
                html += '<p class="copyTaoCode"><span style="color:red">复制这条信息，打开【手机淘宝】</span><span class="rushToBy" style="color:red">立即抢购</span></p>';
                if (user.getPoint != 0 && user.authorize == true) {
                    html += '<a class="get_price" href="item.html?id=data.itemId">分享我，约赚取' + (data.getPrice * user.getPoint / 100).toFixed(2) + '元</a>';
                }
            } else if (data.isFree == 1) {
                html += '<a class="get_price"  href="free.html?id=data.itemId&gid=data.goodId">点击这里可以免单</a>';
            }
            html += '        </figcaption>\n' +
                '    </figure>' +
                '            </div>\n' +
                '            </div>\n' +
                '            </div>\n';
            // Util_GetImgload(imgUrl+ image,initPhotoSwipeFromDOM('.my-gallery'));
        });
        html += '<div class="comment">\n' +
            '<span class="time" time="' + data.itemTime + '"></span>\n' +
            '</div>\n' +
            '        </li>';
    });
    $("ul").prepend(FShtml);
    $("ul").prepend(html);
    $("span.time").each(function () {
        var timeStr = $(this).attr("time");
        // $(this).html(Util_GetDateDiff(timeStr));
        Util_ChangeDateDiff($(this), timeStr);
    })
};

//初始化用户
var init_user = function(){
    $(".user>.user-name").text(user.nickname);
    $(".user>.user-img").attr("src", user.head);
};
//获取淘口令ajax
var GroupPage_GetTaoCode = function (taobao_id) {
    return '￥PfmiY32I22P￥';
    var taoCode = '';
    if (!GroupPage_AjaxConfig.ajaxing) {
        $.ajax({
            async: false,
            url: 'net/apptimes/GetTaoCodeById.ashx',
            type: 'get',
            dataType: 'json',
            data: {
                id: taobao_id,
                relation_id: user.rid,
                session: user.session
            },
            beforeSend: function () {
                GroupPage_AjaxConfig.ajaxing = true;
            },
            success: function (response) {
                taoCode = response.taoCode;
            },
            complete: function () {
                GroupPage_AjaxConfig.ajaxing = false;
            }
        });
    }
    // return taoCode;
};
// 获取宝贝的Id,存到cookie
var getGoodId=(function(){
    var topHeight = 0;
    var resultIndex;
    var scrollTop = $(document).scrollTop();

    $('#list').children('.item').each(function (i,ele){
        if (topHeight >=scrollTop+200){
            return;
        } else{
            topHeight += $(ele).height() + 30;
            resultIndex = i;
        }
    });
    var itemValue = $('.wechat-group').children('.item').eq(resultIndex).attr('goodId');
    return itemValue;
    // $.cookie('goodId', itemValue,{expires: 7});//存入cookie
})

var  getGoodsIdFromUrl=function(){
    var paramsObj = Util_GetUrlParams();
    if (paramsObj != undefined && paramsObj != null && paramsObj.goodsCookId != undefined && paramsObj.goodsCookId != null) {
        return paramsObj.goodsCookId;
    }else {
        return null;
    }
}
//页面加载的时候把页面定位到cookie存储的商品
var goodsPosition = function(){
    var paramGoodsId=getGoodsIdFromUrl();
    if (paramGoodsId!=null){
        goodId = paramGoodsId;
        GroupPage_AjaxConfig.ajaxData.goodId = goodId;
        GroupPage_GetItemsList();
        var positionItemTop = $('#list').children('li[goodId=' + goodId + ']').offset().top;
        window.scrollTo(0, positionItemTop);
    } else {
        GroupPage_GetItemsList();
    }
};
//复制淘口令
var Group_copyTaocode = function () {
    var Group_copyTaocode = new Clipboard('.getcode', {
        text: function (e) {
            if ($(e).attr("is_free") == 0) {
                var taoCode = GroupPage_GetCopyText($(e));
                $(e).find("span.rushToBy").text("领券下单" + taoCode);
            }
            return $(e).text();
        }
    });
    //获取复制文本
    var GroupPage_GetCopyText = function ($e) {
        var copyInfo = '',
            copyCode = $e.attr('copyCode');
        if (!copyCode) {
            copyCode = GroupPage_GetTaoCode($e.attr("taobao_id"));
            $e.attr('copyCode', copyCode);
        }
        copyInfo = copyCode;
        return copyInfo;
    };
    //复制成功
    Group_copyTaocode.on('success', function (e) {
        // m.alertContent("<p>领券成功</p><p>打开手机淘宝使用</p>");
        var content = "<div style='line-height:20px;padding:20px;margin-top:-9px'><p>领券成功</p><p>打开手机淘宝使用</p></div>";
        alerter(content);
    });
    Group_copyTaocode.on('error', function (e) {
        // m.alertContent("<p>领券失</p><p>请手动复制</p>");
        var content = "<p>领券失</p><p>请手动复制</p>";
        alerter(content);
    });
}

var GroupPage_GetPositionGoodId=function(goodId){
    var goodId=goodId;
    Attribute.ShareLink=goodId;
    WeixinJsSdk_SetEvent();
}
//鼠标上划事件
$(window).scroll(function (event) {
    if ($(window).scrollTop() <= 200){
        GroupPage_GetItemsList();
    }
    clearTimeout(groupTimer);
    groupTimer=setTimeout(function(){
        GroupPage_GetPositionGoodId(getGoodId());
    },1000)
});

//设置页面事件
var GroupPage_SetPageEvent = function () {};
//页面加载
var GroupPage_Init=function(){
    GroupPage_GetPositionGoodId()
    init_user();
    Group_copyTaocode();
    GroupPage_SetPageEvent();
    // GroupPage_GetItemsList();
    //每次页面加载的时候都走这个方法  只要url参数里有goodsId就代表是分享过来的链接  调试的时候直接 url加上goodsId就行
    goodsPosition();
};
var GroupPage = new Model_ItemsList();
var imgUrl = "http://bjq1.fzojq.info";



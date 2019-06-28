var friendTimer;
var goodCount = 0;
var picCount = 0;
var ajaxCount=0;
var userNickName=[];
var userComment=[];
var FriendPage_AjaxConfig = {
    ajaxing: false,
    ajaxUrl: "http://v.msno1.vip/goods_bbs_api/getitemslist",
    ajaxData: {
        pageNum: 0,
        pageCount: 20,
        isFree: "",
        keyWords: "",
        goodId:""
    },
    have: true,
};
//ajax 获取页面数据
var FriendPage_GetItemsList = function () {
    //设置keyWords
    var paramObj = Util_GetUrlParams();
    if (paramObj != null && paramObj.keyWords != undefined && paramObj.keyWords != null) {
        FriendPage_AjaxConfig.ajaxData.keyWords = paramObj.keyWords;
    }
    if (!FriendPage_AjaxConfig.ajaxing && FriendPage_AjaxConfig.have) {
        $.ajax({
            async: false,
            type: "get",
            url: FriendPage_AjaxConfig.ajaxUrl,
            dataType: "json",
            data: FriendPage_AjaxConfig.ajaxData,
            beforeSend: function () {
                FriendPage_AjaxConfig.ajaxing = true;
                $(".loading").show();
            },
            success: function (result) {
                if (result.QParams.pageCount < 20) {
                    FriendPage_AjaxConfig.have = false;
                } else {
                    FriendPage_AjaxConfig.have = true;
                }
                if (result.pageNum) {
                    FriendPage_AjaxConfig.ajaxData.pageNum = result.pageNum;
                } else {
                    FriendPage_AjaxConfig.ajaxData.pageNum++;
                }
                FriendPage.pageCount = result.Page_ItemCount;
                FriendPage.commmentCount = result.commmentCount;
                FriendPage.items = [];
                $.each(result.Items, function (i, data) {
                    var itemFriend = new Model_Item();
                    if (data.goods_info != undefined && data.goods_info != null) {
                        //商品idi
                        itemFriend.goodId = data.goods_info.id;
                        //商品名称
                        itemFriend.itemTitle = data.goods_info.name;
                        //商品组图
                        itemFriend.itemImages = data.CoverPics.map(function (value) {
                            return value.path;
                        });
                        //是否免单
                        itemFriend.isFree = data.goods_info.is_free;
                        //商品文案
                        itemFriend.itemBody = data.goods_info.item_body;
                        //淘宝商品id
                        itemFriend.itemId = data.goods_info.num_iid;
                        //商品原价
                        itemFriend.sourcePrice = data.goods_info.market_price;
                        //商品现价
                        itemFriend.salePrice = data.goods_info.price;
                        //佣金
                        itemFriend.getPrice = data.goods_info.tb_commission;
                        //优惠券金额
                        itemFriend.couponPrice = data.goods_info.coupon_price;
                        //商品发布时间
                        itemFriend.itemTime = data.goods_info.create_time;
                        itemFriend.commentContent = data.goods_info.commentContent;
                        // itemFriend.commentNum = data.goods_info.commentNum;
                        itemFriend.commentNum = 3;
                        // itemFriend.itemTime = timeago(data.goods_info.update_time);
                    }
                    FriendPage.items.push(itemFriend);

                })
            },
            error: function () {
                $(".loading").hide();
                console.log("请求商品数据出错");
            },
            complete: function () {
                FriendPage_AjaxConfig.ajaxData.goodId="";
                $(".loading").hide();
                FriendPage_BindItemsList();
                FriendPage_AjaxConfig.ajaxing = false;
                ajaxCount++;
            }
        })
    }
};
//ajax 获取评论用户的昵称
var FriendPage_GetNickName= function () {
        $.ajax({
            async: false,
            type: "get",
            url:" http://v.msno1.vip/goods_bbs_api/get_comment_users_by_random",
            dataType: "json",
            // data: "limit:  FriendPage.commmentCount ",//请求昵称的条数
            data:"limit:40",
            beforeSend: function () {},
            success: function (result) {
                $.each(result.data, function (i, data) {
                    userNickName.push(data.nickname);
                })
            },
            error: function () {},
            complete: function () {}
        })
};
//ajax 获取评论用户的评论内容
// var FriendPage_GetComment= function () {
//     $.ajax({
//         async: false,
//         type: "get",
//         url:"http://v.msno1.vip/goods_bbs_api/get_comment_rows_by_random",
//         dataType: "json",
//         data: "limit:20",
//         beforeSend: function () {},
//         success: function (result) {
//             var userCommentItem={
//                 CommentId:"",
//                 CommenContent:""
//             };
//             $.each(result.data, function (i, data) {
//                 userComment.CommentId=data.ID;
//                 userComment.CommentContent=data.JSON_Data.content;
//                 if(data.JSON_Data.content!=""&&data.JSON_Data.content!=undefined){
//                     userComment.push(userCommentItem);
//                 }
//             })
//         },
//         error: function () {},
//         complete: function () {}
//     })
// };
//绑定页面数据
var FriendPage_BindItemsList = function () {
    var FShtml="";
    var Fhtml = "";
    var Phtml = "";
    var i=0;
    FShtml += '<li class="item">\n' +
        '            <div class="po-avt-wrap">\n' +
        '                <img class="po-avt" src="' + user.head + '">\n' +
        '                </div>\n' +
        '                <div class="po-cmt">\n' +
        '                <div class="po-hd">\n' +
        '                <p class="po-name">\n' +
        '               ' + user.nickname + '\n' +
        '        </p>\n' +
        '</div>\n' +
        '      <div class="post free_post" >\n'+
        '<a  class="free_link" href="free.html" >\n';
        FShtml += '<img class="Free-image" src="image/free-sheet.jpg" style="max-width:30px;max-height:30px">';
    FShtml += '    <span class="post-title free_title">免单大福利，限量抢购100份</span>\n' +
        '</a>\n'+
        '</div>\n';
    FShtml += '   <div class="comment" style="">\n' +
        '<div class="left">\n' +
        '<span class="time" time="1分钟前"></span>\n';
    FShtml += '</div>\n';
    FShtml += '<div>\n' +
        '<a href="free.html">\n' +
        '   <div style="width:20px;height:14px;background:#f1f1f1;border-radius:2px;display: flex;justify-content: space-around;align-items:center">\n' +
        '            <div style="width:3px;height:3px;border-radius:50%;background: #1f2635;margin-left:2px" ></div>\n' +
        '            <div style="width:3px;height:3px;border-radius:50%;background: #1f2635;margin-right:2px"></div>\n' +
        '        </div>\n' +
        '</a>\n' +
        '     </div>\n' +
        '</div>\n' +
        '</li>';
    $.each(FriendPage.items, function (i, data) {
        var reg = new RegExp("/Public/static/kindeditor/plugins/", "g");
        data.itemBody = data.itemBody.replace(reg, imgUrl + "/Public/static/kindeditor/plugins/");
        // var ss = data.itemBody.match(/(?<=券后【).*(?=元)/);//获取原来的券后价
        data.itemBody = data.itemBody.replace(/天猫[\s\S]{1,7}元/g, '天猫' + data.sourcePrice + '元');//这个是替换原价
        data.itemBody = data.itemBody.replace(/聚划算[\s\S]{1,7}元/g, '聚划算' + data.sourcePrice + '元');//这个是替换原价
        data.itemBody = data.itemBody.replace(/券后[\s\S]{1,7}元/g, '券后【' + data.salePrice + '元');//这个是替换券后价
        data.itemBody = data.itemBody.replace(/卷后[\s\S]{1,7}元/g, '券后【' + data.salePrice + '元');//这个是替换券后价
        if (data.isFree == 1) {
            Fhtml += '<li class="item"  goodId="' + data.goodId + '">\n' +
                '            <div class="po-avt-wrap">\n' +
                '                <img class="po-avt" src="' + user.head + '">\n' +
                '                </div>\n' +
                '                <div class="po-cmt">\n' +
                '                <div class="po-hd">\n' +
                '                <p class="po-name">\n' +
                '               ' + user.nickname + '\n' +
                '        </p>\n' +
                '</div>\n' +
                '      <div class="post free_post" taobao_id="' + data.itemId + '" is_free="' + data.isFree + '" >\n'+
                '<a  class="free_link" href="free.html?id='+data.itemId+'&gid='+data.goodId+'">\n';
                $.each(data.itemImages,function(i,image){
                    Fhtml += '<img class="Free-image" src="'+ imgUrl + image +'" style="max-width:30px;max-height:30px">';
                })
            Fhtml += '    <span class="post-title free_title">' + data.itemTitle + '</span>\n' +
                '</a>\n'+
                '</div>\n';
            Fhtml += '   <div class="comment">\n' +
                '<div class="left">\n' +
                '<span class="time" time="' + data.itemTime + '"></span>\n';
            Fhtml += '</div>\n';
            Fhtml += '<div>\n' +
                '<a href="free.html?id='+data.itemId+'&gid='+data.goodId+'">\n' +
                '   <div style="width:20px;height:14px;background:#f1f1f1;border-radius:2px;display: flex;justify-content: space-around;align-items:center">\n' +
                '            <div style="width:3px;height:3px;border-radius:50%;background: #1f2635;margin-left:2px" ></div>\n' +
                '            <div style="width:3px;height:3px;border-radius:50%;background: #1f2635;margin-right:2px"></div>\n' +
                '        </div>\n' +
                '</a>\n' +
                '     </div>\n' +
                '</div>\n' +
                '</li>';
        } else if(data.isFree == 0){
            Phtml += '<li class="item"  goodId="' + data.goodId + '">\n' +
                '            <div class="po-avt-wrap">\n' +
                '                <img class="po-avt" src="' + user.head + '">\n' +
                '                </div>\n' +
                '                <div class="po-cmt">\n' +
                '                <div class="po-hd">\n' +
                '                <p class="po-name">\n' +
                '               ' + user.nickname + '\n' +
                '        </p>\n' +
                '      <div class="post getcode" taobao_id="' + data.itemId + '" is_free="' + data.isFree + '" >\n' +
                '        <p class="post-title">' + data.itemTitle + '</p>\n' +
                '                <p class="post-content">\n' +
                '                ' + data.itemBody + '\n' +
                '        </p>';
            Phtml += '<p class="copyTaoCode" ><span style="color:red">复制这条信息，打开【手机淘宝】</span><span class="rushToBy" style="color:red">立即抢购</span></p>'
            Phtml += '<a class="get_price"  href="item.html?id=data.itemId">分享我，约赚取' + (data.getPrice * user.getPoint / 100).toFixed(2) + '元</a>';
            Phtml += '</div>\n';
            Phtml += '<div class="my-gallery"  itemscope="" itemtype="http://schema.org/ImageGallery">';

            $.each(data.itemImages, function (i, image) {
                if (data.itemImages.length > 1) {
                    Phtml += '<figure style="background:url(' + imgUrl + image + ')  center center no-repeat;background-size:cover" class="img-wrap  multiple"   good_count="' + data.goodId + '" itemprop="associatedMedia" itemscope="" itemtype="http://schema.org/ImageObject">\n' +
                        '     <a href="' + imgUrl + image + '" itemprop="contentUrl" data-size="1024*1024"> ' +
                        '<img style="opacity: 0;" src="' + imgUrl + image + '"   class="image-item picCountMultiple" itemprop="thumbnail" alt="' + (picCount++) + '"/> ' +
                        '</a>\n' +
                        '<figcaption  itemprop="caption description">\n';
                    Phtml += '          ' + data.itemTitle + '<br/>' + "原价" + data.sourcePrice + "元券后价【" + data.salePrice + "元】" + '\n'
                    Phtml += '<p class="copyTaoCode" ><span style="color:red">复制这条信息，打开【手机淘宝】</span><span class="rushToBy" style="color:red">立即抢购</span></p>';
                    if (user.getPoint != 0 && user.authorize == true) {
                        Phtml += '<a style="margin-left:0" class="get_price"  href="item.html?id=data.itemId">分享我，约赚取' + (data.getPrice * user.getPoint / 100).toFixed(2) + '元</a>';
                    }
                    Phtml += '   </figcaption>\n' +
                        '    </figure>'
                } else {
                    Phtml += '  <figure class="img-wrap single" itemprop="associatedMedia" itemscope="" itemtype="http://schema.org/ImageObject">\n' +
                        '        <a href="' + imgUrl + image + '" itemprop="contentUrl" data-size="1024*1024"> ' +
                        '<img   src="'+ imgUrl + image +'"  class="image-item picCountSingle" itemprop="thumbnail" alt="' + (picCount++) + '" /> ' +
                        '</a>\n' +
                        '        <figcaption  itemprop="caption description">\n' +
                        '          ' + data.itemTitle + '<br/>' + "原价" + data.sourcePrice + "元券后价【" + data.salePrice + "元】" + '\n';
                    Phtml += '<p class="copyTaoCode" ><span style="color:red">复制这条信息，打开【手机淘宝】</span><span class="rushToBy" style="color:red">立即抢购</span></p>';
                    if (user.getPoint != 0 && user.authorize == true) {
                        Phtml += '<a style="margin-left:0" class="get_price"  href="item.html?id=data.itemId">分享我，约赚取' + (data.getPrice * user.getPoint / 100).toFixed(2) + '元</a>';
                    }
                    Phtml += '  </figcaption>\n' +
                        '    </figure>'
                }
            });
            Phtml += '</div>\n';
            Phtml += '   <div class="comment">\n' +
                '<div class="left">\n' +
                '<span class="time" time="' + data.itemTime + '"></span>\n';
            Phtml += '</div>\n';
            Phtml += '<div>\n' +
                '<a href="item.html?id=data.itemId">\n' +
                '   <div style="width:20px;height:14px;background:#f1f1f1;border-radius:2px;display: flex;justify-content: space-around;align-items:center">\n' +
                '            <div style="width:3px;height:3px;border-radius:50%;background: #1f2635;margin-left:2px" ></div>\n' +
                '            <div style="width:3px;height:3px;border-radius:50%;background: #1f2635;margin-right:2px"></div>\n' +
                '        </div>\n' +
                '</a>\n' +
                '     </div>\n' +
                '</div>\n';
                   Phtml+= '<di class="discuss-wrap" style="display:none">\n' +
                        '            <div class="discuss">\n';
                   if(data.commentNum){
                       for(var a=1;a<=data.commentNum;a++){
                           Phtml+= '            <div>\n' +
                               '      <span style="color:#0a2969;font-weight:bold " class="user-nickName">'+userNickName[i]+'</span><span class="comment-content">珍视明眼贴缓解眼疲劳护眼贴学生眼干保护视力淡化黑眼圈近视眼贴</span>\n' +
                               '            </div>\n' ;
                           i++;
                       }
                   }
            // if(data.commentContent){
            //     for(var a=1;a<=data.commentContent.length;a++){
            //         Phtml+= '            <div>\n' +
            //             '      <span style="color:#0a2969;font-weight:bold " class="user-nickName">'+userNickName[i]+'</span><span class="comment-content">'+data.commentContent[a]+'</span>\n' +
            //             '            </div>\n' ;
            //         i++;
            //     }
            // }

                      Phtml+= '            </div>\n' +
                        '        </div>\n';
           Phtml+='</li>';
        }
    });
    $("#div_each").append(FShtml);
    // $("#div_each").append(Fhtml);
    $("#div_each").append(Phtml);

    // var i=0;
    // var j=0;
    // $.each(JSON.parse($(".discuss-wrap").find(".comment-content").text()),function(i,content){
    //     if(content!=""&&content!=undefined){
    //         $(".discuss-wrap").find(".user-nickName")[j].html(userNickName[i]);
    //         i++;
    //         j++;
    //     }
    // });

    if($(".discuss-wrap").find("p").html()!=""){
        $(".discuss-wrap").css("display","block");
    }
    $("span.time").each(function () {
        var timeStr = $(this).attr("time");
        // $(this).html(Util_GetDateDiff(timeStr));
        Util_ChangeDateDiff($(this), timeStr);
    })
    initPhotoSwipeFromDOM('.my-gallery');
}
// 获取宝贝的Id,存到cookie
var getGoodId=function(){
    var topHeight=0;
    var resultIndex;
    var scrollTop = $(document).scrollTop();

    $('#list').children('.item').each(function (i, ele){
        if (topHeight >= scrollTop + 200){
            return;
        } else {
            topHeight += $(ele).height() + 25;
            resultIndex = i;
        }
    });
    var itemValue = $('.wechat-group').children('.item').eq(resultIndex).attr('goodId');
    return itemValue;
    // $.cookie('goodId', itemValue, {expires: 7});
};

var getGoodsIdFromUrl = function () {
    var paramsObj = Util_GetUrlParams();
    if (paramsObj != undefined && paramsObj != null && paramsObj.goodsCookId != undefined && paramsObj.goodsCookId != null) {
        return paramsObj.goodsCookId;
    } else {
        return null;
    }
}
//页面加载的时候把页面定位到cookie存储的商品
var goodsPosition = function () {
    var paramGoodsId = getGoodsIdFromUrl();
    if (paramGoodsId != null) {
        FriendPage_AjaxConfig.ajaxData.goodId = paramGoodsId;
        FriendPage_GetItemsList();
        var positionItemTop = $('#list').children('li[goodId=' + paramGoodsId + ']').offset().top;
        window.scrollTo(0, positionItemTop);
    } else {
        FriendPage_GetItemsList();
    }
};

//修改文案中字体大小和行高
var changeCss = function () {
    // $(".post").css({"font-size":"15px","line-height":"18px"})
}
//初始化用户
var init_user = function () {
    $(".user>.user-name").text(user.nickname);
    $(".user>.user-img").attr("src", user.head);
};
//获取淘口令
var FriendPage_GetTaoCode = function (taobao_id) {
    return '￥PfmiY32I22P￥';
    var taoCode = '';
    if (!FriendPage_AjaxConfig.ajaxing) {
        $.ajax({
            async: false,
            url: 'net/haodanku/GetItemsAll.ashx',
            type: 'POST',
            dataType: 'json',
            data: {
                id: taobao_id,
                relation_id: user.rid,
                session: user.session
            },
            beforeSend: function () {
                FriendPage_AjaxConfig.ajaxing = true;
            },
            success: function (result) {
                taoCode = result;
            },
            complete: function () {
                FriendPage_AjaxConfig.ajaxing = false;
            }
        });
    }
    // return taoCode;
};

$(window).scroll(function () {
    //为了保证兼容性，这里取两个值，哪个有值取哪一个
    //scrollTop就是触发滚轮事件时滚轮的高度
    var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    if (scrollTop >= 200) {
        $(".camera1").fadeOut(200);
        $(".camera2").fadeIn(200);
        $(".dd").fadeIn(200);
    } else {
        $(".camera1").fadeIn(200);
        $(".camera2").fadeOut(200);
        $(".dd").fadeOut(200);
    }
    //下拉滚动
    if ($(this).scrollTop() + $(window).height() + 20 >= $(document).height()) {
        FriendPage_GetItemsList();
    }
    clearTimeout(friendTimer);
    friendTimer=setTimeout(function(){
        FriendPage_GetPositionGoodId(getGoodId());
    },1000)

})
var FriendPage_GetPositionGoodId=function(goodId){
    var goodId=goodId;
    Attribute.ShareLink=goodId;
    WeixinJsSdk_SetEvent();
}
// $(window).scroll(function(event) {
//     if ($(window).scrollTop >= 300) {
//         $(".camera").children().eq(0).fadeOut(200);
//         $(".camera").children().eq(1).fadeIn(200);
//     }
// }
//设置头部图片的轮播
var headSwiper=function(){
    $('#item-images-slide').swipeslider({
        prevNextButtons: false,
        sliderHeight: $(window).width() + 'px',
        transitionDuration: 500,
        autoPlay: true,
        autoPlayTimeout: 4000,
        timingFunction: "ease-out",
        // prevNextButtons: true,
        bullets: true,
        swipe: true,
        sliderHeight: "60%"
    });
}
var Friend_copyTaocode=function(){
    //复制淘口令
    var Friend_copyTaocode = new Clipboard('.getcode', {
        text: function (e) {
            if ($(e).attr("is_free") == 0) {
                var taoCode = FriendPage_GetCopyText($(e));
                $(e).find("span.rushToBy").text("领券下单" + taoCode);
            }
            return $(e).text();
        }
    });
//获取复制文本
    var FriendPage_GetCopyText = function ($e) {
        var copyInfo = '',
            copyCode = $e.attr('copyCode');
        if (!copyCode) {
            copyCode = FriendPage_GetTaoCode($e.attr("taobao_id"));
            $e.attr('copyCode', copyCode);
        }
        copyInfo = copyCode;
        return copyInfo;
    };
//复制成功
    Friend_copyTaocode.on('success', function (e) {
        FriendPage_CopySuccess();
    });
    Friend_copyTaocode.on('error', function (e) {
        FriendPage_CopyError();
    });
    var FriendPage_CopySuccess = function () {
        // m.alertContent("<p>领券成功</p><p>打开手机淘宝使用</p>");
        var content = "<div style='line-height:20px;padding:20px;margin-top:-9px'><p>领券成功</p><p>打开手机淘宝使用</p></div>";
        alerter(content);
    };
    var FriendPage_CopyError = function () {
        // m.alertContent("<p>领券失</p><p>请手动复制</p>");
        var content = "<p>领券失</p><p>请手动复制</p>";
        alerter(content);
    }

}
//设置页面事件
var FriendPage_SetPageEvent = function () {};
//页面加载
var FriendPage_Init = function () {
    init_user();
    headSwiper();
    Friend_copyTaocode();
    FriendPage_SetPageEvent();
    FriendPage_GetNickName();
    // FriendPage_GetComment();
    goodsPosition();
};
var FriendPage = new Model_ItemsList();
var imgUrl = "http://bjq1.fzojq.info";





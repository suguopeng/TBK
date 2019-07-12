
//奖励金和福利金的总体展示
var Model_AwardBenefit=function(){
    return{
        //用户级别
        userLevel:"",
        //会员号
        memberID:0,
        //可提现的总金额
        totalAmount:0,
        //可提现的奖励金
        award:0,
        //可提现的福利金
        benefit:0,
    }
};
var award_benefit=new Model_AwardBenefit();
//奖励金详情模型
var Model_Award= function () {
    return {
        //累计已补贴
        cumulativeSubsidy:0,
        //奖励金可补贴
        awardSubsidible:0,
        //奖励金待确认的金额
        awardConfirmed:0,
        //用户提现金额
        // cashWithdrawal:$(".search-inp").val(),
    }
};
var award=new Model_Award();
//福利金详情模型
var Model_Benefit= function () {
    return {
        //累计已补贴
        cumulativeSubsidy:0,
        //福利金可补贴
        benefitSubsidible:0,
        //奖励金待确认的金额
        awardConfirmed:0,
        //用户提现金额
        cashWithdrawal:0,
    }
};
var benefit=new Model_Benefit();
//奖励金补贴记录模型
var Model_AwardSubsidyRecord=function(){
    return{
        //补贴用户
        subsidyUsers:"",
        //补贴金额
        subsidies:0,
        //申请提现的时间
        applyTime:0,
        //补贴状态
        examineState:"",
    }
};
//福利金补贴记录模型
var Model_BenefitSubsidyRecord=function(){
    return{
        //补贴用户
        subsidyUsers:"",
        //补贴金额
        subsidies:0,
        //申请提现的时间
        applyTime:0,
        //补贴状态
        examineState:"",
    }
};

//请求福利金和奖励金的总额显示
var CashOutPage_GetAwardBenefit=function(){
    $.ajax({
        type: "get",
        url: "http://localhost:63342/TBK/data/awardBenefit.json",
        dataType: "json",
        data:{
          uid:"",
        },
        beforeSend: function () {},
        success: function (result) {
            //用户级别
            award_benefit.userLevel=result.userLevel;
            //会员号
            award_benefit.memberID=result.memberID;
            //可提现的总金额
            award_benefit.totalAmount=result.totalAmount;
            //可提现的奖励金
            award_benefit.award=result.award;
            //可提现的福利金
            award_benefit.benefit=result.benefit;
        },
        error: function () {
            console.log("请求商品数据出错");
        },
        complete: function () {
            CashOutPage_BindAwardBenefit();
        }
    })
};
//绑定福利金和奖励金的总额显示
var  CashOutPage_BindAwardBenefit=function(){
    var T_html='';
    var AB_html='';
    T_html+=' <div class="head">\n' +
        '        <img id="my-head" src="image/userImg.jpg">\n' +
        '    </div>\n' +
        '    <div class="info">\n' +
        '        <div class="name"><em id="my-nickname">游客</em><span class="level"><i class="tbkfont"></i><em\n' +
        '                id="my-grade">'+award_benefit.userLevel+'</em></span>\n' +
        '        </div>\n' +
        '        <div class="text"><span>会员号:</span><em id="my-uid" onclick="">'+award_benefit.memberID+'</em></div>\n' +
        '    </div>\n' +
        '    <div class="total-bounty"><img style="width:20px;height:20px;" src="image/money-bag.png"\n' +
        '                                   alt=""><span>&nbsp'+award_benefit.totalAmount+'元</span></div>';
    $("#user").append(T_html);
    AB_html+= '                <div class="award"><span>￥'+award_benefit.award+'元</span><span>奖励金</span>\n' +
        '                    <button class="clickBtn awardBtn">奖励金提现</button>\n' +
        '                </div>\n' +
        '                <div class="delimiter"></div>\n' +
        '                <div class="benefit"><span>￥'+award_benefit.benefit+'元</span><span>福利金</span>\n' +
        '                    <button class="clickBtn benefitBtn">福利金提现</button>\n' +
        '                </div>\n';
    $(".award-and-benefit").append(AB_html);
    $(".awardBtn").click(function(){
        $(".applyAward-wrap").fadeIn();
        $(".applyBenefit-wrap").fadeOut();
    });
    $(".benefitBtn").click(function(){
        $(".applyBenefit-wrap").fadeIn();
        $(".applyAward-wrap").fadeOut();
    });
};
//获取奖励金的补贴信息
var CashOutPage_GetAward=function(){
    $.ajax({
        type: "get",
        url: "http://localhost:63342/TBK/data/award.json",
        dataType: "json",
        data:{
            uid:"",
        },
        beforeSend: function () {},
        success: function (result) {
            //累计已补贴
            award.cumulativeSubsidy=result.cumulativeSubsidy;
            //奖励金可补贴
            award.awardSubsidible=result.awardSubsidible;
            //奖励金待确认的金额
            award.awardConfirmed=result.awardConfirmed;
        },
        error: function () {
            console.log("请求商品数据出错");
        },
        complete: function () {
            CashOutPage_BindAward();
        }
    })
};

//绑定奖励金显示
var CashOutPage_BindAward=function(){
    $("#award-accumulated-subsidies").html('￥'+award.cumulativeSubsidy+'元');
    $("#award-subsidible").html('￥'+award.awardSubsidible+'元');
    $("#award-to-confirmed").html('￥'+award.awardConfirmed+'元');
};
//获取福利金的补贴信息
var CashOutPage_Getbenefit=function(){
    $.ajax({
        type: "get",
        url: "http://localhost:63342/TBK/data/benefit.json",
        dataType: "json",
        data:{
            uid:"",
        },
        beforeSend: function () {},
        success: function (result) {
            //累计已补贴
            benefit.cumulativeSubsidy=result.cumulativeSubsidy;
            //奖励金可补贴
            benefit.benefitSubsidible=result.benefitSubsidible;
            //奖励金待确认的金额
            benefit.benefitConfirmed=result.benefitConfirmed;
        },
        error: function () {
            console.log("请求商品数据出错");
        },
        complete: function () {
            CashOutPage_BindBenefit();
        }
    })
};
//绑定福利金显示
var CashOutPage_BindBenefit=function(){
    $("#benefit-accumulated-subsidies").html('￥'+benefit.cumulativeSubsidy+'元');
    $("#benefit-subsidible").html('￥'+benefit.benefitSubsidible+'元');
    $("#benefit-to-confirmed").html('￥'+benefit.benefitConfirmed+'元');
};

//设置奖励金的补贴记录
var awardSubsidys=[];
var CashOutPage_GetAwardsubsidy=function(){
    var pageNum=0;
    $.ajax({
        type: "get",
        url: "http://localhost:63342/TBK/data/awardSubsidyRecord.json",
        dataType: "json",
        data:{
            pageCount:1,
            pageNum:pageNum,
            uid:"",
        },
        beforeSend: function () {},
        success: function (result) {
          pageNum++;
            $.each(result.subsidyItems,function(i,data){
                var awardSubdisy=new Model_AwardSubsidyRecord();
                //补贴用户
                awardSubdisy.subsidyUsers=data.subsidyUsers;
                //补贴金额
                awardSubdisy.subsidies=data.subsidies;
                //申请提现的时间
                awardSubdisy.applyTime=Util_FormatDate(new Date(data.applyTime*1000));
                //补贴状态
                awardSubdisy.subsidyStatus=data.subsidyStatus;
                awardSubsidys.push(awardSubdisy);
            })
        },
        error: function () {
            console.log("请求商品数据出错");
        },
        complete: function () {
            CashOutPage_BindAwardSubsidyRecord();
        }
    })
};
//绑定奖励金补贴记录
var CashOutPage_BindAwardSubsidyRecord=function(){
    var html='';
    $.each(awardSubsidys,function(i,data){
        html+='<div class="award-subsidy-item">'+
            '            <div class="user-number">\n' +
            '                <span>'+data.subsidyUsers+'</span>\n' +
            '                <span>￥'+data.subsidies+'元</span>\n' +
            '            </div>\n' +
            '            <div class="time" >\n' +
            '                <span>'+data.applyTime+'</span>\n' +
            '                <span>'+data.subsidyStatus+'</span>\n' +
            '            </div>\n'+
        '</div>';
    });
    $(".award-subsidy-items").append(html);
};
//设置福利金的补贴记录
var benefitSubsidys=[];
var CashOutPage_GetBenefitsubsidy=function(){
    var pageNum=0;
    $.ajax({
        type: "get",
        url: "http://localhost:63342/TBK/data/benefitSubsidyRecord.json",
        dataType: "json",
        data:{
            pageCount:1,
            pageNum:pageNum,
            uid:"",
        },
        beforeSend: function () {},
        success: function (result) {
            pageNum++;
            $.each(result.subsidyItems,function(i,data){
                var benefitSubsidy=new Model_BenefitSubsidyRecord();
                //补贴用户
                benefitSubsidy.subsidyUsers=data.subsidyUsers;
                //补贴金额
                benefitSubsidy.subsidies=data.subsidies;
                //申请提现的时间
                benefitSubsidy.applyTime=Util_FormatDate(new Date(benefitSubsidy.applyTime*1000));
                //补贴状态
                benefitSubsidy.subsidyStatus=data.subsidyStatus;
                benefitSubsidys.push(benefitSubsidy);
            })
        },
        error: function () {
            console.log("请求商品数据出错");
        },
        complete: function () {
            CashOutPage_BindBenefitSubsidyRecord();
        }
    })
};
//绑定福利金补贴记录
var CashOutPage_BindBenefitSubsidyRecord=function(){
    var html='';
    $.each(awardSubsidys,function(i,data){
        html+='<div class="benefit-subsidy-item">'+
            '            <div class="user-number">\n' +
            '                <span>'+data.subsidyUsers+'</span>\n' +
            '                <span>￥'+data.subsidies+'元</span>\n' +
            '            </div>\n' +
            '            <div class="time" >\n' +
            '                <span>'+data.applyTime+'</span>\n' +
            '                <span>'+data.subsidyStatus+'</span>\n' +
            '            </div>\n'+
            '</div>';
    })
    $(".benefit-subsidy-items").append(html);
};
//设置页面事件
var  CashOutPage_SetPageEvent =function(){
    $(".apply-btn").click(function(){
        if(user.subsrcibe==false){
            var content="<div style='display:flex;justify-content:flex-start;align-items:center;margin:10px 20px;'><img style='width:15px;height:15px;margin-top:5px' src='image/warn.png' alt=''><span style='margin-left:4px;margin-top:5px'>请关注公众号后再提交申请！</span></div>";
            alerter(content);
            return;
        }
        if($(".search-inp").val()==undefined || $(".search-inp").val()=="" || $(".search-inp").val()==null){
            var content="<div style='display:flex;justify-content:flex-start;align-items:center;margin:10px 20px;'><img style='width:25px;height:25px;margin-top:5px' src='image/fork-number.png' alt=''><span style='margin-left:2px'>请填写金额！</span></div>";
            alerter(content);
            return;
        }
        $.ajax({
            type: "post",
            url: "",
            dataType: "json",
            data:{
               value:$(".search-inp").val(),
                uid:"",
            },
            beforeSend: function () {},
            success: function (result) {
                var content="<div style='margin:10px 20px'>提现成功</div>";
                alerter(content);
            },
            error: function () {
                var content="<div style='margin:10px 20px'>提现失败</div>";
                alerter(content);
            },
            complete: function () {}
        })
    });
};
//页面加载
var CashOutPage_Init=function(){
    CashOutPage_GetAwardBenefit();
    CashOutPage_GetAward();
    CashOutPage_Getbenefit();
    CashOutPage_GetAwardsubsidy();
    CashOutPage_GetBenefitsubsidy();
    CashOutPage_SetPageEvent();
};
$(document).ready(function(){
    CashOutPage_Init();
});

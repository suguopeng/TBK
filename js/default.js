//alert重写
window.alert = function (name) {
    var iframe = document.createElement("IFRAME");
    iframe.style.display = "none";
    iframe.setAttribute("src", 'data:text/plain,');
    document.documentElement.appendChild(iframe);
    window.frames[0].window.alert(name);
    iframe.parentNode.removeChild(iframe);
}
//confirm重写
window.confirm = function (name) {
    var iframe = document.createElement("IFRAME");
    iframe.style.display = "none";
    iframe.setAttribute("src", 'data:text/plain,');
    document.documentElement.appendChild(iframe);
    var result = window.frames[0].window.confirm(name);
    iframe.parentNode.removeChild(iframe);
    return result;
}

//转换我们的口令
var Util_ConvertToken = function (str) {
    var reg = /[a-zA-Z0-9]{9,13}/;
    if (reg.test(str)) {
        str = '(' + str.match(reg)[0] + ')';
    }
    return str;
}

//验证数字
var Util_CheckNumber = function (str) {
    str = str.trim();
    var reg = /[0-9]{8,20}/g;
    if (reg.test(str)) {
        var strs = str.match(reg);
        return strs.join(',');
    } else {
        return false;
    }
}

//验证淘口令
var Util_CheckToken = function (str) {
    // var reg1 = /￥[a-zA-Z0-9]{9,13}￥/;
    // var reg2 = /\([a-zA-Z0-9]{9,13}\)/;
    // var reg3 = /[a-zA-Z0-9]{9,13}/;
    // if (reg1.test(str)) {
    //     str = str.match(reg1)[0];
    //     str = '￥' + str.match(reg3)[0] + '￥';
    //     return str;
    // } else if (reg2.test(str)) {
    //     str = str.match(reg2)[0];
    //     str = '￥' + str.match(reg3)[0] + '￥';
    //     return str;
    // } else {
    //     return false;
    // }
    var reg = /[^\u4e00-\u9fa5_a-zA-Z0-9][a-zA-Z0-9]{9,13}[^\u4e00-\u9fa5a-zA-Z0-9]/g;
    var reg0 = /[a-zA-Z0-9]{9,13}/;
    if (reg.test(str)) {
        var strs = str.match(reg);
        for (var i in strs) {
            strs[i] = '￥' + strs[i].match(reg0)[0] + '￥';
        }
        return strs.join(',');
    } else {
        return false;
    }
}
//验证邀请码
var Util_CheckCode = function (str) {
    var urls = Util_CheckUrl(str);
    for (var i in urls) {
        str = str.replace(urls[i], '');
    }
    var reg = /[a-zA-Z0-9]{4,12}/g;
    if (reg.test(str)) {
        var strs = str.match(reg);
        return strs;
    } else {
        return false;
    }
}
//验证页面链接
var Util_CheckUrl = function (str) {
    var reg = /((https?|http|ftp|file):)?\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/g;
    if (reg.test(str)) {
        var strs = str.match(reg);
        return strs;
    } else {
        return false;
    }
}
//换行符转换行
var Util_EnterToBr = function (str) {
    str = str.replace(/[\r\n]/g, '<br />');
    return str;
}
//换行转换行符
var Util_BrToEnter = function (str) {
    str = str.replace(/<br\s*\/?>/g, '\r\n');
    return str;
}
//字符串去回车
var Util_ParseEnter = function (str) {
    str = str.replace(/[\r\n]/g, '');
    return str;
}
//字符串去空格
var Util_ParseSpace = function (str) {
    str = str.trim();
    return str;
}
//字符串完全去空格
var Util_SpaceToNull = function (str) {
    str = str.replace(/\s+/g, '');
    return str;
}
//获取所有url地址
var Util_StringToUrls = function (str) {
    //var reg = /(http:\/\/|https:\/\/)((\w|=|\?|\.|\/|&|-)+)/g;
    //var reg = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    //var reg=/(http(s)?\:\/\/)?(www\.)?(\w+\:\d+)?(\/\w+)+\.(swf|gif|jpg|bmp|jpeg)/gi;
    //var reg=/(http(s)?\:\/\/)?(www\.)?(\w+\:\d+)?(\/\w+)+\.(swf|gif|jpg|bmp|jpeg)/gi;
    var reg = /((https?|http|ftp|file):)?\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/g;
    //var reg= /^((ht|f)tps?):\/\/[\w\-]+(\.[\w\-]+)+([\w\-\.,@?^=%&:\/~\+#]*[\w\-\@?^=%&\/~\+#])?$/;
    //str = str.replace(reg, '<a href='$1$2'>$1$2</a>'); //这里的reg就是上面的正则表达式
    //str = str.replace(reg, "$1$2"); //这里的reg就是上面的正则表达式
    var urls = str.match(reg);
    return urls;
}
//获取比价器地址
var Util_SearchUrl = function () {
    var pageUrl = Util_GetUrlDelParam();
    var pathname = window.location.pathname.replace('/', '');
    if (pathname) {
        pageUrl = pageUrl.replace(pathname, 'search.html');
    }
    return pageUrl;
}
//替换页面地址
var Util_ReplaceUrl = function (name1, name2) {
    var pageUrl = Util_GetUrlDelParam();
    pageUrl = pageUrl.replace(name1, name2);
    return pageUrl;
}
//更改浏览器地址栏
var Util_ChangeUrl = function (url, type) {
    type = type || '';
    if (url) {
        if (type == 'new') {
            history.pushState({}, null, url);
        } else {
            history.replaceState({}, null, url);
        }
    }
}
//获取地址栏参数
var Util_GetUrlParams = function (url) {
    var theRequest = new Object();
    if (!url) {
        url = window.location.href;
    }
    if (url.indexOf('?') !== -1) {
        var str = url.substr(url.indexOf('?') + 1).replace(/\?/g, '&') + '&';
        var strs = str.split('&');
        for (var i = 0; i < strs.length - 1; i++) {
            var key = strs[i].substring(0, strs[i].indexOf('='));
            var val = strs[i].substring(strs[i].indexOf('=') + 1);
            theRequest[key] = val;
        }
    }
    return theRequest;
}
// 删除url中多个参数
var Util_GetUrlDelParam = function (paramKeys, url) {
    paramKeys = paramKeys || 'FromAuth,code,wx_openid';
    if (!url) {
        url = window.location.href;
    }
    var urlParam = '';
    if (url.indexOf('?') > -1) {
        urlParam = url.substr(url.indexOf('?') + 1).replace(/\?/g, '&'); //页面参数
    }
    if (url.indexOf('uid') == -1) {
        if (url.indexOf('?') > -1) {
            url += '&';
        } else {
            url += '?';
        }
        url += 'uid=' + user.id;
    }
    var beforeUrl = url.substr(0, url.indexOf('?')) || url; //页面主地址（参数之前地址）
    var nextUrl = '';
    var paramKeys = paramKeys.split(',');

    var arr = new Array();
    if (urlParam != '') {
        var urlParamArr = urlParam.split('&'); //将参数按照&符分成数组
        for (var i = 0; i < urlParamArr.length; i++) {
            var paramArr = urlParamArr[i].split('='); //将参数键，值拆开
            //如果键雨要删除的不一致，则加入到参数中
            if (!Util_StrInArray(paramArr[0], paramKeys)) {
                arr.push(urlParamArr[i]);
            }
        }
    }
    if (arr.length > 0) {
        nextUrl = '?' + arr.join('&');
    }
    url = (beforeUrl + nextUrl) || url;
    return url;
}
//地址栏参数改变
var Util_GetUrlChangeParam = function (key, value, url) {
    if (!url) {
        url = window.location.href;
    }
    url = Util_GetUrlDelParam(key, url);
    if (value) {
        if (url.indexOf('?') > -1) {
            url += '&';
        } else {
            url += '?';
        }
        url += key + '=' + value;
    }
    return url;
}

//计算时间差
var Util_GetTimeLeave = function (endTime) { //di作为一个变量传进来
    endTime = endTime || new Date();
    //如果时间格式是正确的，那下面这一步转化时间格式就可以不用了
    var dateEnd = new Date(endTime.replace(/-/g, '/')); //将-转化为/，使用new Date
    var dateBegin = new Date(); //获取当前时间
    var dateDiff = dateEnd.getTime() - dateBegin.getTime(); //时间差的毫秒数
    var days = Math.floor(dateDiff / (24 * 3600 * 1000)); //计算出相差天数
    var leave1 = dateDiff % (24 * 3600 * 1000); //计算天数后剩余的毫秒数
    var hours = Math.floor(leave1 / (3600 * 1000)); //计算出小时数
    //计算相差分钟数
    var leave2 = leave1 % (3600 * 1000); //计算小时数后剩余的毫秒数
    var minutes = Math.floor(leave2 / (60 * 1000)); //计算相差分钟数
    //计算相差秒数
    var leave3 = leave2 % (60 * 1000); //计算分钟数后剩余的毫秒数
    var seconds = Math.round(leave3 / 1000);
    return {
        dateDiff: dateDiff,
        days: days,
        hours: hours,
        minutes: minutes,
        seconds: seconds
    }
}

var Util_GetTimeLeaveHtml = function (timeLeave) {
    //将倒计时显示在传入的组件上
    var countHtml = '';
    if (timeLeave.days > 0) {
        countHtml += '<span class="day"><em>' + timeLeave.days + '</em>天</span>';
    }
    if (timeLeave.hours > 0) {
        countHtml += '<span class="hour"><em>' + timeLeave.hours + '</em>时</span>';
    }
    if (timeLeave.minutes > 0) {
        countHtml += '<span class="minute"><em>' + timeLeave.minutes + '</em>分</span>';
    }
    if (timeLeave.seconds > 0) {
        countHtml += '<span class="second"><em>' + timeLeave.seconds + '</em>秒</span>';
    }
    return countHtml;
}
//获取倒计时方法
var Util_GetCountDown = function (countDom, endTime, strLeave) {
    //默认前缀
    strLeave = strLeave || '剩余时间:';
    if (strLeave == 'null') {
        strLeave = '';
    }
    //初始化计时器，计算剩余时间
    var timer = null,
        timeLeave = Util_GetTimeLeave(endTime);

    var countHtml = Util_GetTimeLeaveHtml(timeLeave);
    countDom.html(strLeave + countHtml);
    timer = setInterval(function () {
        //重新计算剩余 时间
        timeLeave = Util_GetTimeLeave(endTime);
        //将倒计时显示在传入的组件上
        var countHtml = Util_GetTimeLeaveHtml(timeLeave);
        countDom.html(strLeave + countHtml);
    }, 1000);
    if (timeLeave.dateDiff <= 0) {
        //计时时间超过当前时间提示已结束
        countDom.html(strLeave + '<span>已结束</span>');
        //清空计时器
        clearInterval(timer);
    }
    return timer;
}

//获取一天开始结束时间
var Util_GetDayBeginEnd = function (date) {
    date = date || new Date();
    var year = date.getFullYear(),
        month = date.getMonth() + 1,
        day = date.getDate();
    if (month < 10) {
        month = '0' + month;
    }
    if (day < 10) {
        day = '0' + day;
    }
    var begin = year + '-' + month + '-' + day + ' 00:00:00',
        end = year + '-' + month + '-' + day + ' 23:59:59';

    return {
        begin: begin,
        end: end
    }
}
//获取今天开始结束时间
var Util_GetTodayDatetime = function () {
    var datetime = new Date(),
        today = datetime,
        todayBeginEnd = Util_GetDayBeginEnd(today);
    return {
        begin: todayBeginEnd.begin,
        end: todayBeginEnd.end
    }
}
//获取昨天开始结束时间
var Util_GetYesterdayDatetime = function () {
    var datetime = new Date(),
        yesterday = new Date(datetime.setDate(datetime.getDate() - 1)),
        yesterBeginEnd = Util_GetDayBeginEnd(yesterday);
    return {
        begin: yesterBeginEnd.begin,
        end: yesterBeginEnd.end
    }
}
//获取本周开始结束时间
var Util_GetThisweekDatetime = function () {
    var datetime1 = new Date(),
        datetime2 = new Date(),
        thisweekFirstday = new Date(datetime1.setDate(datetime1.getDate() - (datetime1.getDay() || 7) + 1)),
        thisweekLastday = new Date(datetime2.setDate(datetime2.getDate() - (datetime2.getDay() || 7) + 7)),
        thisweekBegin = Util_GetDayBeginEnd(thisweekFirstday).begin,
        thisweekEnd = Util_GetDayBeginEnd(thisweekLastday).end;
    return {
        begin: thisweekBegin,
        end: thisweekEnd
    }
}
//获取上周开始结束时间
var Util_GetLastweekDatetime = function () {
    var datetime1 = new Date(),
        datetime2 = new Date(),
        lastweekFirstday = new Date(datetime1.setDate(datetime1.getDate() - (datetime1.getDay() || 7) - 6)),
        lastweekLastday = new Date(datetime2.setDate(datetime2.getDate() - (datetime2.getDay() || 7))),
        lastweekBegin = Util_GetDayBeginEnd(lastweekFirstday).begin,
        lastweekEnd = Util_GetDayBeginEnd(lastweekLastday).end;
    return {
        begin: lastweekBegin,
        end: lastweekEnd
    }
}
//获取本月开始结束时间
var Util_GetThismonthDatetime = function () {
    var datetime1 = new Date(),
        thismonthFirstday = new Date(datetime1.getFullYear(), datetime1.getMonth(), 1),
        nextmonthFirstday = new Date(datetime1.getFullYear(), datetime1.getMonth() + 1, 1),
        thismonthLastday = new Date(nextmonthFirstday.setDate(nextmonthFirstday.getDate() - 1)),
        thismonthBegin = Util_GetDayBeginEnd(thismonthFirstday).begin,
        thismonthEnd = Util_GetDayBeginEnd(thismonthLastday).end;
    return {
        begin: thismonthBegin,
        end: thismonthEnd
    }
}
//获取上月开始结束时间
var Util_GetLastmonthDatetime = function () {
    var datetime = new Date(),
        lastmonthLastday = new Date(datetime.getFullYear(), datetime.getMonth(), 0),
        lastmonthFirstday = new Date(lastmonthLastday.getFullYear(), lastmonthLastday.getMonth(), 1),
        lastmonthBegin = Util_GetDayBeginEnd(lastmonthFirstday).begin,
        lastmonthEnd = Util_GetDayBeginEnd(lastmonthLastday).end;
    return {
        begin: lastmonthBegin,
        end: lastmonthEnd
    }
}
//获取历史天数开始结束
var Util_GetHistoryDatetime = function () {
    var datetime = new Date(),
        today = datetime,
        historyday = new Date(1970, 0, 1),
        historyBengin = Util_GetDayBeginEnd(historyday).begin,
        historyEnd = Util_GetDayBeginEnd(today).end;
    return {
        begin: historyBengin,
        end: historyEnd
    }
}


//设置时间格式
var Util_GetDateDiff = function (dateTimeStamp) {

    var dLength = 13 - String(dateTimeStamp).length;
    dateTimeStamp = dateTimeStamp * Math.pow(10, dLength);

    var result = '';
    var second = 1000;
    var minute = second * 60;
    var hour = minute * 60;
    var day = hour * 24;
    var month = day * 30;
    var now = new Date().getTime();
    var diffValue = now - dateTimeStamp;
    var monthC = diffValue / month;
    var weekC = diffValue / (7 * day);
    var dayC = diffValue / day;
    var hourC = diffValue / hour;
    var minC = diffValue / minute;
    var secondC = diffValue / second;

    if (monthC >= 1) {
        result = '' + parseInt(monthC) + '月前';
    } else if (weekC >= 1) {
        result = '' + parseInt(weekC) + '周前';
    } else if (dayC >= 1) {
        result = '' + parseInt(dayC) + '天前';
    } else if (hourC >= 1) {
        result = '' + parseInt(hourC) + '小时前';
    } else if (minC >= 1) {
        result = '' + parseInt(minC) + '分钟前';
    } else if (secondC >= 1) {
        result = '' + parseInt(secondC) + '秒前';
    } else {
        result = '刚刚';
    }

    return result;
}

//每秒变化时间
var Util_ChangeDateDiff = function (dom, dateTimeStamp) {
    dom.html(Util_GetDateDiff(dateTimeStamp));
    setTimeout(function () {
        Util_ChangeDateDiff(dom, dateTimeStamp);
    }, 1000);
}

//时间格式化
var Util_FormatDate = function (date, formatType) {
    // var date = new Date(date)
     date = date || new Date();
    var year = date.getFullYear(),
        month = date.getMonth() + 1,
        day = date.getDate(),
        hour = date.getHours(),
        minute = date.getMinutes(),
        second = date.getSeconds();

    if (month < 10) {
        month = '0' + month;
    }
    if (day < 10) {
        day = '0' + day;
    }
    if (hour < 10) {
        hour = '0' + hour;
    }
    if (minute < 10) {
        minute = '0' + minute;
    }
    if (second < 10) {
        second = '0' + second;
    }
    var dateStr = '';
    switch (formatType) {
        case 'day': {
            dateStr = year + '-' + month + '-' + day;
            break;
        }
        case 'second': {
            dateStr = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
            break;
        }
        default: {
            dateStr = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
            break;
        }
    }
    return dateStr;
}

//价格转换
var Util_GetPriceConvert = function (sPrice) {
    sPrice = String(sPrice);
    return {
        priceBefore: sPrice.split('.')[0],
        priceAfter: sPrice.split('.')[1] || '00'
    }
}

var Util_IsInArray = function (arr, value) {
    for (var i in arr) {
        if (value == arr[i]) {
            return true;
        }
    }
    return false;
}

//判断字符串是否在数组中
var Util_StrInArray = function (stringToSearch, arrayToSearch) {
    for (s = 0; s < arrayToSearch.length; s++) {
        thisEntry = arrayToSearch[s].toString();
        if (thisEntry == stringToSearch) {
            return true;
        }
    }
    return false;
}
//获取数组最小值索引
var Util_GetIndexOfArrMin = function (arr) {
    var lowest = 0;
    for (var i = 1; i < arr.length; i++) {
        if (arr[i] < arr[lowest]) lowest = i;
    }
    return lowest;
}
//图片加载完成
var Util_GetImgload = function (url, callback) {
    var img = new Image();
    img.src = url;

    //如果图片被缓存，则直接返回缓存数据
    if (img.complete) {
        /* callback(img.width, img.height); */
        callback(img.width, img.height);
    } else {
        //完全加载完毕的事件
        img.onload = function () {
            /* callback(img.width, img.height); */
            callback(img.width, img.height);
        }
    }
}

//文字转utf8
var Util_ToUtf8 = function (str) {
    var out, i, len, c;
    out = '';
    len = str.length;
    for (i = 0; i < len; i++) {
        c = str.charCodeAt(i);
        if ((c >= 0x0001) && (c <= 0x007F)) {
            out += str.charAt(i);
        } else if (c > 0x07FF) {
            out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
            out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));
            out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
        } else {
            out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));
            out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
        }
    }
    return out;
}
//layer插件
var alerter=function(content){
    layer.open({
        type: 1,
        time:2000,
        // offset: ['100px', '50px'],
        area: ['280px', '150px'],
        shadeClose: true, //点击遮罩关闭
        btn: ['确定'],
        content:content
    });
}
/*********************************************************以上为公共工具方法**********************************************/

var Attribute = {
    //比价器公众号URL
    ApiBjqUrl: 'http://bjq1.fzojq.info',
    //秒杀1号站公众号URL
    ApiMsUrl: 'http://ms1.fzojq.info',
    //站点名称
    SideName: '秒杀1号站',
    //站点域名
    SideUrl: 'http://www.520share3.info',
    //ajax默认秘钥
    AjaxToken: 'default',
    //浏览器类型
    BrowserType: 'other',
    //页面名称
    PageName: '',
    //导航条链接
    NavLinks: [{
        pages: ['search'],
        href: 'search.html',
        text: '比价器',
        icon: '&#xe637;',
        type: 'page'
        //icon: '&#xe639;'
    }, {
        pages: ['goods', 'items', 'frees'],
        href: 'goods.html',
        text: '精选商品',
        icon: '&#xe638;',
        type: 'page'
    }, {
        pages: ['pages'],
        text: '功能大全',
        icon: '&#xe63f;',
        type: 'pages'
    }, {
        pages: ['friend'],
        href: 'http://ms1.fzojq.info/mobile/goods.coupon/index',
        text: '超级朋友圈',
        icon: '&#xe63c;',
        type: 'page'
    }, {
        pages: ['user'],
        //href: 'http://bjq1.fzojq.info/User/user_center',
        href: 'user.html',
        text: '用户中心',
        icon: '&#xe633;',
        type: 'page'
    }],
    Pages: [{
        name: 'search',
        href: 'search.html',
        text: '比价器',
        icon: '&#xe637;'
        //icon: '&#xe639;'
    }, {
        name: 'goods',
        href: 'goods.html',
        text: '精选商品',
        icon: '&#xe638;'
    }, {
        name: 'qrcode',
        href: 'http://bjq1.fzojq.info/QRCode/qrlist',
        text: '推广二维码',
        icon: '&#xe63a;'
    },
        /*{
            name: 'items',
            href: 'items.html',
            text: '全网商品',
            icon: '&#xe646;'
        },*/
        {
            name: 'authhelp',
            href: 'authhelp.html',
            text: '淘宝授权',
            icon: '&#xe647;'
        },
        /*{
            name: 'authorize',
            href: 'authorize.html',
            text: '淘宝授权',
            icon: '&#xe647;'
        }, {
            name: 'authhelp',
            href: 'authhelp.html',
            text: '授权须知',
            icon: '&#xe648;'
        }, */
        {
            name: 'friend',
            href: 'http://ms1.fzojq.info/mobile/goods.coupon/index',
            text: '超级朋友圈',
            icon: '&#xe63c;'
        }, {
            name: 'group',
            href: 'http://bjq1.fzojq.info/Group/index',
            text: '超级微信群',
            icon: '&#xe635;'
        },
        /* {
            name: 'qq',
            href: 'http://bjq1.fzojq.info/Group/goGroupByScan',
            text: 'VIP福利群',
            icon: '&#xe63d;'
        }, */
        {
            name: 'order',
            href: 'http://bjq1.fzojq.info/User/order_details/type/all',
            text: '订单查询',
            icon: '&#xe636;'
        }, {
            name: 'free',
            href: 'myfree.html',
            //href: 'http://bjq1.fzojq.info/free/submit_order',
            text: '免单中心',
            icon: '&#xe63e;'
        }, {
            name: 'team',
            href: 'http://bjq1.fzojq.info/user/my_team',
            text: '团队通讯录',
            icon: '&#xe641;'
        },
        // {
        //     name: 'help',
        //     href: 'http://wap.edujia.com/article2/share/index.html?articleid=289528',
        //     text: '新手上路',
        //     icon: '&#xe63b;'
        // },
        {
            name: 'fans',
            href: 'http://bjq1.fzojq.info/Goods/cardBuy',
            text: '秒杀死粉',
            icon: '&#xe640;'
        }, {
            name: 'user',
            //href: 'http://bjq1.fzojq.info/User/user_center',
            href: 'user.html',
            text: '用户中心',
            icon: '&#xe633;'
        }, {
            name: 'weixin',
            href: 'http://bjq1.fzojq.info/Article/help_item/document_id/4615',
            text: '微信客服',
            icon: '&#xe645;'
        }
    ],
    ShareTitle: '',
    ShareLink: '',
    ShareDesc: '',
    ShareImgUrl: ''
}



/*********************************************************以上为公共属性**********************************************/

//奖励金列表模型
var Model_AwardList = function () {
    return {
        totalCount: 0,
        pageNum: 0,
        pageCount: 0,
        awards: [],
    };
};
//奖励金详情模型
var Model_AwardDetail = function () {
    return {
        //订单的时间
        orderTime:{},
        //时间轴
        axisTime:{},
        //奖励金增加还是减少
        bountyChange:0,
        //奖励金改变的数量
        bounty:"",
        //奖励金改变后的数量
        balance:"",
        //订单的来源
        orderFrom:"",
        //单号
        oddNum:"",
        //购买商品图片
        orderImg:"",
        //用户向卖家付款金额
        PaymentAmount:"",
        //我的佣金
        myCommission:"",
        //下属佣金
        branchCommission:""

    }
}
//用户模型
var Model_User = function () {
    return {
        id: '',
        pid: '', //推广位编号
        rid: '', //渠道编号
        session: '', //淘客识别号
        authorize: false, //渠道授权
        nickname: '游客',
        sex: 0,
        head: '',
        type: 'visitor', //用户类型
        grade: 0, //用户级别
        getPoint: 68.00,
        invite: '', //直属上级
        referrer: '', //推荐人
        openid: '', //公众号openid
        subsrcibe: false //是否关注公众号
    }
}
//商品模型
var Model_Item = function () {
    return {
        //宝贝id
        id: '',
        //宝贝名称
        title: '',
        //宝贝图片
        pic: '',
        //商品链接
        url: '',
        //图片地址列表
        images: [],
        //30天销量
        sold: 0,
        //原价
        sourcePrice: 0,
        //优惠券金额
        couponPrice: 0,
        //现价
        salePrice: 0,
        //佣金
        getPrice: 0,
        //优惠券名称
        couponName: '',
        //优惠券开始时间
        couponStartTime: '',
        //优惠券到期时间
        couponEndTime: '',
        //优惠券总数量
        couponTotalCount: 0,
        //优惠券剩余数量
        couponNowCount: 0,
        //淘宝客链接
        tbkUrl: '',
        //领券链接
        couponUrl: '',
        //淘口令
        taoCode: '',
        //店铺名称
        shopName: '',
        //店铺类型
        shopType: '',
        //店铺动态评分
        shopDsr: 0,
        //实际发放商品类型
        realItem: '',
        //后台设置的商品描述
        introduce: '',
        //免单pid
        freePid: '',
        //代理限免数量
        canFreeTime: 0,
        //免单需要免单券数量
        needFreeCouponCount: 0,
        //剩余免单名额
        remainFreeCount: 0,
        //总免单名额
        allFreeCount: 0,
        //免单活动结束时间
        freeEndTime: '',
        //免单金额
        freePrice: 0,
        //用户评论的内容
        commentContent: [],
        //每个商品评论的条数
        commentNum: ''
    }
}

//商品列表模型
var Model_ItemsList = function () {
    return {
        totalCount: 0,
        pageNum: 0,
        pageNumH: 0,
        pageCount: 0,
        items: []
    }
}

//商品详情模型
var Model_ItemDetail = function () {
    return {
        //宝贝id
        id: '',
        //宝贝名称
        title: '',
        //宝贝短名称
        subTitle: '',
        //宝贝图片
        pic: '',
        //商品链接
        url: '',
        //图片地址列表
        images: [],
        //宝贝详情图片
        desc: null,
        //宝贝详情地址
        descUrl: null,
        //宝贝详情页面
        descSrc: null,
        //视频地址
        video: '',
        //视频缩略图
        videoPic: '',
        //30天销量
        sold: 0,
        //收藏人气
        favCount: 0,
        //原价
        sourcePrice: 0,
        //优惠券金额
        couponPrice: 0,
        //现价
        salePrice: 0,
        //佣金
        getPrice: 0,
        //优惠券名称
        couponName: '',
        //优惠券开始时间
        couponStartTime: '',
        //优惠券到期时间
        couponEndTime: '',
        //优惠券总数量
        couponTotalCount: 0,
        //优惠券剩余数量
        couponNowCount: 0,
        //淘宝客链接
        tbkUrl: '',
        //领券链接
        couponUrl: '',
        //淘口令
        taoCode: '',
        //快递费用文字
        postPrice: '',
        //发货地址
        postFrom: '',
        //消费者保障
        consumerProtection: '',
        //店铺名称
        shopName: '',
        //店铺类型
        shopType: '',
        //店铺图标
        shopIcon: '',
        //店铺创建时间
        shopStarts: '',
        //好评率
        shopGoodRatePercentage: '',
        //信用图标
        shopCreditLevelIcon: '',
        //评分图标
        shopBrandIcon: '',
        //店铺宝贝描述
        shopDesc: 0,
        //宝贝描述同比
        shopDescLevel: 0,
        //店铺卖家服务
        shopServ: 0,
        //卖家服务同比
        shopServLevel: 0,
        //店铺物流服务
        shopPost: 0,
        //物流服务同比
        shopPostLevel: 0,
        //评价数量
        rateCount: 0,
        //评价关键词
        rateWords: null,
        //评价列表
        rates: null,
        //实际发放商品类型
        realItem: '',
        //后台设置的商品描述
        introduce: '',
        //免单pid
        freePid: '',
        //代理限免数量
        canFreeTime: 0,
        //免单需要免单券数量
        needFreeCouponCount: 0,
        //剩余免单名额
        remainFreeCount: 0,
        //总免单名额
        allFreeCount: 0,
        //免单活动结束时间
        freeEndTime: '',
        //免单金额
        freePrice: 0
    }
}

//订单列表模型
var Model_OrdersList = function () {
    return {
        totalCount: 0,
        pageNum: 0,
        pageCount: 0,
        //佣金是增加还是减少
        bountyChange: 0,
        //佣金是否是个人还是团队
        personalOrTeams: 0,
        orders: [],
    };
};

//订单详情模型
var Model_OrderDetail = function () {
    return {
        //订单的时间
        orderTime: {},
        //时间轴
        axisTime: {},
        //奖励金增加还是减少
        bountyChange: 0,
        //奖励金改变的数量
        bounty: "",
        //奖励金改变后的数量
        balance: "",
        //订单的来源
        orderFrom: "",
        //单号
        oddNum: "",
        //购买商品图片
        orderImg: "",
        //用户向卖家付款金额
        PaymentAmount: "",
        //我的佣金
        myCommission: "",
        //下属佣金
        branchCommission: ""

    }
}


/*********************************************************以上为公共模型**********************************************/



//跳转微信验证页
var WeixinAuth_SkipWeixinAuth = function (type) {
    type = type || '';
    var urlSkip = 'http://oauth2.damaicloud.com/login/oauth2?MyURL=' + encodeURIComponent(decodeURI(Util_GetUrlDelParam()));
    // if (type != 'must') {
    //     urlSkip += '&flag_scope=0';
    // }
    window.location.href = urlSkip;
}

//用户编码cookie设置
var WeixinAuth_SetUserOpenid = function (openid) {
    var cookieDate = new Date();
    cookieDate.setDate(cookieDate.getDate() + 3); //3天到期
    //cookieDate.setTime(cookieDate.getTime() + 60 * 10 * 1000 * 30); //30分钟到期
    $.cookie('openid', openid, {
        expires: cookieDate
    });
}

//用户编码cookie删除
var WeixinAuth_RemoveOpenid = function () {
    $.cookie('openid', '', {
        expires: -1
    });
}

//用户信息cookie设置
var WeixinAuth_SetUserInfo = function (userInfo) {

    if (userInfo.member) {
        user.id = userInfo.member.uid || '';
        user.nickname = userInfo.member.nickname || '';
        user.sex = userInfo.member.sex || 0;
        user.head = userInfo.member.avatar || '';
        user.getPoint = parseFloat(userInfo.member.self_point || 0).toFixed(2);
        user.openid = userInfo.user.openid || '';
        user.invite = userInfo.member.first_leader || '';
        user.type = userInfo.member.is_distribut == 1 ? 'primary' : 'fans';
        user.pid = '';
    }
    if (userInfo.wx) {
        user.nickname = user.nickname ? userInfo.wx.nickname : '';
        user.sex = user.sex ? userInfo.wx.sex : 0;
        user.headimgurl = user.headimgurl ? userInfo.wx.headimgurl : '';
        user.subsrcibe = userInfo.wx.subscribe ? (userInfo.wx.subscribe == 1 ? true : false) : false;
    }
    if (userInfo.agency) {
        user.grade = userInfo.agency.grade || 0;
    }
    if (userInfo.channel_bind) {
        if (userInfo.channel_bind.uid == user.id) {
            user.authorize = true;
        } else {
            user.authorize = false;
        }

        user.rid = userInfo.channel_bind.channel_id || '';
        user.session = userInfo.channel_bind.session || '';
    }
    console.log(user);
}

//用户信息cookie删除
var WeixinAuth_RemoveUserInfo = function () {

    user.id = '';
    user.pid = '';
    user.rid = '';
    user.session = '';
    user.authorize = false;
    user.nickname = '游客';
    user.sex = 0;
    user.head = '';
    user.type = 'visitor';
    user.grade = 0;
    user.getPoint = 0;
    user.openid = '';
    user.invite = '';
    user.subsrcibe = false;

}

//获取用户code
var WeixinAuth_GetUserOpenid = function () {
    var urlConfig = Util_GetUrlParams();
    var openid = urlConfig.wx_openid || $.cookie('openid');
    if (openid) {
        WeixinAuth_SetUserOpenid(openid)
        WeixinAuth_GetUserInfo(openid);
    } else {
        WeixinAuth_SkipWeixinAuth();
    }

}

//获取用户信息
var WeixinAuth_GetUserInfo = function (openid) {

    var state = false,
        returnData;

    $.ajax({
        async: false,
        url: 'http://oauth2.damaicloud.com/login/getUser',
        type: 'POST',
        dataType: 'json',
        data: {
            openid: openid,
            //openid: 'oyg610jpMhDef-8CgpCGeLbWRCpA',
            //openid: 'oyg610iamCyhnW6mvBFXwnKXePPQ',
            //openid: 'o9sGl0b6Qg19PKiyFiYGG9n7aijY',
            //openid:'oyg610iamCyhnW6mvBFXwnKXePPQ',//妮
            //openid:'oyg610rjqW_Jmr3VNyXBJi_alyak',//我
            // openid:'oyg610v4AUxTUy3mSxmLJORSYefw',
            //openid:'oyg610r7r-axDW5HPhUGY-O-XjLM',
            invite: user.referrer,
            flag_auto_try: 1
        },
        success: function (response) {
            if (response.code > 0) {
                state = true;
                returnData = response.data;
            } else {
                state = false;
            }
        }
    });

    if (state) {
        WeixinAuth_SetUserInfo(returnData);

    } else {
        WeixinAuth_RemoveOpenid();
        WeixinAuth_RemoveUserInfo();
        // WeixinAuth_SkipWeixinAuth();
    }
    WeixinAuth_End();

}

//微信授权
var WeixinAuth_Begin = function () {
    // WeixinAuth_GetUserOpenid();
}

//微信授权完成
var WeixinAuth_End = function () {

    //删除地址栏code
    var url = Util_GetUrlDelParam();

    //地址栏添加uid
    url = Util_GetUrlChangeParam('uid', user.id, url);
    //改变浏览器地址栏

    Util_ChangeUrl(url);

}









/*********************************************************以上为登陆验证**********************************************/



//微信接口秘钥信息
var WeixinJsSdk_info = {
    appId: '',
    timestamp: '',
    nonceStr: '',
    signature: ''
}

//微信接口获取秘钥
var WeixinJsSdk_GetInfoMation = function () {
    var state = false;
    var thisLink = location.href;
    $.ajax({
        url: "net/weixin/GetInfoMation.ashx", //后台给你提供的接口
        type: "POST",
        async: false,
        dataType: "json",
        data: {
            url: thisLink
        },
        success: function (response) {
            state = true;
            WeixinJsSdk_info.appId = response.appid;
            WeixinJsSdk_info.timestamp = response.timestamp;
            WeixinJsSdk_info.nonceStr = response.noncestr;
            WeixinJsSdk_info.signature = response.signature;

        }
    });
    if (state) {
        WeixinJsSdk_SetConfig();
    }
}


//微信接口配置项
var WeixinJsSdk_SetConfig = function () {
    wx.config({
        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来
        appId: WeixinJsSdk_info.appId, // 必填，公众号的唯一标识
        timestamp: WeixinJsSdk_info.timestamp, // 必填，生成签名的时间戳
        nonceStr: WeixinJsSdk_info.nonceStr, // 必填，生成签名的随机串
        signature: WeixinJsSdk_info.signature, // 必填，签名，见附录1
        jsApiList: ['updateAppMessageShareData', 'updateTimelineShareData', 'onMenuShareWeibo', 'onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareQZone', 'hideOptionMenu', 'checkJsApi'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
    });
    WeixinJsSdk_SetShareInfo();
}

//微信分享内容
var WeixinJsSdk_SetShareInfo = function () {
    if (Attribute.PageName == 'items' || Attribute.PageName == 'goods') {
        Attribute.ShareTitle = user.nickname + '今日内部优选';
        Attribute.ShareLink = Util_GetUrlDelParam();
        Attribute.ShareDesc = '淘宝天猫实时超级秒杀！手慢无！手慢无！';
        Attribute.ShareImgUrl = 'https://img.alicdn.com/imgextra/i4/72600624/O1CN01Avg2n61GTpf5wzDFQ_!!72600624.jpg';
    } else if (Attribute.PageName == 'frees' || Attribute.PageName == 'abfrees') {
        Attribute.ShareTitle = user.nickname + '比价器免单大福利|实时更新';
        Attribute.ShareLink = Util_GetUrlDelParam();
        Attribute.ShareDesc = '你消费，我买单，天天抢免单，抢到手发软';
        Attribute.ShareImgUrl = 'https://img.alicdn.com/imgextra/i4/72600624/O1CN01G6ipBz1GTpgFBgIQt_!!72600624.gif';
    } else if (Attribute.PageName == 'gylm') {
        Attribute.ShareTitle = user.nickname + '特邀您免费开通高佣联盟';
        Attribute.ShareLink = Util_GetUrlDelParam();
        Attribute.ShareDesc = '名额有限，现在开通，立省199元，即刻增加拼多多京东等多项推广权益';
        Attribute.ShareImgUrl = 'https://img.alicdn.com/imgextra/i1/72600624/O1CN01N9prrw1GTpfvLBIK0_!!72600624.png';
    } else {
        Attribute.ShareTitle = user.nickname + '邀请您使用比价器';
        Attribute.ShareLink = Util_SearchUrl();
        Attribute.ShareDesc = '同一个商家，同一个商品，不同的价格';
        Attribute.ShareImgUrl = 'https://img.alicdn.com/imgextra/i4/72600624/O1CN01Avg2n61GTpf5wzDFQ_!!72600624.jpg';
    }
    // if (Attribute.PageName != 'item' && Attribute.PageName != 'share'&& Attribute.PageName != 'share') {
    WeixinJsSdk_SetEvent();
    // }
}

//微信接口事件
var WeixinJsSdk_SetEvent = function () {
    wx.ready(function () {

        // 获取"分享到朋友圈"按钮点击状态及自定义分享内容接口
        wx.updateTimelineShareData({
            title: Attribute.ShareTitle, // 分享标题
            link: Attribute.ShareLink, //分享链接
            desc: Attribute.ShareDesc, // 分享描述
            imgUrl: Attribute.ShareImgUrl // 分享图标
        });

        // 获取"分享给朋友"按钮点击状态及自定义分享内容接口
        wx.updateAppMessageShareData({
            title: Attribute.ShareTitle, // 分享标题
            link: Attribute.ShareLink, //分享链接
            desc: Attribute.ShareDesc, // 分享描述
            imgUrl: Attribute.ShareImgUrl // 分享图标
        });

        // 分享到微博
        wx.onMenuShareWeibo({
            title: Attribute.ShareTitle, // 分享标题
            link: Attribute.ShareLink, //分享链接
            desc: Attribute.ShareDesc, // 分享描述
            imgUrl: Attribute.ShareImgUrl // 分享图标
        });

        // 获取"分享到朋友圈"按钮点击状态及自定义分享内容接口
        wx.onMenuShareTimeline({
            title: Attribute.ShareTitle, // 分享标题
            link: Attribute.ShareLink, //分享链接
            desc: Attribute.ShareDesc, // 分享描述
            imgUrl: Attribute.ShareImgUrl // 分享图标
        });

        // 获取"分享给朋友"按钮点击状态及自定义分享内容接口
        wx.onMenuShareAppMessage({
            title: Attribute.ShareTitle, // 分享标题
            link: Attribute.ShareLink, //分享链接
            desc: Attribute.ShareDesc, // 分享描述
            imgUrl: Attribute.ShareImgUrl // 分享图标
        });

        // 分享到QQ
        wx.onMenuShareQQ({
            title: Attribute.ShareTitle, // 分享标题
            link: Attribute.ShareLink, //分享链接
            desc: Attribute.ShareDesc, // 分享描述
            imgUrl: Attribute.ShareImgUrl // 分享图标
        });

        // 分享到QQ空间
        wx.onMenuShareQZone({
            title: Attribute.ShareTitle, // 分享标题
            link: Attribute.ShareLink, //分享链接
            desc: Attribute.ShareDesc, // 分享描述
            imgUrl: Attribute.ShareImgUrl // 分享图标
        });

    });
}


var WeixinJsSdk_Begin = function () {
    WeixinJsSdk_GetInfoMation();
}






/*********************************************************以上为微信访问**********************************************/



//获取页面名称
var Page_GetPageName = function () {
    var pathname = window.location.pathname;
    Attribute.PageName = pathname.replace('/', '').replace('.html', '').toLowerCase() || 'search';
}

//设置导航条html
var Page_BuildNav = function () {

    var navHtml = '<div id="nav">';

    if (Attribute.PageName == 'item') {
        navHtml += '<a class="link" href="/"><div class="link-icon tbkfont ">&#xe64d;</div><div class="link-text">首页</div></a>';
        navHtml += '<div class="link-char"></div>';
        navHtml += '<a class="link link-pages"><div class="link-icon tbkfont ">&#xe63f;</div><div class="link-text">功能</div></a>';
        navHtml += '<a class="link link-buy getcode" onclick=""><div class="link-text-1">领券购买</div><div class="link-text-2">可省<em>&yen;</em><span>0.00</span></div></a>';
        navHtml += '<a class="link link-share"><div class="link-text-1">我要分享</div><div class="link-text-2">约赚<em>&yen;</em><span>0.00</span></div></a>';
        navHtml += '<a class="link link-back page-top"><div class="link-icon tbkfont ">&#xe642;</div><div class="link-text">顶部</div></a>';

    } else if (Attribute.PageName == 'free' || Attribute.PageName == 'abfree') {
        navHtml += '<a class="link" href="/"><div class="link-icon tbkfont ">&#xe64d;</div><div class="link-text">首页</div></a>';
        navHtml += '<div class="link-char"></div>';
        navHtml += '<a class="link link-pages"><div class="link-icon tbkfont ">&#xe63f;</div><div class="link-text">功能</div></a>';
        navHtml += '<a class="link link-buy getfree"><div class="link-text-1">立即抢购</div><div class="link-text-2">消耗<em>0</em>券</div></a>';
        navHtml += '<a class="link link-share"><div class="link-text-1">我要分享</div><div class="link-text-2">约赚<em>&yen;</em><span>0.00</span></div></a>';
        navHtml += '<a class="link link-back page-top"><div class="link-icon tbkfont ">&#xe642;</div><div class="link-text">顶部</div></a>';

    } else if (Attribute.PageName == 'share') {
        navHtml += '<a class="link" href="/"><div class="link-icon tbkfont ">&#xe64d;</div><div class="link-text">首页</div></a>';
        navHtml += '<div class="link-char"></div>';
        navHtml += '<a class="link link-goods" href="goods.html"><div class="link-icon tbkfont ">&#xe638;</div><div class="link-text">精品</div></a>';
        navHtml += '<div class="link-char"></div>';
        navHtml += '<a class="link link-pages"><div class="link-icon tbkfont ">&#xe63f;</div><div class="link-text">功能</div></a>';
        navHtml += '<a class="link link-buy getcode" onclick=""><div class="link-text-1">领券购买</div><div class="link-text-2">省<em>&yen;</em><span>0.00</span><em>,</em>约赚<em>&yen;</em><span>0.00</span></div></a>';
        navHtml += '<a class="link link-back page-back"><div class="link-icon tbkfont ">&#xe64c;</div><div class="link-text">返回</div></a>';
    } else {
        navHtml += '<div class="links clearfix">';
        for (var i in Attribute.NavLinks) {
            var navLink = Attribute.NavLinks[i];
            if (i > 0) {
                navHtml += '<div class="link-char"></div>';
            }
            var active = '';

            for (var j in navLink.pages) {
                if (navLink.pages[j] == Attribute.PageName) {
                    active = 'active';
                    break;
                }
            }
            var hrefStr = '';
            if (navLink.href) {
                hrefStr = 'href="' + navLink.href + '"';
            }
            navHtml += '<a class="link link-' + navLink.type + ' ' + active + '" ' + hrefStr + '><div class="link-icon tbkfont ">' + navLink.icon + '</div><div class="link-text">' + navLink.text + '</div></a>';
        }
        navHtml += '</div>';
    }

    navHtml += '</div>';

    $('body').append(navHtml);

    Page_SetNavWidth();

}

//设置导航条宽度
var Page_SetNavWidth = function () {
    if (Attribute.PageName == 'item') {
        var linkButtonWidth = Math.floor(($(window).width() - 152) / 2 - 10);
        $('#nav .link-buy,#nav .link-share').width(linkButtonWidth);
    } else if (Attribute.PageName == 'free' || Attribute.PageName == 'abfree') {
        var linkButtonWidth = Math.floor(($(window).width() - 152) / 2 - 10);
        $('#nav .link-buy,#nav .link-share').width(linkButtonWidth);
    } else if (Attribute.PageName == 'share') {
        var linkButtonWidth = $(window).width() - 204;
        $('#nav .link-buy').width(linkButtonWidth);
    } else {
        var linkWidth = Math.floor(($(window).width() - 10 - (Attribute.NavLinks.length - 1) * 2) / Attribute.NavLinks.length);
        var navWidth = linkWidth * Attribute.NavLinks.length + 2 * (Attribute.NavLinks.length - 1);
        $('#nav .links').width(navWidth);
        $('#nav .link').width(linkWidth);
    }
}

//设置功能大全html
var Page_BuildPages = function () {
    var pagesHtml = '';
    for (var i in Attribute.Pages) {
        var page = Attribute.Pages[i];

        pagesHtml += '<a class="link" href="' + page.href + '"><div class="link-icon tbkfont ">' + page.icon + '</div><div class="link-text">' + page.text + '</div></a>';
    }

    $('body').append('<div id="pages"><img class="logo" src="images/logo.png" /><div class="links clearfix">' + pagesHtml + '</div><div id="pages-close" class="tbkfont">&#xe643;</div></div>');

    Page_SetPagesSize();
}

//设置功能大全宽度
var Page_SetPagesSize = function () {
    var linkWidth = $('#pages .link').width();
    var linkMarginX = Math.floor(Math.floor(($(window).width() - 40) / 3 - linkWidth) / 2);
    var linkHeight = $('#pages .link').height();
    var linkMarginY = Math.floor(Math.floor(($(window).height() - 100 - 80) / Math.ceil(Attribute.Pages.length / 3) - linkWidth) / 2);
    $('#pages .link').css({
        width: linkWidth + 'px',
        height: linkHeight + 'px',
        margin: linkMarginY + 'px ' + linkMarginX + 'px'
    });
}

//回到顶部
var Page_BackTop = function () {
    $('html , body').animate({
        scrollTop: 0
    }, 'slow');
}

//打开功能大全
var Page_OpenPages = function () {
    $('#pages').siblings().stop().animate({
        filter: 'blur(5px)'
    }, 1000);
    $('#pages').stop().animate({
        bottom: '0',
        opacity: 1
    }, 1000, function () {
        $('#pages').siblings().addClass('show-form-blur');
    });
}

//关闭功能大全
var Page_ClosePages = function () {
    $('#pages').siblings().animate({
        filter: 'blur(0px)'
    }, 1000)

    $('#pages').stop().animate({
        bottom: '100%',
        opacity: 0
    }, 1000, function () {
        $('#pages').siblings().removeClass('show-form-blur');
    });
}

//链接转短连接
var Page_GetShortUrlByUrl = function (url) {

    var shortUrl = '';

    $.ajax({
        async: false,
        url: 'net/sina/GetShortUrl.ashx',
        type: 'POST',
        dataType: 'json',
        data: {
            url: url
        },
        success: function (response) {
            shortUrl = response.shortUrl.replace('http:', 'https:');
        }
    });

    return shortUrl;

}

//页面公共元素加载
var Page_PublicPartsInit = function () {
    $('body').append('<div id="rightbottom-components"></div>');

    var parts = [];
    if (!user.authorize && Attribute.PageName != 'authorize' && Attribute.PageName != 'validate') {
        parts.push('authorizeicon');
    }
    // if (Attribute.PageName != 'authorize' && Attribute.PageName != 'validate' && Attribute.PageName != 'authhelp') {
    //     parts.push('tmall618');
    // }
    if (Attribute.PageName == 'myfree' || Attribute.PageName == 'getfree' || Attribute.PageName == 'frees' || Attribute.PageName == 'free' || Attribute.PageName == 'abfrees' || Attribute.PageName == 'abfree') {
        parts.push('freecoupons');
    }

    var partsScript = '';
    for (var i in parts) {
        partsScript += '<script type="text/javascript" src="js/components/' + parts[i] + '.js"></script>';
    }

    $('head').append(partsScript);

}


//读取页面配置
var Page_LoadPageConfig = function () {
    var userAgent = navigator.userAgent;
    var isAndroid = userAgent.indexOf('Android') > -1 || userAgent.indexOf('Adr') > -1; //android终端
    var isiOS = !!userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端

    if (isAndroid) {
        Attribute.BrowserType
        Attribute.BrowserType = 'android';
        // 是安卓手机的微信浏览器
    } else if (isiOS) {
        Attribute.BrowserType = 'ios';
        // 是ios手机的微信浏览器
    } else {
        Attribute.BrowserType = 'other';
    }

    var urlConfig = Util_GetUrlParams();
    user.referrer = urlConfig.uid || '';

}

//设置页面事件
var Page_SetPageEvent = function () {
    if (Attribute.PageName != 'validate' && Attribute.PageName != 'pages') {
        $(window).resize(function () {
            Page_SetNavWidth();
            Page_SetPagesSize();
        });

        $('#nav .link-pages').on('click', function () {
            Page_OpenPages();
        });

        $('#pages-close').on('click', function () {
            Page_ClosePages();
        });
    }
    $('a.page-back').on('click', function () {
        history.back(-1);
    });
    $('a.page-top').on('click', function () {
        Page_BackTop();
    });
}

//页面加载
var Page_Init = function () {

    Page_GetPageName();

    if (Attribute.PageName != 'validate' && Attribute.PageName != 'pages') {
        Page_BuildNav();
        Page_BuildPages();
    }

    Page_LoadPageConfig();

    Page_SetPageEvent();

    if (Attribute.PageName != 'validate' && Attribute.PageName != 'authhelp') {
        // WeixinAuth_Begin();
    }

    // WeixinJsSdk_Begin();

    // Page_PublicPartsInit();

    switch (Attribute.PageName) {
        case 'search': {
            SearchPage_Init();
            break;
        }
        case 'items': {
            ItemsPage_Init();
            break;
        }
        case 'goods': {
            GoodsPage_Init();
            break;
        }
        case 'frees': {
            FreesPage_Init();
            break;
        }
        case 'abfrees': {
            AbfreesPage_Init();
            break;
        }
        case 'validate': {
            ValidatePage_Init();
            break;
        }
        case 'authorize': {
            AuthorizePage_Init();
            break;
        }
        case 'item': {
            ItemPage_Init();
            break;
        }
        case 'free': {
            FreePage_Init();
            break;
        }
        case 'abfree': {
            AbfreePage_Init();
            break;
        }
        case 'pages': {
            PagesPage_Init();
            break;
        }
        case 'share': {
            SharePage_Init();
            break;
        }
        case 'user': {
            UserPage_Init();
            break;
        }
        case 'gylm': {
            GylmPage_Init();
            break;
        }
        case 'myfree': {
            MyfreePage_Init();
            break;
        }
        case 'friend': {
            FriendPage_Init();
            break;
        }
        case 'group': {
            GroupPage_Init();
            break;
        }
        case 'getfree': {
            GetFreePage_Init();
            break;
        }
        case 'freeorder': {
            FreeOrderPage_Init();
            break;
        }
        default: {
            break;
        }
    }

}



/*********************************************************以上为公共加载**********************************************/

//定义一个user公共变量，供任何页调用
var user = new Model_User();

//页面加载
$(document).ready(function () {
    Page_Init();
})
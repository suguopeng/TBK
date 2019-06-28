
var template='<div class="pswp" tabindex="-1" role="dialog" aria-hidden="true">\n' +
    '    <div class="pswp__bg"></div>\n' +
    '    <div class="pswp__scroll-wrap">\n' +
    '    <div class="pswp__container">\n' +
    '    <div class="pswp__item"></div>\n' +
    '    <div class="pswp__item"></div>\n' +
    '    <div class="pswp__item"></div>\n' +
    '    </div>\n' +
    '    <div class="pswp__ui pswp__ui--hidden">\n' +
    '    <div class="pswp__top-bar">\n' +
    '    <div class="pswp__counter"></div>\n' +
    '    <button class="pswp__button pswp__button--close" title="Close (Esc)"></button>\n' +
    '    <button class="pswp__button pswp__button--share" title="Share"></button>\n' +
    '    <button class="pswp__button pswp__button--fs" title="Toggle fullscreen"></button>\n' +
    '    <button class="pswp__button pswp__button--zoom" title="Zoom in/out"></button>\n' +
    '    <div class="pswp__preloader">\n' +
    '    <div class="pswp__preloader__icn">\n' +
    '    <div class="pswp__preloader__cut">\n' +
    '    <div class="pswp__preloader__donut"></div>\n' +
    '    </div>\n' +
    '    </div>\n' +
    '    </div>\n' +
    '    </div>\n' +
    '    <div class="pswp__share-modal pswp__share-modal--hidden pswp__single-tap">\n' +
    '    <div class="pswp__share-tooltip"></div>\n' +
    '    </div>\n' +
    '    <button class="pswp__button pswp__button--arrow--left" title="Previous (arrow left)"> </button>\n' +
    '    <button class="pswp__button pswp__button--arrow--right" title="Next (arrow right)"> </button>\n' +
    '    <div class="pswp__caption">\n' +
    '    <div class="pswp__caption__center"></div>\n' +
    '    </div>\n' +
    '    </div>\n' +
    '    </div>\n' +
    '    </div>\n';
var initPhotoSwipeFromDOM = function(gallerySelector) {
    //
    // let tempNode = document.createElement('div');
    // tempNode.innerHTML = template;
    // document.body.appendChild(tempNode);
    var parseThumbnailElements = function(el){
        var thumbElements = el.childNodes,
            numNodes = thumbElements.length,
            items = [],
            figureEl,
            linkEl,
            size,
            item;
        for(var i = 0; i < numNodes; i++){
            figureEl = thumbElements[i]; // <figure> element
            // include only element nodes
            if(figureEl.nodeType !== 1){
                continue;
            }
            linkEl = figureEl.children[0]; // <a> element
            goodCount=figureEl.getAttribute('good_count');
            var imageEl=linkEl.children[0];

            item = {
                src: linkEl.getAttribute('href'),
                w: imageEl.naturalWidth,
                h: imageEl.naturalHeight,
                // w:600,
                // h:800,
                goodCount:goodCount//把商品的id注入到item数组
            };
            var img = new Image();
            img.src = linkEl.getAttribute('href');
            var wait = setInterval(function() {
                var w = img.naturalWidth,
                    h = img.naturalHeight;
                if (w && h) {
                    clearInterval(wait);
                    item.w = w;
                    item.h = h;
                }
            }, 30)

            // linkEl.setAttribute('data-size', img.naturalWidth + 'x' + img.naturalHeight);
            // size = linkEl.getAttribute('data-size').split('x');
            // goodCount=figureEl.getAttribute('good_count');
            // item = {
            //     src: linkEl.getAttribute('href'),
            //     w: parseInt(size[0], 10),
            //     h: parseInt(size[1], 10),
            //     goodCount:goodCount//把商品的id注入到item数组
            // };
            if(figureEl.children.length > 1){
                // <figcaption> content
                item.title = figureEl.children[1].innerHTML;
            }
            if(linkEl.children.length >0){
                // <img> thumbnail element, retrieving thumbnail url
                item.msrc = linkEl.children[0].getAttribute('src');
            }
            item.el = figureEl; // save link to element for getThumbBoundsFn
            items.push(item);
    }
        return items;
    };
    var closest = function closest(el, fn) {
        return el && ( fn(el) ? el : closest(el.parentNode, fn) );
    };

    var onThumbnailsClick = function(e){
        e = e || window.event;
        e.preventDefault ? e.preventDefault() : e.returnValue = false;
        var eTarget = e.target || e.srcElement;
        var clickedListItem = closest(eTarget, function(el) {
            return (el.tagName && el.tagName.toUpperCase() === 'FIGURE');
        });
        if(!clickedListItem){
            return;
        }
        var clickedGallery = clickedListItem.parentNode,
            childNodes = clickedListItem.parentNode.childNodes,
            numChildNodes = childNodes.length,
            nodeIndex = 0,
            index;
        for (var i = 0; i < numChildNodes; i++) {
            if(childNodes[i].nodeType !== 1) {
                continue;
            }
            if(childNodes[i] === clickedListItem) {
                index = nodeIndex;
                break;
            }
            nodeIndex++;
        }
        if(index >= 0) {
            if($("#friendOrGroup").val()==1){
                openPhotoSwipe( e.srcElement.alt, galleryElements);
            }else {
                openPhotoSwipe( $(".figure-image").length-parseInt(e.srcElement.alt)-1,galleryElements);
            }
        }
        return false;
    };
    var photoswipeParseHash = function() {
        var hash = window.location.hash.substring(1),
            params = {};

        if(hash.length < 5) {
            return params;
        }

        var vars = hash.split('&');
        for (var i = 0; i < vars.length; i++) {
            if(!vars[i]) {
                continue;
            }
            var pair = vars[i].split('=');
            if(pair.length < 2) {
                continue;
            }
            params[pair[0]] = pair[1];
        }

        if(params.gid) {
            params.gid = parseInt(params.gid, 10);
        }

        return params;
    };
    //这个方法如果被多次调用
    var openPhotoSwipe = function(index,galleryElement,disableAnimation,fromURL){
        var pswpElement = document.querySelectorAll('.pswp')[0],
            gallery,
            options,
            items = [];
        for(var i = 0, l = galleryElement.length; i < l; i++){
            items =items.concat(parseThumbnailElements(galleryElement[i]));
        }
        //     items;
        // items = parseThumbnailElements(galleryElement);
        var galleryUID=1;
        if(galleryElement[0]!=undefined){
            galleryElement[0].getAttribute('data-pswp-uid')
        }
        options = {
            // galleryUID: galleryElement.getAttribute('data-pswp-uid'),
            galleryUID: galleryUID,
            index: index,
                    bgOpacity: 0.8,
                    showHideOpacity: true,
            // getThumbBoundsFn: function(index) {
            //     var thumbnail = items[index].el.getElementsByTagName('img')[0], // find thumbnail
            //         pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
            //         rect = thumbnail.getBoundingClientRect();
            //     return {x:rect.left, y:rect.top + pageYScroll, w:rect.width};
            // }
        };
        if(fromURL) {
            if(options.galleryPIDs){
                for(var j = 0; j < items.length; j++) {
                    if(items[j].pid == index){
                        options.index = j;
                        break;
                    }
                }
            }
            else {
                options.index = parseInt(index, 10-1);
            }
        } else {
            options.index = parseInt(index, 10);
        }

        if( isNaN(options.index) ){
            return;
        }
        if(disableAnimation){
            options.showAnimationDuration = 0;
        }
        gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, items, options);
        gallery.init();
        gallery.listen('close',function(){
            // $(".pswp__img").hide();
            var goodCount=gallery.items[gallery.getCurrentIndex()].goodCount;
            if($("#friendOrGroup").val()==1){
                if(goodCount){
                    var closeItemTop=$('#div_each').children('li[goodId='+goodCount+']').offset().top;
                    setTimeout(function(){
                        window.scrollTo(0,closeItemTop);
                    },500)
                }
            }else if(($("#friendOrGroup").val()==2)){
                // var closeItemTop=$('#list').children('li[goodId='+goodCount+']').offset().top;
                if(goodCount){
                    var closeItemTop=$('#list').children('li[goodId='+goodCount+']').offset().top;
                    setTimeout(function(){
                        window.scrollTo(0,closeItemTop);
                    },500)
                }
            }
        });

        gallery.listen('beforeChange',function(){
            var cout=$(".pswp__counter").html().split("/");
            if(($("#friendOrGroup").val()==1)){
                var goodId= $('img[alt='+cout[0]+']').parents("figure.img-wrap").attr("good_count");
                FriendPage_GetPositionGoodId(goodId);
            }else{
                var goodId= $('img[alt='+cout[0]+']').parents("figure.img-wrap").attr("good_count");
                GroupPage_GetPositionGoodId(goodId);
            }

            if($("#friendOrGroup").val()==1){
                if(parseInt(cout[0])==parseInt(cout[1])){//如果到最后一页，就调用ajax
                    FriendPage_GetItemsList();
                    $.each(FriendPage.items,function (i,data) {
                        $.each(data.itemImages, function (i, image) {
                            gallery.items.push({
                                src: imgUrl + image,
                                w: 800, // temp default size
                                h: 600, // temp default size
                                title:data.itemTitle+"<br />原价" + data.sourcePrice + "元券后价【" + data.salePrice + "元】"+"<br />复制这条信息，打开【手机淘宝】,立即抢购",
                                msrc: imgUrl + image,
                                goodCount:data.goodId//把商品的id注入到item数组
                            });
                        })
                    })
                }
            }else {
              if(parseInt(cout[0])==1){
                  GroupPage_GetItemsList();
                  flag=true;
                  $.each( GroupPage.items,function (i,data) {
                      $.each(data.itemImages, function (i, image) {
                          beginPic++;
                          gallery.items.push({
                              src: imgUrl + image.imgPath,
                              w: 800, // temp default size
                              h: 600, // temp default size
                              title:data.itemTitle+"<br />原价" + data.sourcePrice + "元券后价【" + data.salePrice + "元】"+"<br />复制这条信息，打开【手机淘宝】,立即抢购",
                              msrc: imgUrl + image.imgPath,
                              goodCount:data.goodId//把商品的id注入到item数组
                          });
                      })
                  })
                  gallery.goTo(beginPic);
              }
            }
        });
        //解绑click事件
        $(".pswp__caption__center").unbind("click");
        $(".pswp__caption__center").click(function () {
            var arr=$(".pswp__counter").html().split("/");
          $("img.image-item").each(function () {
                if ($(this).attr("alt")==(parseInt(arr[0])-1)){
                    gallery.close()
                        $(this).parents("div.my-gallery").prev("div").click();
                    return;
                }
            })
            $("img.figure-image").each(function () {
                if ($(this).attr("alt")==(parseInt(arr[1])-parseInt(arr[0]))){
                    gallery.close();
                      $(this).parents("li.wechat-group").find("div.getcode").click();
                    return;
                }
            })
            // gallery.close();
            // $(galleryElement).prev("div").click();
        });
    };
    var galleryElements = document.querySelectorAll( gallerySelector );

    //每一个图片绑定click事件
    for(var i = 0, l = galleryElements.length; i < l; i++) {
        galleryElements[i].setAttribute('data-pswp-uid', i+1);
        galleryElements[i].onclick = onThumbnailsClick;
    }
     //图片在打开情况下刷新处理
    // var hashData = photoswipeParseHash();
    // if(hashData.pid && hashData.gid) {
    //     // openPhotoSwipe( hashData.pid ,  galleryElements[ hashData.gid - 1 ], true, true );
    //     openPhotoSwipe(hashData.pid, galleryElements, true, true);
    // }
    var flag=false;
    var beginPic=0;
};


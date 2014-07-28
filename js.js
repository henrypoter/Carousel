;(function($,undefined){
  'use strict';
  $('[data-role="carousel"]').each(function(){

    var box = $(this),
        options = {
          autoplay  : 'false',
          speed  :  300,
          timeout : 3000
        };

    $.extend(options, this.dataset);

    var carouselClass = '.carousel',
        carouselItemClass = '.c-item',
        ul = $(carouselClass, box),
        navbox = $('.navi', box),
        winWidth = $(window).width(),
        lis = $(carouselItemClass, ul),    
        imgNumber = lis.length,
        link = $('a', box),
        startX = 0,
        startY = 0,
        endX = 0,
        endY = 0,
        distanceX = 0,                             // 横坐标差
        distanceY = 0,                             // 纵坐标差
        boundary = 50,                             // 边界值，没有超过边界即回弹
        current = 1,                               // 控制动画的索引，最低0
        navBarIdx = 1,                             // 导航点索引，会出现负数
        nextBtnClass = '.next',                    // 下一个按钮样式
        prevBtnClass = '.prev',                    // 上一个按钮样式
        navBarActiveClass = 'activate',            // 导航点激活样式
        isVertical = false,                        // 是否是纵向滚动
        timer = null;                              // 定时器
    
    // 轮播图事件绑定
    ul.on('touchstart', tStart)
      .on('touchmove', tMove)
      .on('touchend', tEnd);
    
    
    // 导航前后点击事件绑定
    navbox.on('touchstart', nextBtnClass, function () {
        aniTo(++current);
        updateNavbarActive(++navBarIdx);
      })
      .on('touchstart', prevBtnClass, function () {
        aniTo(--current);
        updateNavbarActive(--navBarIdx);
      });
    
    // touchstart 回调
    function tStart (e) {
      startX = getPos(e).posX;
      startY = getPos(e).posY;
      isVertical = false;
      clearInterval(timer);
//      e.preventDefault();
    }
    
    // touchmove 回调
    function tMove (e) {
      endX = getPos(e).posX;
      endY = getPos(e).posY;
      distanceX = endX - startX;
      distanceY = endY - startY;
      
      // 如果纵坐标差 > 横坐标差：判断为纵向滚动
      if (Math.abs(distanceY) > Math.abs(distanceX) || isVertical) {
        isVertical = true;
        return;
      } else {
        moveTo(distanceX+(current*-winWidth));
      }
    }
    
    // touchend 回调
    function tEnd (e) {
      endX = getPos(e).posX;
//      startY = getPos(e).posY;
      distanceX = endX-startX;
      
      // 是否回弹
      if (Math.abs(distanceX) < boundary) {
        aniTo(current);
      } else {
        if (endX - startX < 0) {
          aniTo(++current);
          updateNavbarActive(++navBarIdx);
        } else {
          aniTo(--current);
          updateNavbarActive(--navBarIdx);
        }
      }
      
      autoPlay();
    }
    
    // 移动ing
    function moveTo (distance) {
      ul.css('-webkit-transform','translate3d(' + distance + 'px,0,0)');
    }
    
    // 动画效果
    function aniTo (idx) {
      var x = winWidth * -idx;
      ul.animate({
        'translate3d' : x + 'px,0,0'
      },options.speed, aniToCallback);
    }
    
    // 动画后的回调，前后追加元素用于循环
    function aniToCallback () {
      var last = imgNumber + 1;
      if (current === last) {
        $(carouselItemClass, ul).first().appendTo(ul);
        moveTo(--current * -winWidth);
      } else if (current === 0) {
        $(carouselItemClass, ul).last().prependTo(ul);
        moveTo(++current * -winWidth);
      }
      // 预加载图片
      loadImg(navBarIdx+1);
      loadImg(navBarIdx-1);
    }
    
    // 返回当前事件的坐标
    function getPos (e) {
      return {
        posX: e.changedTouches[0].pageX,
        posY: e.changedTouches[0].pageY
      };
    }
    
    // 自动循环播放
    function autoPlay () {
      if (options.autoplay === 'true') {
        timer = setInterval(function () {
          aniTo(++current);
          updateNavbarActive(++navBarIdx);
        },options.timeout);
      }
    }
    
    // 更新导航点
    function updateNavbarActive (idx) {
      if (idx >= 0) {
        idx = idx % imgNumber;
        if (idx === 0) {
          idx = imgNumber;
        }
      } else {
        idx = idx % imgNumber + imgNumber;
      }
      
      // 导航条当前高亮
      navbox.find('i').eq(idx-1).addClass(navBarActiveClass)
        .siblings().removeClass(navBarActiveClass);
      
      // 导航数字计算 activate/imgNumber
      var navnum = '<span>' + idx + '/' + imgNumber + '</span>';
      
      // 获取标题
      var title = link.eq(idx-1).attr('title') || '';
      
      $('h2', box).html(title + navnum);
    }

    // 图片加载函数
    function loadImg (idx) {
      var $img = lis.eq(idx).find('img'),
          src = $img.attr('src');
      if (src === '') {
        $img.attr('src', $img.data('src'));
      }
    }
    
    // resize
    function resize () {
      winWidth = $(window).width();
      
      // 设容器宽度等于屏幕宽
      ul.css('width', winWidth * (imgNumber + 2));
      
      // 重置图片宽度
      $(carouselItemClass, ul).css('width', winWidth);
      
      // 定位到当前图片坐标
      moveTo(current * -winWidth);
    }
    
    // 初始化
    function init () {
      
      // 重置轮播的内容，为了循环，同时给<li>绑定index属性，标示当前第几个
      lis.first().clone().appendTo(ul);
      lis.last().clone().prependTo(ul);
      
      // 加载第一张图
      loadImg(0);
      
      // 更新lis对象为前后填充过的新的lis，长度等于长度+2
      lis = $(carouselItemClass, ul);

      // 导航创建，填充navi
      for (var i = 0, htm = ''; i<imgNumber; i++) {
        htm += '<i></i>';
      }
      $(htm).appendTo($('.dot', box));
      
      // 填充标题和导航样式
      updateNavbarActive(1);
      
      // 页面ready后加载第零张和第二张图
      $(document).on('ready',function(){
        loadImg(0);
        loadImg(2);
      });
      
      $(window).on('resize',resize);
      resize();
      
      autoPlay();
    }
    
    init();
  });

})(Zepto);
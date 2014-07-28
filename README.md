Carousel
========

基于Zepto的移动设备轮播插件


##功能点

* 支持单页面多个控件
* 支持自动滚动。`data-autoplay="true"`
* 支持循环
* 支持前后导航
* 支持导航显示，图标或者数字
* 支持懒加载，img[data-src]。懒加载规则：轮播初始化只加载第一张图，整个页面ready后，加载0，2两张图，其他图片在轮播执行完毕后进行预加载。

##HTML结构

```
div[data-role=carousel]>(ul.carousel>li.c-item>a[title]>img)+(h2>span)+.navi>(span.prev+span.next+span.dot)
```

##使用方法

1. 给相应的div标签添加data-role="carousel"属性，即可激活该功能。
2. 在carousel的容器上使用的data-XXX属性传入参数：
    * autoplay[false]:是否自动播放
    * speed[300]:单次自然滚动时间
    * timeout[3000]:几秒钟切换一次
3. 注意：span.dot中的i，由JS生成，不要在页面中显示出来，高亮的i的class为Activate.

##DEMO

```
<div data-role="carousel" data-timeout="3000" data-autoplay="true" data-speed="300">
```

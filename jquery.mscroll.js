/**
* 功能: mscroll 左右点击无缝滚动 插件
* 编写：王 炜
* 全部参数调用：$.mscroll({left:'.left',center:'.center',right:'.right'},{num:3,speed:3,auto:false,width:'1000px'});
* 简单调用：$.mscroll({left:'.left',center:'.center',right:'.right'},{num:3});
* 参数说明：
	left：  //左箭头class
	center: //中间选择能够选择到ul class
	right： //右箭头 class
	auto: false,	//是否自动移动
	speed: 3,		//自动滚动速度 单位秒
	num: 3,			//可以显示几个
	width: '1000px',	//中间部分长度
	jump:[['.nav1',1],['.nav2',2],['.nav3',4],['.nav4',6]],  二维数组用来定位跳转到哪一页   .nav1是点击的标签 1是跳转到哪一页
	onJump:function(i){} //点击跳转时候同时执行函数
	moveBefore:function(i,j){} //移动之前调用函数 j是方向
	moveAfter:function(i,j){} //移动之后调用函数
	maxPage:10, //如果设置了最大页数到达最大页数 自动播放将停止
	noAutoSel: .center //放在哪些选择器上 动画将停止
	 
*update时间：2015.01.02
*/
(function($) {
	$.extend({
		mscroll: function(handle, setting) {
			var _settings = {
				speed: 3,
				num: 3,
				auto: false,
				width: '10000px',
				movenum: 1
			};
			var currentNum = 1;
			_settings = $.extend(_settings, setting);
			var prev = $(handle.left);
			var img = $(handle.center);
			var next = $(handle.right);
			var total = img.children().length;
			var wt = img.children().eq(0).outerWidth(true);
			var w = img.children().eq(0).outerWidth(true) * _settings.movenum;
			$(handle.center).wrap('<div style="width:' + w * _settings.num + 'px;overflow:hidden; float:left;"></div>');
			$(handle.center).css({
				width: _settings.width
			});
			
			var moveNext = function(n, moveNum) {
				
								
				//哪一页开始动画将不再播放
				if(_settings.maxPage<=currentNum){ 
					clearInterval(ad);
					return false;
				}
				
				currentNum+=moveNum;

				currentNum = currentNum>total?1:currentNum;
				
				//移动之前回调
				if(_settings.moveBefore){
					_settings.moveBefore.call(this, currentNum-1,1);
				}
					
				img.animate({
					'margin-left': -n
				},
				function() { 
					 
					for (var i = 0; i < moveNum; i++) {
						img.children().eq(0).appendTo(img);
					};
					
					img.css({
						'margin-left': 0
					});
					
					//移动之后回调
					if(_settings.moveAfter){
						_settings.moveAfter.call(this,currentNum-1,1);
					}
					
				})
			};
			var movePrev = function(n, moveNum) {
				currentNum-=moveNum;
				currentNum = currentNum<1?total:currentNum;
				
				//移动之前回调
				if(_settings.moveBefore){
					_settings.moveBefore.call(this, currentNum-1,-1);
				}
					
				for (var i = 0; i < moveNum; i++) {
					img.children().last().prependTo(img)
				};
				img.css({
					'margin-left': -n
				});
				img.animate({
					'margin-left': 0
				},function(){
					//移动之后回调
					if(_settings.moveAfter){
						_settings.moveAfter.call(this,currentNum-1,-1);
					}
				});
				 
				
			};
			next.click(function() {
				moveNext(w, _settings.movenum)
			});
			prev.click(function() {
				movePrev(w, _settings.movenum)
			});
			
			if (_settings.auto == true) {
				var ad = setInterval(function() {
					next.click()
				},
				_settings.speed * 1000);
				 
				if(typeof _settings.noAutoSel != 'undefined' ){
					var _noAutoSel = _settings.noAutoSel;
				}else{
					var _noAutoSel = handle.left + "," + handle.center + "," + handle.right;
				}
				
				$(_noAutoSel).hover(function() {
					clearInterval(ad);
				},function() {
					ad = setInterval(function() {
						next.click()
					},_settings.speed * 1000)
				})
			};
			
			if (typeof _settings.jump != 'undefined') {
				for (var k in _settings.jump) { (
					function(k) {
						$(_settings.jump[k][0]).delegate('','click',
							function() {
								//点击时的操作，用于改变样式等
								if(_settings.onJump){
									_settings.onJump.call(this,k);
								}
								
								var n = _settings.jump[k][1] - currentNum;
								if (n == 0) return;
								if (n > 0) {
									moveNext(n * wt, n)
								} else {
									movePrev(Math.abs(n) * wt, Math.abs(n))
								}
							})
					})(k)
				}
			}
		}
	})
})(jQuery)
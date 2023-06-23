//iOS vh 대응
function setCSS(){
	var setVh = () => {
		document.documentElement.style.setProperty('--vh', `${window.innerHeight}px`);
	}
	window.addEventListener('resize', setVh);
	setVh();
}

//디바이스 체크
function checkDevice(){
	$(window).on('resize', function(){
		if (window.innerWidth > 768) {
			//PC
			$('body').removeClass('is-mobile').addClass('is-pc');
		} else {
			//Mobile
			$('body').removeClass('is-pc').addClass('is-mobile');
		}
	}).resize();
}

//스킵네비게이션
function skipNav(){
	$('.skipnav a').on('click', function(e){
		e.preventDefault();

		if($(this).attr('href') == '#container'){
			$('#container').attr('tabindex' , 0).focus();
		}
	});
}

//전체메뉴
function allMenuOpen(){
	var el = $("#header");
	if(el.length <= 0) return;

	//전체메뉴 클릭
	el.find('.btn_menu').on('click', function(e){
		e.preventDefault();

		if($(this).hasClass('on')){
			//메뉴 닫힘
			$(this).removeClass('on').find('> em').text('전체 메뉴 열기');
			el.find('.allmenu_wrap').stop().slideUp().removeAttr('tabindex');
		}else{
			//메뉴 열림
			$(this).addClass('on').find('> em').text('전체 메뉴 닫기');
			el.find('.allmenu_wrap').stop().slideDown(function(){$(this).height('auto')}).attr('tabindex' , 1);
		}

		if($('body').hasClass('is-mobile') && $('.btn_menu').hasClass('on')){
			lock();
		} else{
			unlock();
		}

	});

	//배경 클릭 시 닫힘
	el.find('.header_bg').on('click', function(e){
		el.find('.btn_menu').removeClass('on').find('> em').text('전체 메뉴 열기');
		el.find('.allmenu_wrap').stop().slideUp().removeAttr('tabindex');
	});

	//PC, Mobile 스크롤 관련 리사이즈
	$(window).on('resize', function(){
		//Mobile & 전체메뉴 오픈 시
		if($('body').hasClass('is-mobile') && $('.btn_menu').hasClass('on')){			
			$('.header_bg').hide();
			lock();
		}
		//PC & 전체메뉴 오픈 시
		else if($('body').hasClass('is-pc') && $('.btn_menu').hasClass('on')){			
			$('.header_bg').show();
			unlock();
		}
	}).resize();
}

//메인 슬라이드
function mainVisual(){
	var mainVisual = $('[data-slide="main_visual"]');
	if(mainVisual.length <= 0) return;
	if(mainVisual.find('.swiper-slide').length == 1){
		$('.main_visual').addClass('only');
	}

	//loop
	function loopSetting(el, limit){
        var len = el.find('.swiper-slide').length;
        limit = (limit !== undefined && limit !== null) ? limit : 1;
        var loop =  (len <= limit) ? false : true;
        return loop;
	}

	mainVisual.each(function(){
		var $this = $(this);

		var loop = loopSetting(mainVisual);	
		var mainSlider = new Swiper($this, {
			slidesPerView : 1,
			spaceBetween: 0,
			loop: loop,
			autoplay: {
				delay: 3000,
				disableOnInteraction: false,
			},
			speed: 400,
			pagination: {
				el: ".swiper-pagination",
				clickable: true,
			},
			navigation: {
				nextEl: $this.find('.swiper_next'),
				prevEl: $this.find('.swiper_prev'),
			},
			a11y: {
				prevSlideMessage: '이전 슬라이드',
				nextSlideMessage: '다음 슬라이드',
			},
			observer: true,
			observeParents: true,
			watchOverflow: true,
		});

		//재생 일시정지
		$(this).find(".btn_stop").click(function(e){
			e.preventDefault();
			mainSlider.autoplay.stop();
		});

		$(this).find(".btn_play").click(function(e){
			e.preventDefault();
			mainSlider.autoplay.start();
		});
	});
}

//스크롤탑
function goTop(){
	var el = $('.floating_wrap .btn_top');
	if(el.length <= 0) return;

	$(window).on('scroll', function(){
		if($(this).scrollTop() > 120){
			el.show().stop().animate({
				'opacity':'1'
			}, 200);
		} else{
			el.stop().animate({
				'opacity':'0'
			}, {
				duration: 200,
				complete: function(){
					$(this).hide();
				}
			});
		}
	});

	el.on('click', function(e){
		e.preventDefault();
		$('body, html').stop().animate({
			scrollTop: 0
		});
	});
}

//레이어 팝업
function layerPop(){
	//팝업 오픈
	$('[data-popup-open]').on('click', function(e) {
		e.preventDefault();
		var target = $(this).attr('data-popup-open');
		$('[data-popup="' + target + '"]').addClass('open');
		lock();
	});

	//팝업 닫기
	$('[data-popup-close]').on('click', function(e) {
		e.preventDefault();
		var target = $(this).attr('data-popup-close');
		$('[data-popup="' + target + '"]').removeClass('open');
		//이중 팝업
		if( $('.popup_wrap.open').length == 1 ){
			lock();
		} else {
			unlock();
		}
	});

	//팝업 제외한 영역 클릭 시 닫힘
	$('.popup_wrap').on('click', function(e){
		if( e.target == this ){
			$(this).removeClass('open');
			unlock();
		}
	});
}

//스크롤 잠금
function lock(){
	const body = document.querySelector('body');

	if (!body.getAttribute('scrollY')) {
		const pageY = window.pageYOffset;

		body.setAttribute('scrollY', pageY.toString());
		body.classList.add('lockbody');
		body.style.top = `-${pageY}px`;
	}
}

//스크롤 잠금 해제
function unlock(){
	const body = document.querySelector('body');

	if (body.getAttribute('scrollY')) {
		body.classList.remove('lockbody');
		body.style.removeProperty('top');

		window.scrollTo(0, Number(body.getAttribute('scrollY')));
		body.removeAttribute('scrollY');
	}
}

//아코디언
function accordion(){
	function eventHandler(_el, _el2){
		_el = $(_el);
		if(_el.hasClass('on')){
			//닫힘
			_el.removeClass('on').attr('aria-label', '해당 내용 열기');
			_el.next(_el2).stop().slideUp();

		} else {
			//열림
			_el.addClass('on').attr('aria-label', '해당 내용 닫기');
			_el.next(_el2).stop().slideDown();
		}
	}

	$('[data-accd-btn]').each(function(){
		$(this).attr('aria-label', '해당 내용 열기');
		$(this).click(function(){
			eventHandler(this, $('[data-accd-cont]'));
		});
	});
}

$(document).ready(function(){
	setCSS();
	checkDevice();
	skipNav();
	allMenuOpen();
	mainVisual();
	goTop();
	layerPop();
	accordion();

	AOS.init({
		offset: 120,
		duration: 1500,
	});
});
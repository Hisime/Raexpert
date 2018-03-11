$(document).ready(function(){

  $('.slider__items').owlCarousel({
    items:1,
    smartSpeed: 500,
    nav: true,
    loop: true,
    autoplay: true
  });

  $('.archive__caption').owlCarousel({
    items: 12,
    nav: true,
    mouseDrag: false,
    autoWidth: true
  })

  $('.rating-tabs__caption').on('click', 'li:not(.active)', function() {
    $(this).addClass('active').siblings().removeClass('active');
    $('.rating-tabs__content').removeClass('active').eq($(this).index()).addClass('active');
  });

  $('.press-releases__caption').on('click', 'li:not(.active)', function() {
    $(this).addClass('active').siblings().removeClass('active');
    $('.press-releases__content').removeClass('active').eq($(this).index()).addClass('active');
  });

  $('.archive__caption-item:not(.disabled)').on('click', function() {
    var $this = $(this);
    var index = $this.parent(".owl-item").index();
    $('.archive__caption-item').removeClass('active');
    $(this).addClass('active');
    $('.archive__content').removeClass('active')
      .eq(index)
      .addClass('active');
  });

    $('.calendar__title').click(function(){
      $(this).siblings().slideToggle();
      $(this).toggleClass("active");
      if ($(this).hasClass("active")) {
        $(this).text("Sovereign Rating Calendar 2018");
      } else {
        $(this).text("See Sovereign Rating Calendar 2018");
      }
  });


  $('.burger-js').click( function() {
    $(this).toggleClass('burger--open');
    $('.main-nav-js').toggleClass('open');
  });

  if ($('.page-header-js')) {
    $(document).on('touchstart', function(e) {
      if (!$(e.target).closest('.page-header-js').length) {
        $('.main-nav-js').removeClass("open");
        $('.burger-js').removeClass('burger--open');
      }
    e.stopPropagation();
    });
  };
});






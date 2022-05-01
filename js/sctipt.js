

// Изменение цвета ссылок меню
jQuery(function($) {

  const section = $('section'),
        nav = $('.header');
  let  navHeight = nav.outerHeight(); 

  window.addEventListener('orientationchange', function () {
      navHeight = nav.outerHeight();
  }, false);

  $(window).on('scroll', function () {
      const position = $(this).scrollTop();

      section.each(function () {
          const top = $(this).offset().top - navHeight - 5,
                bottom = top + $(this).outerHeight();

          if (position >= top && position <= bottom) {
            
              nav.find('a').removeClass('active');
              section.removeClass('active');

              $(this).addClass('active');
              nav.find('a[href="#' + $(this).attr('id') + '"]').addClass('active');
          }
      });
  });

  nav.find('a').on('click', function () {
      const id = $(this).attr('href');

      $('html, body').animate({
          scrollTop: $(id).offset().top - navHeight
      }, 487);

      return false;
  });

});

const hamburger = document.querySelector('.hamburger'),
      menu = document.querySelector('.header');

hamburger.addEventListener('click',() => {
    menu.classList.toggle('active');
    hamburger.classList.toggle('active');
});
window.addEventListener('touchmove', function() {
    hamburger.classList.remove('active');
    menu.classList.remove('active');
  });


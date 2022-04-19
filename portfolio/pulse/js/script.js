
$(document).ready(function(){
    $('.carousel__wpapper').slick({
        autoplay: true,
        prevArrow: '<button type="button" class="slick-prev"><img src="icons/left.png" alt="left"></button>',
        nextArrow: '<button type="button" class="slick-next"><img src="icons/right.png" alt="right"></button>',
    });

    $('ul.catalog__tabs').on('click', 'li:not(.catalog__tab_active)', function() {
        $(this)
          .addClass('catalog__tab_active').siblings().removeClass('catalog__tab_active')
          .closest('div.container').find('div.catalog__cards').removeClass('catalog__cards_active').eq($(this).index()).addClass('catalog__cards_active animate__animated animate__bounceInLeft');
    });
    
    function toggleSlide(item) {
        $(item).each(function(i) {
            $(this).on('click', function(e) {
                $('.catalog__content').eq(i).toggleClass('catalog__content_active');
            })
        });
    }
    toggleSlide('.catalog__link');
    toggleSlide('.catalog__link_back');
    
    $('[data-modal=consultation]').on('click', function() {
        $('.overlay, #consultation').fadeIn()
    });
    $('.modal__close').on('click', function() {
        $('.overlay, #consultation, #order, #thanks').fadeOut()
    })

    $('.button_catalog').each(function(i) {
        $(this).on('click', function() {
            $('#order .modal__descr').text($('.catalog__subheader').eq(i).text());
            $('.overlay, #order').fadeIn();
        });
    });

    function validateForms(form){
        $(form).validate({
            rules: {
                name: "required",
                phone: "required",
                email: {
                    required: true,
                    email: true
                }
            },
            messages: {
                name: {
                    required: "Пожалуйста, введите свое имя",
                  },
                phone: "Пожалуйста, введите свой номер телефона",
                email: {
                  required: "Пожалуйста, введите свою почту",
                  email: "Неправильно введен адрес почты"
                }
            }
        });
    };

    validateForms('#consultation-form');
    validateForms('#consultation form');
    validateForms('#order form');

    $('input[name=phone]').mask("+7 (999) 999-99-99");

    $('form').submit(function(e) {
        e.preventDefault();
        $.ajax({
            type: "POST",
            url: "mailer/smart.php",
            data: $(this).serialize()
        }).done(function() {
            $(this).find("input").val("");
            $('#consultation, #order').fadeOut();
            $('.overlay, #thanks').fadeIn();

            $('form').trigger('reset');
        });
        return false;
    });

    $(window).scroll(function() {
        if ($(this).scrollTop() > 800) {
            $('.pageup').fadeIn();
        } else {
            $('.pageup').fadeOut();
        };
    })

    $(function(){
        $("a[href^='#']").click(function(){
                var _href = $(this).attr("href");
                $("html, body").animate({scrollTop: $(_href).offset().top+"px"});
                return false;
        });
});

});


          
// هنگامی که DOM کاملاً لود شد
$(document).ready(function() {
    // مخفی کردن لودر پس از لود کامل صفحه
    setTimeout(function() {
        $('.loader-wrapper').fadeOut('slow');
    }, 1000);
    
    // دکمه بازگشت به بالا
    $(window).scroll(function() {
        if ($(this).scrollTop() > 300) {
            $('#backToTop').fadeIn();
        } else {
            $('#backToTop').fadeOut();
        }
    });
    
    $('#backToTop').click(function() {
        $('html, body').animate({scrollTop: 0}, 800);
        return false;
    });
    
    // شمارنده آمار و ارقام
    if ($('.counter').length) {
        $('.counter').each(function() {
            $(this).prop('Counter', 0).animate({
                Counter: $(this).data('count')
            }, {
                duration: 2000,
                easing: 'swing',
                step: function(now) {
                    $(this).text(Math.ceil(now));
                }
            });
        });
    }
    
    // اعتبارسنجی فرم تماس
    if ($('#contactForm').length) {
        $('#contactForm').on('submit', function(e) {
            e.preventDefault();
            
            // اعتبارسنجی ساده
            let isValid = true;
            $('#contactForm input[required], #contactForm select[required], #contactForm textarea[required]').each(function() {
                if ($(this).val() === '') {
                    isValid = false;
                    $(this).addClass('is-invalid');
                } else {
                    $(this).removeClass('is-invalid');
                }
            });
            
            if (isValid) {
                // شبیه‌سازی ارسال فرم
                $('#contactForm').html(`
                    <div class="alert alert-success text-center">
                        <i class="fas fa-check-circle fa-2x mb-3"></i>
                        <h4>پیام شما با موفقیت ارسال شد!</h4>
                        <p>کارشناسان ما در اسرع وقت با شما تماس خواهند گرفت.</p>
                    </div>
                `);
            }
        });
    }
    
    // فیلتر محصولات
    if ($('.filter-button').length) {
        $('.filter-button').click(function() {
            var value = $(this).attr('data-filter');
            
            $('.filter-button').removeClass('active');
            $(this).addClass('active');
            
            if (value === 'all') {
                $('.product-item').show('1000');
            } else {
                $('.product-item').not('.' + value).hide('1000');
                $('.product-item').filter('.' + value).show('1000');
            }
        });
    }
    
    // اسموث اسکرول برای لینک‌های داخلی
    $('a[href^="#"]').on('click', function(event) {
        var target = $(this.getAttribute('href'));
        if (target.length) {
            event.preventDefault();
            $('html, body').stop().animate({
                scrollTop: target.offset().top - 70
            }, 1000);
        }
    });
});
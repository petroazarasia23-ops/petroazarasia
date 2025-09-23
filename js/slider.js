// اسکریپت مدیریت اسلایدشو
$(document).ready(function() {
    // تنظیمات کاروسل
    $('#mainCarousel').carousel({
        interval: 5000,
        pause: 'hover'
    });
    
    // نشانگر پیشرفت برای اسلایدشو
    var progressBar = $('.progress-bar');
    var progressInterval;
    
    function startProgressBar() {
        clearInterval(progressInterval);
        progressBar.css('width', '0%');
        progressBar.animate({
            width: '100%'
        }, 5000, 'linear');
    }
    
    $('#mainCarousel').on('slide.bs.carousel', function() {
        startProgressBar();
    });
    
    // شروع پیشرفت بار هنگام لود صفحه
    startProgressBar();
    
    // کنترل‌های کاروسل با کیبورد
    $(document).keydown(function(e) {
        if (e.keyCode === 37) { // فلش چپ
            $('#mainCarousel').carousel('prev');
        } else if (e.keyCode === 39) { // فلش راست
            $('#mainCarousel').carousel('next');
        }
    });
    
    // اضافه کردن نشانگر پیشرفت به کاروسل
    $('.carousel-indicators').after('<div class="progress" style="height: 5px; margin-top: 10px;"><div class="progress-bar" role="progressbar" style="width: 0%;" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div></div>');
});
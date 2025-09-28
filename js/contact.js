// فایل JavaScript مخصوص صفحه تماس با ما - سازگار با Netlify

$(document).ready(function() {
    // مدیریت ارسال فرم تماس
    $('#contactForm').on('submit', function(e) {
        e.preventDefault();
        
        // اعتبارسنجی فرم
        if (validateContactForm()) {
            // ارسال فرم به Netlify
            submitToNetlify();
        }
    });
    
    // اعتبارسنجی فیلدهای فرم
    function validateContactForm() {
        let isValid = true;
        
        // ریست کردن خطاهای قبلی
        $('.is-invalid').removeClass('is-invalid');
        $('.invalid-feedback').remove();
        
        // اعتبارسنجی نام
        const name = $('#name').val().trim();
        if (name === '') {
            showValidationError('#name', 'لطفاً نام و نام خانوادگی خود را وارد کنید');
            isValid = false;
        } else if (name.length < 3) {
            showValidationError('#name', 'نام باید حداقل 3 کاراکتر باشد');
            isValid = false;
        }
        
        // اعتبارسنجی ایمیل
        const email = $('#email').val().trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email === '') {
            showValidationError('#email', 'لطفاً ایمیل خود را وارد کنید');
            isValid = false;
        } else if (!emailRegex.test(email)) {
            showValidationError('#email', 'لطفاً یک ایمیل معتبر وارد کنید');
            isValid = false;
        }
        
        // اعتبارسنجی تلفن
        const phone = $('#phone').val().trim();
        const phoneRegex = /^[\d\s\-()+]{10,}$/;
        if (phone !== '' && !phoneRegex.test(phone)) {
            showValidationError('#phone', 'لطفاً شماره تلفن معتبر وارد کنید');
            isValid = false;
        }
        
        // اعتبارسنجی موضوع
        const subject = $('#subject').val();
        if (!subject) {
            showValidationError('#subject', 'لطفاً موضوع را انتخاب کنید');
            isValid = false;
        }
        
        // اعتبارسنجی پیام
        const message = $('#message').val().trim();
        if (message === '') {
            showValidationError('#message', 'لطفاً پیام خود را وارد کنید');
            isValid = false;
        } else if (message.length < 10) {
            showValidationError('#message', 'پیام باید حداقل 10 کاراکتر باشد');
            isValid = false;
        }
        
        return isValid;
    }
    
    // نمایش خطای اعتبارسنجی
    function showValidationError(selector, message) {
        $(selector).addClass('is-invalid');
        $(selector).after(`<div class="invalid-feedback">${message}</div>`);
    }
    
    // ارسال فرم به Netlify
    function submitToNetlify() {
        const submitBtn = $('#contactForm button[type="submit"]');
        const originalText = submitBtn.html();
        
        // نمایش حالت لودینگ
        submitBtn.prop('disabled', true);
        submitBtn.html('<i class="fas fa-spinner fa-spin"></i> در حال ارسال...');
        
        // جمع‌آوری داده‌های فرم
        const formData = new FormData(document.getElementById('contactForm'));
        
        // ارسال درخواست به Netlify
        fetch('/', {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => {
            if (response.ok) {
                // نمایش پیام موفقیت
                showSuccessMessage();
            } else {
                throw new Error('خطا در ارسال فرم');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showErrorMessage('خطا در ارسال فرم. لطفاً دوباره تلاش کنید.');
        })
        .finally(() => {
            // بازگرداندن دکمه به حالت اول
            submitBtn.prop('disabled', false);
            submitBtn.html(originalText);
        });
    }
    
    // نمایش پیام موفقیت
    function showSuccessMessage() {
        $('#contactForm').html(`
            <div class="alert alert-success text-center py-4">
                <i class="fas fa-check-circle fa-3x text-success mb-3"></i>
                <h4 class="alert-heading">پیام شما با موفقیت ارسال شد!</h4>
                <p class="mb-3">کارشناسان ما در اسرع وقت با شما تماس خواهند گرفت.</p>
                <hr>
                <p class="mb-0 small">شماره پیگیری: <strong>PET-${Date.now().toString().slice(-6)}</strong></p>
                <button class="btn btn-primary mt-3" onclick="location.reload()">ارسال پیام جدید</button>
            </div>
        `);
        
        // پاک کردن پیش‌نویس
        ContactForm.clearDraft();
    }
    
    // نمایش پیام خطا
    function showErrorMessage(message) {
        const alert = $(`
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                <i class="fas fa-exclamation-triangle me-2"></i>
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `);
        
        $('#contactForm').prepend(alert);
        
        // حذف خودکار آلرت بعد از 5 ثانیه
        setTimeout(() => {
            alert.alert('close');
        }, 5000);
    }
    
    // مدیریت تغییر موضوع
    $('#subject').on('change', function() {
        const selectedValue = $(this).val();
        const messageField = $('#message');
        
        // پیشنهاد متن بر اساس موضوع انتخاب شده
        const suggestions = {
            'product': 'لطفاً محصول مورد نظر، مقدار مورد نیاز و مشخصات فنی مورد نیاز خود را ذکر کنید.',
            'service': 'لطفاً نوع خدمات مورد نیاز، زمانبندی و جزئیات پروژه خود را شرح دهید.',
            'complaint': 'لطفاً مشکل یا پیشنهاد خود را به طور کامل و دقیق توضیح دهید.',
            'partnership': 'لطفاً زمینه همکاری، اهداف و انتظارات خود را از مشارکت بیان کنید.',
            'other': 'لطفاً موضوع و درخواست خود را به طور کامل شرح دهید.'
        };
        
        if (suggestions[selectedValue]) {
            messageField.attr('placeholder', suggestions[selectedValue]);
        }
    });
    
    // اعتبارسنجی بلادرنگ
    $('input, textarea, select').on('blur', function() {
        const field = $(this);
        const value = field.val().trim();
        
        if (field.attr('id') === 'name' && value !== '') {
            if (value.length < 3) {
                showValidationError('#' + field.attr('id'), 'نام باید حداقل 3 کاراکتر باشد');
            } else {
                field.removeClass('is-invalid');
                field.next('.invalid-feedback').remove();
            }
        }
        
        if (field.attr('id') === 'email' && value !== '') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                showValidationError('#' + field.attr('id'), 'لطفاً یک ایمیل معتبر وارد کنید');
            } else {
                field.removeClass('is-invalid');
                field.next('.invalid-feedback').remove();
            }
        }
        
        if (field.attr('id') === 'message' && value !== '') {
            if (value.length < 10) {
                showValidationError('#' + field.attr('id'), 'پیام باید حداقل 10 کاراکتر باشد');
            } else {
                field.removeClass('is-invalid');
                field.next('.invalid-feedback').remove();
            }
        }
    });
    
    // شمارنده کاراکتر برای پیام
    $('#message').on('input', function() {
        const length = $(this).val().length;
        const counter = $('#message-counter');
        
        if (!counter.length) {
            $(this).after('<div id="message-counter" class="form-text text-muted mt-1"></div>');
        }
        
        $('#message-counter').text(`${length} کاراکتر (حداقل 10 کاراکتر)`);
        
        if (length < 10) {
            $('#message-counter').addClass('text-danger').removeClass('text-success');
        } else {
            $('#message-counter').addClass('text-success').removeClass('text-danger');
        }
    });
});

// توابع عمومی برای مدیریت فرم
const ContactForm = {
    // ذخیره پیش‌نویس فرم
    saveDraft: function() {
        const formData = {
            name: $('#name').val(),
            email: $('#email').val(),
            phone: $('#phone').val(),
            company: $('#company').val(),
            subject: $('#subject').val(),
            message: $('#message').val()
        };
        
        localStorage.setItem('contactFormDraft', JSON.stringify(formData));
        this.showToast('پیش‌نویس فرم ذخیره شد', 'success');
    },
    
    // بارگذاری پیش‌نویس
    loadDraft: function() {
        const draft = localStorage.getItem('contactFormDraft');
        if (draft) {
            const formData = JSON.parse(draft);
            $('#name').val(formData.name || '');
            $('#email').val(formData.email || '');
            $('#phone').val(formData.phone || '');
            $('#company').val(formData.company || '');
            $('#subject').val(formData.subject || '');
            $('#message').val(formData.message || '');
            
            // به‌روزرسانی شمارنده کاراکتر
            if (formData.message) {
                $('#message').trigger('input');
            }
        }
    },
    
    // پاک کردن پیش‌نویس
    clearDraft: function() {
        localStorage.removeItem('contactFormDraft');
        this.showToast('پیش‌نویس فرم پاک شد', 'warning');
    },
    
    // نمایش نوتیفیکیشن
    showToast: function(message, type = 'info') {
        // ایجاد toast اگر وجود ندارد
        if (!$('#toastContainer').length) {
            $('body').append('<div id="toastContainer" class="toast-container position-fixed bottom-0 end-0 p-3"></div>');
        }
        
        const toastId = 'toast-' + Date.now();
        const toast = $(`
            <div id="${toastId}" class="toast align-items-center text-bg-${type} border-0" role="alert">
                <div class="d-flex">
                    <div class="toast-body">${message}</div>
                    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
                </div>
            </div>
        `);
        
        $('#toastContainer').append(toast);
        const bsToast = new bootstrap.Toast(toast[0]);
        bsToast.show();
        
        // حذف خودکار پس از نمایش
        toast.on('hidden.bs.toast', function() {
            $(this).remove();
        });
    }
};

// بارگذاری خودکار پیش‌نویس هنگام لود صفحه
$(window).on('load', function() {
    setTimeout(function() {
        ContactForm.loadDraft();
    }, 1000);
});

// ذخیره خودکار پیش‌نویس هر 30 ثانیه
setInterval(function() {
    if ($('#name').val() || $('#email').val() || $('#message').val()) {
        ContactForm.saveDraft();
    }
}, 30000);

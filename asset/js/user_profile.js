// Set default theme
document.documentElement.setAttribute('data-theme', 'light');
let currentTheme = 'light'; // Keep track of manually selected theme

// Toast notification function
function showToast(message, type = 'success') {
    const toastContainer = document.getElementById('toastContainer');
    const toastId = 'toast-' + Date.now();
    const iconMap = {
        success: 'fa-check-circle',
        error: 'fa-times-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };
    const bgMap = {
        success: 'bg-success',
        error: 'bg-danger',
        warning: 'bg-warning',
        info: 'bg-info'
    };

    const toastHTML = `
                <div class="toast align-items-center text-white ${bgMap[type]} border-0" role="alert" id="${toastId}">
                    <div class="d-flex">
                        <div class="toast-body">
                            <i class="fas ${iconMap[type]} me-2"></i> ${message}
                        </div>
                        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
                    </div>
                </div>
            `;

    toastContainer.insertAdjacentHTML('beforeend', toastHTML);
    const toastElement = document.getElementById(toastId);
    const toast = new bootstrap.Toast(toastElement, { delay: 3000 });
    toast.show();

    toastElement.addEventListener('hidden.bs.toast', () => {
        toastElement.remove();
    });
}

// Avatar upload
document.getElementById('avatarInput').addEventListener('change', function (e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            document.getElementById('avatarImg').src = e.target.result;
            showToast('រូបភាពត្រូវបានផ្ទុកដោយជោគជ័យ!', 'success');
        };
        reader.readAsDataURL(file);
    }
});

// Profile form submission
document.getElementById('profileForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address').value;

    // Reset validation states
    document.querySelectorAll('.form-control').forEach(input => {
        input.classList.remove('is-invalid', 'is-valid');
    });

    let isValid = true;

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        document.getElementById('email').classList.add('is-invalid');
        showToast('សូមបញ្ចូលអ៊ីមែលឱ្យបានត្រឹមត្រូវ! ត្រូវមាន @ និង domain', 'error');
        isValid = false;
    } else {
        document.getElementById('email').classList.add('is-valid');
    }

    // Validate phone
    if (!phone || phone.trim() === '') {
        document.getElementById('phone').classList.add('is-invalid');
        showToast('សូមបញ្ចូលលេខទូរស័ព្ទ!', 'warning');
        isValid = false;
    } else {
        document.getElementById('phone').classList.add('is-valid');
    }

    // Validate names
    if (!firstName.trim() || !lastName.trim()) {
        if (!firstName.trim()) document.getElementById('firstName').classList.add('is-invalid');
        if (!lastName.trim()) document.getElementById('lastName').classList.add('is-invalid');
        showToast('សូមបញ្ចូលឈ្មោះឱ្យបានគ្រប់គ្រាន់!', 'warning');
        isValid = false;
    } else {
        document.getElementById('firstName').classList.add('is-valid');
        document.getElementById('lastName').classList.add('is-valid');
    }

    if (!isValid) {
        return;
    }

    document.getElementById('userName').textContent = firstName + ' ' + lastName;
    document.getElementById('userEmail').textContent = email;
    showToast('ព័ត៌មានត្រូវបានរក្សាទុកដោយជោគជ័យ!', 'success');

    // Remove validation classes after success
    setTimeout(() => {
        document.querySelectorAll('.form-control').forEach(input => {
            input.classList.remove('is-valid');
        });
    }, 2000);
});

// Password strength checker
document.getElementById('newPassword').addEventListener('input', function (e) {
    const password = e.target.value;
    const strengthBar = document.getElementById('strengthBar');
    const strengthText = document.getElementById('strengthText');

    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z\d]/.test(password)) strength++;

    strengthBar.className = 'password-strength';
    if (strength <= 1) {
        strengthBar.classList.add('strength-weak');
        strengthText.textContent = 'ខ្សោយ';
        strengthText.style.color = 'var(--danger-color)';
    } else if (strength <= 3) {
        strengthBar.classList.add('strength-medium');
        strengthText.textContent = 'មធ្យម';
        strengthText.style.color = 'var(--warning-color)';
    } else {
        strengthBar.classList.add('strength-strong');
        strengthText.textContent = 'ខ្លាំង';
        strengthText.style.color = 'var(--success-color)';
    }
});
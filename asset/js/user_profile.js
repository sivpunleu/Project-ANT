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

// Password form submission
document.getElementById('passwordForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (!currentPassword) {
        showToast('សូមបញ្ចូលពាក្យសម្ងាត់បច្ចុប្បន្ន!', 'warning');
        return;
    }

    if (newPassword !== confirmPassword) {
        showToast('ពាក្យសម្ងាត់មិនត្រូវគ្នាទេ!', 'error');
        return;
    }

    if (newPassword.length < 8) {
        showToast('ពាក្យសម្ងាត់ត្រូវមានយ៉ាងហោចណាស់ ៨ តួអក្សរ!', 'warning');
        return;
    }

    showToast('ពាក្យសម្ងាត់ត្រូវបានផ្លាស់ប្តូរដោយជោគជ័យ!', 'success');
    document.getElementById('passwordForm').reset();
    document.getElementById('strengthBar').className = 'password-strength';
    document.getElementById('strengthText').textContent = '';
});

// Two-factor authentication toggle
document.getElementById('twoFactorSwitch').addEventListener('change', function () {
    if (this.checked) {
        showToast('Two-Factor Authentication បានបើក', 'success');
    } else {
        showToast('Two-Factor Authentication បានបិទ', 'info');
    }
});

// Privacy mode toggle
document.getElementById('privacySwitch').addEventListener('change', function () {
    if (this.checked) {
        showToast('Privacy Mode បានបើក', 'success');
    } else {
        showToast('Privacy Mode បានបិទ', 'info');
    }
});

// Notification toggles
document.getElementById('emailNotif').addEventListener('change', function () {
    const status = this.checked ? 'បើក' : 'បិទ';
    showToast('ការជូនដំណឹងតាមអ៊ីមែល ' + status, 'info');
});

document.getElementById('pushNotif').addEventListener('change', function () {
    const status = this.checked ? 'បើក' : 'បិទ';
    showToast('Push Notifications ' + status, 'info');
});

document.getElementById('smsNotif').addEventListener('change', function () {
    const status = this.checked ? 'បើក' : 'បិទ';
    showToast('SMS Notifications ' + status, 'info');
});

// Save notifications
function saveNotifications() {
    showToast('ការកំណត់ការជូនដំណឹងត្រូវបានរក្សាទុក!', 'success');
}

// --- UPDATED Theme switcher ---
function setTheme(theme) {
    currentTheme = theme;
    const rootEl = document.documentElement;

    // Remove active class from all theme buttons
    document.querySelectorAll('#settings .theme-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    if (theme === 'light') {
        rootEl.setAttribute('data-theme', 'light');
        const lightBtn = document.getElementById('lightTheme');
        if (lightBtn) lightBtn.classList.add('active');
        showToast('ប្តូរទៅស្បែកភ្លឺ', 'success');
    } else if (theme === 'dark') {
        rootEl.setAttribute('data-theme', 'dark');
        const darkBtn = document.getElementById('darkTheme');
        if (darkBtn) darkBtn.classList.add('active');
        showToast('ប្តូរទៅស្បែកងងឹត', 'success');
    } else if (theme === 'auto') {
        const autoBtn = document.getElementById('autoTheme');
        if (autoBtn) autoBtn.classList.add('active');

        // Use prefers-color-scheme media query
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            rootEl.setAttribute('data-theme', 'dark');
        } else {
            rootEl.setAttribute('data-theme', 'light');
        }
        showToast('ប្រើប្រាស់ស្បែកស្វ័យប្រវត្តិ', 'success');
    }
}

// Listen for system theme changes if 'auto' is selected
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    if (currentTheme === 'auto') {
        const newTheme = e.matches ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
    }
});
// --- END UPDATED Theme switcher ---


// Welcome message on page load
window.addEventListener('load', function () {
    setTimeout(() => {
        showToast('សូមស្វាគមន៍មកកាន់គណនីរបស់អ្នក! 🎉', 'success');
    }, 500);

    // Set initial theme based on 'auto' setting
    setTheme('auto');
    // Find the 'auto' button in settings and make it active
    const autoBtn = document.getElementById('autoTheme');
    if (autoBtn) autoBtn.classList.add('active');
    // Deactivate the default 'light' button
    const lightBtn = document.getElementById('lightTheme');
    if (lightBtn) lightBtn.classList.remove('active');

});

// Counter animation for stats
function animateCounters() {
    const counters = document.querySelectorAll('.counter');
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                counter.textContent = target.toLocaleString();
                clearInterval(timer);
            } else {
                counter.textContent = Math.floor(current).toLocaleString();
            }
        }, 16);
    });
}

// Observe stats tab and animate when visible
const statsTab = document.querySelector('button[data-bs-target="#stats"]');
statsTab.addEventListener('click', function () {
    setTimeout(animateCounters, 100);
});

// Activity Chart
function createActivityChart() {
    const ctx = document.getElementById('activityChart');
    if (!ctx) return;

    const gradient = ctx.getContext('2d').createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(184, 119, 7, 0.8)'); // Use new primary color
    gradient.addColorStop(1, 'rgba(220, 38, 38, 0.1)'); // Use new secondary color

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['ច័ន្ទ', 'អង្គារ', 'ពុធ', 'ព្រហស្បតិ៍', 'សុក្រ', 'សៅរ៍', 'អាទិត្យ'],
            datasets: [{
                label: 'សកម្មភាព',
                data: [12, 19, 15, 25, 22, 30, 28],
                backgroundColor: gradient,
                borderColor: 'var(--primary-color)', // Use new primary color
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointRadius: 5,
                pointBackgroundColor: 'var(--primary-color)', // Use new primary color
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointHoverRadius: 7
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    borderRadius: 8,
                    titleFont: {
                        size: 14
                    },
                    bodyFont: {
                        size: 13
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(148, 163, 184, 0.1)',
                        drawBorder: false
                    },
                    ticks: {
                        color: '#64748b'
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#64748b'
                    }
                }
            }
        }
    });
}

// Create chart when stats tab is clicked
statsTab.addEventListener('click', function () {
    setTimeout(createActivityChart, 100);
}, { once: true });

// Delete account confirmation
function confirmDeleteAccount() {
    const confirmInput = document.getElementById('deleteConfirmInput').value;

    if (confirmInput === 'DELETE') {
        const modal = bootstrap.Modal.getInstance(document.getElementById('deleteAccountModal'));
        modal.hide();
        showToast('គណនីរបស់អ្នកកំពុងត្រូវបានលុប...', 'warning');

        setTimeout(() => {
            showToast('គណនីត្រូវបានលុបដោយជោគជ័យ!', 'success');
            setTimeout(() => {
                window.location.href = '/';
            }, 1500);
        }, 2000);
    } else {
        showToast('សូមវាយបញ្ចូល DELETE ដើម្បីបញ្ជាក់!', 'error');
    }
}

// --- Other Settings Tab Functions (Placeholders) ---
function saveAllSettings() {
    showToast('ការកំណត់ទាំងអស់ត្រូវបានរក្សាទុក!', 'success');
}

function resetSettings() {
    showToast('ការកំណត់ត្រូវបានកំណត់ឡើងវិញ!', 'info');
    // Add logic to reset form fields
    document.getElementById('languageSelect').value = 'km';
    document.getElementById('dateFormat').value = 'yyyy-mm-dd';
    // ... reset other fields
    setTheme('auto'); // Reset theme
}

function clearCache() {
    showToast('Cache បានសម្អាត!', 'success');
}

function exportData() {
    showToast('កំពុងនាំចេញទិន្នន័យ...', 'info');
}

function backupSettings() {
    showToast('កំពុងបម្រុងទុកការកំណត់...', 'info');
}

function importSettings() {
    showToast('សូមជ្រើសរើសឯកសារកំណត់...', 'info');
    // You would trigger a file input here
}

// Keyboard shortcuts
document.addEventListener('keydown', function (e) {
    // Ctrl + S to save profile
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        const activeTab = document.querySelector('.tab-pane.active');
        if (activeTab.id === 'profile') {
            document.getElementById('profileForm').dispatchEvent(new Event('submit'));
        } else if (activeTab.id === 'password') {
            document.getElementById('passwordForm').dispatchEvent(new Event('submit'));
        }
    }
});
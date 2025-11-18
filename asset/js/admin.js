// Store original values
let originalValues = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: ''
};

// Store current form values on page load
document.addEventListener('DOMContentLoaded', function () {
    originalValues.firstName = document.getElementById('firstName').value;
    originalValues.lastName = document.getElementById('lastName').value;
    originalValues.email = document.getElementById('email').value;
    originalValues.phone = document.getElementById('phone').value;
    originalValues.address = document.getElementById('address').value;

    // Load saved theme preference
    const savedTheme = localStorage.getItem('adminTheme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        document.querySelectorAll('.theme-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.theme-btn')[1].classList.add('active');
    }
});

// Avatar Upload
document.getElementById('avatarInput').addEventListener('change', function (e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            document.getElementById('avatarImg').src = e.target.result;
            showToast('រូបភាពត្រូវបានផ្លាស់ប្តូរដោយជោគជ័យ!', 'success');
        };
        reader.readAsDataURL(file);
    }
});

// Profile Form Submit
document.getElementById('profileForm').addEventListener('submit', function (e) {
    e.preventDefault();

    // Get current values
    const currentValues = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        address: document.getElementById('address').value
    };

    // Find changes
    const changes = [];

    if (currentValues.firstName !== originalValues.firstName) {
        changes.push({
            field: 'នាមត្រកូល',
            oldValue: originalValues.firstName,
            newValue: currentValues.firstName
        });
    }

    if (currentValues.lastName !== originalValues.lastName) {
        changes.push({
            field: 'នាមខ្លួន',
            oldValue: originalValues.lastName,
            newValue: currentValues.lastName
        });
    }

    if (currentValues.email !== originalValues.email) {
        changes.push({
            field: 'អ៊ីមែល',
            oldValue: originalValues.email,
            newValue: currentValues.email
        });
    }

    if (currentValues.phone !== originalValues.phone) {
        changes.push({
            field: 'លេខទូរស័ព្ទ',
            oldValue: originalValues.phone,
            newValue: currentValues.phone
        });
    }

    if (currentValues.address !== originalValues.address) {
        changes.push({
            field: 'អាសយដ្ឋាន',
            oldValue: originalValues.address,
            newValue: currentValues.address
        });
    }

    if (changes.length === 0) {
        showToast('មិនមានការផ្លាស់ប្តូរទេ', 'info');
        return;
    }

    // Display changes in modal
    displayChanges(changes, currentValues);
});

function displayChanges(changes, currentValues) {
    const changesList = document.getElementById('changesList');
    changesList.innerHTML = '';

    changes.forEach((change, index) => {
        const changeItem = `
                    <div class="card mb-3" style="animation: fadeInUp 0.3s ease-out ${index * 0.1}s both;">
                        <div class="card-body">
                            <div class="row align-items-center">
                                <div class="col-md-3">
                                    <strong><i class="fas fa-edit me-2 text-primary"></i>${change.field}</strong>
                                </div>
                                <div class="col-md-9">
                                    <div class="d-flex align-items-center flex-wrap">
                                        <div class="me-3 mb-2">
                                            <small class="text-muted d-block">តម្លៃចាស់:</small>
                                            <span class="badge bg-secondary" style="font-size: 0.9rem; padding: 8px 12px;">${change.oldValue || 'គ្មាន'}</span>
                                        </div>
                                        <div class="me-3 mb-2">
                                            <i class="fas fa-arrow-right text-primary"></i>
                                        </div>
                                        <div class="mb-2">
                                            <small class="text-muted d-block">តម្លៃថ្មី:</small>
                                            <span class="badge bg-success" style="font-size: 0.9rem; padding: 8px 12px;">${change.newValue}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
        changesList.innerHTML += changeItem;
    });

    // Store current values for confirmation
    window.pendingChanges = currentValues;

    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('changesModal'));
    modal.show();
}

function confirmSave() {
    if (window.pendingChanges) {
        // Update original values
        originalValues = { ...window.pendingChanges };

        // Update display name in header
        const fullName = `${window.pendingChanges.firstName} ${window.pendingChanges.lastName}`;
        document.getElementById('userName').textContent = fullName;

        // Close modal
        bootstrap.Modal.getInstance(document.getElementById('changesModal')).hide();

        // Show success message
        showToast('ព័ត៌មានត្រូវបានរក្សាទុកដោយជោគជ័យ!', 'success');

        // Clear pending changes
        window.pendingChanges = null;
    }
}

// Password Form Submit
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
        showToast('ពាក្យសម្ងាត់មិនត្រូវគ្នា!', 'danger');
        return;
    }

    if (newPassword.length < 12) {
        showToast('ពាក្យសម្ងាត់ត្រូវតែមានយ៉ាងតិច 12 តួអក្សរ!', 'warning');
        return;
    }

    // Show password change confirmation in modal
    const changesList = document.getElementById('changesList');
    changesList.innerHTML = `
                <div class="card mb-3">
                    <div class="card-body">
                        <div class="row align-items-center">
                            <div class="col-md-3">
                                <strong><i class="fas fa-key me-2 text-primary"></i>ពាក្យសម្ងាត់</strong>
                            </div>
                            <div class="col-md-9">
                                <div class="d-flex align-items-center flex-wrap">
                                    <div class="me-3 mb-2">
                                        <small class="text-muted d-block">តម្លៃចាស់:</small>
                                        <span class="badge bg-secondary" style="font-size: 0.9rem; padding: 8px 12px;">••••••••••••</span>
                                    </div>
                                    <div class="me-3 mb-2">
                                        <i class="fas fa-arrow-right text-primary"></i>
                                    </div>
                                    <div class="mb-2">
                                        <small class="text-muted d-block">តម្លៃថ្មី:</small>
                                        <span class="badge bg-success" style="font-size: 0.9rem; padding: 8px 12px;">••••••••••••</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="card" style="background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3);">
                    <div class="card-body">
                        <h6 class="mb-2"><i class="fas fa-shield-alt me-2 text-success"></i>កម្រិតសុវត្ថិភាព</h6>
                        <div class="d-flex align-items-center">
                            <div class="password-strength strength-strong" style="width: 100%; max-width: 300px;"></div>
                            <span class="ms-3 text-success"><strong>ខ្លាំង</strong></span>
                        </div>
                        <small class="text-muted mt-2 d-block">
                            <i class="fas fa-check-circle text-success me-1"></i>ប្រវែង: ${newPassword.length} តួអក្សរ<br>
                            <i class="fas fa-check-circle text-success me-1"></i>មានសុវត្ថិភាពគ្រប់គ្រាន់សម្រាប់គណនីអ្នកគ្រប់គ្រង
                        </small>
                    </div>
                </div>
            `;

    window.pendingPasswordChange = true;
    const modal = new bootstrap.Modal(document.getElementById('changesModal'));
    modal.show();
});

// Update confirmSave to handle password changes
function confirmSave() {
    if (window.pendingPasswordChange) {
        bootstrap.Modal.getInstance(document.getElementById('changesModal')).hide();
        showToast('ពាក្យសម្ងាត់ត្រូវបានផ្លាស់ប្តូរដោយជោគជ័យ!', 'success');
        document.getElementById('passwordForm').reset();
        document.getElementById('strengthBar').className = 'password-strength';
        document.getElementById('strengthText').textContent = '';
        window.pendingPasswordChange = false;
    } else if (window.pendingChanges) {
        // Update original values
        originalValues = { ...window.pendingChanges };

        // Update display name in header
        const fullName = `${window.pendingChanges.firstName} ${window.pendingChanges.lastName}`;
        document.getElementById('userName').textContent = fullName;

        // Close modal
        bootstrap.Modal.getInstance(document.getElementById('changesModal')).hide();

        // Show success message
        showToast('ព័ត៌មានត្រូវបានរក្សាទុកដោយជោគជ័យ!', 'success');

        // Clear pending changes
        window.pendingChanges = null;
    }
}

// Password Strength Checker
document.getElementById('newPassword').addEventListener('input', function (e) {
    const password = e.target.value;
    const strengthBar = document.getElementById('strengthBar');
    const strengthText = document.getElementById('strengthText');

    if (password.length === 0) {
        strengthBar.className = 'password-strength';
        strengthText.textContent = '';
        return;
    }

    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z\d]/.test(password)) strength++;

    if (strength <= 2) {
        strengthBar.className = 'password-strength strength-weak';
        strengthText.textContent = 'ខ្សោយ - សូមប្រើពាក្យសម្ងាត់ខ្លាំងជាងនេះ';
        strengthText.style.color = '#ef4444';
    } else if (strength <= 4) {
        strengthBar.className = 'password-strength strength-medium';
        strengthText.textContent = 'មធ្យម - អាចប្រើបាន';
        strengthText.style.color = '#f59e0b';
    } else {
        strengthBar.className = 'password-strength strength-strong';
        strengthText.textContent = 'ខ្លាំង - ពាក្យសម្ងាត់ល្អ!';
        strengthText.style.color = '#10b981';
    }
});

// Theme Switcher
function setTheme(theme) {
    if (theme === 'dark') {
        document.body.classList.add('dark-theme');
    } else {
        document.body.classList.remove('dark-theme');
    }

    // Update active button
    document.querySelectorAll('.theme-btn').forEach(btn => btn.classList.remove('active'));
    event.target.closest('.theme-btn').classList.add('active');

    showToast('ស្បែកត្រូវបានផ្លាស់ប្តូរដោយជោគជ័យ!', 'success');
}

// Toast Notification
function showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toastContainer');
    const toastId = 'toast-' + Date.now();

    const bgColors = {
        success: 'bg-success',
        danger: 'bg-danger',
        warning: 'bg-warning',
        info: 'bg-info'
    };

    const icons = {
        success: 'fa-check-circle',
        danger: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };

    const toastHTML = `
                <div id="${toastId}" class="toast align-items-center text-white ${bgColors[type]} border-0" role="alert">
                    <div class="d-flex">
                        <div class="toast-body">
                            <i class="fas ${icons[type]} me-2"></i>${message}
                        </div>
                        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
                    </div>
                </div>
            `;

    toastContainer.insertAdjacentHTML('beforeend', toastHTML);
    const toastElement = document.getElementById(toastId);
    const toast = new bootstrap.Toast(toastElement, { delay: 3000 });
    toast.show();

    toastElement.addEventListener('hidden.bs.toast', function () {
        toastElement.remove();
    });
}

// Security Switches
document.getElementById('twoFactorSwitch').addEventListener('change', function (e) {
    const isEnabled = e.target.checked;
    const changesList = document.getElementById('changesList');

    changesList.innerHTML = `
                <div class="card mb-3" style="animation: fadeInUp 0.3s ease-out;">
                    <div class="card-body text-center py-4">
                        <div class="mb-3">
                            <i class="fas fa-shield-alt fa-3x ${isEnabled ? 'text-success' : 'text-danger'}"></i>
                        </div>
                        <h5 class="mb-3">${isEnabled ? 'បើក' : 'បិទ'} Two-Factor Authentication</h5>
                        <p class="text-muted">${isEnabled ? 'អ្នកនឹងទទួលបានសុវត្ថិភាពបន្ថែម' : 'សុវត្ថិភាពរបស់អ្នកនឹងថយចុះ'}</p>
                        
                        <div class="alert ${isEnabled ? 'alert-success' : 'alert-warning'} text-start mt-3">
                            <strong><i class="fas fa-info-circle me-2"></i>${isEnabled ? 'អត្ថប្រយោជន៍' : 'ការព្រមាន'}:</strong>
                            <ul class="mb-0 mt-2">
                                ${isEnabled ? `
                                    <li>ការពារកំរិតខ្ពស់សម្រាប់គណនី</li>
                                    <li>ទាមទារកូដផ្ទៀងផ្ទាត់ពីទូរស័ព្ទ</li>
                                    <li>ការពារពីការលួចគណនី</li>
                                ` : `
                                    <li>គណនីរបស់អ្នកនឹងងាយរងគ្រោះ</li>
                                    <li>មិនត្រូវបានណែនាំសម្រាប់អ្នកគ្រប់គ្រង</li>
                                    <li>ប្រើតែពាក្យសម្ងាត់ប៉ុណ្ណោះ</li>
                                `}
                            </ul>
                        </div>

                        ${isEnabled ? `
                            <div class="mt-3 p-3" style="background: rgba(16, 185, 129, 0.1); border-radius: 12px;">
                                <p class="mb-2"><strong>ជំហានបន្ទាប់:</strong></p>
                                <ol class="text-start mb-0">
                                    <li>Scan QR code ជាមួយកម្មវិធី Authenticator</li>
                                    <li>បញ្ចូលកូដ 6 ខ្ទង់</li>
                                    <li>រក្សាទុក backup codes</li>
                                </ol>
                            </div>
                        ` : ''}
                    </div>
                </div>
            `;

    window.pending2FAChange = { enabled: isEnabled, element: this };
    const modal = new bootstrap.Modal(document.getElementById('changesModal'));
    modal.show();
});

// Maintenance Mode Switch
document.getElementById('maintenanceSwitch').addEventListener('change', function (e) {
    const isEnabled = e.target.checked;

    if (isEnabled) {
        const changesList = document.getElementById('changesList');
        changesList.innerHTML = `
                    <div class="card mb-3" style="animation: fadeInUp 0.3s ease-out;">
                        <div class="card-body text-center py-4">
                            <div class="mb-3">
                                <i class="fas fa-tools fa-3x text-warning"></i>
                            </div>
                            <h5 class="mb-3 text-danger">បើក Maintenance Mode</h5>
                            <p class="text-muted">ប្រព័ន្ធនឹងត្រូវបានបិទជាបណ្តោះអាសន្ន</p>
                            
                            <div class="alert alert-danger text-start mt-3">
                                <strong><i class="fas fa-exclamation-triangle me-2"></i>ការព្រមាន:</strong>
                                <ul class="mb-0 mt-2">
                                    <li><strong>អ្នកប្រើប្រាស់ទាំងអស់នឹងត្រូវបានគាត់ចេញ</strong></li>
                                    <li>គេហទំព័រនឹងបង្ហាញសារថែទាំ</li>
                                    <li>មានតែអ្នកគ្រប់គ្រងប៉ុណ្ណោះអាចចូលបាន</li>
                                    <li>សេវាកម្ម API នឹងត្រូវផ្អាក</li>
                                </ul>
                            </div>

                            <div class="mb-3">
                                <label class="form-label text-start d-block">សារជូនដំណឹង (Optional):</label>
                                <textarea class="form-control" rows="2" placeholder="ប្រព័ន្ធកំពុងត្រូវបានថែទាំ..." id="maintenanceMessage"></textarea>
                            </div>

                            <div class="alert alert-info text-start">
                                <i class="fas fa-clock me-2"></i>
                                <strong>រយៈពេលប្រហែល:</strong> 30 នាទី - 2 ម៉ោង
                            </div>
                        </div>
                    </div>
                `;

        window.pendingMaintenanceChange = { enabled: true, element: this };
        const modal = new bootstrap.Modal(document.getElementById('changesModal'));
        modal.show();
    } else {
        showToast('Maintenance Mode បានបិទ - ប្រព័ន្ធដំណើរការធម្មតា', 'success');
    }
});

// Debug Mode Switch
document.getElementById('debugSwitch').addEventListener('change', function (e) {
    if (e.target.checked) {
        showToast('Debug Mode បានបើក', 'info');
    } else {
        showToast('Debug Mode បានបិទ', 'info');
    }
});

// Auto Backup Switch
document.getElementById('autoBackupSwitch').addEventListener('change', function (e) {
    const isEnabled = e.target.checked;
    const changesList = document.getElementById('changesList');

    changesList.innerHTML = `
                <div class="card mb-3" style="animation: fadeInUp 0.3s ease-out;">
                    <div class="card-body text-center py-4">
                        <div class="mb-3">
                            <i class="fas fa-sync-alt fa-3x ${isEnabled ? 'text-success' : 'text-secondary'}"></i>
                        </div>
                        <h5 class="mb-3">${isEnabled ? 'បើក' : 'បិទ'} ការបម្រុងទុកស្វ័យប្រវត្តិ</h5>
                        <p class="text-muted">${isEnabled ? 'ទិន្នន័យនឹងត្រូវបម្រុងទុកស្វ័យប្រវត្តិ' : 'អ្នកត្រូវបម្រុងទុកដោយដៃ'}</p>
                        
                        <div class="alert ${isEnabled ? 'alert-success' : 'alert-warning'} text-start mt-3">
                            <strong><i class="fas fa-info-circle me-2"></i>${isEnabled ? 'អត្ថប្រយោជន៍' : 'ចំណាំ'}:</strong>
                            <ul class="mb-0 mt-2">
                                ${isEnabled ? `
                                    <li>ការពារទិន្នន័យដោយស្វ័យប្រវត្តិ</li>
                                    <li>បម្រុងទុកតាមកាលវិភាគ</li>
                                    <li>មិនចាំបាច់ចងចាំ</li>
                                ` : `
                                    <li>ត្រូវចងចាំបម្រុងទុកដោយដៃ</li>
                                    <li>ហានិភ័យបាត់បង់ទិន្នន័យ</li>
                                    <li>មិនត្រូវបានណែនាំ</li>
                                `}
                            </ul>
                        </div>

                        ${isEnabled ? `
                            <div class="row text-start mt-3">
                                <div class="col-md-6">
                                    <small class="text-muted">កាលវិភាគបម្រុងទុក:</small>
                                    <div class="mt-1"><span class="badge bg-primary">រៀងរាល់ថ្ងៃម្តង</span></div>
                                </div>
                                <div class="col-md-6">
                                    <small class="text-muted">ពេលវេលា:</small>
                                    <div class="mt-1"><span class="badge bg-primary">06:00 AM</span></div>
                                </div>
                            </div>
                        ` : ''}
                    </div>
                </div>
            `;

    window.pendingAutoBackupChange = { enabled: isEnabled, element: this };
    const modal = new bootstrap.Modal(document.getElementById('changesModal'));
    modal.show();
});

// Clear Cache Function
function clearCache() {
    if (confirm('តើអ្នកប្រាកដថាចង់លុប Cache ប្រព័ន្ធទេ?')) {
        showToast('កំពុងលុប Cache...', 'info');
        setTimeout(() => {
            showToast('Cache ត្រូវបានលុបដោយជោគជ័យ!', 'success');
        }, 2000);
    }
}

// Create Backup Function
function createBackup() {
    showToast('កំពុងបង្កើតការបម្រុងទុក...', 'info');

    // Simulate backup progress
    let progress = 0;
    const interval = setInterval(() => {
        progress += 20;
        if (progress >= 100) {
            clearInterval(interval);
            showToast('ការបម្រុងទុកត្រូវបានបង្កើតដោយជោគជ័យ!', 'success');
        }
    }, 500);
}

// Confirm Reset Function
function confirmReset() {
    const input = document.getElementById('resetConfirmInput').value;
    if (input === 'RESET') {
        showToast('កំពុងកំណត់ប្រព័ន្ធឡើងវិញ...', 'warning');
        setTimeout(() => {
            showToast('ប្រព័ន្ធត្រូវបានកំណត់ឡើងវិញដោយជោគជ័យ!', 'success');
            bootstrap.Modal.getInstance(document.getElementById('resetSystemModal')).hide();
            document.getElementById('resetConfirmInput').value = '';
        }, 2000);
    } else {
        showToast('សូមវាយបញ្ចូល "RESET" ដើម្បីបញ្ជាក់', 'danger');
    }
}

// Initialize tooltips (if any)
document.addEventListener('DOMContentLoaded', function () {
    originalValues.firstName = document.getElementById('firstName').value;
    originalValues.lastName = document.getElementById('lastName').value;
    originalValues.email = document.getElementById('email').value;
    originalValues.phone = document.getElementById('phone').value;
    originalValues.address = document.getElementById('address').value;

    // Load saved theme preference
    const savedTheme = localStorage.getItem('adminTheme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        document.querySelectorAll('.theme-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.theme-btn')[1].classList.add('active');
    }
});

// Save theme preference
function setTheme(theme) {
    if (theme === 'dark') {
        document.body.classList.add('dark-theme');
        localStorage.setItem('adminTheme', 'dark');
    } else {
        document.body.classList.remove('dark-theme');
        localStorage.setItem('adminTheme', 'light');
    }

    // Update active button
    document.querySelectorAll('.theme-btn').forEach(btn => btn.classList.remove('active'));
    event.target.closest('.theme-btn').classList.add('active');

    showToast('ស្បែកត្រូវបានផ្លាស់ប្តូរដោយជោគជ័យ!', 'success');
}

// Add User Function
function addUser() {
    showToast('កំពុងបន្ថែមអ្នកប្រើប្រាស់...', 'info');
    setTimeout(() => {
        showToast('អ្នកប្រើប្រាស់ត្រូវបានបន្ថែមដោយជោគជ័យ!', 'success');
        bootstrap.Modal.getInstance(document.getElementById('addUserModal')).hide();
    }, 1500);
}

// System Settings Changes
function showSystemChanges(e) {
    e.preventDefault();

    const changesList = document.getElementById('changesList');
    changesList.innerHTML = `
                <div class="alert alert-success mb-3">
                    <i class="fas fa-check-circle me-2"></i>
                    <strong>ការកំណត់ប្រព័ន្ធត្រូវបានផ្លាស់ប្តូរដោយជោគជ័យ!</strong>
                </div>
                
                <div class="card mb-3" style="animation: fadeInUp 0.3s ease-out;">
                    <div class="card-body">
                        <h6 class="mb-3"><i class="fas fa-cogs me-2 text-primary"></i>ការកំណត់ទូទៅ</h6>
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <small class="text-muted">ឈ្មោះប្រព័ន្ធ:</small>
                                <div class="mt-1"><span class="badge bg-info">Admin Portal System</span></div>
                            </div>
                            <div class="col-md-6 mb-3">
                                <small class="text-muted">Timezone:</small>
                                <div class="mt-1"><span class="badge bg-info">Asia/Phnom_Penh (UTC+7)</span></div>
                            </div>
                            <div class="col-md-6 mb-3">
                                <small class="text-muted">ភាសាលំនាំដើម:</small>
                                <div class="mt-1"><span class="badge bg-info">ភាសាខ្មែរ</span></div>
                            </div>
                            <div class="col-md-6 mb-3">
                                <small class="text-muted">Maintenance Mode:</small>
                                <div class="mt-1"><span class="badge bg-danger">បិទ</span></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="card mb-3" style="animation: fadeInUp 0.3s ease-out 0.1s both;">
                    <div class="card-body">
                        <h6 class="mb-3"><i class="fas fa-envelope me-2 text-primary"></i>Email Configuration</h6>
                        <div class="row">
                            <div class="col-md-6 mb-2">
                                <small class="text-muted">SMTP Server:</small>
                                <div class="mt-1"><span class="badge bg-secondary">smtp.gmail.com</span></div>
                            </div>
                            <div class="col-md-3 mb-2">
                                <small class="text-muted">Port:</small>
                                <div class="mt-1"><span class="badge bg-secondary">587</span></div>
                            </div>
                            <div class="col-md-3 mb-2">
                                <small class="text-muted">Encryption:</small>
                                <div class="mt-1"><span class="badge bg-success">TLS</span></div>
                            </div>
                        </div>
                    </div>
                </div>
            `;

    window.pendingSystemChanges = true;
    const modal = new bootstrap.Modal(document.getElementById('changesModal'));
    modal.show();
}

// Backup Settings Changes
window.createBackup = function () {
    const changesList = document.getElementById('changesList');
    changesList.innerHTML = `
                <div class="card mb-3" style="animation: fadeInUp 0.3s ease-out;">
                    <div class="card-body text-center py-4">
                        <div class="mb-3">
                            <i class="fas fa-database fa-3x text-primary"></i>
                        </div>
                        <h5 class="mb-3">បង្កើតការបម្រុងទុកទិន្នន័យ</h5>
                        <p class="text-muted">តើអ្នកប្រាកដថាចង់បង្កើតការបម្រុងទុកថ្មីឥឡូវនេះ?</p>
                        
                        <div class="alert alert-info text-start mt-3">
                            <strong><i class="fas fa-info-circle me-2"></i>ព័ត៌មាន:</strong>
                            <ul class="mb-0 mt-2">
                                <li>ទំហំទិន្នន័យប្រហែល: <strong>~250 MB</strong></li>
                                <li>ពេលវេលាប្រហែល: <strong>2-5 នាទី</strong></li>
                                <li>ទីតាំងរក្សាទុក: <strong>/backups/auto/</strong></li>
                            </ul>
                        </div>

                        <div class="progress mt-3" style="height: 25px; display: none;" id="backupProgress">
                            <div class="progress-bar progress-bar-striped progress-bar-animated bg-primary" 
                                 role="progressbar" style="width: 0%;" id="backupProgressBar">0%</div>
                        </div>
                    </div>
                </div>
            `;

    window.pendingBackupCreation = true;
    const modal = new bootstrap.Modal(document.getElementById('changesModal'));
    modal.show();
};

// Update confirmSave to handle all types of changes
function confirmSave() {
    if (window.pendingBackupCreation) {
        // Show progress bar
        document.getElementById('backupProgress').style.display = 'block';
        const progressBar = document.getElementById('backupProgressBar');

        let progress = 0;
        const interval = setInterval(() => {
            progress += 20;
            progressBar.style.width = progress + '%';
            progressBar.textContent = progress + '%';

            if (progress >= 100) {
                clearInterval(interval);
                setTimeout(() => {
                    bootstrap.Modal.getInstance(document.getElementById('changesModal')).hide();
                    showToast('ការបម្រុងទុកត្រូវបានបង្កើតដោយជោគជ័យ!', 'success');
                    window.pendingBackupCreation = false;
                }, 500);
            }
        }, 500);
    } else if (window.pendingSystemChanges) {
        bootstrap.Modal.getInstance(document.getElementById('changesModal')).hide();
        showToast('ការកំណត់ប្រព័ន្ធត្រូវបានរក្សាទុកដោយជោគជ័យ!', 'success');
        window.pendingSystemChanges = false;
    } else if (window.pendingPasswordChange) {
        bootstrap.Modal.getInstance(document.getElementById('changesModal')).hide();
        showToast('ពាក្យសម្ងាត់ត្រូវបានផ្លាស់ប្តូរដោយជោគជ័យ!', 'success');
        document.getElementById('passwordForm').reset();
        document.getElementById('strengthBar').className = 'password-strength';
        document.getElementById('strengthText').textContent = '';
        window.pendingPasswordChange = false;
    } else if (window.pendingChanges) {
        // Update original values
        originalValues = { ...window.pendingChanges };

        // Update display name in header
        const fullName = `${window.pendingChanges.firstName} ${window.pendingChanges.lastName}`;
        document.getElementById('userName').textContent = fullName;

        // Close modal
        bootstrap.Modal.getInstance(document.getElementById('changesModal')).hide();

        // Show success message
        showToast('ព័ត៌មានត្រូវបានរក្សាទុកដោយជោគជ័យ!', 'success');

        // Clear pending changes
        window.pendingChanges = null;
    }
}

// Enhanced Clear Cache with confirmation
function clearCache() {
    const changesList = document.getElementById('changesList');
    changesList.innerHTML = `
                <div class="card mb-3" style="animation: fadeInUp 0.3s ease-out;">
                    <div class="card-body text-center py-4">
                        <div class="mb-3">
                            <i class="fas fa-broom fa-3x text-warning"></i>
                        </div>
                        <h5 class="mb-3">លុប System Cache</h5>
                        <p class="text-muted">តើអ្នកប្រាកដថាចង់លុប Cache ប្រព័ន្ធទេ?</p>
                        
                        <div class="alert alert-warning text-start mt-3">
                            <strong><i class="fas fa-exclamation-triangle me-2"></i>ចំណាំ:</strong>
                            <ul class="mb-0 mt-2">
                                <li>Cache files នឹងត្រូវលុបទាំងអស់</li>
                                <li>ប្រព័ន្ធអាចដំណើរការយឺតជាបណ្តោះអាសន្ន</li>
                                <li>Cache ថ្មីនឹងត្រូវបង្កើតឡើងវិញដោយស្វ័យប្រវត្តិ</li>
                            </ul>
                        </div>

                        <div class="mt-3" style="display: none;" id="cacheClearing">
                            <div class="spinner-border text-primary" role="status">
                                <span class="visually-hidden">កំពុងដំណើរការ...</span>
                            </div>
                            <p class="mt-2 text-muted">កំពុងលុប Cache...</p>
                        </div>
                    </div>
                </div>
            `;

    window.pendingCacheClear = true;
    const modal = new bootstrap.Modal(document.getElementById('changesModal'));
    modal.show();
}

// Update confirmSave one more time for cache clearing
const originalConfirmSave = confirmSave;
confirmSave = function () {
    if (window.pendingCacheClear) {
        document.getElementById('cacheClearing').style.display = 'block';

        setTimeout(() => {
            bootstrap.Modal.getInstance(document.getElementById('changesModal')).hide();
            showToast('Cache ត្រូវបានលុបដោយជោគជ័យ!', 'success');
            window.pendingCacheClear = false;
        }, 2000);
    } else {
        originalConfirmSave();
    }
};

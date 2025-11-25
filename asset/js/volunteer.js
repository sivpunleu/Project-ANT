
document.querySelectorAll('button').forEach(btn => {
    if (btn.textContent.includes('ចុះឈ្មោះ') || btn.textContent.includes('ចូលរួម')) {
        btn.setAttribute('data-bs-toggle', 'modal');
        btn.setAttribute('data-bs-target', '#registrationModal');
    }
});

// Smooth scroll to sections
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// Animate elements on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-on-scroll');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.card, .timeline-item').forEach(el => {
    observer.observe(el);
});

// Counter animation for statistics
function animateCounter(element, target) {
    let current = 0;
    const increment = target / 100;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            const displayText = target >= 1000 ? (target / 1000).toFixed(0) + ',000+' : target + '+';
            element.textContent = displayText;
            clearInterval(timer);
        } else {
            const displayValue = current >= 1000 ? (current / 1000).toFixed(1) + 'K' : Math.floor(current);
            element.textContent = displayValue + (current < target ? '' : '+');
        }
    }, 20);
}

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statElement = entry.target.querySelector('.counter-number');
            if (statElement && !statElement.classList.contains('counted')) {
                statElement.classList.add('counted');
                const targetValue = parseInt(statElement.textContent.replace(/\D/g, ''));
                animateCounter(statElement, targetValue);
            }
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-item').forEach(el => {
    statsObserver.observe(el);
});

// Form validation
const registrationForm = document.querySelector('#registrationModal form');
if (registrationForm) {
    registrationForm.addEventListener('submit', function (e) {
        e.preventDefault();
        if (this.checkValidity()) {
            // Show success message
            const modal = bootstrap.Modal.getInstance(document.getElementById('registrationModal'));
            modal.hide();

            // Show success toast
            showToast('success', 'ការចុះឈ្មោះបានជោគជ័យ!', 'យើងនឹងទាក់ទងអ្នកឆាប់ៗនេះ។');

            // Reset form
            this.reset();
        } else {
            this.classList.add('was-validated');
        }
    });
}

// Toast notification function
function showToast(type, title, message) {
    const toastContainer = document.createElement('div');
    toastContainer.style.cssText = 'position: fixed; top: 20px; right: 20px; z-index: 9999;';

    const bgColor = type === 'success' ? 'bg-success' : 'bg-danger';

    toastContainer.innerHTML = `
                <div class="toast show ${bgColor} text-white" role="alert">
                    <div class="toast-header ${bgColor} text-white">
                        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'} me-2"></i>
                        <strong class="me-auto">${title}</strong>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast"></button>
                    </div>
                    <div class="toast-body">
                        ${message}
                    </div>
                </div>
            `;

    document.body.appendChild(toastContainer);

    setTimeout(() => {
        toastContainer.remove();
    }, 5000);
}

// Project detail modal (dynamic)
document.querySelectorAll('.btn-outline-primary, .btn-outline-success, .btn-outline-warning, .btn-outline-info').forEach(btn => {
    if (btn.textContent.includes('មើលលម្អិត') || btn.textContent.includes('ចុះឈ្មោះ')) {
        btn.addEventListener('click', function () {
            const projectCard = this.closest('.card');
            const projectTitle = projectCard.querySelector('h5').textContent.trim();
            const projectDesc = projectCard.querySelector('p').textContent.trim();

            const modalHtml = `
                        <div class="modal fade" id="projectModal" tabindex="-1">
                            <div class="modal-dialog modal-lg">
                                <div class="modal-content">
                                    <div class="modal-header">
                                        <h5 class="modal-title">${projectTitle}</h5>
                                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                                    </div>
                                    <div class="modal-body">
                                        <p>${projectDesc}</p>
                                        <h6 class="mt-4">លម្អិតគម្រោង:</h6>
                                        <ul>
                                            <li>រយៈពេល: 3 ខែ</li>
                                            <li>ទីតាំង: ភ្នំពេញ និងជុំវិញ</li>
                                            <li>ម៉ោងត្រូវការ: 4-6 ម៉ោង/សប្តាហ៍</li>
                                            <li>តម្រូវការ: មានចិត្តស្ម័គ្រចិត្ត និងទំនួលខុសត្រូវ</li>
                                        </ul>
                                        <h6 class="mt-4">អត្ថប្រយោជន៍:</h6>
                                        <ul>
                                            <li>ទទួលបានវិញ្ញាបនប័ត្រ</li>
                                            <li>រៀនជំនាញថ្មី</li>
                                            <li>ពង្រីកបណ្តាញសង្គម</li>
                                            <li>បង្កើតផលប៉ះពាល់វិជ្ជមាន</li>
                                        </ul>
                                    </div>
                                    <div class="modal-footer">
                                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">បិទ</button>
                                        <button type="button" class="btn btn-primary" onclick="document.querySelector('[data-bs-target=\\'#registrationModal\\']').click(); bootstrap.Modal.getInstance(document.getElementById('projectModal')).hide();">ចុះឈ្មោះឥឡូវ</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;

            // Remove existing modal if any
            const existingModal = document.getElementById('projectModal');
            if (existingModal) {
                existingModal.remove();
            }

            // Add new modal
            document.body.insertAdjacentHTML('beforeend', modalHtml);
            const projectModal = new bootstrap.Modal(document.getElementById('projectModal'));
            projectModal.show();
        });
    }
});

// Active navbar link highlighting
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

        if (navLink && scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
            navLink.classList.add('active');
        }
    });
});


backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Theme Toggle Functionality
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

// Check for saved theme preference or default to 'light'
const currentTheme = localStorage.getItem('theme') || 'light';
html.setAttribute('data-theme', currentTheme);

// Update icon based on current theme
if (currentTheme === 'dark') {
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
}

themeToggle.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';

    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);

    // Update icon
    if (newTheme === 'dark') {
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    }
});

// Counter animation for impact section
document.querySelectorAll('.impact-item').forEach(el => {
    statsObserver.observe(el);
});

// Newsletter form submission
document.querySelector('section form').addEventListener('submit', function (e) {
    e.preventDefault();
    const email = this.querySelector('input[type="email"]').value;
    if (email) {
        showToast('success', 'ជោគជ័យ!', 'អរគុណសម្រាប់ការចុះឈ្មោះ។');
        this.reset();
    }
});

// Event registration buttons
document.querySelectorAll('.btn-outline-primary.btn-sm').forEach(btn => {
    if (btn.textContent.includes('ចុះឈ្មោះ')) {
        btn.addEventListener('click', function () {
            const card = this.closest('.card');
            const eventTitle = card.querySelector('h5').textContent;

            const confirmModal = confirm(`តើអ្នកចង់ចុះឈ្មោះសម្រាប់ "${eventTitle}" មែនទេ?`);
            if (confirmModal) {
                showToast('success', 'ចុះឈ្មោះបានជោគជ័យ!', `អ្នកបានចុះឈ្មោះសម្រាប់ ${eventTitle}`);
                this.textContent = 'បានចុះឈ្មោះ';
                this.classList.remove('btn-outline-primary');
                this.classList.add('btn-success');
                this.disabled = true;
            }
        });
    }
});

// Smooth animations for step circles
const stepObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'bounceIn 0.6s ease-out';
            stepObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.step-circle').forEach(el => {
    stepObserver.observe(el);
});

// Add bounceIn animation
const style = document.createElement('style');
style.textContent = `
            @keyframes bounceIn {
                0% {
                    opacity: 0;
                    transform: scale(0.3);
                }
                50% {
                    opacity: 1;
                    transform: scale(1.05);
                }
                70% {
                    transform: scale(0.9);
                }
                100% {
                    transform: scale(1);
                }
            }
        `;
document.head.appendChild(style);

// Gallery lightbox effect
document.querySelectorAll('.gallery-img').forEach(img => {
    img.style.cursor = 'pointer';
    img.addEventListener('click', function () {
        const lightboxHtml = `
                    <div class="modal fade" id="lightboxModal" tabindex="-1">
                        <div class="modal-dialog modal-xl modal-dialog-centered">
                            <div class="modal-content bg-transparent border-0">
                                <div class="modal-body p-0 text-center">
                                    <button type="button" class="btn-close btn-close-white position-absolute top-0 end-0 m-3" data-bs-dismiss="modal" style="z-index: 1;"></button>
                                    <img src="${this.src}" class="img-fluid rounded" alt="Gallery Image">
                                </div>
                            </div>
                        </div>
                    </div>
                `;

        const existingLightbox = document.getElementById('lightboxModal');
        if (existingLightbox) {
            existingLightbox.remove();
        }

        document.body.insertAdjacentHTML('beforeend', lightboxHtml);
        const lightboxModal = new bootstrap.Modal(document.getElementById('lightboxModal'));
        lightboxModal.show();
    });
});
class NavigationManager {
    constructor() {
        this.mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        this.navMenu = document.querySelector('.nav-menu');
        this.currentPage = window.location.pathname.split('/').pop() || 'index.html';
        
        this.init();
    }
    
    init() {
        this.setupMobileMenu();
        this.setActiveNav();
    }
    
    setupMobileMenu() {
        if (!this.mobileMenuBtn || !this.navMenu) return;
        
        this.mobileMenuBtn.addEventListener('click', () => this.toggleMobileMenu());
        
        document.addEventListener('click', (event) => {
            if (!this.navMenu.contains(event.target) && !this.mobileMenuBtn.contains(event.target)) {
                this.closeMobileMenu();
            }
        });
    }
    
    toggleMobileMenu() {
        this.navMenu.classList.toggle('active');
        this.mobileMenuBtn.innerHTML = this.navMenu.classList.contains('active') ? '✕' : '☰';
    }
    
    closeMobileMenu() {
        this.navMenu.classList.remove('active');
        this.mobileMenuBtn.innerHTML = '☰';
    }
    
    setActiveNav() {
        const navLinks = document.querySelectorAll('.nav-menu a');
        const currentPath = window.location.pathname;
        const currentPage = currentPath.split('/').pop();
        
        navLinks.forEach(link => {
            const linkHref = link.getAttribute('href');
            
            // Reset active class first
            link.classList.remove('active');
            
            // Check if this is the home page
            const isHomePage = currentPath === '/' || 
                            currentPath.endsWith('/index.html') || 
                            currentPath.endsWith('/');
            
            // Check if this is the home link
            const isHomeLink = linkHref === 'index.html' || linkHref === '/';
            
            if (isHomePage && isHomeLink) {
                link.classList.add('active');
            }
            // For other pages
            else if (linkHref === currentPage || (currentPage === '' && linkHref === 'index.html')) {
                link.classList.add('active');
            }
            
            // Handle dropdown parents
            if (link.classList.contains('active')) {
                const dropdown = link.closest('.dropdown');
                if (dropdown) {
                    const dropdownToggle = dropdown.querySelector('a');
                    dropdownToggle.classList.add('active');
                }
            }
        });
        
        // If no link is active, make home active by default
        const activeLinks = document.querySelectorAll('.nav-menu a.active');
        if (activeLinks.length === 0) {
            const homeLink = document.querySelector('.nav-menu a[href="index.html"]');
            if (homeLink) {
                homeLink.classList.add('active');
            }
        }
    }
}

class FormValidator {
    constructor(formId) {
        this.form = document.getElementById(formId);
        this.init();
    }
    
    init() {
        if (!this.form) return;
        
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }
    
    handleSubmit(e) {
        e.preventDefault();
        
        if (this.validateForm()) {
            this.submitForm();
        }
    }
    
    validateForm() {
        let isValid = true;
        const fields = [
            { id: 'name', validator: this.validateRequired },
            { id: 'email', validator: this.validateEmail },
            { id: 'message', validator: this.validateRequired }
        ];
        
        fields.forEach(({ id, validator }) => {
            const field = document.getElementById(id);
            if (field && !validator(field.value)) {
                this.showError(field, this.getErrorMessage(id));
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    validateRequired(value) {
        return value && value.trim().length > 0;
    }
    
    validateEmail(value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return value && emailRegex.test(value);
    }
    
    getErrorMessage(fieldId) {
        const messages = {
            name: 'Please enter your name',
            email: 'Please enter a valid email address',
            message: 'Please enter your message'
        };
        return messages[fieldId] || 'This field is required';
    }
    
    showError(field, message) {
        field.classList.add('is-invalid');
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message text-danger mt-1';
        errorDiv.textContent = message;
        field.parentNode.insertBefore(errorDiv, field.nextSibling);
    }
    
    submitForm() {
        const submitBtn = this.form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            alert('Thank you for your message! We will get back to you soon.');
            this.form.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 1500);
    }
}

class NewsManager {
    constructor() {
        this.newsFilter = document.querySelector('.news-filter');
        this.init();
    }
    
    init() {
        if (this.newsFilter) {
            this.newsFilter.addEventListener('change', () => this.filterNews());
        }
        
        // News loading would be handled by separate data file
        // loadNews() function removed - data should come from external source
    }
    
    filterNews() {
        const selectedCategory = this.newsFilter.value;
        const newsCards = document.querySelectorAll('.news-card');
        
        newsCards.forEach(card => {
            const cardCategory = card.dataset.category;
            card.style.display = (selectedCategory === 'all' || cardCategory === selectedCategory) 
                ? 'block' 
                : 'none';
        });
    }
}

class CollegeManager {
    constructor() {
        this.searchInput = document.getElementById('collegeSearch');
        this.collegeCards = document.querySelectorAll('.college-card');
        this.collegeToggles = document.querySelectorAll('.college-toggle');
        
        this.init();
    }
    
    init() {
        this.setupSearch();
        this.setupToggles();
    }
    
    setupSearch() {
        if (!this.searchInput) return;
        
        this.searchInput.addEventListener('input', () => this.filterColleges());
    }
    
    filterColleges() {
        const searchTerm = this.searchInput.value.toLowerCase();
        
        this.collegeCards.forEach(card => {
            const text = card.textContent.toLowerCase();
            card.style.display = text.includes(searchTerm) ? 'block' : 'none';
        });
    }
    
    setupToggles() {
        this.collegeToggles.forEach(toggle => {
            toggle.addEventListener('click', (e) => this.handleToggle(e));
        });
    }
    
    handleToggle(e) {
        const button = e.currentTarget;
        const collegeCard = button.closest('.college-card');
        const facultyInfo = collegeCard.querySelector('.faculty-info');
        
        if (facultyInfo) {
            // Toggle visibility
            const isHidden = facultyInfo.style.display === 'none';
            facultyInfo.style.display = isHidden ? 'block' : 'none';
            
            // Update button text and icon
            if (isHidden) {
                button.innerHTML = '<i class="fas fa-chevron-up"></i> Hide Faculty';
                button.classList.add('active');
            } else {
                button.innerHTML = '<i class="fas fa-chevron-down"></i> View Faculty';
                button.classList.remove('active');
            }
        }
    }
}

class MapManager {
    constructor(mapId = 'gguMap') {
        this.mapElement = document.getElementById(mapId);
        this.init();
    }
    
    init() {
        if (this.mapElement) {
            this.initializeMap();
        }
    }
    
    initializeMap() {
        // This is a placeholder for actual Google Maps integration
        this.mapElement.innerHTML = `
            <div style="width: 100%; height: 400px; background: #f0f0f0; 
                        display: flex; align-items: center; justify-content: center;
                        border-radius: 8px;">
                <div style="text-align: center;">
                    <i class="fas fa-map-marker-alt" style="font-size: 48px; color: #228B22; margin-bottom: 16px;"></i>
                    <h4 style="color: #1E3A8A;">Grand Gedeh University Location</h4>
                    <p>Zwedru, Grand Gedeh County, Liberia</p>
                    <p><small>(Actual Google Maps integration would go here)</small></p>
                </div>
            </div>
        `;
    }
}

class ScrollManager {
    constructor() {
        this.init();
    }
    
    init() {
        this.setupSmoothScroll();
        this.setupIntersectionObserver();
    }
    
    setupSmoothScroll() {
        // Deadline links
        const deadlineLinks = document.querySelectorAll('a[href="#deadlines"]');
        deadlineLinks.forEach(link => {
            link.addEventListener('click', (e) => this.handleDeadlineClick(e));
        });
        
        // Campus navigation links
        const campusNavLinks = document.querySelectorAll('.campus-nav-link');
        campusNavLinks.forEach(link => {
            link.addEventListener('click', (e) => this.handleCampusNavClick(e));
        });
    }
    
    handleDeadlineClick(e) {
        e.preventDefault();
        const deadlinesSection = document.getElementById('deadlines');
        if (deadlinesSection) {
            deadlinesSection.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
    
    handleCampusNavClick(e) {
        const href = e.currentTarget.getAttribute('href');
        if (href.startsWith('#')) {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        }
    }
    
    setupIntersectionObserver() {
        const observerOptions = { threshold: 0.5 };
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('step-active');
                }
            });
        }, observerOptions);
        
        const processSteps = document.querySelectorAll('.process-step');
        processSteps.forEach(step => observer.observe(step));
    }
}

class SliderManager {
    constructor() {
        this.announcementSlides = document.querySelectorAll(".announcement-slide");
        this.dots = document.querySelectorAll(".dot");
        this.currentAnnouncement = 0;
        
        this.init();
    }
    
    init() {
        this.setupAnnouncementSlider();
        this.setupAutoSliders();
    }
    
    setupAnnouncementSlider() {
        if (!this.announcementSlides.length) return;
        
        this.showAnnouncement(this.currentAnnouncement);
        
        setInterval(() => {
            this.currentAnnouncement = (this.currentAnnouncement + 1) % this.announcementSlides.length;
            this.showAnnouncement(this.currentAnnouncement);
        }, 5000);
        
        this.dots.forEach(dot => {
            dot.addEventListener('click', () => {
                this.currentAnnouncement = Number(dot.dataset.dot);
                this.showAnnouncement(this.currentAnnouncement);
            });
        });
    }
    
    showAnnouncement(index) {
        this.announcementSlides.forEach((img, i) => {
            img.classList.toggle("active", i === index);
        });
        
        this.dots.forEach((dot, i) => {
            dot.classList.toggle("active", i === index);
        });
    }
    
    setupAutoSliders() {
        this.setupAutoSlider('.circular-slide', 4000);
        this.setupAutoSlider('.exam-slide', 5000);
    }
    
    setupAutoSlider(selector, interval) {
        const slides = document.querySelectorAll(selector);
        if (!slides.length) return;
        
        let index = 0;
        
        slides.forEach((s, i) => {
            s.style.display = i === 0 ? "block" : "none";
        });
        
        setInterval(() => {
            slides[index].style.display = "none";
            index = (index + 1) % slides.length;
            slides[index].style.display = "block";
        }, interval);
    }
}

class DashboardManager {
    constructor() {
        this.init();
    }
    
    init() {
        // Dashboard functionality would be loaded from separate data source
        // loadStudentDashboard() function removed - data should come from external source
        
        // Sample assignments loading removed - should come from external API
    }
}

class AdmissionManager {
    constructor() {
        this.enquiryToggle = document.getElementById('enquiryToggle');
        this.enquiryForm = document.getElementById('enquiryForm');
        this.admissionForm = document.getElementById('admissionForm');
        this.refreshCaptcha = document.getElementById('refreshCaptcha');
        this.captchaDisplay = document.getElementById('captchaDisplay');
        this.captchaInput = document.getElementById('captchaInput');
        this.closeBtn = document.getElementById('closeForm');
        
        this.cityMapping = {
            'grand-gedeh': ['zwedru', 'toah', 'putu'],
            'montserrado': ['monrovia', 'paynesville', 'congo-town'],
            'nimba': ['ganta', 'sanniquellie', 'tapeta'],
            'bong': ['gbarnga', 'salala', 'suakoko'],
            'lofa': ['voinjama', 'foya', 'zorzor'],
            'other': ['other-city']
        };
        
        this.currentCaptcha = '';
        
        this.init();
    }
    
    init() {
        if (!this.admissionForm) return;
        
        this.currentCaptcha = this.generateCaptcha();
        this.setupForm();
        this.setupStateCityMapping();
    }
    
    setupForm() {
        this.enquiryToggle?.addEventListener('click', () => this.toggleForm());
        this.closeBtn?.addEventListener('click', (e) => this.closeForm(e));
        this.refreshCaptcha?.addEventListener('click', () => this.refreshCaptchaCode());
        this.admissionForm.addEventListener('submit', (e) => this.handleSubmit(e));
    }
    
    toggleForm() {
        this.enquiryForm.classList.toggle('active');
        if (this.enquiryToggle) {
            this.enquiryToggle.style.display = this.enquiryForm.classList.contains('active') 
                ? 'none' 
                : 'flex';
        }
    }
    
    closeForm(e) {
        e.preventDefault();
        this.enquiryForm.classList.remove('active');
        if (this.enquiryToggle) {
            this.enquiryToggle.style.display = 'flex';
        }
    }
    
    generateCaptcha() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let captcha = '';
        for (let i = 0; i < 6; i++) {
            captcha += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        
        if (this.captchaDisplay) {
            this.captchaDisplay.textContent = captcha;
        }
        
        return captcha;
    }
    
    refreshCaptchaCode() {
        this.currentCaptcha = this.generateCaptcha();
        if (this.captchaInput) {
            this.captchaInput.value = '';
        }
    }
    
    setupStateCityMapping() {
        const stateSelect = document.getElementById('state');
        if (!stateSelect) return;
        
        stateSelect.addEventListener('change', () => this.updateCityOptions());
    }
    
    updateCityOptions() {
        const stateSelect = document.getElementById('state');
        const citySelect = document.getElementById('city');
        if (!stateSelect || !citySelect) return;
        
        const selectedState = stateSelect.value;
        
        citySelect.innerHTML = '<option value="">Select City</option>';
        
        if (selectedState && this.cityMapping[selectedState]) {
            this.cityMapping[selectedState].forEach(city => {
                const option = document.createElement('option');
                option.value = city;
                option.textContent = city.charAt(0).toUpperCase() + city.slice(1);
                citySelect.appendChild(option);
            });
        }
    }
    
    handleSubmit(e) {
        e.preventDefault();
        
        if (!this.validateCaptcha()) {
            alert('Invalid captcha. Please try again.');
            this.currentCaptcha = this.generateCaptcha();
            if (this.captchaInput) {
                this.captchaInput.value = '';
            }
            return;
        }
        
        const formData = this.getFormData();
        this.submitAdmissionForm(formData);
    }
    
    validateCaptcha() {
        return this.captchaInput && this.captchaInput.value === this.currentCaptcha;
    }
    
    getFormData() {
        return {
            name: document.getElementById('name')?.value || '',
            email: document.getElementById('email')?.value || '',
            mobile: document.getElementById('mobile')?.value || '',
            state: document.getElementById('state')?.value || '',
            city: document.getElementById('city')?.value || '',
            program: document.getElementById('program')?.value || '',
            course: document.getElementById('course')?.value || ''
        };
    }
    
    submitAdmissionForm(formData) {
        // Simulate form submission
        console.log('Admission enquiry submitted:', formData);
        
        alert('Thank you for your enquiry! We will contact you shortly.');
        
        this.admissionForm.reset();
        this.currentCaptcha = this.generateCaptcha();
        this.enquiryForm.classList.remove('active');
        
        if (this.enquiryToggle) {
            this.enquiryToggle.style.display = 'flex';
        }
    }
}


class ImageFallbackManager {
    constructor() {
        this.init();
    }
    
    init() {
        this.setupImageFallbacks();
    }
    
    setupImageFallbacks() {
        const collegeIcons = document.querySelectorAll('.college-icon');
        
        collegeIcons.forEach(icon => {
            icon.addEventListener('error', (e) => this.handleImageError(e));
        });
    }
    
    handleImageError(e) {
        const icon = e.target;
        const placeholder = icon.parentElement?.querySelector('.icon-placeholder');
        if (placeholder) {
            placeholder.style.display = 'flex';
        }
    }
}

class CardSliderManager {
    constructor() {
        this.cardsContainer = document.getElementById('cardsContainer');
        this.sliderDots = document.getElementById('sliderDots');
        this.prevBtn = document.querySelector('.prev-btn');
        this.nextBtn = document.querySelector('.next-btn');
        this.currentCardIndex = 0;
        this.cardsData = [
            {
                icon: 'fas fa-graduation-cap',
                title: 'Academic Excellence',
                description: 'World-class faculty and innovative curriculum designed to meet global standards.',
                color: '#228B22'
            },
            {
                icon: 'fas fa-flask',
                title: 'Research Opportunities',
                description: 'State-of-the-art research facilities and partnerships with international institutions.',
                color: '#1E3A8A'
            },
            {
                icon: 'fas fa-hands-helping',
                title: 'Community Engagement',
                description: 'Active involvement in community development and social impact projects.',
                color: '#DC2626'
            },
            {
                icon: 'fas fa-globe-africa',
                title: 'Global Perspective',
                description: 'International exchange programs and diverse cultural environment.',
                color: '#7C3AED'
            },
            {
                icon: 'fas fa-chart-line',
                title: 'Career Success',
                description: '90% graduate employment rate with strong industry partnerships.',
                color: '#D97706'
            },
            {
                icon: 'fas fa-leaf',
                title: 'Sustainable Campus',
                description: 'Eco-friendly campus with green initiatives and sustainable practices.',
                color: '#059669'
            }
        ];
        
        this.init();
    }
    
    init() {
        this.createCards();
        this.createDots();
        this.setupEventListeners();
        this.showCard(this.currentCardIndex);
        this.startAutoSlide();
    }
    
    createCards() {
        this.cardsContainer.innerHTML = '';
        
        this.cardsData.forEach((card, index) => {
            const cardElement = document.createElement('div');
            cardElement.className = 'why-ggu-card';
            cardElement.dataset.index = index;
            cardElement.innerHTML = `
                <div class="why-ggu-card-icon" style="color: ${card.color}">
                    <i class="${card.icon}"></i>
                </div>
                <h3 class="why-ggu-card-title">${card.title}</h3>
                <p class="why-ggu-card-description">${card.description}</p>
            `;
            this.cardsContainer.appendChild(cardElement);
        });
    }
    
    createDots() {
        this.sliderDots.innerHTML = '';
        
        // Create dots for visible cards only (3 at a time)
        const visibleCount = Math.min(3, Math.ceil(this.cardsData.length / 3));
        for (let i = 0; i < visibleCount; i++) {
            const dot = document.createElement('button');
            dot.className = 'slider-dot';
            if (i === 0) dot.classList.add('active');
            dot.dataset.group = i;
            dot.addEventListener('click', () => {
                this.currentCardIndex = i * 3;
                this.showCard(this.currentCardIndex);
                this.resetAutoSlide();
            });
            this.sliderDots.appendChild(dot);
        }
    }
    
    setupEventListeners() {
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => {
                this.prevCard();
                this.resetAutoSlide();
            });
        }
        
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => {
                this.nextCard();
                this.resetAutoSlide();
            });
        }
    }
    
    showCard(index) {
        const cards = document.querySelectorAll('.why-ggu-card');
        const dots = document.querySelectorAll('.slider-dot');
        const container = this.cardsContainer;
        
        // Calculate the transform value to show the current group of 3 cards
        const cardWidth = cards[0]?.offsetWidth || 350;
        const gap = 20;
        const translateX = -(index * (cardWidth + gap));
        
        container.style.transform = `translateX(${translateX}px)`;
        
        // Update active dot
        const dotIndex = Math.floor(index / 3);
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === dotIndex);
        });
        
        this.currentCardIndex = index;
    }
    
    nextCard() {
        const nextIndex = this.currentCardIndex + 3;
        if (nextIndex >= this.cardsData.length) {
            this.currentCardIndex = 0;
        } else {
            this.currentCardIndex = nextIndex;
        }
        this.showCard(this.currentCardIndex);
    }
    
    prevCard() {
        const prevIndex = this.currentCardIndex - 3;
        if (prevIndex < 0) {
            // Go to the last group
            const lastGroupStart = Math.floor((this.cardsData.length - 1) / 3) * 3;
            this.currentCardIndex = lastGroupStart;
        } else {
            this.currentCardIndex = prevIndex;
        }
        this.showCard(this.currentCardIndex);
    }
    
    startAutoSlide() {
        this.autoSlideInterval = setInterval(() => {
            this.nextCard();
        }, 5000); // Change slide every 5 seconds
    }
    
    resetAutoSlide() {
        clearInterval(this.autoSlideInterval);
        this.startAutoSlide();
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Why GGU slider
    const whyGguSlider = document.getElementById('cardsContainer');
    if (whyGguSlider) {
        new CardSliderManager();
    }
});
// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('cardsContainer')) {
        new CardSliderManager();
    }
});
class AppInitializer {
    constructor() {
        this.managers = {};
        this.init();
    }
    
    init() {
        document.addEventListener('DOMContentLoaded', () => this.initializeApp());
    }
    
    initializeApp() {
        // Initialize all managers
        this.managers.navigation = new NavigationManager();
        this.managers.formValidator = new FormValidator('contactForm');
        this.managers.newsManager = new NewsManager();
        this.managers.collegeManager = new CollegeManager();
        this.managers.mapManager = new MapManager();
        this.managers.scrollManager = new ScrollManager();
        this.managers.sliderManager = new SliderManager();
        this.managers.dashboardManager = new DashboardManager();
        this.managers.admissionManager = new AdmissionManager();
        this.managers.imageFallbackManager = new ImageFallbackManager();
        
        // Add the new Card Slider Manager
        this.managers.cardSlider = new CardSliderManager();
        
        // Also add Gallery Slider functionality
        this.setupGallerySlider();
        this.setupStudentSlider();
        this.setupTestimonialSliders();
        
        this.setupLightbox();
        this.setupGlobalErrorHandling();
    }
    
    setupGallerySlider() {
        const gallerySlides = document.querySelectorAll('.gallery-slide');
        const galleryPrev = document.querySelector('.gallery-prev');
        const galleryNext = document.querySelector('.gallery-next');
        let currentGallerySlide = 0;
        
        if (gallerySlides.length === 0) return;
        
        function showGallerySlide(index) {
            gallerySlides.forEach((slide, i) => {
                slide.classList.remove('active');
                slide.style.transform = `translateX(${(i - index) * 100}%)`;
            });
            gallerySlides[index].classList.add('active');
            currentGallerySlide = index;
        }
        
        if (galleryPrev) {
            galleryPrev.addEventListener('click', () => {
                currentGallerySlide = (currentGallerySlide - 1 + gallerySlides.length) % gallerySlides.length;
                showGallerySlide(currentGallerySlide);
            });
        }
        
        if (galleryNext) {
            galleryNext.addEventListener('click', () => {
                currentGallerySlide = (currentGallerySlide + 1) % gallerySlides.length;
                showGallerySlide(currentGallerySlide);
            });
        }
        
        // Auto slide for gallery
        setInterval(() => {
            currentGallerySlide = (currentGallerySlide + 1) % gallerySlides.length;
            showGallerySlide(currentGallerySlide);
        }, 6000);
        
        showGallerySlide(0);
    }
    
    setupStudentSlider() {
        const studentSlides = document.querySelectorAll('.student-slide');
        let currentStudentSlide = 0;
        
        if (studentSlides.length === 0) return;
        
        function showStudentSlide(index) {
            studentSlides.forEach((slide, i) => {
                slide.classList.remove('active');
                slide.style.opacity = '0';
                slide.style.transform = 'translateX(20px)';
            });
            
            studentSlides[index].classList.add('active');
            setTimeout(() => {
                studentSlides[index].style.opacity = '1';
                studentSlides[index].style.transform = 'translateX(0)';
            }, 50);
            
            currentStudentSlide = index;
        }
        
        // Auto slide for student slider
        setInterval(() => {
            currentStudentSlide = (currentStudentSlide + 1) % studentSlides.length;
            showStudentSlide(currentStudentSlide);
        }, 7000);
        
        showStudentSlide(0);
    }
    
    setupTestimonialSliders() {
        // Student testimonials
        const studentDots = document.querySelectorAll('[data-slider="student"]');
        const studentSlides = document.querySelectorAll('.testimonial-slider:first-child .testimonial-slide');
        
        studentDots.forEach(dot => {
            dot.addEventListener('click', () => {
                const index = parseInt(dot.dataset.index);
                
                studentDots.forEach(d => d.classList.remove('active'));
                dot.classList.add('active');
                
                studentSlides.forEach(slide => slide.classList.remove('active'));
                studentSlides[index].classList.add('active');
            });
        });
        
        // Alumni testimonials
        const alumniDots = document.querySelectorAll('[data-slider="alumni"]');
        const alumniSlides = document.querySelectorAll('.testimonial-slider:last-child .testimonial-slide');
        
        alumniDots.forEach(dot => {
            dot.addEventListener('click', () => {
                const index = parseInt(dot.dataset.index);
                
                alumniDots.forEach(d => d.classList.remove('active'));
                dot.classList.add('active');
                
                alumniSlides.forEach(slide => slide.classList.remove('active'));
                alumniSlides[index].classList.add('active');
            });
        });
    }
    
    setupLightbox() {
        if (typeof lightbox !== 'undefined') {
            lightbox.option({
                'resizeDuration': 200,
                'wrapAround': true,
                'albumLabel': "Image %1 of %2",
                'fadeDuration': 300
            });
        }
    }
    
    setupGlobalErrorHandling() {
        window.addEventListener('error', (e) => {
            console.error('Global error:', e.error);
        });
    }
}

// Initialize the application
const app = new AppInitializer();

// Add this function to update header visibility based on auth status
function updateHeaderVisibility() {
    const currentUser = DashboardUtils.loadUserData();
    const authButtons = document.querySelector('.auth-buttons');
    const userMenu = document.querySelector('.user-menu');
    
    if (currentUser) {
        // User is logged in - show user menu, hide auth buttons
        if (authButtons) authButtons.style.display = 'none';
        if (userMenu) {
            userMenu.style.display = 'flex';
            // Update user name
            const userNameElement = userMenu.querySelector('.user-name');
            if (userNameElement) {
                userNameElement.textContent = currentUser.name.split(' ')[0];
            }
        }
    } else {
        // User is not logged in - show auth buttons, hide user menu
        if (authButtons) authButtons.style.display = 'flex';
        if (userMenu) userMenu.style.display = 'none';
    }
}

// Add this to your existing code - it will be called from layout-loader.js
function setupGlobalLogout() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        const freshBtn = logoutBtn.cloneNode(true);
        logoutBtn.replaceWith(freshBtn);
        
        freshBtn.addEventListener('click', (e) => {
            e.preventDefault();
            // Clear user data
            localStorage.removeItem('ggu_current_user');
            sessionStorage.removeItem('ggu_current_user');
            // Update header immediately
            updateHeaderVisibility();
            // Redirect to login
            window.location.replace('/login.html');
        });
    }
}

// Main initialization
document.addEventListener('DOMContentLoaded', function() {
    // Setup global logout first (works on all pages)
    setupGlobalLogout();
    
    // Update header visibility on initial load
    updateHeaderVisibility();
    
    // Initialize NavigationManager for active tabs
    if (typeof NavigationManager !== 'undefined') {
        window.navManager = new NavigationManager();
    }
    
    // Initialize common utilities
    if (typeof DashboardUtils !== 'undefined') {
        DashboardUtils.setupSidebarDropdowns();
    }
    
    // Initialize dashboard system for main dashboard pages
    if (document.querySelector('.dashboard-content')) {
        try {
            if (typeof DashboardSystem !== 'undefined') {
                window.dashboardSystem = new DashboardSystem();
            }
        } catch (error) {
            console.error('Failed to initialize dashboard system:', error);
        }
    }
    
    // Initialize page-specific modules based on current page
    const currentPage = window.location.pathname.split('/').pop();
    
    switch(currentPage) {
        case 'settings.html':
            if (typeof SettingsPage !== 'undefined') SettingsPage.setup();
            break;
        case 'schedule.html':
            if (typeof SchedulePage !== 'undefined') SchedulePage.setup();
            break;
        case 'registration.html':
            if (typeof RegistrationPage !== 'undefined') RegistrationPage.setup();
            break;
        case 'profile.html':
            if (typeof ProfilePage !== 'undefined') ProfilePage.setup();
            break;
        case 'messages.html':
            if (typeof MessagesPage !== 'undefined') MessagesPage.setup();
            break;
        case 'finance.html':
            if (typeof FinancePage !== 'undefined') FinancePage.setup();
            break;
        case 'grades.html':
            if (typeof GradesPage !== 'undefined') GradesPage.setup();
            break;
        case 'admin-grades.html':
        case 'admin-content.html':
        case 'admin-courses.html':
        case 'admin-students.html':
        case 'admin-support.html':
            if (typeof AdminPages !== 'undefined') AdminPages.setup();
            break;
        case 'admin-dashboard.html':
            if (typeof AdminDashboard !== 'undefined') AdminDashboard.setup();
            break;
        default:
            // For other pages, just load user data
            if (typeof DashboardUtils !== 'undefined') {
                DashboardUtils.loadUserData();
            }
    }
});

// Add event listener for partials being loaded
document.addEventListener('partialLoaded', function() {
    // Re-run header visibility check when partials are loaded
    setTimeout(updateHeaderVisibility, 100);
    // Re-run NavigationManager setup
    if (window.navManager && typeof window.navManager.setActiveNav === 'function') {
        window.navManager.setActiveNav();
    }
});
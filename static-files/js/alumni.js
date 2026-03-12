class AlumniSliderManager {
    constructor() {
        this.alumniCardsContainer = document.getElementById('alumniCardsContainer');
        this.alumniSliderDots = document.getElementById('alumniSliderDots');
        this.prevBtn = document.querySelector('.alumni-prev-btn');
        this.nextBtn = document.querySelector('.alumni-next-btn');
        this.currentAlumniIndex = 0;
        this.alumniData = [
            {
                image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
                name: 'Dr. Samuel Koffa',
                degree: 'Medicine, Class of 1992',
                position: 'Director, Ministry of Health',
                achievement: 'Led national COVID-19 response team',
                quote: '"GGU taught me that medicine is more than science—it\'s about serving humanity."'
            },
            {
                image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
                name: 'Sarah Williams',
                degree: 'Business Administration, Class of 2010',
                position: 'CEO, Tech Solutions Africa',
                achievement: 'Forbes 30 Under 30 Africa',
                quote: '"The entrepreneurship program gave me the courage to start my own company."'
            },
            {
                image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
                name: 'James Doe',
                degree: 'Computer Science, Class of 2018',
                position: 'Senior Engineer at Google',
                achievement: 'Developed AI system used by 1M+ users',
                quote: '"GGU\'s CS program rivals top universities worldwide."'
            },
            {
                image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
                name: 'Grace Mensah',
                degree: 'Public Health, Class of 2015',
                position: 'WHO Country Representative',
                achievement: 'Implemented national vaccination program',
                quote: '"My public health career started in GGU\'s community outreach programs."'
            },
            {
                image: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
                name: 'Michael Kollie',
                degree: 'Engineering, Class of 2016',
                position: 'Project Manager, World Bank',
                achievement: 'Led $50M infrastructure development project',
                quote: '"GGU engineers are known for innovative solutions to complex problems."'
            },
            {
                image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
                name: 'Angela Roberts',
                degree: 'Environmental Science, Class of 2013',
                position: 'Founder, Green Energy Solutions',
                achievement: 'Awarded UN Climate Action Award',
                quote: '"GGU\'s focus on sustainability shaped my environmental advocacy."'
            }
        ];
        
        this.init();
    }
    
    init() {
        this.createAlumniCards();
        this.createAlumniDots();
        this.setupEventListeners();
        this.showAlumniCard(this.currentAlumniIndex);
        this.startAutoSlide();
    }
    
    createAlumniCards() {
        this.alumniCardsContainer.innerHTML = '';
        
        this.alumniData.forEach((alumni, index) => {
            const cardElement = document.createElement('div');
            cardElement.className = 'alumni-card';
            cardElement.dataset.index = index;
            cardElement.innerHTML = `
                <img src="${alumni.image}" alt="${alumni.name}" class="alumni-card-img">
                <div class="alumni-card-content">
                    <h3 class="alumni-card-name">${alumni.name}</h3>
                    <p class="alumni-card-degree">${alumni.degree}</p>
                    <p class="alumni-card-position">${alumni.position}</p>
                    <p class="alumni-card-achievement">${alumni.achievement}</p>
                    <div class="alumni-card-quote">${alumni.quote}</div>
                </div>
            `;
            this.alumniCardsContainer.appendChild(cardElement);
        });
    }
    
    createAlumniDots() {
        this.alumniSliderDots.innerHTML = '';
        
        // Create dots for visible cards only (3 at a time)
        const visibleCount = Math.min(3, Math.ceil(this.alumniData.length / 3));
        for (let i = 0; i < visibleCount; i++) {
            const dot = document.createElement('button');
            dot.className = 'alumni-slider-dot';
            if (i === 0) dot.classList.add('active');
            dot.dataset.group = i;
            dot.addEventListener('click', () => {
                this.currentAlumniIndex = i * 3;
                this.showAlumniCard(this.currentAlumniIndex);
                this.resetAutoSlide();
            });
            this.alumniSliderDots.appendChild(dot);
        }
    }
    
    setupEventListeners() {
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => {
                this.prevAlumniCard();
                this.resetAutoSlide();
            });
        }
        
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => {
                this.nextAlumniCard();
                this.resetAutoSlide();
            });
        }
    }
    
    showAlumniCard(index) {
        const cards = document.querySelectorAll('.alumni-card');
        const dots = document.querySelectorAll('.alumni-slider-dot');
        const container = this.alumniCardsContainer;
        
        // Calculate the transform value to show the current group of 3 cards
        const cardWidth = cards[0]?.offsetWidth || 350;
        const gap = 30;
        const translateX = -(index * (cardWidth + gap));
        
        container.style.transform = `translateX(${translateX}px)`;
        
        // Update active dot
        const dotIndex = Math.floor(index / 3);
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === dotIndex);
        });
        
        this.currentAlumniIndex = index;
    }
    
    nextAlumniCard() {
        const nextIndex = this.currentAlumniIndex + 3;
        if (nextIndex >= this.alumniData.length) {
            this.currentAlumniIndex = 0;
        } else {
            this.currentAlumniIndex = nextIndex;
        }
        this.showAlumniCard(this.currentAlumniIndex);
    }
    
    prevAlumniCard() {
        const prevIndex = this.currentAlumniIndex - 3;
        if (prevIndex < 0) {
            // Go to the last group
            const lastGroupStart = Math.floor((this.alumniData.length - 1) / 3) * 3;
            this.currentAlumniIndex = lastGroupStart;
        } else {
            this.currentAlumniIndex = prevIndex;
        }
        this.showAlumniCard(this.currentAlumniIndex);
    }
    
    startAutoSlide() {
        this.autoSlideInterval = setInterval(() => {
            this.nextAlumniCard();
        }, 6000); // Change slide every 6 seconds
    }
    
    resetAutoSlide() {
        clearInterval(this.autoSlideInterval);
        this.startAutoSlide();
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Alumni slider
    const alumniSlider = document.getElementById('alumniCardsContainer');
    if (alumniSlider) {
        new AlumniSliderManager();
    }
    
    // Populate graduation years in registration form
    const graduationYearSelect = document.getElementById('graduationYear');
    if (graduationYearSelect) {
        const currentYear = new Date().getFullYear();
        for (let year = currentYear; year >= 1980; year--) {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = year;
            graduationYearSelect.appendChild(option);
        }
    }
    
    // Handle alumni registration form submission
    const alumniForm = document.getElementById('alumniRegistrationForm');
    if (alumniForm) {
        alumniForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Thank you for joining the GGU Alumni Network! We will contact you soon.');
            this.reset();
        });
    }
});
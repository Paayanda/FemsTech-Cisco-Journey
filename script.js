document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeSmoothScrolling();
    initializeScrollAnimations();
    initializeSkillBars();
    initializeContactForm();
    initializeScrollEffects();
});

function initializeNavigation() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (hamburger) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (hamburger) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    });

    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
        }
    });

    const sections = document.querySelectorAll('section[id]');
    
    window.addEventListener('scroll', function() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

function initializeSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"], button[onclick*="scrollToSection"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.hasAttribute('href')) {
                e.preventDefault();
                const targetId = this.getAttribute('href').substring(1);
                const targetSection = document.getElementById(targetId);
                
                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 70;
                    
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

function scrollToSection(selector) {
    const targetId = selector.substring(1);
    const targetSection = document.getElementById(targetId);
    
    if (targetSection) {
        const offsetTop = targetSection.offsetTop - 70;
        
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible', 'animated');
                
                if (entry.target.id === 'skills') {
                    animateSkillBars();
                }
            
                if (entry.target.classList.contains('course-card')) {
                    const index = Array.from(entry.target.parentNode.children).indexOf(entry.target);
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 100);
                }
                
                if (entry.target.classList.contains('certificate-card')) {
                    const index = Array.from(entry.target.parentNode.children).indexOf(entry.target);
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 100);
                }
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll(`
        .section-header,
        .organization-card,
        .stat-item,
        .course-card,
        .specialization-card,
        .experience-card,
        .skills-card,
        .certificate-card,
        .testimonial,
        .partnership-info
    `);
    
    animatedElements.forEach(element => {
        element.classList.add('animate-on-scroll');
        observer.observe(element);
    });
}

function initializeSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    skillBars.forEach(bar => {
        const width = bar.getAttribute('data-width');
        if (width) {
            bar.style.setProperty('--target-width', width);
        }
    });
}

function animateSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    skillBars.forEach((bar, index) => {
        setTimeout(() => {
            const width = bar.getAttribute('data-width');
            if (width) {
                bar.style.width = width;
                bar.classList.add('animated');
            }
        }, index * 200);
    });
}

function initializeContactForm() {
    const form = document.getElementById('contactForm');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            const formData = new FormData(form);
            const name = formData.get('name');
            const email = formData.get('email');
            const subject = formData.get('subject');
            const message = formData.get('message');
            
            if (!name || !email || !subject || !message) {
                showNotification('Please fill in all fields.', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                showNotification('Please enter a valid email address.', 'error');
                return;
            }
            
            const submitButton = form.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;
            
            setTimeout(() => {
                showNotification('Thank you for your message! I\'ll get back to you soon.', 'success');
                form.reset();
                submitButton.textContent = originalText;
                submitButton.disabled = false;
            }, 2000);
        });
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showNotification(message, type) {

    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : '#ef4444'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        animation: slideIn 0.3s ease;
        max-width: 300px;
    `;
    
    document.body.appendChild(notification);
    
    const closeButton = notification.querySelector('.notification-close');
    closeButton.addEventListener('click', () => {
        notification.remove();
    });

    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

function initializeScrollEffects() {

    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset;
        let scrollTopButton = document.querySelector('.scroll-top');
        
        if (scrollTop > 300) {
            if (!scrollTopButton) {
                scrollTopButton = document.createElement('button');
                scrollTopButton.className = 'scroll-top';
                scrollTopButton.innerHTML = '<i class="fas fa-chevron-up"></i>';
                scrollTopButton.onclick = scrollToTopFunction;
                
                scrollTopButton.style.cssText = `
                    position: fixed;
                    bottom: 30px;
                    right: 30px;
                    width: 50px;
                    height: 50px;
                    background: var(--primary);
                    color: white;
                    border: none;
                    border-radius: 50%;
                    cursor: pointer;
                    box-shadow: 0 5px 15px rgba(59, 130, 246, 0.3);
                    transition: all 0.3s ease;
                    z-index: 1000;
                    font-size: 1.2rem;
                    opacity: 0;
                    transform: translateY(20px);
                `;
                
                document.body.appendChild(scrollTopButton);
            }
            scrollTopButton.style.opacity = '1';
            scrollTopButton.style.transform = 'translateY(0)';
        } else if (scrollTopButton) {
            scrollTopButton.style.opacity = '0';
            scrollTopButton.style.transform = 'translateY(20px)';
        }
    });
}

function scrollToTopFunction() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

function initializeCardEffects() {

    const courseCards = document.querySelectorAll('.course-card');
    courseCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    const certCards = document.querySelectorAll('.certificate-card');
    certCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

document.addEventListener('DOMContentLoaded', initializeCardEffects);

function throttle(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

const throttledScrollHandler = throttle(function() {
}, 16);

window.addEventListener('scroll', throttledScrollHandler);

const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateX(100%);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        opacity: 0.8;
        transition: opacity 0.3s ease;
    }
    
    .notification-close:hover {
        opacity: 1;
    }
    
    .scroll-top:hover {
        background: #2563eb !important;
        transform: translateY(-2px) !important;
        box-shadow: 0 8px 20px rgba(59, 130, 246, 0.4) !important;
    }
    
    /* Fade in animations */
    .animate-on-scroll {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.8s ease;
    }
    
    .animate-on-scroll.animated {
        opacity: 1;
        transform: translateY(0);
    }
    
    /* Skill bar animation */
    .skill-progress {
        transition: width 2s ease-in-out;
    }
    
    /* Course and certificate card initial states for animation */
    .course-card {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.6s ease;
    }
    
    .certificate-card {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.6s ease;
    }
    
    /* Mobile hamburger animation */
    .hamburger.active .bar:nth-child(2) {
        opacity: 0;
    }
    
    .hamburger.active .bar:nth-child(1) {
        transform: translateY(8px) rotate(45deg);
    }
    
    .hamburger.active .bar:nth-child(3) {
        transform: translateY(-8px) rotate(-45deg);
    }
    
    /* Smooth hover transitions */
    .organization-card,
    .specialization-card,
    .experience-card,
    .skills-card {
        transition: all 0.3s ease;
    }
    
    .tool-item:hover {
        transform: scale(1.05);
    }
    
    /* Loading states */
    .btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
    
    /* Focus states for accessibility */
    .btn:focus,
    .nav-link:focus,
    input:focus,
    textarea:focus {
        outline: 2px solid var(--primary);
        outline-offset: 2px;
    }
`;

document.head.appendChild(style);

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        console.log('Portfolio loaded successfully');
    });
} else {
    console.log('Portfolio loaded successfully');
}
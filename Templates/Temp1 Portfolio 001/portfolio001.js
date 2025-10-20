// Portfolio Template JavaScript

document.addEventListener('DOMContentLoaded', function() {
    console.log('Thiha Kyaw Portfolio loaded');
    
    // Initialize Material Design Components
    initializeMDC();
    
    // Initialize Navigation
    initializeNavigation();
    
    // Initialize Smooth Scrolling
    initializeSmoothScrolling();
    
    // Initialize Scroll Animations
    initializeScrollAnimations();
    
    // Initialize Form Handling
    initializeFormHandling();
    
    // Initialize Interactive Effects
    initializeInteractiveEffects();

    // Apply runtime theme from URL variant code
    applyVariantFromURL_PO01();
});

// Initialize Material Design Components
function initializeMDC() {
    // Initialize all MDC buttons
    const buttons = document.querySelectorAll('.mdc-button');
    buttons.forEach(button => {
        if (window.mdc && window.mdc.ripple) {
            window.mdc.ripple.MDCRipple.attachTo(button);
        }
    });
    
    // Initialize all MDC text fields
    const textFields = document.querySelectorAll('.mdc-text-field');
    textFields.forEach(textField => {
        if (window.mdc && window.mdc.textField) {
            window.mdc.textField.MDCTextField.attachTo(textField);
        }
    });
    
    // Initialize all MDC FABs
    const fabs = document.querySelectorAll('.mdc-fab');
    fabs.forEach(fab => {
        if (window.mdc && window.mdc.ripple) {
            window.mdc.ripple.MDCRipple.attachTo(fab);
        }
    });
    
    // Initialize all MDC cards
    const cards = document.querySelectorAll('.mdc-card');
    cards.forEach(card => {
        if (window.mdc && window.mdc.ripple) {
            window.mdc.ripple.MDCRipple.attachTo(card);
        }
    });
}

// Initialize Creative Navigation
function initializeNavigation() {
    const navToggle = document.getElementById('navToggle');
    const navOverlay = document.getElementById('navOverlay');
    const navLinks = document.querySelectorAll('.nav-link');
    const body = document.body;
    
    // Toggle navigation
    navToggle.addEventListener('click', function() {
        const isActive = navToggle.classList.contains('active');
        
        if (isActive) {
            closeNavigation();
        } else {
            openNavigation();
        }
    });
    
    // Close navigation when clicking on links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                closeNavigation();
                setTimeout(() => {
                    targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }, 500);
            }
        });
    });
    
    // Close navigation when clicking outside
    navOverlay.addEventListener('click', function(e) {
        if (e.target === navOverlay) {
            closeNavigation();
        }
    });
    
    // Close navigation on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navToggle.classList.contains('active')) {
            closeNavigation();
        }
    });
    
    function openNavigation() {
        navToggle.classList.add('active');
        navOverlay.classList.add('active');
        body.style.overflow = 'hidden';
    }
    
    function closeNavigation() {
        navToggle.classList.remove('active');
        navOverlay.classList.remove('active');
        body.style.overflow = '';
    }
    
    // Update active navigation link based on scroll position
    window.addEventListener('scroll', updateActiveNavLink);
    
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove('active'));
                if (navLink) {
                    navLink.classList.add('active');
                }
            }
        });
    }
}

// Initialize Smooth Scrolling
function initializeSmoothScrolling() {
    // Scroll indicator click
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', function() {
            const aboutSection = document.getElementById('about');
            if (aboutSection) {
                aboutSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    }
    
    // Hero buttons smooth scroll
    const viewWorkBtn = document.querySelector('.primary-btn');
    const getInTouchBtn = document.querySelector('.secondary-btn');
    
    if (viewWorkBtn) {
        viewWorkBtn.addEventListener('click', function() {
            const portfolioSection = document.getElementById('portfolio');
            if (portfolioSection) {
                portfolioSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    }
    
    if (getInTouchBtn) {
        getInTouchBtn.addEventListener('click', function() {
            const contactSection = document.getElementById('contact');
            if (contactSection) {
                contactSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    }
}

// Initialize Scroll Animations
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Stagger animations for grid items
                if (entry.target.classList.contains('skills-grid') || 
                    entry.target.classList.contains('portfolio-grid') ||
                    entry.target.classList.contains('about-stats')) {
                    
                    const items = entry.target.children;
                    Array.from(items).forEach((item, index) => {
                        setTimeout(() => {
                            item.classList.add('animate-in');
                        }, index * 100);
                    });
                }
            }
        });
    }, observerOptions);
    
    // Observe sections and grid containers
    const animatedElements = document.querySelectorAll(`
        .about-content,
        .skills-grid,
        .portfolio-grid,
        .about-stats,
        .contact-content,
        .section-title
    `);
    
    animatedElements.forEach(element => {
        observer.observe(element);
    });
    
    // Add CSS for scroll animations
    const style = document.createElement('style');
    style.textContent = `
        .about-content,
        .skills-grid,
        .portfolio-grid,
        .about-stats,
        .contact-content,
        .section-title {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.6s ease-out;
        }
        
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
        
        .skill-card,
        .portfolio-item,
        .stat-item {
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.4s ease-out;
        }
        
        .skill-card.animate-in,
        .portfolio-item.animate-in,
        .stat-item.animate-in {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(style);
}

// Initialize Form Handling
function initializeFormHandling() {
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(contactForm);
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            
            // Basic validation
            if (!name || !email || !message) {
                showNotification('Please fill in all fields', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                showNotification('Please enter a valid email address', 'error');
                return;
            }
            
            // Simulate form submission
            const submitBtn = contactForm.querySelector('.submit-btn');
            const originalText = submitBtn.querySelector('.mdc-button__label').textContent;
            
            submitBtn.disabled = true;
            submitBtn.querySelector('.mdc-button__label').textContent = 'Sending...';
            
            setTimeout(() => {
                showNotification('Thank you! Your message has been sent successfully.', 'success');
                contactForm.reset();
                
                // Reset Material Design text fields
                const textFields = contactForm.querySelectorAll('.mdc-text-field');
                textFields.forEach(field => {
                    const mdcField = field.MDCTextField;
                    if (mdcField) {
                        mdcField.value = '';
                    }
                });
                
                submitBtn.disabled = false;
                submitBtn.querySelector('.mdc-button__label').textContent = originalText;
            }, 2000);
        });
    }
    
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        notification.textContent = message;
        
        // Add notification styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 16px 24px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            ${type === 'success' ? 'background-color: #4CAF50;' : 'background-color: #F44336;'}
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 5 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 5000);
    }
}

// Initialize Interactive Effects
function initializeInteractiveEffects() {
    // Parallax effect for hero section
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const heroSection = document.querySelector('.hero-section');
        const profileCard = document.querySelector('.profile-card');
        
        if (heroSection && profileCard) {
            const rate = scrolled * -0.5;
            profileCard.style.transform = `translateY(${rate}px)`;
        }
    });
    
    // Hover effects for portfolio items
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    portfolioItems.forEach(item => {
        const overlay = item.querySelector('.portfolio-overlay');
        const fab = item.querySelector('.portfolio-fab');
        
        item.addEventListener('mouseenter', function() {
            if (fab) {
                fab.style.transform = 'scale(1.1)';
            }
        });
        
        item.addEventListener('mouseleave', function() {
            if (fab) {
                fab.style.transform = 'scale(1)';
            }
        });
        
        if (fab) {
            fab.addEventListener('click', function() {
                // Simulate portfolio item view
                showPortfolioModal(item);
            });
        }
    });
    
    // Skill card tilt effect
    const skillCards = document.querySelectorAll('.skill-card');
    skillCards.forEach(card => {
        card.addEventListener('mousemove', function(e) {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
        });
        
        card.addEventListener('mouseleave', function() {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });
    
    // Typing effect for hero title
    const titleName = document.querySelector('.title-name');
    if (titleName) {
        const text = titleName.textContent;
        titleName.textContent = '';
        titleName.style.borderRight = '2px solid #2196F3';
        
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                titleName.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            } else {
                setTimeout(() => {
                    titleName.style.borderRight = 'none';
                }, 1000);
            }
        };
        
        setTimeout(typeWriter, 1000);
    }
    
    function showPortfolioModal(item) {
        const title = item.querySelector('.portfolio-title').textContent;
        const description = item.querySelector('.portfolio-description').textContent;
        
        const modal = document.createElement('div');
        modal.className = 'portfolio-modal';
        modal.innerHTML = `
            <div class="modal-overlay">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>${title}</h3>
                        <button class="modal-close">&times;</button>
                    </div>
                    <div class="modal-body">
                        <p>${description}</p>
                        <p>This is a detailed view of the ${title.toLowerCase()} project. In a real portfolio, this would contain more images, project details, technologies used, and links to live demos or repositories.</p>
                    </div>
                </div>
            </div>
        `;
        
        // Add modal styles
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        
        const style = document.createElement('style');
        style.textContent = `
            .modal-overlay {
                background: rgba(0, 0, 0, 0.8);
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 20px;
            }
            .modal-content {
                background: white;
                border-radius: 16px;
                max-width: 600px;
                width: 100%;
                max-height: 80vh;
                overflow-y: auto;
                animation: modalSlideIn 0.3s ease-out;
            }
            .modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 24px;
                border-bottom: 1px solid #e0e0e0;
            }
            .modal-header h3 {
                margin: 0;
                color: #212121;
            }
            .modal-close {
                background: none;
                border: none;
                font-size: 24px;
                cursor: pointer;
                color: #757575;
                padding: 0;
                width: 32px;
                height: 32px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                transition: background-color 0.2s ease;
            }
            .modal-close:hover {
                background-color: #f5f5f5;
            }
            .modal-body {
                padding: 24px;
                color: #757575;
                line-height: 1.6;
            }
            @keyframes modalSlideIn {
                from {
                    opacity: 0;
                    transform: translateY(-20px) scale(0.95);
                }
                to {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';
        
        // Close modal functionality
        const closeBtn = modal.querySelector('.modal-close');
        const overlay = modal.querySelector('.modal-overlay');
        
        closeBtn.addEventListener('click', closeModal);
        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) {
                closeModal();
            }
        });
        
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeModal();
            }
        });
        
        function closeModal() {
            document.body.style.overflow = '';
            modal.style.animation = 'modalSlideOut 0.3s ease-in forwards';
            setTimeout(() => {
                document.body.removeChild(modal);
                document.head.removeChild(style);
            }, 300);
        }
        
        // Add slide out animation
        const slideOutStyle = document.createElement('style');
        slideOutStyle.textContent = `
            @keyframes modalSlideOut {
                from {
                    opacity: 1;
                    transform: scale(1);
                }
                to {
                    opacity: 0;
                    transform: scale(0.95);
                }
            }
        `;
        document.head.appendChild(slideOutStyle);
    }
}

// Apply variant theme from URL for Portfolio 001
function applyVariantFromURL_PO01() {
    try {
        const params = new URLSearchParams(window.location.search);
        const variant = params.get('variant');
        if (!variant || !variant.startsWith('PO01')) return;
        const colorCode = (variant.match(/C[1-6]/) || [])[0];
        if (!colorCode) return;
        const palette = {
            C1: '#c8afd5',
            C2: '#f8c3d7',
            C3: '#ff9292',
            C4: '#b8daf7',
            C5: '#c7dab6',
            C6: '#f4e59a'
        };
        const base = palette[colorCode];
        if (!base) return;
        const root = document.documentElement;
        root.style.setProperty('--primary-color', base);
        root.style.setProperty('--primary-dark', adjustColor(base, -0.18));
        root.style.setProperty('--primary-light', adjustColor(base, 0.24));
        // Override white backgrounds/surfaces with the same color
        root.style.setProperty('--background-secondary', base);
        root.style.setProperty('--surface', base);
        const onPrimary = getContrastColor(base);
        // Some elements may use text-light; leave as-is
        // Apply immediate tweaks if needed (none for now)
        console.log(`[theme] Portfolio applied variant ${variant} -> ${base}`);
    } catch (e) {
        console.warn('[theme] Portfolio variant apply failed:', e);
    }
}

// Helper: adjust color by mixing with white/black
function adjustColor(hex, amount) {
    const c = hexToRgb(hex);
    const t = amount < 0 ? 0 : 255;
    const p = Math.abs(amount);
    const r = Math.round((t - c.r) * p + c.r);
    const g = Math.round((t - c.g) * p + c.g);
    const b = Math.round((t - c.b) * p + c.b);
    return rgbToHex(r, g, b);
}

function hexToRgb(hex) {
    const m = hex.replace('#','').match(/.{1,2}/g);
    if (!m) return { r:0, g:0, b:0 };
    return { r: parseInt(m[0],16), g: parseInt(m[1],16), b: parseInt(m[2],16) };
}

function rgbToHex(r,g,b) {
    const toHex = (n) => n.toString(16).padStart(2,'0');
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function getContrastColor(hex) {
    const { r, g, b } = hexToRgb(hex);
    const luminance = (0.299*r + 0.587*g + 0.114*b) / 255;
    return luminance > 0.6 ? '#111111' : '#ffffff';
}
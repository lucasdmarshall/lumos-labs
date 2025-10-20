// Material Design Components Initialization
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Material Design Components
    initializeMDC();
    
    // Initialize custom interactions
    initializeNavigation();
    initializeScrollEffects();
    initializeAnimations();
    initializeFormHandling();
    initializePortfolioInteractions();
    initializeSmoothScrolling();
    
    // Add loading animation removal
    document.body.classList.remove('loading');

    // Apply runtime theme from URL variant code
    applyVariantFromURL_IN01();
});

// Initialize Material Design Components
function initializeMDC() {
    // Initialize Top App Bar
    const topAppBar = document.querySelector('.mdc-top-app-bar');
    if (topAppBar) {
        mdc.topAppBar.MDCTopAppBar.attachTo(topAppBar);
    }
    
    // Initialize Drawer
    const drawer = document.querySelector('.mdc-drawer');
    if (drawer) {
        const drawerInstance = mdc.drawer.MDCDrawer.attachTo(drawer);
        
        // Handle menu button click
        const menuBtn = document.getElementById('navMenuBtn');
        if (menuBtn) {
            menuBtn.addEventListener('click', () => {
                drawerInstance.open = !drawerInstance.open;
            });
        }
        
        // Close drawer when clicking on navigation items
        const navItems = drawer.querySelectorAll('.mdc-list-item');
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                drawerInstance.open = false;
            });
        });
    }
    
    // Initialize Buttons
    const buttons = document.querySelectorAll('.mdc-button');
    buttons.forEach(button => {
        mdc.ripple.MDCRipple.attachTo(button);
    });
    
    // Initialize Icon Buttons
    const iconButtons = document.querySelectorAll('.mdc-icon-button');
    iconButtons.forEach(button => {
        mdc.ripple.MDCRipple.attachTo(button);
    });
    
    // Initialize Text Fields
    const textFields = document.querySelectorAll('.mdc-text-field');
    textFields.forEach(textField => {
        mdc.textField.MDCTextField.attachTo(textField);
    });
}

// Navigation and Scroll Effects
function initializeNavigation() {
    const header = document.querySelector('.mdc-top-app-bar');
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.mdc-list-item[href^="#"]');
    
    // Header scroll effect
    let lastScrollTop = 0;
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add/remove scrolled class for styling
        if (scrollTop > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Update active navigation item
        updateActiveNavItem(sections, navLinks);
        
        lastScrollTop = scrollTop;
    });
}

// Update active navigation item based on scroll position
function updateActiveNavItem(sections, navLinks) {
    const scrollPos = window.scrollY + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('mdc-list-item--activated');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('mdc-list-item--activated');
                }
            });
        }
    });
}

// Scroll-triggered animations
function initializeScrollEffects() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Stagger animations for grid items
                if (entry.target.classList.contains('stats-grid') || 
                    entry.target.classList.contains('portfolio-grid') || 
                    entry.target.classList.contains('services-grid')) {
                    staggerChildAnimations(entry.target);
                }
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll(`
        .about-content,
        .stats-grid,
        .portfolio-grid,
        .services-grid,
        .contact-content,
        .section-title
    `);
    
    animateElements.forEach(el => observer.observe(el));
}

// Stagger animations for child elements
function staggerChildAnimations(parent) {
    const children = parent.children;
    Array.from(children).forEach((child, index) => {
        setTimeout(() => {
            child.classList.add('animate-in');
        }, index * 100);
    });
}

// Initialize custom animations
function initializeAnimations() {
    // Add CSS classes for animations
    const style = document.createElement('style');
    style.textContent = `
        .animate-in {
            animation: slideInUp 0.6s ease-out forwards;
        }
        
        @keyframes slideInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .mdc-top-app-bar.scrolled {
            background: rgba(255, 255, 255, 0.98);
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        
        .portfolio-item {
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.6s ease-out;
        }
        
        .portfolio-item.animate-in {
            opacity: 1;
            transform: translateY(0);
        }
        
        .service-card {
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.6s ease-out;
        }
        
        .service-card.animate-in {
            opacity: 1;
            transform: translateY(0);
        }
        
        .stat-card {
            opacity: 0;
            transform: scale(0.9);
            transition: all 0.6s ease-out;
        }
        
        .stat-card.animate-in {
            opacity: 1;
            transform: scale(1);
        }
    `;
    document.head.appendChild(style);
}

// Form handling with validation and submission
function initializeFormHandling() {
    const contactForm = document.querySelector('.contact-form');
    const submitBtn = document.querySelector('.contact-submit');
    
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmission);
        
        // Real-time validation
        const inputs = contactForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', validateField);
            input.addEventListener('input', clearFieldError);
        });
    }
}

// Handle form submission
function handleFormSubmission(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitBtn = form.querySelector('.contact-submit');
    const formData = new FormData(form);
    
    // Validate all fields
    const isValid = validateForm(form);
    
    if (!isValid) {
        showNotification('Please fill in all required fields correctly.', 'error');
        return;
    }
    
    // Show loading state
    submitBtn.disabled = true;
    submitBtn.querySelector('.mdc-button__label').textContent = 'Sending...';
    
    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
        showNotification('Thank you for your message! I\'ll get back to you soon.', 'success');
        form.reset();
        
        // Reset button state
        submitBtn.disabled = false;
        submitBtn.querySelector('.mdc-button__label').textContent = 'Send Message';
        
        // Reset text field states
        const textFields = form.querySelectorAll('.mdc-text-field');
        textFields.forEach(field => {
            const textFieldInstance = field.MDCTextField;
            if (textFieldInstance) {
                textFieldInstance.value = '';
            }
        });
    }, 2000);
}

// Form validation
function validateForm(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!validateField({ target: field })) {
            isValid = false;
        }
    });
    
    return isValid;
}

// Validate individual field
function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    const fieldContainer = field.closest('.mdc-text-field');
    
    // Remove existing error states
    fieldContainer.classList.remove('mdc-text-field--invalid');
    
    // Validation rules
    if (field.hasAttribute('required') && !value) {
        showFieldError(fieldContainer, 'This field is required');
        return false;
    }
    
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            showFieldError(fieldContainer, 'Please enter a valid email address');
            return false;
        }
    }
    
    return true;
}

// Show field error
function showFieldError(fieldContainer, message) {
    fieldContainer.classList.add('mdc-text-field--invalid');
    
    // Create or update error message
    let errorElement = fieldContainer.querySelector('.field-error');
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.style.cssText = `
            color: var(--error);
            font-size: 0.75rem;
            margin-top: 4px;
            font-family: var(--font-family);
        `;
        fieldContainer.appendChild(errorElement);
    }
    errorElement.textContent = message;
}

// Clear field error
function clearFieldError(e) {
    const fieldContainer = e.target.closest('.mdc-text-field');
    fieldContainer.classList.remove('mdc-text-field--invalid');
    
    const errorElement = fieldContainer.querySelector('.field-error');
    if (errorElement) {
        errorElement.remove();
    }
}

// Portfolio interactions
function initializePortfolioInteractions() {
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    portfolioItems.forEach(item => {
        item.addEventListener('click', () => {
            // Add click animation
            item.style.transform = 'scale(0.95)';
            setTimeout(() => {
                item.style.transform = '';
            }, 150);
            
            // You can add modal or lightbox functionality here
            showNotification('Portfolio item clicked! (Add your custom action here)', 'info');
        });
    });
}

// Smooth scrolling for navigation links
function initializeSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const targetId = link.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.mdc-top-app-bar').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Hero CTA buttons
    const heroCTAPrimary = document.querySelector('.hero-cta-primary');
    const heroCTASecondary = document.querySelector('.hero-cta-secondary');
    
    if (heroCTAPrimary) {
        heroCTAPrimary.addEventListener('click', () => {
            document.getElementById('portfolio').scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        });
    }
    
    if (heroCTASecondary) {
        heroCTASecondary.addEventListener('click', () => {
            document.getElementById('contact').scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        });
    }
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: ${type === 'success' ? '#4caf50' : type === 'error' ? '#f44336' : '#2196f3'};
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        font-family: var(--font-family);
        font-weight: 500;
        max-width: 300px;
        transform: translateX(100%);
        transition: transform 0.3s ease-out;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 5000);
}

// Social media button interactions
document.addEventListener('DOMContentLoaded', function() {
    const socialButtons = document.querySelectorAll('.social-btn');
    
    socialButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Add click animation
            button.style.transform = 'scale(0.9)';
            setTimeout(() => {
                button.style.transform = '';
            }, 150);
            
            // Get the icon to determine platform
            const icon = button.querySelector('.material-icons').textContent;
            let platform = '';
            
            switch(icon) {
                case 'camera_alt':
                    platform = 'Instagram';
                    break;
                case 'video_library':
                    platform = 'TikTok';
                    break;
                case 'play_circle':
                    platform = 'YouTube';
                    break;
                case 'business':
                    platform = 'LinkedIn';
                    break;
                default:
                    platform = 'Social Media';
            }
            
            showNotification(`${platform} link clicked! (Add your social media URLs here)`, 'info');
        });
    });
});

// Service button interactions
document.addEventListener('DOMContentLoaded', function() {
    const serviceButtons = document.querySelectorAll('.service-btn');
    
    serviceButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            
            const serviceCard = button.closest('.service-card');
            const serviceName = serviceCard.querySelector('h3').textContent;
            
            // Add click animation
            button.style.transform = 'scale(0.95)';
            setTimeout(() => {
                button.style.transform = '';
            }, 150);
            
            showNotification(`Learn more about ${serviceName} - Contact me for details!`, 'info');
        });
    });
});

// Parallax effect for hero section
function initializeParallaxEffect() {
    const heroSection = document.querySelector('.hero-section');
    const heroBackground = document.querySelector('.hero-background');
    
    if (heroSection && heroBackground) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            
            heroBackground.style.transform = `translateY(${rate}px)`;
        });
    }
}

// Initialize parallax effect
document.addEventListener('DOMContentLoaded', initializeParallaxEffect);

// Typing animation for hero subtitle
function initializeTypingAnimation() {
    const subtitle = document.querySelector('.hero-subtitle');
    if (subtitle) {
        const text = subtitle.textContent;
        subtitle.textContent = '';
        
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                subtitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        };
        
        // Start typing animation after hero loads
        setTimeout(typeWriter, 1500);
    }
}

// Initialize typing animation
document.addEventListener('DOMContentLoaded', initializeTypingAnimation);

// Performance optimization: Lazy loading for images
function initializeLazyLoading() {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                observer.unobserve(img);
            }
        });
    });
    
    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading
document.addEventListener('DOMContentLoaded', initializeLazyLoading);

// Add loading states and error handling
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Hide any loading indicators
    const loadingElements = document.querySelectorAll('.loading');
    loadingElements.forEach(el => el.style.display = 'none');
});

// Error handling for failed resource loads
window.addEventListener('error', (e) => {
    console.warn('Resource failed to load:', e.target.src || e.target.href);
    
    // Handle image load failures
    if (e.target.tagName === 'IMG') {
        e.target.style.display = 'none';
    }
});

// Accessibility improvements
document.addEventListener('DOMContentLoaded', function() {
    // Add keyboard navigation support
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            // Close drawer if open
            const drawer = document.querySelector('.mdc-drawer');
            if (drawer && drawer.classList.contains('mdc-drawer--open')) {
                const drawerInstance = drawer.MDCDrawer;
                if (drawerInstance) {
                    drawerInstance.open = false;
                }
            }
        }
    });
    
    // Add focus management for drawer
    const drawer = document.querySelector('.mdc-drawer');
    if (drawer) {
        drawer.addEventListener('MDCDrawer:opened', () => {
            const firstFocusable = drawer.querySelector('.mdc-list-item');
            if (firstFocusable) {
                firstFocusable.focus();
            }
        });
    }
});


// Apply variant theme from URL for Influencer 001
function applyVariantFromURL_IN01() {
    try {
        const params = new URLSearchParams(window.location.search);
        const variant = params.get('variant');
        if (!variant || !variant.startsWith('IN01')) return;
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
        root.style.setProperty('--primary-variant', adjustColor(base, 20));
        root.style.setProperty('--mdc-theme-primary', base);
        // Set rgba variations for shadows and overlays
        const { r, g, b } = hexToRgb(base);
        root.style.setProperty('--primary-rgba-80', `rgba(${r}, ${g}, ${b}, 0.8)`);
        root.style.setProperty('--primary-rgba-60', `rgba(${r}, ${g}, ${b}, 0.6)`);
        root.style.setProperty('--primary-rgba-50', `rgba(${r}, ${g}, ${b}, 0.5)`);
        root.style.setProperty('--primary-rgba-70', `rgba(${r}, ${g}, ${b}, 0.7)`);
        // Now all gradients, borders, and shadows will automatically use the new colors
        const avatarImg = document.querySelector('.hero-image');
        if (avatarImg) avatarImg.style.borderColor = base;
        // Update on-primary for text legibility
        const onPrimary = getContrastColor(base);
        root.style.setProperty('--on-primary', onPrimary);
        console.log(`[theme] Influencer applied variant ${variant} -> ${base}`);
    } catch (e) {
        console.warn('[theme] Influencer variant apply failed:', e);
    }
}

function getContrastColor(hex) {
    const { r, g, b } = hexToRgb(hex);
    const luminance = (0.299*r + 0.587*g + 0.114*b) / 255;
    return luminance > 0.6 ? '#111111' : '#ffffff';
}

function hexToRgb(hex) {
    const m = hex.replace('#','').match(/.{1,2}/g);
    if (!m) return { r:0, g:0, b:0 };
    return { r: parseInt(m[0],16), g: parseInt(m[1],16), b: parseInt(m[2],16) };
}

function adjustColor(hex, percent) {
    const { r, g, b } = hexToRgb(hex);
    const amt = Math.round(2.55 * percent);
    const R = Math.max(0, Math.min(255, r + amt));
    const G = Math.max(0, Math.min(255, g + amt));
    const B = Math.max(0, Math.min(255, b + amt));
    return `#${((1 << 24) + (R << 16) + (G << 8) + B).toString(16).slice(1)}`;
}
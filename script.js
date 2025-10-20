// Initialize Material Design Components
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Material Design Components
    initializeMDCComponents();
    
    // Initialize smooth scrolling
    initializeSmoothScrolling();
    
    // Initialize animations
    initializeAnimations();
    
    // Initialize form handling
    initializeFormHandling();
    
    // Initialize floating action button
    initializeFloatingActionButton();
    
    // Initialize navigation
    initializeNavigation();
    
    // Initialize intersection observer for animations
    initializeIntersectionObserver();
});

// Initialize Material Design Components
function initializeMDCComponents() {
    // Initialize Top App Bar
    const topAppBarElement = document.querySelector('.mdc-top-app-bar');
    if (topAppBarElement) {
        const topAppBar = new mdc.topAppBar.MDCTopAppBar(topAppBarElement);
    }

    // Initialize Drawer
    const drawerElement = document.querySelector('.mdc-drawer');
    if (drawerElement) {
        const drawer = new mdc.drawer.MDCDrawer(drawerElement);
        window.appDrawer = drawer;
        
        // Menu button functionality
        const menuButton = document.getElementById('menu-button');
        if (menuButton) {
            menuButton.addEventListener('click', () => {
                drawer.open = !drawer.open;
            });
        }
        
        // Enhance open/close UX
        drawer.listen('MDCDrawer:opened', () => {
            drawerElement.classList.add('open');
            document.body.classList.add('disable-scroll');
            if (menuButton) {
                menuButton.textContent = 'close';
                menuButton.setAttribute('aria-label', 'Close navigation menu');
            }
        });
        
        drawer.listen('MDCDrawer:closed', () => {
            drawerElement.classList.remove('open');
            document.body.classList.remove('disable-scroll');
            if (menuButton) {
                menuButton.textContent = 'menu';
                menuButton.setAttribute('aria-label', 'Open navigation menu');
            }
        });
        
        // Close drawer when clicking on nav items (app grid)
        const gridItems = drawerElement.querySelectorAll('.app-drawer-item');
        gridItems.forEach(item => {
            item.addEventListener('click', () => {
                drawer.open = false;
            });
            // subtle ripple
            addRippleEffect(item);
        });
        
        // Drawer actions
        const drawerQuote = document.getElementById('drawer-quote');
        if (drawerQuote) {
            drawerQuote.addEventListener('click', () => {
                drawer.open = false;
                const contactSection = document.getElementById('contact');
                if (contactSection) {
                    contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        }
        
        const drawerContact = document.getElementById('drawer-contact');
        if (drawerContact) {
            drawerContact.addEventListener('click', () => {
                drawer.open = false;
                const contactSection = document.getElementById('contact');
                if (contactSection) {
                    contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        }
        
        // Close drawer when clicking on previous list items (fallback)
        const drawerItems = drawerElement.querySelectorAll('.mdc-list-item');
        drawerItems.forEach(item => {
            item.addEventListener('click', () => {
                drawer.open = false;
            });
        });
    }

    // Initialize Buttons
    const buttons = document.querySelectorAll('.mdc-button');
    buttons.forEach(button => {
        new mdc.ripple.MDCRipple(button);
    });

    // Initialize Cards
    const cards = document.querySelectorAll('.mdc-card__primary-action');
    cards.forEach(card => {
        new mdc.ripple.MDCRipple(card);
    });

    // Initialize Text Fields
    const textFields = document.querySelectorAll('.mdc-text-field');
    textFields.forEach(textField => {
        new mdc.textField.MDCTextField(textField);
    });

    // Initialize FAB
    const fab = document.querySelector('.mdc-fab');
    if (fab) {
        new mdc.ripple.MDCRipple(fab);
    }

    // Initialize List
    const lists = document.querySelectorAll('.mdc-list');
    lists.forEach(list => {
        new mdc.list.MDCList(list);
    });
}

// Smooth Scrolling for Navigation Links
function initializeSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Initialize Animations
function initializeAnimations() {
    // Parallax effect for hero section
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const heroSection = document.querySelector('.hero-section');
        
        if (heroSection) {
            const rate = scrolled * -0.5;
            heroSection.style.transform = `translateY(${rate}px)`;
        }
    });

    // Floating cards animation
    const floatingCards = document.querySelectorAll('.demo-card');
    floatingCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.5}s`;
    });

    // Stagger animation for feature cards
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });
}

// Form Handling
function initializeFormHandling() {
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const formObject = {};
            
            // Convert FormData to object
            for (let [key, value] of formData.entries()) {
                formObject[key] = value;
            }
            
            // Show loading state
            const submitButton = this.querySelector('.contact-submit');
            const originalText = submitButton.querySelector('.mdc-button__label').textContent;
            submitButton.querySelector('.mdc-button__label').textContent = 'Sending...';
            submitButton.disabled = true;
            
            // Simulate form submission (replace with actual API call)
            setTimeout(() => {
                // Show success message
                showNotification('Thank you! Your message has been sent successfully. We\'ll get back to you soon!', 'success');
                
                // Reset form
                this.reset();
                
                // Reset button
                submitButton.querySelector('.mdc-button__label').textContent = originalText;
                submitButton.disabled = false;
                
                // Reset text field states
                const textFields = this.querySelectorAll('.mdc-text-field');
                textFields.forEach(textField => {
                    const mdcTextField = textField.MDCTextField;
                    if (mdcTextField) {
                        mdcTextField.value = '';
                    }
                });
            }, 2000);
        });
    }
}

// Floating Action Button
function initializeFloatingActionButton() {
    const floatingContact = document.getElementById('floating-contact');
    
    if (floatingContact) {
        floatingContact.addEventListener('click', () => {
            const contactSection = document.getElementById('contact');
            if (contactSection) {
                contactSection.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
        
        // Hide/show FAB based on scroll position
        let lastScrollTop = 0;
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (scrollTop > lastScrollTop && scrollTop > 100) {
                // Scrolling down
                floatingContact.style.transform = 'translateY(100px)';
            } else {
                // Scrolling up
                floatingContact.style.transform = 'translateY(0)';
            }
            
            lastScrollTop = scrollTop;
        });
    }
}

// Navigation Active State
function initializeNavigation() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link, .mdc-list-item');
    const header = document.querySelector('.mdc-top-app-bar');
    
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            const sectionHeight = section.clientHeight;
            
            if (sectionTop <= 100 && sectionTop + sectionHeight > 100) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('mdc-list-item--activated');
            const href = link.getAttribute('href');
            
            if (href === `#${current}`) {
                link.classList.add('mdc-list-item--activated');
            }
        });
        
        if (header) {
            if (window.scrollY > 4) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
    });
}

// Intersection Observer for Animations
function initializeIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll(
        '.feature-card, .service-card, .portfolio-card, .testimonial-card, .pricing-card'
    );
    
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

// Notification System
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="material-icons">${type === 'success' ? 'check_circle' : 'info'}</i>
            <span>${message}</span>
        </div>
        <button class="notification-close">
            <i class="material-icons">close</i>
        </button>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#4caf50' : '#2196f3'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        z-index: 10000;
        max-width: 400px;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        font-family: 'Poppins', sans-serif;
    `;
    
    // Style notification content
    const content = notification.querySelector('.notification-content');
    content.style.cssText = `
        display: flex;
        align-items: center;
        gap: 0.75rem;
        margin-bottom: 0;
    `;
    
    // Style close button
    const closeButton = notification.querySelector('.notification-close');
    closeButton.style.cssText = `
        position: absolute;
        top: 5px;
        right: 5px;
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        padding: 5px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Close functionality
    closeButton.addEventListener('click', () => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    });
    
    // Auto close after 5 seconds
    setTimeout(() => {
        if (document.body.contains(notification)) {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }
    }, 5000);
}

// CTA Button Handlers
function initializeCTAButtons() {
    // Hero CTA buttons
    const heroCTA = document.querySelector('.hero-cta');
    const heroSecondary = document.querySelector('.hero-secondary');
    
    if (heroCTA) {
        heroCTA.addEventListener('click', () => {
            const contactSection = document.getElementById('contact');
            if (contactSection) {
                contactSection.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    }
    
    if (heroSecondary) {
        heroSecondary.addEventListener('click', () => {
            window.location.href = 'templates.html';
        });
    }
    
    // Pricing CTA
    const pricingCTA = document.querySelector('.pricing-cta');
    if (pricingCTA) {
        pricingCTA.addEventListener('click', () => {
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

// Initialize CTA buttons when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeCTAButtons);

// Loading Animation
function showLoadingAnimation() {
    const loader = document.createElement('div');
    loader.id = 'page-loader';
    loader.innerHTML = `
        <div class="loader-content">
            <div class="loader-spinner"></div>
            <p>Loading your amazing website...</p>
        </div>
    `;
    
    loader.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        color: white;
        font-family: 'Poppins', sans-serif;
    `;
    
    const loaderContent = loader.querySelector('.loader-content');
    loaderContent.style.cssText = `
        text-align: center;
    `;
    
    const spinner = loader.querySelector('.loader-spinner');
    spinner.style.cssText = `
        width: 50px;
        height: 50px;
        border: 3px solid rgba(255,255,255,0.3);
        border-top: 3px solid white;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 0 auto 1rem;
    `;
    
    // Add spinner animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(loader);
    
    // Remove loader after page loads
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.style.opacity = '0';
            loader.style.transition = 'opacity 0.5s ease';
            setTimeout(() => {
                if (document.body.contains(loader)) {
                    document.body.removeChild(loader);
                }
            }, 500);
        }, 1000);
    });
}

// Initialize loading animation
showLoadingAnimation();

// Performance optimization: Lazy load images
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading
document.addEventListener('DOMContentLoaded', initializeLazyLoading);

// Scroll to top functionality
function initializeScrollToTop() {
    const scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.innerHTML = '<i class="material-icons">keyboard_arrow_up</i>';
    scrollToTopBtn.className = 'scroll-to-top';
    scrollToTopBtn.style.cssText = `
        position: fixed;
        bottom: 100px;
        right: 20px;
        width: 50px;
        height: 50px;
        background: #1976d2;
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 15px rgba(25, 118, 210, 0.3);
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 999;
    `;
    
    document.body.appendChild(scrollToTopBtn);
    
    // Show/hide based on scroll position
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.style.opacity = '1';
            scrollToTopBtn.style.visibility = 'visible';
        } else {
            scrollToTopBtn.style.opacity = '0';
            scrollToTopBtn.style.visibility = 'hidden';
        }
    });
    
    // Scroll to top functionality
    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Initialize scroll to top
document.addEventListener('DOMContentLoaded', initializeScrollToTop);

// Add ripple effect to custom elements
function addRippleEffect(element) {
    element.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
        `;
        
        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
}

// Add ripple animation styles
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);
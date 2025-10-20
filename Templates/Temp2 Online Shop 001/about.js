// About Page JavaScript

class AboutPageManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateCartBadge();
        this.initializeScrollAnimations();
    }

    setupEventListeners() {
        // Explore button
        const exploreBtn = document.getElementById('exploreBtn');
        if (exploreBtn) {
            exploreBtn.addEventListener('click', () => {
                navigateWithParams('os.html');
            });
        }

        // Cart button
        const cartBtn = document.getElementById('cartBtn');
        if (cartBtn) {
            cartBtn.addEventListener('click', () => {
                navigateWithParams('cart.html');
            });
        }
    }

    updateCartBadge() {
        const cartBadge = document.getElementById('cartBadge');
        if (cartBadge) {
            const savedCart = localStorage.getItem('mimoCart');
            const cartItems = savedCart ? JSON.parse(savedCart) : [];
            const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
            
            cartBadge.textContent = itemCount;
            cartBadge.style.display = itemCount > 0 ? 'flex' : 'none';
        }
    }

    initializeScrollAnimations() {
        // Intersection Observer for scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        // Observe elements for animation
        const animateElements = document.querySelectorAll('.value-card, .team-member, .contact-item');
        animateElements.forEach(el => observer.observe(el));

        // Parallax effect for hero image
        this.initializeParallax();
    }

    initializeParallax() {
        const heroImage = document.querySelector('.workshop-image');
        const storyImage = document.querySelector('.artisan-image');

        if (heroImage || storyImage) {
            window.addEventListener('scroll', () => {
                const scrolled = window.pageYOffset;
                const rate = scrolled * -0.5;

                if (heroImage) {
                    heroImage.style.transform = `translateY(${rate}px)`;
                }

                if (storyImage && scrolled > 200) {
                    const storyRate = (scrolled - 200) * -0.3;
                    storyImage.style.transform = `translateY(${storyRate}px)`;
                }
            });
        }
    }

    // Method to handle smooth scrolling to sections
    scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
}

// Initialize page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Material Design Components
    if (typeof mdc !== 'undefined') {
        // Initialize buttons
        document.querySelectorAll('.mdc-button').forEach(button => {
            mdc.ripple.MDCRipple.attachTo(button);
        });

        // Initialize icon buttons
        document.querySelectorAll('.mdc-icon-button').forEach(button => {
            mdc.ripple.MDCRipple.attachTo(button);
        });

        // Initialize cards
        document.querySelectorAll('.mdc-card').forEach(card => {
            mdc.ripple.MDCRipple.attachTo(card);
        });
    }

    // Initialize about page manager
    window.aboutPageManager = new AboutPageManager();

    // Initialize language manager if available
    if (typeof LanguageManager !== 'undefined') {
        window.languageManager = new LanguageManager();
    }

    // Initialize navigation if available
    if (typeof initializeNavigation === 'function') {
        initializeNavigation();
    }

    // Add scroll-based animations
    const addScrollAnimations = () => {
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

            .value-card,
            .team-member,
            .contact-item {
                opacity: 0;
                transform: translateY(30px);
                transition: opacity 0.6s ease-out, transform 0.6s ease-out;
            }

            .value-card.animate-in,
            .team-member.animate-in,
            .contact-item.animate-in {
                opacity: 1;
                transform: translateY(0);
            }
        `;
        document.head.appendChild(style);
    };

    addScrollAnimations();
    
    // Setup navigation links to preserve URL parameters
    setupNavigationLinks();
    
    // Apply color palette from URL
    applyVariantFromURL_OS01();
});

// Color palette functions
function applyVariantFromURL_OS01() {
    try {
        const params = new URLSearchParams(window.location.search);
        const variant = params.get('variant');
        if (!variant || !variant.startsWith('OS01')) return;
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
        root.style.setProperty('--primary-variant', adjustColor(base, -0.2));
        root.style.setProperty('--primary-light', adjustColor(base, 0.25));
        const onPrimary = getContrastColor(base);
        root.style.setProperty('--on-primary', onPrimary);
        console.log(`[theme] About page applied variant ${variant} -> ${base}`);
    } catch (e) {
        console.warn('[theme] About page variant apply failed:', e);
    }
}

function adjustColor(hex, amount) {
    const rgb = hexToRgb(hex);
    const adjusted = rgb.map(c => Math.max(0, Math.min(255, Math.round(c + (c * amount)))));
    return rgbToHex(adjusted[0], adjusted[1], adjusted[2]);
}

function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)] : null;
}

function rgbToHex(r,g,b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function getContrastColor(hex) {
    const rgb = hexToRgb(hex);
    const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
    return brightness > 128 ? '#000000' : '#ffffff';
}

// Helper function to preserve URL parameters when navigating
function navigateWithParams(url) {
    const currentParams = new URLSearchParams(window.location.search);
    const variant = currentParams.get('variant');
    if (variant) {
        const separator = url.includes('?') ? '&' : '?';
        url += `${separator}variant=${variant}`;
    }
    window.location.href = url;
}

// Setup navigation links to preserve URL parameters
function setupNavigationLinks() {
    const navLinks = document.querySelectorAll('a[href$=".html"]');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const href = link.getAttribute('href');
            navigateWithParams(href);
        });
    });
}
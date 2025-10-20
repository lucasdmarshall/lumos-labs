// Templates Page JavaScript Functionality

document.addEventListener('DOMContentLoaded', function() {
    // Initialize Material Design Components
    initializeMDC();
    
    // Initialize template filtering
    initializeTemplateFiltering();
    
    // Initialize template interactions
    initializeTemplateInteractions();
    
    // Initialize animations
    initializeAnimations();
    
    // Initialize mobile menu
    initializeMobileMenu();
    
    // Initialize scroll effects
    initializeScrollEffects();
    
    // Initialize search
    initializeSearch();
    
    // Ensure palette row exists in static cards
    ensurePaletteMarkup();
    // Attach palette interactions
    attachPaletteHandlers();
    // Hide loading overlay
    hideLoadingOverlay();
    // Deep debug: log computed styles for first palette row
    setTimeout(() => {
        const firstRow = document.querySelector('.template-card .template-price-row');
        if (firstRow) {
            const style = getComputedStyle(firstRow);
            console.log('[debug] firstRow computed:', {
                display: style.display,
                height: style.height,
                width: style.width,
                overflow: style.overflow,
                order: style.order,
                marginBottom: style.marginBottom
            });
            const firstPalette = firstRow.querySelector('.color-palette');
            if (firstPalette) {
                const pStyle = getComputedStyle(firstPalette);
                console.log('[debug] firstPalette computed:', {
                    display: pStyle.display,
                    height: pStyle.height,
                    width: pStyle.width,
                    minHeight: pStyle.minHeight,
                    minWidth: pStyle.minWidth
                });
            }
        }
    }, 300);
});

// Ensure palette circles appear above preview button on all cards
function ensurePaletteMarkup() {
    const actionContainers = document.querySelectorAll('.template-card .template-actions');
    console.log(`[palette] ensuring palettes in ${actionContainers.length} action containers`);

    const paletteHTML = `
        <div class="template-price-row">
            <div class="color-palette" aria-label="Template color palette">
                <span class="color-dot" data-code="C1" style="background:#c8afd5"></span>
                <span class="color-dot" data-code="C2" style="background:#f8c3d7"></span>
                <span class="color-dot" data-code="C3" style="background:#ff9292"></span>
                <span class="color-dot" data-code="C4" style="background:#b8daf7"></span>
                <span class="color-dot" data-code="C5" style="background:#c7dab6"></span>
                <span class="color-dot" data-code="C6" style="background:#f4e59a"></span>
            </div>
        </div>`;

    actionContainers.forEach((actions) => {
        const hasPalette = !!actions.querySelector('.color-palette');
        const previewBtn = actions.querySelector('.preview-btn');
        if (!hasPalette && previewBtn) {
            previewBtn.insertAdjacentHTML('beforebegin', paletteHTML);
        }
    });
}

// Attach palette interactions to update preview variant code
function attachPaletteHandlers() {
    const cards = document.querySelectorAll('.template-card');
    cards.forEach(card => {
        const codeBase = card.getAttribute('data-code-base') || inferCodeBase(card);
        const previewBtn = card.querySelector('.preview-btn');
        const dots = card.querySelectorAll('.color-dot');
        if (!previewBtn || !dots.length) return;

        // Restore last selection
        const saved = localStorage.getItem(`templateVariant_${codeBase}`);
        if (saved) markSelectedDot(card, saved.replace(codeBase, ''));

        dots.forEach(dot => {
            dot.addEventListener('click', () => {
                const colorCode = dot.getAttribute('data-code') || inferDotCode(dot);
                if (!colorCode) return;
                // Mark selection
                markSelectedDot(card, colorCode);
                const variant = `${codeBase}${colorCode}`;
                // Persist selection
                localStorage.setItem(`templateVariant_${codeBase}`, variant);
                // Update preview url
                const baseUrl = previewBtn.getAttribute('data-preview-url');
                const url = new URL(baseUrl, window.location.origin);
                url.searchParams.set('variant', variant);
                previewBtn.setAttribute('data-preview-url', `${url.pathname}${url.search}`);
            });
        });
    });
}

function inferCodeBase(card) {
    const title = card.querySelector('.template-title')?.textContent?.toLowerCase() || '';
    if (title.includes('influencer')) return 'IN01';
    if (title.includes('portfolio')) return 'PO01';
    if (title.includes('online shop')) return 'OS01';
    return 'TT00';
}

function inferDotCode(dot) {
    const idx = Array.from(dot.parentElement.children).indexOf(dot) + 1;
    return `C${idx}`;
}

function markSelectedDot(card, colorCode) {
    card.querySelectorAll('.color-dot').forEach(d => d.classList.remove('selected'));
    const target = card.querySelector(`.color-dot[data-code="${colorCode}"]`) || card.querySelectorAll('.color-dot')[parseInt(colorCode.replace('C',''), 10)-1];
    if (target) target.classList.add('selected');
}

// Initialize palette behavior is called within DOMContentLoaded after ensurePaletteMarkup

// Initialize Material Design Components
function initializeMDC() {
    // Initialize buttons
    const buttons = document.querySelectorAll('.mdc-button');
    buttons.forEach(button => {
        mdc.ripple.MDCRipple.attachTo(button);
    });
    
    // Initialize FABs
    const fabs = document.querySelectorAll('.mdc-fab');
    fabs.forEach(fab => {
        mdc.ripple.MDCRipple.attachTo(fab);
    });
    
    // Initialize cards
    const cards = document.querySelectorAll('.mdc-card');
    cards.forEach(card => {
        mdc.ripple.MDCRipple.attachTo(card);
    });
}

// Template Filtering System
function initializeTemplateFiltering() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const templateCards = document.querySelectorAll('.template-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter templates with animation
            filterTemplates(filter, templateCards);
            reapplySearchIfActive();
        });
    });
}

function filterTemplates(filter, templateCards) {
    templateCards.forEach((card, index) => {
        const category = card.getAttribute('data-category');
        const shouldShow = filter === 'all' || category === filter;
        
        // Add stagger delay for animation
        setTimeout(() => {
            if (shouldShow) {
                card.classList.remove('filter-hidden');
                card.classList.add('filter-visible');
                card.style.display = 'block';
            } else {
                card.classList.add('filter-hidden');
                card.classList.remove('filter-visible');
                setTimeout(() => {
                    if (card.classList.contains('filter-hidden')) {
                        card.style.display = 'none';
                    }
                }, 300);
            }
        }, index * 50);
    });
    
    // Update results count
    updateResultsCount(filter, templateCards);
}

function updateResultsCount(filter, templateCards) {
    const visibleCards = Array.from(templateCards).filter(card => {
        const category = card.getAttribute('data-category');
        return filter === 'all' || category === filter;
    });
    
    // You can add a results counter here if needed
    console.log(`Showing ${visibleCards.length} templates for filter: ${filter}`);
}

// Template Interactions
function initializeTemplateInteractions() {
    // Preview buttons
    const previewButtons = document.querySelectorAll('.preview-btn');
    previewButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const templateCard = this.closest('.template-card');
            const templateTitle = templateCard.querySelector('.template-title').textContent;
            const previewUrl = this.getAttribute('data-preview-url');
            if (previewUrl) {
                window.open(previewUrl, '_blank', 'noopener');
            } else {
                showTemplatePreview(templateTitle);
            }
        });
    });
    
    // Select template buttons
    const selectButtons = document.querySelectorAll('.select-template-btn');
    selectButtons.forEach(button => {
        button.addEventListener('click', function() {
            const templateCard = this.closest('.template-card');
            const templateTitle = templateCard.querySelector('.template-title').textContent;
            selectTemplate(templateTitle);
        });
    });
    
    // Load more button
    const loadMoreBtn = document.querySelector('.load-more-btn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', loadMoreTemplates);
    }
    
    // Template card hover effects
    initializeCardHoverEffects();
}

function showTemplatePreview(templateTitle) {
    // Create modal or redirect to preview
    showNotification(`Preview for "${templateTitle}" - Feature coming soon!`, 'info');
}

function selectTemplate(templateTitle) {
    // Add selection logic
    showNotification(`"${templateTitle}" selected! Redirecting to contact form...`, 'success');
    
    // Simulate redirect after delay
    setTimeout(() => {
        window.location.href = 'index.html#contact';
    }, 2000);
}

function loadMoreTemplates() {
    const templatesGrid = document.getElementById('templatesGrid');
    const loadMoreBtn = document.querySelector('.load-more-btn');
    
    // Show loading state
    loadMoreBtn.innerHTML = '<span class="mdc-button__label">Loading...</span>';
    loadMoreBtn.disabled = true;
    
    // Simulate loading delay
    setTimeout(() => {
        // Add more template cards (you can expand this with real data)
        const additionalTemplates = createAdditionalTemplates();
        additionalTemplates.forEach((template, index) => {
            setTimeout(() => {
                templatesGrid.appendChild(template);
                template.classList.add('stagger-animation');
                initializeCardInteractions(template);
            }, index * 100);
        });
        
        // Reset button
        loadMoreBtn.innerHTML = '<span class="mdc-button__label">Load More Templates</span>';
        loadMoreBtn.disabled = false;
        
        showNotification('More templates loaded!', 'success');
    }, 1500);
}

function createAdditionalTemplates() {
    // This would typically fetch from an API
    const templates = [
        {
            category: 'business',
            title: 'StartUp Pro',
            description: 'Modern startup website with investor-ready design and pitch sections.',
            features: ['Pitch Deck', 'Investor Portal', 'Team Showcase'],
            mockupClass: 'business-template-1'
        },
        {
            category: 'portfolio',
            title: 'Artist Showcase',
            description: 'Creative portfolio for artists with gallery and exhibition features.',
            features: ['Art Gallery', 'Exhibition Calendar', 'Artist Bio'],
            mockupClass: 'portfolio-template-1'
        }
    ];
    
    return templates.map(template => createTemplateCard(template));
}

function createTemplateCard(template) {
    const card = document.createElement('div');
    card.className = 'template-card mdc-card';
    card.setAttribute('data-category', template.category);
    
    card.innerHTML = `
        <div class="template-preview">
            <div class="template-mockup ${template.mockupClass}">
                <div class="mockup-header">
                    <div class="mockup-nav"></div>
                </div>
                <div class="mockup-hero"></div>
                <div class="mockup-content">
                    <div class="mockup-section"></div>
                    <div class="mockup-section"></div>
                </div>
            </div>
            <div class="template-overlay">
                <button class="mdc-fab mdc-fab--mini preview-btn">
                    <span class="material-icons mdc-fab__icon">visibility</span>
                </button>
            </div>
        </div>
        <div class="template-info">
            <h3 class="template-title">${template.title}</h3>
            <p class="template-description">${template.description}</p>
            <div class="template-features">
                ${template.features.map(feature => `<span class="feature-tag">${feature}</span>`).join('')}
            </div>
            <div class="template-actions">
                <div class="template-price-row">
                    <div class="color-palette" aria-label="Template color palette">
                        <span class="color-dot" style="background:#c8afd5"></span>
                        <span class="color-dot" style="background:#f8c3d7"></span>
                        <span class="color-dot" style="background:#ff9292"></span>
                        <span class="color-dot" style="background:#b8daf7"></span>
                        <span class="color-dot" style="background:#c7dab6"></span>
                        <span class="color-dot" style="background:#f4e59a"></span>
                    </div>
                </div>
                <button class="mdc-button mdc-button--raised select-template-btn">
                    <span class="mdc-button__label">Select Template</span>
                </button>
            </div>
        </div>
    `;
    
    return card;
}

function initializeCardInteractions(card) {
    // Initialize MDC components for new card
    const button = card.querySelector('.mdc-button');
    const fab = card.querySelector('.mdc-fab');
    
    if (button) mdc.ripple.MDCRipple.attachTo(button);
    if (fab) mdc.ripple.MDCRipple.attachTo(fab);
    if (card) mdc.ripple.MDCRipple.attachTo(card);
    
    // Add event listeners
    const previewBtn = card.querySelector('.preview-btn');
    const selectBtn = card.querySelector('.select-template-btn');
    
    if (previewBtn) {
        previewBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            const templateTitle = card.querySelector('.template-title').textContent;
            showTemplatePreview(templateTitle);
        });
    }
    
    if (selectBtn) {
        selectBtn.addEventListener('click', function() {
            const templateTitle = card.querySelector('.template-title').textContent;
            selectTemplate(templateTitle);
        });
    }
}

function initializeCardHoverEffects() {
    const templateCards = document.querySelectorAll('.template-card');
    
    templateCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

// Animations
function initializeAnimations() {
    // Intersection Observer for scroll animations
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
    
    // Observe template cards
    const templateCards = document.querySelectorAll('.template-card');
    templateCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        observer.observe(card);
    });
    
    // Observe other elements
    const animatedElements = document.querySelectorAll('.hero-content, .cta-content');
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

// Initialize Drawer
function initializeMobileMenu() {
    const drawerElement = document.querySelector('.mdc-drawer');
    if (drawerElement) {
        const drawer = new mdc.drawer.MDCDrawer(drawerElement);
        
        // Menu button functionality
        const menuButton = document.getElementById('menu-button');
        if (menuButton) {
            menuButton.addEventListener('click', () => {
                drawer.open = !drawer.open;
            });
        }
        
        // Close drawer when clicking on nav items (supports app grid)
        const drawerItems = drawerElement.querySelectorAll('.app-drawer-item, .mdc-list-item');
        drawerItems.forEach(item => {
            item.addEventListener('click', () => {
                drawer.open = false;
            });
            if (typeof addRippleEffect === 'function' && item.classList.contains('app-drawer-item')) {
                addRippleEffect(item);
            }
        });
    }
}

// Scroll Effects
function initializeScrollEffects() {
    // Floating Contact Button
    const floatingContactBtn = document.getElementById('floatingContactBtn');
    if (floatingContactBtn) {
        floatingContactBtn.addEventListener('click', function() {
            window.location.href = 'index.html#contact';
        });
    }
    
    // Scroll to Top Button
    const scrollToTopBtn = document.getElementById('scrollToTop');
    if (scrollToTopBtn) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                scrollToTopBtn.classList.add('visible');
            } else {
                scrollToTopBtn.classList.remove('visible');
            }
        });
        
        scrollToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // Parallax effect for hero section
    const hero = document.querySelector('.templates-hero');
    if (hero) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const parallax = scrolled * 0.5;
            hero.style.transform = `translateY(${parallax}px)`;
        });
    }
}

// Notification System
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="material-icons notification-icon">
                ${type === 'success' ? 'check_circle' : type === 'error' ? 'error' : 'info'}
            </span>
            <span class="notification-message">${message}</span>
            <button class="notification-close">
                <span class="material-icons">close</span>
            </button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        color: white;
        padding: 16px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 400px;
        font-family: 'Poppins', sans-serif;
    `;
    
    notification.querySelector('.notification-content').style.cssText = `
        display: flex;
        align-items: center;
        gap: 12px;
    `;
    
    notification.querySelector('.notification-close').style.cssText = `
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        padding: 0;
        margin-left: auto;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
    
    // Close button
    notification.querySelector('.notification-close').addEventListener('click', function() {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    });
}

// Loading Overlay
function hideLoadingOverlay() {
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) {
        setTimeout(() => {
            loadingOverlay.style.opacity = '0';
            setTimeout(() => {
                loadingOverlay.style.display = 'none';
            }, 300);
        }, 1000);
    }
}

// Search functionality (if needed in the future)
function initializeSearch() {
    const searchInput = document.getElementById('templateSearch');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            applySearch(this.value);
        });
    }
}

// Utility Functions
function debounce(func, wait) {
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

// Performance optimization
const debouncedScroll = debounce(function() {
    // Scroll-based animations can be added here
}, 16); // ~60fps

window.addEventListener('scroll', debouncedScroll);


function getActiveFilter() {
    const activeBtn = document.querySelector('.filter-btn.active');
    return activeBtn ? activeBtn.getAttribute('data-filter') : 'all';
}

function applySearch(term) {
    const searchTerm = (term || '').toLowerCase().trim();
    const templateCards = document.querySelectorAll('.template-card');
    const activeFilter = getActiveFilter();

    templateCards.forEach(card => {
        const category = card.getAttribute('data-category');
        const inCategory = activeFilter === 'all' || category === activeFilter;
        
        let matchesText = true;
        if (searchTerm !== '') {
            const title = card.querySelector('.template-title').textContent.toLowerCase();
            const description = card.querySelector('.template-description').textContent.toLowerCase();
            const features = Array.from(card.querySelectorAll('.feature-tag')).map(tag => tag.textContent.toLowerCase());
            
            matchesText = title.includes(searchTerm) || 
                          description.includes(searchTerm) || 
                          features.some(feature => feature.includes(searchTerm));
        }
        
        const shouldShow = inCategory && matchesText;
        if (shouldShow) {
            card.style.display = 'block';
            card.classList.add('filter-visible');
            card.classList.remove('filter-hidden');
        } else {
            card.classList.add('filter-hidden');
            card.classList.remove('filter-visible');
            setTimeout(() => {
                if (card.classList.contains('filter-hidden')) {
                    card.style.display = 'none';
                }
            }, 300);
        }
    });
}

function reapplySearchIfActive() {
    const input = document.getElementById('templateSearch');
    if (input && input.value.trim() !== '') {
        applySearch(input.value);
    }
}
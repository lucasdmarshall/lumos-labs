// Online Shop Template JavaScript

// Language Management
class LanguageManager {
    constructor() {
        this.currentLang = localStorage.getItem('language') || 'en';
        this.translations = {
            en: {
                title: "Mimo's Handicrafts - Handmade with Love",
                storeName: "Mimo's Handicrafts",
                menu: "Menu",
                products: "Products",
                cart: "Cart",
                aboutUs: "About Us",
                heroTitle: "Handmade with Love",
                heroSubtitle: "Discover unique handicrafts made with traditional techniques and modern design",
                shopByCategory: "Shop by Category",
                featuredProducts: "Featured Products",
                viewCart: "View Cart",
                addToCart: "Add to Cart",
                bags: "Bags",
                jewelry: "Jewelry",
                textiles: "Textiles",
                homeDecor: "Home Decor",
                bagsDesc: "Handwoven bags and purses",
                jewelryDesc: "Traditional and modern jewelry",
                textilesDesc: "Woven fabrics and scarves",
                homeDecorDesc: "Decorative items for your home"
            },
            mm: {
                title: "မီမို့လက်မှုပစ္စည်းများ - ချစ်ခြင်းမေတ္တာဖြင့်ပြုလုပ်ထားသော",
                storeName: "မီမို့လက်မှုပစ္စည်းများ",
                menu: "မီနူး",
                products: "ကုန်ပစ္စည်းများ",
                cart: "ခြင်းတောင်း",
                aboutUs: "ကျွန်ုပ်တို့အကြောင်း",
                heroTitle: "ချစ်ခြင်းမေတ္တာဖြင့်ပြုလုပ်ထားသော",
                heroSubtitle: "ရိုးရာနည်းပညာများနှင့် ခေတ်မီဒီဇိုင်းဖြင့် ပြုလုပ်ထားသော ထူးခြားသောလက်မှုပစ္စည်းများကို ရှာဖွေပါ",
                shopByCategory: "အမျိုးအစားအလိုက် ဝယ်ယူပါ",
                featuredProducts: "ထူးခြားသောကုန်ပစ္စည်းများ",
                viewCart: "စျေးဝယ်ခြင်းတောင်းကို ကြည့်ပါ။",
                addToCart: "စျေးဝယ်ခြင်းတောင်းထဲသို့ထည့်ပါ",
                bags: "အိတ်များ",
                jewelry: "ရတနာ",
                textiles: "အထည်အလိပ်",
                homeDecor: "အိမ်အလှဆင်",
                bagsDesc: "လက်ဖြင့်ရက်သောအိတ်များ",
                jewelryDesc: "ရိုးရာနှင့်ခေတ်မီလက်ဝတ်ရတနာများ",
                textilesDesc: "ရက်လုပ်အထည်နှင့်ပဝါများ",
                homeDecorDesc: "သင့်အိမ်အတွက်အလှဆင်ပစ္စည်းများ"
            }
        };
        this.init();
    }

    init() {
        this.updateLanguage();
        this.setupLanguageSwitcher();
    }

    updateLanguage() {
        const lang = this.currentLang;
        const translations = this.translations[lang];
        if (!translations) return;

        // Update document title
        document.title = translations.title;
        
        // Update store name elements
        const storeNameEls = document.querySelectorAll('.store-name');
        storeNameEls.forEach(el => el.textContent = translations.storeName);

        // Update elements with data attributes
        const elementsWithLang = document.querySelectorAll('[data-en][data-mm]');
        elementsWithLang.forEach(el => {
            const text = el.getAttribute(`data-${lang}`);
            if (text) {
                el.textContent = text;
            }
        });

        // Update specific elements by ID (fallback for elements without data attributes)
        const menuBtn = document.getElementById('menuBtn');
        if (menuBtn) menuBtn.setAttribute('aria-label', translations.menu);

        const featuredTitle = document.getElementById('featuredTitle');
        if (featuredTitle) featuredTitle.textContent = translations.featuredProducts;

        const shopByCategory = document.getElementById('shopByCategory');
        if (shopByCategory) shopByCategory.textContent = translations.shopByCategory;

        const categoryLabels = {
            'bags': 'bagsDesc',
            'jewelry': 'jewelryDesc',
            'textiles': 'textilesDesc',
            'homeDecor': 'homeDecorDesc'
        };

        for (const [id, key] of Object.entries(categoryLabels)) {
            const el = document.getElementById(`${id}Desc`);
            if (el && translations[key]) {
                el.textContent = translations[key];
            }
        }
        
        console.log(`Language switched to: ${lang}`);
    }

    switchLanguage() {
        this.currentLang = this.currentLang === 'en' ? 'mm' : 'en';
        localStorage.setItem('language', this.currentLang);
        this.updateLanguage();
    }

    setupLanguageSwitcher() {
        const langSwitchBtn = document.getElementById('langSwitcher');
        if (langSwitchBtn) {
            langSwitchBtn.addEventListener('click', () => this.switchLanguage());
        }
    }
}

// Cart Management
class CartManager {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('cart')) || [];
        this.init();
    }

    init() {
        this.setupCartButtons();
        this.updateCartBadge();
    }

    addToCart(product) {
        const existingItem = this.cart.find(item => item.id === product.id);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push({ ...product, quantity: 1 });
        }
        this.saveCart();
        this.updateCartBadge();
        this.showAddToCartNotification(product);
    }

    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCartBadge();
    }

    updateQuantity(productId, quantity) {
        const item = this.cart.find(item => item.id === productId);
        if (item) {
            item.quantity = quantity;
            this.saveCart();
            this.updateCartBadge();
        }
    }

    getCartTotal() {
        return this.cart.reduce((total, item) => total + item.price * item.quantity, 0);
    }

    getCartItemCount() {
        return this.cart.reduce((count, item) => count + item.quantity, 0);
    }

    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.cart));
    }

    updateCartBadge() {
        const badge = document.getElementById('cartBadge');
        if (badge) {
            badge.textContent = this.getCartItemCount();
        }
    }

    setupCartButtons() {
        const addToCartButtons = document.querySelectorAll('.add-to-cart');
        addToCartButtons.forEach(button => {
            button.addEventListener('click', () => {
                const product = {
                    id: button.dataset.id,
                    name: button.dataset.name,
                    price: parseFloat(button.dataset.price)
                };
                this.addToCart(product);
            });
        });
    }

    showAddToCartNotification(product) {
        const notification = document.createElement('div');
        notification.className = 'notification success';
        notification.textContent = `${product.name} added to cart!`;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('visible');
            setTimeout(() => {
                notification.classList.remove('visible');
                setTimeout(() => {
                    document.body.removeChild(notification);
                }, 300);
            }, 1500);
        }, 10);
    }
}

// Product Management
class ProductManager {
    constructor() {
        this.products = [
            { id: 'p1', name: 'Handwoven Bag', price: 29.99, category: 'bags' },
            { id: 'p2', name: 'Traditional Necklace', price: 19.99, category: 'jewelry' },
            { id: 'p3', name: 'Textile Scarf', price: 14.99, category: 'textiles' },
            { id: 'p4', name: 'Decorative Vase', price: 24.99, category: 'homeDecor' }
        ];
        this.init();
    }

    init() {
        this.loadProducts();
        this.setupCategoryFilters();
    }

    loadProducts(category = null) {
        const productGrid = document.getElementById('productGrid');
        if (!productGrid) return;

        productGrid.innerHTML = '';
        const filteredProducts = category ? this.products.filter(p => p.category === category) : this.products;
        filteredProducts.forEach(product => {
            const card = this.createProductCard(product);
            productGrid.appendChild(card);
        });
    }

    createProductCard(product) {
        const card = document.createElement('div');
        card.className = 'product-card mdc-card';
        card.innerHTML = `
            <div class="mdc-card__primary-action">
                <div class="product-image"></div>
                <div class="product-content">
                    <h3 class="product-title">${product.name}</h3>
                    <p class="product-price">$${product.price.toFixed(2)}</p>
                </div>
            </div>
            <div class="mdc-card__actions">
                <button class="mdc-button mdc-button--raised add-to-cart" 
                    data-id="${product.id}" 
                    data-name="${product.name}" 
                    data-price="${product.price}">
                    <span class="mdc-button__label">Add to Cart</span>
                </button>
            </div>
        `;
        return card;
    }

    setupCategoryFilters() {
        const buttons = document.querySelectorAll('.category-filter');
        buttons.forEach(button => {
            button.addEventListener('click', () => {
                const category = button.dataset.category;
                this.loadProducts(category);
            });
        });
    }
}

function initMDC() {
    // Initialize Top App Bar
    const topAppBar = mdc.topAppBar.MDCTopAppBar.attachTo(document.querySelector('.mdc-top-app-bar'));
    
    // Initialize Drawer
    const drawer = mdc.drawer.MDCDrawer.attachTo(document.querySelector('.mdc-drawer'));
    
    // Setup menu button
    const menuBtn = document.getElementById('menuBtn');
    if (menuBtn) {
        menuBtn.addEventListener('click', () => {
            drawer.open = !drawer.open;
        });
    }
    
    // Initialize FAB
    const fab = document.querySelector('.mdc-fab');
    if (fab) {
        mdc.ripple.MDCRipple.attachTo(fab);
    }
    
    // Initialize Cards
    const cards = document.querySelectorAll('.mdc-card .mdc-card__primary-action');
    cards.forEach(card => {
        mdc.ripple.MDCRipple.attachTo(card);
    });
    
    // Initialize Icon Buttons
    const iconButtons = document.querySelectorAll('.mdc-icon-button');
    iconButtons.forEach(button => {
        mdc.ripple.MDCRipple.attachTo(button);
    });
    
    // Initialize List Items
    const listItems = document.querySelectorAll('.mdc-list-item');
    listItems.forEach(item => {
        mdc.ripple.MDCRipple.attachTo(item);
    });
}

// Smooth Scrolling
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(link.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Intersection Observer for Animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.category-card, .product-card, .section-title');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });
}

// Theme: Apply variant from URL for Online Shop 001
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
        console.log(`[theme] Online Shop applied variant ${variant} -> ${base}`);
    } catch (e) {
        console.warn('[theme] Online Shop variant apply failed:', e);
    }
}

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

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Mimo\'s Handicrafts loaded');
    
    // Initialize global managers
    window.languageManager = new LanguageManager();
    window.cartManager = new CartManager();
    window.productManager = new ProductManager();
    
    // Initialize Material Design Components
    initMDC();

    // Apply runtime theme from URL variant code
    applyVariantFromURL_OS01();
    
    // Initialize other features
    initSmoothScrolling();
    initScrollAnimations();
    
    // Setup cart button
    const cartBtn = document.getElementById('cartBtn');
    if (cartBtn) {
        cartBtn.addEventListener('click', () => {
            navigateWithParams('cart.html');
        });
    }
    
    // Setup navigation links to preserve URL parameters
    setupNavigationLinks();
    
    // Update language on page load
    setTimeout(() => {
        window.languageManager.updateLanguage();
    }, 100);
});
// Cart Page JavaScript

class CartPageManager {
    constructor() {
        this.cartItems = [];
        this.messengerUrl = 'https://m.me/mimoshandicrafts'; // Placeholder URL
        this.init();
    }

    init() {
        this.loadCartItems();
        this.setupEventListeners();
        this.renderCart();
        this.updateSummary();
    }

    loadCartItems() {
        // Load cart items from localStorage
        const savedCart = localStorage.getItem('mimoCart');
        if (savedCart) {
            this.cartItems = JSON.parse(savedCart);
        }
    }

    saveCartItems() {
        localStorage.setItem('mimoCart', JSON.stringify(this.cartItems));
    }

    setupEventListeners() {
        // Proceed button
        const proceedBtn = document.getElementById('proceedBtn');
        if (proceedBtn) {
            proceedBtn.addEventListener('click', () => this.proceedToMessenger());
        }

        // Clear cart button
        const clearCartBtn = document.getElementById('clearCartBtn');
        if (clearCartBtn) {
            clearCartBtn.addEventListener('click', () => this.clearCart());
        }

        // Continue shopping button
        const continueShoppingBtn = document.getElementById('continueShoppingBtn');
        if (continueShoppingBtn) {
            continueShoppingBtn.addEventListener('click', () => {
                navigateWithParams('os.html');
            });
        }

        // Back button
        const backBtn = document.getElementById('backBtn');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                navigateWithParams('os.html');
            });
        }
    }

    renderCart() {
        const cartItemsContainer = document.getElementById('cartItems');
        const emptyCartContainer = document.getElementById('emptyCart');
        const cartSummary = document.getElementById('cartSummary');

        if (this.cartItems.length === 0) {
            cartItemsContainer.style.display = 'none';
            emptyCartContainer.style.display = 'block';
            cartSummary.style.display = 'none';
            return;
        }

        cartItemsContainer.style.display = 'block';
        emptyCartContainer.style.display = 'none';
        cartSummary.style.display = 'block';

        cartItemsContainer.innerHTML = this.cartItems.map(item => this.createCartItemHTML(item)).join('');

        // Add event listeners to quantity controls and remove buttons
        this.setupCartItemListeners();
    }

    createCartItemHTML(item) {
        const currentLang = document.documentElement.getAttribute('data-lang') || 'en';
        const name = currentLang === 'mm' ? (item.nameMM || item.name) : item.name;
        const category = currentLang === 'mm' ? (item.categoryMM || item.category) : item.category;

        return `
            <div class="cart-item" data-id="${item.id}">
                <img src="${item.image}" alt="${name}" class="cart-item-image">
                <div class="cart-item-details">
                    <h4 class="cart-item-name">${name}</h4>
                    <div class="cart-item-price">${item.price.toLocaleString()} MMK</div>
                    <div class="cart-item-category">${category}</div>
                </div>
                <div class="cart-item-actions">
                    <div class="quantity-controls">
                        <button class="quantity-btn decrease-btn" data-id="${item.id}" ${item.quantity <= 1 ? 'disabled' : ''}>
                            <span class="material-icons">remove</span>
                        </button>
                        <span class="quantity-display">${item.quantity}</span>
                        <button class="quantity-btn increase-btn" data-id="${item.id}">
                            <span class="material-icons">add</span>
                        </button>
                    </div>
                    <button class="remove-btn" data-id="${item.id}" title="Remove item">
                        <span class="material-icons">delete</span>
                    </button>
                </div>
            </div>
        `;
    }

    setupCartItemListeners() {
        // Quantity increase buttons
        document.querySelectorAll('.increase-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const itemId = parseInt(e.currentTarget.getAttribute('data-id'));
                this.updateQuantity(itemId, 1);
            });
        });

        // Quantity decrease buttons
        document.querySelectorAll('.decrease-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const itemId = parseInt(e.currentTarget.getAttribute('data-id'));
                this.updateQuantity(itemId, -1);
            });
        });

        // Remove buttons
        document.querySelectorAll('.remove-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const itemId = parseInt(e.currentTarget.getAttribute('data-id'));
                this.removeItem(itemId);
            });
        });
    }

    updateQuantity(itemId, change) {
        const item = this.cartItems.find(item => item.id === itemId);
        if (item) {
            item.quantity += change;
            if (item.quantity <= 0) {
                this.removeItem(itemId);
                return;
            }
            this.saveCartItems();
            this.renderCart();
            this.updateSummary();
            const currentLang = document.documentElement.getAttribute('data-lang') || 'en';
            this.showNotification(currentLang === 'mm' ? 'အရေအတွက် ပြင်ဆင်ပြီးပါပြီ' : 'Quantity updated', 'success');
        }
    }

    removeItem(itemId) {
        const itemElement = document.querySelector(`[data-id="${itemId}"]`);
        if (itemElement) {
            itemElement.classList.add('removing');
            setTimeout(() => {
                this.cartItems = this.cartItems.filter(item => item.id !== itemId);
                this.saveCartItems();
                this.renderCart();
                this.updateSummary();
                const currentLang = document.documentElement.getAttribute('data-lang') || 'en';
                this.showNotification(currentLang === 'mm' ? 'ပစ္စည်းကို ခြင်းတောင်းထဲမှ ဖယ်ရှားပြီးပါပြီ' : 'Item removed from cart', 'info');
            }, 300);
        }
    }

    updateSummary() {
        const itemCount = this.cartItems.reduce((total, item) => total + item.quantity, 0);
        const subtotal = this.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
        const total = subtotal; // No additional fees for now

        document.getElementById('itemCount').textContent = itemCount;
        document.getElementById('subtotal').textContent = `${subtotal.toLocaleString()} MMK`;
        document.getElementById('total').textContent = `${total.toLocaleString()} MMK`;
    }

    clearCart() {
        if (this.cartItems.length === 0) return;

        const currentLang = document.documentElement.getAttribute('data-lang') || 'en';
        const confirmMessage = currentLang === 'mm' 
            ? 'စျေးဝယ်ခြင်းတောင်းကို ဖျက်မှာသေချာလား?'
            : 'Are you sure you want to clear your cart?';

        if (confirm(confirmMessage)) {
            this.cartItems = [];
            this.saveCartItems();
            this.renderCart();
            this.updateSummary();
            this.showNotification(
                currentLang === 'mm' ? 'စျေးဝယ်ခြင်းတောင်းကို ရှင်းလင်းပြီးပါပြီ' : 'Cart cleared successfully',
                'info'
            );
        }
    }

    proceedToMessenger() {
        if (this.cartItems.length === 0) {
            const currentLang = document.documentElement.getAttribute('data-lang') || 'en';
            this.showNotification(currentLang === 'mm' ? 'စျေးဝယ်ခြင်းတောင်းထဲတွင် ပစ္စည်းမရှိပါ' : 'Your cart is empty', 'warning');
            return;
        }

        // Create order summary for messenger
        const orderSummary = this.createOrderSummary();
        const encodedMessage = encodeURIComponent(orderSummary);
        const messengerUrl = `${this.messengerUrl}?text=${encodedMessage}`;

        // Show loading state
        const proceedBtn = document.getElementById('proceedBtn');
        const originalText = proceedBtn.querySelector('.mdc-button__label').textContent;
        const currentLang = document.documentElement.getAttribute('data-lang') || 'en';
        proceedBtn.querySelector('.mdc-button__label').textContent = currentLang === 'mm' ? 'ပို့ဆောင်နေသည်...' : 'Redirecting...';
        proceedBtn.disabled = true;

        // Redirect after a short delay
        setTimeout(() => {
            window.open(messengerUrl, '_blank');
            
            // Reset button state
            proceedBtn.querySelector('.mdc-button__label').textContent = originalText;
            proceedBtn.disabled = false;
            
            // Show success message
            this.showNotification(
                currentLang === 'mm' 
                    ? 'Messenger သို့ ပို့ဆောင်နေပါသည်...'
                    : 'Redirecting to Messenger...',
                'success'
            );
        }, 1000);
    }

    createOrderSummary() {
        const currentLang = document.documentElement.getAttribute('data-lang') || 'en';
        const total = this.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        let summary = currentLang === 'mm' 
            ? `မင်္ဂလာပါ! မီမို့လက်မှုပစ္စည်းဆိုင်မှ မှာယူမှုစာရင်း:\n\n`
            : `Hello! Order from Mimo's Handicrafts:\n\n`;

        this.cartItems.forEach(item => {
            const name = currentLang === 'mm' ? (item.nameMM || item.name) : item.name;
            summary += `• ${name}\n`;
            summary += `  ${currentLang === 'mm' ? 'အရေအတွက်' : 'Quantity'}: ${item.quantity}\n`;
            summary += `  ${currentLang === 'mm' ? 'တစ်ခုချင်းစျေး' : 'Price'}: ${item.price.toLocaleString()} MMK\n`;
            summary += `  ${currentLang === 'mm' ? 'စုစုပေါင်း' : 'Subtotal'}: ${(item.price * item.quantity).toLocaleString()} MMK\n\n`;
        });

        summary += `${currentLang === 'mm' ? 'စုစုပေါင်းကျသင့်ငွေ' : 'Total'}: ${total.toLocaleString()} MMK\n\n`;
        summary += currentLang === 'mm' 
            ? 'မှာယူမှုကို အတည်ပြုပေးပါ။ ကျေးဇူးတင်ပါတယ်!'
            : 'Please confirm this order. Thank you!';

        return summary;
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="material-icons">${this.getNotificationIcon(type)}</span>
                <span class="notification-message">${message}</span>
            </div>
        `;

        // Add to page
        document.body.appendChild(notification);

        // Show notification
        setTimeout(() => notification.classList.add('show'), 100);

        // Remove notification
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    getNotificationIcon(type) {
        switch (type) {
            case 'success': return 'check_circle';
            case 'warning': return 'warning';
            case 'error': return 'error';
            default: return 'info';
        }
    }
}

// Notification Styles (injected dynamically)
const notificationStyles = `
    .notification {
        position: fixed;
        top: 80px;
        right: 20px;
        background: #ffffff;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08);
        padding: 16px 20px;
        transform: translateX(100%);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        z-index: 1001;
        max-width: 320px;
        min-width: 280px;
        border: 1px solid rgba(0, 0, 0, 0.08);
    }

    .notification.show {
        transform: translateX(0);
    }

    .notification-content {
        display: flex;
        align-items: center;
        gap: 12px;
    }

    .notification-success {
        background: #e8f5e8;
        border-left: 4px solid #4caf50;
        color: #2e7d32;
    }

    .notification-success .material-icons {
        color: #4caf50;
    }

    .notification-warning {
        background: #fff8e1;
        border-left: 4px solid #ff9800;
        color: #e65100;
    }

    .notification-warning .material-icons {
        color: #ff9800;
    }

    .notification-error {
        background: #ffebee;
        border-left: 4px solid #f44336;
        color: #c62828;
    }

    .notification-error .material-icons {
        color: #f44336;
    }

    .notification-info {
        background: #e3f2fd;
        border-left: 4px solid #2196f3;
        color: #1565c0;
    }

    .notification-info .material-icons {
        color: #2196f3;
    }

    .notification-message {
        font-size: 14px;
        font-weight: 500;
        line-height: 1.4;
        flex: 1;
    }

    .material-icons {
        font-size: 20px;
        flex-shrink: 0;
    }

    @media (max-width: 768px) {
        .notification {
            right: 16px;
            left: 16px;
            max-width: none;
            min-width: auto;
            transform: translateY(-100%);
            top: 70px;
        }

        .notification.show {
            transform: translateY(0);
        }
    }
`;

// Inject notification styles
const styleSheet = document.createElement('style');
styleSheet.textContent = notificationStyles;
document.head.appendChild(styleSheet);

// Initialize cart page when DOM is loaded
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
    }

    // Initialize cart page manager
    window.cartPageManager = new CartPageManager();

    // Initialize language manager if available
    if (typeof LanguageManager !== 'undefined') {
        window.languageManager = new LanguageManager();
    }

    // Initialize navigation if available
    if (typeof initializeNavigation === 'function') {
        initializeNavigation();
    }
    
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
        console.log(`[theme] Cart page applied variant ${variant} -> ${base}`);
    } catch (e) {
        console.warn('[theme] Cart page variant apply failed:', e);
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
// Main JavaScript file for Surfnetwork Website

// Global Variables
let isLoggedIn = false;
let currentUser = null;

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    initializeWebsite();
});

// Initialize Website
function initializeWebsite() {
    try {
        console.log('Initializing website...');
        
        // Wait for database to be ready
        if (window.db) {
            console.log('Database is available');
            // Perform database health check
            const health = window.db.checkDatabaseHealth();
            console.log('Database health:', health);
        } else {
            console.warn('Database not available yet, retrying...');
            setTimeout(() => {
                if (window.db) {
                    console.log('Database now available');
                } else {
                    console.error('Database still not available');
                }
            }, 1000);
        }
        
        // Check if user is logged in
        checkLoginStatus();
        
        // Initialize animations
        initializeAnimations();
        
        // Initialize IP reveal functionality
        initializeIPReveal();
        
        // Initialize form handlers
        initializeFormHandlers();
        
        // Initialize server status
        updateServerStatus();
        
        // Initialize navbar scroll effect
        initializeNavbarScroll();
        
        // Initialize particle effect
        initializeParticleEffect();
        
        console.log('Website initialization completed');
    } catch (error) {
        console.error('Error initializing website:', error);
    }
}

// Check Login Status
function checkLoginStatus() {
    try {
        const token = localStorage.getItem('authToken');
        const userData = localStorage.getItem('userData');
        
        console.log('Checking login status...');
        console.log('Token exists:', !!token);
        console.log('User data exists:', !!userData);
        
        if (token && userData) {
            const parsedUserData = JSON.parse(userData);
            
            // Verify user still exists in database
            if (window.db) {
                const dbUser = window.db.getUserById(parsedUserData.id);
                if (dbUser && dbUser.isActive) {
                    isLoggedIn = true;
                    currentUser = parsedUserData;
                    console.log('User login status verified:', currentUser.username);
                    updateNavbarForLoggedInUser();
                    return true;
                } else {
                    console.log('User not found in database or inactive, clearing session');
                    clearLoginSession();
                }
            } else {
                console.log('Database not available, using cached data');
                isLoggedIn = true;
                currentUser = parsedUserData;
                updateNavbarForLoggedInUser();
                return true;
            }
        }
        
        console.log('No valid login session found');
        return false;
    } catch (error) {
        console.error('Error checking login status:', error);
        clearLoginSession();
        return false;
    }
}

// Clear login session
function clearLoginSession() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    isLoggedIn = false;
    currentUser = null;
    console.log('Login session cleared');
}

// Update Navbar for Logged In User
function updateNavbarForLoggedInUser() {
    const loginLink = document.querySelector('a[href="login.html"], #loginNavLink');
    if (loginLink && isLoggedIn) {
        loginLink.innerHTML = `<i class="fas fa-user me-2"></i>${currentUser.username}`;
        loginLink.href = '#';
        loginLink.onclick = showUserMenu;
    }
}

// Show User Menu
function showUserMenu(e) {
    e.preventDefault();
    // Create dropdown menu for user options
    const existingMenu = document.querySelector('.user-menu');
    if (existingMenu) {
        existingMenu.remove();
        return;
    }
    
    const menu = document.createElement('div');
    menu.className = 'user-menu position-absolute bg-white border rounded shadow-lg p-3';
    menu.style.cssText = 'top: 100%; right: 0; min-width: 200px; z-index: 1000;';
    menu.innerHTML = `
        <div class="d-flex align-items-center mb-3">
            <div class="avatar bg-primary rounded-circle d-flex align-items-center justify-content-center me-3" style="width: 40px; height: 40px;">
                <i class="fas fa-user text-white"></i>
            </div>
            <div>
                <div class="fw-bold">${currentUser.username}</div>
                <small class="text-muted">${currentUser.email}</small>
            </div>
        </div>
        <hr>
        <a href="#" class="d-block text-decoration-none text-dark py-2" onclick="showProfile()">
            <i class="fas fa-user me-2"></i>Profile
        </a>
        <a href="#" class="d-block text-decoration-none text-dark py-2" onclick="showPurchases()">
            <i class="fas fa-shopping-bag me-2"></i>My Purchases
        </a>
        <a href="#" class="d-block text-decoration-none text-dark py-2" onclick="logout()">
            <i class="fas fa-sign-out-alt me-2"></i>Logout
        </a>
    `;
    
    const navbar = document.querySelector('.navbar-nav');
    const loginItem = navbar.querySelector('li:last-child');
    loginItem.style.position = 'relative';
    loginItem.appendChild(menu);
    
    // Close menu when clicking outside
    setTimeout(() => {
        document.addEventListener('click', function closeMenu(e) {
            if (!menu.contains(e.target)) {
                menu.remove();
                document.removeEventListener('click', closeMenu);
            }
        });
    }, 100);
}

// Logout Function
function logout() {
    try {
        console.log('Logging out user:', currentUser?.username);
        clearLoginSession();
        
        // Show logout notification
        showNotification('Logged out successfully!', 'success');
        
        // Reload page after a short delay
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    } catch (error) {
        console.error('Error during logout:', error);
        // Force reload even if there's an error
        window.location.reload();
    }
}

// Initialize Animations
function initializeAnimations() {
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
    const animateElements = document.querySelectorAll('.feature-card, .update-card, .help-card, .product-card');
    animateElements.forEach(el => observer.observe(el));
}

// Initialize IP Reveal Functionality
function initializeIPReveal() {
    const ipRevealBtn = document.getElementById('ipRevealBtn');
    const ipDisplay = document.getElementById('ipDisplay');
    
    if (ipRevealBtn && ipDisplay) {
        ipRevealBtn.addEventListener('click', function() {
            this.classList.add('loading');
            this.disabled = true;
            
            // Simulate loading delay
            setTimeout(() => {
                this.classList.remove('loading');
                this.style.display = 'none';
                ipDisplay.classList.remove('d-none');
                
                // Add copy functionality
                const copyBtn = ipDisplay.querySelector('button');
                if (copyBtn) {
                    copyBtn.addEventListener('click', copyIP);
                }
            }, 1500);
        });
    }
}

// Copy IP to Clipboard
function copyIP() {
    const ipText = document.querySelector('.ip-text').textContent;
    navigator.clipboard.writeText(ipText).then(() => {
        showNotification('IP copied to clipboard!', 'success');
    }).catch(() => {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = ipText;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showNotification('IP copied to clipboard!', 'success');
    });
}

// Show Notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} alert-custom position-fixed`;
    notification.style.cssText = 'top: 100px; right: 20px; z-index: 9999; min-width: 300px;';
    notification.innerHTML = `
        <div class="d-flex align-items-center">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'} me-2"></i>
            ${message}
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Initialize Form Handlers
function initializeFormHandlers() {
    // Login Form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Signup Form
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }
    
    // Contact Form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContact);
    }
}

// Handle Login
async function handleLogin(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const loginData = {
        email: formData.get('email'),
        password: formData.get('password')
    };
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<div class="loading"></div> Logging in...';
    submitBtn.disabled = true;
    
    try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Use database for authentication
        const user = window.db ? window.db.authenticateUser(loginData.email, loginData.password) : null;
        
        if (user) {
            // Generate token (in real app, this would be from server)
            const token = 'token_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            
            // Store session data
            localStorage.setItem('authToken', token);
            localStorage.setItem('userData', JSON.stringify({
                id: user.id,
                username: user.username,
                email: user.email,
                rank: user.rank,
                coins: user.coins
            }));
            
            // Update global variables
            isLoggedIn = true;
            currentUser = {
                id: user.id,
                username: user.username,
                email: user.email,
                rank: user.rank,
                coins: user.coins
            };
            
            console.log('Login successful, session stored:', currentUser.username);
            showNotification('Login successful! Redirecting...', 'success');
            
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        } else {
            throw new Error('Invalid credentials');
        }
    } catch (error) {
        showNotification('Invalid email or password', 'error');
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

// Handle Signup
async function handleSignup(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const signupData = {
        username: formData.get('username'),
        email: formData.get('email'),
        password: formData.get('password'),
        confirmPassword: formData.get('confirmPassword')
    };
    
    // Validation
    if (signupData.password !== signupData.confirmPassword) {
        showNotification('Passwords do not match', 'error');
        return;
    }
    
    if (signupData.password.length < 6) {
        showNotification('Password must be at least 6 characters', 'error');
        return;
    }
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<div class="loading"></div> Creating account...';
    submitBtn.disabled = true;
    
    try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Check if user already exists using database
        if (window.db) {
            const existingUser = window.db.getUserByEmail(signupData.email);
            if (existingUser) {
                throw new Error('Email already registered');
            }
            
            const existingUsername = window.db.getUserByUsername(signupData.username);
            if (existingUsername) {
                throw new Error('Username already taken');
            }
            
            // Create new user in database
            const newUser = window.db.createUser({
                username: signupData.username,
                email: signupData.email,
                password: signupData.password // In real app, this would be hashed
            });
            
            showNotification('Account created successfully! Please login.', 'success');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1500);
        } else {
            throw new Error('Database not available');
        }
    } catch (error) {
        showNotification(error.message, 'error');
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

// Handle Contact Form
async function handleContact(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const contactData = {
        name: formData.get('name'),
        email: formData.get('email'),
        subject: formData.get('subject'),
        message: formData.get('message')
    };
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<div class="loading"></div> Sending...';
    submitBtn.disabled = true;
    
    try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Save contact message using database
        if (window.db) {
            window.db.createContactMessage(contactData);
        }
        
        showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
        e.target.reset();
    } catch (error) {
        showNotification('Failed to send message. Please try again.', 'error');
    } finally {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

// Update Server Status
function updateServerStatus() {
    const playerCountElement = document.getElementById('playerCount');
    if (playerCountElement) {
        // Simulate real-time player count updates
        setInterval(() => {
            const currentCount = Math.floor(Math.random() * 50) + 100; // 100-150 players
            const maxCount = 500;
            playerCountElement.textContent = `${currentCount}/${maxCount} Players`;
        }, 30000); // Update every 30 seconds
    }
}

// Initialize Navbar Scroll Effect
function initializeNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }
}

// Initialize Particle Effect (for hero section)
function initializeParticleEffect() {
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
        createParticles(heroSection);
    }
}

// Create Particles
function createParticles(container) {
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: absolute;
            width: 2px;
            height: 2px;
            background: rgba(255, 255, 255, 0.5);
            border-radius: 50%;
            pointer-events: none;
            animation: float ${Math.random() * 3 + 2}s infinite linear;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation-delay: ${Math.random() * 2}s;
        `;
        
        container.appendChild(particle);
    }
    
    // Add particle animation CSS
    if (!document.querySelector('#particle-styles')) {
        const style = document.createElement('style');
        style.id = 'particle-styles';
        style.textContent = `
            @keyframes float {
                0%, 100% {
                    transform: translateY(0px) rotate(0deg);
                    opacity: 1;
                }
                50% {
                    transform: translateY(-20px) rotate(180deg);
                    opacity: 0.5;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Store Functions
function purchaseItem(itemName, price) {
    if (!isLoggedIn) {
        showNotification('Please login to make a purchase', 'error');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
        return;
    }
    
    // Simulate purchase process
    const confirmation = confirm(`Purchase ${itemName} for $${price}?`);
    if (confirmation) {
        // In a real app, this would integrate with a payment processor
        if (window.db && currentUser) {
            const purchase = window.db.createPurchase({
                userId: currentUser.id,
                itemName: itemName,
                itemType: getItemType(itemName),
                price: price
            });
            
            // Update user rank based on purchase
            updateUserRankAfterPurchase(itemName, currentUser.id);
            
            showNotification(`Successfully purchased ${itemName}! Your rank has been updated.`, 'success');
        } else {
            showNotification('Purchase failed. Please try again.', 'error');
        }
    }
}

// Function to update user rank after purchase
function updateUserRankAfterPurchase(itemName, userId) {
    if (!window.db) return;
    
    let newRank = null;
    
    // Determine rank based on item name
    switch(itemName.toLowerCase()) {
        case 'vip rank':
            newRank = 'VIP';
            break;
        case 'mvp rank':
            newRank = 'MVP';
            break;
        case 'elite rank':
            newRank = 'ELITE';
            break;
        case 'legend rank':
            newRank = 'LEGEND';
            break;
        case 'owner rank':
            newRank = 'OWNER';
            break;
        default:
            // For other items, don't change rank
            return;
    }
    
    if (newRank) {
        // Update user rank in database
        window.db.updateUser(userId, { rank: newRank });
        
        // Update current user data
        if (currentUser) {
            currentUser.rank = newRank;
        }
        
        console.log(`User ${userId} rank updated to ${newRank} after purchasing ${itemName}`);
    }
}

// Helper function to determine item type
function getItemType(itemName) {
    const itemName_lower = itemName.toLowerCase();
    if (itemName_lower.includes('rank')) return 'rank';
    if (itemName_lower.includes('coins')) return 'currency';
    if (itemName_lower.includes('bundle')) return 'bundle';
    if (itemName_lower.includes('pet')) return 'cosmetic';
    if (itemName_lower.includes('trail') || itemName_lower.includes('wings') || itemName_lower.includes('chat')) return 'cosmetic';
    return 'other';
}

// Show Profile
function showProfile() {
    window.location.href = 'profile.html';
}

// Show Purchases
function showPurchases() {
    if (window.db && currentUser) {
        const userPurchases = window.db.getPurchasesByUserId(currentUser.id);
        
        if (userPurchases.length === 0) {
            showNotification('No purchases found', 'info');
            return;
        }
        
        let purchaseList = 'Your purchases:\n';
        userPurchases.forEach(purchase => {
            const date = new Date(purchase.purchaseDate).toLocaleDateString();
            purchaseList += `• ${purchase.itemName} - $${purchase.price} (${date})\n`;
        });
        
        alert(purchaseList);
    } else {
        showNotification('Unable to load purchases', 'error');
    }
}

// Smooth scroll for anchor links
document.addEventListener('click', function(e) {
    if (e.target.matches('a[href^="#"]')) {
        e.preventDefault();
        const target = document.querySelector(e.target.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
});

// Form validation helpers
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePassword(password) {
    return password.length >= 6;
}

// Toggle password visibility
function togglePasswordVisibility(inputId) {
    const input = document.getElementById(inputId);
    const icon = input.nextElementSibling.querySelector('i');
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.replace('fa-eye', 'fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.replace('fa-eye-slash', 'fa-eye');
    }
}

// Search functionality (for future implementation)
function initializeSearch() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const query = e.target.value.toLowerCase();
            // Implement search logic here
            console.log('Searching for:', query);
        });
    }
}

// Mobile menu toggle
function toggleMobileMenu() {
    const navbarCollapse = document.querySelector('.navbar-collapse');
    navbarCollapse.classList.toggle('show');
}

// Initialize tooltips (if using Bootstrap tooltips)
function initializeTooltips() {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function(tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
}

// Error handling for images
document.addEventListener('error', function(e) {
    if (e.target.tagName === 'IMG') {
        e.target.src = 'https://via.placeholder.com/400x300/667eea/ffffff?text=Image+Not+Found';
    }
}, true);

// Performance optimization: Lazy loading for images
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

// Initialize everything when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeWebsite);
} else {
    initializeWebsite();
}
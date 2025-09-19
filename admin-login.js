// Admin Login JavaScript

// Global Variables
let isAdminLoggedIn = false;
let currentAdminUser = null;

// Initialize admin login when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Admin login page loaded');
    initializeAdminLogin();
});

// Initialize admin login functionality
function initializeAdminLogin() {
    try {
        console.log('Initializing admin login...');
        
        // Check if already logged in
        if (isAdminLoggedIn()) {
            console.log('Admin already logged in, redirecting...');
            window.location.href = 'admin-login-fixed.html';
            return;
        }
        
        // Initialize form handler
        const loginForm = document.getElementById('adminLoginForm');
        if (loginForm) {
            console.log('Login form found, adding event listener');
            loginForm.addEventListener('submit', handleAdminLogin);
        } else {
            console.error('Login form not found!');
        }
        
        // Create admin user if it doesn't exist
        createAdminUserIfNotExists();
        
        console.log('Admin login initialization completed');
    } catch (error) {
        console.error('Error initializing admin login:', error);
    }
}

// Check if admin is logged in
function isAdminLoggedIn() {
    try {
        const adminToken = localStorage.getItem('adminToken');
        const adminData = localStorage.getItem('adminData');
        const isLoggedIn = adminToken && adminData;
        console.log('Admin login check:', isLoggedIn);
        return isLoggedIn;
    } catch (error) {
        console.error('Error checking admin login status:', error);
        return false;
    }
}

// Create admin user if it doesn't exist
function createAdminUserIfNotExists() {
    try {
        console.log('Checking for admin user...');
        
        // Wait for database to be available
        if (window.db) {
            console.log('Database available, checking admin user');
            const adminUser = window.db.getUserByEmail('admin@surfnetwork.com');
            if (!adminUser) {
                console.log('Creating admin user...');
                window.db.createUser({
                    username: 'admin',
                    email: 'admin@surfnetwork.com',
                    password: 'admin123456', // In real app, this would be hashed
                    role: 'admin',
                    rank: 'OWNER',
                    coins: 999999,
                    joinDate: new Date('2025-01-01').toISOString()
                });
                console.log('Admin user created: admin@surfnetwork.com / admin123456');
            } else {
                console.log('Admin user already exists');
            }
        } else {
            console.warn('Database not available yet, retrying...');
            setTimeout(createAdminUserIfNotExists, 1000);
        }
    } catch (error) {
        console.error('Error creating admin user:', error);
    }
}

// Handle admin login
async function handleAdminLogin(e) {
    e.preventDefault();
    
    try {
        console.log('Handling admin login...');
        
        const email = document.getElementById('adminEmail').value;
        const password = document.getElementById('adminPassword').value;
        
        console.log('Login attempt for:', email);
        
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<div class="loading"></div> Logging in...';
        submitBtn.disabled = true;
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Check if database is available
        if (!window.db) {
            throw new Error('Database not available. Please refresh the page and try again.');
        }
        
        // Authenticate admin user
        const adminUser = window.db.authenticateUser(email, password);
        
        if (adminUser && (adminUser.role === 'admin' || adminUser.rank === 'OWNER')) {
            console.log('Admin authentication successful');
            
            // Generate admin token
            const adminToken = 'admin_token_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            
            // Store admin session
            localStorage.setItem('adminToken', adminToken);
            localStorage.setItem('adminData', JSON.stringify({
                id: adminUser.id,
                username: adminUser.username,
                email: adminUser.email,
                role: adminUser.role,
                rank: adminUser.rank
            }));
            
            showNotification('Admin login successful! Redirecting...', 'success');
            
            setTimeout(() => {
                window.location.href = 'admin-debug.html';
            }, 1500);
        } else {
            throw new Error('Invalid admin credentials');
        }
    } catch (error) {
        console.error('Admin login error:', error);
        showNotification(error.message || 'Login failed. Please try again.', 'error');
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

// Show notification
function showNotification(message, type = 'info') {
    try {
        const notification = document.createElement('div');
        notification.className = `alert alert-${type} alert-custom position-fixed`;
        notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
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
    } catch (error) {
        console.error('Error showing notification:', error);
        alert(message); // Fallback to alert
    }
}

// Add some demo admin accounts for testing
function createDemoAdminAccounts() {
    try {
        console.log('Creating demo admin accounts...');
        
        if (!window.db) {
            console.warn('Database not available for demo accounts');
            return;
        }
        
        // Create additional admin accounts for demonstration
        const demoAdmins = [
            {
                username: 'moderator1',
                email: 'mod@surfnetwork.com',
                password: 'mod123456',
                role: 'moderator',
                rank: 'MODERATOR',
                coins: 50000
            },
            {
                username: 'superadmin',
                email: 'superadmin@surfnetwork.com',
                password: 'super123456',
                role: 'admin',
                rank: 'ADMIN',
                coins: 100000
            }
        ];
        
        demoAdmins.forEach(adminData => {
            const existingUser = window.db.getUserByEmail(adminData.email);
            if (!existingUser) {
                window.db.createUser(adminData);
                console.log('Demo admin created:', adminData.email);
            }
        });
    } catch (error) {
        console.error('Error creating demo admin accounts:', error);
    }
}

// Initialize demo accounts when page loads
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(createDemoAdminAccounts, 2000);
});

// Add error handling for global errors
window.addEventListener('error', function(e) {
    console.error('Global error:', e.error);
});

// Add unhandled promise rejection handling
window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled promise rejection:', e.reason);
});

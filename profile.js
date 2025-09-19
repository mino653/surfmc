// Profile Page JavaScript

// Initialize profile page when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeProfile();
});

// Initialize profile functionality
function initializeProfile() {
    // Check if user is logged in
    if (!isLoggedIn) {
        window.location.href = 'login.html';
        return;
    }

    // Load user profile data
    loadProfileData();
    
    // Initialize tab switching
    initializeTabSwitching();
    
    // Initialize form handlers
    initializeProfileForms();
    
    // Load purchase history
    loadPurchaseHistory();
    
    // Load login history
    loadLoginHistory();
    
    // Load notifications
    loadNotifications();
    
    // Update navbar
    updateNavbarForProfile();
}

// Load user profile data
function loadProfileData() {
    if (!currentUser || !window.db) return;
    
    // Get fresh user data from database
    const userData = window.db.getUserById(currentUser.id);
    if (!userData) return;
    
    // Update profile header
    document.getElementById('profileUsername').textContent = userData.username;
    document.getElementById('profileEmail').textContent = userData.email;
    document.getElementById('userRank').textContent = userData.rank || 'DEFAULT';
    document.getElementById('userCoins').textContent = (userData.coins || 0).toLocaleString();
    
    // Calculate member since date
    const joinDate = new Date(userData.joinDate);
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    document.getElementById('memberSince').textContent = 
        `${monthNames[joinDate.getMonth()]} ${joinDate.getFullYear()}`;
    
    // Get purchase count
    const purchases = window.db.getPurchasesByUserId(currentUser.id);
    document.getElementById('totalPurchases').textContent = purchases.length;
    
    // Fill form fields
    document.getElementById('editUsername').value = userData.username;
    document.getElementById('editEmail').value = userData.email;
    document.getElementById('editFirstName').value = userData.firstName || '';
    document.getElementById('editLastName').value = userData.lastName || '';
    document.getElementById('editBio').value = userData.bio || '';
    document.getElementById('editCountry').value = userData.country || '';
    document.getElementById('editTimezone').value = userData.timezone || '';
    
    // Load settings
    loadUserSettings(userData);
}

// Load user settings
function loadUserSettings(userData) {
    const settings = userData.settings || {};
    
    document.getElementById('profilePublic').checked = settings.profilePublic !== false;
    document.getElementById('showPurchases').checked = settings.showPurchases === true;
    document.getElementById('showStats').checked = settings.showStats !== false;
    document.getElementById('emailNotifications').checked = settings.emailNotifications !== false;
    document.getElementById('newsletterSubscription').checked = settings.newsletterSubscription !== false;
    document.getElementById('promotionalEmails').checked = settings.promotionalEmails === true;
}

// Initialize tab switching
function initializeTabSwitching() {
    const tabLinks = document.querySelectorAll('[data-tab]');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetTab = this.getAttribute('data-tab');
            
            // Remove active class from all tabs and contents
            tabLinks.forEach(l => l.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding content
            this.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });
}

// Initialize profile forms
function initializeProfileForms() {
    // Account form
    const accountForm = document.getElementById('accountForm');
    if (accountForm) {
        accountForm.addEventListener('submit', handleAccountUpdate);
    }
    
    // Settings form
    const settingsForm = document.getElementById('settingsForm');
    if (settingsForm) {
        settingsForm.addEventListener('submit', handleSettingsUpdate);
    }
    
    // Password form
    const passwordForm = document.getElementById('passwordForm');
    if (passwordForm) {
        passwordForm.addEventListener('submit', handlePasswordChange);
    }
}

// Handle account update
async function handleAccountUpdate(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const updateData = {
        email: document.getElementById('editEmail').value,
        firstName: document.getElementById('editFirstName').value,
        lastName: document.getElementById('editLastName').value,
        bio: document.getElementById('editBio').value,
        country: document.getElementById('editCountry').value,
        timezone: document.getElementById('editTimezone').value
    };
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<div class="loading"></div> Saving...';
    submitBtn.disabled = true;
    
    try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Update user in database
        if (window.db && currentUser) {
            window.db.updateUser(currentUser.id, updateData);
            
            // Update current user data
            const updatedUser = window.db.getUserById(currentUser.id);
            localStorage.setItem('userData', JSON.stringify({
                id: updatedUser.id,
                username: updatedUser.username,
                email: updatedUser.email,
                rank: updatedUser.rank,
                coins: updatedUser.coins
            }));
            
            showNotification('Profile updated successfully!', 'success');
        }
    } catch (error) {
        showNotification('Failed to update profile. Please try again.', 'error');
    } finally {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

// Handle settings update
async function handleSettingsUpdate(e) {
    e.preventDefault();
    
    const settings = {
        profilePublic: document.getElementById('profilePublic').checked,
        showPurchases: document.getElementById('showPurchases').checked,
        showStats: document.getElementById('showStats').checked,
        emailNotifications: document.getElementById('emailNotifications').checked,
        newsletterSubscription: document.getElementById('newsletterSubscription').checked,
        promotionalEmails: document.getElementById('promotionalEmails').checked
    };
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<div class="loading"></div> Saving...';
    submitBtn.disabled = true;
    
    try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Update user settings in database
        if (window.db && currentUser) {
            window.db.updateUser(currentUser.id, { settings: settings });
            showNotification('Settings saved successfully!', 'success');
        }
    } catch (error) {
        showNotification('Failed to save settings. Please try again.', 'error');
    } finally {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

// Handle password change
async function handlePasswordChange(e) {
    e.preventDefault();
    
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    // Validation
    if (newPassword !== confirmPassword) {
        showNotification('New passwords do not match', 'error');
        return;
    }
    
    if (newPassword.length < 6) {
        showNotification('Password must be at least 6 characters', 'error');
        return;
    }
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Changing Password...';
    submitBtn.disabled = true;
    
    try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Verify current password and update
        if (window.db && currentUser) {
            const userData = window.db.getUserById(currentUser.id);
            if (!userData) {
                throw new Error('User not found');
            }
            
            if (userData.password !== currentPassword) {
                throw new Error('Current password is incorrect');
            }
            
            // Update password in database
            const updatedUser = window.db.updateUser(currentUser.id, { 
                password: newPassword,
                lastPasswordChange: new Date().toISOString()
            });
            
            if (!updatedUser) {
                throw new Error('Failed to update password in database');
            }
            
            // Update current user data in memory
            currentUser.password = newPassword;
            currentUser.lastPasswordChange = updatedUser.lastPasswordChange;
            
            // Update localStorage session data
            const sessionData = JSON.parse(localStorage.getItem('userSession') || '{}');
            sessionData.password = newPassword;
            localStorage.setItem('userSession', JSON.stringify(sessionData));
            
            // Verify the change was saved
            const verifyUser = window.db.getUserById(currentUser.id);
            if (verifyUser.password !== newPassword) {
                throw new Error('Password change verification failed');
            }
            
            console.log('Password successfully updated for user:', currentUser.username);
            console.log('Updated user data:', verifyUser);
            
            // Send password change notification email
            if (window.emailService) {
                try {
                    await window.emailService.sendPasswordChangeNotification(updatedUser);
                } catch (emailError) {
                    console.warn('Failed to send password change notification:', emailError);
                }
            }
            
            // Clear form
            e.target.reset();
            
            showNotification('Password changed successfully! Check your email for confirmation.', 'success');
        } else {
            throw new Error('Database or user session not available');
        }
    } catch (error) {
        console.error('Password change error:', error);
        showNotification(error.message || 'Failed to change password', 'error');
    } finally {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

// Load purchase history
function loadPurchaseHistory() {
    if (!window.db || !currentUser) return;
    
    const purchases = window.db.getPurchasesByUserId(currentUser.id);
    const purchasesList = document.getElementById('purchasesList');
    
    if (purchases.length === 0) {
        purchasesList.innerHTML = `
            <div class="text-center py-5">
                <i class="fas fa-shopping-cart fa-3x text-muted mb-3"></i>
                <h5 class="text-muted">No purchases yet</h5>
                <p class="text-muted">Visit our store to get started!</p>
                <a href="store.html" class="btn btn-primary">
                    <i class="fas fa-shopping-cart me-2"></i>Visit Store
                </a>
            </div>
        `;
        return;
    }
    
    let purchasesHTML = '';
    purchases.reverse().forEach(purchase => {
        const date = new Date(purchase.purchaseDate).toLocaleDateString();
        const time = new Date(purchase.purchaseDate).toLocaleTimeString();
        
        purchasesHTML += `
            <div class="purchase-item">
                <div class="row align-items-center">
                    <div class="col-md-6">
                        <h6 class="mb-1">${purchase.itemName}</h6>
                        <small class="text-muted">${purchase.itemType}</small>
                    </div>
                    <div class="col-md-3 text-center">
                        <span class="badge bg-success">$${purchase.price}</span>
                    </div>
                    <div class="col-md-3 text-end">
                        <small class="text-muted">${date}<br>${time}</small>
                    </div>
                </div>
            </div>
        `;
    });
    
    purchasesList.innerHTML = purchasesHTML;
}

// Load login history
function loadLoginHistory() {
    const loginHistory = document.getElementById('loginHistory');
    
    // Get current session info
    const currentSession = `
        <div class="login-activity-item">
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <i class="fas fa-desktop me-2"></i>
                    <span>Current Session</span>
                    <br>
                    <small class="text-muted">Browser: ${navigator.userAgent.split(' ')[0]}</small>
                </div>
                <small class="text-success">Active now</small>
            </div>
        </div>
    `;
    
    // Add some mock previous sessions
    const previousSessions = `
        <div class="login-activity-item">
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <i class="fas fa-mobile me-2"></i>
                    <span>Mobile Device</span>
                    <br>
                    <small class="text-muted">Location: Unknown</small>
                </div>
                <small class="text-muted">2 hours ago</small>
            </div>
        </div>
        <div class="login-activity-item">
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <i class="fas fa-laptop me-2"></i>
                    <span>Desktop Computer</span>
                    <br>
                    <small class="text-muted">Location: Unknown</small>
                </div>
                <small class="text-muted">Yesterday</small>
            </div>
        </div>
    `;
    
    loginHistory.innerHTML = currentSession + previousSessions;
}

// Load notifications
function loadNotifications() {
    const notificationsList = document.getElementById('notificationsList');
    
    // Mock notifications
    const notifications = [
        {
            type: 'success',
            icon: 'fas fa-check',
            title: 'Welcome to the server!',
            message: 'Your account has been successfully created.',
            time: 'Just now'
        },
        {
            type: 'info',
            icon: 'fas fa-info',
            title: 'Server Update',
            message: 'New features have been added to the server.',
            time: '2 hours ago'
        },
        {
            type: 'warning',
            icon: 'fas fa-exclamation-triangle',
            title: 'Maintenance Notice',
            message: 'Scheduled maintenance on Sunday at 3 AM UTC.',
            time: '1 day ago'
        }
    ];
    
    let notificationsHTML = '';
    notifications.forEach(notification => {
        notificationsHTML += `
            <div class="notification-item">
                <div class="notification-icon bg-${notification.type}">
                    <i class="${notification.icon}"></i>
                </div>
                <div class="notification-content">
                    <h6>${notification.title}</h6>
                    <p>${notification.message}</p>
                    <small class="text-muted">${notification.time}</small>
                </div>
            </div>
        `;
    });
    
    notificationsList.innerHTML = notificationsHTML;
}

// Change avatar function
function changeAvatar() {
    // Create file input
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                document.getElementById('userAvatar').src = e.target.result;
                showNotification('Avatar updated successfully!', 'success');
            };
            reader.readAsDataURL(file);
        }
    };
    
    input.click();
}

// Update navbar for profile page
function updateNavbarForProfile() {
    const loginLink = document.querySelector('a[href="login.html"], #loginNavLink');
    if (loginLink && isLoggedIn && currentUser) {
        loginLink.innerHTML = `<i class="fas fa-user me-2"></i>${currentUser.username}`;
        loginLink.href = 'profile.html';
        loginLink.onclick = null;
    }
}
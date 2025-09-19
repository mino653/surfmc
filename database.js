// Simple Database Simulation using localStorage
// This simulates a database for the Surfnetwork server website

class SimpleDatabase {
    constructor() {
        this.init();
    }

    // Initialize database with default data
    init() {
        try {
            console.log('Initializing database...');
            
            // Initialize users table if it doesn't exist
            if (!localStorage.getItem('users')) {
                localStorage.setItem('users', JSON.stringify([]));
                console.log('Users table initialized');
            }

            // Initialize purchases table if it doesn't exist
            if (!localStorage.getItem('purchases')) {
                localStorage.setItem('purchases', JSON.stringify([]));
                console.log('Purchases table initialized');
            }

            // Initialize contact messages table if it doesn't exist
            if (!localStorage.getItem('contact_messages')) {
                localStorage.setItem('contact_messages', JSON.stringify([]));
                console.log('Contact messages table initialized');
            }

            // Initialize server stats if it doesn't exist
            if (!localStorage.getItem('server_stats')) {
                localStorage.setItem('server_stats', JSON.stringify({
                    totalPlayers: 2847,
                    onlinePlayers: 127,
                    maxPlayers: 500,
                    uptime: 99.9,
                    lastUpdate: new Date().toISOString()
                }));
                console.log('Server stats initialized');
            }

            // Initialize sample data if database is empty
            this.initSampleData();
            
            console.log('Database initialization completed successfully');
        } catch (error) {
            console.error('Error initializing database:', error);
            // Fallback: try to clear and reinitialize
            this.clearAllData();
            this.init();
        }
    }

    // Initialize sample data for demonstration
    initSampleData() {
        const users = this.getUsers();
        
        // Only add sample data if no users exist at all
        if (users.length === 0) {
            console.log('Initializing sample data...');
            
            // Add main admin user
            this.createUser({
                username: 'admin',
                email: 'admin@surfnetwork.com',
                password: 'admin123456', // In real app, this would be hashed
                role: 'admin',
                rank: 'OWNER',
                coins: 999999,
                joinDate: new Date('2025-01-01').toISOString()
            });

            // Add sample regular user
            this.createUser({
                username: 'testuser',
                email: 'test@example.com',
                password: 'test123',
                role: 'user',
                rank: 'VIP',
                coins: 1500,
                joinDate: new Date('2025-06-15').toISOString()
            });

            // Add sample moderator
            this.createUser({
                username: 'moderator1',
                email: 'mod@surfnetwork.com',
                password: 'mod123456',
                role: 'moderator',
                rank: 'MODERATOR',
                coins: 50000,
                joinDate: new Date('2025-02-01').toISOString()
            });

            // Add sample purchases for demonstration
            const adminUser = this.getUserByEmail('admin@surfnetwork.com');
            const testUser = this.getUserByEmail('test@example.com');
            
            if (adminUser) {
                this.createPurchase({
                    userId: adminUser.id,
                    itemName: 'VIP Rank',
                    itemType: 'rank',
                    price: 9.99
                });
                this.createPurchase({
                    userId: adminUser.id,
                    itemName: '1000 Coins',
                    itemType: 'currency',
                    price: 4.99
                });
            }

            if (testUser) {
                this.createPurchase({
                    userId: testUser.id,
                    itemName: 'VIP Rank',
                    itemType: 'rank',
                    price: 9.99
                });
            }

            // Add sample contact messages
            this.createContactMessage({
                name: 'John Doe',
                email: 'john@example.com',
                subject: 'Server Issue',
                message: 'I am experiencing lag on the server. Can you help?'
            });

            this.createContactMessage({
                name: 'Jane Smith',
                email: 'jane@example.com',
                subject: 'Feature Request',
                message: 'Can you add more custom items to the store?'
            });
            
            console.log('Sample data initialized successfully');
        } else {
            console.log('Database already contains data, skipping sample data initialization');
        }
    }

    // User Management
    createUser(userData) {
        try {
            const users = this.getUsers();
            
            // Check if user already exists
            const existingUser = users.find(user => 
                user.email === userData.email || user.username === userData.username
            );
            
            if (existingUser) {
                console.warn('User already exists:', userData.email);
                return existingUser;
            }
            
            const newUser = {
                id: Date.now() + Math.random(), // More unique ID generation
                username: userData.username,
                email: userData.email,
                password: userData.password, // In real app, hash this
                role: userData.role || 'user',
                rank: userData.rank || 'DEFAULT',
                coins: userData.coins || 0,
                joinDate: userData.joinDate || new Date().toISOString(),
                lastLogin: new Date().toISOString(),
                isActive: true,
                firstName: userData.firstName || '',
                lastName: userData.lastName || '',
                bio: userData.bio || '',
                country: userData.country || '',
                timezone: userData.timezone || '',
                settings: userData.settings || {}
            };

            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));
            
            console.log('User created successfully:', newUser.username);
            return newUser;
        } catch (error) {
            console.error('Error creating user:', error);
            return null;
        }
    }

    getUsers() {
        try {
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            console.log('Retrieved users:', users.length);
            return users;
        } catch (error) {
            console.error('Error retrieving users:', error);
            return [];
        }
    }

    getUserById(id) {
        const users = this.getUsers();
        return users.find(user => user.id === id);
    }

    getUserByEmail(email) {
        const users = this.getUsers();
        return users.find(user => user.email === email);
    }

    getUserByUsername(username) {
        const users = this.getUsers();
        return users.find(user => user.username === username);
    }

    updateUser(id, updateData) {
        try {
            const users = this.getUsers();
            const userIndex = users.findIndex(user => user.id === id);
            
            if (userIndex !== -1) {
                // Create updated user object
                const updatedUser = { ...users[userIndex], ...updateData };
                
                // Update the users array
                users[userIndex] = updatedUser;
                
                // Save to localStorage
                localStorage.setItem('users', JSON.stringify(users));
                
                // Verify the save was successful
                const verifyUsers = JSON.parse(localStorage.getItem('users') || '[]');
                const verifyUser = verifyUsers.find(user => user.id === id);
                
                if (!verifyUser) {
                    throw new Error('Failed to verify user update');
                }
                
                console.log('User updated successfully:', updatedUser.username, 'ID:', id);
                console.log('Updated fields:', Object.keys(updateData));
                
                return updatedUser;
            } else {
                console.error('User not found for update:', id);
                return null;
            }
        } catch (error) {
            console.error('Error updating user:', error);
            return null;
        }
    }

    deleteUser(id) {
        const users = this.getUsers();
        const filteredUsers = users.filter(user => user.id !== id);
        localStorage.setItem('users', JSON.stringify(filteredUsers));
        return filteredUsers.length < users.length;
    }

    // Authentication
    authenticateUser(email, password) {
        try {
            const user = this.getUserByEmail(email);
            if (user && user.password === password && user.isActive) {
                // Update last login
                this.updateUser(user.id, { lastLogin: new Date().toISOString() });
                console.log('User authenticated successfully:', user.username);
                return user;
            }
            console.log('Authentication failed for:', email);
            return null;
        } catch (error) {
            console.error('Error during authentication:', error);
            return null;
        }
    }

    // Purchase Management
    createPurchase(purchaseData) {
        const purchases = this.getPurchases();
        const newPurchase = {
            id: Date.now(),
            userId: purchaseData.userId,
            itemName: purchaseData.itemName,
            itemType: purchaseData.itemType || 'unknown',
            price: purchaseData.price,
            currency: purchaseData.currency || 'USD',
            status: purchaseData.status || 'completed',
            purchaseDate: new Date().toISOString(),
            deliveryStatus: purchaseData.deliveryStatus || 'pending'
        };

        purchases.push(newPurchase);
        localStorage.setItem('purchases', JSON.stringify(purchases));
        return newPurchase;
    }

    getPurchases() {
        return JSON.parse(localStorage.getItem('purchases') || '[]');
    }

    getPurchasesByUserId(userId) {
        const purchases = this.getPurchases();
        return purchases.filter(purchase => purchase.userId === userId);
    }

    updatePurchase(id, updateData) {
        const purchases = this.getPurchases();
        const purchaseIndex = purchases.findIndex(purchase => purchase.id === id);
        
        if (purchaseIndex !== -1) {
            purchases[purchaseIndex] = { ...purchases[purchaseIndex], ...updateData };
            localStorage.setItem('purchases', JSON.stringify(purchases));
            return purchases[purchaseIndex];
        }
        return null;
    }

    // Contact Messages
    createContactMessage(messageData) {
        const messages = this.getContactMessages();
        const newMessage = {
            id: Date.now(),
            name: messageData.name,
            email: messageData.email,
            subject: messageData.subject,
            message: messageData.message,
            status: 'unread',
            createdAt: new Date().toISOString(),
            respondedAt: null,
            response: null
        };

        messages.push(newMessage);
        localStorage.setItem('contact_messages', JSON.stringify(messages));
        return newMessage;
    }

    getContactMessages() {
        return JSON.parse(localStorage.getItem('contact_messages') || '[]');
    }

    updateContactMessage(id, updateData) {
        const messages = this.getContactMessages();
        const messageIndex = messages.findIndex(message => message.id === id);
        
        if (messageIndex !== -1) {
            messages[messageIndex] = { ...messages[messageIndex], ...updateData };
            localStorage.setItem('contact_messages', JSON.stringify(messages));
            return messages[messageIndex];
        }
        return null;
    }

    // Server Statistics
    getServerStats() {
        return JSON.parse(localStorage.getItem('server_stats') || '{}');
    }

    updateServerStats(stats) {
        const currentStats = this.getServerStats();
        const updatedStats = { ...currentStats, ...stats, lastUpdate: new Date().toISOString() };
        localStorage.setItem('server_stats', JSON.stringify(updatedStats));
        return updatedStats;
    }

    // Analytics and Reports
    getUserStats() {
        const users = this.getUsers();
        const purchases = this.getPurchases();
        
        return {
            totalUsers: users.length,
            activeUsers: users.filter(user => user.isActive).length,
            totalPurchases: purchases.length,
            totalRevenue: purchases.reduce((sum, purchase) => sum + purchase.price, 0),
            averageSpendPerUser: purchases.length > 0 ? 
                purchases.reduce((sum, purchase) => sum + purchase.price, 0) / users.length : 0
        };
    }

    getTopPurchasers(limit = 10) {
        const purchases = this.getPurchases();
        const users = this.getUsers();
        
        const userSpending = {};
        
        purchases.forEach(purchase => {
            if (!userSpending[purchase.userId]) {
                userSpending[purchase.userId] = 0;
            }
            userSpending[purchase.userId] += purchase.price;
        });

        return Object.entries(userSpending)
            .map(([userId, totalSpent]) => {
                const user = users.find(u => u.id === parseInt(userId));
                return {
                    user: user ? { id: user.id, username: user.username, email: user.email } : null,
                    totalSpent: totalSpent
                };
            })
            .filter(item => item.user !== null)
            .sort((a, b) => b.totalSpent - a.totalSpent)
            .slice(0, limit);
    }

    // Data Export/Import
    exportData() {
        return {
            users: this.getUsers(),
            purchases: this.getPurchases(),
            contactMessages: this.getContactMessages(),
            serverStats: this.getServerStats(),
            exportDate: new Date().toISOString()
        };
    }

    importData(data) {
        if (data.users) localStorage.setItem('users', JSON.stringify(data.users));
        if (data.purchases) localStorage.setItem('purchases', JSON.stringify(data.purchases));
        if (data.contactMessages) localStorage.setItem('contact_messages', JSON.stringify(data.contactMessages));
        if (data.serverStats) localStorage.setItem('server_stats', JSON.stringify(data.serverStats));
    }

    // Database health check
    checkDatabaseHealth() {
        try {
            const users = this.getUsers();
            const purchases = this.getPurchases();
            const messages = this.getContactMessages();
            const stats = this.getServerStats();
            
            console.log('Database Health Check:');
            console.log('- Users:', users.length);
            console.log('- Purchases:', purchases.length);
            console.log('- Messages:', messages.length);
            console.log('- Server Stats:', Object.keys(stats).length);
            
            return {
                healthy: true,
                users: users.length,
                purchases: purchases.length,
                messages: messages.length,
                stats: Object.keys(stats).length
            };
        } catch (error) {
            console.error('Database health check failed:', error);
            return { healthy: false, error: error.message };
        }
    }

    // Backup and restore functionality
    backupDatabase() {
        try {
            const backup = {
                users: this.getUsers(),
                purchases: this.getPurchases(),
                contactMessages: this.getContactMessages(),
                serverStats: this.getServerStats(),
                backupDate: new Date().toISOString()
            };
            
            localStorage.setItem('database_backup', JSON.stringify(backup));
            console.log('Database backup created successfully');
            return backup;
        } catch (error) {
            console.error('Error creating backup:', error);
            return null;
        }
    }

    // Clear all data (for testing/reset)
    clearAllData() {
        try {
            localStorage.removeItem('users');
            localStorage.removeItem('purchases');
            localStorage.removeItem('contact_messages');
            localStorage.removeItem('server_stats');
            localStorage.removeItem('database_backup');
            console.log('All database data cleared');
            this.init();
        } catch (error) {
            console.error('Error clearing database:', error);
        }
    }

    // Search functionality
    searchUsers(query) {
        const users = this.getUsers();
        const lowerQuery = query.toLowerCase();
        
        return users.filter(user => 
            user.username.toLowerCase().includes(lowerQuery) ||
            user.email.toLowerCase().includes(lowerQuery)
        );
    }

    searchPurchases(query) {
        const purchases = this.getPurchases();
        const lowerQuery = query.toLowerCase();
        
        return purchases.filter(purchase => 
            purchase.itemName.toLowerCase().includes(lowerQuery) ||
            purchase.itemType.toLowerCase().includes(lowerQuery)
        );
    }
}

// Create global database instance
const db = new SimpleDatabase();

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SimpleDatabase;
}

// Make available globally in browser
if (typeof window !== 'undefined') {
    window.db = db;
}

// Example usage and testing functions
function testDatabase() {
    console.log('Testing database functionality...');
    
    // Test user creation
    const testUser = db.createUser({
        username: 'testuser2',
        email: 'test2@example.com',
        password: 'password123'
    });
    console.log('Created user:', testUser);
    
    // Test authentication
    const authUser = db.authenticateUser('test2@example.com', 'password123');
    console.log('Authenticated user:', authUser);
    
    // Test purchase creation
    if (authUser) {
        const purchase = db.createPurchase({
            userId: authUser.id,
            itemName: 'VIP Rank',
            itemType: 'rank',
            price: 9.99
        });
        console.log('Created purchase:', purchase);
    }
    
    // Test stats
    console.log('User stats:', db.getUserStats());
    console.log('Server stats:', db.getServerStats());
}

// Database test function
function testDatabasePersistence() {
    console.log('=== DATABASE PERSISTENCE TEST ===');
    
    // Test 1: Check if database exists
    console.log('Test 1: Database initialization');
    const health = db.checkDatabaseHealth();
    console.log('Health check result:', health);
    
    // Test 2: Create a test user
    console.log('Test 2: Creating test user');
    const testUser = db.createUser({
        username: 'persistence_test_user',
        email: 'test@persistence.com',
        password: 'test123',
        role: 'user',
        rank: 'DEFAULT',
        coins: 1000
    });
    console.log('Test user created:', testUser);
    
    // Test 3: Verify user exists
    console.log('Test 3: Verifying user exists');
    const retrievedUser = db.getUserByEmail('test@persistence.com');
    console.log('Retrieved user:', retrievedUser);
    
    // Test 4: Test authentication
    console.log('Test 4: Testing authentication');
    const authResult = db.authenticateUser('test@persistence.com', 'test123');
    console.log('Authentication result:', authResult);
    
    // Test 5: Create backup
    console.log('Test 5: Creating backup');
    const backup = db.backupDatabase();
    console.log('Backup created:', !!backup);
    
    console.log('=== PERSISTENCE TEST COMPLETED ===');
    
    return {
        health: health,
        userCreated: !!testUser,
        userRetrieved: !!retrievedUser,
        authSuccess: !!authResult,
        backupCreated: !!backup
    };
}

// Password persistence test function
function testPasswordPersistence() {
    console.log('=== PASSWORD PERSISTENCE TEST ===');
    
    // Test 1: Create a test user
    console.log('Test 1: Creating test user');
    const testUser = db.createUser({
        username: 'password_test_user',
        email: 'password@test.com',
        password: 'original123',
        role: 'user',
        rank: 'DEFAULT',
        coins: 1000
    });
    
    if (!testUser) {
        console.error('Failed to create test user');
        return false;
    }
    
    console.log('Test user created:', testUser.username);
    
    // Test 2: Authenticate with original password
    console.log('Test 2: Testing original password');
    const auth1 = db.authenticateUser('password@test.com', 'original123');
    if (!auth1) {
        console.error('Original password authentication failed');
        return false;
    }
    console.log('Original password works:', auth1.username);
    
    // Test 3: Change password
    console.log('Test 3: Changing password');
    const updatedUser = db.updateUser(testUser.id, { 
        password: 'newpassword456',
        lastPasswordChange: new Date().toISOString()
    });
    
    if (!updatedUser) {
        console.error('Password update failed');
        return false;
    }
    console.log('Password updated successfully');
    
    // Test 4: Verify old password doesn't work
    console.log('Test 4: Testing old password (should fail)');
    const auth2 = db.authenticateUser('password@test.com', 'original123');
    if (auth2) {
        console.error('Old password still works - this is a problem!');
        return false;
    }
    console.log('Old password correctly rejected');
    
    // Test 5: Verify new password works
    console.log('Test 5: Testing new password');
    const auth3 = db.authenticateUser('password@test.com', 'newpassword456');
    if (!auth3) {
        console.error('New password authentication failed');
        return false;
    }
    console.log('New password works:', auth3.username);
    
    // Test 6: Verify persistence after page reload simulation
    console.log('Test 6: Testing persistence');
    const verifyUser = db.getUserById(testUser.id);
    if (verifyUser.password !== 'newpassword456') {
        console.error('Password not persisted correctly');
        return false;
    }
    console.log('Password persisted correctly');
    
    // Cleanup
    console.log('Cleaning up test user');
    db.deleteUser(testUser.id);
    
    console.log('=== PASSWORD PERSISTENCE TEST PASSED ===');
    return true;
}

// Make test function available globally
if (typeof window !== 'undefined') {
    window.testPasswordPersistence = testPasswordPersistence;
}
// Simple Database Simulation using localStorage
// This simulates a database for the Minecraft server website

class SimpleDatabase {
    constructor() {
        this.init();
    }

    // Initialize database with default data
    init() {
        // Initialize users table if it doesn't exist
        if (!localStorage.getItem('users')) {
            localStorage.setItem('users', JSON.stringify([]));
        }

        // Initialize purchases table if it doesn't exist
        if (!localStorage.getItem('purchases')) {
            localStorage.setItem('purchases', JSON.stringify([]));
        }

        // Initialize contact messages table if it doesn't exist
        if (!localStorage.getItem('contact_messages')) {
            localStorage.setItem('contact_messages', JSON.stringify([]));
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
        }

        // Initialize sample data if database is empty
        this.initSampleData();
    }

    // Initialize sample data for demonstration
    initSampleData() {
        const users = this.getUsers();
        if (users.length === 0) {
            // Add sample admin user
            this.createUser({
                username: 'admin',
                email: 'admin@example.com',
                password: 'admin123', // In real app, this would be hashed
                role: 'admin',
                rank: 'OWNER',
                coins: 50000,
                joinDate: new Date('2024-01-01').toISOString()
            });

            // Add sample regular user
            this.createUser({
                username: 'testuser',
                email: 'test@example.com',
                password: 'test123',
                role: 'user',
                rank: 'VIP',
                coins: 1500,
                joinDate: new Date('2024-06-15').toISOString()
            });
        }
    }

    // User Management
    createUser(userData) {
        const users = this.getUsers();
        const newUser = {
            id: Date.now(),
            username: userData.username,
            email: userData.email,
            password: userData.password, // In real app, hash this
            role: userData.role || 'user',
            rank: userData.rank || 'DEFAULT',
            coins: userData.coins || 0,
            joinDate: userData.joinDate || new Date().toISOString(),
            lastLogin: new Date().toISOString(),
            isActive: true
        };

        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        return newUser;
    }

    getUsers() {
        return JSON.parse(localStorage.getItem('users') || '[]');
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
        const users = this.getUsers();
        const userIndex = users.findIndex(user => user.id === id);
        
        if (userIndex !== -1) {
            users[userIndex] = { ...users[userIndex], ...updateData };
            localStorage.setItem('users', JSON.stringify(users));
            return users[userIndex];
        }
        return null;
    }

    deleteUser(id) {
        const users = this.getUsers();
        const filteredUsers = users.filter(user => user.id !== id);
        localStorage.setItem('users', JSON.stringify(filteredUsers));
        return filteredUsers.length < users.length;
    }

    // Authentication
    authenticateUser(email, password) {
        const user = this.getUserByEmail(email);
        if (user && user.password === password && user.isActive) {
            // Update last login
            this.updateUser(user.id, { lastLogin: new Date().toISOString() });
            return user;
        }
        return null;
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

    // Clear all data (for testing/reset)
    clearAllData() {
        localStorage.removeItem('users');
        localStorage.removeItem('purchases');
        localStorage.removeItem('contact_messages');
        localStorage.removeItem('server_stats');
        this.init();
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

// Uncomment to run tests
// testDatabase();
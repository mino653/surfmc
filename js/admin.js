import {
    getDB,
    getState,
    setState,
    redirect,
    reload
} from './util.js'
import './equery.js'
import {
    showNotification
} from './script.js'

EQuery(function () {
    let allUsers = [];
    let filteredUsers = [];
    let db;

    console.log('Enhanced admin panel loaded');

    // Check if admin is logged in (always require login)
    getDB(async function (state) {
        if (state.adminInstance === undefined) redirect('./admin-login.html');
        else {
            getServerPanelData();
            if (state.adminInstance.probation) {
                showNotification('Your admin account is under probation', 'error');
                setTimeout(() => redirect('./admin-panel-enhanced.html'), 5000);
            }
        }
    });

    EQuery('#logoutBtn').click(() => {
        let state = getState();
        state.adminInstance = null;
        setState(state, () => reload());
    });

    EQuery('#toggleMobileSidebar').click(() => EQuery('#sidebar').toggleClass('hide-small'))
    EQuery('#refreshBtn').click(refreshData);
    EQuery('#createTestUserBtn').click(createTestUser);
    EQuery('#exportBtn').click(exportData);
    EQuery('#backupBtn').click(backupData);
    EQuery('#userSearch').keyup(searchUsers);
    EQuery('#statusFilter').change(filteredUsers);
    EQuery('#rankFilter').change(filteredUsers)
    EQuery('#generateReportBtn').click(generateReport);
    EQuery('#restartServerBtn').click(restartServer);
    EQuery('#backupServerBtn').click(backupServer);
    EQuery('#updateServerBtn').click(updateServer);
    EQuery('#createSampleDataBtn').click(createSampleData);
    EQuery('#exportDataBtn').click(exportData);
    EQuery('#backupDataBtn').click(backupData);
    EQuery('#clearAllDataBtn').click(clearAllData);
    EQuery('#showDashboardSection').click(() => showSection('dashboard'));
    EQuery('#showUsersSection').click(() => showSection('users'));
    EQuery('#showSignupsSection').click(() => showSection('signups'));
    EQuery('#showPurchasesSection').click(() => showSection('purchases'));
    EQuery('#showMessagesSection').click(() => showSection('messages'));
    EQuery('#showAnalyticsSection').click(() => showSection('analytics'));
    EQuery('#showServerSection').click(() => showSection('server'));
    EQuery('#showLogsSection').click(() => showSection('log'));
    EQuery('#showSettingsSection').click(() => showSection('settings'));

    async function getServerPanelData() {
        let requestJSON = {
            'admin_code': getState().adminInstance.id,
            'request_type': 'serverData'
        };

        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let raw = JSON.stringify(requestJSON);
        let requestOptions = {
            method: 'POST',
            headers: headers,
            body: raw,
            redirect: 'follow'
        };

        let response = await (await fetch('https://surfnetwork-api.onrender.com/admin/requests', requestOptions)).json().catch(e => {
            throw new Error(e)
        });

        if (response.detail === undefined) return response;
        else showNotification(`Unable to fetch server data: ${response.detail}`, 'error');

    }

    // Show section
    function showSection(sectionName) {
        EQuery('.content-section').removeClass('active');
        EQuery('.nav-link').removeClass('active');
        EQuery(`#${sectionName}`).addClass('active');
        EQuery(event.target).addClass('active');
        loadSectionData(sectionName);
    }

    // Load section data
    function loadSectionData(sectionName) {
        switch (sectionName) {
            case 'dashboard':
                loadDashboardData();
                break;
            case 'users':
                loadUsers();
                break;
            case 'signups':
                loadRecentSignups();
                break;
            case 'purchases':
                loadPurchases();
                break;
            case 'messages':
                loadMessages();
                break;
            case 'analytics':
                loadAnalytics();
                break;
            case 'server':
                loadServerStatus();
                break;
            case 'logs':
                loadActivityLogs();
                break;
            case 'settings':
                loadSystemInfo();
                break;
        }
    }

    // Load dashboard data
    function loadDashboardData() {
        console.log('Loading dashboard data...');

        if (db === undefined) {
            console.error('Database not available');
            showNotification('Database not available', 'error');
            return;
        }

        try {
            const stats = userStats;
            EQuery('#totalUsers').text(stats.totalUsers);
            EQuery('#onlineUsers').text(stats.activeUsers);
            EQuery('#totalRevenue').text('$' + stats.totalRevenue.toFixed(2));
            EQuery('#totalPurchases').text(stats.totalPurchases);

            console.log('Dashboard stats loaded:', stats);

        } catch (error) {
            console.error('Error loading dashboard data:', error);
            showNotification('Error loading data: ' + error.message, 'error');
        }
    }

    // Load users
    function loadUsers() {
        console.log('Loading users...');

        if (db === undefined) return;

        allUsers = db.users;
        filteredUsers = [...allUsers];

        displayUsers();
    }

    // Display users
    function displayUsers() {
        const tbody = EQuery('#usersTableBody');
        console.log('dispay')
        tbody.removeChildren();

        if (filteredUsers.length === 0) {
            console.log('No users')
            tbody.append(EQuery.elemt('tr', EQuery.ekemt('td', 'No users found', 'text-center py-4', {
                colspan: 7
            })));
            return;
        }

        filteredUsers.forEach(user => {
            const joinDate = new Date(user.joinDate).toLocaleDateString();
            const statusClass = user.isActive ? 'status-online' : 'status-offline';
            const statusText = user.isActive ? 'Online' : 'Offline';

            let btn1 = EQuery.elemt('button', EQuery.elemt('i', 'fas fa-edit'), 'btn-action btn-edit', {
                title: 'Edit user'
            });
            let btn2 = user.isBan ? EQuery.elemt('button', EQuery.elemt('i', 'fas fa-check'), 'btn-action btn-unban', {
                title: 'Unban user'
            }) : EQuery.elemt('button', EQuery.elemt('i', 'fas fa-ban'), 'btn-action btn-ban', {
                title: 'Ban user'
            });
            let btn3 = EQuery.elemt('button', EQuery.elemt('i', 'fas fa-trash'), 'btn-action btn-delete', {
                title: 'Delete user'
            });

            let col1 = EQuery.elemt('td', EQuery.elemt('td', [
                EQuery.elemt('div', [
                    EQuery.elemt('div', ususername.charAt(0).toLowerCase(), 'user-avatar me-3'),
                    EQuery.elemt('div', user.ususername, 'fw-bold'),
                    EQuery.elemt('small', `ID: ${user.id}`, 'text-muted')
                ], 'd-flex align-items-center')
            ]));
            let col2 = EQuery.elemt('td', user.email);
            let col3 = EQuery.elemt('td', EQuery.elemt('spam', user.rank, `rank-badge rank-${user.rank.toLowerCase()}`));
            let col4 = EQuery.elemt('td', user.coins.toLocaleString())
            let col5 = EQuery.elemt('td', statusText, statusClass);
            let col6 = EQuery.elemt('td', joinDate);
            let col7 = EQuery.elemt('td', [btn1, btn2, btn3]);

            let row = EQuery.elemt('tr', [col1, col2, col3, col4, col5, col6, col7])

            btn1.click(() => editUser(user.id));
            btn2.click(() => (user.isBan ? unbanUser : banUser)(user.id));
            btn3.click(() => deleteUser(user.id));

            tbody.append(row);
        });

        console.log('Users displayed:', filteredUsers.length);
    }

    // Search users
    function searchUsers() {
        const searchTerm = EQuery('#userSearch').val().toLowerCase();

        filteredUsers = allUsers.filter(user =>
            user.username.toLowerCase().includes(searchTerm) ||
            user.email.toLowerCase().includes(searchTerm)
        );

        displayUsers();
    }

    // Filter users
    function filterUsers() {
        const statusFilter = EQuery('#statusFilter').val();
        const rankFilter = EQuery('#rankFilter').val();

        filteredUsers = allUsers.filter(user => {
            const statusMatch = statusFilter === 'all' ||
                (statusFilter === 'online' && user.isActive) ||
                (statusFilter === 'offline' && !user.isActive);

            const rankMatch = rankFilter === 'all' || user.rank === rankFilter;

            return statusMatch && rankMatch;
        });

        displayUsers();
    }

    // Load recent signups
    function loadRecentSignups() {
        console.log('Loading recent signups...');

        if (!window.db) return;

        const users = window.db.users
            .sort((a, b) => new Date(b.joinDate) - new Date(a.joinDate))
            .slice(0, 10);

        const container = EQuery('#signupsList');

        if (users.length === 0) {
            container.html('<p class="text-muted">No signups found</p>');
            return;
        }

        users.forEach(user => {
            const joinDate = new Date(user.joinDate).toLocaleDateString();
            const joinTime = new Date(user.joinDate).toLocaleTimeString();

            let btn1 = EQuery.elemt('button', EQuery.elemt('i', 'fas fa-edit'), 'btn-action btn-edit', {
                title: 'Edit user'
            });
            let btn2 = user.isBan ? EQuery.elemt('button', EQuery.elemt('i', 'fas fa-check'), 'btn-action btn-unban', {
                title: 'Unban user'
            }) : EQuery.elemt('button', EQuery.elemt('i', 'fas fa-ban'), 'btn-action btn-ban', {
                title: 'Ban user'
            });

            let userCard = EQuery.elemt('div', [
                EQuery.elemt('div', [
                    EQuery.elemt('div', user.username.charAt(0).toUpperCase(), 'user-avatar, me-3'),
                    EQuery.elemt('div', [
                        EQuery.elemt('h5', user.username),
                        EQuery.elemt('p', [EQuery.elemt('i', null, 'fas fa-envelope me-1'), user.email]),
                        EQuery.elemt('p', [EQuery.elemt('i', null, 'fas fa-envelope me-1')], `Joined: ${joinDate} at ${joinTime}`)
                    ], 'user-info flex-grow-1'),
                    EQuery.elemt('div', [
                        EQuery.elemt('span', user.rank, `rank-badge rank-${user.rank.toLowerCase()}`),
                        EQuery.elemt('div', [btn1, btn2], 'mt-2')
                    ], 'text-end')
                ], 'd-flex align-items-center')
            ], 'user-card');

            container.append(userCard);

            btn1.click(() => editUser(user.id));
            btn2.click(() => (user.isBan ? unbanUser : banUser)(user.id));
        });
        console.log('Recent signups loaded:', users.length);
    }

    // Load purchases
    function loadPurchases() {
        console.log('Loading purchases...');

        if (!window.db) return;

        const purchases = db.purchases.slice(-10).reverse();
        const container = EQuery('#purchasesList');

        if (purchases.length === 0) {
            container.html('<p class="text-muted">No purchases found</p>');
            return;
        }

        purchases.forEach(purchase => {
            const user = getUserById(purchase.userId);
            const purchaseDate = new Date(purchase.purchaseDate).toLocaleDateString();
            const purchaseTime = new Date(purchase.purchaseDate).toLocaleTimeString();

            let purchaseElt = EQuery.elemt('div', [
                EQuery.elemt('div', [
                    EQuery.elemt('div', [
                        EQuery.elemt('h5', purchase.itemName),
                        EQuery.ekemt('p', [EQuery.elemt('i', null, 'fas fa-user me-1'), `by ${user ? user.username : 'Unknown'}`], 'mb-1'),
                        EQuery.elemt('p', [EQuery.elemt('i', null, 'fas fa-calendar me-1'), `${purchaseDate} at ${purchaseTime}`], 'mb-0')
                    ]),
                    EQuery.elemt('div', [
                        EQuery.elemt('div', `$${purchase.price}`, 'fw-bold text-success fs-4'),
                        EQuery.elemt('small', `Transaction ID  ${purchase.id}`)
                    ], 'text-end')
                ], 'd-flex justify-content-between align-items-center')
            ], 'user-card');

            container.append(purchaseElt);
        });
        console.log('Purchases loaded:', purchases.length);
    }

    // Load messages
    function loadMessages() {
        console.log('Loading messages...');

        if (!window.db) return;

        const messages = window.db.getMessages().slice(-10).reverse();
        const container = EQuery('#messagesList');

        if (messages.length === 0) {
            container.html('<p class="text-muted">No messages found</p>');
            return;
        }

        let messagesHTML = '';
        messages.forEach(message => {
            const messageDate = new Date(message.timestamp).toLocaleDateString();
            const messageTime = new Date(message.timestamp).toLocaleTimeString();

            let replyBtn = EQuery.elemt('button', [EQuery.elemt('i', null, 'fas fa-edit'), 'Reply'], 'btn-action bbtn-edit')

            let messageElt = EQuery.elemt('div', [
                EQuery.elemt('div', [
                    EQuery.elemt('h5', message.subject),
                    EQuery.elemt('small', `${messageDate} at ${messageTime}`, 'text-muted')
                ], 'd-flex justify-content-between align-items-start mb-2'),
                EQuery.elemt('p', message.message, 'mb-2'),
                EQuery.elemt('div', [
                    EQuery.elemt('small', [EQuery.elemt('i', null, 'fas fa-envelope me-1'), `From: ${message.email}`], 'text-muted'), replyBtn
                ], 'd-flex justify-content-between align-items-center')
            ], 'user-card');

            replyBtn.click(() => replyToMessage(message.id));

            container.append(messageElt);
        });
        console.log('Messages loaded:', messages.length);
    }

    // Load analytics
    function loadAnalytics() {
        console.log('Loading analytics...');

        if (!window.db) return;

        const users = window.db.getUsers();
        const purchases = window.db.getPurchases();

        // Calculate real growth based on actual data
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();

        // Count users from current month
        const currentMonthUsers = users.filter(user => {
            const userDate = new Date(user.joinDate);
            return userDate.getMonth() === currentMonth && userDate.getFullYear() === currentYear;
        }).length;

        // Count users from previous month
        const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
        const prevMonthUsers = users.filter(user => {
            const userDate = new Date(user.joinDate);
            return userDate.getMonth() === prevMonth && userDate.getFullYear() === prevYear;
        }).length;

        // Calculate user growth percentage
        const userGrowth = prevMonthUsers > 0 ?
            Math.round(((currentMonthUsers - prevMonthUsers) / prevMonthUsers) * 100) :
            currentMonthUsers > 0 ? 100 : 0;

        // Calculate revenue growth
        const currentMonthRevenue = purchases
            .filter(purchase => {
                const purchaseDate = new Date(purchase.purchaseDate);
                return purchaseDate.getMonth() === currentMonth && purchaseDate.getFullYear() === currentYear;
            })
            .reduce((sum, purchase) => sum + purchase.price, 0);

        const prevMonthRevenue = purchases
            .filter(purchase => {
                const purchaseDate = new Date(purchase.purchaseDate);
                return purchaseDate.getMonth() === prevMonth && purchaseDate.getFullYear() === prevYear;
            })
            .reduce((sum, purchase) => sum + purchase.price, 0);

        const revenueGrowth = prevMonthRevenue > 0 ?
            Math.round(((currentMonthRevenue - prevMonthRevenue) / prevMonthRevenue) * 100) :
            currentMonthRevenue > 0 ? 100 : 0;

        EQuery('#userGrowth').text((userGrowth >= 0 ? '+' : '') + userGrowth + '%');
        EQuery('#revenueGrowth').text((revenueGrowth >= 0 ? '+' : '') + revenueGrowth + '%');

        console.log('Analytics loaded - User growth:', userGrowth + '%, Revenue growth:', revenueGrowth + '%');
    }

    // Load server status
    function loadServerStatus() {
        console.log('Loading server status...');

        if (!window.db) return;

        // Get real data from database
        const users = window.db.users;
        const activeUsers = users.filter(user => user.isActive).length;
        const totalUsers = users.length;

        // Calculate uptime based on user activity (simplified)
        const now = new Date();
        const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        const recentUsers = users.filter(user => new Date(user.joinDate) > last24Hours).length;
        const uptime = totalUsers > 0 ? Math.round((activeUsers / totalUsers) * 100) : 0;

        EQuery('#serverUptime').text(uptime + '%');
        EQuery('#playersOnline').text(activeUsers + '/' + totalUsers);

        console.log('Server status loaded - Active users:', activeUsers, 'Total users:', totalUsers);
    }

    // Load activity logs
    function loadActivityLogs() {
        console.log('Loading activity logs...');

        if (!window.db) return;

        const users = window.db.users;
        const purchases = window.db.purchases;
        const logs = [];

        // Generate sample logs
        users.slice(0, 10).forEach(user => {
            logs.push({
                timestamp: new Date().toISOString(),
                type: 'login',
                user: user.username,
                action: 'User Login',
                details: 'Logged in from web interface'
            });
        });

        purchases.slice(0, 5).forEach(purchase => {
            const user = window.db.getUserById(purchase.userId);
            logs.push({
                timestamp: purchase.purchaseDate,
                type: 'purchase',
                user: user ? user.username : 'Unknown',
                action: 'Purchase Made',
                details: `Purchased ${purchase.itemName} for $${purchase.price}`
            });
        });

        // Sort by timestamp (newest first)
        logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        displayLogs(logs);
        console.log('Activity logs loaded:', logs.length);
    }

    // Display logs
    function displayLogs(logs) {
        const tbody = EQuery('#logsTableBody');

        if (logs.length === 0) {
            tbody.html('<tr><td colspan="5" class="text-center py-4">No logs found</td></tr>');
            return;
        }

        logs.forEach(log => {
            const timestamp = new Date(log.timestamp).toLocaleString();
            const typeClass = 'badge bg-' + (log.type === 'error' ? 'danger' : log.type === 'purchase' ? 'success' : 'info');

            let row = EQuery.elemt('tr', [
                EQuery.rlemt('td', timestamp),
                EQuery.rlemt('td', EQuery.elemt('span', log.type.toUpperCase(), 'typeClass')),
                EQuery.rlemt('td', log.user),
                EQuery.rlemt('td', log.action),
                EQuery.rlemt('td', log.details),
            ]);
            tbody.append(row);
        });
    }

    // Filter logs
    function filterLogs() {
        const typeFilter = EQuery('#logTypeFilter').val();
        const dateFilter = EQuery('#logDateFilter').val();

        // This would filter logs based on type and date
        console.log('Filtering logs by type:', typeFilter, 'date:', dateFilter);
        loadActivityLogs(); // Reload for now
    }

    // Export logs
    function exportLogs() {
        const logs = []; // Get current logs
        const blob = new Blob([JSON.stringify(logs, null, 2)], {
            type: 'application/json'
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'activity-logs.json';
        a.click();
        URL.revokeObjectURL(url);
        showNotification('Logs exported', 'success');
    }

    // Generate report
    function generateReport() {
        if (window.db) {
            const data = {
                users: window.db.users,
                purchases: window.db.purchases,
                messages: window.db.messages,
                generatedAt: new Date().toISOString()
            };

            const blob = new Blob([JSON.stringify(data, null, 2)], {
                type: 'application/json'
            });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'admin-report.json';
            a.click();
            URL.revokeObjectURL(url);
            showNotification('Report generated', 'success');
        }
    }

    // Server actions
    async function restartServer() {
        if (confirm('Are you sure you want to restart the server?')) {
            let requestJSON = {
                'admin_code': getState().adminInstance.id,
                'request_type': 'restartServer'
            };

            let headers = new Headers();
            headers.append('Content-Type', 'application/json');
            let raw = JSON.stringify(requestJSON);
            let requestOptions = {
                method: 'POST',
                headers: headers,
                body: raw,
                redirect: 'follow'
            };

            let response = await (await fetch('https://surfnetwork-api.onrender.com/admin/requests', requestOptions)).json().catch(e => {
                throw new Error(e)
            });
            if (response.detail === undefined) showNotification('Server restart initiated...', 'info');
            else showNotification(response.detail, 'error');
           
        }
    }

    async function backupServer() {
        let requestJSON = {
            'admin_code': getState().adminInstance.id,
            'request_type': 'backupServer'
        };

        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let raw = JSON.stringify(requestJSON);
        let requestOptions = {
            method: 'POST',
            headers: headers,
            body: raw,
            redirect: 'follow'
        };

        let response = await (await fetch('https://surfnetwork-api.onrender.com/admin/requests', requestOptions)).json().catch(e => {
            throw new Error(e)
        });
        
        if (response.detail === undefined) showNotification('Server backup started...', 'info');
        else showNotification(response.detail, 'error');
    }

    async function updateServer() {
        if (confirm('Are you sure you want to update the server?')) {
            let requestJSON = {
                'admin_code': getState().adminInstance.id,
                'request_type': 'serverUpdate'
            };

            let headers = new Headers();
            headers.append('Content-Type', 'application/json');
            let raw = JSON.stringify(requestJSON);
            let requestOptions = {
                method: 'POST',
                headers: headers,
                body: raw,
                redirect: 'follow'
            };

            let response = await (await fetch('https://surfnetwork-api.onrender.com/admin/requests', requestOptions)).json().catch(e => {
                throw new Error(e)
            });
            if (response.detail === undefined) showNotification('Server update initiated...', 'info');
            else showNotification(response.detail, 'error');
        }
    }

    // Load system info
    function loadSystemInfo() {
        const adminToken = getState().adminToken;
        const adminData = getState().adminInstance;

        EQuery('#adminTokenStatus').text(adminToken ? 'Valid' : 'Missing');
        EQuery('#databaseStatus').text(window.db ? 'Connected' : 'Disconnected');
        EQuery('#totalUsersInfo').text(window.db ? window.db.users.length : '0');

        const lastBackup = localStorage.getItem('lastBackup');
        EQuery('#lastBackup').text(lastBackup || 'Never');
    }

    // User actions
    async function editUser(userId) {
        const user = getUserById(userId);
        if (user) {
            const newRank = prompt(`Edit rank for ${user.username}:`, user.rank);
            if (newRank && newRank !== user.rank) {
                user.rank = newRank;
                let requestJSON = {
                    'admin_code': getState().adminInstance.id,
                    'user': user,
                    'request_type': 'editUser'
                };

                let headers = new Headers();
                headers.append('Content-Type', 'application/json');
                let raw = JSON.stringify(requestJSON);
                let requestOptions = {
                    method: 'POST',
                    headers: headers,
                    body: raw,
                    redirect: 'follow'
                };

                let response = await (await fetch('https://surfnetwork-api.onrender.com/admin/requests', requestOptions)).json().catch(e => {
                    throw new Error(e)
                });
                
                if (response.detail === undefined) { loadUsers();showNotification(`Updated ${user.username}'s rank to ${newRank}`, 'success');}
                else showNotification(response.detail, 'error');
            }
        }
    }

    async function banUser(userId) {
        const user = window.db.getUserById(userId);
        if (user && confirm(`Ban user ${user.username}?`)) {
            user.isBaned = true;
            let requestJSON = {
                'admin_code': getState().adminInstance.id,
                'user': user,
                'request_type': 'editUser'
            };

            let headers = new Headers();
            headers.append('Content-Type', 'application/json');
            let raw = JSON.stringify(requestJSON);
            let requestOptions = {
                method: 'POST',
                headers: headers,
                body: raw,
                redirect: 'follow'
            };

            let response = await (await fetch('https://surfnetwork-api.onrender.com/admin/requests', requestOptions)).json().catch(e => {
                throw new Error(e)
            });
                
            if (response.detail === undefined) { loadUsers();showNotification(`Banned user ${user.username}`, 'success');}
            else showNotification(response.detail, 'error');
        }
    }

    async function unbanUser(userId) {
        const user = window.db.getUserById(userId);
        if (user && confirm(`Unban user ${user.username}?`)) {
            user.isBaned = false;
            let requestJSON = {
                'admin_code': getState().adminInstance.id,
                'user': user,
                'request_type': 'editUser'
            };

            let headers = new Headers();
            headers.append('Content-Type', 'application/json');
            let raw = JSON.stringify(requestJSON);
            let requestOptions = {
                method: 'POST',
                headers: headers,
                body: raw,
                redirect: 'follow'
            };

            let response = await (await fetch('https://surfnetwork-api.onrender.com/admin/requests', requestOptions)).json().catch(e => {
                throw new Error(e)
            });
                
            if (response.detail === undefined) { loadUsers();showNotification(`Unbanned user ${user.username}`, 'success');}
            else showNotification(response.detail, 'error');
        }
    }

    async function deleteUser(userId) {
        const user = window.db.getUserById(userId);
        if (user && confirm(`Delete user ${user.username}? This cannot be undone!`))             
           user.isBaned = true;
            let requestJSON = {
                'admin_code': getState().adminInstance.id,
                'user_id': user.id,
                'request_type': 'deleteUser'
            };

            let headers = new Headers();
            headers.append('Content-Type', 'application/json');
            let raw = JSON.stringify(requestJSON);
            let requestOptions = {
                method: 'POST',
                headers: headers,
                body: raw,
                redirect: 'follow'
            };

            let response = await (await fetch('https://surfnetwork-api.onrender.com/admin/requests', requestOptions)).json().catch(e => {
                throw new Error(e)
            });
                
            if (response.detail === undefined) { loadUsers();showNotification(`Deleted user ${user.username}`, 'success');}
            else showNotification(response.detail, 'error');
        }

    function replyToMessage(messageId) {
        const message = getMessageById(messageId);
        if (message) {
            const reply = prompt(`Reply to ${message.email}:`);
            if (reply) {
                showNotification(`Reply sent to ${message.email}`, 'success');
            }
        }
    }

    // Quick actions
    function refreshData() {
        loadDashboardData();
        showNotification('Data refreshed', 'success');
    }

    function createTestUser() {
        showNotification('Test user creation disabled - use real user registration instead', 'info');
    }

    function exportData() {
        if (window.db) {
            const data = window.db.exportData();
            const blob = new Blob([JSON.stringify(data, null, 2)], {
                type: 'application/json'
            });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'surfnetwork-data.json';
            a.click();
            URL.revokeObjectURL(url);
            showNotification('Data exported', 'success');
        }
    }

    function backupData() {
        if (window.db) {
            const data = exportData(window.db);
            localStorage.setItem('surfnetwork_backup_' + Date.now(), JSON.stringify(data));
            localStorage.setItem('lastBackup', new Date().toISOString());
            showNotification('Data backed up', 'success');
        }
    }

    function createSampleData() {
        if (window.db) {
            initSampleData(window.db);
            loadUsers();
            showNotification('Sample data created', 'success');
        }
    }

    async function clearAllData() {
        if (confirm('Are you sure you want to clear ALL data? This cannot be undone!')) {
            let requestJSON = {
                'admin_code': getState().adminInstance.id,
                'request_type': 'clearData'
            };

            let headers = new Headers();
            headers.append('Content-Type', 'application/json');
            let raw = JSON.stringify(requestJSON);
            let requestOptions = {
                method: 'POST',
                headers: headers,
                body: raw,
                redirect: 'follow'
            };

            let response = await (await fetch('https://surfnetwork-api.onrender.com/admin/requests', requestOptions)).json().catch(e => {
                throw new Error(e)
            });
            
            if (response.detail === undefined) { showNotification('All data cleared', 'success');reload(); }
            else showNotification(response.detail, 'error');
        }
    }
});
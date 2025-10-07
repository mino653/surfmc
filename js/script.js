import {
    getDB,
    getState,
    setState,
    redirect
} from './util.js';
import './equery.js';

EQuery(async function () {
    let userdata;
    getDB(state => {
        if (state.userdata !== undefined) {
            const loginLink = EQuery('#loginNavLink');
            userdata = state.userdata;
            loginLink.removeChildren()
                .removeAttr('href')
                .click(showUserMenu)
                .append([EQuery.elemt('i', null, 'fas fa-user me-2'), userdata.username]);
        }
        loadTheme()
    });

    const ipRevealBtn = EQuery('#ipRevealBtn');
    const ipDisplay = EQuery('#ipDisplay');
    const themeIcon = EQuery('#themeIcon');

    function showUserMenu(e) {
        e.preventDefault();
        // Create dropdown menu for user options
        const existingMenu = EQuery('.user-menu');
        if (existingMenu[0]) {
            existingMenu.remove();
            return;
        }

        const btn1 = EQuery.elemt('a', [
            EQuery.elemt('i', null, 'fas fa-user me-2'), 'Profile'
        ], 'd-block text-decoration-none text-dark py-2');
        const btn2 = EQuery.elemt('a', [
            EQuery.elemt('i', null, 'fas fa-shopping-bag me-2'), 'My Purchases'
        ], 'd-block text-decoration-none text-dark py-2');
        const btn3 = EQuery.elemt('a', [
            EQuery.elemt('i', null, 'fas fa-sign-out-alt me-2'), 'Logout'
        ], 'd-block text-decoration-none text-dark py-2');

        btn1.click(() => redirect('./profile.html'));
        // btn2.click(() => redirect('./profile.html')); IDK
        btn3.click(() => redirect('./logout.html'));

        const menu = EQuery.elemt('div', [
            EQuery.elemt('div', [
                EQuery.elemt('div', [
                    EQuery.elemt('i', null, 'fas fa-user text-white')
                ], 'avatar bg-primary rounded-circle d-flex align-items-center justify-content-center me-3', null, 'width: 40px;height: 40px'),
                EQuery.elemt('div'[
                    EQuery.elemt('div', userdata.username, 'fw-bold'),
                    EQuery.elemt('small', userdata.email, 'text-muted')
                ])
            ], 'd-flex align-items-center mb-3'),
            EQuery.elemt('hr'),
            btn1, btn2, btn3
        ], 'user-menu position-absolute bg-white border rounded shadow-lg p-3', null, 'top: 100%; right: 0; min-width: 200px; z-index: 1000;');

        const navbar = EQuery('.navbar-nav');
        const loginItem = navbar.find('li:last-child');
        loginItem.css('position: relative')
        loginItem.append(menu);

        // Close menu when clicking outside
        setTimeout(() => {
            EQuery(document).click(function closeMenu(e) {
                if (!menu[0].contains(e.target)) {
                    menu.remove();
                    EQuery(document).off('click')
                }
            });
        }, 100);
    }

    getStats();
    setInterval(getStats, 5000);

    async function getStats() {
        let response = await (await fetch('https://surfnetwork-api.onrender.com/get-server-stats', { method: 'post' }).catch(function () {
            EQuery('#ip').text('Unavaliable');
            EQuery('#serverStatus').addClass('bg-fail').text('Offline');
            EQuery('#playersCount').text('0/0 Players');
            EQuery('#serverVersion').text('Unavaliable');
            EQuery('#serverUptime').text('Offline');
            EQuery('#totalPlayers').text('Unavaliable');
            EQuery('#playerCount').text(0);
            EQuery('#playersAvg').text(0);
        })).json().catch(function (e) {
            throw new Error(e);
        });

        EQuery('#ip').text(response.ip);
        EQuery('#serverStatus').addClass(response.status.online ? 'bg-success' : 'bg-fail').text(response.status.online ? 'Online' : 'Offline');
        EQuery('#playersCount').text(response.status.count + '/' + response.max + ' Players');
        EQuery('#serverVersion').text(response.status.version);
        EQuery('#serverUptime').text(response.status.uptime);
        EQuery('#totalPlayers').text(response.status.total);
        EQuery('#playerCount').text(response.status.count);
        EQuery('#playersAvg').text(response.status.average);
    }

    ipRevealBtn.click(async function () {
        let spinner = EQuery(this.parentElement).spinner();
        ipRevealBtn.hide();
        this.disabled = true;

        let response = await (await fetch('https://surfnetwork-api.onrender.com/get-server-ip', { method: 'post' })).json().catch(function (e) {
            throw new Error(e);
        });

        ipDisplay.find('.ip-text').text(response.ip);

        spinner.find('.e-spinner').remove();
        ipDisplay.removeClass('d-none');

        const copyBtn = ipDisplay.find('button');
        if (copyBtn) {
            copyBtn.click(copyIP);
        }
    });

    themeIcon.click(toggleTheme);

    // Smooth scroll for anchor links
    EQuery(document).click(function (e) {
        if (e.target.matches('a[href^="#"]')) {
            e.preventDefault();
            const target = EQuery(`[href=\'${e.target.getAttribute('href')}\']`)[0];
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });

    // Initialize server status
    updateServerStatus();

    // Initialize navbar scroll effect
    initializeNavbarScroll();

    // Initialize particle effect
    initializeParticleEffect();


    // Smooth scroll for anchor links
    EQuery(document).click(function (e) {
        if (e.target.matches('a[href^="#"]')) {
            e.preventDefault();
            const target = EQuery(`[href=\'${e.target.getAttribute('href')}\']`)[0];
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });

    // Initialize Navbar Scroll Effect
    function initializeNavbarScroll() {
        const navbar = EQuery('.navbar');
        window.addEventListener('scroll',
            () => {
                if (window.scrollY > 50) {
                    navbar.addClass('scrolled');
                } else {
                    navbar.removeClass('scrolled');
                }
            });

    }

    // Initialize Particle Effect (for hero section)
    function initializeParticleEffect() {
        const heroSection = EQuery('.hero-section');
        createParticles(heroSection);
    }

    // Create Particles
    function createParticles(container) {
        const particleCount = 50;

        for (let i = 0; i < particleCount; i++) {
            const animationStyle = i % 2 == 0 ? 'linear' : i % 3 == 0 ? 'ease-in' : 'ease-out'
            const particle = EQuery.elemt('div', null, 'particle', null, `position: absolute;width: 8px;height: 8px;background: rgba(255, 255, 255, 0.5);pointer-events: none;animation: float ${Math.random() * 3 + 2}s infinite ${animationStyle};left: ${Math.random() * 100}%;top: ${Math.random() * 100}%;animation-delay: ${Math.random() * 2}s;`);
            container.append(particle);
        }

        // Add particle animation CSS
        if (!EQuery('#particle-styles')[0]) {
            const style = EQuery.elemt('style', `@keyframes float {0%, 100% {transform: translateY(0px) rotate(0deg);opacity: 0.8;}50% {transform: translateY(-40px) rotate(180deg);opacity: 0.5;}}`, null, {
                id: 'particle-styles'
            });
            EQuery('head').append(style);
        }
    }

    // Mobile menu toggle
    function toggleMobileMenu() {
        EQuery('.navbar-collapse').toggleClass('show');
    }

    // Initialize tooltips (if using Bootstrap tooltips)
    function initializeTooltips() {
        const tooltipTriggerList = [].slice.call(EQuery('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
    }

    // Error handling for images
    document.addEventListener('error', function (e) {
        if (e.target.tagName === 'IMG') {
            e.target.src = 'https://via.placeholder.com/400x300/667eea/ffffff?text=Image+Not+Found';
        }
    });
});

// Performance optimization: Lazy loading for images
function initializeLazyLoading() {
    const images = EQuery('img[data-src]');
    const imageObserver = new IntersectionObserver((entries,
        observer) => {
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

function copyIP() {
    const ipText = EQuery('.ip-text').text();
    navigator.clipboard.writeText(ipText).then(() => {
        showNotification('IP copied to clipboard!',
            'success');
    }).catch(() => {
        // Fallback for older browsers
        const textArea = EQuery.elemt('textarea');
        textArea.val(ipText);
        EQuery('body').append(textArea);
        textAream[0].select();
        document.execCommand('copy');
        textArea.remove()
        showNotification('IP copied to clipboard!',
            'success');
    });
}

// Show Notification
function showNotification(message, type = 'info') {
    const notification = EQuery.elemt('div', [
        EQuery.elemt('div',
            [
                EQuery.elemt('i', null, `fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'} me-2`),
                message
            ],
            'd-flex align-items-center')
    ], `alert alert-${type} alert-custom position-fixed`, null, 'top: 100px; right: 20px; z-index: 9999; min-width: 300px;')

    EQuery('body').append(notification);

    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.css('opacity: 0');
        setTimeout(() => notification.remove(),
            300);
    }, 3000);
}

// Update Server Status
async function updateServerStatus() {
    const playerCountElement = document.getElementById('playerCount');
    if (playerCountElement) {
        setInterval(async function () {
            let response = await (await fetch('https://surfnetwork-api.onrender.com/player-count', { method: 'post' })).json().catch(function (e) {
                throw new Error(e);
            });
            const currentCount = response.status.count;
            const maxCount = response.status.max;
            playerCountElement.textContent = `${currentCount}/${maxCount} Players`;
        }, 5000);
    }
}



function loadTheme() {
    const savedTheme = getState().theme || 'light';
    EQuery(document.documentElement).attr({
        'data-theme': savedTheme
    });

    // Update theme icon
    const themeIcon = EQuery('#themeIcon').find('i');
    themeIcon.attr({
        class: savedTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon'
    });
}

function toggleTheme() {
    const state = getState();
    const currentTheme = EQuery(document.documentElement).getAttr('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    EQuery(document.documentElement).attr({
        'data-theme': newTheme
    });

    // Update theme icon
    const themeIcon = EQuery('#themeIcon').find('i');
    themeIcon.attr({
        class: newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon'
    });
    state.theme = newTheme;
    setState(state);
}

export {
    showNotification,
    updateServerStatus,
    loadTheme,
    toggleTheme
}
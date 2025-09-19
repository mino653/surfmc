// Email Service Simulation
// This simulates sending emails to users for various events

class EmailService {
    constructor() {
        this.emailQueue = [];
        this.sentEmails = this.loadSentEmails();
        this.templates = this.initializeTemplates();
    }

    // Load sent emails from localStorage
    loadSentEmails() {
        return JSON.parse(localStorage.getItem('sentEmails') || '[]');
    }

    // Save sent emails to localStorage
    saveSentEmails() {
        localStorage.setItem('sentEmails', JSON.stringify(this.sentEmails));
    }

    // Initialize email templates
    initializeTemplates() {
        return {
            login: {
                subject: '🎮 Login Alert - Surfnetwork',
                template: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8f9fa; padding: 20px;">
                        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                            <h1 style="color: white; margin: 0; font-size: 24px;">🎮 Surfnetwork</h1>
                            <p style="color: #e0e0e0; margin: 10px 0 0 0;">Login Notification</p>
                        </div>
                        <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 5px 15px rgba(0,0,0,0.1);">
                            <h2 style="color: #333; margin-bottom: 20px;">Hello {{username}}! 👋</h2>
                            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
                                We noticed you just logged into your Surfnetwork account. Here are the details:
                            </p>
                            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                                <p style="margin: 5px 0; color: #333;"><strong>🕒 Time:</strong> {{loginTime}}</p>
                                <p style="margin: 5px 0; color: #333;"><strong>🌐 Browser:</strong> {{browser}}</p>
                                <p style="margin: 5px 0; color: #333;"><strong>📱 Device:</strong> {{device}}</p>
                                <p style="margin: 5px 0; color: #333;"><strong>🔗 IP Address:</strong> {{ipAddress}}</p>
                            </div>
                            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
                                If this wasn't you, please change your password immediately and contact our support team.
                            </p>
                            <div style="text-align: center; margin: 30px 0;">
                                <a href="#" style="background: #4CAF50; color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: bold;">
                                    🛡️ Secure My Account
                                </a>
                            </div>
                            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
                            <p style="color: #999; font-size: 14px; text-align: center;">
                                This is an automated security notification from Surfnetwork.<br>
                                If you have questions, contact us at support@minecraftserver.com
                            </p>
                        </div>
                    </div>
                `
            },
            welcome: {
                subject: '🎉 Welcome to Surfnetwork!',
                template: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8f9fa; padding: 20px;">
                        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                            <h1 style="color: white; margin: 0; font-size: 24px;">🎮 Surfnetwork</h1>
                            <p style="color: #e0e0e0; margin: 10px 0 0 0;">Welcome to the Adventure!</p>
                        </div>
                        <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 5px 15px rgba(0,0,0,0.1);">
                            <h2 style="color: #333; margin-bottom: 20px;">Welcome {{username}}! 🎉</h2>
                            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
                                Thank you for joining our Surfnetwork community! Your account has been successfully created and you're ready to start your adventure.
                            </p>
                            <div style="background: #f0f8ff; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #4CAF50;">
                                <h3 style="color: #333; margin-bottom: 15px;">🚀 Getting Started:</h3>
                                <ul style="color: #666; line-height: 1.8; padding-left: 20px;">
                                    <li>Connect to our server: <strong>play.yourserver.com</strong></li>
                                    <li>Check out our <a href="#" style="color: #4CAF50;">getting started guide</a></li>
                                    <li>Join our <a href="#" style="color: #4CAF50;">Discord community</a></li>
                                    <li>Visit our <a href="#" style="color: #4CAF50;">store</a> for exclusive items</li>
                                </ul>
                            </div>
                            <div style="text-align: center; margin: 30px 0;">
                                <a href="#" style="background: #4CAF50; color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: bold; margin-right: 10px;">
                                    🎮 Start Playing
                                </a>
                                <a href="#" style="background: #2196F3; color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: bold;">
                                    💬 Join Discord
                                </a>
                            </div>
                            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
                            <p style="color: #999; font-size: 14px; text-align: center;">
                                Need help? Check out our <a href="#" style="color: #4CAF50;">help center</a> or contact support.<br>
                                Happy crafting! 🏗️
                            </p>
                        </div>
                    </div>
                `
            },
            purchase: {
                subject: '🛒 Purchase Confirmation - Surfnetwork',
                template: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8f9fa; padding: 20px;">
                        <div style="background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                            <h1 style="color: white; margin: 0; font-size: 24px;">🎮 Surfnetwork</h1>
                            <p style="color: #e8f5e8; margin: 10px 0 0 0;">Purchase Confirmation</p>
                        </div>
                        <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 5px 15px rgba(0,0,0,0.1);">
                            <h2 style="color: #333; margin-bottom: 20px;">Thank you {{username}}! 🎉</h2>
                            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
                                Your purchase has been completed successfully. Here are your order details:
                            </p>
                            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                                <h3 style="color: #333; margin-bottom: 15px;">📦 Order Details:</h3>
                                <p style="margin: 5px 0; color: #333;"><strong>Item:</strong> {{itemName}}</p>
                                <p style="margin: 5px 0; color: #333;"><strong>Price:</strong> ${{price}}</p>
                                <p style="margin: 5px 0; color: #333;"><strong>Order ID:</strong> {{orderId}}</p>
                                <p style="margin: 5px 0; color: #333;"><strong>Date:</strong> {{purchaseDate}}</p>
                            </div>
                            <div style="background: #e8f5e8; padding: 15px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #4CAF50;">
                                <p style="color: #2e7d32; margin: 0; font-weight: bold;">
                                    ✅ Your items have been automatically added to your account!
                                </p>
                            </div>
                            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
                                You can now enjoy your new items in-game. If you have any issues, please contact our support team.
                            </p>
                            <div style="text-align: center; margin: 30px 0;">
                                <a href="#" style="background: #4CAF50; color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: bold;">
                                    🎮 Play Now
                                </a>
                            </div>
                            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
                            <p style="color: #999; font-size: 14px; text-align: center;">
                                Questions about your purchase? Contact us at support@minecraftserver.com<br>
                                Thank you for supporting our server! 💚
                            </p>
                        </div>
                    </div>
                `
            },
            passwordChange: {
                subject: '🔐 Password Changed - Surfnetwork',
                template: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8f9fa; padding: 20px;">
                        <div style="background: linear-gradient(135deg, #FF9800 0%, #F57C00 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                            <h1 style="color: white; margin: 0; font-size: 24px;">🎮 Surfnetwork</h1>
                            <p style="color: #fff3e0; margin: 10px 0 0 0;">Security Alert</p>
                        </div>
                        <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 5px 15px rgba(0,0,0,0.1);">
                            <h2 style="color: #333; margin-bottom: 20px;">Password Changed {{username}} 🔐</h2>
                            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
                                Your account password has been successfully changed. Here are the details:
                            </p>
                            <div style="background: #fff3e0; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #FF9800;">
                                <p style="margin: 5px 0; color: #333;"><strong>🕒 Time:</strong> {{changeTime}}</p>
                                <p style="margin: 5px 0; color: #333;"><strong>🌐 Browser:</strong> {{browser}}</p>
                                <p style="margin: 5px 0; color: #333;"><strong>📱 Device:</strong> {{device}}</p>
                            </div>
                            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
                                If you didn't make this change, please contact our support team immediately.
                            </p>
                            <div style="text-align: center; margin: 30px 0;">
                                <a href="#" style="background: #FF9800; color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: bold;">
                                    🛡️ Contact Support
                                </a>
                            </div>
                            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
                            <p style="color: #999; font-size: 14px; text-align: center;">
                                This is an automated security notification from Surfnetwork.<br>
                                Keep your account secure! 🔒
                            </p>
                        </div>
                    </div>
                `
            }
        };
    }

    // Send email (simulation)
    async sendEmail(to, templateName, data = {}) {
        try {
            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            const template = this.templates[templateName];
            if (!template) {
                throw new Error(`Template ${templateName} not found`);
            }

            // Replace template variables
            let subject = template.subject;
            let htmlContent = template.template;

            Object.keys(data).forEach(key => {
                const regex = new RegExp(`{{${key}}}`, 'g');
                subject = subject.replace(regex, data[key]);
                htmlContent = htmlContent.replace(regex, data[key]);
            });

            // Create email record
            const email = {
                id: Date.now(),
                to: to,
                subject: subject,
                htmlContent: htmlContent,
                templateName: templateName,
                data: data,
                sentAt: new Date().toISOString(),
                status: 'sent'
            };

            // Add to sent emails
            this.sentEmails.unshift(email);
            this.saveSentEmails();

            // Show notification to user (simulating email sent)
            this.showEmailNotification(email);

            console.log(`📧 Email sent to ${to}: ${subject}`);
            return email;

        } catch (error) {
            console.error('Failed to send email:', error);
            throw error;
        }
    }

    // Show email notification to user (simulates receiving email)
    showEmailNotification(email) {
        // Create a notification that shows the email was sent
        const notification = document.createElement('div');
        notification.className = 'email-notification';
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #4CAF50, #45a049);
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            z-index: 10000;
            max-width: 350px;
            animation: slideInRight 0.5s ease;
        `;

        notification.innerHTML = `
            <div style="display: flex; align-items: center; margin-bottom: 8px;">
                <i class="fas fa-envelope" style="margin-right: 8px;"></i>
                <strong>Email Sent!</strong>
                <button onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; color: white; margin-left: auto; cursor: pointer; font-size: 16px;">×</button>
            </div>
            <div style="font-size: 14px; opacity: 0.9;">
                📧 ${email.subject}
            </div>
            <div style="font-size: 12px; opacity: 0.8; margin-top: 5px;">
                Sent to: ${email.to}
            </div>
        `;

        document.body.appendChild(notification);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.style.animation = 'slideOutRight 0.5s ease';
                setTimeout(() => notification.remove(), 500);
            }
        }, 5000);

        // Add CSS animation if not already added
        if (!document.querySelector('#email-notification-styles')) {
            const style = document.createElement('style');
            style.id = 'email-notification-styles';
            style.textContent = `
                @keyframes slideInRight {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                @keyframes slideOutRight {
                    from {
                        transform: translateX(0);
                        opacity: 1;
                    }
                    to {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    // Send login notification email
    async sendLoginNotification(user) {
        const loginData = {
            username: user.username,
            loginTime: new Date().toLocaleString(),
            browser: this.getBrowserInfo(),
            device: this.getDeviceInfo(),
            ipAddress: await this.getIPAddress()
        };

        return await this.sendEmail(user.email, 'login', loginData);
    }

    // Send welcome email
    async sendWelcomeEmail(user) {
        const welcomeData = {
            username: user.username
        };

        return await this.sendEmail(user.email, 'welcome', welcomeData);
    }

    // Send purchase confirmation email
    async sendPurchaseConfirmation(user, purchase) {
        const purchaseData = {
            username: user.username,
            itemName: purchase.itemName,
            price: purchase.price,
            orderId: purchase.id,
            purchaseDate: new Date(purchase.purchaseDate).toLocaleString()
        };

        return await this.sendEmail(user.email, 'purchase', purchaseData);
    }

    // Send password change notification
    async sendPasswordChangeNotification(user) {
        const changeData = {
            username: user.username,
            changeTime: new Date().toLocaleString(),
            browser: this.getBrowserInfo(),
            device: this.getDeviceInfo()
        };

        return await this.sendEmail(user.email, 'passwordChange', changeData);
    }

    // Get browser information
    getBrowserInfo() {
        const userAgent = navigator.userAgent;
        if (userAgent.includes('Chrome')) return 'Google Chrome';
        if (userAgent.includes('Firefox')) return 'Mozilla Firefox';
        if (userAgent.includes('Safari')) return 'Safari';
        if (userAgent.includes('Edge')) return 'Microsoft Edge';
        return 'Unknown Browser';
    }

    // Get device information
    getDeviceInfo() {
        const userAgent = navigator.userAgent;
        if (/Mobile|Android|iPhone|iPad/.test(userAgent)) return 'Mobile Device';
        if (/Tablet/.test(userAgent)) return 'Tablet';
        return 'Desktop Computer';
    }

    // Get IP address (simulated)
    async getIPAddress() {
        // In a real application, you would get this from the server
        return '192.168.1.1 (simulated)';
    }

    // Get sent emails for admin view
    getSentEmails(limit = 50) {
        return this.sentEmails.slice(0, limit);
    }

    // Clear sent emails (for testing)
    clearSentEmails() {
        this.sentEmails = [];
        localStorage.removeItem('sentEmails');
    }
}

// Create global email service instance
const emailService = new EmailService();

// Make available globally in browser
if (typeof window !== 'undefined') {
    window.emailService = emailService;
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EmailService;
}
# Surfnetwork Website

A modern, responsive website for a Surfnetwork server featuring user authentication, store functionality, and comprehensive server information.

## Features

### 🏠 Homepage
- **Hero Section** with animated background and server status
- **IP Reveal Button** - Click to show the server IP address with copy functionality
- **Server Statistics** - Real-time player count and server status
- **Feature Cards** showcasing server benefits
- **Particle Effects** for visual appeal

### 🔐 Authentication System
- **Login/Signup Forms** with real-time validation
- **User Management** with localStorage database simulation
- **Password Visibility Toggle**
- **Remember Me** functionality
- **User Profile** with purchase history

### 📰 Updates Page
- **Server Changelog** with detailed update information
- **Sidebar** with server status, quick links, and upcoming events
- **Newsletter Signup** functionality
- **Server Statistics** display

### ❓ Help Center
- **Getting Started Guide** - Step-by-step instructions
- **Command Reference** - Essential and advanced server commands
- **FAQ Section** with collapsible answers
- **Contact Support** - Multiple support channels
- **Contact Form** with subject categorization

### 🛒 Store
- **Server Ranks** - VIP, MVP, ELITE with detailed features
- **Cosmetics & Items** - Pets, trails, chat colors, wings
- **Special Bundles** - Discounted package deals
- **In-Game Currency** - Coin packages
- **Payment Information** - Accepted methods and policies

### 💾 Database System
- **User Management** - Registration, authentication, profiles
- **Purchase Tracking** - Complete transaction history
- **Contact Messages** - Support ticket system
- **Server Statistics** - Analytics and reporting
- **Data Export/Import** functionality

## Technologies Used

- **HTML5** - Semantic markup structure
- **CSS3** - Modern styling with animations and responsive design
- **JavaScript (ES6+)** - Interactive functionality and API simulation
- **Bootstrap 5** - Responsive framework and components
- **Font Awesome 6** - Icons and visual elements
- **Google Fonts** - Typography (Press Start 2P, Roboto)
- **LocalStorage** - Client-side data persistence

## File Structure

```
minecraft-server-website/
│
├── index.html          # Homepage
├── login.html          # Login/Signup page
├── updates.html        # Server updates and news
├── help.html           # Help center and FAQ
├── store.html          # Server store and purchases
│
├── styles.css          # Main stylesheet
├── script.js           # Main JavaScript functionality
├── database.js         # Database simulation system
│
├── testing.html        # Original file (can be removed)
└── README.md           # This file
```

## Setup Instructions

1. **Download Files**: Clone or download all files to your web server directory
2. **Open Website**: Navigate to `index.html` in your web browser
3. **No Installation Required**: The website runs entirely in the browser

## Usage Guide

### For Users

1. **Visit Homepage**: Start at `index.html` to see server information
2. **Reveal Server IP**: Click the "Click to Reveal Server IP" button
3. **Create Account**: Go to Login page and click "Create Account"
4. **Browse Store**: Visit the store to see available purchases
5. **Get Help**: Use the help section for guides and support

### For Administrators

1. **Default Admin Account**:
   - Email: `admin@example.com`
   - Password: `admin123`

2. **Test User Account**:
   - Email: `test@example.com`
   - Password: `test123`

3. **Database Management**: Access browser console and use `window.db` object

## Customization

### Server Information
- Update server IP in `index.html` and `help.html`
- Modify server statistics in `database.js`
- Change server name throughout all files

### Styling
- Edit `styles.css` for visual customization
- Update CSS variables in `:root` for color scheme
- Modify Bootstrap classes for layout changes

### Content
- Update server rules in `help.html`
- Modify store items and prices in `store.html`
- Change update content in `updates.html`

### Database
- Modify `database.js` for different data structure
- Add new tables or fields as needed
- Implement real backend integration

## Browser Compatibility

- **Chrome**: ✅ Full support
- **Firefox**: ✅ Full support
- **Safari**: ✅ Full support
- **Edge**: ✅ Full support
- **Mobile**: ✅ Responsive design

## Security Notes

⚠️ **Important**: This is a demonstration website using localStorage for data persistence. For production use:

1. **Implement Real Database**: Use MySQL, PostgreSQL, or MongoDB
2. **Add Server-Side Authentication**: Use Node.js, PHP, or Python backend
3. **Hash Passwords**: Never store plain text passwords
4. **Use HTTPS**: Secure all data transmission
5. **Input Validation**: Sanitize all user inputs
6. **Payment Integration**: Use Stripe, PayPal, or similar services

## Features in Detail

### IP Reveal Button
- Animated loading state
- Smooth reveal animation
- One-click copy to clipboard
- Fallback for older browsers

### User Authentication
- Real-time form validation
- Password strength checking
- Duplicate email/username prevention
- Session management with tokens

### Store System
- Purchase confirmation dialogs
- Transaction history tracking
- Item categorization
- Bundle discount calculations

### Database Simulation
- Complete CRUD operations
- User roles and permissions
- Purchase tracking
- Analytics and reporting

## Future Enhancements

- [ ] Real backend integration
- [ ] Payment gateway integration
- [ ] Email verification system
- [ ] Admin dashboard
- [ ] Server status API integration
- [ ] Multi-language support
- [ ] Dark/light theme toggle
- [ ] Mobile app companion

## Support

For technical support or questions:
- Check the Help section on the website
- Review this README file
- Contact the development team

## License

This project is created for educational and demonstration purposes. Feel free to modify and use for your Surfnetwork server.

---

**Note**: Remember to update the server IP address, contact information, and other server-specific details before deploying to production.
# Surfnetwork Website - Admin Panel

## Admin Access Credentials

### Main Admin Account
- **Email:** admin@surfnetwork.com
- **Password:** admin123456
- **Role:** Owner/Admin
- **Access:** Full admin panel access

### Additional Demo Accounts
- **Email:** mod@surfnetwork.com
- **Password:** mod123456
- **Role:** Moderator
- **Access:** Limited admin access

- **Email:** superadmin@surfnetwork.com
- **Password:** super123456
- **Role:** Admin
- **Access:** Full admin panel access

## Features Implemented

### Profile Page Connection
✅ Fixed profile.html to work properly when accessing profile
✅ Updated navbar to show username when logged in
✅ Profile page now loads user data correctly
✅ All profile tabs (Account, Purchases, Settings, Security, Notifications) are functional

### Admin Panel Features
✅ Complete administrator webpage for player management
✅ Separate admin login system with different email access
✅ User management (view, edit, ban/unban, delete users)
✅ Purchase management and tracking
✅ Contact message handling
✅ Analytics and reporting
✅ Server settings configuration
✅ Real-time dashboard with statistics

### Admin Panel Sections
1. **Dashboard** - Overview of server statistics and recent activity
2. **Users** - Complete user management with search and filtering
3. **Purchases** - View and manage all user purchases
4. **Messages** - Handle contact messages from users
5. **Analytics** - Detailed analytics and top purchasers
6. **Settings** - Server configuration options

## How to Access Admin Panel

1. Navigate to the main website
2. Click the "Admin" link in the navigation (yellow shield icon)
3. Use the admin credentials above to log in
4. Access the full admin panel with all management features

## Security Notes

- Admin accounts are separate from regular user accounts
- Admin login uses different authentication system
- Admin panel is protected and requires proper credentials
- All admin actions are logged and tracked

## Testing

To test the functionality:
1. Create a regular user account through the main site
2. Login as admin using the credentials above
3. View and manage the regular user from the admin panel
4. Test all admin features (user management, purchases, messages, etc.)

## File Structure

- `admin.html` - Main admin panel interface
- `admin.js` - Admin panel functionality
- `admin-login.html` - Admin login page
- `admin-login.js` - Admin login functionality
- `profile.html` - User profile page (now properly connected)
- `profile.js` - Profile page functionality
- `database.js` - Database with admin user creation
- `script.js` - Updated with profile navigation fixes

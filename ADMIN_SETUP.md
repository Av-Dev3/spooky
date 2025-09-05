# Admin Panel Setup Instructions

## Environment Configuration

To set up the admin panel, you need to create a `.env.local` file in the root directory with the following content:

```
ADMIN_PASSWORD=your_secure_password_here
```

Replace `your_secure_password_here` with your actual admin password.

## Accessing the Admin Panel

1. **Secret URL Access**: Navigate to `/auth` in your browser
2. **Enter Password**: Use the password you set in the `.env.local` file
3. **Access Panel**: After successful authentication, you'll be redirected to the admin panel

## Security Features

- ✅ Admin panel completely hidden from public view
- ✅ No admin links anywhere on the public site
- ✅ Secret URL route (`/auth`) known only to admin
- ✅ Password-protected access required
- ✅ Automatic redirect for unauthorized access attempts
- ✅ Session-based authentication with secure cookies
- ✅ Styled auth page with minimal identifying information

## Important Notes

- The admin panel is now hidden from public view
- Only users with the correct password can access it
- Sessions expire after 8 hours of inactivity
- Always use a strong, unique password for admin access

## Accessing Admin Panel

To access the admin panel:
1. Go to: `https://yourdomain.com/auth`
2. Enter your admin password
3. Click "Access" to enter the panel

**Note**: This URL is secret and not linked anywhere on the public site.

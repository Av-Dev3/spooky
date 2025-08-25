# Backend Features Setup Guide

This guide explains how to set up and use the new backend features added to your static site.

## What's Been Added

- **Next.js Backend**: API routes for admin functionality
- **Supabase Integration**: Database and file storage
- **Admin Panel**: Secure media management interface
- **Authentication**: Password-protected admin access

## Prerequisites

1. **Node.js**: Version 16 or higher
2. **Supabase Account**: Free tier works fine
3. **Git**: For version control

## Setup Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Supabase Setup

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Once created, go to Settings → API to get your credentials
3. Go to Storage and create a bucket called `media`
4. Go to SQL Editor and run the SQL from `supabase/sql/README.md`

### 3. Environment Configuration

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` and add your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ADMIN_PASSWORD=your-secure-password
   ```

### 4. Start Development Server

```bash
npm run dev
```

Your site will be available at `http://localhost:3000`

## Admin Features

### Access Admin Panel

- Navigate to `/admin/panel.html`
- You'll be redirected to `/admin/login.html` if not authenticated
- Enter the password from your `.env.local` file

### Media Management

- **Upload**: Select image/video files, add title and tags
- **View**: See all uploaded media in a grid layout
- **Delete**: Remove media files and database records
- **Preview**: Generate signed URLs for secure media access

## API Endpoints

All endpoints are protected and require admin authentication:

- `POST /api/admin/login` - Admin login
- `POST /api/admin/logout` - Admin logout
- `POST /api/admin/media/signed-upload` - Get signed upload URL
- `POST /api/admin/media/commit` - Save media metadata
- `GET /api/admin/list/media` - List all media
- `GET /api/admin/media/preview` - Get media preview URL
- `POST /api/admin/media/delete` - Delete media

## File Structure

```
├── pages/api/admin/          # API endpoints
├── public/admin/             # Admin interface
├── lib/                      # Server utilities
├── middleware.js             # Route protection
├── supabase/sql/            # Database setup
└── package.json             # Dependencies
```

## Security Features

- **Route Protection**: All admin routes require authentication
- **HttpOnly Cookies**: Secure session management
- **Service Role**: Server-side operations use elevated permissions
- **Signed URLs**: Secure file access without exposing storage paths

## Production Deployment

1. Build the project:
   ```bash
   npm run build
   ```

2. Start production server:
   ```bash
   npm start
   ```

3. Set `NODE_ENV=production` in your environment for secure cookies

## Troubleshooting

### Common Issues

1. **"Not authorized" errors**: Check your admin password and cookie settings
2. **Upload failures**: Verify Supabase storage bucket exists and permissions
3. **Database errors**: Ensure the `media_asset` table was created correctly

### Debug Mode

Set `NODE_ENV=development` to see detailed error messages and disable secure cookies.

## Next Steps

- Customize the admin interface styling
- Add more media metadata fields
- Implement user roles and permissions
- Add media categories and filtering
- Integrate with your existing gallery/shop pages

## Support

For issues or questions:
1. Check the Supabase documentation
2. Review Next.js API routes documentation
3. Check browser console for JavaScript errors
4. Verify environment variables are set correctly

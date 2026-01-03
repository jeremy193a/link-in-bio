# Showcase MVP - Setup Guide

## Environment Setup

Copy the following environment variables to your `.env.local` file:

```bash
# Clerk Auth (Get from https://clerk.com)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_publishable_key
CLERK_SECRET_KEY=your_secret_key

# Anthropic API (Get from https://console.anthropic.com)
ANTHROPIC_API_KEY=your_anthropic_api_key

# Cloudflare (Get from Cloudflare dashboard)
CLOUDFLARE_ACCOUNT_ID=your_account_id
CLOUDFLARE_API_TOKEN=your_api_token
DATABASE_ID=your_d1_database_id
R2_BUCKET_NAME=showcase-images
R2_ACCESS_KEY_ID=your_r2_access_key
R2_SECRET_ACCESS_KEY=your_r2_secret_key

# App Config
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_CDN_URL=https://cdn.showcase.vn
```

## Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Set up Cloudflare D1 Database**
   ```bash
   # Create D1 database
   npx wrangler d1 create showcase-db
   
   # Run migrations
   npx wrangler d1 execute showcase-db --file=schema.sql
   ```

3. **Set up Cloudflare R2 Bucket**
   ```bash
   npx wrangler r2 bucket create showcase-images
   ```

4. **Run Development Server**
   ```bash
   npm run dev
   ```

## Current Status

✅ **Phase 1 Complete**: Project setup, dependencies installed, folder structure created
✅ **Phase 2 Complete**: Clerk authentication configured, core libraries implemented

### What's Working:
- Landing page
- Authentication (sign in/sign up)
- Dashboard layout
- Basic dashboard page

### Next Steps:
- Phase 3: Product creation form (MVP core feature)
- Phase 4: Public product pages
- Phase 5: API routes
- Phase 6: Testing and polish

## Notes

- The D1 database client currently throws an error in development. You'll need to either:
  1. Set up local D1 with wrangler, or
  2. Deploy to Cloudflare Pages for full functionality
  
- Environment variables for external services (Clerk, Anthropic, Cloudflare) need to be configured before the app will work fully.

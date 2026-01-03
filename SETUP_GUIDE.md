# Complete Setup Guide

This guide will walk you through setting up the entire development environment for the Link-in-Bio project.

## Prerequisites

- Node.js 20+ installed
- npm or yarn
- A Cloudflare account (free tier is fine)

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Set Up Clerk Authentication

1. Go to [https://clerk.com](https://clerk.com) and sign up
2. Click "Create application"
3. Name it "Showcase" or "Link-in-Bio"
4. Select "Email" and "Google" (or your preferred auth methods)
5. After creation, go to **API Keys** in the sidebar
6. Copy your keys:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` (starts with `pk_test_`)
   - `CLERK_SECRET_KEY` (starts with `sk_test_`)

## Step 3: Set Up Anthropic API

1. Go to [https://console.anthropic.com](https://console.anthropic.com)
2. Sign up or log in
3. Go to **API Keys** section
4. Click **Create Key**
5. Copy the `ANTHROPIC_API_KEY` (starts with `sk-ant-`)

## Step 4: Set Up Cloudflare

### 4.1 Get Account ID and API Token

1. Go to [https://dash.cloudflare.com](https://dash.cloudflare.com)
2. Sign up or log in
3. Go to **Workers & Pages** in the left sidebar
4. Your **Account ID** is shown in the right sidebar
5. For API Token:
   - Click your profile icon (top right) > **My Profile**
   - Go to **API Tokens**
   - Click **Create Token**
   - Use the **Edit Cloudflare Workers** template
   - Click **Continue to summary** > **Create Token**
   - Copy the token (you won't see it again!)

### 4.2 Create D1 Database

```bash
# Login to Cloudflare (will open browser)
npx wrangler login

# Create the D1 database
npx wrangler d1 create showcase-db
```

After running this, you'll see output like:
```
✅ Successfully created DB 'showcase-db' in region APAC
Created your database using D1's new storage backend!

[[d1_databases]]
binding = "DB"
database_name = "showcase-db"
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

**Copy the `database_id`** - you'll need this for your `.env.local` file!

### 4.3 Run Database Migrations

```bash
# Apply the schema to your D1 database
npx wrangler d1 execute showcase-db --file=schema.sql
```

### 4.4 Set Up Local D1 Development

```bash
# Create a local D1 database for development
npx wrangler d1 execute showcase-db --local --file=schema.sql
```

### 4.5 Create R2 Bucket

```bash
# Create R2 bucket for image storage
npx wrangler r2 bucket create showcase-images
```

### 4.6 Create R2 API Token

1. In Cloudflare Dashboard, go to **R2** in the sidebar
2. Click **Manage R2 API Tokens**
3. Click **Create API Token**
4. Select **Object Read & Write** permissions
5. Click **Create API Token**
6. Copy:
   - `Access Key ID` → `R2_ACCESS_KEY_ID`
   - `Secret Access Key` → `R2_SECRET_ACCESS_KEY`

## Step 5: Configure Environment Variables

1. Copy the example file:
   ```bash
   cp .env.local.example .env.local
   ```

2. Edit `.env.local` and fill in all the values you collected:

```bash
# Clerk Auth
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
CLERK_SECRET_KEY=sk_test_xxxxx

# Anthropic API
ANTHROPIC_API_KEY=sk-ant-xxxxx

# Cloudflare
CLOUDFLARE_ACCOUNT_ID=your_account_id
CLOUDFLARE_API_TOKEN=your_api_token
DATABASE_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx

# R2
R2_BUCKET_NAME=showcase-images
R2_ACCESS_KEY_ID=your_r2_access_key
R2_SECRET_ACCESS_KEY=your_r2_secret_key

# App Config
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_CDN_URL=http://localhost:3000
```

## Step 6: Update wrangler.toml

Edit `wrangler.toml` and add your `database_id`:

```toml
[[d1_databases]]
binding = "DB"
database_name = "showcase-db"
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"  # Add your ID here
```

## Step 7: Run the Development Server

### Option A: Standard Next.js Dev (without local D1)
```bash
npm run dev
```

**Note:** This will work for auth and UI, but D1 database calls will fail. Good for frontend development.

### Option B: With Local D1 (Recommended)

You'll need to modify the app to use Wrangler's local D1. For now, use Option A and deploy to Cloudflare Pages for full functionality.

## Step 8: Verify Setup

1. Open [http://localhost:3000](http://localhost:3000)
2. You should see the landing page
3. Click "Đăng nhập" - Clerk auth should work
4. Sign up with an email
5. You should be redirected to the dashboard

## Troubleshooting

### Clerk not working
- Check that both `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` are set
- Make sure the keys start with `pk_test_` and `sk_test_`
- Try restarting the dev server

### D1 Database errors in development
This is expected! D1 requires either:
1. Deploying to Cloudflare Pages, OR
2. Using Wrangler's local mode (more complex setup)

For Phase 3 development (product creation), you can:
- Deploy to Cloudflare Pages for testing
- Use mock data temporarily
- Wait for Next.js/Cloudflare better local D1 support

### R2 Upload errors
- Verify `R2_ACCESS_KEY_ID` and `R2_SECRET_ACCESS_KEY` are correct
- Check that `CLOUDFLARE_ACCOUNT_ID` is set
- Ensure the bucket name matches: `showcase-images`

## Next Steps

Once setup is complete:
1. The landing page and auth should work ✅
2. Dashboard page loads ✅
3. Database operations require deployment to Cloudflare Pages
4. Ready to start Phase 3: Product creation form

## Deploying to Cloudflare Pages

For full D1 functionality:

```bash
# Build the project
npm run build

# Deploy to Cloudflare Pages
npx wrangler pages deploy .next

# Or connect your GitHub repo in Cloudflare Dashboard for automatic deployments
```

## Useful Commands

```bash
# Check D1 database
npx wrangler d1 execute showcase-db --command "SELECT * FROM users"

# Check D1 tables
npx wrangler d1 execute showcase-db --command "SELECT name FROM sqlite_master WHERE type='table'"

# List R2 buckets
npx wrangler r2 bucket list

# View Wrangler help
npx wrangler --help
```

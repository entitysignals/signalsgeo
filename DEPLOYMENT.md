# SignalsGEO Deployment Guide - Render.com

## Prerequisites
- GitHub account (to push code)
- Render.com account
- Supabase project set up
- API keys: Perplexity, Brave

## Step-by-Step Deployment

### 1. Push Code to GitHub

```bash
git init
git add .
git commit -m "Initial commit - ready for deployment"
git branch -M main
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

### 2. Create Render Services

#### Option A: Automatic (Blueprint)
1. Go to https://dashboard.render.com/blueprints
2. Click "New Blueprint Instance"
3. Connect your GitHub repo
4. Render will read `render.yaml` and create both services
5. Fill in environment variables when prompted

#### Option B: Manual

**Web Service:**
1. Go to https://dashboard.render.com
2. Click "New +" → "Web Service"
3. Connect your GitHub repo
4. Settings:
   - Name: `signalsgeo-web`
   - Region: Oregon (or closest to you)
   - Branch: `main`
   - Root Directory: (leave empty)
   - Runtime: Node
   - Build Command: `pnpm install && pnpm build`
   - Start Command: `pnpm start`
   - Plan: Starter ($7/month)

**Background Worker:**
1. Click "New +" → "Background Worker"
2. Connect same GitHub repo
3. Settings:
   - Name: `signalsgeo-worker`
   - Region: Oregon
   - Branch: `main`
   - Root Directory: (leave empty)
   - Runtime: Node
   - Build Command: `pnpm install`
   - Start Command: `pnpm worker`
   - Plan: Starter ($7/month)

### 3. Environment Variables

**For Web Service, add these:**
```
NODE_ENV=production
NEXT_PUBLIC_SUPABASE_URL=https://gecsydvacrnfaizjkjcx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
PERPLEXITY_API_KEY=your_perplexity_key
BRAVE_API_KEY=your_brave_key
NEXT_PUBLIC_BASE_URL=https://signalsgeo-web.onrender.com
```

**For Worker, add these:**
```
NODE_ENV=production
NEXT_PUBLIC_SUPABASE_URL=https://gecsydvacrnfaizjkjcx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
PERPLEXITY_API_KEY=your_perplexity_key
BRAVE_API_KEY=your_brave_key
```

### 4. Custom Domain (signalsgeo.com)

1. In Web Service settings, go to "Custom Domains"
2. Click "Add Custom Domain"
3. Enter: `signalsgeo.com` and `www.signalsgeo.com`
4. Render will show DNS records to add:
   - A record: `@` → `[Render IP]`
   - CNAME: `www` → `signalsgeo-web.onrender.com`
5. Add these records in your domain registrar (GoDaddy, Namecheap, etc.)
6. Wait for DNS propagation (5-60 minutes)

### 5. Verify Deployment

1. Visit your Render URL (e.g., `https://signalsgeo-web.onrender.com`)
2. Check worker logs: Dashboard → signalsgeo-worker → Logs
3. Create a test organization and run a scan
4. Verify scoring completes

### 6. Supabase Auth Configuration

Update allowed URLs in Supabase:
1. Go to Supabase Dashboard → Authentication → URL Configuration
2. Add to "Site URL": `https://signalsgeo.com`
3. Add to "Redirect URLs":
   - `https://signalsgeo.com/**`
   - `https://www.signalsgeo.com/**`
   - `https://signalsgeo-web.onrender.com/**`

## Troubleshooting

### Worker Not Processing Jobs
- Check worker logs in Render dashboard
- Verify environment variables are set
- Make sure worker service is running (not suspended)

### Authentication Not Working
- Check Supabase redirect URLs
- Verify NEXT_PUBLIC_BASE_URL matches your domain

### Build Failures
- Check build logs
- Verify pnpm is installed (Render auto-detects from package.json)
- Make sure all dependencies are in package.json

## Cost Estimate
- Web Service: $7/month (Starter plan)
- Worker: $7/month (Starter plan)
- **Total: $14/month** (plus Supabase/API costs)

## Free Tier Option
Render offers free tier, but:
- Services spin down after 15 min of inactivity
- Not recommended for production
- Worker might miss jobs during sleep

## Post-Deployment
- Monitor worker logs for errors
- Test all features (signup, scan, scoring)
- Set up alerts in Render dashboard
- Monitor API usage costs



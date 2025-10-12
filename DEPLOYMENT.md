# Deployment Guide for ClientView

Complete step-by-step guide to deploy ClientView to production.

## Prerequisites

- GitHub account
- Vercel account
- Railway account (or Render/Fly.io)
- Anthropic API key

## Part 1: Get API Keys

### 1. Anthropic API Key

1. Visit [console.anthropic.com](https://console.anthropic.com)
2. Sign up or log in
3. Go to API Keys
4. Create new key
5. Copy key (starts with `sk-ant-...`)
6. Save securely - you'll need it for both frontend and backend

### 2. Vercel Blob Storage

1. Deploy to Vercel first (see below)
2. In Vercel dashboard, go to your project
3. Click "Storage" tab
4. Click "Create Database" → "Blob"
5. Copy the token
6. Add to environment variables

## Part 2: Deploy Python Backend (Railway)

### Option A: Railway (Recommended)

1. **Install Railway CLI**:
```bash
npm install -g @railway/cli
```

2. **Login**:
```bash
railway login
```

3. **Navigate to backend**:
```bash
cd ClientView/python-backend
```

4. **Initialize project**:
```bash
railway init
```
   - Select "Create new project"
   - Name it "clientview-backend"

5. **Deploy**:
```bash
railway up
```

6. **Add environment variables** in Railway dashboard:
   - Go to railway.app
   - Select your project
   - Go to Variables tab
   - Add:
     - `ANTHROPIC_API_KEY` = your Anthropic key
     - `ALLOWED_ORIGINS` = `*` (configure properly later)

7. **Get your backend URL**:
   - In Railway dashboard, go to Settings → Networking
   - Copy the public URL (e.g., `https://clientview-backend.railway.app`)
   - Save this - you'll need it for frontend

### Option B: Render

1. Go to [render.com](https://render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: clientview-backend
   - **Root Directory**: `python-backend`
   - **Environment**: Python 3
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Add environment variables:
   - `ANTHROPIC_API_KEY`
   - `ALLOWED_ORIGINS`
6. Click "Create Web Service"
7. Copy your service URL

## Part 3: Deploy Frontend (Vercel)

### 1. Push to GitHub

```bash
cd ClientView
git init
git add .
git commit -m "Initial ClientView deployment"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/clientview.git
git push -u origin main
```

### 2. Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./` (or `ClientView` if in subdirectory)
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

5. **Add Environment Variables**:
   - Click "Environment Variables"
   - Add:
     ```
     ANTHROPIC_API_KEY = sk-ant-...
     PYTHON_API_URL = https://clientview-backend.railway.app
     ```

6. Click "Deploy"

7. Wait for deployment (2-3 minutes)

8. Visit your deployment URL

### 3. Setup Blob Storage

1. In Vercel dashboard, go to your project
2. Click "Storage" tab
3. Click "Create Database" → "Blob"
4. Name it "clientview-storage"
5. Copy the `BLOB_READ_WRITE_TOKEN`
6. Go to Settings → Environment Variables
7. Add:
   ```
   BLOB_READ_WRITE_TOKEN = vercel_blob_...
   ```
8. Redeploy (Settings → Deployments → Latest → Redeploy)

## Part 4: Update CORS

### 1. Update Python Backend CORS

Once you have your Vercel URL:

1. Go to Railway dashboard
2. Select your backend project
3. Go to Variables
4. Update `ALLOWED_ORIGINS`:
   ```
   ALLOWED_ORIGINS = https://your-app.vercel.app
   ```
5. Backend will automatically redeploy

## Part 5: Testing

### 1. Test Upload

1. Visit your Vercel URL
2. Try uploading a PowerPoint file
3. Should see upload interface
4. Should redirect to analysis page

### 2. Check Backend Health

Visit `https://your-backend-url.railway.app/health`

Should return:
```json
{
  "status": "healthy"
}
```

### 3. Check Logs

**Vercel Logs**:
- Dashboard → Your Project → Deployments → View Function Logs

**Railway Logs**:
- Dashboard → Your Project → Deployments → View Logs

## Part 6: Custom Domain (Optional)

### Frontend Domain

1. In Vercel dashboard, go to Settings → Domains
2. Add your domain (e.g., `clientview.com`)
3. Follow DNS configuration instructions
4. Update CORS in backend with new domain

### Backend Domain

1. In Railway dashboard, go to Settings → Networking
2. Add custom domain
3. Follow DNS configuration
4. Update `PYTHON_API_URL` in Vercel environment variables

## Troubleshooting

### Upload Fails

**Error**: "No file uploaded"
- Check if file is .pptx format
- Check file size < 50MB
- Check browser console for errors

**Error**: "Upload failed"
- Check Vercel logs
- Verify `BLOB_READ_WRITE_TOKEN` is set
- Check Blob storage is created

### Analysis Stuck

**Progress doesn't advance**:
- Check Python backend is running
- Visit backend `/health` endpoint
- Check Railway/Render logs
- Verify `PYTHON_API_URL` in Vercel is correct

### AI Edit Fails

**Error**: "AI edit failed"
- Check `ANTHROPIC_API_KEY` is set correctly
- Check Anthropic API limits/billing
- Check Vercel function logs

### CORS Errors

**Error**: "CORS policy blocked"
- Update `ALLOWED_ORIGINS` in Python backend
- Include both Vercel URL and custom domain
- Redeploy backend after changes

## Production Checklist

Before launching to users:

- [ ] Custom domain configured
- [ ] SSL certificates active (automatic with Vercel/Railway)
- [ ] Environment variables in production mode
- [ ] CORS configured with specific origins (not `*`)
- [ ] Error tracking setup (Sentry)
- [ ] Analytics setup (Vercel Analytics)
- [ ] Backup strategy for uploaded files
- [ ] Rate limiting configured
- [ ] Authentication enabled (Clerk)
- [ ] Database for persistent storage
- [ ] Monitoring alerts setup

## Monitoring

### Vercel Analytics

1. In Vercel dashboard, go to Analytics
2. Enable Web Analytics
3. Monitor:
   - Page views
   - Performance
   - User sessions

### Railway Metrics

1. In Railway dashboard, go to Metrics
2. Monitor:
   - CPU usage
   - Memory usage
   - Response times

## Scaling

### Frontend

Vercel automatically scales. No configuration needed.

### Backend

**Railway**:
- Free tier: 500 hours/month
- Hobby: $5/month unlimited
- Scaling: Automatic with higher plans

**Render**:
- Free tier: Limited
- Starter: $7/month
- Can enable autoscaling

## Cost Estimation

### Month 1 (MVP Testing)
- Vercel: Free (Hobby plan)
- Railway: Free (under 500 hours)
- Anthropic API: ~$10-20
- **Total**: ~$10-20

### At Scale (100 users/day)
- Vercel: $20/month (Pro plan)
- Railway: $20/month (Pro plan)
- Anthropic API: ~$100-200/month
- Vercel Blob: ~$10/month
- **Total**: ~$150-250/month

## Support

If you encounter issues:

1. Check logs (Vercel & Railway)
2. Verify environment variables
3. Test backend health endpoint
4. Check API key validity
5. Review error messages carefully

## Next Steps

After successful deployment:

1. Add user authentication (Clerk)
2. Setup database (Vercel Postgres or Railway)
3. Implement full PowerPoint processing
4. Add error tracking (Sentry)
5. Enable real-time features
6. Create user dashboard
7. Build billing system

---

**Deployment complete!** 🎉

Your ClientView app is now live and ready for users.


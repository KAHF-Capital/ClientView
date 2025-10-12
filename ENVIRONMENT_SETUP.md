# Environment Variables Setup

This document describes all environment variables required for ClientView.

## Required Environment Variables

### Frontend (.env.local)

Create a `.env.local` file in the root directory with the following variables:

```bash
# Anthropic API Key for Claude AI
# Get from: https://console.anthropic.com
ANTHROPIC_API_KEY=sk-ant-your-api-key-here

# Vercel Blob Storage Token
# Automatically provided by Vercel when you create a Blob store
# For local dev, create manually in Vercel dashboard
BLOB_READ_WRITE_TOKEN=vercel_blob_your-token-here

# Python Backend URL
# Local development: http://localhost:8000
# Production: Your Railway or other hosting URL
PYTHON_API_URL=http://localhost:8000

# Optional: Node Environment
NODE_ENV=development
```

### Python Backend (.env)

Create a `.env` file in the `python-backend` directory with:

```bash
# Anthropic API Key for Claude AI
ANTHROPIC_API_KEY=sk-ant-your-api-key-here

# Environment (development or production)
ENVIRONMENT=development

# Allowed CORS origins (comma-separated)
# For local dev: http://localhost:3000
# For production: your Vercel URL
ALLOWED_ORIGINS=http://localhost:3000

# Optional: Server Port
PORT=8000
```

## Getting API Keys

### 1. Anthropic API Key
1. Visit [console.anthropic.com](https://console.anthropic.com)
2. Sign up or log in
3. Go to API Keys section
4. Create a new API key
5. Copy the key (starts with `sk-ant-`)

### 2. Vercel Blob Storage
1. Deploy to Vercel or visit [vercel.com](https://vercel.com)
2. Go to your project dashboard
3. Navigate to Storage tab
4. Create a new Blob store
5. Copy the read/write token

## Validation

To verify your environment variables are set up correctly:

### Frontend
```bash
npm run dev
```

Check the console - you should not see any "missing environment variable" warnings.

### Python Backend
```bash
cd python-backend
python main.py
```

Visit `http://localhost:8000/health` - you should see `{"status": "healthy"}`

## Security Notes

⚠️ **NEVER commit .env files to version control**

The `.gitignore` file already excludes:
- `.env`
- `.env.local`
- `.env*.local`
- `python-backend/.env`

## Troubleshooting

### "ANTHROPIC_API_KEY is not set"
- Make sure `.env.local` exists in the root directory
- Check the key starts with `sk-ant-`
- Restart the dev server after creating the file

### "BLOB_READ_WRITE_TOKEN is not set"
- This is only required for file uploads
- The app works without it for UI testing
- Deploy to Vercel to get automatic token

### "Cannot connect to Python backend"
- Make sure Python backend is running on port 8000
- Check `PYTHON_API_URL` is set correctly
- Try accessing `http://localhost:8000` directly


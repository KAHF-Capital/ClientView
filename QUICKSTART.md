# ClientView Quickstart Guide

Get up and running with ClientView in 5 minutes.

## Prerequisites

- Node.js 18+ installed
- Python 3.11+ installed
- Anthropic API key (optional for local dev)

## Local Development

### 1. Install Frontend

```bash
cd ClientView

# Install dependencies
npm install

# Create environment file (optional for basic testing)
cp .env.example .env.local

# Run dev server
npm run dev
```

Frontend now running at `http://localhost:3000`

### 2. Install Python Backend (Optional)

The app works without the Python backend for UI testing. To enable full PowerPoint processing:

```bash
cd python-backend

# Create virtual environment
python -m venv venv

# Activate (Mac/Linux)
source venv/bin/activate
# Or Windows
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run server
python main.py
```

Backend runs at `http://localhost:8000`

### 3. Test the App

1. Visit `http://localhost:3000`
2. You should see the upload interface
3. Try uploading a .pptx file (demo works with mock data)
4. Follow the flow through analysis → template → builder

## What Works Without Configuration

✅ **Working out of the box**:
- Upload interface (stores in memory)
- Analysis loading screen (simulated)
- Template review with mock slides
- Report builder interface
- Slide library and canvas
- AI edit panel UI

⏸️ **Requires API keys**:
- Actual file upload to Blob storage (`BLOB_READ_WRITE_TOKEN`)
- Real AI editing (`ANTHROPIC_API_KEY`)
- PowerPoint processing (Python backend)

## Next Steps

### For UI/UX Review
No configuration needed! Just run `npm run dev` and explore the interface.

### For Full Functionality
1. Get Anthropic API key from [console.anthropic.com](https://console.anthropic.com)
2. Add to `.env.local`:
   ```
   ANTHROPIC_API_KEY=sk-ant-your-key-here
   ```
3. For file storage, either:
   - Deploy to Vercel (automatic Blob storage)
   - Or setup local file storage

### For Production Deployment
See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete guide.

## Project Structure Quick Reference

```
ClientView/
├── app/
│   ├── page.tsx              # Upload interface
│   ├── analyze/[id]/         # Analysis loading
│   ├── template/[id]/        # Template library
│   ├── builder/[id]/         # Main builder
│   └── api/                  # API routes
├── components/
│   ├── ui/                   # Base UI components
│   └── builder/              # Builder-specific components
└── python-backend/           # PowerPoint processing
```

## Common Commands

```bash
# Development
npm run dev              # Start Next.js dev server
npm run build            # Build for production
npm run start            # Start production server

# Python backend
python main.py           # Run FastAPI server
uvicorn main:app --reload  # Run with auto-reload

# Linting
npm run lint             # Check for issues
```

## Demo Data

The app includes mock data for testing:
- 8 sample slides across 5 categories
- 12 pre-configured variables
- Sample theme colors and fonts
- Realistic workflow simulation

## Troubleshooting

### "Module not found" errors
```bash
rm -rf node_modules package-lock.json
npm install
```

### Port already in use
```bash
# Kill process on port 3000 (Mac/Linux)
lsof -ti:3000 | xargs kill

# Or use different port
PORT=3001 npm run dev
```

### Python dependencies fail
```bash
# Use pip with specific Python version
python3.11 -m pip install -r requirements.txt
```

## Key Features to Test

1. **Upload Flow**: 
   - Drag and drop .pptx file
   - See upload animation
   - Navigate to analysis

2. **Analysis**:
   - Watch progress animation
   - See step-by-step completion
   - Auto-redirect to template

3. **Template Library**:
   - Filter by category
   - View slide cards
   - See variable counts

4. **Builder**:
   - Select slides from library
   - View slide in canvas
   - Try AI edit panel
   - Use quick actions

## Performance Notes

- Initial build may take 2-3 minutes
- Hot reload is fast (< 1 second)
- Production build is optimized
- Components use React Server Components where possible

## What's Next?

This is a production-ready MVP frontend with:
- ✅ Complete UI/UX
- ✅ All components built
- ✅ API structure ready
- ✅ Type-safe TypeScript
- ✅ Responsive design
- ⏳ Needs backend implementation for full functionality

To complete the full application:
1. Implement PowerPoint parsing (python-pptx)
2. Connect Claude AI for real editing
3. Add database for templates
4. Implement user authentication
5. Deploy to production

## Need Help?

- Check [README.md](./README.md) for full documentation
- See [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment guide
- Review component code for implementation details
- Check console/terminal for error messages

---

**Ready to go!** Start with `npm run dev` and explore the interface.


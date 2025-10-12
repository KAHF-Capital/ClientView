# ClientView - AI-Powered Wealth Management Presentation Editor

A sophisticated, enterprise-grade web application where wealth advisors upload PowerPoint proposals, AI analyzes and creates smart templates, then advisors use a visual editor to customize slides with AI assistance while maintaining brand consistency.

## 🚀 Features

- **📤 Drag-and-Drop Upload**: Upload PowerPoint (.pptx) presentations up to 50MB
- **🤖 AI Analysis**: Automatically categorizes slides, detects variables, extracts themes
- **📚 Template Library**: Visual slide library with category filtering
- **🎨 Visual Builder**: Figma-style 3-panel interface for slide editing
- **✨ AI Editing**: Natural language slide editing powered by Claude Sonnet 4
- **🎯 Brand Consistency**: Maintains colors, fonts, and styling across all edits
- **⬇️ Export**: Generate final PowerPoint presentations with all changes

## 🛠 Tech Stack

### Frontend
- **Next.js 14** (App Router) with TypeScript
- **Tailwind CSS** + **shadcn/ui** components
- **Framer Motion** for animations
- **React DnD** for drag-and-drop
- **Zustand** for state management

### Backend
- **Next.js API Routes** for frontend API
- **Python FastAPI** microservice for PowerPoint processing
- **Claude Sonnet 4 API** (Anthropic) for AI editing
- **python-pptx** for PowerPoint manipulation

### Infrastructure
- **Vercel** (frontend hosting)
- **Railway** (Python backend)
- **Vercel Blob** (file storage)

## 📦 Installation

### Frontend Setup

```bash
cd ClientView

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Add your API keys to .env.local:
# ANTHROPIC_API_KEY=sk-ant-...
# BLOB_READ_WRITE_TOKEN=vercel_blob_...
# PYTHON_API_URL=http://localhost:8000 (for local dev)

# Run development server
npm run dev
```

Visit `http://localhost:3000`

### Python Backend Setup

```bash
cd python-backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create environment file
cp .env.example .env

# Add your Anthropic API key to .env

# Run server
python main.py
# or
uvicorn main:app --reload
```

Backend runs at `http://localhost:8000`

## 🚢 Deployment

### Frontend (Vercel)

1. **Push to GitHub**:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-repo-url>
git push -u origin main
```

2. **Deploy to Vercel**:
   - Visit [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables:
     - `ANTHROPIC_API_KEY`
     - `BLOB_READ_WRITE_TOKEN`
     - `PYTHON_API_URL` (your Railway URL)
   - Deploy

3. **Setup Blob Storage**:
   - In Vercel dashboard, go to Storage
   - Create new Blob store
   - Copy token to environment variables

### Backend (Railway)

1. **Install Railway CLI**:
```bash
npm i -g @railway/cli
```

2. **Deploy**:
```bash
cd python-backend
railway login
railway init
railway up
```

3. **Add Environment Variables** in Railway dashboard:
   - `ANTHROPIC_API_KEY`
   - `ALLOWED_ORIGINS` (your Vercel URL)

4. **Get Backend URL** and update frontend `PYTHON_API_URL`

## 📖 Usage Flow

### 1. Upload Proposal
- Drag and drop a PowerPoint file
- System uploads to blob storage
- Triggers analysis

### 2. AI Analysis (Background)
- Extracts all text, charts, images
- Detects variables like `{{client_name}}`
- Categorizes slides (Current Allocation, Performance, etc.)
- Extracts color scheme and fonts

### 3. Template Review
- Visual grid of all slides
- Filter by category
- Preview variables and charts
- Proceed to builder

### 4. Report Builder
- **Left Panel**: Slide library with drag-and-drop
- **Center**: Canvas showing selected slide
- **Right Panel**: AI editing
  - Natural language instructions
  - Quick actions (update numbers, change charts)
  - Variable editor
  - Theme colors

### 5. Generate & Download
- Click "Download Presentation"
- System generates final .pptx
- Downloads to your computer

## 🎯 User Stories

### Advisor Workflow
1. "I have a client proposal template with 25 slides"
2. "I upload it to ClientView"
3. "AI analyzes and categorizes all slides"
4. "I review the template library"
5. "I select slides I want for this client"
6. "I tell AI: 'Change the title to focus on retirement planning'"
7. "I update variables: client name, portfolio values"
8. "I download the customized presentation"
9. "Total time: 5 minutes vs 30 minutes manual editing"

## 🧪 Development

### Project Structure

```
ClientView/
├── app/
│   ├── page.tsx                    # Upload interface
│   ├── analyze/[id]/page.tsx       # Analysis loading
│   ├── template/[id]/page.tsx      # Template review
│   ├── builder/[id]/page.tsx       # Main builder
│   └── api/
│       ├── upload/route.ts         # File upload
│       ├── analyze/[id]/progress/  # Analysis status
│       ├── template/[id]/route.ts  # Get template
│       ├── ai/edit-slide/route.ts  # AI editing
│       └── generate/route.ts       # Generate PPT
├── components/
│   ├── ui/                         # shadcn components
│   └── builder/
│       ├── SlideLibrary.tsx        # Left panel
│       ├── SlideCanvas.tsx         # Center canvas
│       └── AIEditPanel.tsx         # Right panel
├── python-backend/
│   ├── main.py                     # FastAPI server
│   ├── requirements.txt
│   └── Dockerfile
└── package.json
```

### Adding New Features

1. **Add a new slide category**:
   - Update `CATEGORIES` in `app/template/[id]/page.tsx`
   - Update Python backend `SLIDE_CATEGORIES`
   - Add color in `CATEGORY_COLORS`

2. **Add new AI quick action**:
   - Edit `quickActions` in `components/builder/AIEditPanel.tsx`
   - Add icon and instruction

3. **Customize theme**:
   - Edit `tailwind.config.ts`
   - Update colors in `app/globals.css`

## 🔑 Environment Variables

### Frontend (.env.local)
```bash
ANTHROPIC_API_KEY=sk-ant-...          # Claude API key
BLOB_READ_WRITE_TOKEN=vercel_blob_... # Vercel blob storage
PYTHON_API_URL=https://...            # Python backend URL
```

### Backend (.env)
```bash
ANTHROPIC_API_KEY=sk-ant-...          # Claude API key
ENVIRONMENT=production
ALLOWED_ORIGINS=https://your-app.vercel.app
```

## 🎨 Design Philosophy

- **Professional First**: Enterprise-grade UI/UX
- **Frictionless**: Minimal clicks, maximum productivity
- **AI-Assisted**: Natural language editing
- **Brand Safe**: Always maintains original styling
- **Fast**: Optimistic updates, background processing

## 📊 Current Status

### ✅ Completed
- Project structure and configuration
- All main UI components
- Upload and analysis flow
- Template review interface
- Report builder with 3-panel layout
- AI editing panel
- API routes (with mock data)
- Python backend structure

### 🚧 To Implement
- Full PowerPoint processing in Python backend
- Real AI categorization with Claude
- Actual slide editing and variable replacement
- Chart manipulation
- Database for storing templates
- User authentication (Clerk)
- Real-time collaboration
- Template marketplace

## 🛣 Roadmap

### Phase 1: MVP (Current)
- ✅ Core UI components
- ✅ Upload flow
- ✅ Template review
- ✅ AI editing interface
- ⏳ Basic PowerPoint generation

### Phase 2: Production
- PowerPoint parsing and manipulation
- Real AI editing with Claude
- Database integration
- User authentication
- Template storage

### Phase 3: Scale
- Real-time collaboration
- Template marketplace
- Advanced chart editing
- Mobile app
- API for integrations

## 🤝 Contributing

This is a professional project. Follow these guidelines:

1. TypeScript strict mode - no `any` types
2. Consistent component structure
3. Comprehensive error handling
4. Accessible UI (WCAG AA)
5. Performance optimized

## 📝 License

Proprietary - All rights reserved

## 🎓 Development Context

Built as a comprehensive full-stack application demonstrating:
- Modern React patterns (Server Components, Client Components)
- Type-safe API design
- AI integration best practices
- Enterprise UI/UX
- Microservice architecture

**Estimated Development Time**: 20 days (4 weeks) full-time

## 📞 Support

For issues or questions:
1. Check existing GitHub issues
2. Review documentation
3. Contact development team

## 🌟 Success Metrics

- **Week 1**: Upload + basic analysis working
- **Week 4**: Can generate edited presentation
- **Week 8**: 3 colleagues using regularly
- **Week 12**: 10 external users, $99/month pricing

---

Built with ❤️ for wealth advisors who deserve better tools.


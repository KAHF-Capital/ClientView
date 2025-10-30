# ClientView - AI-Powered Presentation Editor

A Next.js application for wealth advisors to upload, analyze, and edit PowerPoint presentations with AI assistance.

## 🚀 Quick Start

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# Anthropic API Key for AI features
ANTHROPIC_API_KEY=sk-ant-your-key-here

# Vercel Blob Storage Token
BLOB_READ_WRITE_TOKEN=vercel_blob_your-token-here
```

### Development

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

### Build

```bash
npm run build
npm start
```

## 📦 Features

### Current Features
- **Drag-and-Drop Upload**: Upload PowerPoint (.pptx) presentations up to 50MB
- **AI Analysis**: Automatically categorizes slides and detects variables
- **Enhanced PowerPoint Export**: Professional formatting with branding support
- **Variable Detection**: Automatically finds names, dates, currency, and percentages
- **Visual Builder**: Three-panel interface for editing slides
- **Branding Support**: Custom logos, colors, fonts, and footers

### Upcoming Features (See IMPLEMENTATION_PLAN.md)
- **Financial Charts**: Portfolio allocation, performance charts, risk matrices
- **AI Content Generation**: Executive summaries, market commentary, risk disclosures
- **Financial Calculations**: Portfolio metrics, risk analysis, performance attribution
- **Template Library**: Pre-built templates for common scenarios
- **User Authentication**: Multi-user support with roles
- **Real-time Collaboration**: Co-editing with multiple users

## 🚢 Deploy to Vercel

1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com)
3. Add environment variables in the Vercel dashboard:
   - `ANTHROPIC_API_KEY`
   - `BLOB_READ_WRITE_TOKEN`
4. Deploy

### Setting up Vercel Blob Storage

1. In your Vercel dashboard, go to Storage
2. Create a new Blob store
3. Copy the token to your environment variables

## 🛠 Tech Stack

- **Next.js 14** with App Router
- **TypeScript**
- **Tailwind CSS** + **shadcn/ui**
- **Framer Motion** for animations
- **Claude Sonnet 4** for AI features
- **Vercel Blob** for file storage

## 📖 Usage

### Try the Demo

Click "View Template Library" or "Open Builder" on the home page to explore the demo with mock data.

### Upload a Presentation

1. Drag and drop a PowerPoint file on the home page
2. Wait for analysis (automatic)
3. Review the template library
4. Use the builder to edit slides with AI

## 📝 Project Structure

```
ClientViewV/
├── app/
│   ├── page.tsx                        # Upload interface
│   ├── analyze/[id]/                   # Analysis loading
│   ├── template/[id]/                  # Template review
│   ├── builder/[id]/                   # Visual builder
│   └── api/                            # API routes
│       ├── export-pptx/                # PowerPoint export
│       ├── upload/                     # File upload
│       └── generate/                   # Presentation generation
├── components/
│   ├── ui/                             # UI components
│   ├── builder/                        # Builder components
│   └── Charts/                         # (To be created)
├── lib/
│   ├── pptx-parser.ts                  # PowerPoint parsing
│   ├── pptx-exporter.ts                # Basic export
│   ├── pptx-exporter-enhanced.ts       # Enhanced export
│   ├── types/branding.ts               # Branding config
│   ├── calculations/                   # (To be created)
│   ├── ai/                             # (To be created)
│   └── templates/                      # (To be created)
├── FEATURE_SPECIFICATION.md            # Complete feature spec
├── IMPLEMENTATION_PLAN.md              # Implementation guide
└── public/                             # Static assets
```

## 📚 Documentation

### Getting Started
- **README.md** - This file, quick start guide
- **USAGE_GUIDE.md** - Detailed usage instructions
- **QUICK_START_ENHANCEMENTS.md** - Quick enhancement guide

### Development
- **FEATURE_SPECIFICATION.md** - Complete feature specification
- **IMPLEMENTATION_PLAN.md** - Detailed implementation guide with code examples
- **IMPLEMENTATION_SUMMARY.md** - Summary of completed work
- **ENHANCEMENTS_COMPLETE.md** - Phase 1 completion summary

## 🔧 Development

### Linting

```bash
npm run lint
```

### Type Checking

The project uses TypeScript strict mode for type safety.

## 📄 License

Proprietary - All rights reserved

---

Built for wealth advisors who need efficient proposal editing tools.

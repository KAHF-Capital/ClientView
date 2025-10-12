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

- **Drag-and-Drop Upload**: Upload PowerPoint (.pptx) presentations up to 50MB
- **AI Analysis**: Automatically categorizes slides and detects variables
- **Template Library**: Visual slide library with category filtering
- **Visual Builder**: Figma-style interface for slide editing
- **AI Editing**: Natural language slide editing powered by Claude Sonnet 4

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
│   ├── page.tsx              # Upload interface
│   ├── analyze/[id]/         # Analysis loading
│   ├── template/[id]/        # Template review
│   ├── builder/[id]/         # Visual builder
│   └── api/                  # API routes
├── components/
│   ├── ui/                   # UI components
│   └── builder/              # Builder components
├── lib/                      # Utilities
└── public/                   # Static assets
```

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

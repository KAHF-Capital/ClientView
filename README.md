# ClientView - AI-Powered Presentation Editor

Next.js application for wealth advisors to upload, analyze, and edit PowerPoint presentations with AI assistance.

## Quick Start

```bash
npm install
```

Create `.env.local`:
```env
ANTHROPIC_API_KEY=sk-ant-your-key-here
BLOB_READ_WRITE_TOKEN=vercel_blob_your-token-here
```

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Features

- Drag-and-drop PowerPoint upload (.pptx up to 50MB)
- AI analysis and variable detection
- Visual builder with three-panel interface
- Enhanced PowerPoint export with branding
- Financial charts and calculations
- AI content generation
- Template library

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS + shadcn/ui
- Anthropic Claude AI
- Vercel Blob Storage

## Deploy

1. Push to GitHub
2. Import on [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy

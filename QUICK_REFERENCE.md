# Quick Reference Guide

## 🚀 Common Tasks

### Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run linting
npm run lint

# Format code with Prettier
npx prettier --write .

# Start Python backend
cd python-backend
python main.py
```

### Using New Utilities

#### Environment Variables
```typescript
import { env, features } from '@/lib/env'

if (features.aiEditing) {
  // Use AI features
}
```

#### API Client
```typescript
import { api } from '@/lib/api-client'

// GET request with retry
const data = await api.get('/api/template/123', {
  timeout: 30000,
  retries: 3
})

// POST with type safety
const result = await api.post<UploadResponse>('/api/upload', formData)
```

#### Logging
```typescript
import { log } from '@/lib/logger'

log.info('Processing file', { fileId: '123' })
log.error('Upload failed', error, { userId: 'abc' })
log.performance('File processing', 1234)
```

#### Error Handling (Components)
```typescript
import { ErrorBoundary } from '@/components/ErrorBoundary'

<ErrorBoundary>
  <YourComponent />
</ErrorBoundary>
```

#### Error Handling (API Routes)
```typescript
import { withErrorHandling, successResponse, validateMethod } from '@/lib/api-handler'

export const POST = withErrorHandling(async (req) => {
  validateMethod(req, ['POST'])
  
  const data = await processData()
  
  return successResponse(data)
})
```

#### Security
```typescript
import { validateFile, sanitizeInput } from '@/lib/security'

// Validate file upload
validateFile(file, {
  maxSize: 50 * 1024 * 1024,
  allowedTypes: ['.pptx']
})

// Sanitize user input
const clean = sanitizeInput(userInput)
```

#### Loading States
```typescript
import { SlideCardSkeleton, BuilderSkeleton } from '@/components/LoadingStates'

{loading ? <BuilderSkeleton /> : <Builder />}
```

#### Accessibility
```typescript
import { announceToScreenReader, trapFocus } from '@/lib/accessibility'

// Announce to screen readers
announceToScreenReader('File uploaded successfully')

// Trap focus in modal
useEffect(() => {
  const cleanup = trapFocus(modalRef.current)
  return cleanup
}, [])
```

### Type Safety

```typescript
import type { 
  Slide, 
  Template, 
  AIEditRequest,
  ApiResponse 
} from '@/lib/types/api'

const slide: Slide = {
  id: '1',
  title: 'Slide Title',
  // ...
}
```

## 📁 File Structure

```
ClientView/
├── app/
│   ├── api/                    # API routes
│   ├── (routes)/              # Pages
│   ├── globals.css            # Global styles + a11y
│   └── layout.tsx             # Root layout
├── components/
│   ├── ui/                    # shadcn components
│   ├── builder/               # Builder components
│   ├── ErrorBoundary.tsx      # Error boundary
│   └── LoadingStates.tsx      # Skeleton loaders
├── lib/
│   ├── types/
│   │   └── api.ts            # API types
│   ├── accessibility.ts       # a11y utilities
│   ├── api-client.ts         # API client
│   ├── api-handler.ts        # API route helpers
│   ├── env.ts                # Environment validation
│   ├── logger.ts             # Logging system
│   ├── security.ts           # Security utilities
│   └── utils.ts              # General utilities
├── python-backend/
│   └── main.py               # FastAPI server
├── ENVIRONMENT_SETUP.md      # Environment guide
├── IMPROVEMENTS_SUMMARY.md   # This guide
└── QUICK_REFERENCE.md        # Quick reference
```

## 🔑 Environment Variables

Required for full functionality:

```bash
ANTHROPIC_API_KEY=sk-ant-...
BLOB_READ_WRITE_TOKEN=vercel_blob_...
PYTHON_API_URL=http://localhost:8000
```

## 🐛 Debugging

### Check Environment
```typescript
import { env, features } from '@/lib/env'
console.log('Features:', features)
```

### View Logs
- **Development**: Colored console output
- **Production**: Structured JSON logs

### Common Issues

**"Module not found"**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Port in use**
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3000 | xargs kill
```

**Type errors**
```bash
# Check TypeScript
npx tsc --noEmit
```

## 📝 Code Style

### TypeScript
- Use `const` over `let`
- Avoid `any` types
- Add JSDoc comments for complex functions
- Use type imports: `import type { ... }`

### React
- Use functional components
- Extract complex logic to hooks
- Keep components under 200 lines
- Use meaningful prop names

### API Routes
- Always use error handling wrapper
- Validate inputs
- Return consistent responses
- Add rate limiting if needed

### Naming
- Components: `PascalCase`
- Functions: `camelCase`
- Constants: `UPPER_SNAKE_CASE`
- Types: `PascalCase`

## 🧪 Testing (Coming Soon)

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Coverage
npm run test:coverage
```

## 📚 Documentation

- `README.md` - Project overview
- `ENVIRONMENT_SETUP.md` - Environment variables
- `IMPROVEMENTS_SUMMARY.md` - All improvements
- `QUICK_REFERENCE.md` - This file
- `DEPLOYMENT.md` - Deployment guide

## 🎯 Next Features to Add

1. Database integration (Prisma/MongoDB)
2. User authentication (Clerk/Auth0)
3. PowerPoint processing backend
4. Real AI integration
5. Automated testing suite
6. CI/CD pipeline

## 💡 Tips

- Use the logger instead of `console.log`
- Always validate user input
- Handle errors gracefully
- Add loading states
- Test accessibility with keyboard
- Check mobile responsiveness
- Review security checklist before deploying

---

**Questions?** Check the inline documentation in the code!


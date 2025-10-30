# ClientView Pro - Complete Feature Specification

## Executive Summary

Transform ClientView from a basic PowerPoint editor into a fully-featured, AI-powered proposal editor for Private Wealth Management advisors with PowerPoint download functionality.

## Current State Analysis

### ✅ What Works Now
- Basic PowerPoint file upload (.pptx)
- Client-side parsing with JSZip & xml2js
- Variable detection (names, dates, currency, percentages)
- Simple slide categorization
- Basic editor with three-panel layout
- PowerPoint download functionality (basic)

### ❌ What's Missing
- Advanced canvas editor with drag-and-drop
- Financial chart libraries
- AI content generation
- Real-time data integration
- User authentication
- Template library system
- Financial calculations
- Collaborative editing
- Mobile responsiveness

---

## Phase 1: Enhanced PowerPoint Engine (MVP)

### 1.1 Advanced PowerPoint Parsing
**Priority**: Critical  
**Timeline**: Week 1-2

**Features**:
- Parse images from slides
- Extract chart data (existing charts in .pptx)
- Preserve complex shapes and formatting
- Extract tables with proper structure
- Font and styling preservation
- Master slide detection
- Notes section extraction

**Implementation**:
```typescript
// Enhanced parser interface
interface ParsedSlide {
  id: string
  index: number
  title: string
  textContent: string
  category: string
  variables: Record<string, string>
  hasCharts: boolean
  charts: ChartData[]  // NEW
  hasImages: boolean
  images: ImageData[]  // NEW
  hasTables: boolean
  tables: TableData[]  // NEW
  styling: SlideStyling  // NEW
  rawXml: string
}
```

### 1.2 Advanced PowerPoint Generation
**Priority**: Critical  
**Timeline**: Week 2-3

**Features**:
- Use pptxgenjs for server-side generation
- Preserve images in output
- Generate charts programmatically
- Export with proper formatting
- Master slide application
- Notes section preservation
- Custom layouts
- Watermarks and branding

**Implementation**:
```typescript
// Enhanced exporter
async function exportPresentationPro(
  slides: ParsedSlide[],
  replacements: VariableReplacement,
  branding: BrandingOptions,
  fileName: string
): Promise<void>
```

---

## Phase 2: Advanced Canvas Editor

### 2.1 Drag-and-Drop Canvas
**Priority**: High  
**Timeline**: Week 3-5

**Technology**: Fabric.js or Konva.js

**Features**:
- Grid and snap-to-guide system
- Multi-select objects
- Layer management
- Object alignment tools
- Undo/redo (up to 50 actions)
- Zoom and pan controls
- Ruler guides
- Keyboard shortcuts

**Components**:
```typescript
// Canvas Editor Structure
components/
├── Editor/
│   ├── CanvasCanvas.tsx       // Main drawing area
│   ├── Toolbar.tsx            // Top toolbar
│   ├── PropertyPanel.tsx      // Right side properties
│   ├── LayerPanel.tsx         // Left side layers
│   └── ComponentLibrary.tsx   // Bottom component picker
```

### 2.2 Component Library
**Priority**: High  
**Timeline**: Week 5-7

**Financial Components**:
- Portfolio allocation charts (pie, donut, treemap)
- Performance line charts
- Asset comparison bars
- Risk/return scatter plots
- Performance tables
- Holdings tables
- Metric cards
- Text blocks with rich formatting
- Image placeholders
- Shape library

**Implementation**:
```typescript
interface Component {
  id: string
  type: 'chart' | 'table' | 'text' | 'image' | 'shape'
  category: 'portfolio' | 'performance' | 'risk' | 'layout'
  config: ComponentConfig
  icon: ReactNode
}
```

### 2.3 Rich Text Editing
**Priority**: High  
**Timeline**: Week 4

**Features**:
- WYSIWYG text editing
- Font selection and sizing
- Color picker
- Text alignment
- Bullets and numbering
- Hyperlinks
- Line spacing
- Text transforms

---

## Phase 3: Data Integration & Visualization

### 3.1 Financial Charts
**Priority**: High  
**Timeline**: Week 6-8

**Libraries**: Recharts + D3.js for custom charts

**Chart Types**:
1. **Portfolio Allocation**
   - Pie chart (animated)
   - Donut chart
   - Treemap
   - Stacked bar

2. **Performance Charts**
   - Time series line
   - Cumulative returns
   - Rolling returns
   - Drawdown chart

3. **Risk Analysis**
   - Risk/return scatter
   - Volatility heatmap
   - Correlation matrix
   - VaR visualization

4. **Comparative Analysis**
   - Benchmark comparison
   - Peer group analysis
   - Asset correlation
   - Sector allocation

**Implementation**:
```typescript
// Reusable chart components
components/
├── Charts/
│   ├── PortfolioAllocation.tsx
│   ├── PerformanceChart.tsx
│   ├── RiskMatrix.tsx
│   ├── MonteCarloSimulation.tsx
│   └── ChartConfigPanel.tsx
```

### 3.2 Real-time Data Integration
**Priority**: Medium  
**Timeline**: Week 8-10

**Data Sources**:
- Alpha Vantage (free tier)
- IEX Cloud
- Yahoo Finance API
- Custom portfolio API (future)

**Features**:
- Real-time quote fetching
- Historical price data
- Company fundamentals
- Economic indicators
- Market news feed

**API Structure**:
```typescript
// Data service
interface DataService {
  getQuote(symbol: string): Promise<Quote>
  getHistoricalPrices(symbol: string, period: string): Promise<Price[]>
  searchSymbols(query: string): Promise<Symbol[]>
  getCompanyInfo(symbol: string): Promise<CompanyInfo>
}
```

---

## Phase 4: AI Content Generation

### 4.1 AI Integration
**Priority**: High  
**Timeline**: Week 9-11

**Current**: Anthropic Claude (already integrated)

**AI Features**:
1. **Executive Summary Generator**
   - Inputs: portfolio, risk profile, objectives
   - Output: Professional 2-3 paragraph summary

2. **Market Commentary**
   - Inputs: date range, sectors
   - Output: Market analysis narrative

3. **Strategy Narrative**
   - Inputs: asset allocation, rationale
   - Output: Investment strategy explanation

4. **Risk Disclosure**
   - Inputs: portfolio composition, risk metrics
   - Output: Compliance-ready risk disclosures

**Implementation**:
```typescript
// AI Service
interface AIService {
  generateSummary(context: ProposalContext): Promise<string>
  generateCommentary(marketData: MarketData): Promise<string>
  generateStrategy(allocation: Allocation): Promise<string>
  generateDisclosure(risks: RiskProfile): Promise<string>
  analyzePortfolio(portfolio: Portfolio): Promise<Analysis>
}
```

### 4.2 Prompt Templates
**Priority**: High  
**Timeline**: Week 10

**Stored Prompts**:
```typescript
const PROMPT_TEMPLATES = {
  executiveSummary: `
    Generate a professional executive summary for a wealth management proposal.
    Client: {clientName}
    Portfolio Value: {portfolioValue}
    Risk Profile: {riskProfile}
    Objectives: {objectives}
    Key Recommendations: {recommendations}
    
    Tone: Professional, clear, client-focused
    Length: 3-4 paragraphs
  `,
  
  marketCommentary: `
    Write market commentary covering:
    Period: {startDate} to {endDate}
    Market Performance: {marketPerformance}
    Key Events: {keyEvents}
    
    Include:
    - Summary of market conditions
    - Impact on client portfolio
    - Forward-looking outlook
    - Key risks to monitor
  `,
  
  riskDisclosure: `
    Generate a comprehensive risk disclosure for:
    Portfolio Holdings: {holdings}
    Risk Metrics: {metrics}
    Client Risk Tolerance: {tolerance}
    
    Ensure compliance with SEC regulations.
  `
}
```

---

## Phase 5: Financial Calculations

### 5.1 Calculation Engine
**Priority**: Medium  
**Timeline**: Week 11-13

**Calculations**:
1. **Portfolio Metrics**
   - Total return (%)
   - Annualized return
   - Volatility (standard deviation)
   - Sharpe ratio
   - Sortino ratio
   - Beta
   - Alpha
   - Maximum drawdown
   - CAGR

2. **Risk Analysis**
   - Value at Risk (VaR)
   - Conditional VaR (CVaR)
   - Portfolio beta
   - Correlation matrix
   - Diversification ratio

3. **Performance Attribution**
   - Asset contribution
   - Sector contribution
   - Active vs passive
   - Timing vs selection

4. **Fee Analysis**
   - Total fees (annual)
   - Fee impact on returns
   - Fee comparison

**Implementation**:
```typescript
// Calculation library
lib/
├── calculations/
│   ├── portfolioMetrics.ts
│   ├── riskAnalysis.ts
│   ├── performanceAttribution.ts
│   └── feeAnalysis.ts
```

### 5.2 Portfolio Optimization
**Priority**: Low  
**Timeline**: Week 13-14

**Features**:
- Efficient frontier calculation
- Rebalancing suggestions
- Tax-loss harvesting opportunities
- Asset location optimization

---

## Phase 6: Template System

### 6.1 Template Library
**Priority**: High  
**Timeline**: Week 12-14

**Pre-built Templates**:
1. Quarterly Investment Review
2. New Client Onboarding
3. Portfolio Rebalancing
4. Market Outlook Presentation
5. Risk Assessment Report
6. Estate Planning Proposal
7. Alternative Investment Proposal

**Template Structure**:
```typescript
interface Template {
  id: string
  name: string
  category: string
  description: string
  thumbnail: string
  slides: TemplateSlide[]
  variables: string[]
  branding: BrandingConfig
}
```

**Implementation**:
```typescript
// Template management
lib/
├── templates/
│   ├── quarterlyReview.json
│   ├── newClientOnboarding.json
│   ├── rebalancing.json
│   └── ...
```

### 6.2 Custom Template Builder
**Priority**: Medium  
**Timeline**: Week 14-15

**Features**:
- Save current proposal as template
- Template marketplace (future)
- Share templates within organization
- Template versioning

---

## Phase 7: User Management & Collaboration

### 7.1 Authentication System
**Priority**: High  
**Timeline**: Week 15-17

**Technology**: Auth0, Supabase, or NextAuth.js

**Features**:
- Email/password authentication
- SSO integration (Google, Microsoft)
- Multi-factor authentication (MFA)
- Password reset
- Session management
- Remember me

**User Roles**:
- Admin: Full access
- Advisor: Create/edit proposals
- Junior Advisor: Edit assigned proposals
- Viewer: Read-only access

**Implementation**:
```typescript
// Auth integration
lib/
├── auth/
│   ├── authProvider.tsx
│   ├── authUtils.ts
│   └── middleware.ts
```

### 7.2 Workspace & Client Management
**Priority**: Medium  
**Timeline**: Week 17-18

**Features**:
- Organization/workspace setup
- Client profile management
- Client search and filtering
- Client tagging
- CRM integration placeholders

**Database Schema**:
```typescript
interface Organization {
  id: string
  name: string
  subscriptionTier: 'basic' | 'pro' | 'enterprise'
  settings: OrgSettings
}

interface Client {
  id: string
  orgId: string
  name: string
  email?: string
  riskProfile: RiskProfile
  objectives: string[]
  netWorth?: number
  metadata: Record<string, any>
}
```

### 7.3 Collaboration Features
**Priority**: Low  
**Timeline**: Week 18-20

**Features**:
- Real-time co-editing (Socket.io)
- Comments and annotations
- Version history
- Activity feed
- User presence indicators
- Shareable links

**Future**: Full collaborative editing with operational transforms

---

## Phase 8: Advanced Features

### 8.1 Branding & Customization
**Priority**: Medium  
**Timeline**: Week 16

**Features**:
- Custom logo upload
- Color theme selection
- Font family selection
- Watermark support
- Custom footer
- Headers and page numbers

**Implementation**:
```typescript
interface BrandingConfig {
  logo?: string
  primaryColor: string
  secondaryColor: string
  fontFamily: string
  watermark?: string
  header?: string
  footer?: string
}
```

### 8.2 Export & Distribution
**Priority**: High  
**Timeline**: Week 7, 19

**Export Formats**:
- PowerPoint (.pptx) ✅ (Basic - enhance in Phase 1)
- PDF (high quality)
- Excel (data tables)
- Image (PNG/JPG per slide)

**Features**:
- Custom filename
- Email delivery
- Download link generation
- Print-ready PDFs
- Bulk export

### 8.3 Mobile Experience
**Priority**: Low  
**Timeline**: Week 20

**Features**:
- Responsive design
- Mobile-optimized editing
- Touch gestures
- Mobile preview mode

---

## Technical Implementation Details

### Enhanced Dependencies

```json
{
  "dependencies": {
    "next": "14.2.0",
    "react": "18.3.0",
    "typescript": "5.0.0",
    
    // PowerPoint
    "pptxgenjs": "^3.12.0",
    "jszip": "^3.10.0",
    "xml2js": "^0.6.0",
    
    // Canvas Editor
    "fabric": "^5.3.0",
    "react-grid-layout": "^1.4.0",
    "@tiptap/react": "^2.1.0",
    "@tiptap/starter-kit": "^2.1.0",
    
    // Charts
    "recharts": "^2.10.0",
    "d3": "^7.9.0",
    
    // State Management
    "zustand": "^4.5.0",
    "@tanstack/react-query": "^5.17.0",
    
    // AI
    "@anthropic-ai/sdk": "^0.18.0",
    
    // Auth
    "next-auth": "^5.0.0",
    
    // Data
    "axios": "^1.6.0",
    "date-fns": "^3.0.0",
    
    // UI
    "tailwindcss": "^3.4.0",
    "framer-motion": "^11.0.0",
    "lucide-react": "^0.300.0",
    
    // Utilities
    "zod": "^3.22.0",
    "nanoid": "^5.0.0"
  }
}
```

### Project Structure

```
ClientViewV/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── signup/
│   ├── (dashboard)/
│   │   ├── dashboard/
│   │   ├── clients/
│   │   ├── proposals/
│   │   └── templates/
│   ├── editor/[id]/
│   ├── api/
│   │   ├── auth/
│   │   ├── proposals/
│   │   ├── ai/
│   │   ├── data/
│   │   └── export/
│   └── layout.tsx
├── components/
│   ├── Editor/          # Canvas editor components
│   ├── Charts/          # Financial chart components
│   ├── AI/              # AI generation components
│   ├── DataTables/      # Table components
│   ├── Collaboration/   # Real-time collaboration
│   └── ui/              # shadcn components
├── lib/
│   ├── auth/            # Authentication logic
│   ├── calculations/    # Financial calculations
│   ├── data/            # Data fetching services
│   ├── ai/              # AI service integration
│   ├── export/          # PowerPoint/PDF export
│   ├── templates/       # Template definitions
│   └── utils/           # Utilities
├── hooks/               # Custom React hooks
├── types/               # TypeScript types
├── public/              # Static assets
└── .env.local          # Environment variables
```

### API Routes

```typescript
// New API routes to implement
app/api/
├── proposals/
│   ├── [id]/
│   │   ├── route.ts          // GET, PUT, DELETE
│   │   └── duplicate/
│   │       └── route.ts
│   └── export/
│       └── route.ts
├── ai/
│   ├── generate-summary/
│   ├── generate-commentary/
│   ├── generate-strategy/
│   └── analyze-portfolio/
├── data/
│   ├── quote/
│   ├── historical/
│   ├── search/
│   └── portfolio-analytics/
├── templates/
│   └── [id]/
├── clients/
│   └── [id]/
└── auth/
    ├── login/
    ├── signup/
    └── logout/
```

---

## Database Schema

### PostgreSQL Tables

```sql
-- Organizations
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  subscription_tier VARCHAR(50),
  settings JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Users
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  role VARCHAR(50),
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  preferences JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Clients
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id),
  name VARCHAR(255) NOT NULL,
  risk_profile VARCHAR(50),
  investment_objectives TEXT[],
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Proposals
CREATE TABLE proposals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(id),
  created_by UUID REFERENCES users(id),
  title VARCHAR(255) NOT NULL,
  status VARCHAR(50),
  content JSONB,
  version INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Templates
CREATE TABLE templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id),
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  structure JSONB,
  is_global BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Portfolios
CREATE TABLE portfolios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(id),
  name VARCHAR(255) NOT NULL,
  holdings JSONB,
  performance_data JSONB,
  updated_at TIMESTAMP DEFAULT NOW()
);
```

---

## Security & Compliance

### Security Measures
1. ✅ HTTPS everywhere
2. ✅ Input validation and sanitization
3. ✅ SQL injection prevention (parameterized queries)
4. ✅ XSS protection
5. ✅ CSRF tokens
6. ✅ Rate limiting on API routes
7. ✅ Environment variable encryption
8. ✅ Audit logging

### Compliance
1. SOC 2 Type II (future)
2. GDPR compliance (data export/deletion)
3. PCI DSS (if handling payments)
4. Financial data encryption at rest

---

## Development Roadmap

### MVP (Weeks 1-8)
- ✅ Enhanced PowerPoint parsing
- ✅ Advanced PowerPoint export
- ✅ Basic canvas editor
- ✅ Component library (charts, tables)
- ✅ AI content generation basics
- ✅ Template system basics

### Phase 2 (Weeks 9-15)
- Data integration
- Financial calculations
- Advanced AI features
- Branding & customization
- User authentication
- Client management

### Phase 3 (Weeks 16-20)
- Collaboration features
- Mobile optimization
- Performance optimization
- Advanced export options
- Admin dashboard

---

## Success Metrics

### Technical Metrics
- Page load time: < 2 seconds
- Canvas rendering: 60 FPS
- API response time: < 500ms
- Zero critical bugs
- >90% test coverage

### Business Metrics
- User engagement: Daily active users
- Feature adoption: AI usage rate
- Quality: User satisfaction score
- Performance: Export success rate

---

## Next Steps

1. ✅ Review and approve this specification
2. Set up enhanced development environment
3. Begin Phase 1: Enhanced PowerPoint Engine
4. Weekly progress reviews
5. User testing at MVP completion

---

*This specification is a living document and will be updated as development progresses.*


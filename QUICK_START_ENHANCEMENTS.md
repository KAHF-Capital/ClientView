# ClientView Pro - Quick Start Enhancement Guide

## Overview
This guide provides step-by-step instructions to immediately enhance ClientView with critical features for a production-ready proposal editor.

## Critical Path (Do First)

### 1. Fix PowerPoint Export (Day 1-2)
**Problem**: Current export loses all formatting, images, and charts

**Solution**: Enhance the export API route

**Steps**:
1. Update `app/api/export-pptx/route.ts` with better formatting
2. Add support for charts and images
3. Test with real PowerPoint files

### 2. Add Financial Charts (Day 3-5)
**Problem**: No actual chart components exist

**Solution**: Install Recharts and create chart components

**Steps**:
```bash
npm install recharts d3 @types/d3
```

Create:
- `components/Charts/PortfolioAllocation.tsx`
- `components/Charts/PerformanceChart.tsx`
- `components/Charts/RiskMatrix.tsx`

### 3. Add AI Generation (Day 6-8)
**Problem**: AI integration exists but no actual features

**Solution**: Create AI service and API routes

**Steps**:
1. Create `lib/ai/content-generator.ts`
2. Create API routes for AI features
3. Add AI generation UI components

### 4. Financial Calculations (Day 9-10)
**Problem**: No financial math capabilities

**Solution**: Create calculation library

**Steps**:
1. Create `lib/calculations/` directory
2. Implement portfolio metrics
3. Implement risk calculations

## Installation Commands

```bash
# Install all new dependencies at once
npm install recharts d3 @types/d3 zustand @tanstack/react-query

# Or install incrementally as you work through phases
```

## File Creation Checklist

### Phase 1: Enhanced Export
- [ ] Create `lib/pptx-exporter-enhanced.ts`
- [ ] Update `app/api/export-pptx/route.ts`
- [ ] Create `lib/types/branding.ts`

### Phase 2: Charts
- [ ] Create `components/Charts/PortfolioAllocation.tsx`
- [ ] Create `components/Charts/PerformanceChart.tsx`
- [ ] Create `components/Charts/RiskMatrix.tsx`
- [ ] Create `components/Charts/index.ts`

### Phase 3: AI
- [ ] Create `lib/ai/content-generator.ts`
- [ ] Create `app/api/ai/generate-summary/route.ts`
- [ ] Create `app/api/ai/generate-commentary/route.ts`
- [ ] Create `components/AI/ContentGenerator.tsx`

### Phase 4: Calculations
- [ ] Create `lib/calculations/portfolioMetrics.ts`
- [ ] Create `lib/calculations/riskAnalysis.ts`
- [ ] Create `lib/calculations/index.ts`

### Phase 5: Templates
- [ ] Create `lib/templates/quarterlyReview.json`
- [ ] Create `lib/templates/newClientOnboarding.json`
- [ ] Create `lib/templates/portfolioRebalancing.json`
- [ ] Create `lib/template-manager.ts`

### Phase 6: Auth
- [ ] Create `lib/auth.ts`
- [ ] Create `app/api/auth/[...nextauth]/route.ts`
- [ ] Create `components/Auth/LoginForm.tsx`

## Testing Checklist

### PowerPoint Export
- [ ] Upload a real .pptx file
- [ ] Edit variables
- [ ] Download and verify formatting
- [ ] Check if images preserved
- [ ] Verify charts work

### Charts
- [ ] Render portfolio allocation chart
- [ ] Render performance line chart
- [ ] Test with sample data
- [ ] Verify responsive design

### AI
- [ ] Generate executive summary
- [ ] Generate market commentary
- [ ] Generate risk disclosure
- [ ] Test error handling

### Calculations
- [ ] Calculate total return
- [ ] Calculate Sharpe ratio
- [ ] Calculate max drawdown
- [ ] Verify math correctness

## Environment Variables Needed

Add to `.env.local`:
```bash
# Existing
ANTHROPIC_API_KEY=sk-ant-your-key-here
BLOB_READ_WRITE_TOKEN=vercel_blob_your-token-here

# New - if adding data integration
ALPHA_VANTAGE_API_KEY=your-key-here
NEXT_PUBLIC_APP_URL=http://localhost:3000

# New - if adding auth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-here

# New - if adding database
DATABASE_URL=postgresql://...
```

## Priority Actions (Right Now)

1. **Fix PowerPoint Export** - This is the #1 user complaint
2. **Add Charts** - Essential for financial proposals
3. **Add AI Features** - Major differentiator
4. **Add Calculations** - Required for professional proposals
5. **Everything Else** - Can wait for Phase 2

## Success Criteria

### MVP Complete When:
- ✅ Can upload .pptx file
- ✅ Export maintains formatting
- ✅ Can add charts to slides
- ✅ AI generates content
- ✅ Financial calculations work
- ✅ Can download professional .pptx

### Ready for Production When:
- ✅ All MVP features work
- ✅ User authentication implemented
- ✅ Tested with real data
- ✅ No critical bugs
- ✅ Performance acceptable
- ✅ Documentation complete

## Quick Wins

These are easy to implement and have high impact:

1. **Better export formatting** (2 hours) - Immediately improves output quality
2. **Add sample chart data** (1 hour) - Makes charts work immediately
3. **AI generation UI** (2 hours) - User-facing AI feature
4. **Better error messages** (1 hour) - Improves UX

## Getting Help

- Check FEATURE_SPECIFICATION.md for complete feature list
- Check IMPLEMENTATION_PLAN.md for detailed implementation
- Review existing code in lib/ and components/
- Test with real PowerPoint files

## Next Steps After MVP

1. User feedback
2. Performance optimization
3. Additional templates
4. Mobile optimization
5. Collaboration features
6. CRM integrations


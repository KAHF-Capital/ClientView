# Pre-Deployment Checklist

Use this checklist before deploying to production to ensure everything is configured correctly.

## 🔐 Security

- [ ] Environment variables are set in production (Vercel/Railway)
- [ ] `ALLOWED_ORIGINS` is configured (no wildcards)
- [ ] API keys are not exposed in client-side code
- [ ] CORS is properly configured
- [ ] Rate limiting is enabled
- [ ] Security headers are added
- [ ] File upload validation is in place
- [ ] Input sanitization is working
- [ ] SQL injection prevention is active
- [ ] Path traversal prevention is active

## 🌐 Environment

- [ ] `.env.local` is in `.gitignore`
- [ ] Production environment variables are documented
- [ ] `ANTHROPIC_API_KEY` is set
- [ ] `BLOB_READ_WRITE_TOKEN` is set
- [ ] `PYTHON_API_URL` points to production backend
- [ ] `NODE_ENV=production` is set
- [ ] All required env vars are validated

## 🧪 Testing

- [ ] All features work in development
- [ ] File upload works correctly
- [ ] AI editing is functional (if enabled)
- [ ] Error handling works as expected
- [ ] Loading states display correctly
- [ ] Error boundaries catch errors gracefully
- [ ] API routes return correct responses
- [ ] Rate limiting doesn't block legitimate users

## ♿ Accessibility

- [ ] Keyboard navigation works
- [ ] Skip to main content link works
- [ ] Screen reader testing passed
- [ ] Color contrast meets WCAG AA
- [ ] Focus indicators are visible
- [ ] Alt text on all images
- [ ] Form labels are present
- [ ] ARIA labels where needed

## 📱 Responsive Design

- [ ] Desktop layout works (1920px+)
- [ ] Laptop layout works (1366px)
- [ ] Tablet layout works (768px)
- [ ] Mobile layout works (375px)
- [ ] No horizontal scrolling
- [ ] Touch targets are 44px minimum
- [ ] Text is readable at all sizes

## ⚡ Performance

- [ ] Images are optimized
- [ ] Code is minified (Next.js automatic)
- [ ] Bundle size is acceptable
- [ ] Loading times are reasonable
- [ ] No console errors
- [ ] No console warnings
- [ ] Memory leaks checked

## 🔍 SEO & Meta

- [ ] Page titles are descriptive
- [ ] Meta descriptions are present
- [ ] Open Graph tags added
- [ ] Favicon is present
- [ ] robots.txt configured
- [ ] sitemap.xml added (if needed)

## 📊 Monitoring

- [ ] Error tracking set up (Sentry recommended)
- [ ] Analytics configured (Vercel Analytics)
- [ ] Logging is working
- [ ] Performance monitoring enabled
- [ ] Uptime monitoring configured

## 🐛 Error Handling

- [ ] Error boundaries in place
- [ ] Global error handler configured
- [ ] API errors return proper status codes
- [ ] User-friendly error messages
- [ ] Errors are logged properly
- [ ] No exposed stack traces in production

## 📦 Dependencies

- [ ] All dependencies installed: `npm install`
- [ ] No critical vulnerabilities: `npm audit`
- [ ] Unused dependencies removed
- [ ] Dependency versions locked in `package-lock.json`

## 🎨 Code Quality

- [ ] ESLint passes: `npm run lint`
- [ ] No TypeScript errors: `npx tsc --noEmit`
- [ ] Code is formatted: `npx prettier --check .`
- [ ] No `console.log` statements in production code
- [ ] No commented-out code
- [ ] No TODO comments for critical items

## 🚀 Deployment

### Frontend (Vercel)

- [ ] Project connected to Vercel
- [ ] Build succeeds: `npm run build`
- [ ] Environment variables added in Vercel dashboard
- [ ] Vercel Blob storage configured
- [ ] Domain configured (if custom)
- [ ] SSL certificate active
- [ ] Preview deployments working

### Backend (Railway/Other)

- [ ] Python backend deployed
- [ ] Health check endpoint works: `/health`
- [ ] Environment variables set
- [ ] CORS allows frontend domain
- [ ] Rate limiting configured
- [ ] Python dependencies installed
- [ ] Server is running and accessible

## 📝 Documentation

- [ ] README.md is up to date
- [ ] API documentation is current
- [ ] Environment setup guide is complete
- [ ] Deployment guide is accurate
- [ ] Code comments are helpful
- [ ] Type definitions are documented

## 🔄 Post-Deployment

- [ ] Smoke test all critical features
- [ ] Check production logs for errors
- [ ] Monitor performance metrics
- [ ] Test from different locations
- [ ] Test on different devices
- [ ] Verify analytics are working
- [ ] Check error tracking is active

## 🆘 Rollback Plan

- [ ] Previous version tagged in git
- [ ] Rollback procedure documented
- [ ] Database migration rollback ready (if applicable)
- [ ] Team knows how to rollback
- [ ] Contact info for emergencies

## 📈 Success Metrics

Define what success looks like:

- [ ] Page load time < 3 seconds
- [ ] Error rate < 1%
- [ ] Uptime > 99.9%
- [ ] Positive user feedback
- [ ] No critical bugs reported

## 🔔 Notifications

- [ ] Team notified of deployment
- [ ] Users notified (if applicable)
- [ ] Changelog published
- [ ] Social media updated (if applicable)

---

## Quick Deploy Commands

### Frontend (Vercel)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Backend (Railway)
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login and deploy
railway login
cd python-backend
railway up
```

### Environment Variables

**Frontend (.env.local):**
```bash
ANTHROPIC_API_KEY=sk-ant-...
BLOB_READ_WRITE_TOKEN=vercel_blob_...
PYTHON_API_URL=https://your-backend.railway.app
NODE_ENV=production
```

**Backend (.env):**
```bash
ANTHROPIC_API_KEY=sk-ant-...
ENVIRONMENT=production
ALLOWED_ORIGINS=https://your-app.vercel.app
PORT=8000
```

---

## 🚨 Common Issues

### Build Fails
- Check TypeScript errors: `npx tsc --noEmit`
- Check for missing dependencies
- Verify environment variables are set

### 500 Errors
- Check server logs
- Verify environment variables
- Check database connection (if applicable)

### CORS Errors
- Verify `ALLOWED_ORIGINS` includes frontend URL
- Check CORS middleware configuration
- Ensure no trailing slashes in URLs

### Rate Limiting Issues
- Adjust rate limits if needed
- Check if legitimate traffic is blocked
- Consider IP whitelisting for known services

---

## 📞 Support Contacts

- **Primary Developer:** [Your name/email]
- **DevOps:** [DevOps contact]
- **Emergency:** [Emergency contact]

---

**Last Updated:** October 12, 2025

**Deployment Status:** ⏳ Ready for deployment after checklist completion

---

## ✅ Sign-Off

- [ ] Developer reviewed and approved
- [ ] QA tested (if applicable)
- [ ] Product owner approved
- [ ] Security review passed
- [ ] Ready for production

**Deployed By:** _________________  
**Date:** _________________  
**Time:** _________________  
**Version:** _________________


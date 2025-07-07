# Vercel Deployment Guide

## 🚀 Production Deployment Setup

### Prerequisites
- Vercel account connected to GitHub repository
- Environment variables configured in Vercel dashboard

### Environment Variables (Vercel Dashboard)

#### Production Environment
```bash
VITE_APP_ENV=production
VITE_APP_NAME=BabySim
VITE_APP_VERSION=1.0.0
NODE_ENV=production

# API Configuration
VITE_API_BASE_URL=https://api.babysim.fun
VITE_API_TIMEOUT=5000

# Feature Flags
VITE_ENABLE_DEBUG=false
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_ERROR_REPORTING=true
VITE_ENABLE_PERFORMANCE_MONITORING=true

# Monitoring (Replace with actual values)
VITE_SENTRY_DSN=https://your-production-sentry-dsn@sentry.io/project
VITE_SENTRY_ENVIRONMENT=production
VITE_SENTRY_RELEASE=1.0.0
VITE_ANALYTICS_ID=GA-PRODUCTION-ID
VITE_LOGROCKET_APP_ID=your-logrocket-app-id

# Build Optimization
VITE_SOURCEMAP=false
VITE_MINIFY=true
VITE_TREE_SHAKE=true
VITE_CODE_SPLITTING=true
VITE_COMPRESSION=true

# Security
VITE_CSP_NONCE_ENABLED=true
VITE_ENABLE_STRICT_MODE=false
VITE_SECURE_HEADERS=true

# Performance
VITE_PRELOAD_CRITICAL=true
VITE_LAZY_LOAD_IMAGES=true
VITE_SERVICE_WORKER=true

# Sentry Build Integration (Optional)
SENTRY_ORG=your-sentry-org
SENTRY_PROJECT=babysim-clone
SENTRY_AUTH_TOKEN=your-sentry-auth-token
```

### Deployment Process

1. **Connect Repository**
   ```bash
   # Connect your GitHub repository to Vercel
   # Vercel will auto-detect the project type
   ```

2. **Configure Build Settings**
   - Build Command: `npm run build:production`
   - Output Directory: `dist`
   - Install Command: `npm ci`

3. **Set Environment Variables**
   - Add all production environment variables in Vercel dashboard
   - Ensure sensitive keys (Sentry, LogRocket) are properly configured

4. **Deploy**
   ```bash
   # Automatic deployment on push to main branch
   git push origin main
   ```

### Manual Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to staging
vercel --env .env.staging

# Deploy to production
vercel --prod --env .env.production
```

### Post-Deployment Checklist

- [ ] Verify application loads correctly
- [ ] Check Sentry for error reporting
- [ ] Verify LogRocket session recording
- [ ] Test Core Web Vitals in Lighthouse
- [ ] Confirm security headers are applied
- [ ] Test SPA routing with direct URL access
- [ ] Verify asset caching is working

### Performance Optimizations Applied

- **Code Splitting**: Vendor, UI, and scenario chunks
- **Asset Optimization**: Hash-based naming for cache busting
- **Compression**: Terser minification with console.log removal
- **Caching**: 1-year cache for static assets
- **Security Headers**: Frame protection, content type sniffing prevention

### Monitoring Integration

- **Sentry**: Error tracking and performance monitoring
- **LogRocket**: Session replay and user behavior analysis
- **Web Vitals**: Core performance metrics tracking
- **Custom Analytics**: Game-specific event tracking

### Troubleshooting

#### Build Failures
```bash
# Check TypeScript errors
npm run typecheck

# Check linting errors
npm run lint

# Test build locally
npm run build:production
```

#### Performance Issues
- Monitor bundle size with `npm run analyze`
- Check Lighthouse scores in Vercel deployment
- Review Core Web Vitals in production

#### Monitoring Issues
- Verify environment variables are set correctly
- Check Sentry DSN configuration
- Ensure LogRocket App ID is valid

### Rollback Strategy
```bash
# Rollback to previous deployment
vercel rollback [deployment-url]

# Or redeploy specific commit
git checkout [previous-commit]
git push origin main --force
```
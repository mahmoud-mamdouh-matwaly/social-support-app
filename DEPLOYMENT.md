# Deployment Guide

This guide explains how to deploy the Social Support Portal application using GitHub Actions and GitHub Pages.

## 🚀 Automatic Deployment (Recommended)

### Prerequisites
- GitHub repository
- GitHub Pages enabled in repository settings

### Setup Steps

1. **Push your code to GitHub**:
   ```bash
   git add .
   git commit -m "Add deployment configuration"
   git push origin main
   ```

2. **Enable GitHub Pages**:
   - Go to your repository settings
   - Navigate to "Pages" section
   - Select "Deploy from a branch"
   - Choose "gh-pages" branch
   - Click "Save"

3. **Configure Repository Settings**:
   - Ensure the repository name matches the base path in `vite.config.ts`
   - If your repository is named differently, update the base path:
     ```typescript
     base: process.env.NODE_ENV === 'production' ? '/your-repo-name/' : '/',
     ```

### How it Works

The GitHub Actions workflow (`.github/workflows/deploy.yml`) automatically:

1. **Triggers** on every push to the `main` branch
2. **Sets up** Node.js environment
3. **Installs** dependencies with `npm ci`
4. **Runs** linting with `npm run lint`
5. **Runs** tests with `npm test`
6. **Builds** the application with `npm run build`
7. **Deploys** to GitHub Pages using the `gh-pages` branch

### Environment Variables

Add these to your GitHub repository secrets if needed:
- `VITE_OPENAI_API_KEY`: Your OpenAI API key (optional)
- `VITE_APP_NAME`: Application name
- `VITE_APP_VERSION`: Application version

## 📦 Manual Deployment

### Option 1: Using npm script
```bash
npm run deploy
```

### Option 2: Step by step
```bash
# Build the application
npm run build

# Deploy to gh-pages branch
npx gh-pages -d dist
```

## 🌍 Custom Domain (Optional)

1. **Add CNAME file**:
   ```bash
   echo "your-domain.com" > public/CNAME
   ```

2. **Update workflow**:
   ```yaml
   - name: Deploy to GitHub Pages
     uses: peaceiris/actions-gh-pages@v3
     with:
       github_token: ${{ secrets.GITHUB_TOKEN }}
       publish_dir: ./dist
       cname: your-domain.com
   ```

3. **Configure DNS**:
   - Point your domain to GitHub Pages IPs
   - Or create a CNAME record pointing to `username.github.io`

## 🔧 Build Optimization

The build is optimized with:
- **Code splitting**: Separate chunks for vendor, router, UI, forms, and i18n
- **Source maps**: For debugging in production
- **Tree shaking**: Removes unused code
- **Minification**: Reduces bundle size

## 📊 Monitoring

After deployment, you can:
- Check build status in GitHub Actions tab
- View deployment at: `https://username.github.io/repository-name/`
- Monitor performance with browser dev tools

## 🐛 Troubleshooting

### Common Issues

1. **Lock file not found error**:
   ```
   Error: Dependencies lock file is not found
   ```
   **Solution**: Generate package-lock.json
   ```bash
   npm install --package-lock-only
   git add package-lock.json
   git commit -m "Add package-lock.json"
   git push
   ```

2. **404 on refresh**: 
   - Add a `404.html` file that redirects to `index.html`
   - Or use hash routing instead of browser routing

3. **Assets not loading**:
   - Check the `base` path in `vite.config.ts`
   - Ensure it matches your repository name

4. **Build fails**:
   - Check TypeScript errors: `npm run build`
   - Fix linting errors: `npm run lint`
   - Ensure all tests pass: `npm test`

5. **GitHub Actions fails**:
   - Check the Actions tab for detailed error logs
   - Use the alternative workflow if the main one fails
   - Ensure all required secrets are set

### Debug Commands
```bash
# Test build locally
npm run build && npm run preview

# Check for TypeScript errors
npx tsc --noEmit

# Analyze bundle size
npm run build -- --analyze
```

## 🔄 Rollback

To rollback to a previous version:
1. Go to your repository's Actions tab
2. Find the successful deployment you want to rollback to
3. Click "Re-run jobs" on that workflow

## 📝 Notes

- The application works offline after first load (PWA ready)
- All data is stored in localStorage (no backend required)
- Supports both English and Arabic with RTL layout
- Fully responsive design for mobile, tablet, and desktop
- Accessible with WCAG compliance

---

**Happy deploying!** 🎉

# Billing Tracker - Deployment Guide

This guide provides instructions for deploying the Billing Tracker application to various hosting platforms.

## Prerequisites

Before deploying, ensure you have:
- Node.js 18+ installed locally
- A GitHub account (for most platforms)
- The project built locally (`npm run build`)

## Build the Project

```bash
npm install
npm run build
```

This creates:
- `dist/index.js` - The server bundle
- `dist/public/` - Static frontend assets

## Deployment Options

### 1. 🚀 Railway (Recommended for Full-Stack)

Railway is excellent for full-stack Node.js applications with databases.

1. **Setup:**
   ```bash
   npm install -g @railway/cli
   railway login
   ```

2. **Deploy:**
   ```bash
   railway link
   railway up
   ```

3. **Configuration:**
   - Uses `railway.json` configuration
   - Automatically detects Node.js and runs `npm start`
   - Environment variables can be set in Railway dashboard

### 2. 🐳 Docker Deployment

Deploy using Docker on any platform that supports containers.

1. **Build Image:**
   ```bash
   docker build -t billing-tracker .
   ```

2. **Run Locally:**
   ```bash
   docker run -p 5000:5000 billing-tracker
   ```

3. **Deploy to:**
   - **Digital Ocean App Platform**
   - **Google Cloud Run**
   - **AWS ECS/Fargate**
   - **Azure Container Instances**

### 3. 🌐 Render

1. **Connect GitHub repo** to Render
2. **Configuration:**
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
   - Uses `render.yaml` for configuration

### 4. ✈️ Fly.io

1. **Install Fly CLI:**
   ```bash
   curl -L https://fly.io/install.sh | sh
   ```

2. **Deploy:**
   ```bash
   fly auth login
   fly launch
   fly deploy
   ```

### 5. ⚡ Vercel (Serverless)

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Deploy:**
   ```bash
   vercel
   ```

3. **Notes:**
   - Uses `vercel.json` configuration
   - Runs as serverless functions
   - May have cold start delays

### 6. 🌊 Netlify (Static + Functions)

1. **Connect GitHub repo** to Netlify
2. **Configuration:**
   - Build Command: `npm run build`
   - Publish Directory: `dist/public`
   - Uses `netlify.toml` for configuration

## Environment Variables

Set these environment variables in your hosting platform:

### Required
- `NODE_ENV=production`
- `PORT=5000` (or your platform's preferred port)

### Database (if using)
- `DATABASE_URL` - Your database connection string
- `NEON_DATABASE_URL` - For Neon PostgreSQL

### Payment Processing (if enabled)
- `STRIPE_SECRET_KEY` - Your Stripe secret key
- `STRIPE_PUBLISHABLE_KEY` - Your Stripe publishable key

## Health Checks

The application includes a health check endpoint at `/` that returns the main application page. Most platforms will automatically detect this.

## Platform-Specific Notes

### Railway
- Excellent database integration
- Automatic HTTPS
- Built-in monitoring
- Free tier available

### Render
- Free tier with limitations
- Auto-sleep after inactivity
- Good for small projects

### Fly.io
- Global edge deployment
- Pay-per-use pricing
- Excellent performance

### Vercel
- Serverless architecture
- Excellent for static sites with API
- Global CDN

### Netlify
- Great for static sites
- Function-based API
- Excellent developer experience

## Testing Your Deployment

After deployment, test your application:

1. **Frontend:** Access your app URL
2. **API:** Test API endpoints at `/api/*`
3. **Health:** Check health endpoint

## Troubleshooting

### Common Issues

1. **Port Configuration:**
   - Ensure your platform uses port 5000 or set PORT environment variable

2. **Build Failures:**
   - Check Node.js version compatibility
   - Verify all dependencies are in package.json

3. **Database Connection:**
   - Ensure DATABASE_URL is set correctly
   - Check database permissions and firewall settings

4. **Static Assets:**
   - Verify `dist/public` directory contains built assets
   - Check file paths in deployment

### Getting Help

- Check platform-specific documentation
- Review application logs in your hosting dashboard
- Test locally with `NODE_ENV=production npm start`

## Continuous Deployment

For automatic deployments:

1. **Connect your GitHub repository** to your hosting platform
2. **Enable auto-deploy** on main branch pushes
3. **Set up environment variables** in the platform dashboard

Most platforms support automatic deployments from GitHub, making updates seamless.
# Vitrus Deployment Guide

This guide covers multiple deployment options for the Vitrus real estate platform.

## Prerequisites

- Node.js 18 or higher
- npm or yarn package manager
- Git for version control

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Application
NEXT_PUBLIC_APP_URL=https://vitrus.rw
NEXT_PUBLIC_API_URL=https://api.vitrus.rw

# Database (if using)
DATABASE_URL=postgresql://username:password@localhost:5432/vitrus

# Authentication (if implemented)
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=https://vitrus.rw

# Third-party services
FORMSPREE_ENDPOINT=https://formspree.io/f/your-form-id
UNSPLASH_ACCESS_KEY=your-unsplash-key

# Analytics (optional)
GOOGLE_ANALYTICS_ID=GA-XXXXXXXXX
```

## Deployment Options

### 1. Vercel (Recommended)

**Quick Deploy:**
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy automatically on push to main branch

**Manual Deploy:**
```bash
npm install -g vercel
vercel login
vercel --prod
```

**Configuration:**
- `vercel.json` is already configured
- Set environment variables in Vercel dashboard
- Custom domain: Configure in Vercel project settings

### 2. Netlify

**Quick Deploy:**
1. Push your code to GitHub
2. Connect repository to Netlify
3. Build command: `npm run build`
4. Publish directory: `.next`

**Manual Deploy:**
```bash
npm install -g netlify-cli
netlify login
npm run build
netlify deploy --prod --dir=.next
```

**Configuration:**
- `netlify.toml` is already configured
- Set environment variables in Netlify dashboard

### 3. Docker Deployment

**Build and Run:**
```bash
# Build the image
docker build -t vitrus-app .

# Run the container
docker run -p 3000:3000 vitrus-app
```

**Using Docker Compose:**
```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f
```

**Production with Docker:**
```bash
# Build for production
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

### 4. Traditional VPS/Server

**Prerequisites:**
- Ubuntu 20.04+ or similar Linux distribution
- Nginx or Apache web server
- PM2 for process management
- SSL certificate (Let's Encrypt recommended)

**Setup Steps:**

1. **Install Node.js and npm:**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

2. **Clone and build:**
```bash
git clone <your-repository>
cd vitrus-project
npm install
npm run build
```

3. **Install PM2:**
```bash
npm install -g pm2
```

4. **Create PM2 ecosystem file:**
```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'vitrus-app',
    script: 'npm',
    args: 'start',
    cwd: '/path/to/your/app',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
}
```

5. **Start with PM2:**
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

6. **Configure Nginx:**
```nginx
server {
    listen 80;
    server_name vitrus.rw www.vitrus.rw;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name vitrus.rw www.vitrus.rw;

    ssl_certificate /path/to/ssl/cert.pem;
    ssl_certificate_key /path/to/ssl/private.key;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## CI/CD with GitHub Actions

The project includes a GitHub Actions workflow (`.github/workflows/deploy.yml`) that:

1. **Runs tests and builds** on every push and PR
2. **Deploys to Vercel** on main branch pushes
3. **Builds and pushes Docker images** to GitHub Container Registry
4. **Deploys to Netlify** as an alternative option

**Required Secrets:**
Add these secrets to your GitHub repository settings:

```
VERCEL_TOKEN=your-vercel-token
VERCEL_ORG_ID=your-vercel-org-id
VERCEL_PROJECT_ID=your-vercel-project-id
NETLIFY_AUTH_TOKEN=your-netlify-token
NETLIFY_SITE_ID=your-netlify-site-id
```

## Performance Optimization

### Build Optimization
```bash
# Analyze bundle size
npm run build
npx @next/bundle-analyzer
```

### Caching Strategy
- Static assets: 1 year cache
- API responses: Appropriate cache headers
- CDN integration for global distribution

### Monitoring
- Set up error tracking (Sentry recommended)
- Configure performance monitoring
- Set up uptime monitoring

## Security Considerations

1. **Environment Variables:**
   - Never commit sensitive data to repository
   - Use platform-specific secret management

2. **HTTPS:**
   - Always use HTTPS in production
   - Configure proper SSL certificates

3. **Headers:**
   - Security headers are configured in deployment configs
   - CSP, HSTS, and other security measures included

4. **Dependencies:**
   - Regularly update dependencies
   - Run security audits: `npm audit`

## Troubleshooting

### Common Issues

1. **Build Failures:**
   - Check Node.js version compatibility
   - Verify all dependencies are installed
   - Review build logs for specific errors

2. **Runtime Errors:**
   - Check environment variables are set
   - Verify API endpoints are accessible
   - Review application logs

3. **Performance Issues:**
   - Enable Next.js analytics
   - Check bundle size and optimize
   - Review database query performance

### Support

For deployment issues:
1. Check the deployment platform's documentation
2. Review GitHub Actions logs for CI/CD issues
3. Consult the Next.js deployment documentation

## Maintenance

### Regular Tasks
- Update dependencies monthly
- Monitor performance metrics
- Review and rotate secrets
- Backup data regularly
- Update SSL certificates before expiry

### Scaling
- Monitor resource usage
- Consider CDN for static assets
- Implement database optimization
- Use load balancing for high traffic

This deployment guide provides multiple options to suit different needs and infrastructure preferences. Choose the option that best fits your requirements and technical expertise.
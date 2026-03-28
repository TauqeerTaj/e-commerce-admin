# Admin Panel Vercel CI/CD Setup Guide

This guide explains how to set up automated deployment to Vercel for your admin panel.

## Overview

The CI/CD pipeline includes:
- **Automated testing** on pull requests and pushes
- **Preview deployments** for pull requests
- **Production deployments** from main branch
- **Environment variable management** through Vercel

## Prerequisites

1. **Vercel Account**: Create account at [vercel.com](https://vercel.com)
2. **GitHub Repository**: Connected to Vercel
3. **Vercel CLI**: Installed locally (optional)

## Step 1: Connect Your Repository to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New..." → "Project"
3. Import your GitHub repository (admin panel)
4. Vercel will automatically detect Next.js settings
5. Click "Deploy"

## Step 2: Get Required IDs

After deployment, get these values from your Vercel project:

1. **Organization ID**: Settings → General
2. **Project ID**: Settings → General
3. **Access Token**: Account Settings → Tokens → Create Token

## Step 3: Configure GitHub Secrets

Add these secrets to your GitHub repository:

### Required Secrets:
```
VERCEL_ORG_ID=your-vercel-org-id
VERCEL_PROJECT_ID=your-vercel-project-id
VERCEL_TOKEN=your-vercel-access-token
MONGODB_URI=mongodb://username:password@host:port/admin-database
NEXTAUTH_SECRET=your-nextauth-secret
```

### Repository Variables:
```
NEXT_PUBLIC_ADMIN_URL=https://admin-your-domain.vercel.app
NEXTAUTH_URL=https://admin-your-domain.vercel.app/api/auth
ADMIN_DOMAIN=admin.your-custom-domain.com (optional)
```

## Step 4: Environment Variables in Vercel

Add these environment variables in your Vercel project dashboard:

1. Go to project → Settings → Environment Variables
2. Add the same variables as GitHub secrets
3. Configure different values for preview/production if needed

## Workflow Triggers

- **Pull requests**: Creates preview deployments
- **Push to main**: Deploys to production
- **Push to develop**: Runs tests and creates preview

## Security Considerations for Admin Panel

### Additional Security Measures:
1. **Password Protection**: Use Vercel's password protection for preview deployments
2. **IP Whitelisting**: Restrict access to production admin panel
3. **Custom Auth**: Ensure robust authentication in your admin panel
4. **HTTPS Only**: Vercel provides HTTPS by default
5. **Environment Isolation**: Use separate database for admin panel

### Recommended Environment Variables:
```
# Admin specific
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD_MIN_LENGTH=12

# Security
SESSION_SECRET=your-session-secret
RATE_LIMIT_MAX=100

# Monitoring
SLACK_WEBHOOK_URL=your-slack-webhook (for error notifications)
```

## Deployment Process

```
Code Push → Tests Run → Deploy to Vercel → Admin Panel URL
```

## Admin Panel Specific Features

### Preview Deployments
- Test admin features before production
- Share with stakeholders for review
- Automatic cleanup after PR merge

### Production Deployments
- Secure admin access
- Custom domain support
- Built-in analytics and monitoring

### Environment Management
- Separate admin database
- Isolated authentication
- Secure secret management

## Monitoring and Logging

### Vercel Analytics
- Track admin panel usage
- Monitor performance metrics
- Error tracking and reporting

### Custom Monitoring
```javascript
// Add to your admin panel for monitoring
const logAdminAction = (action: string, user: string) => {
  console.log(`Admin Action: ${action} by ${user} at ${new Date()}`);
  
  // Send to monitoring service
  if (process.env.NODE_ENV === 'production') {
    // Send to your monitoring service
  }
};
```

## Troubleshooting

### Common Issues
1. **Authentication failures**: Check NEXTAUTH_URL configuration
2. **Database connection**: Verify MONGODB_URI is correct
3. **Build errors**: Check all dependencies are installed
4. **Environment variables**: Ensure they're set in both GitHub and Vercel

### Debug Steps
1. Check Vercel build logs
2. Verify environment variables
3. Test authentication flow
4. Check database connectivity

## Best Practices

1. **Separate Projects**: Keep admin panel as separate Vercel project
2. **Custom Domain**: Use admin.yourdomain.com
3. **Access Control**: Implement proper role-based access
4. **Regular Updates**: Keep dependencies updated
5. **Backup Strategy**: Regular database backups

## Next Steps

1. Complete Vercel setup
2. Configure authentication
3. Set up monitoring
4. Test with preview deployments
5. Deploy to production

## Additional Resources

- [Vercel Security Best Practices](https://vercel.com/docs/security)
- [Next.js Authentication Guide](https://nextjs.org/docs/authentication)
- [Admin Panel Security Checklist](https://owasp.org/www-project-cheat-sheets/cheatsheets/Administration_Panel_Security_Cheat_Sheet.html)

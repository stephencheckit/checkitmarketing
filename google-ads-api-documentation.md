# GTM Tracker - Google Ads API Integration Documentation

## Application Name
GTM Tracker (Go-To-Market Tracker)

## Company
Checkit Marketing

## Purpose
GTM Tracker is an internal marketing analytics dashboard used by our team to consolidate and monitor marketing channel performance across multiple platforms.

## Google Ads API Usage

### Data Accessed
- **Campaigns**: Campaign names, status, budgets, and performance metrics
- **Ads**: Ad copy (headlines, descriptions), landing page URLs, ad strength
- **Keywords**: Keyword text, match types, quality scores, and performance
- **Metrics**: Impressions, clicks, conversions, cost data

### How Data Is Used
1. **Performance Monitoring**: Display campaign performance in a unified dashboard alongside other marketing channels
2. **Spend Tracking**: Track advertising spend across campaigns to manage marketing budgets
3. **Optimization Insights**: Identify underperforming keywords and ads for optimization

### Access Type
- **Read-only access**: We only query data; we do not create, modify, or delete campaigns
- **Internal use only**: This tool is used by our internal marketing team, not distributed to third parties

### Data Storage
- Campaign and ad data is cached in our secure database to reduce API calls
- Data is refreshed on-demand by authenticated users
- No sensitive user data from Google Ads is shared externally

### Authentication
- OAuth 2.0 with offline access for refresh tokens
- Access restricted to authenticated team members only

## Technical Architecture
- **Platform**: Next.js web application
- **API Client**: google-ads-api npm package
- **Database**: PostgreSQL (Neon serverless)
- **Hosting**: Vercel (secure HTTPS)

## Contact
- **Developer**: Stephen Newman
- **Email**: stephen.newman@checkit.net

---
*Document Version: 1.0*  
*Date: January 30, 2026*

# Google Search Console Setup Guide for LèRah

This guide will help you submit your website to Google Search Console and optimize it for search engines.

## 📋 Prerequisites

Before starting, ensure you have:

- A Google account
- Access to your website's hosting/server
- Admin access to your domain registrar (for DNS verification)

---

## 🚀 Step 1: Add Your Property to Google Search Console

### 1.1 Access Google Search Console

1. Go to [Google Search Console](https://search.google.com/search-console/)
2. Sign in with your Google account
3. Click **"Add Property"** or **"Start Now"**

### 1.2 Choose Property Type

You have two options:

#### Option A: Domain Property (Recommended)

- Enter: `lerah.in`
- This covers all subdomains and protocols (http, https, www, non-www)
- **Verification Method**: DNS record (TXT record)

#### Option B: URL Prefix Property

- Enter: `https://www.lerah.in`
- Only covers the exact URL entered
- **Verification Methods**: Multiple options available

---

## 🔐 Step 2: Verify Your Website Ownership

### Method 1: HTML File Upload (Easiest for this project)

1. Google will provide you with an HTML verification file (e.g., `google1234567890abcdef.html`)
2. Download this file
3. Upload it to your `public` folder:
   ```
   frontend/public/google1234567890abcdef.html
   ```
4. After deployment, the file should be accessible at:
   ```
   https://www.lerah.in/google1234567890abcdef.html
   ```
5. Click **"Verify"** in Google Search Console

### Method 2: HTML Meta Tag

1. Google will provide a meta tag like:
   ```html
   <meta name="google-site-verification" content="your-verification-code" />
   ```
2. Add this tag to the `<head>` section of your `index.html` file (already prepared in the updated file)
3. Deploy your website
4. Click **"Verify"** in Google Search Console

### Method 3: DNS Verification (For Domain Property)

1. Google will provide a TXT record
2. Log in to your domain registrar (GoDaddy, Namecheap, etc.)
3. Go to DNS settings
4. Add a new TXT record with the value provided by Google
5. Wait for DNS propagation (can take up to 48 hours, usually faster)
6. Click **"Verify"** in Google Search Console

### Method 4: Google Analytics

If you already have Google Analytics installed:

1. Use the same Google account for Search Console
2. Select "Google Analytics" as verification method
3. Click **"Verify"**

---

## 📤 Step 3: Submit Your Sitemap

### 3.1 Verify Sitemap Accessibility

After deployment, ensure your sitemap is accessible at:

```
https://www.lerah.in/sitemap.xml
```

### 3.2 Submit to Google Search Console

1. In Google Search Console, go to **"Sitemaps"** (left sidebar)
2. Enter: `sitemap.xml`
3. Click **"Submit"**

### 3.3 Monitor Sitemap Status

- Google will process your sitemap (can take a few days)
- Check for any errors in the Sitemaps report
- Update the sitemap whenever you add new pages/products

---

## 🔍 Step 4: Request Indexing

### 4.1 URL Inspection Tool

1. In Google Search Console, use the **"URL Inspection"** tool (top search bar)
2. Enter your homepage URL: `https://www.lerah.in`
3. Click **"Request Indexing"**
4. Repeat for important pages:
   - `https://www.lerah.in/collections`
   - `https://www.lerah.in/contact`
   - Key product pages

### 4.2 Bulk Indexing

- Google will automatically crawl URLs from your sitemap
- Priority pages (priority 1.0 in sitemap) will be crawled first
- Full indexing can take 1-4 weeks

---

## 📊 Step 5: Set Up Enhanced Features

### 5.1 Enable Rich Results

Your website already includes structured data (Schema.org) for:

- **Organization** - Business information
- **WebSite** - Site-wide search
- **ClothingStore** - E-commerce details

To test:

1. Use [Google's Rich Results Test](https://search.google.com/test/rich-results)
2. Enter your URL: `https://www.lerah.in`
3. Fix any errors shown

### 5.2 Submit Product Pages

When you add products, ensure each product page includes:

- Product schema markup
- High-quality images
- Detailed descriptions
- Price information
- Availability status

### 5.3 Enable Breadcrumbs

Your site already uses breadcrumbs. Ensure they're marked up with structured data for better search results.

---

## 🎯 Step 6: Optimize for Search

### 6.1 Core Web Vitals

1. In Search Console, go to **"Core Web Vitals"**
2. Monitor:
   - **LCP** (Largest Contentful Paint) - Should be < 2.5s
   - **FID** (First Input Delay) - Should be < 100ms
   - **CLS** (Cumulative Layout Shift) - Should be < 0.1

### 6.2 Mobile Usability

1. Check **"Mobile Usability"** report
2. Fix any issues (text too small, clickable elements too close, etc.)

### 6.3 Page Experience

1. Monitor **"Page Experience"** report
2. Ensure HTTPS is enabled
3. No intrusive interstitials
4. Safe browsing (no malware)

---

## 📈 Step 7: Monitor Performance

### 7.1 Performance Report

- **Impressions**: How many times your site appeared in search
- **Clicks**: How many users clicked through
- **CTR** (Click-Through Rate): Clicks ÷ Impressions
- **Average Position**: Your average ranking

### 7.2 Coverage Report

- **Valid**: Pages successfully indexed
- **Valid with warnings**: Indexed but with issues
- **Error**: Pages not indexed due to errors
- **Excluded**: Pages intentionally not indexed

### 7.3 Enhancements

- **Breadcrumbs**: Monitor breadcrumb markup
- **Sitelinks Search Box**: Enable site-wide search in results
- **Logo**: Ensure your logo appears in search results

---

## 🛠️ Step 8: Ongoing Maintenance

### Weekly Tasks

- Check for new **Coverage** errors
- Monitor **Performance** trends
- Review **Search Queries** driving traffic

### Monthly Tasks

- Update sitemap with new products/pages
- Analyze top-performing pages
- Identify and fix crawl errors
- Review and improve low-performing pages

### Quarterly Tasks

- Audit structured data
- Review and update meta descriptions
- Analyze competitor rankings
- Update content strategy based on search trends

---

## 📝 Important Files Created

### 1. **index.html** (Updated)

Location: `frontend/index.html`

**Includes:**

- ✅ Comprehensive meta tags (title, description, keywords)
- ✅ Open Graph tags (Facebook, LinkedIn)
- ✅ Twitter Card tags
- ✅ Structured data (Schema.org JSON-LD)
- ✅ Canonical URL
- ✅ Mobile optimization tags
- ✅ Theme color and app manifest tags

### 2. **sitemap.xml** (New)

Location: `frontend/public/sitemap.xml`

**Includes:**

- ✅ Homepage (priority 1.0)
- ✅ Collections page (priority 0.9)
- ✅ Story section (priority 0.8)
- ✅ New arrivals (priority 0.8)
- ✅ Contact page (priority 0.7)
- ✅ Other important pages

**Action Required:**

- Update `lastmod` dates when pages change
- Add individual product URLs as products are created
- Include product images in sitemap

### 3. **robots.txt** (Updated)

Location: `frontend/public/robots.txt`

**Includes:**

- ✅ Allow all search engines
- ✅ Disallow admin and checkout pages
- ✅ Sitemap reference
- ✅ Crawl delay settings
- ✅ Specific bot permissions

---

## 🎨 Additional Recommendations

### 1. Create Social Media Images

Create optimized images for social sharing:

**Open Graph Image** (`og-image.jpg`)

- Size: 1200 x 630 pixels
- Format: JPG or PNG
- Location: `frontend/public/og-image.jpg`
- Content: Beautiful saree image with LèRah branding

**Twitter Image** (`twitter-image.jpg`)

- Size: 1200 x 675 pixels (16:9 ratio)
- Format: JPG or PNG
- Location: `frontend/public/twitter-image.jpg`

**Logo** (`logo.png`)

- Size: 512 x 512 pixels (square)
- Format: PNG with transparent background
- Location: `frontend/public/logo.png`

### 2. Create Favicon Set

Generate favicons for all devices:

- `favicon.ico` (16x16, 32x32, 48x48)
- `apple-touch-icon.png` (180x180)
- `favicon-16x16.png`
- `favicon-32x32.png`
- `android-chrome-192x192.png`
- `android-chrome-512x512.png`

Use a tool like [RealFaviconGenerator](https://realfavicongenerator.net/)

### 3. Set Up Google Analytics 4

1. Create a GA4 property
2. Add tracking code to your site
3. Link GA4 with Search Console for deeper insights

### 4. Set Up Google Tag Manager (Optional)

- Easier management of tracking codes
- No code changes needed for new tags
- Better event tracking

---

## 🔗 Useful Links

- [Google Search Console](https://search.google.com/search-console/)
- [Rich Results Test](https://search.google.com/test/rich-results)
- [Mobile-Friendly Test](https://search.google.com/test/mobile-friendly)
- [PageSpeed Insights](https://pagespeed.web.dev/)
- [Schema.org Documentation](https://schema.org/)
- [Google Search Central](https://developers.google.com/search)

---

## ❓ Troubleshooting

### Issue: "Site not verified"

**Solution:**

- Ensure verification file is accessible
- Check that meta tag is in the `<head>` section
- Wait 24-48 hours for DNS propagation (if using DNS method)

### Issue: "Sitemap could not be read"

**Solution:**

- Verify sitemap is accessible at `https://www.lerah.in/sitemap.xml`
- Check XML syntax (no errors)
- Ensure proper XML declaration at the top

### Issue: "Page not indexed"

**Solution:**

- Check robots.txt isn't blocking the page
- Ensure page has no `noindex` meta tag
- Use URL Inspection tool to request indexing
- Wait 1-2 weeks for Google to crawl

### Issue: "Mobile usability errors"

**Solution:**

- Test on actual mobile devices
- Use Chrome DevTools mobile emulator
- Fix viewport settings
- Ensure text is readable without zooming

---

## 🎯 SEO Best Practices for LèRah

### Content Strategy

1. **Product Descriptions**: Write unique, detailed descriptions for each saree
2. **Blog Content**: Create content about saree care, styling tips, heritage stories
3. **Category Pages**: Optimize collection pages with rich descriptions
4. **Alt Text**: Add descriptive alt text to all images

### Technical SEO

1. **Page Speed**: Optimize images, use lazy loading, minimize JavaScript
2. **HTTPS**: Ensure entire site uses HTTPS
3. **Mobile-First**: Ensure perfect mobile experience
4. **Structured Data**: Keep schema markup updated

### Local SEO (If applicable)

1. Create Google Business Profile
2. Add local business schema
3. Include address and phone number
4. Get customer reviews

### Link Building

1. Partner with fashion bloggers
2. Get featured in saree/fashion publications
3. Create shareable content
4. Engage on social media

---

## 📞 Support

If you encounter issues:

1. Check [Google Search Central Help](https://support.google.com/webmasters/)
2. Visit [Google Search Central Community](https://support.google.com/webmasters/community)
3. Review [Google's SEO Starter Guide](https://developers.google.com/search/docs/beginner/seo-starter-guide)

---

**Last Updated**: January 2025  
**Version**: 1.0  
**Website**: LèRah Royal Elegance (https://www.lerah.in)

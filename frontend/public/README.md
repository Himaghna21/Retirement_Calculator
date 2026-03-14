# Public Assets Directory

This directory contains all public-facing assets for the HDFC Retirement Planning Calculator.

## Directory Contents

### Root Files
- **robots.txt** - Search engine crawling rules
- **sitemap.xml** - URL sitemap for SEO indexing
- **manifest.json** - Progressive Web App (PWA) configuration
- **accessibility.md** - Web accessibility statement

### Fonts (`/fonts`)
- **Montserrat-Regular.woff2** - Regular weight (400)
- **Montserrat-SemiBold.woff2** - SemiBold weight (600)
- **Montserrat-Bold.woff2** - Bold weight (700)

HDFC brand font. Downloaded from Google Fonts.
See FONTS_SETUP.md for installation instructions.

### Icons (`/icons`)
- **hdfc-logo.svg** - Main HDFC brand logo (200x80)
- **hdfc-logo-simple.svg** - Simplified logo variant (120x50)
- **favicon.svg** - Browser favicon

All icons are SVG format for scalability and small file size.

### Images (`/images`)
- **calculator-banner.svg** - Hero banner (1200x300)
- **og-image.png** - Open Graph image for social media
- **twitter-image.png** - Twitter card image
- **icon-192.png** - Android home screen icon
- **icon-512.png** - Large device icon
- **apple-touch-icon.png** - iOS home screen icon

### Security & Metadata (`.well-known`)
- **security.txt** - Security contact and policy

## Brand Guidelines

All assets follow HDFC brand guidelines:

### Colors (Approved)
- **Primary Blue:** #224c87
- **Primary Red:** #da3832
- **Neutral Grey:** #919090
- **White:** #ffffff
- **Black:** #000000

### Fonts (Approved)
- **Primary:** Montserrat (regular, semibold, bold)
- **Fallback:** Arial, Verdana, sans-serif

### Imagery Rules
- ✓ Text-based logos acceptable
- ✓ SVG format preferred
- ✗ No financial imagery (arrows, charts, money)
- ✗ No promotional or growth-oriented imagery

## SEO & Social Media

### Robots.txt
Controls search engine crawler behavior. Current rules:
- Allow general crawling
- Disallow admin paths
- Block known bad bots

### Sitemap.xml
Lists all public pages for search engines. Update when adding new routes.

### Open Graph & Twitter Tags
Configured in `app/layout.js` for social media sharing.

Images used:
- **og-image.png** (1200x630) - Facebook, LinkedIn, Slack
- **twitter-image.png** (1024x512) - Twitter, WhatsApp

## Progressive Web App (PWA)

The `manifest.json` enables:
- ✓ Install to home screen
- ✓ Offline functionality (with service worker)
- ✓ App-like experience
- ✓ Custom splash screen
- ✓ Shortcut commands

## Accessibility

The `accessibility.md` file:
- Declares WCAG 2.1 AA compliance
- Lists keyboard & screen reader support
- Provides contact for accessibility issues
- References standards and guidelines

## File Size Optimization

### Font Files
- **WOFF2 Format:** ~15-20 KB per weight
- **Total:** ~45-60 KB for 3 weights

### Images
- **SVG Logos:** <10 KB each
- **PNG Icons:** 5-15 KB each
- **Banner SVG:** <20 KB

### Total Public Assets Size
Approximately **100-150 KB** (highly optimized)

## Usage in Next.js

### Import SVG as Component
```jsx
import Logo from '@/public/icons/hdfc-logo.svg';

export default function Header() {
  return <Logo width={200} height={80} />;
}
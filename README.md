# Alejandro M. Pi Cano — Portfolio

Static portfolio for **Alejandro M. Pi Cano**, a Full Stack Developer with 15+ years of experience building enterprise solutions, microservices, and cloud systems.

**Live site:** [https://alejandropi.is-a.dev/](https://alejandropi.is-a.dev/)

## About

A single-page site (HTML/CSS/JS) with Home, About, Skills, Projects, and Contact sections. It showcases web projects (Angular, Next.js, ASP.NET) and games (Phaser, Unity), a contact form powered by EmailJS + reCAPTCHA, and Google Analytics 4 injected at deploy time.

## Features

- Responsive layout with light/dark theme (persisted in `localStorage`)
- Matrix rain hero animation (`js/matrix.js`) and scroll reveal
- Project carousels (web and games)
- Contact form with validation, GDPR consent, reCAPTCHA, and toast notifications
- Accessibility: skip link, ARIA, screen-reader announcements, visible focus
- SEO: meta tags, Open Graph, Twitter Cards, JSON-LD, `sitemap.xml`, `robots.txt`
- Security: CSP, frame buster (clickjacking), strict referrer policy
- Automated GitHub Pages deploy with safe GA measurement ID injection

## Stack

| Layer | Technology |
|-------|------------|
| Markup | Semantic HTML5 |
| Styles | CSS custom properties (`css/tokens.css`), Fraunces / Hanken Grotesk / JetBrains Mono |
| Scripts | Vanilla JS (`js/script.js`, `js/matrix.js`, `js/analytics.js`) |
| Contact | [EmailJS](https://www.emailjs.com/) + Google reCAPTCHA |
| Analytics | Google Analytics 4 (injected in CI) |
| Hosting | GitHub Pages + custom domain (`CNAME`) |

## Structure

```
alejandropi/
├── index.html              # Main page
├── css/
│   ├── tokens.css          # Design tokens (light/dark theme)
│   └── style.css           # Site styles
├── js/
│   ├── script.js           # Theme, nav, carousels, form, a11y
│   ├── matrix.js           # Hero animation
│   └── analytics.js        # GA4 (placeholder → ID at deploy)
├── images/                 # Project screenshots
├── .github/workflows/
│   └── deploy.yml          # GitHub Pages deploy
├── CNAME                   # alejandropi.is-a.dev
├── robots.txt
├── sitemap.xml
└── app-ads.txt
```

## Local development

No build step or bundler required. Any static server works:

```bash
# Python
python -m http.server 8080

# Node (npx)
npx serve .
```

Open `http://localhost:8080` in your browser.

> The contact form and reCAPTCHA need configured keys and network access; they may fail locally if the origin is not authorized.

## Deployment

Every push to `main` (or a `workflow_dispatch`) runs [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml):

1. Copies only public site files into `_site/`
2. Replaces `__GA_MEASUREMENT_ID__` in `analytics.js` with the `GA_MEASUREMENT_ID` secret
3. Publishes the artifact to GitHub Pages

**Optional secret:** `GA_MEASUREMENT_ID` — format `G-XXXXXXXX`. If unset, deploy continues and analytics stays disabled.

## Contact

- Email: [alejandro.pi87@gmail.com](mailto:alejandro.pi87@gmail.com)
- LinkedIn: [alejandro-m-pi-cano](https://www.linkedin.com/in/alejandro-m-pi-cano)
- GitHub: [AlejandroPiCano](https://github.com/AlejandroPiCano)

## License

© Alejandro M. Pi Cano. All rights reserved.

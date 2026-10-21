# Alejandro M. Pi Cano — Portfolio

Portfolio estático de **Alejandro M. Pi Cano**, Full Stack Developer con más de 15 años de experiencia en soluciones empresariales, microservicios y cloud.

**Sitio en vivo:** [https://alejandropi.is-a.dev/](https://alejandropi.is-a.dev/)

## Sobre el proyecto

Sitio de una sola página (HTML/CSS/JS) con secciones Home, About, Skills, Projects y Contact. Incluye proyectos web (Angular, Next.js, ASP.NET) y juegos (Phaser, Unity), formulario de contacto con EmailJS + reCAPTCHA, y analytics de Google Analytics 4 inyectado en el despliegue.

## Características

- Diseño responsive con tema claro/oscuro (persistencia en `localStorage`)
- Animación Matrix en el hero (`js/matrix.js`) y scroll reveal
- Carruseles de proyectos (web y games)
- Formulario de contacto con validación, consentimiento GDPR, reCAPTCHA y notificaciones toast
- Accesibilidad: skip link, ARIA, anuncios a lectores de pantalla, focus visible
- SEO: meta tags, Open Graph, Twitter Cards, JSON-LD, `sitemap.xml`, `robots.txt`
- Seguridad: CSP, frame buster (clickjacking), `referrer` estricto
- Despliegue automático a GitHub Pages con inyección segura del ID de GA

## Stack

| Capa | Tecnología |
|------|------------|
| Markup | HTML5 semántico |
| Estilos | CSS custom properties (`css/tokens.css`), Fraunces / Hanken Grotesk / JetBrains Mono |
| Scripts | Vanilla JS (`js/script.js`, `js/matrix.js`, `js/analytics.js`) |
| Contacto | [EmailJS](https://www.emailjs.com/) + Google reCAPTCHA |
| Analytics | Google Analytics 4 (inyectado en CI) |
| Hosting | GitHub Pages + dominio custom (`CNAME`) |

## Estructura

```
alejandropi/
├── index.html              # Página principal
├── css/
│   ├── tokens.css          # Design tokens (tema claro/oscuro)
│   └── style.css           # Estilos del sitio
├── js/
│   ├── script.js           # Tema, nav, carruseles, formulario, a11y
│   ├── matrix.js           # Animación del hero
│   └── analytics.js        # GA4 (placeholder → ID en deploy)
├── images/                 # Capturas de proyectos
├── .github/workflows/
│   └── deploy.yml          # Deploy a GitHub Pages
├── CNAME                   # alejandropi.is-a.dev
├── robots.txt
├── sitemap.xml
└── app-ads.txt
```

## Desarrollo local

No hace falta build ni bundler. Cualquier servidor estático sirve:

```bash
# Python
python -m http.server 8080

# Node (npx)
npx serve .
```

Abre `http://localhost:8080` en el navegador.

> El formulario de contacto y reCAPTCHA requieren las claves configuradas y red; en local pueden fallar si el origen no está autorizado.

## Despliegue

Cada push a `main` (o un `workflow_dispatch`) ejecuta [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml):

1. Copia solo los ficheros públicos a `_site/`
2. Sustituye `__GA_MEASUREMENT_ID__` en `analytics.js` con el secret `GA_MEASUREMENT_ID`
3. Publica el artefacto en GitHub Pages

**Secret requerido (opcional):** `GA_MEASUREMENT_ID` — formato `G-XXXXXXXX`. Si no está definido, el deploy continúa y analytics queda desactivado.

## Contacto

- Email: [alejandro.pi87@gmail.com](mailto:alejandro.pi87@gmail.com)
- LinkedIn: [alejandro-m-pi-cano](https://www.linkedin.com/in/alejandro-m-pi-cano)
- GitHub: [AlejandroPiCano](https://github.com/AlejandroPiCano)

## Licencia

© Alejandro M. Pi Cano. Todos los derechos reservados.

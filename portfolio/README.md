# Professional Portfolio

A professional portfolio website featuring About, Experience, Projects, Education, and a Contact form with a minimal backend.

## Features
- Clean, responsive design (vanilla HTML/CSS/JS)
- Express backend serving static files
- Contact form with validation, rate limiting, and security headers
- Optional email delivery via SMTP; always persists to `data/submissions.json`

## Getting Started

1. Install dependencies:

```bash
cd /workspace/portfolio
npm install
```

2. Copy environment example and adjust as needed:

```bash
cp .env.example .env
# Optionally edit .env to enable SMTP email delivery
```

3. Run the server:

```bash
npm start
```

Open `http://localhost:3000`.

## Customize Content
- Update your name, tagline, and copy in `public/index.html`.
- Add real experience, projects, and education items.
- Tweak colors and layout in `public/styles.css`.

## Contact Form Email (optional)
Set the following in `.env` to enable email delivery:

- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`
- `CONTACT_FROM`, `CONTACT_TO`

Without these, submissions are stored in `data/submissions.json`.

## Security Notes
- Basic rate limiting is enabled on the contact endpoint.
- Helmet adds sensible security headers.

## Deploying
You can deploy on any Node-friendly platform (Render, Railway, Fly.io, etc.). Ensure environment variables are set. Or serve `public/` with a static host and move the `/api/contact` route to a serverless function.
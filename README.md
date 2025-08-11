# Portfolio (Static)

A clean, responsive, no-build portfolio site with About, Experience, Projects, Education, and a working Contact form (Formspree-ready with mailto fallback).

## Quick start

- Open `portfolio/index.html` directly in a browser. Content loads with built-in defaults.
- For full functionality (loading `data/content.json`), serve over HTTP:

```bash
# from workspace root
cd /workspace/portfolio
python3 -m http.server 4321
# open http://localhost:4321
```

## Customize content

Edit `portfolio/data/content.json`:
- `profile`: name, role, location, summary, `avatarUrl`, `socials`, `topTechnologies`
- `experience`: timeline entries with achievements and technologies
- `projects`: name, description, technologies, links, and images
- `education`: institution, degree, period, details
- `contact`: `email` and optional `formEndpoint`

Alternatively, edit text directly in `index.html` as needed.

## Contact form

- Easiest: set `contact.formEndpoint` to a Formspree endpoint.
  - Create a free form, then paste the endpoint like: `https://formspree.io/f/yourid`.
- If `formEndpoint` is empty, the form falls back to a `mailto:` link using `contact.email`.

## Theming

- Auto-detects system theme. Toggle with the moon icon. Preference is saved to `localStorage`.

## Deploy

- Any static host works: GitHub Pages, Netlify, Vercel, Cloudflare Pages, S3, etc.
- Deploy the `portfolio/` directory.

## License

MIT
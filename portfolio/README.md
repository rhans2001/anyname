# Portfolio (Static)

A modern, responsive personal portfolio with sections for About, Experience, Projects, Education, and a Contact form. No build step or dependencies required.

## Quickstart

- Open `index.html` in your browser, or serve locally:

```bash
cd portfolio
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Customize

- Replace text content directly in `index.html`.
- Replace `assets/profile.jpg` and add your `assets/Your_Name_Resume.pdf`.
- Update links for GitHub/LinkedIn and project demos.
- Colors, spacing, and layout are in `styles.css` (CSS variables at the top).

## Contact form

By default, the form opens the user’s mail client. For API submission:

1. Choose a service (Formspree, EmailJS, a serverless function, or your own API).
2. Set the endpoint in `script.js`:

```js
const CONTACT_ENDPOINT = 'https://your-endpoint.example.com';
```

3. Expect a JSON POST with fields: `name`, `email`, `subject`, `message`, `consent`.

## Deploy

- GitHub Pages: serve the repository as a static site.
- Netlify / Vercel: drag‑and‑drop or connect repo; select static site.

## License

MIT
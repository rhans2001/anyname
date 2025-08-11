import polka from 'polka';
import send from '@polka/send';
import sirv from 'sirv';

const app = polka();

const isProd = process.env.NODE_ENV === 'production';
const serve = sirv('.', { dev: !isProd, etag: true, maxAge: 31536000 });

app.use(serve);

app.post('/api/contact', async (req, res) => {
  let body = '';
  req.on('data', chunk => { body += chunk; });
  req.on('end', () => {
    try {
      const data = JSON.parse(body || '{}');
      const { name, email, message } = data;
      if (!name || !email || !message) {
        return send(res, 400, { ok: false, error: 'Missing fields' });
      }
      // In real apps: send email via a provider (e.g., Resend, SendGrid) or store in DB
      console.log('Contact submission:', { name, email, message });
      return send(res, 200, { ok: true });
    } catch (err) {
      return send(res, 400, { ok: false, error: 'Invalid JSON' });
    }
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Portfolio running on http://localhost:${port}`);
});
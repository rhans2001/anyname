import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import fs from 'fs/promises';
import nodemailer from 'nodemailer';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Security headers
app.use(helmet());

// Parse JSON requests
app.use(express.json({ limit: '1mb' }));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Rate limiter for contact form
const contactLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
});

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

async function persistSubmissionLocally(submission) {
  const dataDir = path.join(__dirname, 'data');
  const submissionsPath = path.join(dataDir, 'submissions.json');
  try {
    await fs.mkdir(dataDir, { recursive: true });
    let existing = [];
    try {
      const content = await fs.readFile(submissionsPath, 'utf8');
      existing = JSON.parse(content);
      if (!Array.isArray(existing)) existing = [];
    } catch (_) {
      existing = [];
    }
    existing.push(submission);
    await fs.writeFile(submissionsPath, JSON.stringify(existing, null, 2), 'utf8');
  } catch (err) {
    console.error('Failed to persist submission locally', err);
  }
}

function canSendEmail() {
  return (
    !!process.env.SMTP_HOST &&
    !!process.env.SMTP_PORT &&
    !!process.env.SMTP_USER &&
    !!process.env.SMTP_PASS &&
    !!process.env.CONTACT_TO &&
    !!process.env.CONTACT_FROM
  );
}

async function sendEmail({ name, email, message }) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const info = await transporter.sendMail({
    from: process.env.CONTACT_FROM,
    to: process.env.CONTACT_TO,
    subject: `New portfolio contact from ${name}`,
    replyTo: email,
    text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
  });
  return info;
}

app.post('/api/contact', contactLimiter, async (req, res) => {
  const { name, email, message } = req.body || {};

  if (!name || typeof name !== 'string' || name.trim().length === 0 || name.length > 100) {
    return res.status(400).json({ error: 'Invalid name' });
  }
  if (!email || typeof email !== 'string' || !isValidEmail(email) || email.length > 200) {
    return res.status(400).json({ error: 'Invalid email' });
  }
  if (!message || typeof message !== 'string' || message.trim().length === 0 || message.length > 2000) {
    return res.status(400).json({ error: 'Invalid message' });
  }

  const submission = {
    name: name.trim(),
    email: email.trim(),
    message: message.trim(),
    timestamp: new Date().toISOString(),
    ip: req.ip,
    userAgent: req.headers['user-agent'] || '',
  };

  try {
    // Always persist locally as a backup
    await persistSubmissionLocally(submission);

    let delivered = false;
    if (canSendEmail()) {
      try {
        await sendEmail(submission);
        delivered = true;
      } catch (err) {
        console.error('Email delivery failed:', err?.message || err);
        delivered = false;
      }
    }

    return res.status(200).json({ success: true, delivered });
  } catch (err) {
    console.error('Failed processing submission', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Fallback to index.html for unmatched GET routes (single-page style navigation)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`Portfolio server running on http://localhost:${port}`);
});
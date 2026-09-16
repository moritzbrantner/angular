import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { join } from 'node:path';
import { SHOWCASES, TEMPLATES } from './app/shared/content/site.content';
import { EMPLOYEES } from './app/shared/content/next-template.content';
import {
  AuthCredentials,
  ContactRequest,
  NewsletterSubscription,
  PasswordResetRequest,
  ProblemReportRequest,
  RegisterRequest,
} from './app/shared/models/content.models';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();
app.use(express.json());

/**
 * Minimal API endpoints for the connected and server-backed variants.
 */
app.get('/api/templates', (_req, res) => {
  res.json(TEMPLATES);
});

app.get('/api/templates/featured', (_req, res) => {
  res.json(TEMPLATES.slice(0, 3));
});

app.get('/api/templates/:slug', (req, res) => {
  const template = TEMPLATES.find(({ slug }) => slug === req.params.slug);
  if (!template) {
    res.status(404).json({ message: 'Template not found.' });
    return;
  }

  res.json(template);
});

app.get('/api/showcases', (_req, res) => {
  res.json(SHOWCASES);
});

app.get('/api/showcases/featured', (_req, res) => {
  res.json(SHOWCASES.slice(0, 3));
});

app.get('/api/showcases/:slug', (req, res) => {
  const showcase = SHOWCASES.find(({ slug }) => slug === req.params.slug);
  if (!showcase) {
    res.status(404).json({ message: 'Showcase not found.' });
    return;
  }

  res.json(showcase);
});

app.post('/api/contact', (req, res) => {
  const body = req.body as Partial<ContactRequest> | undefined;
  if (!body?.name || !body.email || !body.message) {
    res.status(400).json({
      ok: false,
      message: 'Name, email, and message are required.',
    });
    return;
  }

  res.json({
    ok: true,
    message: `Received a request from ${body.name}. Connect this endpoint to your CRM or queue in production.`,
  });
});

app.post('/api/auth/login', (req, res) => {
  const body = req.body as Partial<AuthCredentials> | undefined;
  if (!body?.email || !body.password) {
    res.status(400).json({ ok: false, message: 'Email and password are required.' });
    return;
  }

  res.json({
    ok: true,
    message: 'Signed in through the server auth stub. Replace this with a real session provider.',
  });
});

app.post('/api/auth/register', (req, res) => {
  const body = req.body as Partial<RegisterRequest> | undefined;
  if (!body?.name || !body.email || !body.password || body.password !== body.confirmPassword) {
    res.status(400).json({ ok: false, message: 'Name, email, and matching passwords are required.' });
    return;
  }

  res.json({
    ok: true,
    message: `Created an account stub for ${body.name}. Connect this to your auth provider in production.`,
  });
});

app.post('/api/auth/password-reset', (req, res) => {
  const body = req.body as Partial<PasswordResetRequest> | undefined;
  if (!body?.email) {
    res.status(400).json({ ok: false, message: 'Email is required.' });
    return;
  }

  res.json({
    ok: true,
    message: 'Password reset request accepted by the server stub.',
  });
});

app.post('/api/newsletter', (req, res) => {
  const body = req.body as Partial<NewsletterSubscription> | undefined;
  if (!body?.email) {
    res.status(400).json({ ok: false, message: 'Email is required.' });
    return;
  }

  res.json({
    ok: true,
    message: `Subscribed ${body.email} through the server newsletter stub.`,
  });
});

app.post('/api/problem-reports', (req, res) => {
  const body = req.body as Partial<ProblemReportRequest> | undefined;
  if (!body?.name || !body.email || !body.subject || !body.details) {
    res.status(400).json({
      ok: false,
      referenceId: '',
      message: 'Name, email, subject, and details are required.',
    });
    return;
  }

  res.json({
    ok: true,
    referenceId: `SRV-${Date.now().toString(36).toUpperCase()}`,
    message: 'Problem report accepted by the server stub.',
  });
});

app.get('/api/employees', (_req, res) => {
  res.json(EMPLOYEES);
});

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});

/**
 * Start the server if this module is the main entry point, or it is ran via PM2.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }

    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);

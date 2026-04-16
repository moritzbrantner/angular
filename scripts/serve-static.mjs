import express from 'express';
import { resolve } from 'node:path';

const port = Number(process.env.PORT ?? 4173);
const staticRoot = resolve(process.cwd(), process.env.STATIC_ROOT ?? 'dist/angular2/browser');
const app = express();

app.use(express.static(staticRoot));

app.get(/.*/, (request, response, next) => {
  if (request.path.includes('.')) {
    next();
    return;
  }

  response.sendFile(resolve(staticRoot, 'index.html'));
});

const server = app.listen(port, '127.0.0.1', () => {
  console.log(`Serving ${staticRoot} on http://127.0.0.1:${port}`);
});

function shutdown() {
  server.close(() => process.exit(0));
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

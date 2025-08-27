const express = require('express');
const next = require('next');
const path = require('path');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const port = process.env.PORT || 3000;

app.prepare().then(() => {
  const server = express();

  // Serve static files from public directory
  server.use(express.static(path.join(__dirname, 'public')));
  
  // Parse JSON bodies for API routes
  server.use(express.json());

  // Handle API routes with Next.js
  server.use('/api', (req, res) => {
    return handle(req, res);
  });

  // Handle all other routes with Next.js using a proper catch-all
  server.use((req, res) => {
    return handle(req, res);
  });

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});

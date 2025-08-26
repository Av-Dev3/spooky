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

  // Serve HTML files directly - handle specific HTML routes
  server.get('/:filename.html', (req, res) => {
    const filePath = path.join(__dirname, 'public', req.params.filename + '.html');
    res.sendFile(filePath);
  });

  // Handle all other routes with Next.js
  server.all('*', (req, res) => {
    return handle(req, res);
  });

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});

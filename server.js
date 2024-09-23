const express = require('express');
const path = require('path');
const tracer = require('dd-trace').init(); // Initialize the tracer

const app = express();

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, 'dist')));

// Middleware to automatically trace requests
app.use((req, res, next) => {
  const startTime = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - startTime;
    // Custom metrics (timing, request count, etc.)
    tracer.trace('request', () => {
      tracer.increment('request.count'); // Increment request count
      tracer.timing('request.response_time', duration); // Send timing metric
      tracer.increment(`request.status_code.${res.statusCode}`); // Track status codes
    });
  });

  next();
});

// Handle SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Listen on the port Heroku provides (or fallback to 3000 locally)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
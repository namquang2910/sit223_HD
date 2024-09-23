const express = require('express');
const path = require('path');
const StatsD = require('hot-shots');

const app = express();

// Initialize the StatsD client
const dogstatsd = new StatsD({
  host: 'localhost', // Use the Datadog server (see below)
  port: 8125,
  prefix: 'myapp.' // Use a prefix for your application's metrics
});

// Middleware to log request count and duration
app.use((req, res, next) => {
  const startTime = Date.now();

  // Increment request count
  dogstatsd.increment('request.count');

  res.on('finish', () => {
    const duration = Date.now() - startTime;
    dogstatsd.timing('request.response_time', duration); // Log request duration
  });

  next();
});
dogstatsd.increment('request.count');

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, 'dist')));

// Handle SPA (Single Page Application) routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Listen on the port Heroku provides (or fallback to 3000 locally)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

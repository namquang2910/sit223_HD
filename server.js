const express = require('express');
const path = require('path');
const StatsD = require('hot-shots');

const app = express();

// Set up StatsD client for Datadog
const dogstatsd = new StatsD({
  host: 'us5.datadoghq.com', // Use your Datadog region
  port: 8125,
  prefix: 'simpleweb.' // Prefix for your metrics
});

// Middleware to track request metrics
app.use((req, res, next) => {
  const startTime = Date.now(); // Start timer for request duration
  res.on('finish', () => {
    const duration = Date.now() - startTime; // Calculate request duration
    dogstatsd.timing('request.response_time', duration); // Send timing metric
    dogstatsd.increment('request.status_code.' + res.statusCode); // Track status codes
    logger.info(`Handled request: ${req.method} ${req.url} with status ${res.statusCode} in ${duration}ms`);
  });

  dogstatsd.increment('request.count'); // Increment request count
  next();
});

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, 'dist')));

// Handle SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Listen on the port Heroku provides (or fallback to 3000 locally)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`Server is listening on port ${PORT}`);
  dogstatsd.increment('server.start'); // Track server start event
});

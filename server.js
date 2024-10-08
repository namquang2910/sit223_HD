const express = require('express');
const path = require('path');
const StatsD = require('hot-shots');

const app = express();

// Initialize the StatsD client
const dogstatsd = new StatsD({
  host: 'localhost', // Use the Datadog server
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
    // Log request duration
    dogstatsd.timing('request.response_time', duration);
    // Log response size
    dogstatsd.histogram('response.size', res.get('Content-Length') || 0);
    // Track HTTP status codes
    dogstatsd.increment(`response.status.${res.statusCode}`);
    dogstatsd.increment('response.status', res.statusCode);
    dogstatsd.timing('response.average_time', duration);
    // Increment response metrics based on status code
    dogstatsd.increment('response.count'); // Total responses
    if (res.statusCode >= 200 && res.statusCode < 300) {
      dogstatsd.increment('response.success'); // Successful responses
    } else if (res.statusCode >= 400 && res.statusCode < 500) {
      dogstatsd.increment('response.client_errors'); // Client errors
    } else if (res.statusCode >= 500) {
      dogstatsd.increment('response.server_errors'); // Server errors
    } 
  });

  next();
});


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

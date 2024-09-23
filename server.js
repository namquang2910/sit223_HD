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

// Variables to hold aggregated metrics
let requestCount = 0;
let totalResponseTime = 0;
let totalResponseSize = 0;
let errorCount = 0;

// Middleware to log request count and duration
app.use((req, res, next) => {
  const startTime = Date.now();

  // Increment request count
  requestCount++;

  res.on('finish', () => {
    const duration = Date.now() - startTime;

    // Aggregate response time and size
    totalResponseTime += duration;
    const responseSize = res.get('Content-Length') || 0;
    totalResponseSize += responseSize;

    // Track HTTP status codes
    if (res.statusCode >= 400) {
      errorCount++;
    }

    // Example: Log metrics immediately for individual requests
    dogstatsd.increment('request.count');
    dogstatsd.timing('request.response_time', duration);
    dogstatsd.histogram('response.size', responseSize);
    dogstatsd.increment(`response.status.${res.statusCode}`);
  });

  next();
});

// Middleware to track errors
app.use((err, req, res, next) => {
  errorCount++; // Increment error count
  console.error(err.stack); // Log the error stack trace
  res.status(500).send('Something went wrong!'); // Send a generic error response
});

// Custom Metrics Example
app.get('/signup', (req, res) => {
  dogstatsd.increment('user.signup.count');
  res.send('User signed up!');
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

// Set up an interval to send aggregated metrics
setInterval(() => {
  // Send aggregated metrics to Datadog
  dogstatsd.increment('request.count', requestCount);
  dogstatsd.timing('request.response_time', totalResponseTime / requestCount || 0); // Average response time
  dogstatsd.histogram('response.size', totalResponseSize / requestCount || 0); // Average response size
  dogstatsd.increment('request.errors', errorCount); // Total error count

  // Reset metrics after sending
  requestCount = 0;
  totalResponseTime = 0;
  totalResponseSize = 0;
  errorCount = 0;
}, 1000); // Send metrics every 60 seconds

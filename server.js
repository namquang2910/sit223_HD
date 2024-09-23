const express = require('express');
const path = require('path');
const StatsD = require('hot-shots');

const app = express();
const dogstatsd = new StatsD({
  host: 'us5.datadoghq.com', // Use 'us5.datadoghq.com' for Datadog's US region
  port: 8125,
  prefix: 'simpleweb.' // Replace with your application's prefix
});

// Middleware to log requests
app.use((req, res, next) => {
  const startTime = Date.now(); // Start time to calculate response time

  // Increment request count
  dogstatsd.increment('request.count');

  // End response and calculate duration
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    dogstatsd.timing('request.response_time', duration); // Log response time

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

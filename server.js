const express = require('express');
const path = require('path');
const StatsD = require('hot-shots');

const app = express();
const dogstatsd = new StatsD({
  host: 'datadoghq.com', // Datadog host
  port: 8125,
  prefix: 'simpleweb.' // Metric prefix
});

// Middleware to track request count
app.use((req, res, next) => {
  dogstatsd.increment('request.count'); // Increment request count
  next();
});

// Middleware to track response time
app.use((req, res, next) => {
  const startTime = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    dogstatsd.timing('request.response_time', duration); // Send response time
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

const express = require('express');
const path = require('path');
const winston = require('winston');
const StatsD = require('hot-shots');

const app = express();

// Configure StatsD for Datadog
const dogstatsd = new StatsD({
  host: 'https://simpleweb-production-38a2f21a4cd2.herokuapp.com/', // For Heroku, use localhost
  port: 8125,
  prefix: 'simpleweb.' // Prefix for your metrics
});

// Configure Winston logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(), // Log to console
    // You can add other transports here (e.g., file)
  ]
});

// Middleware to log requests and send metrics
app.use((req, res, next) => {
  const startTime = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - startTime;

    // Log the request
    logger.info(`Request to ${req.url} took ${duration}ms`);

    // Send metrics to Datadog
    dogstatsd.increment('request.count'); // Increment request count
    dogstatsd.timing('request.response_time', duration); // Send timing metric
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

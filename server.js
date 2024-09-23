const express = require('express');
const path = require('path');
const winston = require('winston');
const app = express();

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(), // Send logs to the console (stdout)
  ]
});

const logServerMetrics = () => {
  const memoryUsage = process.memoryUsage();
  logger.info('Server Metrics', {
    timestamp: new Date().toISOString(),
    memoryUsage: {
      rss: memoryUsage.rss, // Resident Set Size
      heapTotal: memoryUsage.heapTotal,
      heapUsed: memoryUsage.heapUsed,
      external: memoryUsage.external
    }
  });
};

// Set interval to log server metrics every 5 seconds
setInterval(logServerMetrics, 1000); // Logs every 5 seconds

// Example HTTP request logging
app.get('/', (req, res) => {
  logger.info('Hello from Heroku NodeJS app!', { timestamp: new Date().toISOString() });
  res.send('Logging with Winston continuously!');
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

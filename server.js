const express = require('express');
const path = require('path');
const winston = require('winston');
const axios = require('axios');

const app = express();

// Datadog API configuration
const DATADOG_API_KEY = process.env.DD_API_KEY; // Set your Datadog API key in environment variables
const DATADOG_API_URL = 'https://api.datadoghq.com/api/v1/series?api_key=' + DATADOG_API_KEY;

// Create a custom transport for sending metrics
class DatadogTransport {
  log(info, callback) {
    setImmediate(() => this.emit('logged', info));

    if (info.level === 'info') {
      this.sendMetric('request.count', 1);
    } else if (info.level === 'timing') {
      this.sendMetric('request.response_time', info.duration);
    }

    callback();
  }

  sendMetric(metricName, value) {
    const data = {
      series: [{
        metric: metricName,
        points: [[Math.floor(Date.now() / 1000), value]],
        type: 'gauge',
        host: 'your-app-name.herokuapp.com', // Use your Heroku app name
        tags: ['environment:production'] // You can add additional tags here
      }]
    };

    // Send the metric to Datadog
    axios.post(DATADOG_API_URL, data)
      .then(response => {
        console.log('Metric sent to Datadog:', response.data);
      })
      .catch(error => {
        console.error('Error sending metric to Datadog:', error);
      });
  }
}

// Configure Winston logger with the custom transport
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new DatadogTransport(), // Add your custom transport
    new winston.transports.Console(), // Log to console
  ]
});

// Middleware to log requests and send metrics
app.use((req, res, next) => {
  const startTime = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - startTime;

    // Log the request
    logger.info(`Request to ${req.url} took ${duration}ms`, { duration });

    // Send timing metric
    logger.log({ level: 'timing', duration });
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

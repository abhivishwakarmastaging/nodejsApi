require('dotenv').config({ path: '../.env' });
const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const routes = require('./routes/routesV1'); // Your existing routes file

const app = express();
const server = http.createServer(app);


app.use(express.json()); // Built-in JSON parser
app.use(bodyParser.json({
  limit: '500mb',
  type: 'application/json'
}));

app.use(bodyParser.urlencoded({
  extended: true,
  limit: '500mb',
  parameterLimit: 1000000
}));

app.use('/v1', routes);

// Simple health check
app.get('/', (req, res) => res.send('Driver Service running'));

// --------------------------
// Start server
// --------------------------
const PORT = process.env.DRIVER_RUNNER_PORT || 8086;
server.listen(PORT, () => {
    console.log(`🚚 Driver Service running on port http://localhost:${PORT}`)
});

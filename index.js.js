// require('dotenv').config({ path: '../.env' });
// const express = require('express');
// const http = require('http');
// const bodyParser = require('body-parser');

// // const cors = require('./middleware/corsHandler');
// // const errorHandler = require('./middleware/errorHandler');
// const { logger } = require('./log/logger');
// const routes = require('../vendor-service/routes/routesV1');
// // const requestLogger = require('./middleware/loggerMiddleware');
// // const initializeSocket = require('./soket'); // 📌 socket setup file

// const app = express();
// const server = http.createServer(app);

// // 🔹 Initialize Socket.IO with Express app
// // const io = initializeSocket(server, app);
// // console.log("Socket.IO initialized" + io ? "✅" : "❌");
// // 🔹 Middleware
// // app.use(cors);
// // app.use(requestLogger);
// app.use(bodyParser.json({ limit: '50mb' }));
// app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));

// // 🔹 Routes
// app.use('/v1', routes);

// // 🔹 Error handler
// // app.use(errorHandler);

// // 🔹 Start the server
// const PORT = process.env.VENDORPORT || 9092;
// app.get("/", (req, res) => res.send("Vendor Service running"));

// server.listen(PORT, () => {
//     console.log(`🏭 Vendor Service running on port ${PORT}`);
//     logger.info(`🏭 Vendor Service running on port ${PORT}`);
// });


require('dotenv').config({ path: '../.env' });
const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const routes = require('./routes/routesV1'); // Your existing routes file

const app = express();
const server = http.createServer(app);

// --------------------------
// Middleware to parse JSON
// --------------------------
// Must be **before** your routes
app.use(express.json()); // Built-in JSON parser
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb', parameterLimit: 50000 }));
app.use(bodyParser.json({ limit: '50mb' }));

// --------------------------
// Routes
// --------------------------
// Vendor API routes
app.use('/v1', routes);

// Simple health check
app.get('/', (req, res) => res.send('Vendor Service running'));

// --------------------------
// Start server
// --------------------------
const PORT = process.env.VENDORPORT || 9002;
server.listen(PORT, () => {
  console.log(`🏭 Vendor Service running on port ${PORT}`);
});

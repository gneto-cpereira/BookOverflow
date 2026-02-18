const express = require('express');
const cors = require('cors');
const bookRoutes = require('./routes/bookRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

/**
 * Global middleware configuration
 */
function setupMiddleware(app) {
  app.use(cors());
  app.use(express.json());
}

/**
 * Application routes setup
 */
function setupRoutes(app) {
  app.use('/books', bookRoutes);
  
  // Health check endpoint
  app.get('/', (_, res) => res.json({ status: "BookOverflow API is active" }));
}

/**
 * Initialize and start the server
 */
function start() {
  setupMiddleware(app);
  setupRoutes(app);

  app.listen(PORT, () => {
    console.log(`Backend server running on port ${PORT}`);
  });
}

start();
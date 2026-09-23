const express = require('express');
const cors = require('cors');
require('dotenv').config();

const sequelize = require('./config/database');
const { seedDatabase } = require('./seeders/seedData');
const eventRoutes = require('./routes/eventRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logger for development
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
  });
}

// Health check & welcome routes
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Event Discovery Platform API is running',
    version: '1.0.0',
    endpoints: {
      health: 'GET /api/health',
      events: 'GET /api/events',
    },
  });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// API Routes
app.use('/api/events', eventRoutes);

// 404 Not Found Middleware
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.originalUrl} - Route Not Found`,
  });
});

// Global Error Handler Middleware
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// Database Synchronization & Server Startup
const startServer = async () => {
  try {
    console.log('Connecting to PostgreSQL database...');
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');

    // Sync database schema
    console.log('Synchronizing database models...');
    await sequelize.sync();
    console.log('Database synchronized successfully.');

    // Auto-seed initial data if table is empty
    await seedDatabase();

    // Start listening
    app.listen(PORT, () => {
      console.log(`===============================================`);
      console.log(`🚀 Server is listening on http://localhost:${PORT}`);
      console.log(`📡 Event API available at http://localhost:${PORT}/api/events`);
      console.log(`===============================================`);
    });
  } catch (error) {
    console.error('Unable to connect to the database or start server:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;

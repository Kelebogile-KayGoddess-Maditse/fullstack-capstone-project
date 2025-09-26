/*jshint esversion: 8 */
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pinoHttp = require('pino-http');
const logger = require('./logger');
const { connectToDatabase } = require('./models/db');

const app = express();
app.use(cors());
app.use(express.json());
app.use(pinoHttp({ logger }));

const port = process.env.PORT || 3060;

const giftRoutes = require('./routes/giftRoutes');
const searchRoutes = require('./routes/searchRoutes');
const authRoutes = require('./routes/authRoutes');

connectToDatabase()
  .then(() => logger.info('Connected to MongoDB'))
  .catch((err) => {
    logger.error(err, 'Failed to connect to DB');
    process.exit(1);
  });

// mount routes
app.use('/api/gifts', giftRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/auth', authRoutes);

// health check
app.get('/health', (req, res) => res.send({ status: 'ok' }));

// default
app.get('/', (req, res) => res.send('GiftLink backend is running'));

// global error
app.use((err, req, res, next) => {
  logger.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(port, () => {
  logger.info(`Server running on port ${port}`);
});


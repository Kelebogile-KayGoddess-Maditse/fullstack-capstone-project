/*jshint esversion: 8 */
const express = require('express');
const router = express.Router();
const { connectToDatabase } = require('../models/db');
const logger = require('../logger');

// GET / - get all gifts
router.get('/', async (req, res, next) => {
  logger.info('GET /api/gifts called');
  try {
    const db = await connectToDatabase();
    const collection = db.collection('gifts');
    const gifts = await collection.find({}).toArray();
    res.json(gifts);
  } catch (err) {
    logger.error(err, 'Error fetching gifts');
    next(err);
  }
});

// GET /:id - get single gift by id
router.get('/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    const db = await connectToDatabase();
    const collection = db.collection('gifts');
    const gift = await collection.findOne({ id: id });
    if (!gift) return res.status(404).json({ error: 'Gift not found' });
    res.json(gift);
  } catch (err) {
    next(err);
  }
});

// POST / - create a gift (protected in future, but open for demo)
router.post('/', async (req, res, next) => {
  try {
    const db = await connectToDatabase();
    const collection = db.collection('gifts');
    const payload = req.body;
    payload.createdAt = new Date();
    const result = await collection.insertOne(payload);
    res.status(201).json({ ...payload, _id: result.insertedId });
  } catch (err) {
    next(err);
  }
});

module.exports = router;


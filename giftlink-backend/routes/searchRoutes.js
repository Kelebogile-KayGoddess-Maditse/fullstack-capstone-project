/*jshint esversion: 8 */
const express = require('express');
const router = express.Router();
const { connectToDatabase } = require('../models/db');
const logger = require('../logger');

router.get('/', async (req, res, next) => {
  try {
    const db = await connectToDatabase();
    const collection = db.collection('gifts');

    let query = {};

    // name filter (partial, case-insensitive)
    if (req.query.name && req.query.name.trim() !== '') {
      query.name = { $regex: req.query.name.trim(), $options: 'i' };
    }
    if (req.query.category) {
      query.category = req.query.category;
    }
    if (req.query.condition) {
      query.condition = req.query.condition;
    }
    if (req.query.age_years) {
      const maxAge = parseInt(req.query.age_years, 10);
      if (!isNaN(maxAge)) query.age_years = { $lte: maxAge };
    }

    const gifts = await collection.find(query).toArray();
    res.json(gifts);
  } catch (err) {
    logger.error(err, 'Search error');
    next(err);
  }
});

module.exports = router;


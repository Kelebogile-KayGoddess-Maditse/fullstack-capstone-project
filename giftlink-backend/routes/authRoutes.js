/*jshint esversion: 8 */
const express = require('express');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { connectToDatabase } = require('../models/db');
const router = express.Router();
const dotenv = require('dotenv');
const logger = require('../logger');

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret_for_prod';

// Registration
router.post('/register', [
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  body('firstName').notEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.warn({ errors: errors.array() }, 'Validation failed on /register');
    return res.status(400).json({ error: 'Validation failed', details: errors.array() });
  }
  try {
    const db = await connectToDatabase();
    const collection = db.collection('users');

    const existing = await collection.findOne({ email: req.body.email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ error: 'Email id already exists' });
    }

    const salt = await bcryptjs.genSalt(10);
    const hash = await bcryptjs.hash(req.body.password, salt);

    const newUser = {
      email: req.body.email.toLowerCase(),
      firstName: req.body.firstName,
      lastName: req.body.lastName || '',
      password: hash,
      createdAt: new Date(),
    };
    const result = await collection.insertOne(newUser);

    const payload = { user: { id: result.insertedId.toString() } };
    const authtoken = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
    logger.info('User registered', { email: newUser.email });

    res.json({ authtoken, email: newUser.email });
  } catch (err) {
    logger.error(err, 'Error in /register');
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login
router.post('/login', [
  body('email').isEmail(),
  body('password').exists()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: 'Invalid input', details: errors.array() });
  }
  try {
    const db = await connectToDatabase();
    const collection = db.collection('users');
    const theUser = await collection.findOne({ email: req.body.email.toLowerCase() });

    if (!theUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    const ok = await bcryptjs.compare(req.body.password, theUser.password);
    if (!ok) {
      return res.status(401).json({ error: 'Wrong password' });
    }

    const payload = { user: { id: theUser._id.toString() } };
    const authtoken = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
    logger.info('User logged in', { email: theUser.email });

    res.status(200).json({ authtoken, userName: theUser.firstName, userEmail: theUser.email });
  } catch (err) {
    logger.error(err, 'Error in /login');
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update profile
router.put('/update', [
  body('name').isLength({ min: 1 }).withMessage('Name required')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const email = req.headers.email;
    if (!email) return res.status(400).json({ error: 'Email header required' });

    const db = await connectToDatabase();
    const collection = db.collection('users');

    const existingUser = await collection.findOne({ email: email.toLowerCase() });
    if (!existingUser) return res.status(404).json({ error: 'User not found' });

    const updated = await collection.findOneAndUpdate(
      { email: email.toLowerCase() },
      { $set: { firstName: req.body.name, updatedAt: new Date() } },
      { returnDocument: 'after' }
    );
    const authtoken = jwt.sign({ user: { id: updated.value._id.toString() } }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ authtoken });
  } catch (err) {
    logger.error(err, 'Error in /update');
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

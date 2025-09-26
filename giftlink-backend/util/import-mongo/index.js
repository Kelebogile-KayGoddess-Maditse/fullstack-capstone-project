/*jshint esversion: 8 */
const fs = require('fs');
const path = require('path');
const { connectToDatabase } = require('../../models/db');
const logger = require('../../logger');

async function loadData() {
  const file = path.join(__dirname, 'gifts-sample.json');
  if (!fs.existsSync(file)) {
    logger.warn('No gifts-sample.json found');
    return;
  }
  const raw = fs.readFileSync(file);
  const gifts = JSON.parse(raw);
  const db = await connectToDatabase();
  const col = db.collection('gifts');
  await col.deleteMany({});
  await col.insertMany(gifts);
  logger.info('Sample gifts imported:', gifts.length);
}
module.exports = { loadData };


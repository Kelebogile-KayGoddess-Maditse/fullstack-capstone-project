/*jshint esversion: 8 */
require('dotenv').config();
const { MongoClient } = require('mongodb');

const url = process.env.MONGO_URL || process.env.MONGO_URI || "mongodb://localhost:27017";
const dbName = process.env.MONGO_DBNAME || "giftdb";

let dbInstance = null;
let clientInstance = null;

async function connectToDatabase() {
  if (dbInstance) return dbInstance;
  const client = new MongoClient(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await client.connect();
  clientInstance = client;
  dbInstance = client.db(dbName);
  return dbInstance;
}

async function closeDatabase() {
  if (clientInstance) {
    await clientInstance.close();
    clientInstance = null;
    dbInstance = null;
  }
}

module.exports = {
  connectToDatabase,
  closeDatabase,
};


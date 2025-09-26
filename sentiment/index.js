require('dotenv').config();
const express = require('express');
const natural = require('natural');
const logger = require('./logger') || console;
const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());

// POST /sentiment?sentence=...
app.post('/sentiment', async (req, res) => {
  try {
    const sentence = req.query.sentence || (req.body && req.body.sentence);
    if (!sentence || sentence.trim().length === 0) {
      return res.status(400).json({ error: 'No sentence provided' });
    }

    const Analyzer = natural.SentimentAnalyzer;
    const stemmer = natural.PorterStemmer;
    const analyzer = new Analyzer('English', stemmer, 'afinn');

    const tokens = sentence.split(/\s+/);
    const score = analyzer.getSentiment(tokens); // could be negative, zero, positive

    let sentiment = 'neutral';
    if (score < 0) sentiment = 'negative';
    else if (score > 0.33) sentiment = 'positive';

    logger && logger.info && logger.info('Sentiment scored', { score, sentiment });

    res.status(200).json({ sentimentScore: score, sentiment });
  } catch (err) {
    logger.error(err);
    res.status(500).json({ message: 'Error performing sentiment analysis' });
  }
});

app.listen(port, () => {
  logger.info(`Sentiment service running on port ${port}`);
});

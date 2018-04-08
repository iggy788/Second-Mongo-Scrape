// Dependencies
const express = require('express');
const router = express.Router();
const db = require('../models');

// GET Index to Populate index.handlebars with Articles
router.get('/', (req,res) => {
  db.Article
    .find({})
    .then(articles => res.render('index', {articles}))
    .catch(err=> res.json(err));
});

// Export Route
module.exports = router;
// Dependencies
const express = require('express');
const router = express.Router();
const db = require('../models');

// GET/UPDATE to Change 'saved' Boolean to TRUE, Best Idea I've Had
router.get('/save/:id', (req,res) => {
  db.Article
    .update({_id: req.params.id},{saved: true})
    .then(result=> res.redirect('/'))
    .catch(err => res.json(err));
});

// GET/FIND to Populate savedArticles.handlebars with Saved Articles
router.get('/viewSaved', (req, res) => {
  db.Article
    .find({})
    .then(result => res.render('savedArticles', {articles:result}))
    .catch(err => res.json(err));
});

// DELETE/REMOVE an Article from savedArticles & Mongo
router.delete('/deleteArticle/:id', function(req,res){
  db.Article
    .remove({_id: req.params.id})
    .then(result => res.json(result))
    .catch(err => res.json(err));
});

// Export Route
module.exports = router;
// Dependencies
const express = require('express');
const router = express.Router();
const db = require('../models');

// GET/FINDONE to find All Notes for an Article
router.get('/getNotes/:id', function (req,res){
  db.Article
    .findOne({_id: req.params.id})
    .populate('notes')
    .then(results => res.json(results))
    .catch(err => res.json(err));
});

// GET/FINDONE to find ONE Note for an Article
router.get('/getSingleNote/:id', function (req,res) {
  db.Note
  .findOne({_id: req.params.id})
  .then( result => res.json(result))
  .catch(err => res.json(err));
});

// POST/CREATE to Make a New Note in MongDB
router.post('/createNote', function (req,res){
  let { title, body, articleId } = req.body;
  let note = {
    title,
    body
  }
  db.Note
    .create(note)
    .then( result => {
      db.Article
        .findOneAndUpdate({_id: articleId}, {$push:{notes: result._id}},{new:true})//saving reference to note in corresponding article
        .then( data => res.json(result))
        .catch( err => res.json(err));
    })
    .catch(err => res.json(err));
});

// POST/REMOVE to Delete a Note
router.post('/deleteNote', (req,res)=>{
  let {articleId, noteId} = req.body
  db.Note
    .remove({_id: noteId})
    .then(result => res.json(result))
    .catch(err => res.json(err));
});

// Export Route
module.exports = router;
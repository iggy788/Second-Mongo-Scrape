// Dependencies
const express = require('express');
const cheerio = require('cheerio');
const rp = require('request-promise');
const router = express.Router();
const db = require('../models');

// GET to SCRAPE New Articles
router.get('/newArticles', function(req, res) {
  // request-promise Crawl a webpage better (https://www.npmjs.com/package/request-promise)
  const options = {
    uri: 'https://www.nytimes.com/section/us',
    transform: function (body) {
        return cheerio.load(body);
    }
  };
  // Ask MongoDB to give me all Saved Articles
  db.Article
    .find({})
    .then((savedArticles) => {

      let savedHeadlines = savedArticles.map(article => article.headline)

        // request-promise to Process html like you would with jQuery
        rp(options)
        .then(function ($) {
          let newArticleArr = [];
          // For Each Loop
          $('#latest-panel article.story.theme-summary').each((i, element) => {
            let newArticle = new db.Article({
              storyUrl: $(element).find('.story-body>.story-link').attr('href'),
              headline: $(element).find('h2.headline').text().trim(),
              summary : $(element).find('p.summary').text().trim(),
              imgUrl  : $(element).find('img').attr('src'),
              byLine  : $(element).find('p.byline').text().trim()
            });
            // Make Sure newArticle contains a storyUrl (if not don't save)
            if (newArticle.storyUrl) {
              // See if newArticle is already  in Mongo
              if (!savedHeadlines.includes(newArticle.headline)) {
                newArticleArr.push(newArticle);
              }
            }
          });

          // Adding all newArticle to Mongo
          db.Article
            .create(newArticleArr)
            .then(result => res.json({count: newArticleArr.length}))
            .catch(err => {});
		})
		// Crawling failed or Cheerio choked
        .catch(err => console.log(err))
    })
    .catch(err => console.log(err)
	)
});

// Export Route
module.exports = router;
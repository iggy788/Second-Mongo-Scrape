// Dependencies
const express = require('express');
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const logger = require('morgan');
const path = require('path');
// =============================================================================
// Initializing express app
const app = express();
// =============================================================================
//setting up the database
const config = require('./config/database');
mongoose.Promise = Promise;
mongoose
  .connect(config.database)
  .then( result => {
    console.log(`Connected to database '${result.connections[0].name}' on ${result.connections[0].host}:${result.connections[0].port}`)
  })
  .catch(err => console.log('There was an error with your connection:', err));

// Setup Middleware
// =============================================================================
// Morgan middleware
app.use(logger('dev'));

// Body-Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Handlebars
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// Static Directories
app.use(express.static(path.join(__dirname, 'public')));
app.use('/articles',express.static(path.join(__dirname, 'public')));
app.use('/notes',express.static(path.join(__dirname, 'public')));

// Routes
// =============================================================================
//setting up routes
const index = require('./routes/indexRoutes')
const articles = require('./routes/articleRoutes')
const notes = require('./routes/notesRoutes')
const scrape = require('./routes/scrapeRoutes')

app.use('/', index)
app.use('/articles', articles);
app.use('/notes', notes);
app.use('/scrape', scrape);

// Listener
// =============================================================================
//starting server
const PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
  console.log(`Listening on http://localhost:${PORT}`)
});
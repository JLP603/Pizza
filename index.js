// All imports needed here
const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const handlebars = require('handlebars');

// Creates the express application
const app = express();
const port = 3000;

/**
  Creates an engine called "hbs" using the express-handlebars package.
**/
app.engine( 'hbs', exphbs({
    extname: 'hbs', // configures the extension name to be .hbs instead of .handlebars
    defaultView: 'main', // this is the default value but you may change it to whatever you'd like
    layoutsDir: path.join(__dirname, '/views/layouts'), // Layouts folder
    partialsDir: path.join(__dirname, '/views/partials'), // Partials folder
  }));

// Setting the view engine to the express-handlebars engine we created
app.set('view engine', 'hbs');

// Routes
app.get('/', function(req, res) {
  res.render('about')
});
/**
  To be able to render images, css and JavaScript files, it's best to host the static files
  and use the expected path in the data and the imports.

  This takes the contents of the public folder and makes it accessible through the URL.
  i.e. public/css/styles.css (in project) will be accessible through http://localhost:3000/css/styles.css
**/
app.use(express.static('public'));

// Listening to the port provided
app.listen(port, function() {
    console.log('App listening at port '  + port)
  });
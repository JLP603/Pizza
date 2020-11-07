const express = require('express');
const path = require('path');
const app = express();
const port = 3000;
//Loads the handlebars module
const exphandle = require('express-handlebars');
const handlebars = require('express-handlebars');

app.engine('hbs', exphandle({
    extname: 'hbs',
    defaultView: 'main',
    layoutsDir: path.join(__dirname, '/views/layouts'), // Layouts folder
    partialsDir: path.join(__dirname, '/views/partials'), // Partials folder
}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');


app.use(express.static('public'));


app.get('/', (req, res) => {
//Serves the body of the page aka "main.handlebars" to the container //aka "index.handlebars"
res.render('main', {layout : 'index'});
});

app.listen(port, () => console.log(`App listening to port ${port}`));
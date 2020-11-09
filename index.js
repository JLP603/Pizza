const express = require('express')
const path = require('path')
const exphandle = require('express-handlebars')
const handlebars = require('handlebars')

const app = express()
const port = 9090

app.engine('hbs', exphandle({
    extname: 'hbs',
    defaultView: 'main',
    layoutsDir: path.join(__dirname, '/views/layouts'), // Layouts folder
    partialsDir: path.join(__dirname, '/views/partials'), // Partials folder
}))


app.set('view engine', 'hbs')

//For login page
app.get('/', function(req, res){
    res.render('login', {
        title: "Login Page"
    })
})

app.use(express.static('public'))

app.listen(port, function() {
    console.log('App listening at port '  + port)
  });
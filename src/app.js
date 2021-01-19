const path = require('path')
const express = require('express')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')
const hbs = require('hbs')

const app = express()

const port = process.env.PORT || 8080

//Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// Setup static directory to serve
app.use(express.static(publicDirectoryPath))

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather deployment Green',
        name: 'learning...'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: "About Me",
        name: "learning!"
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        helpText: 'Help pages.....',
        title: 'Help',
        name: 'learning...'
    })
})

app.get('/weather', (req, res) => {

    if (!req.query.address) {
        return res.send ({
            error: 'You must provide an address!'
        })
    }

    geocode(req.query.address, (error, {latitude, longitude, location} = {}) => {

        if (error) {
            return res.send ({
                error: error
            })
        }
    
        forecast(latitude, longitude, (error, forecastData) => {

            if (error) {
                return res.send ({ error })
            }
            
            res.send({
                forecast: forecastData,
                location: location,
                address: req.query.address
            })
        })
    })

    
})

app.get('/products', (req, res) => {

    if (!req.query.search) {
        return res.send ({
            error: 'You must provide a search term'
        })
    }

    console.log(req.query)
    res.send({
        products: []
    })
})

app.get('/help/*', (req, res) => {
    res.render('404', {
        errorMessage: "Help article not found",
        title: '404 page',
        name: 'VN'
    })
})

app.get('*', (req, res) => {
    res.render('404', {
        errorMessage: 'Page not found',
        title: 'Error 404 page',
        name: 'VN'
    })
})

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})
const request = require('request')

const forecast = (latitude, longitude, callback) => {
    //console.log('#####'+latitude)
    const url = 'https://api.darksky.net/forecast/c96baa6541df8fcda801289ec8abb819/' + latitude + ',' + longitude
    //https://api.darksky.net/forecast/c96baa6541df8fcda801289ec8abb819/32.7763,-96.7969

    request({url: url, json: true}, (error, response) => {
        if (error) {
            callback ('Unable to connect to weather service!', undefined)
        } else if (response.body.error) {
            callback('Unable to find location. Try another search.', undefined)
        } else {
            callback(undefined, response.body.daily.data[0].summary + ' It is currently ' + response.body.currently.temperature + ' degrees out. There is a ' + response.body.currently.precipProbability + '% chance of rain.')
        }
    })
}

module.exports = forecast
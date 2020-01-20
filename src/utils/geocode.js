const request = require('request')

const geocode = (address, callback) => {
    //console.log(address)
    const url = 'https://api.mapbox.com/geocoding/v5/mapbox.places/' + encodeURIComponent(address) +'.json?access_token=pk.eyJ1Ijoidm5lZWtocmEiLCJhIjoiY2s1ZW9rNjRmMjkxcTNybzY5MjlobjNhcyJ9.rvwFBQeLxhPlikIWaddxjA&limit=1'

    request({url, json: true}, (error, {body}) => {
        //console.log(body)
        if (error) {
            callback('Unable to connect to location services!', undefined)
        } else if (body.features.length === 0) {
            //console.log(response)
            callback('Unable to find location. Try another address', undefined)
        } else {
            callback(undefined, {
                latitude: body.features[0].center[1],
                longitude: body.features[0].center[0],
                location: body.features[0].place_name
            })
        }
    })

}

module.exports = geocode
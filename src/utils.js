const request = require("request");

const geocode = (searchInput, callback) => {
    const publicKey = "pk.eyJ1IjoidG9oZ28iLCJhIjoiY2s2NWE0ZzBsMTRyZDNtcXd3OHhzZXdtdyJ9.I_bwi734w3WWTpRKmEU_2A";
    const geocodeUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchInput)}.json?access_token=${publicKey}`;

    const options = {
        url: geocodeUrl,
        json: true
    };

    request(options, (error, response) => {

        if (error) {
            callback("An error has occurred! Unable to connect to servers :(", undefined);
        } else if (response.body.features.length === 0) {
            calback("An error has occurred! Unable to find location :(", undefined);
        } else {
            callback(undefined, {
                latitude: response.body.features[0].center[1].toString(),
                longitude: response.body.features[0].center[0].toString(),
                location: response.body.features[0].place_name
            });
        }
    });
}

const forecast = (latitude, longitude, callback) => {
    const options = {
        url: `https://api.darksky.net/forecast/35c5b9d0c89d857aa102241fde026054/${latitude},${longitude}?units=si`,
        json: true
    };

    request(options, (error, response) => {

        if (error) {
            callback("An error has occurred! Unable to connect to servers :(", undefined);
        } else if (response.body.error) {
            callback("An error has occurred! Unable to find weather forecast for this location :(", undefined);
        } else {
            callback(undefined, {
                time: response.body.currently.time,
                icon: response.body.currently.icon,
                summary: response.body.currently.summary,
                temperature: response.body.currently.temperature,
                actualFeel: response.body.currently.apparentTemperature,
                precip: response.body.currently.precipProbability * 100
            });
        }
    });
}

module.exports = {
    geocode,
    forecast
}
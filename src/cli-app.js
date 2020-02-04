const yargs = require("yargs");
const request = require("request");
const chalk = require("chalk");

const geocode = (searchInput, callback) => {
    const publicKey = "pk.eyJ1IjoidG9oZ28iLCJhIjoiY2s2NWE0ZzBsMTRyZDNtcXd3OHhzZXdtdyJ9.I_bwi734w3WWTpRKmEU_2A";
    const geocodeUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchInput)}.json?access_token=${publicKey}`;

    const options = {
        url: geocodeUrl,
        json: true
    };

    request(options, (error, response) => {

        if (error) {
            callback(chalk.red.bold("An error has occurred! Unable to connect to servers :("), undefined);
        } else if (response.body.features.length === 0) {
            calback(chalk.red.bold("An error has occurred! Unable to find location :("), undefined);
        } else {
            callback(undefined, {
                latitude: response.body.features[0].center[1].toString(),
                longitude: response.body.features[0].center[0].toString(),
                location: response.body.features[0].place_name
            });
        }
    });
}

const forecast = (latitude, longitude, location, callback) => {
    const options = {
        url: `https://api.darksky.net/forecast/35c5b9d0c89d857aa102241fde026054/${latitude},${longitude}?units=si`,
        json: true
    };

    request(options, (error, response) => {

        if (error) {
            callback(chalk.red.bold("An error has occurred! Unable to connect to servers :("), undefined);
        } else if (response.body.error) {
            callback(chalk.red.bold("An error has occurred! Unable to find weather forecast for this location :("), undefined);
        } else {
            callback(undefined, `${chalk.blue.bold(`WEATHER FORECAST FOR ${chalk.magenta.bold(location.toUpperCase())}\n`)}
            Summary: ${response.body.currently.summary}
            Temperature: ${response.body.currently.temperature}ºC
            Actual feel: ${response.body.currently.apparentTemperature}ºC
            Chance of rain: ${response.body.currently.precipProbability * 100}\n`);
        }
    });
}

yargs.command({
    command: "check-weather",
    description: "Check weather at a given lovation",
    builder: {
        location: {
            description: "Location where to check weather from",
            demand: true,
            type: "string"
        }
    },
    handler: argv => {
        geocode(argv.location, (error, data) => {
            if (error) console.log(error);

            if (data) {
                const { latitude, longitude, location } = data;

                forecast(latitude, longitude, location, (error, data) => {
                    if (error) console.log(error);
                    if (data) console.log(data);
                });
            }
        });
    }
});

setTimeout(() => {
    yargs.parse();
}, 200)
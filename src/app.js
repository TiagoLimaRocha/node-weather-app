const path = require("path");
const express = require("express");
const utils = require("./utils.js");

const app = express();
const publicDir = path.join(__dirname, "../public");

app.use(express.static(publicDir));

app.get("/weather", (req, res) => {

    if (!req.query.search_location) {
        res.send({
            error: "You must provide a valid location!"
        });
    } 
    else {
        utils.geocode(req.query.search_location, (geocode_error, coordinates) => {
            if (geocode_error) {
                res.send({geocode_error});
            } 
            else if (coordinates) {
                const { latitude, longitude, location } = coordinates;

                utils.forecast(latitude, longitude, (forecast_error, weatherForecast) => {
                    if (forecast_error) {
                        res.send({forecast_error});
                    }
                    else if (weatherForecast){

                        utils.getTime(weatherForecast.timezone, (error, dateTime) => {
                            if (error){
                                res.send({
                                    error
                                });
                            }
                            else {
                                res.send({
                                    forecast: weatherForecast,
                                    location,
                                    dateTime: dateTime 
                                });
                            }
                        });
                    } 
                });
            }
        });
    }

});

let port = process.env.PORT || 3000;
app.listen(port, () => console.log("Server is up and running! ☻"));




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
        utils.geocode(req.query.search_location, (error, data) => {
            if (error){
                res.send({error});
            } 
            else if (data) {
                const { latitude, longitude, location } = data;

                utils.forecast(latitude, longitude, (error, data) => {
                    if (error) {
                        res.send({error});
                    }
                    else if (data){
                        res.send({
                            forecast: data,
                            location
                        });
                    } 
                });
            }
        });
    }

});

const port = process.argv.PORT || 3000;
app.listen(port, () => console.log("Server is up and running! ☻"));




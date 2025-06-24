require('dotenv').config();
const express = require('express')
const app = express()
const cors = require('cors')
const port = 3000

app.use(cors({ origin: true, credentials: true }))

app.get('/weather', async (req, res) => {
    // console.log("query: " + req.query);

    const apiKey = process.env.API_KEY;
    const lat = req.query.lat;
    const lon = req.query.lon;

    try {
        const response = await fetch(`http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${lat},${lon}&days=1&aqi=no&alerts=no`);

        if (!response.ok) {
            console.error('Upstream weather API error:', response.status);
            return res.status(response.status).json({ error: 'Weather API failed' });
        }

        const data = await response.json();

        if (!data) {
            return res.status(500).json({ error: 'No weather data found.' });
        }

        res.json(data);

        /*
        const hoursArray = data?.forecast?.forecastday[0]?.hour;

        if (!hoursArray) {
            return res.status(500).json({ error: 'No hourly forecast data found' });
        }

        res.json(hoursArray);
        */
    } catch (error) {
        console.error('Error fetching weather (server):', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
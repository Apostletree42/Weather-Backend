import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

//configures the .env file where the key is stored
dotenv.config();

const app = express()
const PORT = 3000;
const apiKey = process.env.API_KEY;

//For serving static file from public(where the html file exists)
app.use(express.static('public'));

// Route for getting data
app.get('/weather', async (req, res) => {
    const { location } = req.query;

    // If location parameter not given
    if (!location) {
        return res.status(400).json({ error: 'Missing location query parameter' });
    }

    // store api url in variable for easy access
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        if (data.cod !== 200){
            return res.status(data.cod).json({ error: data.message });
        }

        //store fetched data in an object
        const weatherData = {
            location: data.name,
            temperature: data.main.temp,
            description: data.weather[0].description,
            icon: data.weather[0].icon,
        };

        //jsonify the object to send to frontend
        return res.json(weatherData);
    } catch(error){
        // Handle errors that occur during API calls
        console.error(error);
        return res.status(500).json({ error: 'Failed to fetch data :/'});
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
})
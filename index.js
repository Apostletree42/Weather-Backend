import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const app = express()
const PORT = 3000;
const apiKey = process.env.API_KEY;


app.use(express.static('public'));

// Route for getting data
app.get('/weather', async (req, res) => {
    const { location } = req.query;

    if (!location) {
        return res.status(400).json({ error: 'Missing location query parameter' });
    }

    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        if (data.cod !== 200){
            return res.status(data.cod).json({ error: data.message });
        }

        const weatherData = {
            location: data.name,
            temperature: data.main.temp,
            description: data.weather[0].description,
            icon: data.weather[0].icon,
        };

        return res.json(weatherData);
    } catch(error){
        console.error(error);
        return res.status(500).json({ error: 'Failed to fetch data :/'});
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
})
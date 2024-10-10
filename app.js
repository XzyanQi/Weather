const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
const app = express();

dotenv.config();

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index');
});


app.post('/get-weather', async (req, res) => {
    const city = req.body.city;
    const apiKey = process.env.OPENWEATHERMAP_API_KEY;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`; 

    try {
        const response = await axios.get(url);
        const weatherData = response.data;

        const weatherInfo = {
            city: weatherData.name,
            temperature: weatherData.main.temp,
            description: weatherData.weather[0].description,
            humidity: weatherData.main.humidity,
            windSpeed: weatherData.wind.speed
        };

        res.render('result', { weather: weatherInfo });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error retrieving weather data. Please check the city name and try again.');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

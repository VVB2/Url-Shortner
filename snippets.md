### Get users IP and Geolocation

```js
const express = require('express');
const requestIp = require('request-ip');
const axios = require('axios');

const app = express();
const PORT = 3000;

// Middleware to extract user's IP address
app.use(requestIp.mw());

// Endpoint to get user's IP and geolocation
app.get('/getGeolocation', async (req, res) => {
  try {
    const ipAddress = req.clientIp;
    
    // Get geolocation based on IP address
    const geolocation = await getUserGeolocation(ipAddress);

    res.json({ ipAddress, geolocation });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Function to fetch geolocation based on IP
async function getUserGeolocation(ipAddress) {
  try {
    const response = await axios.get(`https://ipinfo.io/${ipAddress}/json`);
    const data = response.data;

    // Extract relevant information
    const { city, region, country, loc } = data;

    return {
      city,
      region,
      country,
      location: loc.split(',').map(coord => parseFloat(coord.trim())),
    };
  } catch (error) {
    console.error('Error fetching geolocation:', error.message);
    return null;
  }
}

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

```
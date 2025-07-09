require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');


const app = express();
app.use(cors());
const PORT = 3000;

const API_KEY = process.env.Api_Key;
const CX_ID = process.env.searchEngineId;

app.get('/search', async (req, res) => {
    const email = req.query.q;
    if (!email) {
        return res.status(400).json({ error: 'Missing query param ?q=email@example.com' });
    }

    const query = email;
    const result = {
        email,
        message: 'No results found',
        linkedin: []
    };

    try {
        for (let start = 1; start <= 30 && result.linkedin.length < 3; start += 10) {
            const url = `https://www.googleapis.com/customsearch/v1?key=${API_KEY}&cx=${CX_ID}&q=${encodeURIComponent(query)}&start=${start}`;
            const response = await axios.get(url);
            const items = response.data.items || [];

            for (const item of items) {
                const link = item.link.toLowerCase();
                if (link.includes('linkedin.com/in')) {
                    const metatags = item.pagemap?.metatags?.[0] || {};
                    const image =
                        metatags['og:image'] ||
                        metatags['twitter:image'] ||
                        item.pagemap?.cse_image?.[0]?.src ||
                        null;

                    result.linkedin.push({
                        url: item.link,
                        title: item.title,
                        profileImage: image
                    });

                    if (result.linkedin.length === 3) break;
                }
            }
        }

        if (result.linkedin.length > 0) {
            result.message = 'Success';
        }

        return res.json(result);
    } catch (error) {
        console.error(' Error:', error.message);
        res.status(500).json({ error: 'Failed to fetch from Google', detail: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});

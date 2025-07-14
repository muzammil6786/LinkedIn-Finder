require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const { connectToMongo, getCachedResult, cacheResult } = require('./cache');
const getNextApiKey = require('./rotateKeys');

const app = express();
app.use(cors());
const PORT = 3000;
const CX_ID = process.env.CX_ID;

app.get('/search', async (req, res) => {
    const query = req.query.q;
    if (!query) return res.status(400).json({ error: 'Missing ?q= parameter' });

    const cached = await getCachedResult(query);
    if (cached) {
        console.log('🟢 Serving from cache');
        return res.json(cached);
    }

    const apiKey = getNextApiKey();
    const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${CX_ID}&q=${encodeURIComponent(query)}`;

    try {
        const response = await axios.get(url);
        const items = response.data.items || [];

        const linkedinLinks = items
            .filter(item => item.link.toLowerCase().includes('linkedin.com/in'))
            .map(item => {
                const metatags = item.pagemap?.metatags?.[0] || {};

                const image =
                    metatags['og:image'] ||
                    metatags['twitter:image'] ||
                    item.pagemap?.cse_image?.[0]?.src ||
                    'https://via.placeholder.com/50';

                const description =
                    metatags['og:description'] ||
                    metatags['twitter:description'] ||
                    item.snippet ||
                    'No description available.';

                return {
                    url: item.link,
                    title: item.title || 'LinkedIn Profile',
                    profileImage: image,
                    description: description
                };
            })
            .slice(0, 3);


        const result = {
            query,
            message: linkedinLinks.length ? 'Success' : 'No results',
            linkedin: linkedinLinks
        };

        await cacheResult(query, result);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: 'Google API failed', detail: err.message });
    }
});


(async () => {
    await connectToMongo(process.env.MONGO_URI);
    app.listen(PORT, () => {
        console.log(`Backend running at http://localhost:${PORT}`);
    });
})();

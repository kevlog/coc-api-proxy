import 'dotenv/config';
import express from 'express';
import fetch from 'node-fetch';

const app = express();
const PORT = process.env.PORT || 3000;
const COC_API_KEY = process.env.COC_API_KEY;

if (!COC_API_KEY) {
    console.error("API Key is missing! Please set COC_API_KEY in .env file.");
    process.exit(1);
}

app.use(express.json());

// Proxy endpoint untuk mengambil data clan
app.get('/api/clan/:tag', async (req, res) => {
    const clanTag = encodeURIComponent(req.params.tag.replace('#', '%23'));
    const url = `https://api.clashofclans.com/v1/clans/${clanTag}`;
    
    try {
        const response = await fetch(url, {
            headers: { 'Authorization': `Bearer ${COC_API_KEY}` }
        });
        
        if (!response.ok) {
            return res.status(response.status).json({ error: "Failed to fetch data" });
        }

        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

import express from 'express';
import fetch from 'node-fetch';
import 'dotenv/config';

const app = express();
const PORT = process.env.PORT || 3000;
const COC_API_KEY = process.env.COC_API_KEY;

app.get('/api/clan', async (req, res) => {
    try {
        let clanTag = req.query.tag; // Ambil dari query parameter

        if (!clanTag) {
            return res.status(400).json({ error: "Clan tag is required" });
        }

        // ✅ Bersihkan input: Hapus semua karakter yang bukan alfanumerik atau '#'
        clanTag = clanTag.replace(/[^a-zA-Z0-9#]/g, '').toUpperCase();

        // ✅ Pastikan hanya ada satu '#' di depan
        clanTag = `#${clanTag.replace(/^#+/, '')}`;

        // ✅ Validasi panjang clan tag (biasanya 8-10 karakter)
        if (!/^#[0289CGJLPQRUVY]{8,10}$/.test(clanTag)) {
            return res.status(400).json({ error: "Invalid clan tag format" });
        }

        const url = `https://api.clashofclans.com/v1/clans/${encodeURIComponent(clanTag)}`;

        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${COC_API_KEY}`,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            return res.status(response.status).json({ error: JSON.parse(errorText) });
        }

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error("Fetch Error:", error);
        res.status(500).json({ error: "Failed to fetch data" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

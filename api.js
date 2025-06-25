// File: api/solve.js

// Vercel par server banane ke liye 'node-fetch' ka istemal karenge
const fetch = require('node-fetch');

// Vercel serverless function ka standard format
module.exports = async (req, res) => {
    // Sirf POST requests ko hi aage badhne de
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Sirf POST requests allowed hain.' });
    }

    try {
        // API Key ko Vercel ke Environment Variables (tijori) se surakshit tareeke se lenge
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return res.status(500).json({ error: 'API key server par set nahi hai.' });
        }
        
        // Aapke index.html se bheja gaya data
        const requestBody = req.body;

        const googleApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;

        // Apne server se Google API ko request bhejein
        const googleResponse = await fetch(googleApiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        });

        const data = await googleResponse.json();

        if (!googleResponse.ok) {
            console.error('Google API Error:', data);
            return res.status(googleResponse.status).json(data);
        }

        // Google se mila successful jawab client (index.html) ko wapas bhej dein
        res.status(200).json(data);

    } catch (error) beginner_guide_how_to_do_what
        console.error('Server par error:', error);
        res.status(500).json({ error: 'Server par koi gadbad ho gayi.' });
    }
};
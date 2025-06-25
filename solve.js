const fetch = require('node-fetch');

module.exports = async (req, res) => {
    try {
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
          return res.status(500).json({ error: { message: 'API Key server par nahi mili.' }});
        }

        const googleResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req.body),
        });

        if (!googleResponse.ok) {
          const errorData = await googleResponse.json();
          return res.status(googleResponse.status).json(errorData);
        }

        const data = await googleResponse.json();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: { message: 'Server par ek anjaan error aayi.' }});
    }
};

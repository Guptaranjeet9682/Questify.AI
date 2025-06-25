// File: api/solve.js

const fetch = require('node-fetch');

module.exports = async (req, res) => {
    // 1. Check if the request is a POST request
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Only POST requests are allowed' });
    }

    // 2. Get the API key from Vercel's secret environment variables
    const apiKey = process.env.GEMINI_API_KEY;

    // 3. If the key is not found, return an error
    if (!apiKey) {
        console.error('GEMINI_API_KEY is not set in Vercel environment variables.');
        return res.status(500).json({ error: 'API key is not configured on the server.' });
    }

    try {
        // 4. Prepare the request to the Google API
        const googleApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;

        // 5. Send the request to Google using the data from the client
        const googleResponse = await fetch(googleApiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(req.body), // Forward the client's request body
        });

        // 6. Get the response data from Google
        const data = await googleResponse.json();

        // 7. If Google returned an error, send it back to the client
        if (!googleResponse.ok) {
            console.error('Error from Google API:', data);
            return res.status(googleResponse.status).json(data);
        }

        // 8. If everything is successful, send the successful response back to the client
        return res.status(200).json(data);

    } catch (error) {
        // 9. If any other server error occurs, log it and inform the client
        console.error('Internal Server Error:', error);
        return res.status(500).json({ error: 'An unexpected error occurred on the server.' });
    }
};

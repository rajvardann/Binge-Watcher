const express = require('express');
const axios = require('axios');
const cors = require('cors');
const fs = require('fs');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const API_KEY = "6152235c";

/* -------------Helper Functions-------------- */

// Read watchlist safely
function readWatchlist() {
    try {
        const data = fs.readFileSync('./data/watchlist.json');
        return JSON.parse(data);
    } catch {
        return []; // fallback if file is broken
    }
}

// Write watchlist safely
function writeWatchlist(data) {
    fs.writeFileSync('./data/watchlist.json', JSON.stringify(data, null, 2));
}

/* ---------------Search Movies API--------------- */

app.get('/search', async (req, res) => {
    const query = req.query.q;

    // Basic validation
    if (!query) {
        return res.status(400).json({ error: "Query is required" });
    }

    try {
        const response = await axios.get(
            `http://www.omdbapi.com/?apikey=${API_KEY}&s=${query}`
        );

        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: "Error fetching data" });
    }
});

/* -------------Get Watchlist-------------------- */

app.get('/watchlist', (req, res) => {
    const data = readWatchlist();
    res.json(data);
});

/* -------------------Add to Watchlist------------------ */

app.post('/watchlist', (req, res) => {
    const newItem = req.body;

    // Validate input
    if (!newItem || !newItem.imdbID) {
        return res.status(400).json({ error: "Invalid movie data" });
    }

    let data = readWatchlist();

    // Prevent duplicates
    const exists = data.find(item => item.imdbID === newItem.imdbID);

    if (exists) {
        return res.json({ message: "Already in watchlist" });
    }

    data.push(newItem);
    writeWatchlist(data);

    res.json({ message: "Added to watchlist" });
});

/* ---------------Remove from Watchlist------------------ */

app.delete('/watchlist/:id', (req, res) => {
    const id = req.params.id;

    let data = readWatchlist();

    data = data.filter(item => item.imdbID !== id);

    writeWatchlist(data);

    res.json({ message: "Removed from watchlist" });
});

/* ----------------Toggle Watched Status-------------------- */

app.put('/watchlist/:id', (req, res) => {
    const id = req.params.id;

    let data = readWatchlist();

    data = data.map(movie => {
        if (movie.imdbID === id) {
            movie.isWatched = !movie.isWatched;
        }
        return movie;
    });

    writeWatchlist(data);

    res.json({ message: "Updated watched status" });
});

/* ----------------Test Route------------------- */

app.get('/', (req, res) => {
    res.send('Server is working!');
});

/* ----------------Start Server ---------------------*/

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
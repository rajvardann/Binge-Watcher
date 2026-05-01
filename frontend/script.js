const API_URL = "http://localhost:5000";

/* ===== APPLICATION STATE ===== */
let watchlistIDs = [];

/* ===== SEARCH ===== */
async function searchMovies() {
    const query = document.getElementById("searchInput").value.trim();

    if (!query) {
        alert("Enter a movie name!");
        return;
    }

    const res = await fetch(`${API_URL}/search?q=${query}`);
    const data = await res.json();

    if (data.Response === "False") {
        document.getElementById("results").innerHTML = "<p>No movies found 😔</p>";
        return;
    }

    displayResults(data.Search);
}

/* ===== DISPLAY RESULTS ===== */
function displayResults(movies) {
    const resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = "";

    movies.forEach(movie => {
        const div = document.createElement("div");
        div.className = "card";

        const imgSrc = movie.Poster && movie.Poster !== "N/A"
            ? movie.Poster
            : "https://via.placeholder.com/300x450?text=No+Image";

        const isAdded = watchlistIDs.includes(movie.imdbID);

        div.innerHTML = `
            <img src="${imgSrc}">
            <div class="card-content">
                <h3>${movie.Title}</h3>
                <p>${movie.Year}</p>
                <button ${isAdded ? "disabled" : ""}>
                    ${isAdded ? "Added ✓" : "Add"}
                </button>
            </div>
        `;
        if (!isAdded) {
            div.querySelector("button").onclick = () => addToWatchlist(movie);
        }

        resultsDiv.appendChild(div);
    });
}

/* ===== ADD MOVIE TO WATCHLIST===== */
async function addToWatchlist(movie) {
    movie.isWatched = false;

    await fetch(`${API_URL}/watchlist`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(movie)
    });

    await loadWatchlist();

    const query = document.getElementById("searchInput").value.trim();
    if (query) searchMovies();
}

/* ===== LOAD WATCHLIST ===== */
async function loadWatchlist() {
    const res = await fetch(`${API_URL}/watchlist`);
    const data = await res.json();

    /* Update watchlist count badge */
    document.getElementById("watchlistCount").textContent = data.length;

    /* Store IDs for quick lookup */
    watchlistIDs = data.map(m => m.imdbID);

    const watchlistDiv = document.getElementById("watchlist");

    if (data.length === 0) {
        watchlistDiv.innerHTML = "<p>Your watchlist is empty 🎬</p>";
        return;
    }

    watchlistDiv.innerHTML = "";

    data.forEach(movie => {
        const div = document.createElement("div");
        div.className = "card";

        const imgSrc = movie.Poster && movie.Poster !== "N/A"
            ? movie.Poster
            : "https://via.placeholder.com/300x450?text=No+Image";

        div.innerHTML = `
            <img src="${imgSrc}">
            <div class="card-content">
                <h3>${movie.Title}</h3>
                <p>${movie.isWatched ? "✅ Watched" : "⏳ Not Watched"}</p>
                <button onclick="toggleWatched('${movie.imdbID}')">
                    ${movie.isWatched ? "Mark as Unwatched" : "Mark as Watched"}
                </button>
                <button onclick="removeFromWatchlist('${movie.imdbID}')">Remove</button>
            </div>
        `;

        watchlistDiv.appendChild(div);
    });
}

/* ===== REMOVE ===== */
async function removeFromWatchlist(id) {
    await fetch(`${API_URL}/watchlist/${id}`, { method: "DELETE" });

    await loadWatchlist();

    const query = document.getElementById("searchInput").value.trim();
    if (query) searchMovies();
}

/* ===== TOGGLE WATCHED ===== */
async function toggleWatched(id) {
    await fetch(`${API_URL}/watchlist/${id}`, { method: "PUT" });
    loadWatchlist();
}

/* ===== ENTER KEY ===== */
function handleKeyPress(event) {
    if (event.key === "Enter") searchMovies();
}

/* ===== SIDEBAR TOGGLE ===== */
const sidebar = document.getElementById("watchlistSidebar");
const toggleBtn = document.getElementById("watchlistToggle");
const overlay = document.getElementById("overlay");

toggleBtn.onclick = () => {
    sidebar.classList.toggle("active");
    overlay.classList.toggle("active");
};

/* ===== INITIAL LOAD ===== */
loadWatchlist();
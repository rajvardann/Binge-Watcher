# Binge Watcher

A full-stack web application that allows users to search, track, and manage movies and TV shows using a personalized watchlist.

---

## Features

* Search movies and TV shows using OMDb API
* Add movies to watchlist
* Remove movies from watchlist
* Mark movies as watched/unwatched
* Sidebar-based watchlist interface
* Watchlist counter badge
* Persistent storage using a local JSON file

---

## Tech Stack

### Frontend

* HTML
* CSS
* JavaScript

### Backend

* Node.js
* Express.js

### API

* OMDb API

### Storage

* Local JSON file

---

## How to Run the Project
NOTE : You will need to install Node.js into your computer to run this project.

### 1. Clone the repository

```bash
git clone https://github.com/rajvardann/Binge-Watcher.git
```

### 2. Navigate to backend folder

```bash
cd backend
```

### 3. Install dependencies

```bash
npm install
```

### 4. Start the server

```bash
node server.js
```

### 5. Run the frontend

Open the file:

```
frontend/index.html
```

in your browser

---

## Project Explanation

This application follows a client-server architecture:

* The frontend interacts with the backend using REST API calls
* The backend fetches movie data from the OMDb API
* Watchlist data is stored locally using a JSON file
* Dynamic UI updates are handled using JavaScript

---

## Notes

* The watchlist is stored locally and will reset on different systems
* The backend server must be running for full functionality

---

## Author

Rajvardhan Patil

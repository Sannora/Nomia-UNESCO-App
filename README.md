# Nomia

Nomia is an interactive web application for exploring UNESCO World Heritage Sites around the world. It combines geographical visualization with historical and cultural data, allowing users to discover sites through multiple map representations, powerful filtering, and an intuitive interface.

The project was developed as a full-stack application using React, Express, MongoDB and Leaflet, with a strong focus on user experience, data visualization and clean architecture.

---

## Features

* Interactive world map powered by Leaflet
* Standard marker visualization with clustering
* Timeline mode to explore sites by inscription year
* Heatmap visualization for endangered heritage sites
* Dot density visualization for geographical distribution
* Dynamic filtering by:

  * Region
  * Country
  * Category
  * Search
* Multiple map themes
* Detailed information panel for every site
* Interactive tooltips with site thumbnails
* Responsive design
* Smooth loading experience and UI animations

---

## Tech Stack

### Frontend

* React
* React Router
* React Leaflet
* Leaflet
* React Leaflet Cluster
* Axios
* Font Awesome
* CSS

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose

### Data Processing

* Custom dataset cleaning scripts
* Image matching utilities
* Automated data normalization scripts

---

## Project Structure

```text
app
├── client
│   ├── src
│   ├── public
│   └── ...
│
└── server
    ├── controllers
    ├── models
    ├── routes
    ├── services
    ├── scripts
    ├── uploads
    └── ...
```

---

## Screenshots

*(Project screenshots will be added here.)*

---

## Installation

Clone the repository.

```bash
git clone https://github.com/Sannora/nomia.git
```

Install dependencies.

### Client

```bash
cd client
npm install
```

### Server

```bash
cd ../server
npm install
```

---

## Environment Variables

Create a `.env` file inside the **server** directory.

Example:

```env
PORT=4000

MONGO_URI=your_mongodb_connection

UNSPLASH_ACCESS_KEY=your_key

GOOGLE_API_KEY=your_key
```

Create a `.env` file inside the **client** directory.

```env
VITE_API_BASE=http://localhost:4000
```

---

## Running the Project

Start the backend.

```bash
cd server
node index.js
```

Start the frontend.

```bash
cd client
npm run dev
```

---

## Dataset

The application uses UNESCO World Heritage Site data enriched through custom preprocessing scripts.

Several utility scripts located under `server/scripts` were developed to:

* clean and normalize raw datasets
* enrich records with additional metadata
* automate image collection
* prepare production-ready data
    
---

Developed by **Melih Hocaoğlu**

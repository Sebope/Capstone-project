const API_KEY = '29853db7';
const BASE_URL = `http://www.omdbapi.com/?apikey=${API_KEY}`;

const searchButton = document.getElementById('search-button');
const searchInput = document.getElementById('search-input');
const movieList = document.getElementById('movie-list');
const movieDetails = document.getElementById('movie-details');

// Fetch movie data based on user query
const fetchMovies = async (query) => {
    try {
        const response = await fetch(`${BASE_URL}&s=${query}`);
        const data = await response.json();
        if (data.Response === "True") {
            displayMovies(data.Search);
        } else {
            movieList.innerHTML = `<p>No results found for "${query}"</p>`;
        }
    } catch (error) {
        movieList.innerHTML = `<p>Error fetching data. Please try again later.</p>`;
    }
};

// Display list of movies
const displayMovies = (movies) => {
    movieList.innerHTML = '';
    movies.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.classList.add('movie-card');
        movieCard.innerHTML = `
            <img src="${movie.Poster}" alt="${movie.Title}">
            <h3>${movie.Title}</h3>
            <p>${movie.Year}</p>
            <button class="details-button" data-id="${movie.imdbID}">Details</button>
        `;
        movieList.appendChild(movieCard);
    });
    addDetailButtonsListeners();
};

// Add event listeners for details buttons
const addDetailButtonsListeners = () => {
    const detailButtons = document.querySelectorAll('.details-button');
    detailButtons.forEach(button => {
        button.addEventListener('click', () => {
            const movieId = button.getAttribute('data-id');
            fetchMovieDetails(movieId);
        });
    });
};

// Fetch detailed movie information
const fetchMovieDetails = async (id) => {
    try {
        const response = await fetch(`${BASE_URL}&i=${id}`);
        const movie = await response.json();
        displayMovieDetails(movie);
    } catch (error) {
        movieDetails.innerHTML = `<p>Error fetching movie details. Please try again later.</p>`;
    }
};

// Display movie details
const displayMovieDetails = (movie) => {
  movieDetails.classList.remove('hidden');
  movieDetails.innerHTML = `
      <div class="movie-details-container">
          <img class="movie-poster" src="${movie.Poster}" alt="${movie.Title}">
          <div class="movie-info">
              <h2>${movie.Title}</h2>
              <p><strong>Plot:</strong> ${movie.Plot}</p>
              <p><strong>Cast:</strong> ${movie.Actors}</p>
              <p><strong>Genre:</strong> ${movie.Genre}</p>
              <p><strong>Ratings:</strong></p>
              <ul>
                  ${movie.Ratings.map(rating => `<li>${rating.Source}: ${rating.Value}</li>`).join('')}
              </ul>
              <button onclick="closeMovieDetails()">Close</button>
          </div>
      </div>
  `;
};


// Close movie details view
const closeMovieDetails = () => {
    movieDetails.classList.add('hidden');
};

// Add event listener for search button
searchButton.addEventListener('click', () => {
    const query = searchInput.value.trim();
    if (query) {
        fetchMovies(query);
    }
});
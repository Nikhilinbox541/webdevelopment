const apiKey = '3fd2be6f0c70a2a598f084ddfb75487c'; // Replace with your TMDB API key
const imageBaseUrl = 'https://image.tmdb.org/t/p/w500';
const listContainer = document.getElementById('movieList');

async function fetchMovies(url) {
  listContainer.innerHTML = '';

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (!data.results.length) {
      listContainer.innerHTML = `<div class='no-results'>No results found.</div>`;
      return;
    }

    displayMovies(data.results);
  } catch (err) {
    console.error('Error fetching data:', err);
    listContainer.innerHTML = `<div class='no-results'>Something went wrong. Try again later.</div>`;
  }
}

function displayMovies(movies) {
  movies.slice(0, 12).forEach(movie => {
    const card = document.createElement('div');
    card.classList.add('movie-card');

    const posterPath = movie.poster_path ? `${imageBaseUrl}${movie.poster_path}` : 'https://via.placeholder.com/250x350';

    card.innerHTML = `
      <img src="${posterPath}" alt="${movie.title}">
      <h3>${movie.title}</h3>
      <p><strong>Release:</strong> ${movie.release_date || 'N/A'}</p>
      <p><strong>Rating:</strong> ${movie.vote_average || 'N/A'}</p>
      <p><strong>Overview:</strong> ${movie.overview || 'No description available.'}</p>
    `;

    listContainer.appendChild(card);
  });
}

// function searchMovies() {
//   const query = document.getElementById('searchInput').value.trim();
//   if (!query) return;
//   const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}`;
//   fetchMovies(url);
// }
async function searchMovies() {
  const query = document.getElementById('searchInput').value.trim();
  const type = document.getElementById('searchType').value;
  if (!query) return;

  if (type === 'movie') {
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}`;
    fetchMovies(url);
  } else {
    searchMoviesByActor(query);
  }
}

function getTrendingMovies() {
  const url = `https://api.themoviedb.org/3/trending/movie/week?api_key=${apiKey}`;
  fetchMovies(url);
}

function getTopRatedMovies() {
  const url = `https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}`;
  fetchMovies(url);
}

function getNowPlayingMovies() {
  const url = `https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}`;
  fetchMovies(url);
}
async function searchMoviesByActor(actorName) {
  listContainer.innerHTML = '';

  try {
    // Step 1: Get person ID
    const searchUrl = `https://api.themoviedb.org/3/search/person?api_key=${apiKey}&query=${encodeURIComponent(actorName)}`;
    const res = await fetch(searchUrl);
    const data = await res.json();

    if (!data.results.length) {
      listContainer.innerHTML = `<div class='no-results'>No actor found.</div>`;
      return;
    }

    const personId = data.results[0].id;

    // Step 2: Get movie credits
    const creditsUrl = `https://api.themoviedb.org/3/person/${personId}/movie_credits?api_key=${apiKey}`;
    const creditsRes = await fetch(creditsUrl);
    const creditsData = await creditsRes.json();

    if (!creditsData.cast.length) {
      listContainer.innerHTML = `<div class='no-results'>No movies found for this actor.</div>`;
      return;
    }

    displayMovies(creditsData.cast);
  } catch (err) {
    console.error('Actor search error:', err);
    listContainer.innerHTML = `<div class='no-results'>Something went wrong. Try again later.</div>`;
  }
}



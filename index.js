const apikey = "423295d6";
const search = document.querySelector(".search-bar");
const searchTerm = document.querySelector("#search-term");
const starter = document.querySelector(".starter");
const noSuccess = document.querySelector(".no-success");
let myWatchlist = JSON.parse(localStorage.getItem("myWatchlist")) || [];

async function getMovies() {
  const res = await fetch(
    `https://omdbapi.com/?apikey=${apikey}&s=${searchTerm.value}&type=movie`
  );
  const data = await res.json();
  const movieDetails = await Promise.all(data.Search.map(getMovieDetails));
  renderMovies(movieDetails);
}

async function getMovieDetails(movie) {
  const res = await fetch(
    `https://www.omdbapi.com/?apikey=${apikey}&i=${movie.imdbID}`
  );
  const data = await res.json();
  return data;
}

function renderMovies(movieDetails) {
  if (movieDetails) {
    starter.classList.add("hidden");
    noSuccess.classList.add("hidden");
    movieDetails.forEach((movie) => {
      const div = document.createElement("div");
      div.classList.add("movie", "grid");
      div.innerHTML = `
          <img src="${movie.Poster}" class="poster" alt="${movie.Title}" />
              <div class="movie-card">
                <div class="movie-top">
                  <h2 class="title">${movie.Title}</h2>
                  <p>
                    <i class="fa-solid fa-star"></i>
                    <span class="rating">${movie.imdbRating}</span>
                  </p>
                </div>
                <div class="movie-middle">
                  <p><span class="duration">${movie.Runtime}</span> min</p>
                  <p class="genre">${movie.Genre}</p>
                  <button class="add-remove add" data-filmid=${movie.imdbID}>
                    <img src="./img/add_icon.svg" alt="" /> Watchlist
                  </button>
                </div>
                <p class="description">
                  ${movie.Plot}
                </p>
              </div>
          `;
      document.querySelector(".movie-list").appendChild(div);
    });
  } else {
    starter.classList.add("hidden");
    noSuccess.classList.remove("hidden");
    document.querySelector(".movie-list").innerHTML = "";
  }
  searchTerm.value = "";
  addToLocalStorage(movieDetails);
}

function addToLocalStorage(movieDetails) {
  const addBtns = document.querySelectorAll(".add");
  addBtns.forEach((button) => {
    button.addEventListener("click", (e) => {
      myWatchlist.push(e.target.dataset.filmid);
      localStorage.setItem("myWatchlist", JSON.stringify(myWatchlist));
    });
  });
}

search.addEventListener("submit", (e) => {
  e.preventDefault();
  getMovies();
});
